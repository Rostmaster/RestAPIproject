const logger = require("../utils/logger.js")
const airlinesDal = require("../dals/airlines.js")
const countriesDal = require("../dals/countries.js")
const customersDal = require("../dals/customers.js")
const flightsDal = require("../dals/flights.js")
const ticketsDal = require("../dals/tickets.js")
const usersDal = require("../dals/users.js")
const cookieService = require("./cookies.js")
const pagePrefix = "/api/services"

const returnError = (req, res, error) => {
    if (error.message[0] === '_') {
        logger.error(`${req.method} to ...${pagePrefix}${req.url} |400|: ${error.message}`)
        res.status(400).json({
            status: "error",
            internal: false,
            error: error.message.replaceAll("\"", "'")
        })
    }
    else {
        logger.error(`${req.method} to ...${pagePrefix}${req.url} |500|: ${error.message}`)
        res.status(500).json({
            status: "error",
            internal: false,
            error: error.message.replaceAll("\"", "'")
        })
    }
}

const globalServices = {

    //? Complex CRUD operations
    getCustomerFlights: async (req, res) => {
        try {

            let userID = req.cookies.auth.split(',')[0]
            let customerId = (await customersDal.getCustomersByUserId(userID)).data[0].id
            let tickets = await ticketsDal.getTicketsByUser(customerId)
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
            res.status(200).json({
                status: "success",
                internal: true,
                data: result
            })
        }
        catch (error) {
            returnError(req, res, error)
        }
    },
    getChosenCustomerFlights: async (req, res) => {
        try {

            let userID = req.params.customerId
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
            res.status(200).json({
                status: "success",
                internal: true,
                data: result
            })
        }
        catch (error) {
            returnError(req, res, error)
        }
    },
    getActiveFlights: async (req, res) => {
        try {
            let flights = await flightsDal.getAll()
            let flightsWithCountries = await countriesDal.getCountriesByFlights(flights.data)
            let flightsWithAirlines = await airlinesDal.getAirlinesByFlights(flightsWithCountries.data)
            let result = flightsWithAirlines.data

            for (flight of result) {
                delete flight.origin_country_id
                delete flight.destination_country_id
                flight.landing_time = new Date(flight.landing_time).toLocaleString()
                flight.departure_time = new Date(flight.departure_time).toLocaleString()
            }
            res.status(200).json({
                status: "success",
                internal: true,
                data: result
            })
        }
        catch (error) {
            returnError(req, res, error)
        }
    },

    //? Actions
    buyTicket: async (req, res) => {
        try {
            let customer_id = req.body.customer_id
            let flight_id = req.body.flight_id
            let ticket = await ticketsDal.add({ flight_id, customer_id })
            let flight = await flightsDal.get(flight_id)
            flight = flight.data
            flight.remaining_tickets = flight.remaining_tickets - 1
            await flightsDal.update(flight.id, flight)
            logger.info(`Customer ${customer_id} bought ticket ${ticket.data.id} for flight ${flight_id}`)
            res.status(200).json(ticket)
        }
        catch (error) {
            returnError(req, res, error)
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
            returnError(req, res, error)
        }
    },
    deleteFlight: async (req, res) => {
        try {
            let flight_id = req.body.flight_id

            let flight = await flightsDal.get(flight_id)
            flightsDal.delete(flight_id)

            res.status(200).json(flight)
        }
        catch (error) {
            returnError(req, res, error)
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
            returnError(req, res, error)
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
            returnError(req, res, error)
        }
    },
    getCurrentUserInfo: async (req, res) => {
        try {
            let userID = req.cookies.auth.split(',')[0]
            let user = (await usersDal.get(userID)).data
            let role_id = user.role_id
            let result = { user }
            if (role_id === 1) {
                let customers = await customersDal.getAll()
                customers = customers.data
                let airlines = await airlinesDal.getAll()
                airlines = airlines.data
                result = { ...result, customers, airlines }
            }
            else if (role_id === 2) {
                let airline = await airlinesDal.getAirlinesByUserId(user.id)
                airline = airline.data[0]
                result = { ...result, airline }
            }
            else if (role_id === 3) {
                let customer = await customersDal.getCustomersByUserId(userID)
                customer = customer.data[0]
                result = { ...result, customer }
            }
            res.status(200).json({
                status: "success",
                internal: true,
                data: result
            })

        }
        catch (error) {
            returnError(req, res, error)
        }
    },

    //? Errors
    error: (req, res) => {
        res.status(400).json({
            status: "error",
            internal: false,
            error: "Bad Request"
        })
    }

}

module.exports = globalServices;