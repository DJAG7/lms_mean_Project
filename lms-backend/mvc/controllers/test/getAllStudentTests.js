const enrolledTestsModel = require("../../models/enrolledTestModel");
const getSectionwiseScore = async (test) => {
  // console.log("hello");
  if (test.submittedAnswers && test.submittedAnswers.length > 0) {
    let sections = test.testId.sections;
    let submittedAnswers = test.submittedAnswers;
    let sectionwiseScore = [];
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
            correct++;
          } else {
            incorrect++;
          }
        } else if (
          questionData[i].queType == "truefalse" ||
          questionData[i].queType == "mcq"
        ) {
          if (answer.option1 == questionData[i].correctOptions[0]) {
            correct++;
          } else {
            incorrect++;
          }
        } else if (questionData[i].queType == "coding") {
          var data = await verifyCode(
            answer.code,
            answer.language,
            questionData[i]
          );
          correct += data.success;
          incorrect += data.failure;
        }
      }
      sectionwiseScore.push({ name: sections[j].name, correct, incorrect });
    }
    let newTestData = await enrolledTestsModel.updateOne(
      { _id: test._id },
      {
        $set: {
          sectionwiseScore: sectionwiseScore,
        },
      }
    );
    return newTestData.sectionwiseScore;
  }
  return [];
};
const getStudentTests = async (req, res) => {
  try {
    //  console.log(req.body);

    var testsData = await enrolledTestsModel
      .find({
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
    if (testsData.length > 0) {
      console.log();
      res.status(200).send({
        tests: await Promise.all(
          testsData.map(async (test) => {
            // console.log(test);
            return {
              enrolledTestId: test._id,
              ...test.testId.toObject(),
              sections: test.testId.sections.length,
              status: test.status,
              score: test.score,
              sectionwiseScore: test.sectionwiseScore
                ? test.sectionwiseScore
                : await getSectionwiseScore(test),
              isResultMade: test.isResultMade,
            };
          })
        ),
      });
    } else {
      res.status(200).send({ message: "No Tests Assigned" });
    }
  } catch (err) {
    res.status(500).send({ message: "Something went wrong" });
  }
};
module.exports = { getStudentTests };
