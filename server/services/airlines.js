const DAL = require("../dals/airlines.js")
const logger = require("../utils/logger.js")
const config = require('config');
const url = `http://localhost:${config.server.port}`

const pagePrefix = "/api/airlines"

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

const airlineValidation = (airline, strict = true) => {
    let errorMSG = null
    const keys = [
        "name",
        "country_id",
        "user_id"
    ]

    if (strict) {
        for (let key of keys) {
            if (!airline.hasOwnProperty(key)) errorMSG = `_${key} is required`
        }
    }

    Object.keys(airline).forEach((key) => {
        keys.includes(key) ? null : errorMSG = `_Key ${key} is invalid`
    })

    return {
        message: errorMSG ? errorMSG : 'success',
        result: errorMSG ? false : true
    }
}

const airlinesService = {

    getAll: async (req, res) => {
        try {
            const airlines = await DAL.getAll()
            res.status(200).json(airlines)
        } catch (error) {
            res.status(500).json({
                status: "error",
                internal: false,
                error: error.message.replaceAll("\"", "'")
            })
        }
    },
    get: async (req, res) => {
        try {
            const airline = await DAL.get(req.params.airlineId)
            if (airline.data === undefined) throw new Error(`_airline ${id} not found`)
            res.status(200).json(airline)
        } catch (error) {
            returnError(req, res, error)
        }
    },
    add: async (req, res) => {
        try {
            let raw_airline = req.body

            let validationResult = airlineValidation(raw_airline)
            if (validationResult.message !== 'success')
                throw new Error(validationResult.message)

            const airline = await DAL.add(raw_airline)
            if (airline.status === "error") throw new Error(airline.error)
            const id = airline.data.id

            logger.info(`Airlines service: airline ${id} added`)
            res.status(200).json(airline)

        } catch (error) {
            returnError(req, res, error)
        }
    },
    update: async (req, res) => {
        try {
            let raw_airline = req.body
            delete raw_airline.id
            let id = req.params.airlineId

            let validationResult = airlineValidation(raw_airline)
            if (validationResult.message !== 'success')
                throw new Error(validationResult.message)

            await DAL.update(id, raw_airline)
            const airline = await DAL.get(id)
            if (airline.data === undefined) throw new Error(`_airline ${id} not found`)
            logger.info(`Airlines service: airline ${airline.data.id} updated`)
            res.status(200).json(airline)
        }
        catch (error) {
            returnError(req, res, error)
        }
    },
    patch: async (req, res) => {
        try {
            let raw_airline = req.body
            delete raw_airline.id
            let id = req.params.airlineId

            let validationResult = airlineValidation(raw_airline, false)
            if (validationResult.message !== 'success')
                throw new Error(validationResult.message)

            await DAL.patch(id, raw_airline)
            const airline = await DAL.get(id)
            if (airline.data === undefined) throw new Error(`_airline ${id} not found`)
            logger.info(`Airlines service: airline ${airline.data.id} updated`)
            res.status(200).json(airline)
        }
        catch (error) {
            returnError(req, res, error)
        }
    },
    delete: async (req, res) => {
        try {
            //delete flights related to this airline if they exist
            let flightsByAirline =
                await fetch(`${url}/api/flights/by_airline/${req.params.airlineId}`)
            flightsByAirline = await flightsByAirline.json()
            if (flightsByAirline.status !== 'success') {
                throw new Error(`_tickets by flight id ${req.params.airlineId} were not received ${flightsByAirline}`)
            }
            for (const flight of flightsByAirline.data) {
                await fetch(`${url}/api/flights/${flight.id}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
            }

            //TODO add verification that flights are deleted

            const airline = await DAL.delete(req.params.airlineId)
            if (airline.data === undefined) throw new Error(`_airline ${req.params.airlineId} not found`)
            if (airline.status === "error") throw new Error(airline.error)
            logger.info(`Airlines service: airline ${req.params.airlineId} deleted`)
            res.status(200).json(airline)
        }
        catch (error) {
            returnError(req, res, error)
        }
    },

    getAirlinesByUserId: async (req, res) => {
        try {
            const airlines = await DAL.getAirlinesByUserId(req.params.userId)
            logger.debug(`Airlines service: airlines by user ${req.params.userId} received`)
            res.status(200).json(airlines)
        } catch (error) {
            returnError(req, res, error)
        }
    },
    getAirlinesByCountryId: async (req, res) => {
        try {
            const airlines = await DAL.getAirlinesByCountryId(req.params.countryId)
            logger.debug(`Airlines service: airlines by country ${req.params.countryId} received`)
            res.status(200).json(airlines)
        } catch (error) {
            returnError(req, res, error)
        }
    },

    createTable: async (req, res) => {
        try {
            const result = await DAL.createTable()
            logger.info(`Airlines service: table airlines created`)
            res.status(200).json(result)
        }
        catch (error) {
            returnError(req, res, error)
        }
    },
    dropTable: async (req, res) => {
        try {
            const result = await DAL.dropTable()
            logger.info(`Airlines service: table airlines dropped`)
            res.status(200).json(result)
        }
        catch (error) {
            returnError(req, res, error)
        }

    },
    fillTable: async (req, res) => {
        try {
            const result = await DAL.fillTable()
            logger.info(`Airlines service: table airlines filled`)
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

module.exports = airlinesService;