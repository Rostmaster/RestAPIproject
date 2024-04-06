const { Router } = require("express")
const service = require("../services/airlines.js")

const router = new Router();

//Table
// router.get("/airlines-table", airlinesDal.getTable);
router.post("/table-create", service.createTable);
router.delete("/table-delete", service.dropTable);
router.post("/table-fill", service.fillTable);

//airlines
router.get("/", service.getAll);
router.get("/:airlineId", service.get);
router.post("/", service.add);
router.put("/:airlineId", service.update);
router.patch("/:airlineId", service.patch);
router.delete("/:airlineId", service.delete);


module.exports = router