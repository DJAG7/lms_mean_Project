const studentModel = require("../../models/studentModel");

const getAllStudents = async (req, res) => {
  try {
    var students = await studentModel.find({}).select("-password -__v");
    if (students.length > 0) {
      res.status(200).send(students);
    } else {
      res.status(401).send({ message: "Student not found" });
    }
  } catch (e) {
    res.status(500).send({ message: "something went wrong" });
  }
};
module.exports = {getAllStudents}
