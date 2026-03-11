const mongoose = require("mongoose");

const supportSchema = new mongoose.Schema(
{
  institution:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Institution",
    required:true
  },

  supportType:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"SupportType",
    required:true
  },

  message:{
    type:String,
    required:true
  },

  reply:{
    type:String,
    default:""
  },

  status:{
    type:String,
    enum:["pending","replied"],
    default:"pending"
  }

},
{timestamps:true}
);

// FIX: Prevent OverwriteModelError
module.exports =
  mongoose.models.Support ||
  mongoose.model("Support", supportSchema);