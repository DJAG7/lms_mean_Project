const express = require("express");
const {
  registerStudent,
} = require("../controllers/student/auth/registerStudent");
const { studentLogin } = require("../controllers/student/auth/loginStudent");
const {
  checkStudentSubscription,
} = require("../controllers/student/subscription/checkStudentSubscription");
const {
  changePassword,
} = require("../controllers/student/auth/changePassword");
const { showBlogs } = require("../controllers/student/blogs/showBlogs");
const { addTask } = require("../controllers/student/tasks/addTask");
const { completedTask } = require("../controllers/student/tasks/completedTask");
const { getTasks } = require("../controllers/student/tasks/getTasks");
const { addNotes } = require("../controllers/student/notes/addNotes");
const { getNotes } = require("../controllers/student/notes/getNotes");
const { deleteNotes } = require("../controllers/student/notes/deleteNotes");
const {
  studentSubscribe,
} = require("../controllers/student/subscription/studentSubscribe");
const {
  getValidity,
} = require("../controllers/student/subscription/getValidity");
const { getStudent } = require("../controllers/student/getStudent");
const { getAllStudents } = require("../controllers/student/getAllStudents");
const {
  getStudentCourses,
} = require("../controllers/student/courses/getStudentCourses");
const {
  getStudentLesson,
} = require("../controllers/student/courses/getStudentLesson");
const {
  getStudentCourse,
} = require("../controllers/student/courses/grtStudentCourse");
const { enrollCourse } = require("../controllers/student/courses/enrollCourse");
const { executeCode } = require("../controllers/student/courses/executeCode");
const {
  lessonCompleted,
} = require("../controllers/student/courses/lessonCompleted");
const { getQuiz } = require("../controllers/student/courses/getQuiz");
const { submitQuiz } = require("../controllers/student/courses/submitquiz");
const {
  getStudentExp,
} = require("../controllers/student/details/getStudentExp");
const {
  forgotPassword,
} = require("../controllers/student/auth/forgotPassword");
const { verifyStudent } = require("../controllers/student/auth/verifyStudent");
const {
  getStudentOverview,
} = require("../controllers/student/details/getStudentOverview");
let routes = express.Router();
routes.get("/blogs/show", showBlogs);
routes.post("/register", registerStudent);
routes.post("/login", studentLogin);
routes.post("/verifyStudent", verifyStudent);
routes.post("/forgotPassword", forgotPassword);
routes.post("/changePassword", changePassword);
routes.post("/subscription/checkSubscription", checkStudentSubscription);
routes.post("/subscription/subscribe", studentSubscribe);
routes.get("/subscription/getValidity", getValidity);
routes.post("/tasks/add", addTask);
routes.post("/tasks/completed", completedTask);
routes.get("/tasks/get", getTasks);
routes.post("/notes/add", addNotes);
routes.get("/notes/get", getNotes);
routes.post("/notes/delete", deleteNotes);
routes.get("/getStudent", getStudent);
routes.get("/getAllStudents", getAllStudents);
routes.post("/courses/getStudentCourses", getStudentCourses);
routes.post("/courses/getStudentCourse", getStudentCourse);
routes.post("/courses/getStudentLesson", getStudentLesson);
routes.post("/courses/enrollCourse", enrollCourse);
routes.post("/courses/executecode", executeCode);
routes.post("/courses/lessonCompleted", lessonCompleted);
routes.post("/courses/quiz/getQuiz", getQuiz);
routes.post("/courses/quiz/submitQuiz", submitQuiz);
routes.post("/details/getExp", getStudentExp);
routes.post("/details/getStudentOverview", getStudentOverview);
module.exports = routes;
