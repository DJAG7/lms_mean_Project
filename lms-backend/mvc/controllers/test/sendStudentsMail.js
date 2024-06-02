const enrolledTestsModel = require("../../models/enrolledTestModel");
const testModel = require("../../models/testModel");
const studentModel = require("../../models/studentModel");
const { createMailChart } = require("../ses/createMailChart");
const { sendEmail } = require("../ses/sendEmail");
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
  let score = Math.floor((data.totalCorrect / data.totalQuestions) * 100);
  await sendEmail(
    userDetails.email,
    userDetails.name,
    `<html><body>Congratulations ${userDetails.name},<br/>
    <h3>You have Successfully completed ${test.testName}</h3><br/> <h3> Score :${score}%</h3><br/><img src="${sectionwiseChart}"></img><br/></body></html>`
  );
};
const sendStudentsMail = async (req, res) => {
  try {
    var testDataResults = await enrolledTestsModel.find({
      testId: req.body.testId,
      status: "completed",
      isMailSent: false,
      isResultMade: true,
    });
    if (testDataResults) {
      for (let testData of testDataResults) {
        let student = await studentModel.find({ _id: testData.studentId });
        if (student.length > 0) {
          student = student[0];
          let test = await testModel.find({ _id: testData.testId._id });
          if (test.length > 0) {
            test = test[0];
            console.log(testData);
            await sendCompletionMail(
              {
                totalCorrect: testData.score.correct,
                totalQuestions: testData.score.correct + testData.score.wrong,
                pointsEarned: { points: 0, maxPoints: 0 },
                sectionwiseScore: processSectionWiseScore(
                  testData.sectionwiseScore
                ),
              },
              { name: student.name, email: student.email },
              { testName: test.name }
            );
            testData.isMailSent = true;
            await testData.save();
          } else {
            console.log("Test Not Found");
          }
        } else {
          console.log("Student not found");
        }
      }
      res.status(200).send({ message: "mails sent successfully" });
    } else {
      res.status(500).send({ message: "Test Data not found" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: "Something went wrong" });
  }
};
module.exports = { sendStudentsMail };
