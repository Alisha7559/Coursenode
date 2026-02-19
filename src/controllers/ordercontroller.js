const Order = require("../models/order");
const Student = require("../models/student");
const Course = require("../models/course");
const Institution = require("../models/institmodel");


// ================= CREATE ORDER =================
exports.createOrder = async (req, res) => {
  
     const studentid= req.user; // ✅ from token
   try {

    
    if (!studentid) {
      return res.status(400).json({
        success: false,
        message: "Invalid student ID"
      });
    }
    const student= await Student.findById(studentid).select("-password")
    if(!student){
      return res.status(400).json({
        success: false,
        message: "Invalid student "
      });
    }
     const {course }=req.body
     if(!course ){
      return res.status(400).json({
        success: false,
        message: "Invalid course and price "
      });
     }

    // ✅ CHECK COURSE EXISTS
    const courseExists = await Course.findById(course);
    if (!courseExists) {
      return res.status(400).json({
        success: false,
        message: "Invalid course ID"
      });
    }
// console.log(courseExists.institutionid)
   

    // ✅ CREATE ORDER ONLY IF ALL VALID
    const order = await Order.create({
      student:studentid ,
      course,
      institution:courseExists.institutionid,
      price:courseExists.fees,
      
    });

    const populatedOrder = await Order.findById(order._id)
      .populate("student", "studentname -_id")
      .populate("course", "courseName -_id")
      .populate("institution", "name -_id");

    res.status(201).json({
      success: true,
      data: populatedOrder
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};


// ================= GET INSTITUTION ORDERS =================
exports.getInstitutionOrders = async (req, res) => {
  try {
    const institutionId = req.params.id;

    const orders = await Order.find({
      institution: institutionId,
      isActive: true
    })
      .populate("student", "studentname -_id")
      .populate("course", "courseName -_id")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      totalOrders: orders.length,
      data: orders
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// ================= GET ALL =================
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({ isActive: true })
      .populate("student", "studentname -_id")
      .populate("course", "courseName -_id")
      .populate("institution", "name -_id")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// ================= GET SINGLE =================
exports.getSingleOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("student", "studentname -_id")
      .populate("course", "courseName -_id")
      .populate("institution", "name -_id");

    if (!order || !order.isActive) {
      return res.status(404).json({
        success: false,
        message: "Order not found"
      });
    }

    res.status(200).json({
      success: true,
      data: order
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// ================= UPDATE =================
exports.updateOrder = async (req, res) => {
  try {
    const orderId = req.params.id;
    const updateData = req.body; // should contain fields like status, price, etc.

    const updatedOrder = await Order.findByIdAndUpdate(orderId, updateData, {
      new: true, // return updated document
      runValidators: true
    }).populate("student course institution");

    if (!updatedOrder) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json({ data: updatedOrder, message: "Order updated successfully" });
  } catch (error) {
    console.error("Update Order Error:", error);
    res.status(500).json({ message: "Failed to update order", error: error.message });
  }}

  