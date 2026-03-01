const mongoose = require("mongoose");
const { Schema } = mongoose;

const enquirySchema = new Schema(
  {
    studentId: {
      type: Schema.Types.ObjectId,
      ref: "Student",
      required: true
    },

    instituteId: {
      type: Schema.Types.ObjectId,
      ref: "Institution",
      required: true
    },

    courseId: {
      type: Schema.Types.ObjectId,
      ref: "Course", // make sure this matches your course model name
      required: true
    },

    name: String,
    phone: String,
    qualification: String,
    description: String,

    status: {
      type: String,
      default: "Pending"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Enquiry", enquirySchema);