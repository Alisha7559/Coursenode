const express = require("express");
const router = express.Router();
const studentcontroller = require("../controllers/studentcontroller");

// REGISTER
router.post("/register", studentcontroller.registerStudent);

// LOGIN
router.post("/login", studentcontroller.loginStudent);

// LOGOUT
router.post("/logout", studentcontroller.logoutStudent);

// GET ALL
router.get("/", studentcontroller.getAllStudents);

// GET ONE
router.get("/:id", studentcontroller.findStudent);

// UPDATE
router.put("/:id", studentcontroller.updateStudent);

// DELETE
router.delete("/:id", studentcontroller.deleteStudent);

module.exports = router;