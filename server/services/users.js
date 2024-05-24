const DAL = require("../dals/users.js")
const config = require('config');
const url = `http://localhost:${config.server.port}`

const logger = require("../utils/logger.js")
const securityService = require("./security.js")
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

const userValidation = (user, strict = true) => {
    let errorMSG = null
    const keys = ['username', 'password', 'email', 'role_id']

    if (strict) {
        for (let key of keys) {
            if (!user.hasOwnProperty(key)) errorMSG = `_${key} is required`
        }
    }

    Object.keys(user).forEach((key) => {
        keys.includes(key) ? null : errorMSG = `_Key ${key} is invalid`
    })

    Object.keys(user).forEach((key) => {
        user[key] === undefined ? errorMSG = `_value of ${key}(${user[key]}) is undefined` : null
    })

    Object.keys(user).forEach((key) => {
        user[key] === '' ? errorMSG = `_value of ${key}(${user[key]}) is blank` : null
    })

    return {
        message: errorMSG ? errorMSG : 'success',
        result: errorMSG ? false : true
    }
}
const userService = {

    //? User CRUD
    getAll: async (req, res) => {
        try {
            const users = await DAL.getAll()
            res.status(200).json(users)
        } catch (error) {
            returnError(req, res, error)
        }
    },
    get: async (req, res) => {
        try {
            const user = await DAL.get(req.params.userId)
            if (user.data === undefined) throw new Error(`_user ${id} not found`)
            res.status(200).json(user)
        } catch (error) {
            returnError(req, res, error)
        }
    },
    add: async (req, res) => {
        try {
            let raw_user = req.body

            let validationResult = userValidation(raw_user)
            if (validationResult.message !== 'success')
                throw new Error(validationResult.message)

            const user = await DAL.add(raw_user)
            if (user.status === "error") throw new Error(user.error)
            const id = user.data.id

            logger.info(`Users service: user ${id} added`)
            res.status(200).json(user)
        } catch (error) {
            returnError(req, res, error)
        }
    },
    update: async (req, res) => {
        try {
            let raw_user = req.body
            let id = req.params.userId

            let validationResult = userValidation(raw_user)
            if (validationResult.message !== 'success')
                throw new Error(validationResult.message)

            await DAL.update(id, raw_user)
            const user = await DAL.get(id)
            if (user.data === undefined) throw new Error(`_user ${id} not found`)
            logger.info(`Users service: user ${user.data.id} updated`)
            res.status(200).json(user)
        }
        catch (error) {
            returnError(req, res, error)
        }
    },
    patch: async (req, res) => {
        try {
            let raw_user = req.body
            let id = req.params.userId

            let validationResult = userValidation(raw_user, false)
            if (validationResult.message !== 'success')
                throw new Error(validationResult.message)

            await DAL.patch(id, raw_user)
            const user = await DAL.get(id)
            if (user.data === undefined) throw new Error(`_user ${id} not found`)
            logger.info(`Users service: user ${user.data.id} updated`)
            res.status(200).json(user)
        }
        catch (error) {
            returnError(req, res, error)
        }
    },
    delete: async (req, res) => {
        try {
            //delete customers related to this user if they exist
            let customersByUsers =
                await fetch(`${url}/api/customers/by_user/${req.params.userId}`)
            customersByUsers = await customersByUsers.json()
            if (customersByUsers.status !== "success") {
                throw new Error(`_tickets by user id ${req.params.userId} were not received ${customersByUsers}`)
            }
            for (const customer of customersByUsers.data) {
                await fetch(`${url}/api/customers/${customer.id}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
            }

            //delete airlines related to this user if they exist
            let airlinesByUsers =
                await fetch(`${url}/api/airlines/by_user/${req.params.userId}`)
            airlinesByUsers = await airlinesByUsers.json()
            if (airlinesByUsers.status !== "success") {
                throw new Error(`_airlines by user id ${req.params.userId} were not received ${airlinesByUsers}`)
            }
            for (const flight of airlinesByUsers.data) {
                await fetch(`${url}/api/airlines/${flight.id}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
            }

            //TODO add verification that airlines and customers are deleted

            const user = await DAL.delete(req.params.userId)
            if (user.data === undefined) throw new Error(`_user ${req.params.userId} not found`)
            if (user.status === "error") throw new Error(user.error)
            logger.info(`Users service: user ${user.data.id} deleted`)
            res.status(200).json(user)
        }
        catch (error) {
            returnError(req, res, error)
        }
    },


    //? Table operations
    createTable: async (req, res) => {
        try {
            const result = await DAL.createTable()
            logger.info(`Users service: table users created`)
            res.status(200).json(result)
        }
        catch (error) {
            returnError(req, res, error)
        }
    },
    dropTable: async (req, res) => {
        try {
            const result = await DAL.dropTable()
            logger.info(`Users service: table users dropped`)
            res.status(200).json(result)
        }
        catch (error) {
            returnError(req, res, error)
        }

    },
    fillTable: async (req, res) => {
        try {
            const result = await DAL.fillTable()
            logger.info(`Users service: table users filled`)
            res.status(200).json(result)
        }
        catch (error) {
            returnError(req, res, error)
        }
    },

    //? Actions
    getByEmail: async (req, res) => {
        try {
            const credentials = req.body
            const requestForUser = await DAL.getByEmail(credentials.email)
            req.body.user = requestForUser.data

            if (requestForUser.status !== 'success') {
                throw new Error("User not found")
            }
            if (credentials.password !== requestForUser.data.password) {
                if (!securityService.compare(credentials.password, requestForUser.data.password))
                    throw new Error("Invalid credentials")
            }
            res.status(200).json(requestForUser)
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

module.exports = userService;