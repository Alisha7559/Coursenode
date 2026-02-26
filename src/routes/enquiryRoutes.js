const express=require("express")
const router=express.Router();
const enquirycontroller=require("../controllers/enquirycontroller")
const auth = require("../middleware/auth");



router.post("/enquiry", auth,enquirycontroller.createEnquiry);

router.get("/getenquiry/:instituteId", auth, enquirycontroller.getInstituteEnquiries);
module.exports =router