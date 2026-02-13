const mongoose = require("mongoose");
const { Schema } = mongoose;

const careerRoleSchema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },

  description: {
    type: String,
    required: true
  },

//   level: {
//     type: String,
//     enum: ["Entry Level", "Mid Level", "Senior Level"],
//     required: true
//   },

//   category: {
//     type: String,
//     required: true
//   },

//   skillsRequired: [
//     {
//       type: String
//     }
//   ],

//   averageSalary: {
//     type: Number
//   },

//   jobOpenings: {
//     type: Number
//   },

//   demandLevel: {
//     type: String,
//     enum: ["Low", "Medium", "High"],
//     default: "High"
//   },

//   recommendedCourses: [
//     {
//       type: Schema.Types.ObjectId,
//       ref: "Course"
//     }
//   ],

//   recommendedInstitutions: [
//     {
//       type: Schema.Types.ObjectId,
//       ref: "Institution"
//     }
//   ],

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

const CareerRole = mongoose.model("CareerRole", careerRoleSchema);
module.exports = CareerRole;
