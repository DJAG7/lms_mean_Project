const enrolledTestsModel = require("../../models/enrolledTestModel");
const studentModel = require("../../models/studentModel");
const testModel = require("../../models/testModel");
const sectionModel = require("../../models/testSectionModel");
const { saveQuestionsData } = require("../../helpers/saveQuestionsData");
const questionModel = require("../../models/questionModel");

const createQuestion = async (data) => {
  try{
  let newQuestionBody = {
    queType: data.queType,
    queTitleType: data.questionTitleType,
    questionTitle: data.questionTitle,
    questionDescripton: data.questionDescripton,
    options: [data.option1, data.option2, data.option3, data.option4],
    correctOptions: [
      data.option1Correct,
      data.option2Correct,
      data.option3Correct,
      data.option4Correct,
    ],
  };
  if (data.queType == "coding") {
    newQuestionBody.inputTestCases = data.inputTestCases;
    newQuestionBody.outputTestCases = data.outputTestCases;
  }
  let newQuestion = new questionModel(newQuestionBody);
  newQuestion = await newQuestion.save();
   return newQuestion._id;            
}
catch(err){
  throw new Error(err)
}
};
const editQuestion = async (data) => {
  try{
  let question = await questionModel.find({ _id: data._id });
  if (question.length > 0) {
    question = question[0];
    question.queType = data.queType;
    question.queTitleType = data.questionTitleType;
    question.questionTitle = data.questionTitle;
    question.questionDescripton = data.questionDescripton;
    question.options = [data.option1, data.option2, data.option3, data.option4];
    question.correctOptions = [
      data.option1Correct,
      data.option2Correct,
      data.option3Correct,
      data.option4Correct,
    ];
    if (data.queType == "coding") {
      question.inputTestCases = data.inputTestCases;
      question.outputTestCases = data.outputTestCases;
    }
    question = await question.save();
    return question._id;
  }
  return null;     
}
catch(err){
  throw new Error(err)
}
};
const createSection = async (data) => {
  try{
  let sectionBody = {
    name: data.name,
    description: data.description,
    questions: [],
  };
  if (data.questionsInputType == "form") {
    for (let question of data.questions) {
      sectionBody.questions.push(await createQuestion(question));
    }
  } else if (data.questionsInputType == "excel") {
    sectionBody.questions = await saveQuestionsData(data.questionsLink);
  }
  sectionBody = new sectionModel(sectionBody);
  sectionBody = await sectionBody.save();
  return sectionBody._id; 
  }
  catch(err){
    throw new Error(err)
  }
};
const editSection = async (data) => {
  try{
  let section = await sectionModel.find({ _id: data._id });
  if (section.length > 0) {
    section = section[0];
    section.name = data.name;
    section.description = data.description;
    let newQuestions = [];
    if (data.questionsInputType == "form") {
      for (let question of data.questions) {
        if (question._id) {
          newQuestions.push(await editQuestion(question));
        } else {
          newQuestions.push(await createQuestion(question));
        }
      }
    } else if (data.questionsInputType == "excel") {
      newQuestions = await saveQuestionsData(data.questionsLink);
    }
    section.questions = newQuestions;
    section = await section.save();
    return section._id;
  }
  return null;

  }
  catch(err){
    throw new Error(err)
  }
};
const editTest = async (req, res) => {
  try {
    let intructorId = req.body.instructor;
    let data = req.body.testData;
    let testId = data._id;
    let test = await testModel.find({ _id: testId });
    if (test.length > 0) {
      test = test[0];
      // if(test.instructor != intructorId) { //check if instructor is owner
      test.name = data.name;
      test.description = data.description;
      test.useCamera = data.useCamera;
      test.testType = data.testType;
      (test.instructions = data.instructions),
        (test["length"] = data["length"]);
      let newSections = []; //holds new Section ids
      for (let section of data.sections) {
        if (section._id) {
          newSections.push(await editSection(section));
        } else {
          newSections.push(await createSection(section));
        }
      }
      test.sections = newSections;
      await test.save();
      res.status(200).send({ message: "Successfully edited test" });
      // }
      // else{
      // res.status(500).send({ message: "Instructor not found" });
      // }
    } else {
      res.status(500).send({ message: "unable to find test" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: "Something went wrong" });
  }
};

module.exports = { editTest };
