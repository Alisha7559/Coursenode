const mongoose = require("mongoose")
const { Schema } = mongoose
const reviewSchema = new Schema(
    {
  reviewid: { type: String },
  studentid:{ type: String },
  courseid:{ type: String },
  rating: { type: String },
  review_text: { type: String },
  created_at:{ type: String },
})
const Review = mongoose.model("review", reviewSchema)
module.exports = Review