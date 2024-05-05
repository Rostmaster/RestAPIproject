const { Router } = require("express")
const service = require("../services/tickets.js")

const router = new Router();

//Table
// router.get("/tickets-table", ticketsDal.getTable);
router.post("/table-create", service.createTable);
router.delete("/table-delete", service.dropTable);
router.post("/table-fill", service.fillTable);

//tickets
router.get("/by_flight/:flightId", service.getTicketsByFlightId);
router.get("/by_customer/:customerId", service.getTicketsByCustomerId);

router.get("/", service.getAll);
router.get("/:ticketId", service.get);
router.post("/", service.add);
router.put("/:ticketId", service.update);
router.patch("/:ticketId", service.patch);
router.delete("/:ticketId", service.delete);
router.use("/", service.error);

module.exports = router