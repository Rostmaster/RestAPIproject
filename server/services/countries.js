const DAL = require("../dals/countries.js")

const logger = require("../utils/logger.js")

const pagePrefix = "/api/countries"

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

const countryValidation = (country, strict = true) => {
    let errorMSG = null
    const keys = [
        "name",
    ]

    if (strict) {
        for (let key of keys) {
            if (!key in country) errorMSG = `_${key} is required`
        }
    }

    Object.keys(country).forEach((key) => {
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
            if (country.data === undefined) throw new Error(`_country ${id} not found`)
            res.status(200).json(country)
        } catch (error) {
            returnError(req, res, error)

        }
    },
    add: async (req, res) => {
        try {
            let raw_country = req.body

            let validationResult = countryValidation(raw_country)
            if (validationResult.message !== 'success')
                throw new Error(validationResult.message)

            const country = await DAL.add(raw_country)
            if (country.status === "error") throw new Error(country.error)
            const id = country.data.id

            logger.info(`Countries service: country ${id} added`)
            res.status(200).json(country)
        } catch (error) {
            returnError(req, res, error)
        }
    },
    update: async (req, res) => {
        try {
            let raw_country = req.body
            delete raw_country.id
            let id = req.params.countryId

            let validationResult = countryValidation(raw_country)
            if (validationResult.message !== 'success')
                throw new Error(validationResult.message)

            await DAL.update(id, raw_country)
            const country = await DAL.get(id)
            if (country.data === undefined) throw new Error(`_country ${id} not found`)
            logger.info(`Countries service: country ${country.data.id} updated`)
            res.status(200).json(country)
        }
        catch (error) {
            returnError(req, res, error)
        }
    },
    delete: async (req, res) => {
        try {
            //delete flights and airlines related to this country if they exist
            const options = {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }
            }

            let flightsByOriginCountries = await
                await fetch(`http://localhost:3000/api/flights/by_origin_country/${req.params.countryId}`)
            flightsByOriginCountries = await flightsByOriginCountries.json()
            if (flightsByOriginCountries.status !== "success") {
                throw new Error(`_Countries service:flights by origin country id ${req.params.countryId} were not received ${flightsByOriginCountries}`)
            }
            if (flightsByOriginCountries.length !== 0)
                for (const flight of flightsByOriginCountries.data) {
                    await fetch(`http://localhost:3000/api/flights/${flight.id}`, options)
                }

            let flightsByDestinationCountries =
                await fetch(`http://localhost:3000/api/flights/by_destination_country/${req.params.countryId}`)
            flightsByDestinationCountries = await flightsByDestinationCountries.json()
            if (flightsByDestinationCountries.status !== "success") {
                throw new Error(`_Countries service:flights by destination country id ${req.params.countryId} were not received ${flightsByDestinationCountries}`)
            }
            if (flightsByDestinationCountries.length !== 0)
                for (const flight of flightsByDestinationCountries.data) {
                    await fetch(`http://localhost:3000/api/flights/${flight.id}`, options)
                }

            let airlinesByCountry =
                await fetch(`http://localhost:3000/api/airlines/by_country/${req.params.countryId}`)
            airlinesByCountry = await airlinesByCountry.json()
            if (airlinesByCountry.status !== "success") {
                throw new Error(`_Countries service:airlines by country id ${req.params.countryId} were not received ${airlinesByCountry}`)
            }
            if (airlinesByCountry.length !== 0)
                for (const airline of airlinesByCountry.data) {
                    await fetch(`http://localhost:3000/api/airlines/${airline.id}`, options)
                }

            //TODO add verification that flights and airlines are deleted

            const country = await DAL.delete(req.params.countryId)
            if (country.data === undefined) throw new Error(`_country ${req.params.countryId} not found`)
            if (country.status === "error") throw new Error(country.error)
            logger.info(`Countries service: country ${country.data.id} deleted`)
            res.status(200).json(country)
        }
        catch (error) {
            returnError(req, res, error)
        }
    },
    createTable: async (req, res) => {
        try {
            const result = await DAL.createTable()
            logger.info(`Countries service: table countries created`)
            res.status(200).json(result)
        }
        catch (error) {
            returnError(req, res, error)
        }
    },
    dropTable: async (req, res) => {
        try {
            const result = await DAL.dropTable()
            logger.info(`Countries service: table countries dropped`)
            res.status(200).json(result)
        }
        catch (error) {
            returnError(req, res, error)
        }

    },
    fillTable: async (req, res) => {
        try {
            const result = await DAL.fillTable()
            logger.info(`Countries service: table countries filled`)
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

module.exports = countriesService;