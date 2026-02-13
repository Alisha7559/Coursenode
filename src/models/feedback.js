const mongoose = require("mongoose")
const { Schema } = mongoose
const feedbackSchema = new Schema({
    feedbackid: { type: String },
    studentid: { type: String },
    message: { type: String },
    submitted_at: { type: String }
})
const Feedback = mongoose.model("feedback", feedbackSchema)
module.exports = Feedback