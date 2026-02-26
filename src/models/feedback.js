const mongoose = require("mongoose");
const { Schema } = mongoose;

const feedbackSchema = new Schema({
  rating: {
    type: Number,
    min: 1,
    max: 5,
    required: true
  },
  studentid: {
    type: Schema.Types.ObjectId,
    ref: "student",   
    required: true
  },
   courseid: {
    type: Schema.Types.ObjectId,
    ref: "course",   
    required: true
  },
  message: {
    type: String,
    required: true
  },
  submitted_at: {
    type: Date,
    default: Date.now
  }
});

const Feedback = mongoose.model("Feedback", feedbackSchema);
module.exports = Feedback;