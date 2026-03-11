const Enquiry = require("../models/enquiry");
const Course = require("../models/course");
const Student = require("../models/student"); 

/* ================= CREATE ENQUIRY ================= */

exports.createEnquiry = async (req, res) => {
  try {
    console.log("createEnquiry API HIT ✅");

    console.log("Logged user:", req.user);
    const {
      courseId,
      instituteId,
      name,
      phone,
      qualification,
      description,
    } = req.body;

    if (!courseId || !instituteId || !qualification || !description) {
      return res.status(400).json({
        success: false,
        message: "All required fields must be provided",
      });
    }

    const student = await Student.findById(req.user.id);
    

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    const enquiry = await Enquiry.create({
      courseId,
      instituteId,
      studentId: student._id,
      name: name || student.studentname,
      phone,
      email: student.email, // ✅ auto attach email
      qualification,
      description,
    });

    await enquiry.populate([
      { path: "studentId", select: "studentname email" },
      { path: "courseId", select: "courseName" },
    ]);
    

    res.status(201).json({
      success: true,
      message: "Enquiry submitted successfully",
      data: enquiry,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

/* ================= GET INSTITUTE ENQUIRIES ================= */

exports.getInstituteEnquiries = async (req, res) => {
  try {
    const instituteId = req.user.id;

    const enquiries = await Enquiry.find({ instituteId })
      .populate("studentId", "studentname email phone")  // ✅ FIXED
      .populate("courseId", "courseName")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: enquiries.length,
      data: enquiries
    });

  } catch (error) {
    console.error("Get Institute Enquiry Error:", error);
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
    console.error("Get Student Enquiry Error:", error);
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
      instituteId
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
    console.error("Update Status Error:", error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
}; 
/* ================= DELETE ENQUIRY ================= */

exports.deleteEnquiry = async (req, res) => {
  try {
    const instituteId = req.user.id;
    const { id } = req.params;

    const enquiry = await Enquiry.findOneAndDelete({
      _id: id,
      instituteId
    });

    if (!enquiry) {
      return res.status(404).json({
        success: false,
        message: "Enquiry not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Enquiry deleted successfully"
    });

  } catch (error) {
    console.error("Delete Enquiry Error:", error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};