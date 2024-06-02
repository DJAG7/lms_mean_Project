const studentModel = require("../../../models/studentModel");

const getTasks = async (req, res) => {
  try {
    var student = await studentModel.find(
      { email: req.headers.email },
      { todo: 1 }
    );
    if (student.length > 0) {
      student = student[0];
      res.status(200).send({ todo: student.todo });
    } else {
      res.status(500).send({ message: "Student not found" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: "Something went wrong" });
  }
};
module.exports = { getTasks };
