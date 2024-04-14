const cookieService = require("./cookies.js")
const globalServices = require("./globalServices.js")

const renderDashboard = async (req, res) => {
    const userID = await req.cookies.auth.split(',')[0]
    let customerFlights = await globalServices.getCustomerFlights(req, res, userID)
    res.status(200).render('dashboard', { customerFlights })
    return
}
const pagesService = {

    dashboardPage: async (req, res) => {
        if (await cookieService.checkAuth(req, res)) {
            let customerFlights = await globalServices.getCustomerFlights(req, res)
            res.status(200).render('dashboard', { customerFlights })
            return
        }
        res.status(200).redirect("/login")
        return
    },

    dashBoardPageRender: async (req, res) => {
        let customerFlights = await globalServices.getCustomerFlights(req, res)
        res.status(200).render('dashboard', { customerFlights:customerFlights.data })
        return
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