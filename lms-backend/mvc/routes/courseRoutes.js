const express = require("express");

const { addCourse } = require("../controllers/courses/addCourse");
const { getCourses } = require("../controllers/courses/getCourses");
const { enrollCourse } = require("../controllers/courses/enrollCourse");
const { addDraftCourse } = require("../controllers/courses/addDraftCourse");
const { deleteCourse } = require("../controllers/courses/deleteCourse");
const { bulkEnroll } = require("../controllers/courses/bulkEnroll");
const multer = require("multer");
const { editCourse } = require("../controllers/courses/edit-course/editCourse");
const { getCourse } = require("../controllers/student/courses/getCourse");
const {
  getCourseReport,
} = require("../controllers/student/courses/getCourseReport");
// const storage = multer.memoryStorage();
const upload = multer({ dest: "uploads/" });
let routes = express.Router();
routes.post("/add/draft", addDraftCourse);
routes.post("/add", addCourse);
routes.get("/getCourses", getCourses);
routes.post("/getCourse", getCourse);
routes.post("/EnrollCourse", enrollCourse);
routes.post("/delete", deleteCourse);
routes.post("/bulkEnroll", upload.single("excel"), bulkEnroll);
routes.post("/edit", editCourse);
routes.post("/getReport", getCourseReport);
module.exports = routes;
