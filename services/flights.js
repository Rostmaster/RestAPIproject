const flightsDAL = require("../dals/flights.js")
const ticketsDal = require("../dals/tickets.js")
const logger = require("../utils/logger.js")

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
            if (!flight.hasOwnProperty(key)) errorMSG = `_${key} is required`
        }
    }

    Object.keys(flight).forEach((key) => {
        console.log("Validator", key, keys.includes(key))
        keys.includes(key) ? null : errorMSG = `_Key ${key} is invalid`
    })

    return {
        message: errorMSG ? errorMSG : 'success',
        result: errorMSG ? false : true
    }
}

const flightsService = {

    getAll: async (req, res) => {
        try {
            console.log(req.query)
            const flights = await flightsDAL.getAll()
            res.status(200).json(flights)
        } catch (error) {
            logger.error(error)
            res.status(500).json({
                status: "error",
                internal: false,
                error: error.message.replaceAll("\"", "'")
            })
        }
    },
    get: async (req, res) => {
        try {
            const flight = await flightsDAL.get(req.params.flightId)
            if (!flight) throw new Error("flight not found")
            res.status(200).json(flight)
        } catch (error) {
            logger.error(`${req.method} to ${req.url} |: ${error.message}`)
            res.status(500).json({
                status: "error",
                internal: false,
                error: error.message.replaceAll("\"", "'")
            })
        }
    },
    add: async (req, res) => {
        try {
            let raw_flight = req.body
            let id = req.params.flightId

            let validationResult = flightValidation(raw_flight)
            console.log("Validation returned obj ", validationResult, id)
            if (validationResult.message !== 'success')
                throw new Error(validationResult.message)

            const flight = await flightsDAL.add(raw_flight)
            logger.info(`Service: flight ${id} added`)
            res.status(200).json(flight)
        } catch (error) {
            logger.error(`${req.method} to ${req.url} |: ${error.message}`)
            if (error.message[0] === '_') {
                res.status(400).json({
                    status: "error",
                    internal: false,
                    error: error.message.replaceAll("\"", "'")
                })
            }
            res.status(500).json({
                status: "error",
                internal: false,
                error: error.message.replaceAll("\"", "'")
            })
        }
    },
    update: async (req, res) => {
        try {
            let raw_flight = req.body
            let id = req.params.flightId

            let validationResult = flightValidation(raw_flight)
            console.log("Validation returned obj ", validationResult, id)
            if (validationResult.message !== 'success')
                throw new Error(validationResult.message)

            const flight = await flightsDAL.update(id, raw_flight)
            logger.info(`Service: flight ${id} updated`)
            res.status(200).json(flight)
        }
        catch (error) {
            logger.error(`${req.method} to ${req.url} |: ${error.message}`)
            if (error.message[0] === '_') {
                logger.error(`${req.method} to ${req.url} |400|: ${error.message}`)
                res.status(400).json({
                    status: "error",
                    internal: false,
                    error: error.message.replaceAll("\"", "'")
                })
            }
            else {
                logger.error(`${req.method} to ${req.url} |500|: ${error.message}`)
                res.status(500).json({
                    status: "error",
                    internal: false,
                    error: error.message.replaceAll("\"", "'")
                })
            }
        }
    },
    patch: async (req, res) => {
        try {
            let raw_flight = req.body
            let id = req.params.flightId

            let validationResult = flightValidation(raw_flight, false)
            console.log("Validation returned obj ", validationResult, id)
            if (validationResult.message !== 'success')
                throw new Error(validationResult.message)

            const flight = await flightsDAL.patch(id, raw_flight)
            logger.info(`Service: flight ${flight.data.id} updated`)
            res.status(200).json(flight)
        }
        catch (error) {
            logger.error(`${req.method} to ${req.url} |: ${error.message}`)
            if (error.message[0] === '_') {
                logger.error(`${req.method} to ${req.url} |400|: ${error.message}`)
                res.status(400).json({
                    status: "error",
                    internal: false,
                    error: error.message.replaceAll("\"", "'")
                })
            }
            else {
                logger.error(`${req.method} to ${req.url} |500|: ${error.message}`)
                res.status(500).json({
                    status: "error",
                    internal: false,
                    error: error.message.replaceAll("\"", "'")
                })
            }
        }
    },
    delete: async (req, res) => {
        try {
            //delete tickets related to this flight
            ticketsDal.deleteTicketsByFlightId(req.params.flightId)

            const flight = await flightsDAL.delete(req.params.flightId)
            logger.info(`Service: flight ${flight.data.id} deleted`)
            res.status(200).json(flight)
        }
        catch (error) {
            logger.error(`${req.method} to ${req.url} |: ${error.message}`)
        }
    },
    createTable: async (req, res) => {
        try {
            const result = await flightsDAL.createTable()
            logger.info(`Service: table flights created`)
            res.status(200).json(result)
        }
        catch (error) {
            logger.error(`${req.method} to ${req.url} |: ${error.message}`)
        }
    },
    dropTable: async (req, res) => {
        try {
            const result = await flightsDAL.dropTable()
            logger.info(`Service: table flights dropped`)
            res.status(200).json(result)
        }
        catch (error) {
            logger.error(`${req.method} to ${req.url} |: ${error.message}`)
        }

    },
    fillTable: async (req, res) => {
        try {
            const result = await flightsDAL.fillTable()
            logger.info(`Service: table flights filled`)
            res.status(200).json(result)
        }
        catch (error) {
            logger.error(`${req.method} to ${req.url} |: ${error.message}`)
        }
    },
}

module.exports = flightsService;