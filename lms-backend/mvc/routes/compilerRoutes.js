const express = require("express");
const multer = require("multer");
const {
  runSampleTestCases,
} = require("../controllers/student/courses/runSampleTestCases");
const upload = multer({ dest: "uploads/" });
let routes = express.Router();
routes.post("/runSampleTests", runSampleTestCases);
module.exports = routes;
