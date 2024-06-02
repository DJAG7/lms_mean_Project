const courseModel = require("../../../models/courseModel");
const lessonModel = require("../../../models/lessonModel");
const moduleModel = require("../../../models/moduleModel");
const questionModel = require("../../../models/questionModel");
const quizModel = require("../../../models/quizModel");
const instructorModel = require("../../../models/instructorModel");
const enrolledStudentModel = require("../../../models/enrolledStudentModel");

async function createModule(data) {
  data.content = data.lessons;
  delete data.lessons;
  let newContentArray = [];
  for (let i = 0; i < data.content.length; i++) {
    let contentId = await createContent(data.content[i]);
    newContentArray.push({
      type: data.content[i].type,
      id: contentId,
      _id: data.content[i]._id,
    });
  }
  data.content = newContentArray;

  let module = new moduleModel(data);
  module = await module.save();
  return module._id;
}

async function createContent(data) {
  delete data._id;
  if (data.type == "lesson") {
    let lesson = new lessonModel(data);
    lesson = await lesson.save();
    return lesson._id;
  } else {
    let newQuestionsArray = [];
    for (let i = 0; i < data.questions.length; i++) {
      let questionId = await createQuestion(data.questions[i]);
      newQuestionsArray.push(questionId);
    }
    data.questions = newQuestionsArray;
    let quiz = new quizModel(data);
    quiz = await quiz.save();
    return quiz._id;
  }
}
async function createQuestion(data) {
  // console.log(data);
  delete data._id;
  let question = new questionModel(data);
  question.options = [data.option1, data.option2, data.option3, data.option4];

  // question.correctOptions =
  //   questionsArray[k].correctOptions;

  question.correctOptions = [
    data.option1Correct,
    data.option2Correct,
    data.option3Correct,
    data.option4Correct,
  ];
  if (data.queType == "coding") {
    question.inputTestCases = data.inputTestCases;
  }
  question = await question.save();
  return question._id;
}
async function generateEnrolledContent(newContent, oldContent = false) {
  tempContent = [];
  if (oldContent) {
    for (let content of newContent) {
      let index = await oldContent.findIndex((e) => e.contentId == content.id);
      if (index != -1) {
        tempContent.push(oldContent[index]);
      } else {
        tempContent.push({
          type: content.type,
          contentId: content.id,
          isCompleted: false,
        });
      }
    }
  } else {
    for (let content of newContent) {
      tempContent.push({
        type: content.type,
        contentId: content.id,
        isCompleted: false,
      });
    }
  }
  return tempContent;
}
async function updateEnrolledStudents(courseId, modules) {
  let enrolledStudents = await enrolledStudentModel.find({
    courseId: courseId,
  });

  for (let item of enrolledStudents) {
    let oldModules = item.modules;
    let newModules = modules;
    let resModules = [];
    for (let i = 0; i < newModules.length; i++) {
      let tempModule = await moduleModel.find({ _id: newModules[i] });
      tempModule = tempModule[0];
      if (i < oldModules.length && oldModules[i].moduleId == newModules[i]) {
        oldModules[i].content = await generateEnrolledContent(
          tempModule.content,
          oldModules[i].content
        );
        resModules.push(oldModules[i]);
      } else if (oldModules.find((e) => e.moduleId == newModules[i])) {
        let index = oldModules.findIndex((e) => e.moduleId == newModules[i]);
        oldModules[index].content = await generateEnrolledContent(
          tempModule.content,
          oldModules[index].content
        );
        res.push(oldModules[index]);
      } else {
        let newModule = {
          moduleId: tempModule._id,
          contentCompleted: 0,
          content: [],
        };
        newModule.content = await generateEnrolledContent(tempModule.content);
        resModules.push(newModule);
      }
    }
    item.modules = resModules;
    await item.save();
  }
}

const editCourse = async (req, res) => {
  try {
    let instructor = await instructorModel
      .find({ _id: req.body.instructorId })
      .select("courses");
    if (instructor.length > 0) {
      instructor = instructor[0];
      if (instructor.courses.includes(req.body._id)) {
        let course = await courseModel.find({ _id: req.body._id });
        if (course.length > 0) {
          course = course[0];
          let courseData = req.body;
          course.name = courseData.name;
          course.description = courseData.description;
          course.tags = courseData.tags;
          course.trailer = courseData.trailer;
          course.thumbnail = courseData.thumbnail;
          course.price = courseData.price;
          course.difficulty = courseData.difficulty;

          let courseModules = courseData.modules;
          let newModulesArray = [];
          for (let i = 0; i < courseModules.length; i++) {
            if (!courseModules[i]._id) {
              //For new module
              let newModuleId = await createModule(courseModules[i]);
              newModulesArray.push(newModuleId);
            } else {
              let module = await moduleModel.find({
                _id: courseModules[i]._id,
              });
              module = module[0];
              newModulesArray.push(module._id);
              module.name = courseModules[i].name;
              module.description = courseModules[i].description;
              let contentArray = courseModules[i].lessons;
              let newContentArray = [];
              for (let j = 0; j < contentArray.length; j++) {
                if (!contentArray[j]._id) {
                  //For new content
                  // console.log("HELLO123");
                  let newContentId = await createContent(contentArray[j]);
                  newContentArray.push({
                    type: contentArray[j].type,
                    id: newContentId,
                  });
                  // console.log(newContentArray);
                } else {
                  if (contentArray[j].type == "lesson") {
                    let content = await lessonModel.find({
                      _id: contentArray[j]._id,
                    });
                    content = content[0];
                    newContentArray.push({
                      type: contentArray[j].type,
                      id: content._id,
                    });
                    content.name = contentArray[j].name;
                    content.description = contentArray[j].description;
                    content.content = contentArray[j].content;
                    content["length"] = contentArray[j]["length"];
                    await content.save();
                  } else {
                    let content = await quizModel.find({
                      _id: contentArray[j]._id,
                    });
                    content = content[0];
                    newContentArray.push({
                      type: contentArray[j].type,
                      id: content._id,
                    });
                    content.name = contentArray[j].name;
                    content.description = contentArray[j].description;
                    content["length"] = contentArray[j]["length"];
                    let questionsArray = contentArray[j]["questions"];
                    let newQuestionsArray = [];
                    for (let k = 0; k < questionsArray.length; k++) {
                      if (!questionsArray[k]._id) {
                        // for new question
                        let newQuestionId = await createQuestion(
                          questionsArray[k]
                        );
                        newQuestionsArray.push(newQuestionId);
                      } else {
                        let question = await questionModel.find({
                          _id: questionsArray[k]._id,
                        });
                        question = question[0];
                        newQuestionsArray.push(question._id);
                        question.queType = questionsArray[k].queType;
                        question.questionTitle =
                          questionsArray[k].questionTitle;
                        question.questionDescripton =
                          questionsArray[k].questionDescripton;
                        question.options = questionsArray[k].options;

                        question.options = [
                          questionsArray[k].option1,
                          questionsArray[k].option2,
                          questionsArray[k].option3,
                          questionsArray[k].option4,
                        ];

                        // question.correctOptions =
                        //   questionsArray[k].correctOptions;

                        question.correctOptions = [
                          questionsArray[k].option1Correct,
                          questionsArray[k].option2Correct,
                          questionsArray[k].option3Correct,
                          questionsArray[k].option4Correct,
                        ];
                        if (questionsArray.queType == "coding") {
                          question.inputTestCases =
                            questionsArray[k].inputTestCases;
                        }
                        await question.save();
                      }
                    }
                    content.questions = newQuestionsArray;
                    await content.save();
                  }
                }
              }
              module.content = newContentArray;
              await module.save();
            }
          }
          course.modules = newModulesArray;
          await course.save();
          await updateEnrolledStudents(course._id, course.modules);
          res.status(200).send({ message: "Course saved successfully" });
        } else {
          res.status(500).send({ message: "Course not found" });
        }
      } else {
        res.status(500).send({ message: "unable to verify course" });
      }
    } else {
      res.status(500).send({ message: "Instructor not found" });
    }
  } catch (e) {
    console.log(e);
    res.status(500).send({ message: "something went wrong" });
  }
};

module.exports = { editCourse };
