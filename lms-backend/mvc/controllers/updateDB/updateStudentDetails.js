const studentModel = require("../../models/studentModel");
const studentDetailsModel = require("../../models/studentDetailsModel");
const dotenv = require("dotenv");
dotenv.config();
const getValue = (data) => {
  data = data.toObject();
  return {
    value:
      data && data != ""
        ? data.value && data.value != ""
          ? data.value
          : typeof data == "string"
          ? data
          : ""
        : "",
    public: data ? (data.public ? true : false) : false,
  };
};
const updateStudentDetails = async (req, res) => {
  try {
    if (req.body.db_key == process.env.DB_UPDATE_KEY) {
      let students = await studentModel.find({});
      if (students.length > 0) {
        for (let student of students) {
          let studentDetails = await studentDetailsModel.find({
            $or: [{ "email.value": student.email }, { email: student.email }],
          });
          if (studentDetails.length > 0) {
            studentDetails = studentDetails[0];
            studentDetails.email = getValue(studentDetails.email);
            studentDetails.name = getValue(studentDetails.name);
            studentDetails.description = getValue(studentDetails.description);
            studentDetails.phone = getValue(studentDetails.phone);
            studentDetails.websiteURL = getValue(studentDetails.websiteURL);
            studentDetails.leetcode = getValue(studentDetails.leetcode);
            studentDetails.codeforces = getValue(studentDetails.codeforces);
            studentDetails.education = getValue(studentDetails.education);
            await studentDetails.save();
          } else {
            let studentDetails = new studentDetailsModel({
              email: {
                value: student.email,
                public: false,
              },
              name: {
                value: student.name,
                public: false,
              },
              organization: {
                value: student.organization,
                public: false,
              },
            });
            studentDetails = await studentDetails.save();
            student.studentDetails = studentDetails._id;
            await student.save();
          }
        }
      }
      res.status(200).send({ message: "DB updated successfully" });
    } else {
      res.status(401).send({ message: "Unauthorised" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: err });
  }
};
module.exports = { updateStudentDetails };
