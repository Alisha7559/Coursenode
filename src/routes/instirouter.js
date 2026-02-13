const express = require("express");
const router = express.Router();
const instiController = require("../controllers/insticontrol");
const auth = require("../middleware/auth"); // middleware to verify JWT in cookies

/* ========= AUTH ROUTES ========= */
router.post("/register", instiController.registerInsti);
router.post("/login", instiController.loginInsti);

/* ========= READ ROUTES ========= */
router.get("/allinsti", instiController.getAllInsti);              // get all institutions
router.get("/oneinsti/:id", instiController.getInstiById);        // get by ID
router.get("/profile", auth, instiController.getInstiFromToken);  // get logged-in profile

/* ========= UPDATE & DELETE LOGGED-IN ========= */
router.patch("/update", auth, instiController.updateInsti);       // update logged-in institution
router.delete("/delete", auth, instiController.deleteInsti);      // delete logged-in institution

module.exports = router;
