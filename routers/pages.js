const { Router } = require("express")
const service = require("../services/pages.js")
const router = new Router();


router.get('/',  service.homePage)
router.get('/login',  service.loginPage)
router.get('/signup', service.signupPage)
router.get('/dashboard/cookieAdd', service.dashboardCookieAdd)
router.get('/dashboard', service.dashboardPage)
router.get('/registration', service.registrationPage)

router.post('/signup',service.signup)
router.post('/registration',service.register)
router.post('/login',service.login)
router.delete('/logout', (req, res) => {})

router.use(service.pageNotFound) 

module.exports = router