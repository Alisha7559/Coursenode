const Course = require("../models/course");

/* CREATE COURSE */
exports.createCourse = async (req, res) => {
  try {
    // Destructure required fields from req.body
    const { courseName, category, subcategory, institution, fees, totalSeats, mode, status, approval, location, description } = req.body;

    // Get image filenames from multer
    const images = req.files ? req.files.map(f => f.filename) : [];

    // Create course in DB
    const course = await Course.create({
      courseName,
      category,
      subcategory,
      institution,
      fees,
      totalSeats,
      mode,
      status,
      approval,
      location,
      description,
      images
    });
  

    // ✅ Populate after create
    const populatedCourse = await Course.findById(course._id)
    .populate("category", "name ")
      .populate("institution", "name email description");

    res.status(201).json({
      success: true,
      message: "Course added successfully",
      data: populatedCourse
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

    const courses = await Course.find()
    .populate("category", "name ")
    .populate('subcategory', '_id name')
.populate("institution", "name email description");
  

    res.json({
      success: true,
      data: courses
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/* GET COURSE BY ID */
exports.getCourseById = async (req, res) => {
  try {
 const course = await Course.findById(req.params.id)
.populate("institution", "name email description");


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
