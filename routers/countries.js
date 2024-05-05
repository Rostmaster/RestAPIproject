const { Router } = require("express")
const service = require("../services/countries.js")

const router = new Router();

//Table
// router.get("/countries-table", countriesDal.getTable);
router.post("/table-create", service.createTable);
router.delete("/table-delete", service.dropTable);
router.post("/table-fill", service.fillTable);

//countries
router.get("/", service.getAll);
router.get("/:countryId", service.get);
router.post("/", service.add);
router.put("/:countryId", service.update);
router.delete("/:countryId", service.delete);
router.use("/", service.error)


module.exports = router