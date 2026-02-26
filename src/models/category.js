const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({

    name: {
        type: String,
        required: true,
        unique: true
    },
    image:{
        type:String
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "admin", 
        required: true
    },

    isActive: {
        type: Boolean,
        default: true
    }

}, { timestamps: true });

module.exports = mongoose.model("category", categorySchema);
