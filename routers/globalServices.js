const { Router } = require("express")
const globalServices = require("../services/globalServices.js")
const cookieService = require("../services/cookies.js")
const router = new Router();

//?Database global operations
router.delete("/table_delete_all", globalServices.deleteAllTables);
router.post("/init_database", globalServices.initDatabase);

//?Complex CRUD operations
router.get("/get_current_user", globalServices.getCurrentUser);
router.post("/get_active_flights", globalServices.getActiveFlights);
router.post("/get_customer_flights", globalServices.getCustomerFlights);

//?Cookies
router.post("/addAuthCookie", cookieService.addAuthCookie);
router.post("/addExistingUserCookie", cookieService.addExistingUserCookie);

module.exports = router