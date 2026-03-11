// const mongoose = require("mongoose");
// const { Schema } = mongoose;

// const institutionSchema = new Schema(
//   {
//     name: { type: String, required: true },

//     email: {
//       type: String,
//       required: true,
//       unique: true,
//       lowercase: true
//     },

//     password: {
//       type: String,
//       required: true
//     },

//   phone: {
//     type: String,
//     default: ""
//   },


//     description: { type: String },

//     isActive: { type: Boolean, default: true },

//     // Profile Image
//     profileImage: { type: String }, // store filename or URL

//     // Certificates - multiple
//    certificate: {
//   type: [String],
//   default: []
// }, // array of filenames or URLs

//     // Institution Details
//     institutionName: { type: String },
//     institutionType: { type: String },
//     yearEstablished: { type: String },
//     registrationNumber: { type: String },
//     accreditationAuthority: { type: String },
//     gstNumber: { type: String },

//     // Contact
//     officialEmail: { type: String },
//     officialPhone: { type: String },
//     website: { type: String },

//     // Address
//     address: { type: String },
//     city: { type: String },
//     state: { type: String },
//     country: { type: String },
//     postalCode: { type: String },

//     isProfileCompleted: { type: Boolean, default: false }
//   },
//   { timestamps: true }
// );

// module.exports = mongoose.model("Institution", institutionSchema);
const mongoose = require("mongoose");
const { Schema } = mongoose;

const institutionSchema = new Schema(
{
  name: {
    type: String,
    required: true,
    trim: true
  },

  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },

  password: {
    type: String,
    required: true
  },

  phone: {
    type: String,
    default: "",
    trim: true
  },

  description: {
    type: String,
    default: ""
  },

  isActive: {
    type: Boolean,
    default: true
  },

  // Profile Image
  profileImage: {
    type: String,
    default: ""
  },

  // Certificates
  certificate: {
    type: [String],
    default: []
  },

  // Institution Details
  institutionName: {
    type: String,
    default: ""
  },

  institutionType: {
    type: String,
    default: ""
  },

  yearEstablished: {
    type: String,
    default: ""
  },

  registrationNumber: {
    type: String,
    default: ""
  },

  accreditationAuthority: {
    type: String,
    default: ""
  },

  gstNumber: {
    type: String,
    default: ""
  },

  // Contact
  officialEmail: {
    type: String,
    default: ""
  },

  // officialPhone: {
  //   type: String,
  //   default: ""
  // },

  website: {
    type: String,
    default: ""
  },

  // Address
  address: {
    type: String,
    default: ""
  },

  city: {
    type: String,
    default: ""
  },

  state: {
    type: String,
    default: ""
  },

  country: {
    type: String,
    default: ""
  },

  postalCode: {
    type: String,
    default: ""
  },

  isProfileCompleted: {
    type: Boolean,
    default: false
  }

},
{ timestamps: true }
);

module.exports = mongoose.model("Institution", institutionSchema);