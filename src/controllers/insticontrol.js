const Institution = require("../models/institmodel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

/* ========= REGISTER ========= */
exports.registerInsti = async (req, res) => {
  try {
    const { name, email, password, description } = req.body;

    if (!name || !email || !password) {
      return res.status(400).send("All fields required");
    }

    const instiExist = await Institution.findOne({ email });
    if (instiExist) return res.status(400).send("Institution already exists");

    const hashedPassword = await bcrypt.hash(password, 10);

    const institution = new Institution({
      name,
      email,
      password: hashedPassword,
      description
    });

    await institution.save();

    res.status(201).json({ message: "Institution registered successfully" });
  } catch (error) {
    res.status(500).send(error.message);
  }
};

/* ========= LOGIN ========= */
exports.loginInsti = async (req, res) => {


  try {
    const { email, password } = req.body;

    const institution = await Institution.findOne({ email });
    if (!institution) return res.status(404).send("Institution not found");

    const isMatch = await bcrypt.compare(password, institution.password);
    if (!isMatch) return res.status(400).send("Invalid credentials");

    const token = jwt.sign(
      { id: institution._id, role: "institution" },
      process.env.SECRET_KEY,
      { expiresIn: "1d" }
    );
    
    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
    });

    res.status(200).json({ message: "Login successful", token,institution: {
        id: institution._id,
        name: institution.name,
        email: institution.email
      }});
  } catch (error) {
    res.status(500).send(error.message);
  }
};

/* ========= GET ALL INSTITUTIONS ========= */
exports.getAllInsti = async (req, res) => {
  try {
    const institutions = await Institution.find().select("-password");
    res.status(200).json(institutions);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

/* ========= GET ONE INSTITUTION BY ID ========= */
exports.getInstiById = async (req, res) => {
  try {
    const { id } = req.params;

    const institution = await Institution.findById(id).select("-password");
    if (!institution) return res.status(404).send("Institution not found");

    res.status(200).json(institution);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

/* ========= GET LOGGED-IN INSTITUTION PROFILE ========= */
exports.getInstiFromToken = async (req, res) => {
  try {
    const insti_id = req.user; // set by auth middleware

    const institution = await Institution
      .findById(insti_id)
      .select("-password");

    if (!institution)
      return res.status(404).send("Institution not found");

    res.status(200).json(institution);
  } catch (error) {
    res.status(401).send("Invalid or expired token");
  }
};


/* ========= UPDATE LOGGED-IN INSTITUTION ========= */
exports.updateInsti = async (req, res) => {
  try {
    const token = req.cookies.insti_token;
    

    if (!token) return res.status(401).send("No token found");

    const decoded = jwt.verify(token, process.env.SECRET_KEY);

    const updatedInsti = await Institution.findByIdAndUpdate(
      decoded.id,
      req.body,
      { new: true }
    ).select("-password");

    if (!updatedInsti) return res.status(404).send("Institution not found");

    res.status(200).json(updatedInsti);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

/* ========= DELETE LOGGED-IN INSTITUTION ===
====== */
exports.deleteInsti = async (req, res) => {
  try {
    const token = req.cookies.insti_token;
    if (!token) return res.status(401).send("No token found");

    const decoded = jwt.verify(token, process.env.SECRET_KEY);

    const deletedInsti = await Institution.findByIdAndDelete(decoded.id);
    if (!deletedInsti) return res.status(404).send("Institution not found");

    res.status(200).send("Institution deleted successfully");
  } catch (error) {
    res.status(500).send(error.message);
  }
};
