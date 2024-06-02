const studentModel = require("../../../models/studentModel");

const deleteNotes = async (req, res) => {
  try {
    var NoteToDelete = req.body.done;
    var deletedNote;

    var student = await studentModel.find({ email: req.headers.email });
    if (student.length > 0) {
      student = student[0];
      var notes = student.notes;
      for (i in notes) {
        if (Object.keys(notes[i])[0] == NoteToDelete) {
          if (
            notes.findIndex((data) => data[NoteToDelete] == NoteToDelete) == -1
          )
            notes.splice(
              notes.findIndex((data) => data[NoteToDelete] == NoteToDelete) + 1,
              1
            );
          else
            notes.splice(
              notes.findIndex((data) => data[NoteToDelete] == NoteToDelete),
              1
            );
        }
      }
      deletedNote = notes;

      await studentModel.findOneAndUpdate(
        { email: req.headers.email },
        { $set: { notes: deletedNote } }
      );
      res.status(200).send({ message: "Note deleted successfully" });
    } else {
      res.status(401).send({ message: "Student not found" });
    }
  } catch (e) {
    res.status(500).send({ message: "Something went wrong" });
  }
};

module.exports = { deleteNotes };
