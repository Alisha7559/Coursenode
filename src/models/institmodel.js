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
     oldPassword: {
      type: String,
      required: true
    },
     newPassword: {
      type: String,
      required: true
    },

    description: { type: String },

    isActive: { type: Boolean, default: true },

    // Profile Image
    profileImage: { type: String }, // store filename or URL

    // Certificates - multiple
   certificate: {
  type: [String],
  default: []
}, // array of filenames or URLs

    // Institution Details
    institutionName: { type: String },
    institutionType: { type: String },
    yearEstablished: { type: String },
    registrationNumber: { type: String },
    accreditationAuthority: { type: String },
    gstNumber: { type: String },

    // Contact
    officialEmail: { type: String },
    officialPhone: { type: String },
    website: { type: String },

    // Address
    address: { type: String },
    city: { type: String },
    state: { type: String },
    country: { type: String },
    postalCode: { type: String },

    isProfileCompleted: { type: Boolean, default: false }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Institution", institutionSchema);