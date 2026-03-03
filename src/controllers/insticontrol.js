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
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });
    res.status(200).json({
      message: "Login successful", token, institution: {
        id: institution._id,
        name: institution.name,
        email: institution.email,
        isProfileCompleted: institution.isProfileCompleted
      }
    });
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
      .findById(insti_id.id)
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
    const insti_id = req.user.id;

    console.log("BODY:", req.body);
    console.log("FILES:", req.files);

    const institution = await Institution.findById(insti_id);

    if (!institution) return res.status(404).send("Institution not found");

    // ===== Profile Image =====
    if (req.files?.profileImage && req.files.profileImage.length > 0) {
      institution.profileImage = req.files.profileImage[0].filename;
    }
    if (req.body.removedProfileImage === "true" || req.body.removedProfileImage === true) {
      institution.profileImage = null;
    }

    // ===== Certificates =====
    // Start with existing
    let existingCerts = institution.certificate || [];

    // Remove deleted certificates if any
    const removedCertificates = req.body.removedCertificates || [];
    const removedArray = Array.isArray(removedCertificates) ? removedCertificates : [removedCertificates];
    existingCerts = existingCerts.filter(file => !removedArray.includes(file));

    // Add newly uploaded certificates
    if (req.files?.certificate && req.files.certificate.length > 0) {
      const newCerts = req.files.certificate.map(f => f.filename);
      existingCerts = [...existingCerts, ...newCerts];
    }

    institution.certificate = existingCerts;

    // ===== Other fields =====
    const allowedFields = [
      "institutionName",
      "institutionType",
      "yearEstablished",
      "registrationNumber",
      "accreditationAuthority",
      "gstNumber",
      "officialEmail",
      "officialPhone",
      "website",
      "address",
      "city",
      "state",
      "country",
      "postalCode",
      "description"
    ];

    allowedFields.forEach(f => {
      if (req.body[f] !== undefined) institution[f] = req.body[f];
    });

    institution.isProfileCompleted = true;

    await institution.save();

    res.status(200).json({ success: true, data: institution });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
};
/* ========= DELETE LOGGED-IN INSTITUTION ========= */
exports.deleteInsti = async (req, res) => {
  try {
    const insti_id = req.user.id;

    const deletedInsti = await Institution.findByIdAndDelete(insti_id);

    if (!deletedInsti)
      return res.status(404).send("Institution not found");

    res.clearCookie("token");

    res.status(200).send("Institution deleted successfully");
  } catch (error) {
    res.status(500).send(error.message);
  }
};