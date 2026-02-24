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

  

  // ✅ VERY IMPORTANT (Link to Category)
  categoryId: {
    type: Schema.Types.ObjectId,
    ref: "category",
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

module.exports = mongoose.model(
  "CourseSubCategory",
  courseSubCategorySchema
);