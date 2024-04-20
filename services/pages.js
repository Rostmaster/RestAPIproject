const cookieService = require("./cookies.js")
const globalServices = require("./globalServices.js")
const config = require("config")

const prepareDashboardData = async (req, res) => {
    let customerFlights = (await globalServices.getCustomerFlights(req, res)).data
    return { customerFlights }
}

const pagesService = {

    dashboardPage: async (req, res) => {
        try {
            let user = await cookieService.checkAuth(req, res)
            if (user !== null) {
                req.user = user
                let { customerFlights } = await prepareDashboardData(req, res)
                res.status(200).render('dashboard', { customerFlights })
                return
            }
            res.status(200).redirect("/login")
            return
        } catch (error) {
            res.status(200).redirect("/login")

            return
        }
    },

    signupPage: async (req, res) => {

        res.status(200).render("signup")
        return

    },

    loginPage: async (req, res) => {

        res.status(200).render("login")
        return
    },


    pageNotFound: async (req, res) => {// Must be the last one
        res.status(404).send(
            "<h1>Page not found at all</h1>")
    }
}

module.exports = pagesService