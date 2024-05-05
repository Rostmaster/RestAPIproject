const DAL = require("../dals/customers.js")
const logger = require("../utils/logger.js")

const pagePrefix = "/api/customers"

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
        keys.includes(key) ? null : errorMSG = `_Key ${key} is invalid`
    })

    return {
        message: errorMSG ? errorMSG : 'success',
        result: errorMSG ? false : true
    }
}

const customersService = {

    //? Customers CRUD
    getAll: async (req, res) => {
        try {
            const customers = await DAL.getAll()
            res.status(200).json(customers)
        } catch (error) {
            returnError(req, res, error)
        }
    },
    get: async (req, res) => {
        try {
            const customer = await DAL.get(req.params.customerId)
            if (customer.data === undefined) throw new Error(`_customer ${id} not found`)
            res.status(200).json(customer)
        } catch (error) {
            returnError(req, res, error)
        }
    },
    add: async (req, res) => {
        try {
            let raw_customer = req.body

            let validationResult = customerValidation(raw_customer)
            if (validationResult.message !== 'success')
                throw new Error(validationResult.message)

            const customer = await DAL.add(raw_customer)
            if (customer.status === "error") throw new Error(customer.error)
            const id = customer.data.id

            logger.info(`Customer service: customer ${id} added`)
            res.status(200).json(customer)
        } catch (error) {
            returnError(req, res, error)
        }
    },
    update: async (req, res) => {
        try {
            let raw_customer = req.body
            delete raw_customer.id
            let id = req.params.customerId

            let validationResult = customerValidation(raw_customer)
            if (validationResult.message !== 'success')
                throw new Error(validationResult.message)

            await DAL.update(id, raw_customer)
            const customer = await DAL.get(req.params.customerId)
            if (customer.data === undefined) throw new Error(`_customer ${id} not found`)
            logger.info(`Customer service: customer ${customer.data.id} updated`)
            res.status(200).json(customer)
        }
        catch (error) {
            returnError(req, res, error)
        }
    },
    patch: async (req, res) => {
        try {
            let raw_customer = req.body
            delete raw_customer.id
            let id = req.params.customerId

            let validationResult = customerValidation(raw_customer, false)
            if (validationResult.message !== 'success')
                throw new Error(validationResult.message)

            await DAL.patch(id, raw_customer)
            const customer = await DAL.get(req.params.customerId)
            if (customer.data === undefined) throw new Error(`_customer ${id} not found`)
            logger.info(`Customer service: customer ${customer.data.id} updated`)
            res.status(200).json(customer)
        }
        catch (error) {
            returnError(req, res, error)
        }
    },
    delete: async (req, res) => {
        try {
            //delete tickets related to this customer if they exist
                let ticketsByCustomer =
                    await fetch(`http://localhost:3000/api/tickets/by_customer/${req.params.customerId}`)
                ticketsByCustomer = await ticketsByCustomer.json()
                if (ticketsByCustomer.status !== 'success') {
                    throw new Error(`_tickets by customer id ${req.params.customerId} were not received ${ticketsByCustomer}`)
                }
                for (const ticket of ticketsByCustomer.data) {
                    await fetch(`http://localhost:3000/api/tickets/${ticket.id}`, {
                        method: 'DELETE',
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    })
                }
            //TODO add verification that tickets are deleted

            const customer = await DAL.delete(req.params.customerId)
            if (customer.data === undefined) throw new Error(`_customer ${req.params.customerId} not found`)
            if (customer.status === "error") throw new Error(customer.error)
            logger.info(`Customer service: customer ${customer.data.id} deleted`)
            res.status(200).json(customer)
        }
        catch (error) {
            returnError(req, res, error)
        }
    },

    //? Customers Custom CRUD Actions
    getCustomersByUserId: async (req, res) => {
        try {
            const customers = await DAL.getCustomersByUserId(req.params.userId)
            logger.debug(`Customer service: customers by user id ${req.params.userId} received`)
            res.status(200).json(customers)
        }
        catch (error) {
            returnError(req, res, error)
        }
    },

    //? Customers Table
    createTable: async (req, res) => {
        try {
            const result = await DAL.createTable()
            logger.info(`Customer service: table customers created`)
            res.status(200).json(result)
        }
        catch (error) {
            returnError(req, res, error)
        }
    },
    dropTable: async (req, res) => {
        try {
            const result = await DAL.dropTable()
            logger.info(`Customer service: table customers dropped`)
            res.status(200).json(result)
        }
        catch (error) {
            returnError(req, res, error)
        }

    },
    fillTable: async (req, res) => {
        try {
            const result = await DAL.fillTable()
            logger.info(`Customer service: table customers filled`)
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

module.exports = customersService;