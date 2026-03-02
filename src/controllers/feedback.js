const Feedback = require("../models/feedback");
const Course = require("../models/course");
const mongoose = require("mongoose");

/* ================= CREATE FEEDBACK ================= */
exports.createFeedback = async (req, res) => {
  try {

    const studentid = req.user.id;
    const { rating, message, courseid } = req.body;

    if (!mongoose.Types.ObjectId.isValid(courseid)) {
      return res.status(400).json({
        success: false,
        message: "Invalid course ID"
      });
    }

    const course = await Course.findById(courseid);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found"
      });
    }

    const feedback = await Feedback.create({
      rating,
      message,
      studentid,
      instituteid: course.institution, // ✅ auto set
      courseid: course._id
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


/* ================= GET INSTITUTE FEEDBACK ================= */
exports.getAllFeedback = async (req, res) => {
  try {

    const instituteId = req.user.id; // ✅ from logged-in institute

    const feedbacks = await Feedback.find({
      instituteid: instituteId
    })
      .populate("studentid", "email")
      .populate("courseid", "courseName")
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


/* ================= GET STUDENT FEEDBACK ================= */
exports.getMyFeedback = async (req, res) => {
  try {

    const feedback = await Feedback.find({
      studentid: req.user.id
    })
      .populate("courseid", "courseName");

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