const express = require("express");

const router = express.Router();

const categorycontroller = require("../controllers/categorycontroller");

const auth = require("../middleware/auth");
const upload = require("../middleware/upload");

router.post(
  "/category",
  auth,
  upload.single("image"),
  categorycontroller.createCategory
);

router.get(
  "/categories",
  categorycontroller.getAllCategories
);

router.put(
  "/category/:id",
  auth,
  upload.single("image"),
  categorycontroller.updateCategory
);

router.delete(
  "/category/:id",
  auth,
  categorycontroller.deleteCategory
);

router.patch(
  "/category/status/:id",
  auth,
  categorycontroller.toggleStatus
);

module.exports = router;