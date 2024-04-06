const DAL = require("../dals/countries.js")
const logger = require("../utils/logger.js")

const countryValidation = (country, strict = true) => {
    let errorMSG = null
    const keys = [
        "name",
    ]

    if (strict) {
        for (let key of keys) {
            if (!country.hasOwnProperty(key)) errorMSG = `_${key} is required`
        }
    }

    Object.keys(country).forEach((key) => {
        console.log("Validator", key, keys.includes(key))
        keys.includes(key) ? null : errorMSG = `_Key ${key} is invalid`
    })
    return {
        message: errorMSG ? errorMSG : 'success',
        result: errorMSG ? false : true
    }
}

const countriesService = {

    getAll: async (req, res) => {
        try {
            console.log(req.query)
            const countries = await DAL.getAll()
            res.status(200).json(countries)
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
            const country = await DAL.get(req.params.countryId)
            if (!country) throw new Error("country not found")
            res.status(200).json(country)
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
            let raw_country = req.body
            let id = req.params.countryId

            let validationResult = countryValidation(raw_country)
            console.log("Validation returned obj ", validationResult, id)
            if (validationResult.message !== 'success')
                throw  new Error(validationResult.message)

            const country = await DAL.add(raw_country)

            logger.info(`Service: country ${id} added`)
            res.status(200).json(country)
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
            let raw_country = req.body
            let id = req.params.countryId

            let validationResult = countryValidation(raw_country)
            console.log("Validation returned obj ", validationResult, id)
            if (validationResult.message !== 'success')
                throw new Error(validationResult.message)

            const country = await DAL.update(id, raw_country)
            logger.info(`Service: country ${country.data.id} updated`)
            res.status(200).json(country)
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
    // patch: async (req, res) => {
    //     try {
    //         let raw_country = req.body
    //         let id = req.params.countryId

    //         let validationResult = countryValidation(raw_country, false)
    //         console.log("Validation returned obj ", validationResult, id)
    //         if (validationResult.message !== 'success')
    //             throw new Error(validationResult.message)

    //         const country = await DAL.patch(id, raw_country)
    //         logger.info(`Service: country ${country.data.id} updated`)
    //         res.status(200).json(country)
    //     }
    //     catch (error) {
    //         logger.error(`${req.method} to ${req.url} |: ${error.message}`)
    //         if (error.message[0] === '_') {
    //             logger.error(`${req.method} to ${req.url} |400|: ${error.message}`)
    //             res.status(400).json({
    //                 status: "error",
    //                 internal: false,
    //                 error: error.message.replaceAll("\"", "'")
    //             })
    //         }
    //         else {
    //             logger.error(`${req.method} to ${req.url} |500|: ${error.message}`)
    //             res.status(500).json({
    //                 status: "error",
    //                 internal: false,
    //                 error: error.message.replaceAll("\"", "'")
    //             })
    //         }
    //     }
    // },
    delete: async (req, res) => {
        try {
            const country = await DAL.delete(req.params.countryId)
            logger.info(`Service: country ${country.data.id} deleted`)
            res.status(200).json(country)
        }
        catch (error) {
            logger.error(`${req.method} to ${req.url} |: ${error.message}`)
        }
    },
    createTable: async (req, res) => {
        try {
            const result = await DAL.createTable()
            logger.info(`Service: table countries created`)
            res.status(200).json(result)
        }
        catch (error) {
            logger.error(`${req.method} to ${req.url} |: ${error.message}`)
        }
    },
    dropTable: async (req, res) => {
        try {
            const result = await DAL.dropTable()
            logger.info(`Service: table countries dropped`)
            res.status(200).json(result)
        }
        catch (error) {
            logger.error(`${req.method} to ${req.url} |: ${error.message}`)
        }

    },
    fillTable: async (req, res) => {
        try {
            const result = await DAL.fillTable()
            logger.info(`Service: table countries filled`)
            res.status(200).json(result)
        }
        catch (error) {
            logger.error(`${req.method} to ${req.url} |: ${error.message}`)
        }
    },
}

module.exports = countriesService;