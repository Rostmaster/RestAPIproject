const { Router } = require("express")
const globalServices = require("../services/globalServices.js")
const cookieService = require("../services/cookies.js")
const router = new Router();

//?Database global operations
router.delete("/table_delete_all", globalServices.deleteAllTables);
router.post("/init_database", globalServices.initDatabase);

//?Complex CRUD operations
router.get("/current_user_info", globalServices.getCurrentUserInfo);
router.get("/get_active_flights", globalServices.getActiveFlights);
router.get("/get_customer_flights", globalServices.getCustomerFlights);
router.get("/get_chosen_customer_flights/:customerId", globalServices.getChosenCustomerFlights);
router.post("/buy_ticket", globalServices.buyTicket);
router.delete("/cancel_ticket", globalServices.cancelTicket);
router.delete("/delete_flight", globalServices.deleteFlight);

//?Cookies
router.post("/addAuthCookie", cookieService.addAuthCookie);
router.get("/getAuthenticatedUser", cookieService.getAuthenticatedUser);

//?Error
router.use("/", globalServices.error);

module.exports = router