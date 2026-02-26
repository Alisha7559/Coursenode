const mongoose = require("mongoose");

const enquirySchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student"
  },
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course"
  },
  instituteId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Institute"
  },
  status: {
    type: String,
    default: "Pending"
  },
    name: {type:String},

  phone:  {type:String},

  qualification: {type:String},

  description:  {type:String},

  status: {
    type: String,
    default: "Pending"
  }
}, { timestamps: true });

const Enquiry = mongoose.model("Enquiry", enquirySchema);
module.exports = Enquiry;