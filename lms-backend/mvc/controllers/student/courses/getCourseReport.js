const enrolledStudentsModel = require("../../../models/enrolledStudentModel");
const quizModel = require("../../../models/quizModel");
const studentsModel = require("../../../models/studentModel");
const getCourseReport = async (req, res) => {
  try {
    let result = {};
    let moduleIndex = req.body.moduleIndex;
    let contentIndex = req.body.contentIndex;

    let enrolledCourse = await enrolledStudentsModel.find({
      _id: req.body.enrollId,
    });
    if (enrolledCourse) {
      enrolledCourse = enrolledCourse[0];
      let content =
        enrolledCourse?.modules?.[moduleIndex]?.content[contentIndex];
      let quizDetails = await quizModel
        .find({ _id: content?.contentId })
        .populate({
          path: "questions",
          model: "question",
        });
      let student = await studentsModel
        .find({
          _id: enrolledCourse?.studentId,
        })
        .select({ name: 1, _id: 0, email: 1 });
      console.log(student);
      result["student"] = student[0];
      result["contentDetails"] = quizDetails[0];
      result["submittedAnswers"] = content?.submittedAnswers;
      result["totalCorrect"] = content?.totalCorrect;
      result["totalIncorrect"] = content?.totalIncorrect;
      result["pointsEarned"] = content?.pointsEarned;
      result["score"] = content?.score;
      res.status(200).send(result);
    }
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: "Something went wrong" });
  }
};
module.exports = { getCourseReport };
