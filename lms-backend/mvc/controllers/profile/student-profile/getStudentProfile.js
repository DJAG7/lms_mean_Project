const studentModel = require("../../../models/studentModel");
const studentDetailsModel = require("../../../models/studentDetailsModel");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();
const getStudentProfile = async (req, res) => {
  try {
    let decodedToken = "";
    if (req.headers.token) {
      decodedToken = jwt.verify(
        req.headers.token,
        process.env.JWT_TOKEN_SECRET
      );
    }

    var student = await studentModel
      .find({ _id: req.body.userId })
      .populate({
        path: "studentDetails",
      })
      .select("studentDetails name email");
    if (student.length > 0) {
      student = student[0];
      if (!student.studentDetails) {
        let studentDetails = new studentDetailsModel({
          name: { value: student.name },
          email: { value: student.email },
        });
        studentDetails = await studentDetails.save();
        student.studentDetails = studentDetails._id;
        student = await student.save();
        student = await studentModel
          .find({ _id: req.body.userId })
          .populate({
            path: "studentDetails",
          })
          .select("studentDetails name email");
      }
      var obj = student.studentDetails;
      obj.gitHub = { givenAccess: obj.gitHub.givenAccess };
      if (decodedToken?.user?.email == student.studentDetails.email.value) {
        res.status(200).send({ data: obj, access: true, redirect: false });
      } else if (
        decodedToken?.user?.email != student.studentDetails.email.value &&
        req.body.user != "viewer"
      ) {
        res.status(200).send({ access: false, redirect: true });
      } else if (
        (!decodedToken ||
          decodedToken?.user?.email != student.studentDetails.email.value) &&
        req.body.user == "viewer" &&
        !student.studentDetails.profileVisibility
      ) {
        res.status(200).send({ access: false, redirect: false });
      } else if (
        (!decodedToken ||
          decodedToken?.user?.email != student.studentDetails.email.value) &&
        req.body.user == "viewer" &&
        student.studentDetails.profileVisibility
      ) {
        for (let item in obj) {
          if (obj[item]?.public === false) {
            obj[item].value = "";
          }
        }
        res.status(200).send({ data: obj, access: true, redirect: false });
      } else {
        res.status(200).send({ access: false, redirect: true });
      }
      // console.log(obj);
    } else {
      res.status(401).send({ message: "Student not found" });
    }
  } catch (e) {
    console.log(e);
    res.status(500).send({ message: "something went wrong" });
  }
};
module.exports = { getStudentProfile };
