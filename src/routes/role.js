const express = require("express");
const router = express.Router();
const careerRoleController = require("../controllers/rolecontrol");

// CREATE
router.post("/add-role", careerRoleController.createRole);

// READ
router.get("/roles", careerRoleController.getAllRoles);
router.get("/roles/:id", careerRoleController.getRoleById);

// UPDATE
router.patch("/roles/:id", careerRoleController.updateRole);

// DELETE
router.delete("/roles/:id", careerRoleController.deleteRole);

module.exports = router;
