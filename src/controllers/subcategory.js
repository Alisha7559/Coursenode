const CourseSubCategory = require("../models/coursesubcategory");


/* ================= CREATE ================= */
exports.createSubCategory = async (req, res) => {

  try {

    const { name, description, categoryId, isActive } = req.body;

  


    const subCategory = await CourseSubCategory.create({

      name,

      description,

      categoryId,
     
      

      createdBy: req.user.id, // from JWT middleware

      isActive

    });


    res.status(201).json({

      success: true,

      message: "SubCategory created",

      data: subCategory

    });

  }

  catch (error) {

    res.status(500).json({

      success: false,

      message: error.message

    });

  }

};



/* ================= GET ALL ================= */
exports.getAllSubCategories = async (req, res) => {

  try {

    const data = await CourseSubCategory.find()

      .populate("categoryId", "name")   // show category name

      .populate("createdBy", "name email");


    res.json({

      success: true,

      data

    });

  }

  catch (error) {

    res.status(500).json({

      success: false,

      message: error.message

    });

  }

};



/* ================= GET ONE ================= */
exports.getSubCategoryById = async (req, res) => {

  try {

    const data = await CourseSubCategory.findById(req.params.id)

      .populate("categoryId", "name");


    res.json({

      success: true,

      data

    });

  }

  catch (error) {

    res.status(500).json({

      success: false,

      message: error.message

    });

  }

};



/* ================= UPDATE ================= */
exports.updateSubCategory = async (req, res) => {

  try {

    if (req.file) {

      req.body.image = req.file.filename;

    }


    const updated = await CourseSubCategory.findByIdAndUpdate(

      req.params.id,

      req.body,

      { new: true }

    );


    res.json({

      success: true,

      message: "Updated",

      data: updated

    });

  }

  catch (error) {

    res.status(500).json({

      success: false,

      message: error.message

    });

  }

};



/* ================= DELETE ================= */
exports.deleteSubCategory = async (req, res) => {

  try {

    await CourseSubCategory.findByIdAndDelete(req.params.id);


    res.json({

      success: true,

      message: "Deleted"

    });

  }

  catch (error) {

    res.status(500).json({

      success: false,

      message: error.message

    });

  }

};
// =========getSubCategoryByCategory=====
exports.getSubCategoryByCategory = async (req, res) => {

 const data = await CourseSubCategory.find({

   categoryId: req.params.categoryId,

   isActive: true

 });

 res.json({
   success: true,
   data
 });

};
