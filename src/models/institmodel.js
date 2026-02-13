const mongoose = require("mongoose");
const { Schema } = mongoose;

const institutionSchema = new Schema(
  {

    name: { type: String, required: true },



    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true
    },

    password: {
      type: String,
      required: true
    },

    description: {
      type: String
    },

    isActive: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Institution", institutionSchema);
