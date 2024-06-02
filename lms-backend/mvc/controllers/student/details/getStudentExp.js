const studentModel = require("../../../models/studentModel");
const getStudentExp = async (req, res) => {
  try {
    var student = await studentModel.find({ _id: req.body.studentId });
    if (student) {
      student = student[0];
      res.status(200).send({ exp: student.exp });
    } else {
      res.status(500).send({ message: "Student not found" });
    }
  } catch (err) {
    res.status(500).send({ message: "Something went wrong" });
  }
};
module.exports = { getStudentExp };
