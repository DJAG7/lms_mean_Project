const studentModel = require("../../../models/studentModel");

const addTask = async (req, res) => {
  try {
    await studentModel.findOneAndUpdate(
      { email: req.body.email },
      { $push: { todo: req.body.task } }
    );
    await studentModel.findOne({ email: req.body.email }).then((data) => {
      res.status(200).send(data.todo);
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: "Something went wrong" });
  }
};
module.exports = { addTask };
