const studentModel = require("../../../models/studentModel");
const studentDetailsModel = require("../../../models/studentDetailsModel");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const { response } = require("express");
dotenv.config();
const editProfileDetails = async (req, res) => {
  try {
    let decodedToken = "";
    if (req.headers.token) {
      decodedToken = jwt.verify(
        req.headers.token,
        process.env.JWT_TOKEN_SECRET
      );
    }
    let student = await studentModel.find({ _id: req.body.userId });
    if (student.length > 0) {
      student = student[0];
      if (student.email == decodedToken.user.email) {
        let studentDetails = await studentDetailsModel.find({
          "email.value": student.email,
        });
        studentDetails = studentDetails[0];
        studentDetails.name = req.body.name;
        studentDetails.phone = req.body.phone;
        studentDetails.organization = req.body.organization;
        studentDetails.description = req.body.description;
        studentDetails.websiteURL = req.body.websiteURL;
        studentDetails.leetcode = req.body.leetcode;
        studentDetails.codeforces = req.body.codeforces;
        studentDetails.education = req.body.education;
        await studentDetails.save();
        student.name = req.body.name.value;
        await student.save();
        res.status(200).send({
          message: "Updated successfully",
        });
      } else {
        response.status(500).send({ message: "Invalid!,Student not found" });
      }
    } else {
      response.status(500).send({ message: "Student not found" });
    }
  } catch (e) {
    console.log(e);
    res.status(500).send({ message: "something went wrong" });
  }
};
module.exports = { editProfileDetails };
