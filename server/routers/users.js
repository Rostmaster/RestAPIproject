const { Router } = require("express")
const service = require("../services/users.js")

const router = new Router();

//Table
router.post("/table-create", service.createTable);
router.delete("/table-delete", service.dropTable);
router.post("/table-fill", service.fillTable);

//users
router.post("/getByEmail", service.getByEmail);

router.get("/", service.getAll);
router.get("/:userId", service.get);
router.post("/", service.add);
router.put("/:userId", service.update);
router.patch("/:userId", service.patch);
router.delete("/:userId", service.delete);
router.use("/", service.error);

module.exports = router