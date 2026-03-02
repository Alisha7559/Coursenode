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
      ref: "Course",
      required: true
    },

    qualification: {
      type: String,
      default: ""
    },

    description: {
      type: String,
      default: ""
    },

    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
      default: "Pending"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Enquiry", enquirySchema);