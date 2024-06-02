const { saveQuestionsData } = require("../../helpers/saveQuestionsData");
const instructorModel = require("../../models/instructorModel");
const questionModel = require("../../models/questionModel");
const testModel = require("../../models/testModel");
const testSectionModel = require("../../models/testSectionModel");

const addTest = async (req, res) => {
  try {
    let insId = req.body.instructor;
    // console.log(insId);
    let instructor = await instructorModel.find({
      _id: insId,
    });

    // console.log(req.body,instructor);
    if (instructor.length <= 0) {
      // res.status(500).send({ message: "Something went wrong" });
      return;
    }
    let testData = req.body.testData;
    if (testData) {
      let sections = testData.sections;
      let sectionsData = [];
      for (let i = 0; i < sections.length; i++) {
        let content = sections[i];
        let quizQue = [];
        // console.log("QUESTIONS", content);
        if (content.questionsInputType === "excel") {
          quizQue = await saveQuestionsData(content.questionsLink);
        } else {
          for (let k = 0; k < content.questions.length; k++) {
            let question = content.questions[k];
            let questionContent = {
              queType: question.queType,
              questionTitle: question.questionTitle,
              questionDescripton: question.questionDescripton,
              questionTitleType: question.questionTitleType,
            };
            if (question.queType == "truefalse") {
              question.options1 = "true";
              question.options2 = "false";
              question.options3 = "";
              question.options4 = "";
            }
            if (question.queType != "coding") {
              (questionContent.options = [
                question.option1,
                question.option2,
                question.option3,
                question.option4,
              ]),
                (questionContent.correctOptions = [
                  question.option1Correct,
                  question.option2Correct,
                  question.option3Correct,
                  question.option4Correct,
                ]);
            } else {
              questionContent.inputTestCases = question.inputTestCases;
              questionContent.outputTestCases = question.outputTestCases;
              questionContent.sampleTestCases = question.sampleTestCases;
            }
            // console.log("QUECONTENT",questionContent);
            questionContent = new questionModel(questionContent);
            questionContent = await questionContent.save();
            quizQue.push(questionContent._id);
          }
        }
        let quizObj = {
          type: content.type,
          name: content.name,
          description: content.description,
          questions: quizQue,
        };
        //  console.log((quizObj));
        quizObj = new testSectionModel(quizObj);
        quizObj = await quizObj.save();
        sectionsData.push(quizObj._id);
      }
      let testDataToSave = {
        name: testData.name,
        description: testData.description,
        useCamera: testData.useCamera,
        testType: testData.testType,
        instructions: testData.instructions,
        instructor: insId,
        length: testData.length,
        sections: sectionsData,
      };
      testDataToSave = new testModel(testDataToSave);
      let savedTestData = await testDataToSave.save();
      res.status(200).send({ message: "Test Added Successfully" });
    } else {
      res.status(500).send({ message: "Please Check Data" });
      return;
    }
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: "Something went wrong" });
  }
};

module.exports = { addTest };
