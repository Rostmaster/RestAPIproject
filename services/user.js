const DAL = require("../dals/users.js")
const logger = require("../utils/logger.js")

const userValidation = (user, strict = true) => {
    let errorMSG = null
    const keys = ['username', 'password', 'email']

    if (strict) {
        for (let key of keys) {
            if (!user.hasOwnProperty(key)) errorMSG = `_${key} is required`
        }
    }

    Object.keys(user).forEach((key) => {
        console.log("Validator", key, keys.includes(key))
        keys.includes(key) ? null : errorMSG = `_Key ${key} is invalid`
    })

    return {
        message: errorMSG ? errorMSG : 'success',
        result: errorMSG ? false : true
    }
}

const userService = {

    getAll: async (req, res) => {
        try {
            console.log(req.query)
            const users = await DAL.getAll()
            res.status(200).json(users)
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
            const user = await DAL.get(req.params.userId)
            if (!user) throw new Error("User not found")
            res.status(200).json(user)
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
            let raw_user = req.body
            let id = req.params.userId

            let validationResult = userValidation(raw_user)
            console.log("Validation returned obj ", validationResult, id)
            if (validationResult.message !== 'success')
                throw new Error(validationResult.message)

            const user = await DAL.add(raw_user)
            logger.info(`Service: user ${id} added`)
            res.status(200).json(user)
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
            let raw_user = req.body
            let id = req.params.userId

            let validationResult = userValidation(raw_user)
            console.log("Validation returned obj ", validationResult, id)
            if (validationResult.message !== 'success')
                throw new Error(validationResult.message)

            const user = await DAL.update(id, raw_user)
            logger.info(`Service: user ${user.data.id} updated`)
            res.status(200).json(user)
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
            let raw_user = req.body
            let id = req.params.userId

            let validationResult = userValidation(raw_user, false)
            console.log("Validation returned obj ", validationResult, id)
            if (validationResult.message !== 'success')
                throw new Error(validationResult.message)

            const user = await DAL.update(id, raw_user)
            logger.info(`Service: user ${user.data.id} updated`)
            res.status(200).json(user)
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
            const user = await DAL.delete(req.params.userId)
            logger.info(`Service: user ${user.data.id} deleted`)
            res.status(200).json(user)
        }
        catch (error) {
            logger.error(`${req.method} to ${req.url} |: ${error.message}`)
        }
    },
    createTable: async (req, res) => {
        try {
            const result = await DAL.createTable()
            logger.info(`Service: table users created`)
            res.status(200).json(result)
        }
        catch (error) {
            logger.error(`${req.method} to ${req.url} |: ${error.message}`)
        }
    },
    dropTable: async (req, res) => {
        try {
            const reuslt = await DAL.dropTable()
            logger.info(`Service: table users dropped`)
            res.status(200).json(reuslt)
        }
        catch (error) {
            logger.error(`${req.method} to ${req.url} |: ${error.message}`)
        }
   
    },
    fillTable: async (req, res) => {
        try{
            const result = await DAL.fillTable()
            logger.info(`Service: table users filled`)
            res.status(200).json(result)
        }
        catch (error) {
            logger.error(`${req.method} to ${req.url} |: ${error.message}`)
        }
    },
}

module.exports = userService;