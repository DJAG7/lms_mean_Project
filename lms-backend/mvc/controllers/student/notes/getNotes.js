const studentModel = require("../../../models/studentModel");

const getNotes = async (req, res) => {
  try {
    var student = await studentModel.find({ email: req.headers.email });
    if (student.length > 0) {
      student = student[0];
      res.status(200).send(student.notes);
    } else {
      res.status(500).send({ message: "Student not found" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: "Something went wrong" });
  }
};
module.exports = { getNotes };
