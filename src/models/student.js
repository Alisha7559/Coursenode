const mongoose = require("mongoose")
const { Schema } = mongoose
const studentSchema = new Schema({
    // studentid: { type: String },
    studentname: { type: String },
    email: { type: String },
    password: { type: String },
    // phone: { type: String },
    // education: {

    //     education_board_X: { type: String },
    //     marklist: { type: Number },
    //     education_board_XII: { type: String },
    //     marklist: { type: Number }
    // },
    // fees registration:{type:String},
    // gender: { type: String },
    // skills: { type: [String] },
    // careergoal: { type: String },
    // interest: { type: [String] },
    // createdat: { type: String },
    // lastlogin: { type: String }




})
const Student = mongoose.model("Student", studentSchema)
module.exports = Student