const { Router } = require("express")
const globalServices = require("../services/globalServices.js")
const cookieService = require("../services/cookies.js")
const router = new Router();

//?Database global operations
router.delete("/table_delete_all", globalServices.deleteAllTables);
router.post("/init_database", globalServices.initDatabase);

//?Complex CRUD operations
router.get("/get_current_user", globalServices.getCurrentUser);
router.get("/current_user_info", globalServices.getCurrentUserInfo);
router.get("/get_active_flights", globalServices.getActiveFlights);
router.get("/get_customer_flights", globalServices.getCustomerFlights);
router.get("/get_chosen_customer_flights/:customerId", globalServices.getChosenCustomerFlights);
router.post("/buy_ticket", globalServices.buyTicket);
router.delete("/cancel_ticket", globalServices.cancelTicket);

//?Cookies
router.post("/addAuthCookie", cookieService.addAuthCookie);
router.get("/getAuthenticatedUser", cookieService.getAuthenticatedUser);
router.get("/getUserInfo", cookieService.getUserInfo);

//?Authentication
router.post("/signup", globalServices.signUp);
router.post("/login", globalServices.login);
router.post("/logout", cookieService.logout);

//?Error
router.use("/", globalServices.error);

module.exports = router