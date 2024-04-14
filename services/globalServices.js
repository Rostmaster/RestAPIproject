const logger = require("../utils/logger.js")

const airlinesDal = require("../dals/airlines.js")
const countriesDal = require("../dals/countries.js")
const customersDal = require("../dals/customers.js")
const flightsDal = require("../dals/flights.js")
const ticketsDal = require("../dals/tickets.js")
const usersDal = require("../dals/users.js")


const globalServices = {

    getCustomerFlights: async (req, res, userID) => {
       try{
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
            }
            res.status(200).json({ data: result })
            return
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
        console.log('get active flights')
        //get all flights
        //filter by active
        //filter the amount
        //get countries
        //get airlines
        return 'result'
    },
    getCurrentUser: async (req, res) => {
        let user = 1
        //read auth cookie 
        //get from db
        res.status(200).json({ user: user })
    }
}

module.exports = globalServices;