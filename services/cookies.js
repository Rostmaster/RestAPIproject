const userService = require('./users.js')
const securityService = require('./security.js')

const cookieService = {
    //Existing user cookie
    addExistingUserCookie: async (req, res) => {
        await res.cookie('existingUser', 'your existing user cookie')
        const authCookie = `${user.id}/${securityService.toEncrypt(user.username)}`
        await res.cookie('auth', authCookie)
    },
    checkExistingUser: async (req, res) => {
        return await Object.prototype.hasOwnProperty.call(req.cookies, 'existingUser')
    },
    deleteExistingUserCookie: async (req, res) => {
        await res.clearCookie('existingUser')
    },

    //Auth cookie
    addAuthCookie: (req, res, user) => {
        const encryptedUsername = securityService.toEncrypt(user.username)
        const authCookie = `${user.id},${encryptedUsername}`
        const existingUser = `${user.id},${encryptedUsername}`
        res.cookie('auth', authCookie)
        res.cookie('existingUser', existingUser)
    },
    checkAuth: async (req, res) => {
        if (!req.cookies.auth) return false
        console.log("There is an auth cookie")
        const userCookie = req.cookies.auth.split(',')
        const user = await (await fetch(`http://localhost:3000/api/users/${userCookie[0]}`)).json()
        return securityService.compare(user.data.username, userCookie[1])
    },
    deleteAuthCookie: async (req, res) => {
        await res.clearCookie('auth')
    },

    //New user cookie
    addNewUserCookie: async (req, res) => {
        await res.cookie('newUser', 'your new user cookie', { maxAge: 1000 })
    },
    checkNewUser: async (req, res) => {
        return await Object.prototype.hasOwnProperty.call(req.cookies, 'newUser')
    },
    deleteNewUserCookie: async (req, res) => {
        await res.clearCookie('newUser')
    },

}

module.exports = cookieService;