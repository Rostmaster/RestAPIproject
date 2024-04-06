const DAL = require("../dals/customers.js")
const logger = require("../utils/logger.js")

const customerValidation = (customer, strict = true) => {
    let errorMSG = null
    const keys = [
        "first_name",
        "last_name",
        "address",
        "phone_number",
        "credit_card",
        "user_id"
    ]

    if (strict) {
        for (let key of keys) {
            if (!customer.hasOwnProperty(key)) errorMSG = `_${key} is required`
        }
    }

    Object.keys(customer).forEach((key) => {
        console.log("Validator", key, keys.includes(key))
        keys.includes(key) ? null : errorMSG = `_Key ${key} is invalid`
    })

    return {
        message: errorMSG ? errorMSG : 'success',
        result: errorMSG ? false : true
    }
}

const customersService = {

    getAll: async (req, res) => {
        try {
            console.log(req.query)
            const customers = await DAL.getAll()
            res.status(200).json(customers)
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
            const customer = await DAL.get(req.params.customerId)
            if (!customer) throw new Error("customer not found")
            res.status(200).json(customer)
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
            let raw_customer = req.body
            let id = req.params.customerId

            let validationResult = customerValidation(raw_customer)
            console.log("Validation returned obj ", validationResult, id)
            if (validationResult.message !== 'success')
                throw new Error(validationResult.message)

            const customer = await DAL.add(raw_customer)
            logger.info(`Service: customer ${id} added`)
            res.status(200).json(customer)
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
            let raw_customer = req.body
            let id = req.params.customerId

            let validationResult = customerValidation(raw_customer)
            console.log("Validation returned obj ", validationResult, id)
            if (validationResult.message !== 'success')
                throw new Error(validationResult.message)

            const customer = await DAL.update(id, raw_customer)
            logger.info(`Service: customer ${customer.data.id} updated`)
            res.status(200).json(customer)
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
            let raw_customer = req.body
            let id = req.params.customerId

            let validationResult = customerValidation(raw_customer, false)
            console.log("Validation returned obj ", validationResult, id)
            if (validationResult.message !== 'success')
                throw new Error(validationResult.message)

            const customer = await DAL.patch(id, raw_customer)
            logger.info(`Service: customer ${customer.data.id} updated`)
            res.status(200).json(customer)
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
            const customer = await DAL.delete(req.params.customerId)
            logger.info(`Service: customer ${customer.data.id} deleted`)
            res.status(200).json(customer)
        }
        catch (error) {
            logger.error(`${req.method} to ${req.url} |: ${error.message}`)
        }
    },
    createTable: async (req, res) => {
        try {
            const result = await DAL.createTable()
            logger.info(`Service: table customers created`)
            res.status(200).json(result)
        }
        catch (error) {
            logger.error(`${req.method} to ${req.url} |: ${error.message}`)
        }
    },
    dropTable: async (req, res) => {
        try {
            const result = await DAL.dropTable()
            logger.info(`Service: table customers dropped`)
            res.status(200).json(result)
        }
        catch (error) {
            logger.error(`${req.method} to ${req.url} |: ${error.message}`)
        }

    },
    fillTable: async (req, res) => {
        try {
            const result = await DAL.fillTable()
            logger.info(`Service: table customers filled`)
            res.status(200).json(result)
        }
        catch (error) {
            logger.error(`${req.method} to ${req.url} |: ${error.message}`)
        }
    },
}

module.exports = customersService;