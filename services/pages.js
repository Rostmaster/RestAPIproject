const securityServices = require("../services/security.js")
const cookiesService = require("./cookies.js")
const logger = require("../utils/logger.js")
const pagePrefix = "/api/pages"

const printError = (req, res, error) => {
    if (error.message[0] === '_') {
        logger.error(`${req.method} to ...${pagePrefix}${req.url} |400|: ${error.message}`)
    }
    else {
        logger.error(`${req.method} to ...${pagePrefix}${req.url} |500|: ${error.message}`)
    }
}
const updateUserRole = async (req, res, type) => {
    try {
        let update = {}
        let user = req.body.user

        if (user.role_id !== 1) {
            update = { role_id: type === 'customer' ? 3 : 2 }
        }
        else {
            update = { role_id: 1 }
        }
        let id = user.id
        let result = await fetch(`http://localhost:3000/api/users/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(update)
        })
        req.body.user.role_id = update.role_id
        cookiesService.addAuthCookie(req, res)

        result = await result.json()

        return result.data
    }
    catch (err) {
        printError(req, res, err)
    }
}
const addCustomer = async (req, res) => {

    const customer = {
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        address: req.body.address,
        phone_number: req.body.phone_number,
        credit_card: req.body.credit_card,
        user_id: req.body.user.id
    }
    let result = await fetch(`http://localhost:3000/api/customers`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify(customer)
    })

    result = await result.json()

    return result.data
}
const addAirline = async (req, res) => {
    const airline = {
        name: req.body.name,
        country_id: req.body.country_id,
        user_id: req.body.user.id
    }
    let result = await fetch(`http://localhost:3000/api/airlines`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify(airline)
    })
    result = await result.json()
    return result.data
}

const pagesService = {

    //?Pages
    dashboardPage: async (req, res) => {
        if (!req.cookies.auth) {
            res.status(200).redirect("/signup")
            return
        }
        else if (!await cookiesService.validateAuthentication(req, res)) {
            res.status(200).redirect("/login")
        }
        else {
            res.status(200).render("dashboard")
            return
        }
    },
    signupPage: async (req, res) => {
        res.status(200).render("signup")
        return

    },
    registrationPage: async (req, res) => {
        res.status(200).render("registration")
        return
    },
    homePage: async (req, res) => {
        res.status(200).render("homepage")
        return
    },
    loginPage: async (req, res) => {
        if (req.cookies.auth && await cookiesService.validateAuthentication(req, res)) {
            res.status(200).redirect("/dashboard")
            return
        }
        else {
            res.status(200).render("login")
            return

        }
    },

    //?Actions
    signup: async (req, res) => {
        try {
            const hashedPassword = securityServices.toEncrypt(req.body.password)
            const user = {
                username: req.body.name,
                email: req.body.email,
                password: hashedPassword,
                role_id: 4
            }
            let result = await fetch(`http://localhost:3000/api/users`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(user)
            })
            result = await result.json()

            user.id = result.data.id

            req.body.user = user

            cookiesService.addAuthCookie(req, res)

            res.redirect('/registration')
        } catch (error) {
            printError(req, res, error)
            console.log(error)
            res.redirect('/signup')
        }
    },
    register: async (req, res) => {
        try {
            let user = await cookiesService.getAuthenticatedUser(req, res)
            if (user === null) throw new Error('_Unauthorized: please signup/login first')
            req.body.user = user
            const type = req.body.type
            if (user.role_id === 4 || user.role_id === 1) {
                if (type == 'customer') {
                    await addCustomer(req, res)
                    await updateUserRole(req, res, 'customer')
                }
                else if (type == 'airline') {
                    await addAirline(req, res)
                    await updateUserRole(req, res, 'airline')
                }
            }
            else {
                throw new Error(`_Bad request: user ${user.id} already registered as ${user.role_id == 3 ? 'customer' : 'airline'}`)
            }
            res.redirect('/login')
            return
        }
        catch (error) {
            printError(req, res, error)
            if (error.message[0] === '_') {
                res.redirect('/login')
            }
            else {
                res.redirect('/registration')
            }
        }
    },
    login: async (req, res) => {
        try {
            let loginUser = req.body
            let isUserExists = await fetch(`http://localhost:3000/api/users/getByEmail`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(loginUser)
            })
            isUserExists = await isUserExists.json()

            res.status(200).redirect('/dashboard/cookieAdd')
        } catch (error) {
            printError(req, res, error)
            res.redirect('/login')
        }

    },
    dashboardCookieAdd: async (req, res) => {
        res.status(200).redirect('/dashboard')
    },
    pageNotFound: async (req, res) => {// Must be the last one
        res.status(404).send(
            "<h1>Page not found at all</h1>")
    }

}

module.exports = pagesService