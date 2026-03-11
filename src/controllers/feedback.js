const Feedback = require("../models/feedback");
const Course = require("../models/course");
const mongoose = require("mongoose");



exports.createFeedback = async (req, res) => {
  try {
    const studentid = req.user.id;
    const { rating, message, courseid } = req.body;

    // ✅ CHECK REQUIRED FIELDS
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: "Rating must be between 1 and 5",
      });
    }

    if (!message || message.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Feedback message is required",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(courseid)) {
      return res.status(400).json({
        success: false,
        message: "Invalid course ID",
      });
    }

    const course = await Course.findById(courseid);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    const feedback = await Feedback.create({
      rating,
      message: message.trim(),
      studentid,
      instituteid: course.institution,
      courseid,
    });

    await feedback.populate([
      { path: "studentid", select: "studentname email" },
      { path: "courseid", select: "courseName" },
    ]);

    res.status(201).json({
      success: true,
      message: "Feedback submitted successfully",
      data: feedback,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
/* ================= GET INSTITUTE FEEDBACK ================= */
exports.getAllFeedback = async (req, res) => {
  try {
    const instituteId = req.user.id;

    const feedbacks = await Feedback.find({ instituteid: instituteId })
      .populate({ path: "studentid", select: "studentname email" })
      .populate({ path: "courseid", select: "courseName" })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: feedbacks.length,
      data: feedbacks,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ================= GET STUDENT FEEDBACK ================= */
exports.getMyFeedback = async (req, res) => {
  try {
    const feedbacks = await Feedback.find({ studentid: req.user.id })
      .populate({ path: "studentid", select: "studentname email" })
      .populate({ path: "courseid", select: "courseName" })
     .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: feedbacks,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ================= GET ALL FEEDBACK (PUBLIC) ================= */
exports.getPublicFeedback = async (req, res) => {
  try {
    const feedbacks = await Feedback.find()
      .populate({ path: "studentid", select: "studentname email" }) // ✅ Use studentname
      .populate({ path: "courseid", select: "courseName" })
     .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: feedbacks,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};