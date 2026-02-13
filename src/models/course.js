const mongoose = require("mongoose");
const { Schema } = mongoose;

const courseSchema = new Schema({
  // couseid :{
  //   type: String,
  //   required: true,
  //   trim: true

  // },
 courseName: {
    type: String,
    required: true,
    trim: true
  },

  category: {
    type: String,
    required: true
  },

Seats: {
    type: String
  },

//   difficultyLevel: {
//     type: String,
//     enum: ["Beginner", "Intermediate", "Advanced"]
//   },

//   skillsCovered: [{ type: String }],

Status: {
    type: String
  },

  institution: {
    type: String,
    required: true
  },

//   location: {
//     type: String
//   },

  mode: {
    type: String,
    enum: ["Online", "Offline", ],
    default: "Online"
  },

//   duration: {
//     type: Number,
//     required: true
//   },

fees: {
    type: Number,
    required: true
  },

//   ratingAverage: {
//     type: Number,
//     default: 0
//   },

//   totalEnrollments: {
//     type: Number,
//     default: 0
//   },

//   startDate: {
//     type: Date
//   },

//   endDate: {
//     type: Date
//   },

//   certificateProvided: {
//     type: Boolean,
//     default: false
//   },

//   prerequisites: [{ type: String }],

  
//   syllabus: [
//     {
//       moduleTitle: {
//         type: String,
//         required: true
//       },
//       topics: [
//         {
//           type: String,
//           required: true
//         }
//       ]
//     }
//   ],

//   thumbnail: {
//     type: String
//   },

//   isActive: {
//     type: Boolean,
//     default: true
//   },

//   createdAt: {
//     type: Date,
//     default: Date.now
//   }
});

const Course = mongoose.model("Course", courseSchema);
module.exports = Course;
