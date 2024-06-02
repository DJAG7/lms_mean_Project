const studentModel = require("../../../models/studentModel");
const studentDetailsModel = require("../../../models/studentDetailsModel");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const { uploadFileToS3 } = require("../../s3/s3");
const { response } = require("express");
dotenv.config();
const editProfilePicture = async (req, res) => {
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
        var fileExtension = req.files[0].originalname.split(".").pop();
        var uploadData = await uploadFileToS3(
          "",
          Date.now() + "LMS." + fileExtension,
          req.files[0].buffer
        );
        let studentDetails = await studentDetailsModel.find({
          "email.value": student.email,
        });
        studentDetails = studentDetails[0];
        studentDetails.profilePicture = uploadData.Location;
        await studentDetails.save();
        res.status(200).send({
          message: "Uploaded file successfully",
          location: uploadData.Location,
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
module.exports = { editProfilePicture };
