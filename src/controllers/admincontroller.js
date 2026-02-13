
const bcrypt = require("bcrypt")
const Admin = require("../models/admin")
const jwt = require("jsonwebtoken");


// ================= REGISTER =================
exports.registerAdmin = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Name, email and password are required"
      });
    }

    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({ message: "Admin already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = new Admin({
      name,
      email,
      password: hashedPassword
    });

    await admin.save();

    res.status(201).json({ message: "Admin registered successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// =========gethandlers=============
exports.findAdmin = async (req, res) => {
  try {
    const adminId = req.user.id; // 🔥 FROM JWT

    const admin = await Admin.findById(adminId).select("-password");

    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    res.status(200).json(admin);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};




//======== update handler===============
exports.updateAdmin = async (req, res) => {
  try {
    const { id, password, ...rest } = req.body;

    if (!id) {
      return res.status(400).json({ message: "Admin ID is required" });
    }

    const updateData = { ...rest };

    // 🔐 hash password if provided
    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    const updatedAdmin = await Admin.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedAdmin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    res.status(200).json({
      message: "Admin updated successfully",
      data: updatedAdmin
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};




// ===========delete handler=================
exports.deleteAdmin = async (req, res) => {
  try {
    const { id } = req.body;

    if (!id) {
      return res.status(400).json({ message: "Admin ID is required" });
    }

    const deletedAdmin = await Admin.findByIdAndDelete(id);

    if (!deletedAdmin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    res.status(200).json({ message: "Admin deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



// ================= LOGIN =================
exports.loginAdmin = async (req, res) => {
    console.log(req.body);
    
  try {
    const { email, password } = req.body;

    // 🔐 validation (IMPORTANT)
    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required"
      });
    }

    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(404).json({ message: "Invalid email or password" });
    }

    console.log(admin);
    

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign(
      { id: admin._id, role: "admin" },
      process.env.JWT_SECRET || "secretkey",
      { expiresIn: "1h" }
    );
res.cookie("token", token, {
  httpOnly: true,
  secure: false,     // ✅ MUST be false on localhost
  sameSite: "lax",   // ✅ allow same-site requests
  maxAge: 60 * 60 * 1000
});


    res.status(200).json({
      message: "Login successful",
      token,
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

