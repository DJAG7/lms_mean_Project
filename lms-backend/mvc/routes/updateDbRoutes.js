const express = require("express");
const {
  updateStudentDetails,
} = require("../controllers/updateDB/updateStudentDetails");
const { createMailChart } = require("../controllers/ses/createMailChart");
const {
  updateOrganizationIds,
} = require("../controllers/updateDB/updateOrganizationIds");
let routes = express.Router();
routes.post("/updateStudentDetails", updateStudentDetails);
routes.get("/updateOrganizationIds", updateOrganizationIds);
routes.get("/test", createMailChart);
module.exports = routes;
