const mongoose = require("mongoose");

const supportTypeSchema = new mongoose.Schema({

  name:{
    type:String,
    required:true
  },

  description:{
    type:String,
    required:true
  },

  isActive:{
    type:Boolean,
    default:true
  }

},{timestamps:true});

module.exports =
  mongoose.models.SupportType ||
  mongoose.model("SupportType", supportTypeSchema);