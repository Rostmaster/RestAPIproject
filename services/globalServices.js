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
            let tickets = await ticketsDal.getAll()
            let flights = await flightsDal.getFlightsByTickets(tickets.data)
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
    getCurrentUser: async (req, res) => {//TODO
        let user = 1
        //read auth cookie 
        //get from db
        res.status(200).json({ user: user })
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