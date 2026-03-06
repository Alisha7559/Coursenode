const Register = require("../models/register");
const Course = require("../models/course");

exports.registerCourse = async (req, res) => {
  try {
    const studentId = req.user.id;

    const { courseId, paymentMethod } = req.body;

    if (!studentId) {
      return res.status(401).json({
        message: "Not authenticated. Please login.",
      });
    }

    const existing = await Register.findOne({
      studentId,
      courseId,
    });

    if (existing) {
      return res.status(400).json({
        message: "You have already registered for this course",
      });
    }

    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({
        message: "Course not found",
      });
    }

    if (course.totalSeats <= 0) {
      return res.status(400).json({
        message: "No seats available",
      });
    }

    const newRegistration = await Register.create({
      studentId,
      courseId,
      paymentMethod,
      status: "Pending",
    });

    course.totalSeats -= 1;
    await course.save();

    const populatedRegistration = await Register.findById(
      newRegistration._id
    )
      .populate("studentId")
      .populate("courseId");

    res.status(200).json({
      message: "Registered Successfully",
      registration: populatedRegistration,
    });

  } catch (error) {
    console.error("Registration Error:", error);
    res.status(500).json({
      message: "Server error",
    });
  }
};


exports.getRegisteredStudents = async (req, res) => {
  try {

    const registrations = await Register.find()
      .populate("studentId", "studentname email")
      .populate("courseId", "courseName");

    res.json(registrations);

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server error",
    });
  }
};
exports.getInstitutionStudents = async (req, res) => {
  try {

    const institutionId = req.user.id;

    const courses = await Course.find({ institution: institutionId }).select("_id");

    const courseIds = courses.map(c => c._id);

    const registrations = await Register.find({
      courseId: { $in: courseIds }
    })
      .populate("studentId", "studentname email")
      .populate({
        path: "courseId",
        select: "courseName subcategory",
        populate: {
          path: "subcategory",
          select: "name"
        }
      });

    res.json(registrations);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};