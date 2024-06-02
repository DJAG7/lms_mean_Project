const studentModel = require("../../../models/studentModel");

const addNotes = async (req, res) => {
  try {
    var title = req.body.title;
    var text = req.body.text;
    var note = {};
    note[title] = text;
    await studentModel.findOneAndUpdate(
      { email: req.headers.email },
      { $push: { notes: note } }
    );
    res.status(200).send({ message: "added note successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: "something went wrong" });
  }
};
module.exports = {addNotes}
