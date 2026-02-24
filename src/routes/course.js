const express = require ("express");
const router = express.Router();

const courseController = require("../controllers/course");

const upload = require("../middleware/upload");

const auth=require("../middleware/auth");


// ✅ CREATE COURSE (FIXED)
router.post("/institute/course", auth, upload.array("images"), courseController.createCourse);

router.get("/institute/allcourse", auth, courseController.getAllCourses);

router.get("/institute/course", auth, courseController.getCourseById);

router.get("/course/:id", auth,courseController. getSingleCourseById);

router.put("/institute/course/:id", auth, courseController.updateCourse);

router.delete("/institute/course/:id", auth, courseController.deleteCourse);


module.exports = router;