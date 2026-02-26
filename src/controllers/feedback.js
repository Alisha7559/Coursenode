const Feedback = require("../models/feedback");
const Course = require("../models/course");

// ================= CREATE FEEDBACK =================
exports.createFeedback = async (req, res) => {
  console.log(req.body);
   const studentid = req.user.id
  
  try {
    const { rating, message, courseid,  } = req.body;

    // check course exists
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
      studentid, // from token
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


// ================= GET ALL FEEDBACK =================
exports.getAllFeedback = async (req, res) => {
  try {
    const feedbacks = await Feedback.find()
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


// ================= GET MY FEEDBACK =================
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