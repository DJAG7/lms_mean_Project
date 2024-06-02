const express = require("express");
const {
  instructorLogin,
} = require("../controllers/instructor/auth/loginInstructor");
const {
  registerinstructor,
} = require("../controllers/instructor/auth/registerInstructor");
const { getCourses } = require("../controllers/instructor/getCourses");
const { getCoursebyId } = require("../controllers/instructor/getCourseById");
const {
  getModuleData,
} = require("../controllers/courses/edit-course/getModuleData");
const { editCourse } = require("../controllers/courses/edit-course/editCourse");
let routes = express.Router();

routes.post("/scl", registerinstructor);
routes.post("/login", instructorLogin);
routes.post("/courses/getCourses", getCourses);
routes.post("/courses/getCourse", getCoursebyId);
routes.post("/courses/getModule", getModuleData);
routes.post("/courses/editCourse", editCourse);

module.exports = routes;
