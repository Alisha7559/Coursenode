const Category = require("../models/category");

exports.createCategory = async (req, res) => {

  try {

    // ✅ Check role
    if (req.role !== "admin") {

      return res.status(403).json({

        success: false,
        message: "Only admin can create category"

      });

    }

    const { name } = req.body;

    const category = await Category.create({

      name,

      createdBy: req.user   // from JWT middleware

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
