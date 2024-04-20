const { Router } = require("express")
const service = require("../services/pages.js")

const router = new Router();

router.get("/signup", service.signupPage);
router.get("/login", service.loginPage);
router.get("/dashboard", service.dashboardPage);
router.post("/dashboard", service.dashboardPage);

router.use(service.pageNotFound) 

module.exports = router