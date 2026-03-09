const mongoose = require("mongoose")
const Course = require("../models/course");

/* CREATE COURSE */
exports.createCourse = async (req, res) => {
  console.log("BODY:", req.body);

  console.log("FILES:", req.files);
  try {
    const { courseName, category, subcategory, fees, totalSeats, mode, status,duration, location, description } = req.body;

    
    const images = req.files ? req.files.map(f => `uploads/${f.filename}`) : [];
let skills = [];

if (req.body.skills) {
  skills = JSON.parse(req.body.skills);
}
const modules = req.body.modules
  ? JSON.parse(req.body.modules)
  : [];

const course = await Course.create({
  courseName,
  category,
  subcategory,
  institution: new mongoose.Types.ObjectId(req.user.id),
  fees,
  totalSeats,
  mode,
  status,
  duration,
 skills,
  location,
  description,
  images,
  modules
});
    const populatedCourse = await Course.findById(course._id)
      .populate("category", "name")
      .populate("subcategory", "name")
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



/* GET  COURSES by id */
exports.getCourseById = async (req, res) => {
  try {

    const courses = await Course.find({ institution: req.user.id })
      .populate("category", "name")
      .populate("subcategory", "_id name")
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

exports.getAllCourses = async (req, res) => {
  try {
    const course = await Course.find()
      .populate("category", "name")
      .populate("subcategory", "name")   // ⭐ ADD THIS
      .populate("institution", "name email description");

    if (!course)
      return res.status(404).json({
        success: false,
        message: "Course not found"
      });

    res.status(200).json({
      success: true,
      data: course
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to load course",
      error: error.message
    });
  }
};
// get a single course
exports.getSingleCourseById = async (req, res) => {

  try {

    const course = await Course.findById(req.params.id)
      .populate("category", "name")
      .populate("subcategory", "name")
      .populate("institution", "name email description");

    if (!course) {

      return res.status(404).json({

        success: false,
        message: "Course not found"

      });

    }

    res.status(200).json({

      success: true,
      data: course

    });

  } catch (error) {

    res.status(500).json({

      success: false,
      message: error.message

    });

  }

};

exports.updateCourse = async (req, res) => {
  try {
    const courseId = req.params.id;

    const {
      courseName,
      category,
      subcategory,
      fees,
      totalSeats,
      mode,
     
      duration,
      status,
      
      location,
      description,
      existingImages
    } = req.body;

    // Parse modules safely
    const modules = req.body.modules
      ? JSON.parse(req.body.modules)
      : [];

    // New uploaded images
    const newImages = req.files
      ? req.files.map(f => `uploads/${f.filename}`)
      : [];

    // Existing images (if editing)
    let oldImages = [];

    if (existingImages) {
      if (Array.isArray(existingImages)) {
        oldImages = existingImages;
      } else {
        oldImages = [existingImages];
      }
    }
 let skills = [];

if (req.body.skills) {
  skills = JSON.parse(req.body.skills);
}
    const updatedCourse = await Course.findByIdAndUpdate(
      courseId,
      {
        courseName,
        category,
        subcategory,
        fees,
        totalSeats,
        mode,
        status,
       skills,duration,
        location,
        description,
        modules,
        images: [...oldImages, ...newImages]
      },
      { new: true }
    )
      .populate("category", "name")
      .populate("subcategory", "name")
      .populate("institution", "name email description");

    if (!updatedCourse) {
      return res.status(404).json({
        success: false,
        message: "Course not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Course updated successfully",
      data: updatedCourse
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

