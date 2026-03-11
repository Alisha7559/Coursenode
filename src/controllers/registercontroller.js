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

    if (!course.enrolledStudents) {
  course.enrolledStudents = [];
}

if (course.enrolledStudents.length >= course.totalSeats) {
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

course.enrolledStudents.push(studentId);
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
     .populate({
  path: "courseId",
  select: "courseName subcategory",
  populate: {
    path: "subcategory",
    select: "name"
  }
})

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

    // ✅ ADD THIS LINE HERE
    console.log("Logged Institution:", req.user);

    const institutionId = req.user.id; // logged-in institution
    console.log("Institution ID:", institutionId);

    // 1️⃣ Get all courses of this institution
    const courses = await Course.find({ institution: institutionId }).select("_id");

    console.log("Courses found:", courses); // optional debug

    if (!courses.length) {
      return res.json([]); // No courses → no students
    }

    const courseIds = courses.map(c => c._id);

    // 2️⃣ Find registrations
    const registrations = await Register.find({ courseId: { $in: courseIds } })
      .populate("studentId", "studentname email")
      .populate({
        path: "courseId",
        select: "courseName subcategory",
        populate: { path: "subcategory", select: "name" }
      });

    console.log("Registrations:", registrations); // optional debug

    res.status(200).json(registrations);

  } catch (error) {
    console.error("Error fetching institution students:", error);
    res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};