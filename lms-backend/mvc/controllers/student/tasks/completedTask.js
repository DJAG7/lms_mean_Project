const studentModel = require("../../../models/studentModel");

completedTask = async (req, res) => {
  try {
    await studentModel.findOneAndUpdate(
      { email: req.body.email },
      { $pull: { todo: req.body.done } }
    );
    res.status(200).send({ message: "Completed tasks Successfully" });
  } catch (err) {
    res.status(500).send({ message: "Something went wrong" });
  }
};
module.exports = { completedTask };
