const { Router } = require("express")
const service = require("../services/customers.js")

const router = new Router();

//Table
// router.get("/customers-table", customersDal.getTable);
router.post("/table-create", service.createTable);
router.delete("/table-delete", service.dropTable);
router.post("/table-fill", service.fillTable);

//customers
router.get("/", service.getAll);
router.get("/:customerId", service.get);
router.post("/", service.add);
router.put("/:customerId", service.update);
router.patch("/:customerId", service.patch);
router.delete("/:customerId", service.delete);


module.exports = router