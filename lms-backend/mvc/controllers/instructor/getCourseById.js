const { cloneDeep } = require("lodash");
const courseModel = require("../../models/courseModel");
const instructorModel = require("../../models/instructorModel");
const lessonModel = require("../../models/lessonModel");
const quizModel = require("../../models/quizModel");
const questionModel = require("../../models/questionModel");
const getCoursebyId = async (req, res) => {
  try {
    let courseId = req.body.courseId;
    let insId = req.body.instructor;
    let instructor = await instructorModel.find({
      _id: insId,
    });
    if (instructor.length > 0) {
      instructor = instructor[0];
      let courses = instructor.courses;
      // courses.forEach(ele=>console.log(ele));
      let flag = courses.filter((ele) => ele.equals(courseId));
      if (flag.length > 0) {
        let courseDat = await courseModel
          .find({ _id: courseId })
          .populate({
            path: "modules",
          })
          .populate({
            path: "instructors",
            model: "instructor",
            select: "firstname lastname profilePicture",
          });
        if (courseDat.length <= 0) {
          res.status(400).send({ message: "Course not Found" });
          return;
        }
        let course = cloneDeep(courseDat[0]);

        let newCourseData = {
          rating: course.rating,
          _id: course._id,
          name: course.name,
          description: course.description,
          courseHours: course.courseHours,
          courseMinutes: course.courseMinutes,
          thumbnail: course.thumbnail,
          instructors: course.instructors,
          trailer: course.trailer,
          difficulty: course.difficulty,
          keyPoints: course.keyPoints,
          price: course.price,
          tags: course.tags,
          modules: [],
        };
        let modules = course.modules;
        for (let i = 0; i < modules.length; i++) {
          let content = modules[i].content;

          let contentData = [];
          for (let j = 0; j < content.length; j++) {
            if (content[j].type == "lesson") {
              let contentLesson = await lessonModel.find({
                _id: content[j].id,
              });
              contentLesson = contentLesson[0];
              let newContent = {
                type: content[j].type,
                _id: contentLesson._id,
                name: contentLesson.name,
                description: contentLesson.description,
                length: contentLesson["length"],
                content: contentLesson.content,
              };
              contentData.push(newContent);
              // console.log(contentLesson);
            } else {
              // console.log(content[j]);
              let contentQuiz = await quizModel.find({ _id: content[j].id });
              contentQuiz = contentQuiz[0];
              if (!contentQuiz) continue;
              let questions = contentQuiz.questions;
              let questionData = [];
              for (let k = 0; k < questions.length; k++) {
                let question = await questionModel.find({ _id: questions[k] });
                question = question[0];
                questionData.push(question);
              }
              let newContent = {
                type: content[j].type,
                _id: contentQuiz._id,
                name: contentQuiz.name,
                description: contentQuiz.description,
                length: contentQuiz["length"],
                questions: contentQuiz.questions,
              };

              newContent.questions = questionData;
              contentData.push(newContent);
              // console.log(newContent);
              // console.log(contentQuiz);
            }
          }
          // console.log(contentData);
          let newModuleData = {
            _id: modules[i]._id,
            name: modules[i].name,
            description: modules[i].description,
            content: contentData,
          };
          newCourseData.modules.push(newModuleData);
          course.modules[i].content = contentData;
        }
        // console.log(JSON.stringify(course))
        res.send({ course: newCourseData });
        return;
      } else {
        res.status(401).send({ message: "access denied" });
      }
      // res.send(x)
    } else {
      res.status(500).send({ message: "instructor not found" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: "Something went wrong" });
  }
};
module.exports = { getCoursebyId };
