const DAL = require("../dals/tickets.js")
const logger = require("../utils/logger.js")

const ticketValidation = (ticket, strict = true) => {
    let errorMSG = null
    const keys = ['flight_id', 'customer_id']

    if (strict) {
        for (let key of keys) {
            if (!ticket.hasOwnProperty(key)) errorMSG = `_${key} is required`
        }
    }

    Object.keys(ticket).forEach((key) => {
        console.log("Validator", key, keys.includes(key))
        keys.includes(key) ? null : errorMSG = `_Key ${key} is invalid`
    })

    return {
        message: errorMSG ? errorMSG : 'success',
        result: errorMSG ? false : true
    }
}

const ticketService = {

    getAll: async (req, res) => {
        try {
            console.log(req.query)
            const tickets = await DAL.getAll()
            res.status(200).json(tickets)
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
            const ticket = await DAL.get(req.params.ticketId)
            if (!ticket) throw new Error("ticket not found")
            res.status(200).json(ticket)
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
            let raw_ticket = req.body
            let id = req.params.ticketId

            let validationResult = ticketValidation(raw_ticket)
            console.log("Ticket validation returned obj ", validationResult, id)
            if (validationResult.message !== 'success')
                throw new Error(validationResult.message)

            const ticket = await DAL.add(raw_ticket)
            logger.info(`Service: ticket ${id} added`)
            res.status(200).json(ticket)
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
            let raw_ticket = req.body
            let id = req.params.ticketId

            let validationResult = ticketValidation(raw_ticket)
            console.log("Validation returned obj ", validationResult, id)
            if (validationResult.message !== 'success')
                throw new Error(validationResult.message)

            const ticket = await DAL.update(id, raw_ticket)
            logger.info(`Service: ticket ${ticket.data.id} updated`)
            res.status(200).json(ticket)
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
            let raw_ticket = req.body
            let id = req.params.ticketId

            let validationResult = ticketValidation(raw_ticket, false)
            console.log("Validation returned obj ", validationResult, id)
            if (validationResult.message !== 'success')
                throw new Error(validationResult.message)

            const ticket = await DAL.patch(id, raw_ticket)
            logger.info(`Service: ticket ${ticket.data.id} updated`)
            res.status(200).json(ticket)
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
            const ticket = await DAL.delete(req.params.ticketId)
            logger.info(`Service: ticket ${ticket.data.id} deleted`)
            res.status(200).json(ticket)
        }
        catch (error) {
            logger.error(`${req.method} to ${req.url} |: ${error.message}`)
        }
    },
    createTable: async (req, res) => {
        try {
            const result = await DAL.createTable()
            logger.info(`Service: table tickets created`)
            res.status(200).json(result)
        }
        catch (error) {
            logger.error(`${req.method} to ${req.url} |: ${error.message}`)
        }
    },
    dropTable: async (req, res) => {
        try {
            const reuslt = await DAL.dropTable()
            logger.info(`Service: table tickets dropped`)
            res.status(200).json(reuslt)
        }
        catch (error) {
            logger.error(`${req.method} to ${req.url} |: ${error.message}`)
        }

    },
    fillTable: async (req, res) => {
        try {
            const result = await DAL.fillTable()
            logger.info(`Service: table tickets filled`)
            res.status(200).json(result)
        }
        catch (error) {
            logger.error(`${req.method} to ${req.url} |: ${error.message}`)
        }
    },
}

module.exports = ticketService;