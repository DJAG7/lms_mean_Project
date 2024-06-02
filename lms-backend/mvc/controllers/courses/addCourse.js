const courseModel = require("../../models/courseModel.js");
const instructorModel = require("../../models/instructorModel.js");
const lessonModel = require("../../models/lessonModel.js");
const moduleModel = require("../../models/moduleModel.js");
const questionModel = require("../../models/questionModel.js");
const quizModel = require("../../models/quizModel.js");

const addCourse = async (req, res) => {
  try {
    var coursehours = 0;
    var courseminutes = 0;
    for (i = 0; i < req.body.modules.length; i++) {
      for (j = 0; j < req.body.modules[i].lessons.length; j++) {
        coursehours += req.body.modules[i].lessons[j]["length"].hour;
        courseminutes += req.body.modules[i].lessons[j]["length"].minutes;
      }
    }
    coursehours += courseminutes / 60;
    courseminutes = courseminutes % 60;
    coursehours = Math.floor(coursehours);
    let modules = req.body.modules;
    let modulesIds = [];
    for (let i = 0; i < modules.length; i++) {
      let lessons = modules[i].lessons;
      // console.log("Lessons ", lessons);
      let contentData = [];
      for (let j = 0; j < lessons.length; j++) {
        let content = lessons[j];
        if (content.type == "lesson") {
          delete content.type;
          content = new lessonModel(content);
          content = await content.save();
          contentData.push({
            type: "lesson",
            id: content._id,
          });
        } else {
          let quizQue = [];
          // console.log("QUESTIONS", content);
          let contentObj={
            type:content.type,
          }
          for (let k = 0; k < content.questions.length; k++) {
            let question = content.questions[k];
            let questionContent = {
              queType: question.queType,
              questionTitle: question.questionTitle,
              questionDescripton: question.questionDescripton,
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
            }
            // console.log("QUECONTENT",questionContent);
            questionContent=new questionModel(questionContent);
            questionContent=await questionContent.save();
            quizQue.push(questionContent._id);
          }
             let quizObj={
              type:content.type,
              name:content.name, 
              description:content.description,
              length:content.length,
              questions:quizQue
             }
            //  console.log((quizObj));
              quizObj=new quizModel(quizObj)
              quizObj =await quizObj.save();
              contentObj.id=quizObj._id;
              contentData.push(contentObj);
        }
      }
      delete modules[i].lessons;
      modules[i].content=contentData;
      let curmodule=new moduleModel(modules[i]);
      curmodule=await curmodule.save();
      // console.log("MODULE  ",curmodule);
      modulesIds.push(curmodule._id)
    }
    // console.log("MODULE IDS", modulesIds);
    course = new courseModel({
      name: req.body.name,
      description: req.body.description,
      instructors: req.body.instructors,
      trailer: req.body.trailer,
      thumbnail: req.body.thumbnail,
      difficulty: req.body.difficulty,
      keyPoints: req.body.keypoints,
      modules: modulesIds,
      thumbnail: req.body.thumbnail,
      courseHours: coursehours,
      courseMinutes: courseminutes,
      tags: req.body.tags,
      price:req.body.price
    });
       course=await course.save();
    for (let i = 0; i < req.body.instructors.length; i++) {
      let instructor = await instructorModel.findById(req.body.instructors[i]);
      instructor.courses.push(course._id);
      let newIns=await instructor.save();
    }
    res.status(200).send({ message: "Successfully added course" });
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: "Something went wrong" });
  }
};
module.exports = { addCourse };
