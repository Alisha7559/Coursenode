const Feedback = require("../models/feedback");

// ================= CREATE FEEDBACK =================
exports.createFeedback = async (req, res) => {
  try {
    const { rating, message } = req.body;

    const feedback = await Feedback.create({
      rating,
      message,
      studentid: req.user.id   // from auth middleware
    });

    res.status(201).json({
      success: true,
      message: "Feedback submitted successfully",
      data: feedback
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


// ================= GET ALL FEEDBACK =================
exports.getAllFeedback = async (req, res) => {
  try {
    const feedbacks = await Feedback.find()
      .populate("studentid", "name email") // show student details
      .sort({ submitted_at: -1 });

    res.status(200).json({
      success: true,
      count: feedbacks.length,
      data: feedbacks
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


// ================= GET SINGLE STUDENT FEEDBACK =================
exports.getMyFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.find({
      studentid: req.user.id
    });

    res.status(200).json({
      success: true,
      data: feedback
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};