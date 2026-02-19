const mongoose = require("mongoose");
const { Schema } = mongoose;

const courseSubCategorySchema = new Schema({

  name: {
    type: String,
    required: true,
    trim: true
  },

  description: {
    type: String
  },

  image: {
    type: String
  },

  // ✅ VERY IMPORTANT (Link to Category)
  categoryId: {
    type: Schema.Types.ObjectId,
    ref: "CourseCategory",
    required: true
  },

  // ✅ Who created (Admin)
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: "admin",
    required: true
  },

  // ✅ status control
  isActive: {
    type: Boolean,
    default: true
  }

}, { timestamps: true });

const CourseSubCategory = mongoose.model(
  "CourseSubCategory",
  courseSubCategorySchema
);

module.exports = CourseSubCategory;
