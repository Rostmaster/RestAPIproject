const securityService = require('./security.js')

const cookieService = {
    //adds cookies to the response
    addAuthCookie: (req, res) => {
        const user = req.body.user
        const authCookie = `${user.id},${user.role_id},${user.password},${user.username},${user.email}`
        res.cookie('auth', authCookie)
    },
    //returns user info from cookie with response
    getUserInfo: (req, res) => {
        try {
            const userCookie = req.cookies.auth.split(',')
            const user = {
                id: userCookie[0],
                role_id: userCookie[1],
                password: userCookie[2],
                username: userCookie[3],
                email: userCookie[4]
            }
            res.status(200).json(user)
        } catch (error) {
            res.status(400).json({ error: 'no auth cookie found' })
        }

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


    logout: (req, res) => {
        res.clearCookie('auth')
        res.clearCookie('existingUser')
    },
}

module.exports = cookieService;