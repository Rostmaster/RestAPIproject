const { Router } = require("express")
const service = require("../services/flights.js")

const router = new Router();

//Table
// router.get("/flights-table", flightsDal.getTable);
router.post("/table-create", service.createTable);
router.delete("/table-delete", service.dropTable);
router.post("/table-fill", service.fillTable);

//flights

router.get("/by_origin_country/:originCountryId", service.getFlightsByOriginCountryId);
router.get("/by_destination_country/:destinationCountryId", service.getFlightsByDestinationCountryId);
router.get("/by_airline/:airlineId", service.getFlightsByAirlineId);

router.get("/", service.getAll);
router.get("/:flightId", service.get);
router.post("/", service.add);
router.put("/:flightId", service.update);
router.patch("/:flightId", service.patch);
router.delete("/:flightId", service.delete);
router.use("/", service.error);

module.exports = router