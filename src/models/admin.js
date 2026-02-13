const mongoose = require("mongoose")
const { Schema } = mongoose
const adminSchema = new Schema({
    // adminid: { type: ObjectId },
    name: { type: String },
    email: { type: String },
    password: { type: String },
    // role: { type: String },
    // phone: { type: String },
    // permissions: {

    //     MANAGE_USERS: { type: String },
    //     MANAGE_COURSES: { type: String },
    //     VIEW_ANALYTICS: { type: String },
    // },
    // lastLogin: { type: String },
    // isActive: { type: String },
    // createdAt: { type: String }
})
const Admin = mongoose.model("admin", adminSchema)
module.exports = Admin