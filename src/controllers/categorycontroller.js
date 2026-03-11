const Category = require("../models/category");


/* CREATE CATEGORY */

exports.createCategory = async (req, res) => {

  try {

    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Only admin can create category"
      });
    }

    const { name, description, isActive } = req.body;

    const image = req.file ? req.file.filename : null;

    const category = await Category.create({
      name,
      description,
      image,
      isActive,
      createdBy: req.user.id
    });

    res.status(201).json({
      success: true,
      data: category
    });

  } catch (error) {

    res.status(500).json({
      success:false,
      message:error.message
    });

  }

};



/* GET ALL CATEGORIES */

exports.getAllCategories = async (req, res) => {

  try {

    const categories = await Category.find()
      .sort({ createdAt: -1 });

    res.status(200).json({
      success:true,
      data:categories
    });

  } catch (error) {

    res.status(500).json({
      success:false,
      message:error.message
    });

  }

};



/* UPDATE CATEGORY */

exports.updateCategory = async (req, res) => {

  try {

    const { id } = req.params;

    const { name, description, isActive } = req.body;

    const updateData = {
      name,
      description,
      isActive
    };

    if (req.file) {
      updateData.image = req.file.filename;
    }

    const category = await Category.findByIdAndUpdate(
      id,
      updateData,
      { new:true }
    );

    res.status(200).json({
      success:true,
      data:category
    });

  } catch (error) {

    res.status(500).json({
      success:false,
      message:error.message
    });

  }

};



/* DELETE CATEGORY */

exports.deleteCategory = async (req, res) => {

  try {

    const { id } = req.params;

    await Category.findByIdAndDelete(id);

    res.status(200).json({
      success:true,
      message:"Category deleted successfully"
    });

  } catch (error) {

    res.status(500).json({
      success:false,
      message:error.message
    });

  }

};



/* TOGGLE STATUS */

exports.toggleStatus = async (req, res) => {

  try {

    const { id } = req.params;

    const category = await Category.findById(id);

    category.isActive = !category.isActive;

    await category.save();

    res.status(200).json({
      success:true,
      data:category
    });

  } catch (error) {

    res.status(500).json({
      success:false,
      message:error.message
    });

  }

};