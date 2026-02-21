const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({

    name: {
        type: String,
        required: true,
        unique: true
    },

    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "admin", // ✅ your admin model
        required: true
    },

    isActive: {
        type: Boolean,
        default: true
    }

}, { timestamps: true });

module.exports = mongoose.model("category", categorySchema);
