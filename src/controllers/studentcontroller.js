const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Student = require("../models/student");

// ================= REGISTER =================
exports.registerStudent = async (req, res) => {
  try {
    const { studentname, email, password, phone } = req.body;

    const existingStudent = await Student.findOne({ email });
    if (existingStudent) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await Student.create({
      studentname,
      email,
      phone,
      password: hashedPassword
    });

    res.status(201).json({
      success: true,
      message: "Student registered successfully"
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// ================= LOGIN =================
exports.loginStudent = async (req, res) => {
  try {
    const { email, password } = req.body;

    const student = await Student.findOne({ email });
    if (!student) {
      return res.status(404).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, student.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign(
      { id: student._id },
      process.env.JWT_SECRET || "INS123",
      { expiresIn: "1h" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
    });

    res.status(200).json({
      success: true,
      message: "Login successful",
      student: {
        id: student._id,
        studentname: student.studentname,
        email: student.email
      }
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ================= LOGOUT =================
exports.logoutStudent = (req, res) => {
  res.clearCookie("token");
  res.status(200).json({
    success: true,
    message: "Logged out successfully"
  });
};

// ================= GET ONE =================
exports.findStudent = async (req, res) => {
  try {
    const { id } = req.params;

    const student = await Student.findById(id).select("-password");

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.status(200).json(student);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ================= GET ALL =================
exports.getAllStudents = async (req, res) => {
  try {
    const students = await Student.find().select("-password");

    res.status(200).json({
      success: true,
      count: students.length,
      data: students
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ================= UPDATE =================
exports.updateStudent = async (req, res) => {
  try {
    const { id } = req.params;

    const updatedStudent = await Student.findByIdAndUpdate(
      id,
      req.body,
      { new: true, runValidators: true }
    ).select("-password");

    if (!updatedStudent) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.status(200).json({
      message: "Student updated successfully",
      data: updatedStudent
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ================= DELETE =================
exports.deleteStudent = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedStudent = await Student.findByIdAndDelete(id);

    if (!deletedStudent) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.status(200).json({
      message: "Student deleted successfully"
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};