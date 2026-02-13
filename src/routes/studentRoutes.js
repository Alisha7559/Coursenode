const express=require("express")
const router=express.Router();
const studentcontroller=require("../controllers/studentcontroller")

// =================================
//          register STUDENT
// =================================

router.post("/student/register", studentcontroller.registerStudent);


// =================================
//          READ STUDENT
// =================================
router.get('/getstudent/:id',studentcontroller.findStudent)
router.get("/getallstudents",studentcontroller.getAllStudents);




// =================================
//         UPDATE STUDENT
// =================================
router.put('/updatestudent/:id',studentcontroller.updateStudent)


// =================================
//          DELETE STUDENT
// =================================
router.delete('/deletestudent/:id',studentcontroller.deleteStudent)

// =================================
//          LOGIN STUDENT
// =================================
router.post("/student/login", studentcontroller.loginStudent);
module.exports =router