const express = require("express");
const router = express.Router();
const feedbackController = require("../controllers/feedback");
const authMiddleware = require("../middleware/auth"); // your JWT middleware

// Create feedback (Student)
router.post("/", authMiddleware, feedbackController.createFeedback);

// Get all feedback (Admin)
router.get("/", authMiddleware, feedbackController.getAllFeedback);

// Get logged-in student feedback
router.get("/my", authMiddleware, feedbackController.getMyFeedback);

module.exports = router;