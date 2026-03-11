const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const enquiryController = require("../controllers/enquirycontroller");

// Create enquiry
router.post("/", auth, enquiryController.createEnquiry);

// Student enquiries
router.get("/student", auth, enquiryController.getStudentEnquiries);

// Institute enquiries
router.get("/institute", auth, enquiryController.getInstituteEnquiries);

// Update status
router.put("/:id", auth, enquiryController.updateEnquiryStatus);

// Delete enquiry
router.delete("/:id", auth, enquiryController.deleteEnquiry);
module.exports = router;