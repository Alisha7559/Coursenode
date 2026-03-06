const express = require("express");
const router = express.Router();
const registrationController = require("../controllers/registercontroller");
const auth=require("../middleware/auth");

// POST - Register Course
router.post("/register-course",auth, registrationController.registerCourse);

module.exports = router;