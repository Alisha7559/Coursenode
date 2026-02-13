
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken");
const Student = require("../models/student")

// ================= REGISTER =================
exports.registerStudent = async (req, res) => {
  console.log(req.body)
  try {
    const { studentname, email, password } = req.body;

    // check if student already exists
    const existingStudent = await Student.findOne({ email });
    if (existingStudent) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const student = new Student({
      studentname,
      email,
      password: hashedPassword
    });

    await student.save();

    res.status(201).json({ message: "Student registered successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// =========gethandlers=============
exports.findStudent = async (req, res) => {
  try {
    const { id } = req.body;

    if (!id) {
      return res.status(400).json({ message: "Student ID is required" });
    }

    const student = await Student.findById(id);

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.status(200).json(student);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// ============ getall students===========
exports.getAllStudents = async (req, res) => {
  try {
    const student = await Student.find(); 
   

    res.status(200).json({
      success: true,
      count: student.length,
      data: student
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};



//======== update handler===============
exports.updateStudent = async (req, res) => {
  try {
    const { id, ...updateData } = req.body;

    if (!id) {
      return res.status(400).json({ message: "Student ID is required" });
    }

    const updatedStudent = await Student.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

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





// ===========delete handler=================
exports.deleteStudent = async (req, res) => {
  try {
    const { id } = req.body;

    if (!id) {
      return res.status(400).json({ message: "Student ID is required" });
    }

    const deletedStudent = await Student.findByIdAndDelete(id);

    if (!deletedStudent) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.status(200).json({ message: "Student deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



// ================= LOGIN =================
exports.loginStudent = async (req, res) => {
  try {
    const { email, password } = req.body;

    // check student
    const student = await Student.findOne({ email });
    if (!student) {
      return res.status(404).json({ message: "Invalid email or password" });
    }

    // compare password
    const isMatch = await bcrypt.compare(password, student.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // create token
    const token = jwt.sign(
      { id: student._id },
      process.env.JWT_SECRET || "secretkey",
      { expiresIn: "1h" }
    );

    res.status(200).json({
      message: "Login successful",
      token,
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

