const express = require("express");
const {
  getStudentProfile,
} = require("../controllers/profile/student-profile/getStudentProfile");
const {
  removeGithubAccess,
} = require("../controllers/profile/student-profile/removeGihubAccess");
const {
  getStudentRepos,
} = require("../controllers/profile/student-profile/getStudentRepos");
const {
  toggleStudentProfileVisibility,
} = require("../controllers/profile/student-profile/toggleStudentProfileVisibility");
const {
  editProfilePicture,
} = require("../controllers/profile/student-profile/editProfilePicture");
const {
  editProfileDetails,
} = require("../controllers/profile/student-profile/editProfileDetails");
let routes = express.Router();
routes.post("/getStudentProfile", getStudentProfile);
routes.post("/removeGihubAccess", removeGithubAccess);
routes.post("/getStudentRepos", getStudentRepos);
routes.post("/toggleProfileVisibility", toggleStudentProfileVisibility);
routes.post("/editProfilePicture", editProfilePicture);
routes.post("/editProfileDetails", editProfileDetails);
module.exports = routes;
