const { Router } = require("express")
const service = require("../services/user.js")

const router = new Router();

//Table
// router.get("/users-table", usersDal.getTable);
router.post("/table-create", service.createTable);
router.delete("/table-delete", service.dropTable);
router.post("/table-fill", service.fillTable);

//users
router.get("/", service.getAll);
router.get("/:userId", service.get);
router.post("/", service.add);
router.put("/:userId", service.update);
router.patch("/:userId", service.patch);
router.delete("/:userId", service.delete);


module.exports = router