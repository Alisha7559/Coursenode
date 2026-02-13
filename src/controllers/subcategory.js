const CourseSubCategory = require("../models/coursesubcategory");

/* ================= CREATE ================= */
const createSubCategory = async (req, res) => {
  try {
    const { name, description, categoryId, icon, isActive } = req.body;
    const image = req.file ? req.file.filename : null;

    const subCategory = new CourseSubCategory({
      name,
      description,
      categoryId,
      icon,
      image,
      isActive
    });

    await subCategory.save();
    res.status(201).json(subCategory);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

/* ================= GET ALL ================= */
const getAllSubCategories = async (req, res) => {
  try {
    const data = await CourseSubCategory.find();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

/* ================= GET BY ID ================= */
const getSubCategoryById = async (req, res) => {
  try {
    const data = await CourseSubCategory.findById(req.params.id);
    if (!data) return res.status(404).send("Subcategory not found");
    res.status(200).json(data);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

/* ================= UPDATE ================= */
const updateSubCategory = async (req, res) => {
 
  
  try {
    if (req.file) {
      req.body.image = req.file.filename;
    }

    const updated = await CourseSubCategory.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updated) return res.status(404).send("Subcategory not found");

    res.status(200).json(updated);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

/* ================= DELETE ================= */
const deleteSubCategory = async (req, res) => {
  try {
    const deleted = await CourseSubCategory.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).send("Subcategory not found");
    res.status(200).send("Deleted successfully");
  } catch (error) {
    res.status(500).send(error.message);
  }
};

module.exports = {
  createSubCategory,
  getAllSubCategories,
  getSubCategoryById,
  updateSubCategory,
  deleteSubCategory
};
