const securityService = require('./security.js')

const cookieService = {
    //adds cookies to the response
    addAuthCookie: (req, res) => {
        const user = req.body.user
        const authCookie = `${user.id},${user.role_id},${user.password},${user.username},${user.email}`
        res.cookie('auth', authCookie)
    },
    validateAuthentication: async (req, res) => {
        try {
            const userCookie = req.cookies.auth.split(',')
            const user = await (await fetch(`http://localhost:3000/api/users/${userCookie[0]}`)).json()
            if (securityService.compare(user.data.password, userCookie[2])) {
                return true
            }
            else {
                return false
            }
        }
        catch (err) {
            return false
        }
    },
    //returns false if user is not authenticated and user if yes
    getAuthenticatedUser: async (req, res) => {
        try {
            if (req.cookies.auth === undefined) return false
            const userCookie = req.cookies.auth.split(',')
            const user = await (await fetch(`http://localhost:3000/api/users/${userCookie[0]}`)).json()
            if (securityService.compare(user.data.password, userCookie[2])) {
                return user.data
            }
            else {
                return false
            }
        }
        catch (err) {
            return false
        }
    },

    deleteAuthCookie: (req, res) => {
        res.clearCookie('auth')
    },
}

module.exports = cookieService;