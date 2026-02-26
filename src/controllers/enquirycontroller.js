const Enquiry= require("../models/enquiry");


// Create enquiry

exports.createEnquiry = async (req, res) => {

  try {

    const enquiry = new Enquiry({

      studentId: req.user._id,

      courseId: req.body.courseId,

      instituteId: req.body.instituteId,

      name: req.body.name,

      phone: req.body.phone,

      qualification: req.body.qualification,

      description: req.body.description

    });

    await enquiry.save();

    res.status(201).json(enquiry);

  }

  catch (error) {

    res.status(500).json({ error: error.message });

  }

};



// Get enquiries for institute dashboard


exports.getInstituteEnquiries = async (req, res) => {

  try {

    const enquiries = await Enquiry.find({

      instituteId: req.params.instituteId

    })

      .populate("studentId")
      .populate("courseId");



    res.json(enquiries);

  } catch (error) {

    res.status(500).json({ error: error.message });

  }

};