const Category = require("../models/category");

exports.createCategory = async (req, res) => {

  try {

    if (req.user.role !== "admin") {

      return res.status(403).json({
        success: false,
        message: "Only admin can create category"
      });

    }

    console.log("BODY:", req.body);
    console.log("FILE:", req.file);

    // ✅ text field
    const name = req.body.name;

    // ✅ file field
    const image = req.file ? req.file.filename : null;

    if (!name) {

      return res.status(400).json({
        success: false,
        message: "Category name required"
      });

    }

    const category = await Category.create({

      name,
      image,
      createdBy: req.user.id

    });

    res.status(201).json({

      success: true,
      data: category

    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }

};




exports.getAllCategories = async (req, res) => {

  try {

    const categories = await Category.find({
      isActive: true
    })
    .select("_id name")   // send only needed fields
    .sort({ name: 1 });

    res.status(200).json({
      success: true,
      data: categories
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }

};
