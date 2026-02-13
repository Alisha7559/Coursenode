const Course = require("../models/course");

/* CREATE COURSE */
exports.createCourse = async (req, res) => {
  try {
    const { courseName, category,institutionid, mode, fees, totalSeats } = req.body;

    const course = await Course.create({
      courseName,
      category,
      institutionid,
      mode,
      fees,
      totalSeats
    });

    res.status(201).json({
      success: true,
      message: "Course added successfully",
      data: course
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to add course",
      error: error.message
    });
  }
};

/* GET ALL COURSES */
exports.getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find();
    res.status(200).json({ success: true, data: courses });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to load courses",
      error: error.message
    });
  }
};

/* GET COURSE BY ID */
exports.getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course)
      return res.status(404).json({ success: false, message: "Course not found" });

    res.status(200).json({ success: true, data: course });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to load course",
      error: error.message
    });
  }
};

/* UPDATE COURSE */
exports.updateCourse = async (req, res) => {
  try {
    const course = await Course.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!course)
      return res.status(404).json({ success: false, message: "Course not found" });

    res.status(200).json({
      success: true,
      message: "Course updated successfully",
      data: course
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Update failed",
      error: error.message
    });
  }
};

/* DELETE COURSE */
exports.deleteCourse = async (req, res) => {
  try {
    const course = await Course.findByIdAndDelete(req.params.id);

    if (!course)
      return res.status(404).json({ success: false, message: "Course not found" });

    res.status(200).json({
      success: true,
      message: "Course deleted successfully"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Delete failed",
      error: error.message
    });
  }
};
