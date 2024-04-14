const { Router } = require("express")
const service = require("../services/globalServices.js")

const router = new Router();

router.get("/get_current_user", service.getCurrentUser);
router.post("/get_all_flights", service.getActiveFlights);
router.post("/get_customer_flights", service.getCustomerFlights);

module.exports = router