const Support = require("../models/supportModel");
const SupportType = require("../models/supportTypeModel");


/* CREATE SUPPORT TYPE */

exports.createSupportType = async (req,res)=>{
  try{

    const {name,description} = req.body;

    const type = await SupportType.create({
      name,
      description
    });

    res.json({
      success:true,
      data:type
    });

  }catch(err){

    res.status(500).json({error:err.message});

  }
};



/* GET SUPPORT TYPES */

exports.getSupportTypes = async (req,res)=>{

  try{

    const types = await SupportType
      .find({isActive:true})
      .sort({createdAt:-1});

    res.json({data:types});

  }catch(err){

    res.status(500).json({error:err.message});

  }

};



/* CREATE SUPPORT REQUEST */

exports.createSupportRequest = async (req,res)=>{

  try{

    const {supportType,message} = req.body;

    const request = await Support.create({
      institution:req.user.id,
      supportType,
      message
    });

    res.json({
      success:true,
      data:request
    });

  }catch(err){

    console.log("Create request error:",err);

    res.status(500).json({error:err.message});

  }

};



/* GET MY REQUESTS (INSTITUTION) */

exports.getMyRequests = async (req,res)=>{

  try{

    const data = await Support.find({
      institution:req.user.id
    })
    .populate("supportType","name")
    .sort({createdAt:-1});

    res.json({data});

  }catch(err){

    res.status(500).json({error:err.message});

  }

};



/* GET SUPPORT REQUESTS (ADMIN) */

exports.getSupportRequests = async (req,res)=>{

  try{

    const data = await Support.find()
    .populate("institution","name email")
    .populate("supportType","name description")
    .sort({createdAt:-1});

    res.json({data});

  }catch(err){

    console.log("Fetch support error:",err);

    res.status(500).json({
      message:"Failed to fetch support requests"
    });

  }

};



/* REPLY SUPPORT */

exports.replySupport = async (req,res)=>{

  try{

    const {reply} = req.body;

    const support = await Support.findById(req.params.id);

    if(!support){
      return res.status(404).json({
        message:"Support request not found"
      });
    }

    support.reply = reply;
    support.status = "replied";

    await support.save();

    res.json({
      success:true,
      message:"Reply sent"
    });

  }catch(err){

    res.status(500).json({error:err.message});

  }

};



/* DELETE SUPPORT */

exports.deleteSupport = async (req,res)=>{

  try{

    await Support.findByIdAndDelete(req.params.id);

    res.json({
      success:true,
      message:"Support deleted"
    });

  }catch(err){

    res.status(500).json({error:err.message});

  }

};