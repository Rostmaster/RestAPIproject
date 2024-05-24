const { Router } = require("express")
const service = require("../services/airlines.js")

const router = new Router();


//?Table
router.post("/table-create", service.createTable);
router.delete("/table-delete", service.dropTable);
router.post("/table-fill", service.fillTable);

//?airlines
router.get("/by_country/:countryId", service.getAirlinesByCountryId);
router.get("/by_user/:userId", service.getAirlinesByUserId);

router.get("/", service.getAll);
router.get("/:airlineId", service.get);
router.post("/", service.add);
router.put("/:airlineId", service.update);
router.patch("/:airlineId", service.patch);
router.delete("/:airlineId", service.delete);
router.use("/", service.error);


module.exports = router