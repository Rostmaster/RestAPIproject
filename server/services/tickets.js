const DAL = require("../dals/tickets.js")
const logger = require("../utils/logger.js")

const pagePrefix = "/api/tickets"

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

const ticketValidation = (ticket, strict = true) => {
    let errorMSG = null
    const keys = ['flight_id', 'customer_id']

    if (strict) {
        for (let key of keys) {
            if (!ticket.hasOwnProperty(key)) errorMSG = `_${key} is required`
        }
    }

    Object.keys(ticket).forEach((key) => {
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
            const tickets = await DAL.getAll()
            res.status(200).json(tickets)
        } catch (error) {
            returnError(req, res, error)
        }
    },
    get: async (req, res) => {
        try {
            const ticket = await DAL.get(req.params.ticketId)
            if (!ticket) throw new Error("ticket not found")
            res.status(200).json(ticket)
        } catch (error) {
            returnError(req, res, error)
        }
    },
    add: async (req, res) => {
        try {
            let raw_ticket = req.body

            let validationResult = ticketValidation(raw_ticket)
            if (validationResult.message !== 'success')
                throw new Error(validationResult.message)

            const ticket = await DAL.add(raw_ticket)
            if (ticket.status === "error") throw new Error(ticket.error)
            const id = ticket.data.id

            logger.info(`Tickets service: ticket ${id} added`)
            res.status(200).json(ticket)
        } catch (error) {
            returnError(req, res, error)
        }
    },
    update: async (req, res) => {
        try {
            let raw_ticket = req.body
            delete raw_ticket.id
            let id = req.params.ticketId

            let validationResult = ticketValidation(raw_ticket)
            if (validationResult.message !== 'success')
                throw new Error(validationResult.message)

            await DAL.update(id, raw_ticket)
            const ticket = await DAL.get(id)
            logger.info(`Tickets service: ticket ${ticket.data.id} updated`)
            res.status(200).json(ticket)
        }
        catch (error) {
            returnError(req, res, error)
        }
    },
    patch: async (req, res) => {
        try {
            let raw_ticket = req.body
            delete raw_ticket.id
            let id = req.params.ticketId

            let validationResult = ticketValidation(raw_ticket, false)
            if (validationResult.message !== 'success')
                throw new Error(validationResult.message)

            await DAL.patch(id, raw_ticket)
            const ticket = await DAL.get(id)
            logger.info(`Tickets service: ticket ${ticket.data.id} updated`)
            res.status(200).json(ticket)
        }
        catch (error) {
            returnError(req, res, error)
        }
    },
    delete: async (req, res) => {
        try {
            const ticket = await DAL.delete(req.params.ticketId)
            logger.info(`Tickets service: ticket ${ticket.data.id} deleted`)
            res.status(200).json(ticket)
        }
        catch (error) {
            returnError(req, res, error)
        }
    },

    getTicketsByFlightId: async (req, res) => {
        try {
            const tickets = await DAL.getTicketsByFlightId(req.params.flightId)
            logger.debug(`Tickets service: tickets by flight id:${req.params.flightId} received`)
            res.status(200).json(tickets)
        } catch (error) {
            returnError(req, res, error)
        }
    },
    getTicketsByCustomerId: async (req, res) => {
        try {
            const tickets = await DAL.getTicketsByCustomerId(req.params.customerId)
            logger.debug(`Tickets service: tickets by customer id:${req.params.customerId} received`)
            res.status(200).json(tickets)
        } catch (error) {
            returnError(req, res, error)
        }
    },

    createTable: async (req, res) => {
        try {
            const result = await DAL.createTable()
            logger.info(`Tickets service: table tickets created`)
            res.status(200).json(result)
        }
        catch (error) {
            returnError(req, res, error)
        }
    },
    dropTable: async (req, res) => {
        try {
            const result = await DAL.dropTable()
            logger.info(`Tickets service: table tickets dropped`)
            res.status(200).json(result)
        }
        catch (error) {
            returnError(req, res, error)
        }

    },
    fillTable: async (req, res) => {
        try {
            const result = await DAL.fillTable()
            logger.info(`Tickets service: table tickets filled`)
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

module.exports = ticketService;