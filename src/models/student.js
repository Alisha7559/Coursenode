const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema(
  {
    studentname: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true,
      unique: true
    },
    phone: {
      type: String,
      default: ""
    },
    password: {
      type: String,
      required: true
    },
    // --- AI Integration Fields ---
    learningInterests: [{
      type: String
    }],
    desiredRole: {
      type: String,
      default: ""
    },
    currentSkills: [{
      type: String
    }],
    interactionHistory: [{
      courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
      actionType: { type: String, enum: ['VIEW', 'ENROLL', 'RATE', 'COMPLETE'] },
      timestamp: { type: Date, default: Date.now }
    }]
  },
  { timestamps: true }
);

module.exports = mongoose.model("Student", studentSchema);