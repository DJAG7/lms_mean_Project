const enrolledStudentsModel = require("../../../models/enrolledStudentModel");
const quizModel = require("../../../models/quizModel");
const { calculateExperience } = require("./calculateExperience");
const { verifyCode } = require("./verifyCode");
const submitQuiz = async (req, res) => {
  try {
    let quiz = await quizModel.find({ _id: req.body.quizId }).populate({
      path: "questions",
      model: "question",
    });
    if (quiz) {
      quiz = quiz[0];
      let questionData = quiz.questions;
      let submittedAnswers = req.body.data.questions;
      var totalCorrect = 0;
      let dataToSend = [];
      var totalScore = 0;
      var totalIncorrect = 0;
      var pointsEarned;

      for (let i = 0; i < submittedAnswers.length; i++) {
        let answer = submittedAnswers[i];
        if (questionData[i].queType == "maq") {
          let ans = Object.values(answer);
          let isCorrect = true;
          for (let j = 0; j < ans.length; j++) {
            if (ans[j] != questionData[i].correctOptions[j]) {
              isCorrect = false;
              break;
            }
          }
          if (isCorrect) {
            totalCorrect++;
            dataToSend.push({ status: true });
          } else {
            totalIncorrect++;

            dataToSend.push({
              status: false,
            });
          }
        } else if (
          questionData[i].queType == "truefalse" ||
          questionData[i].queType == "mcq"
        ) {
          if (answer.option1 == questionData[i].correctOptions[0]) {
            totalCorrect++;
            dataToSend.push({ status: true });
          } else {
            totalIncorrect++;
            dataToSend.push({
              status: false,
            });
          }
        } else if (questionData[i].queType == "coding") {
          var data = await verifyCode(
            answer.code,
            answer.language,
            questionData[i]
          );

          totalCorrect += data.success / (data.failure + data.success);
          totalIncorrect += data.failure / (data.failure + data.success);
        }
      }
      // console.log("total",totalCorrect, totalIncorrect);
      totalScore = (100 * totalCorrect) / (totalCorrect + totalIncorrect);
      let enrolledDoc = await enrolledStudentsModel.find({
        courseId: req.body.courseId,
        studentId: req.body.studentId,
      });
      if (enrolledDoc.length > 0) {
        let next = -1,
          nextModuleId,
          nextContentId,
          foundQuiz = false;
        enrolledDoc = enrolledDoc[0];
        var nextType = -1,
          contentInd,
          moduleInd;
        // console.log(enrolledDoc);
        for (let [moduleIndex, module] of enrolledDoc.modules.entries()) {
          for (let [contentIndex, content] of module.content.entries()) {
            if (content.contentId == req.body.quizId) {
              if (
                !enrolledDoc.modules[moduleIndex].content[contentIndex]
                  .isCompleted
              ) {
                contentInd = contentIndex;
                moduleInd = moduleIndex;
                enrolledDoc.modules[moduleIndex].content[
                  contentIndex
                ].isCompleted = true;
                enrolledDoc.modules[moduleIndex].content[
                  contentIndex
                ].submittedAnswers = submittedAnswers;
                enrolledDoc.modules[moduleIndex].content[
                  contentIndex
                ].totalCorrect = totalCorrect;
                enrolledDoc.modules[moduleIndex].content[
                  contentIndex
                ].totalIncorrect = totalIncorrect;

                enrolledDoc.modules[moduleIndex].content[contentIndex].score =
                  totalScore;
                if (
                  moduleIndex == enrolledDoc.modules.length - 1 &&
                  contentIndex == module.content.length - 1
                ) {
                  enrolledDoc.modules[moduleIndex].isCompleted = true;
                }
                pointsEarned = await calculateExperience(
                  req.body.studentId,
                  req.body.courseId,
                  false,
                  true,
                  enrolledDoc.modules[moduleIndex].content[contentIndex].type,
                  totalScore
                );
                enrolledDoc.modules[moduleIndex].content[
                  contentIndex
                ].pointsEarned = pointsEarned ? pointsEarned?.points : 0;
              }
              foundQuiz = true;
              next = 0;
            } else if (foundQuiz) {
              next = 1;
              nextModuleId = enrolledDoc.modules[moduleIndex].moduleId;
              nextContentId =
                enrolledDoc.modules[moduleIndex].content[contentIndex]
                  .contentId;
              nextType =
                enrolledDoc.modules[moduleIndex].content[contentIndex].type;
              break;
            }
          }
          if (next == 1) break;
        }
        await enrolledDoc.save();
        res.status(200).send({
          totalQuestions: totalCorrect + totalIncorrect,
          totalCorrect,
          pointsEarned: pointsEarned
            ? pointsEarned
            : { maxPoints: 100, points: 0 },
          contentInd,
          moduleInd,
          enrollId: enrolledDoc?._id,
          next: {
            next,
            nextContentId,
            nextModuleId,
            nextType,
          },
        });
      } else {
        res.status(500).send({ message: "Something went Wrong" });
      }
    } else {
      res.status(500).send({ message: "Quiz not Found" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: "Something went wrong" });
  }
};
module.exports = { submitQuiz };
