const Enquiry = require("../models/enquiry");

/* ================= CREATE ENQUIRY ================= */

exports.createEnquiry = async (req, res) => {
  try {

    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const enquiry = new Enquiry({
      studentId: req.user.id,   // ✅ using id (not _id)
      courseId: req.body.courseId,
      instituteId: req.body.instituteId,
      name: req.body.name,
      phone: req.body.phone,
      qualification: req.body.qualification,
      description: req.body.description,
      status: "Pending"
    });

    await enquiry.save();

    res.status(201).json(enquiry);

  } catch (error) {
    console.error("Create enquiry error:", error);
    res.status(500).json({ message: error.message });
  }
};


/* ================= GET STUDENT ENQUIRIES ================= */

exports.getStudentEnquiries = async (req, res) => {
  try {

    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const enquiries = await Enquiry.find({
      studentId: req.user.id
    })
      .populate("courseId")
      .populate("instituteId");

    res.status(200).json(enquiries);

  } catch (error) {
    console.error("Student enquiry fetch error:", error);
    res.status(500).json({ message: error.message });
  }
};


/* ================= GET INSTITUTE ENQUIRIES ================= */

exports.getInstituteEnquiries = async (req, res) => {
  try {

    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    console.log("Logged Institute ID:", req.user.id);

    const enquiries = await Enquiry.find({
      instituteId: req.user.id
    })
      .populate("studentId")
      .populate("courseId");

    console.log("Found enquiries:", enquiries.length);

    res.status(200).json(enquiries);

  } catch (error) {
    console.error("Institution enquiry fetch error:", error);
    res.status(500).json({ message: error.message });
  }
};


/* ================= UPDATE ENQUIRY STATUS ================= */

exports.updateEnquiryStatus = async (req, res) => {
  try {

    const { id } = req.params;
    const { status } = req.body;

    const updated = await Enquiry.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    res.status(200).json(updated);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};