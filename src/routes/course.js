const express = require("express");
const router = express.Router();

const courseController = require("../controllers/course");

const upload = require("../middleware/upload");
const auth = require("../middleware/auth");

/* ================= CREATE COURSE ================= */

router.post(
  "/institute/course",
  auth,
  upload.array("images"),
  courseController.createCourse
);

/* ================= GET ALL COURSES ================= */

router.get(
  "/institute/allcourse",
  auth,
  courseController.getAllCourses
);

/* ================= GET COURSES BY INSTITUTE ================= */

router.get(
  "/institute/course",
  auth,
  courseController.getCourseById
);

/* ================= GET SINGLE COURSE ================= */

router.get(
  "/course/:id",
  courseController.getSingleCourseById
);

/* ================= SEARCH COURSE (NEW) ================= */

router.get(
  "/course/search",
  courseController.searchCourse
);

/* ================= UPDATE COURSE ================= */

router.put(
  "/update/:id",
  auth,
  upload.array("images"),
  courseController.updateCourse
);

/* ================= DELETE COURSE ================= */

router.delete(
  "/institute/course/:id",
  auth,
  courseController.deleteCourse
);

module.exports = router;