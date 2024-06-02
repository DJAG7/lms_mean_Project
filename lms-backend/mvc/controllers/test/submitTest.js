const enrolledTestsModel = require("../../models/enrolledTestModel");
const { verifyCode } = require("../student/courses/verifyCode");
const { sendEmail } = require("../ses/sendEmail");
const { createMailChart } = require("../ses/createMailChart");
const studentModel = require("../../models/studentModel");
const testModel = require("../../models/testModel");
function processSectionWiseScore(sectionwiseScore) {
  let categories = sectionwiseScore.map((item) => item.name);
  let correctScore = sectionwiseScore.map((item) => item.correct);
  let incorrectScore = sectionwiseScore.map((item) => item.incorrect);
  return {
    categories,
    correctScore,
    incorrectScore,
  };
}
const sendCompletionMail = async (data, userDetails, test) => {
  let sectionwiseChart = createMailChart(data, "verticalbar");
  let scoreChart = createMailChart(data, "horizontalbar");
  // console.log(scoreChart);
  let score = Math.floor((data.totalCorrect / data.totalQuestions) * 100);
  await sendEmail(
    userDetails.email,
    userDetails.name,
    `<html><body>Congratulations ${userDetails.name},<br/>
    <h3>You have Successfully completed ${test.testName}</h3><br/> <h3> Score :${score}%</h3><br/><img src="${sectionwiseChart}"></img><br/></body></html>`
  );
};
const submitTest = async (req, res) => {
  try {
    var testData = await enrolledTestsModel
      .find({
        testId: req.body.testId,
        studentId: req.body.student,
      })
      .populate({
        path: "testId",
        populate: {
          path: "sections",
          populate: {
            path: "questions",
            model: "question",
          },
        },
      });
    if (testData) {
      testData = testData[0];
      let sections = testData.testId.sections;
      let submittedAnswers = req.body.answers.sections;
      var totalCorrect = 0;
      let dataToSend = [];
      var totalScore = 0;
      var totalIncorrect = 0;
      let sectionwiseScore = [];
      if (testData.testId.testType == "mock") {
        for (let j = 0; j < sections.length; j++) {
          let correct = 0;
          let incorrect = 0;
          let questionData = sections[j].questions;
          let answers = submittedAnswers[j].questions;
          for (let i = 0; i < questionData.length; i++) {
            let answer = answers[i];
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
                correct++;
                dataToSend.push({ status: true });
              } else {
                incorrect++;
                totalIncorrect++;

                dataToSend.push({
                  status: false,
                  correctOptions: questionData[i].correctOptions,
                });
              }
            } else if (
              questionData[i].queType == "truefalse" ||
              questionData[i].queType == "mcq"
            ) {
              if (
                answer.option1 == questionData[i].correctOptions[0].toString()
              ) {
                totalCorrect++;
                correct++;
                dataToSend.push({ status: true });
              } else {
                totalIncorrect++;
                incorrect++;
                dataToSend.push({
                  status: false,
                  correctOptions: questionData[i].correctOptions,
                });
              }
            } else if (questionData[i].queType == "coding") {
              var data = await verifyCode(
                answer.code,
                answer.language,
                questionData[i]
              );
              correct += data.success / (data.failure + data.success);
              incorrect += data.failure / (data.failure + data.success);
              totalCorrect += data.success / (data.failure + data.success);
              totalIncorrect += data.failure / (data.failure + data.success);
            }
          }
          sectionwiseScore.push({ name: sections[j].name, correct, incorrect });
        }
        totalScore = (100 * totalCorrect) / (totalCorrect + totalIncorrect);
      }
      let newTestData = await enrolledTestsModel.updateOne(
        { _id: testData._id },
        {
          $set: {
            status: "completed",
            endTime: Date.now(),
            isResultMade: testData.testId.testType == "mock",
            score: { correct: totalCorrect, wrong: totalIncorrect },
            submittedAnswers: submittedAnswers,
            sectionwiseScore: sectionwiseScore,
          },
        }
      );
      if (testData.testId.testType == "mock") {
        let student = await studentModel.find({ _id: req.body.student });
        if (student.length > 0) {
          student = student[0];
          let test = await testModel.find({ _id: req.body.testId });
          if (test.length > 0) {
            test = test[0];
            await sendCompletionMail(
              {
                totalCorrect: totalCorrect,
                totalQuestions: totalCorrect + totalIncorrect,
                pointsEarned: { points: 0, maxPoints: 0 },
                sectionwiseScore: processSectionWiseScore(sectionwiseScore),
              },
              { name: student.name, email: student.email },
              { testName: test.name }
            );
          } else {
            console.log("Test Not Found");
          }
        } else {
          console.log("Student not found");
        }
      }
      res.status(200).send({
        totalCorrect: totalCorrect,
        totalQuestions: totalCorrect + totalIncorrect,
        pointsEarned: { points: 0, maxPoints: 0 },
        sectionwiseScore,
        test: testData?.testId,
      });
    } else {
      res.status(500).send({ message: "Quiz not Found" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: "Something went wrong" });
  }
};
module.exports = { submitTest };
