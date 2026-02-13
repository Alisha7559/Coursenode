const express = require("express");
const router = express.Router();
const courseController = require("../controllers/course");

/* CREATE COURSE */
router.post("/institute/course", courseController.createCourse);

/* GET ALL COURSES */
router.get("/institute/getcourse", courseController.getAllCourses);

/* GET COURSE BY ID */
router.get("/institute/course/:id", courseController.getCourseById);

/* UPDATE COURSE */
router.put("/institute/course/:id", courseController.updateCourse);

/* DELETE COURSE */
router.delete("/institute/course/:id", courseController.deleteCourse);

module.exports = router;
