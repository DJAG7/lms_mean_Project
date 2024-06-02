const express = require("express");
const { enrollTest } = require("../controllers/test/enrollTest");
const { addTest } = require("../controllers/test/addTest");
const {
  getInstructorTests,
} = require("../controllers/test/getAllInstructorTests");
const { getStudentTests } = require("../controllers/test/getAllStudentTests");
const { getTestById } = require("../controllers/test/getTestById");
const {
  getTestSummaryById,
} = require("../controllers/test/getTestSummaryById");
const { submitTest } = require("../controllers/test/submitTest");
const { startTest } = require("../controllers/test/startTest");
const { proctoring } = require("../controllers/test/proctoring");
const { getAllTests } = require("../controllers/test/getAllTests");
const { bulkEnrollTest } = require("../controllers/test/bulkEnrollTest");
const multer = require("multer");
const { editTest } = require("../controllers/test/editTest");
const { getTestReview } = require("../controllers/test/getTestReview");
const { deleteTest } = require("../controllers/test/deleteTest");
const { calcResult } = require("../controllers/test/calcResult");
const { sendStudentsMail } = require("../controllers/test/sendStudentsMail");
const { getStudentReport } = require("../controllers/test/getStudentReport");
const upload = multer({ dest: "uploads/" });
let routes = express.Router();
routes.post("/add", addTest);
routes.post("/enroll", enrollTest);
routes.post("/instructorTests", getInstructorTests);
routes.post("/studentTests", getStudentTests);
routes.post("/getTest", getTestById);
routes.post("/getTestSummary", getTestSummaryById);
routes.post("/startTest", startTest);
routes.post("/submit", submitTest);
routes.post("/proctoring", proctoring);
routes.post("/getAllTests", getAllTests);
routes.post("/bulkEnrollTest", upload.single("excel"), bulkEnrollTest);
routes.post("/editTest", editTest);
routes.post("/review", getTestReview);
routes.post("/delete", deleteTest);
routes.post("/calcResult", calcResult);
routes.post("/sendStudentsMails", sendStudentsMail);
routes.post("/getReport", getStudentReport);
module.exports = routes;
