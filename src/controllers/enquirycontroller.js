const Enquiry = require("../models/enquiry");
const Course = require("../models/course");
const mongoose = require("mongoose");

/* ================= CREATE ENQUIRY ================= */

exports.createEnquiry = async (req, res) => {
  try {
    const { courseId, qualification, description } = req.body;

    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }
    console.log(course);
    

    const enquiry = await Enquiry.create({
      studentId: req.user.id,            // logged student
      courseId: course._id,
      instituteId: course.institution,   // ✅ always from course
      qualification,
      description,
      status: "Pending"
    });

    res.status(201).json({
      success: true,
      data: enquiry
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/* ================= GET INSTITUTE ENQUIRIES ================= */

exports.getInstituteEnquiries = async (req, res) => {
  try {

    const instituteId = req.user.id; // ✅ EXACT SAME AS FEEDBACK

    const enquiries = await Enquiry.find({
      instituteId: instituteId
    })
      .populate("studentId", "name email phone")
      .populate("courseId", "courseName")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: enquiries.length,
      data: enquiries
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


/* ================= GET STUDENT ENQUIRIES ================= */

exports.getStudentEnquiries = async (req, res) => {
  try {

    const enquiries = await Enquiry.find({
      studentId: req.user.id
    })
      .populate("courseId", "courseName")
      .populate("instituteId", "institutionName")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: enquiries
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


/* ================= UPDATE ENQUIRY STATUS ================= */

exports.updateEnquiryStatus = async (req, res) => {
  try {

    const instituteId = req.user.id;
    const { id } = req.params;
    const { status } = req.body;

    const enquiry = await Enquiry.findOne({
      _id: id,
      instituteId: instituteId
    });

    if (!enquiry) {
      return res.status(404).json({
        success: false,
        message: "Enquiry not found"
      });
    }

    enquiry.status = status;
    await enquiry.save();

    res.status(200).json({
      success: true,
      message: "Status updated successfully",
      data: enquiry
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};