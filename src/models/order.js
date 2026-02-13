const mongoose = require("mongoose");

const { Schema } = mongoose;

const orderSchema = new Schema(
  {
    student: {
      type: Schema.Types.ObjectId,
      ref: "Student",
      required: true
    },

    course: {
      type: Schema.Types.ObjectId,
      ref: "Course",
      required: true
    },

    institution: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "Institution",
  required: true
},


    price: {
      type: Number,
      required: true,
      min: 1
    },

    status: {
      type: String,
      enum: ["pending", "paid", "cancelled"],
      default: "pending"
    },
    actions: [
  {
    type: { type: String, enum: ["create", "update", "delete"], required: true },
    performedBy: { type: Schema.Types.ObjectId, ref: "User" },
    date: { type: Date, default: Date.now },
    changes: Schema.Types.Mixed // optional, store what was changed
  }
],


    isActive: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);


module.exports = mongoose.model("Order", orderSchema);
