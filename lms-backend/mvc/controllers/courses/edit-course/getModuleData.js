const courseModel = require("../../../models/courseModel");
const lessonModel = require("../../../models/lessonModel");
const moduleModel = require("../../../models/moduleModel");
const questionModel = require("../../../models/questionModel");
const quizModel = require("../../../models/quizModel");
// const instructorModel = require("../../models/instructorModel");
const getModuleData = async (req, res) => {
  try {
    //  console.log(req.body);
    //     let instructor = await instructorModel
    //     .find({
    //       _id: req.body.instructorId
    //     })
    //     if (instructor.length > 0) {
    //         instructor = instructor[0];
    //         let courses = instructor.courses;
    //         // courses.forEach(ele=>console.log(ele));
    //         let flag=courses.filter(ele=>ele.equals(req.body.courseId));
    //         if(flag.length===0){
    //             res.status(500).send({ message: "Not Authorised" });
    //             return;
    //         }
    //     }
    //    let course=await courseModel.find({_id:req.body.courseId});
    //    if(!course){
    //     res.status(500).send({ message: "Course not found" });
    //     return;
    //    }
    let module = await moduleModel.find({ _id: req.body.moduleId });
    let newModuleData;
    module = module[0];
    // console.log(module);
    let content = module.content;

    let contentData = [];
    for (let j = 0; j < content.length; j++) {
      if (content[j].type == "lesson") {
        let contentLesson = await lessonModel.find({ _id: content[j].id });
        contentLesson = contentLesson[0];
        let newContent={
            type:content[j].type,
            _id: contentLesson._id,
            name: contentLesson.name,
            description: contentLesson.description,
            length: contentLesson["length"],
            content: contentLesson.content,
        }
        contentData.push(newContent);
        // console.log(contentLesson);
      } else {
        let contentQuiz = await quizModel.find({ _id: content[j].id });
        contentQuiz = contentQuiz[0];
        let questions = contentQuiz.questions;
        let questionData = [];
        for (let k = 0; k < questions.length; k++) {
          let question = await questionModel.find({ _id: questions[k] });
          question = question[0];
          questionData.push(question);
        }
        let newContent = {
          type:content[j].type,
          _id: contentQuiz._id,
          name: contentQuiz.name,
          description: contentQuiz.description,
          length: contentQuiz["length"],
          questions: contentQuiz.questions,
        };

        newContent.questions = questionData;
        contentData.push(newContent);
        // console.log(newContent);
      }
      newModuleData = {
        _id: module._id,
        name: module.name,
        description: module.description,
        content: contentData,
      };
      // console.log("New Module",newModuleData);
    }
    res.send({ newModuleData });
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: "Something went wrong" });
  }
};
module.exports = { getModuleData };
