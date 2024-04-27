const logger = require("../utils/logger.js")

const airlinesDal = require("../dals/airlines.js")
const countriesDal = require("../dals/countries.js")
const customersDal = require("../dals/customers.js")
const flightsDal = require("../dals/flights.js")
const ticketsDal = require("../dals/tickets.js")
const usersDal = require("../dals/users.js")

const cookieService = require("./cookies.js")

const globalServices = {

    //?Complex CRUD operations
    getCustomerFlights: async (req, res) => {
        try {
            let userID = await req.user.id
            let tickets = await ticketsDal.getTicketsByUser(userID)
            let flights = await flightsDal.getFlightsByTickets(tickets.data)
            let flightsWithCountries = await countriesDal.getCountriesByFlights(flights.data)
            let flightsWithAirlines = await airlinesDal.getAirlinesByFlights(flightsWithCountries.data)
            let result = flightsWithAirlines.data

            for (flight of result) {
                delete flight.airline_id
                delete flight.origin_country_id
                delete flight.destination_country_id
                delete flight.remaining_tickets
                flight.landing_time = new Date(flight.landing_time).toLocaleString()
                flight.departure_time = new Date(flight.departure_time).toLocaleString()
            }
            return {
                status: "success",
                internal: true,
                data: result
            }
        }
        catch (error) {
            logger.error(`${req.method} to ${req.url} |: ${error.message}`)
            res.status(400).json({
                status: "error",
                internal: false,
                error: error.message.replaceAll("\"", "'")
            })
        }
    },
    getActiveFlights: async (req, res) => {
        try {
            let flights = await flightsDal.getAll()
            let flightsWithCountries = await countriesDal.getCountriesByFlights(flights.data)
            let flightsWithAirlines = await airlinesDal.getAirlinesByFlights(flightsWithCountries.data)
            let result = flightsWithAirlines.data

            for (flight of result) {
                delete flight.airline_id
                delete flight.origin_country_id
                delete flight.destination_country_id
                flight.landing_time = new Date(flight.landing_time).toLocaleString()
                flight.departure_time = new Date(flight.departure_time).toLocaleString()
            }
            return {
                status: "success",
                internal: true,
                data: result
            }
        }
        catch (error) {
            logger.error(`${req.method} to ${req.url} |: ${error.message}`)
            res.status(400).json({
                status: "error",
                internal: false,
                error: error.message.replaceAll("\"", "'")
            })
        }
    },
    getCurrentUser: async (req, res) => {
        const userID = req.cookies.auth.split(',')[0]
        console.log("UserID from get current user", userID)
        res.status(200).json({ id: userID })
    },
    getCurrentCustomer: async (req, res) => {//TODO
    },
    buyTicket: async (req, res) => {
        try {
            console.log('==============hello there from buy ticket ==============')
            let customer_id = req.body.customer_id
            let flight_id = req.body.flight_id
            let ticket = await ticketsDal.add({ flight_id, customer_id })
            let flight = await flightsDal.get(flight_id)
            flight = flight.data
            flight.remaining_tickets = flight.remaining_tickets - 1
            await flightsDal.update(flight.id, flight)

            res.status(200).json(ticket)
        }
        catch (error) {
            logger.error(`${req.method} to ${req.url} |: ${error.message}`)
            res.status(400).json({
                status: "error",
                internal: false,
                error: error.message.replaceAll("\"", "'")
            })
        }
    },
    cancelTicket: async (req, res) => {
        try {
            let ticket_id = req.body.ticket_id

            let ticket = await ticketsDal.get(ticket_id)
            ticketsDal.delete(ticket_id)

            let flight = await flightsDal.get(ticket.data.flight_id)
            flight = flight.data
            flight.remaining_tickets = flight.remaining_tickets + 1
            await flightsDal.update(flight.id, flight)

            res.status(200).json(ticket)
        }
        catch (error) {
            logger.error(`${req.method} to ${req.url} |: ${error.message}`)
            res.status(400).json({
                status: "error",
                internal: false,
                error: error.message.replaceAll("\"", "'")
            })
        }
    },
    deleteAllTables: async (req, res) => {
        try {
            await ticketsDal.dropTable()
            await flightsDal.dropTable()
            await customersDal.dropTable()
            await airlinesDal.dropTable()
            await countriesDal.dropTable()
            await usersDal.dropTable()
            res.status(200).json({
                status: "success",
                internal: true,
                data: { message: "All tables dropped" }
            })
        }
        catch (error) {
            logger.error(`${req.method} to ${req.url} |: ${error.message}`)
            res.status(400).json({
                status: "error",
                internal: false,
                error: error.message.replaceAll("\"", "'")
            })
        }
    },
    initDatabase: async (req, res) => {
        try {
            await countriesDal.createTable()
            await usersDal.createTable()
            await airlinesDal.createTable()
            await flightsDal.createTable()
            await customersDal.createTable()
            await ticketsDal.createTable()

            await countriesDal.fillTable()
            await usersDal.fillTable()
            await airlinesDal.fillTable()
            await flightsDal.fillTable()
            await customersDal.fillTable()
            await ticketsDal.fillTable()

            res.status(200).json({
                status: "success",
                internal: true,
                data: { message: "All tables created" }
            })
        }
        catch (error) {
            logger.error(`${req.method} to ${req.url} |: ${error.message}`)
            res.status(400).json({
                status: "error",
                internal: false,
                error: error.message.replaceAll("\"", "'")
            })
        }
    },

}

module.exports = globalServices;