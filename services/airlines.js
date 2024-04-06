const DAL = require("../dals/airlines.js")
const logger = require("../utils/logger.js")

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
        console.log("Validator", key, keys.includes(key))
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
            console.log(req.query)
            const airlines = await DAL.getAll()
            res.status(200).json(airlines)
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
            const airline = await DAL.get(req.params.airlineId)
            if (!airline) throw new Error("airline not found")
            res.status(200).json(airline)
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
            let raw_airline = req.body
            let id = req.params.airlineId

            let validationResult = airlineValidation(raw_airline)
            console.log("Validation returned obj ", validationResult, id)
            if (validationResult.message !== 'success')
                throw new Error(validationResult.message)

            const airline = await DAL.add(raw_airline)
            logger.info(`Service: airline ${id} added`)
            res.status(200).json(airline)
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
            let raw_airline = req.body
            let id = req.params.airlineId

            let validationResult = airlineValidation(raw_airline)
            console.log("Validation returned obj ", validationResult, id)
            if (validationResult.message !== 'success')
                throw new Error(validationResult.message)

            const airline = await DAL.update(id, raw_airline)
            logger.info(`Service: airline ${airline.data.id} updated`)
            res.status(200).json(airline)
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
            let raw_airline = req.body
            let id = req.params.airlineId

            let validationResult = airlineValidation(raw_airline, false)
            console.log("Validation returned obj ", validationResult, id)
            if (validationResult.message !== 'success')
                throw new Error(validationResult.message)

            const airline = await DAL.patch(id, raw_airline)
            logger.info(`Service: airline ${airline.data.id} updated`)
            res.status(200).json(airline)
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
            const airline = await DAL.delete(req.params.airlineId)
            logger.info(`Service: airline ${airline.data.id} deleted`)
            res.status(200).json(airline)
        }
        catch (error) {
            logger.error(`${req.method} to ${req.url} |: ${error.message}`)
        }
    },
    createTable: async (req, res) => {
        try {
            const result = await DAL.createTable()
            logger.info(`Service: table airlines created`)
            res.status(200).json(result)
        }
        catch (error) {
            logger.error(`${req.method} to ${req.url} |: ${error.message}`)
        }
    },
    dropTable: async (req, res) => {
        try {
            const result = await DAL.dropTable()
            logger.info(`Service: table airlines dropped`)
            res.status(200).json(result)
        }
        catch (error) {
            logger.error(`${req.method} to ${req.url} |: ${error.message}`)
        }

    },
    fillTable: async (req, res) => {
        try {
            const result = await DAL.fillTable()
            logger.info(`Service: table airlines filled`)
            res.status(200).json(result)
        }
        catch (error) {
            logger.error(`${req.method} to ${req.url} |: ${error.message}`)
        }
    },
}

module.exports = airlinesService;