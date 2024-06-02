const studentModel = require("../../models/studentModel");

const getStudent = async (req, res) => {
  try {
    var student = await studentModel.find({ _id: req.headers.opid });
    if (student.length > 0) {
      student = student[0];
      student = student.toObject();
      delete student.password;
      delete student["__v"];
      res.status.send(student);
    } else {
      res.status(401).send({ message: "Student not found" });
    }
  } catch (e) {
    res.status(500).send({ message: "something went wrong" });
  }
};
module.exports = {getStudent}
