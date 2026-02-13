const express=require("express")
const router=express.Router();
const admincontroller=require("../controllers/admincontroller")
const auth = require("../auth");


// =================================
//          register admin
// =================================
router.post("/admin", admincontroller.registerAdmin);


// =================================
//          READ admin
// =================================
router.get("/me", auth, admincontroller.findAdmin); // 👈 ADD auth


// =================================
//         UPDATE admin
// =================================
router.put('/updateadmin',admincontroller.updateAdmin)


// =================================
//          DELETE admin
// =================================
router.delete('/deleteadmin',admincontroller.deleteAdmin)

// =================================
//          LOGIN admin
// =================================
router.post("/loginadmin",admincontroller.loginAdmin);




module.exports =router