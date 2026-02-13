const express = require("express");
const router = express.Router();

const subCategoryController = require("../controllers/subcategory");
const upload = require("../middleware/upload"); // multer middleware

// CREATE (with image)
router.post(
  "/add-subcategory",
  upload.single("image"),   // image field name
  subCategoryController.createSubCategory
);

// READ
router.get("/subcategories", subCategoryController.getAllSubCategories);
router.get("/subcategories/:id", subCategoryController.getSubCategoryById);

// UPDATE (with optional image)
router.patch(
  "/subcategories/:id",
  upload.single("image"),
  subCategoryController.updateSubCategory
);

// DELETE
router.delete("/subcategories/:id", subCategoryController.deleteSubCategory);

module.exports = router;
