const express = require("express");
const router = express.Router();
const registrationController = require("../controllers/registercontroller");
const auth=require("../middleware/auth");

// POST - Register Course
router.post("/register-course",auth, registrationController.registerCourse);
router.get("/registered-students", auth, registrationController.getRegisteredStudents);
router.get("/institution-students", auth, registrationController.getInstitutionStudents);
router.put("/registrations/:id", auth,registrationController.updateRegistrationStatus);
router.delete("/registration/:id", auth, registrationController.deleteRegistration);
module.exports = router;