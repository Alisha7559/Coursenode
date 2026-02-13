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
      // image file path
  }

//   categoryId: {
//     type: Schema.Types.ObjectId,
//     ref: "CourseCategory",
//     required: true
//   },

//   icon: {
//     type: String
//   },

//   isActive: {
//     type: Boolean,
//     default: true
//   },

//   createdAt: {
//     type: Date,
//     default: Date.now
//   }
});

const CourseSubCategory = mongoose.model("CourseSubCategory",courseSubCategorySchema);

module.exports = CourseSubCategory;
