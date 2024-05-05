const DAL = require("../dals/flights.js")
const logger = require("../utils/logger.js")

const pagePrefix = "/api/flights"

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

const flightValidation = (flight, strict = true) => {
    let errorMSG = null
    const keys = [
        'airline_id',
        'origin_country_id',
        'destination_country_id',
        'departure_time',
        'landing_time',
        'remaining_tickets'
    ]

    if (strict) {
        for (let key of keys) {
            if (!key in flight) errorMSG = `_${key} is required`
        }
    }

    Object.keys(flight).forEach((key) => {
        keys.includes(key) ? null : errorMSG = `_Key ${key} is invalid`
    })

    return {
        message: errorMSG ? errorMSG : 'success',
        result: errorMSG ? false : true
    }
}

const flightsService = {

    //? Flights CRUD
    getAll: async (req, res) => {
        try {
            const flights = await DAL.getAll()
            res.status(200).json(flights)
        } catch (error) {
            returnError(req, res, error)
        }
    },
    get: async (req, res) => {
        try {
            const flight = await DAL.get(req.params.flightId)
            if (flight.data === undefined) throw new Error(`_flight ${id} not found`)
            res.status(200).json(flight)
        } catch (error) {
            returnError(req, res, error)
        }
    },
    add: async (req, res) => {
        try {
            let raw_flight = req.body

            let validationResult = flightValidation(raw_flight)
            if (validationResult.message !== 'success')
                throw new Error(validationResult.message)

            const flight = await DAL.add(raw_flight)
            if (flight.status === "error") throw new Error(flight.error)
            const id = flight.data.id

            logger.info(`Flights service: flight ${id} added`)
            res.status(200).json(flight)
        } catch (error) {
            returnError(req, res, error)
        }
    },
    update: async (req, res) => {
        try {
            let raw_flight = req.body
            delete raw_flight.id
            let id = req.params.flightId

            let validationResult = flightValidation(raw_flight)
            if (validationResult.message !== 'success')
                throw new Error(validationResult.message)

            await DAL.update(id, raw_flight)
            const flight = await DAL.get(id)
            if (flight.data === undefined) throw new Error(`_flight ${id} not found`)
            logger.info(`Flights service: flight ${id} updated`)
            res.status(200).json(flight)
        }
        catch (error) {
            returnError(req, res, error)
        }
    },
    patch: async (req, res) => {
        try {
            let raw_flight = req.body
            delete raw_flight.id
            let id = req.params.flightId

            let validationResult = flightValidation(raw_flight, false)
            if (validationResult.message !== 'success')
                throw new Error(validationResult.message)

            await DAL.patch(id, raw_flight)
            const flight = await DAL.get(id)
            if (flight.data === undefined) throw new Error(`_flight ${id} not found`)
            logger.info(`Flights service: flight ${flight.data.id} updated`)
            res.status(200).json(flight)
        }
        catch (error) {
            returnError(req, res, error)
        }
    },
    delete: async (req, res) => {
        try {
            //delete tickets related to this flight if they exist
            let ticketsByFlight =
                await fetch(`http://localhost:3000/api/tickets/by_flight/${req.params.flightId}`)
            ticketsByFlight = await ticketsByFlight.json()
            if (ticketsByFlight.status !== 'success') {
                throw new Error(`_tickets by flight id ${req.params.flightId} were not received ${ticketsByFlight}`)
            }
            for (const ticket of ticketsByFlight.data) {
                await fetch(`http://localhost:3000/api/tickets/${ticket.id}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
            }

            //TODO add verification that tickets are deleted

            const flight = await DAL.delete(req.params.flightId)
            if (flight.data === undefined) throw new Error(`_flight ${req.params.flightId} not found`)
            if (flight.status === "error") throw new Error(flight.error)
            logger.info(`Flights service: flight ${flight.data.id} deleted`)
            res.status(200).json(flight)
        }
        catch (error) {
            returnError(req, res, error)
        }
    },

    //? Flights Custom CRUD Actions
    getFlightsByOriginCountryId: async (req, res) => {
        try {
            const flights = await DAL.getFlightsByOriginCountryId(req.params.originCountryId)
            logger.debug(`Flights service: flights by origin country id ${req.params.originCountryId} received`)
            res.status(200).json(flights)
        } catch (error) {
            returnError(req, res, error)
        }
    },
    getFlightsByDestinationCountryId: async (req, res) => {
        try {
            const flights = await DAL.getFlightsByDestinationCountryId(req.params.destinationCountryId)
            logger.debug(`Flights service: flights by destination country id ${req.params.destinationCountryId} received`)
            res.status(200).json(flights)
        } catch (error) {
            returnError(req, res, error)
        }
    },
    getFlightsByAirlineId: async (req, res) => {
        try {
            const flights = await DAL.getFlightsByAirlineId(req.params.airlineId)
            logger.debug(`Flights service: flights by airline id ${req.params.airlineId} received`)
            res.status(200).json(flights)
        } catch (error) {
            returnError(req, res, error)
        }
    },

    //? Flights Table
    createTable: async (req, res) => {
        try {
            const result = await DAL.createTable()
            logger.info(`Flights service: table flights created`)
            res.status(200).json(result)
        }
        catch (error) {
            returnError(req, res, error)
        }
    },
    dropTable: async (req, res) => {
        try {
            const result = await DAL.dropTable()
            logger.info(`Flights service: table flights dropped`)
            res.status(200).json(result)
        }
        catch (error) {
            returnError(req, res, error)
        }

    },
    fillTable: async (req, res) => {
        try {
            const result = await DAL.fillTable()
            logger.info(`Flights service: table flights filled`)
            res.status(200).json(result)
        }
        catch (error) {
            returnError(req, res, error)
        }
    },
    error: (req, res) => {
        res.status(400).json({
            status: "error",
            internal: false,
            error: "Bad Request"
        })
    }
}

module.exports = flightsService;