const studentModel = require("../../../models/studentModel");
const lessonModel = require("../../../models/lessonModel");
const courseModel = require("../../../models/courseModel");
const quizModel = require("../../../models/quizModel");
const questionModel = require("../../../models/questionModel");
const enrolledStudentModel = require("../../../models/enrolledStudentModel");
const { cloneDeep } = require("lodash");

const getCourse = async (req, res) => {
  try {
    let enrolled = false;
    if (req.body.userId) {
      let enrolledStudent = await enrolledStudentModel.find({
        courseId: req.body.courseid,
        studentId: req.body.userId,
      });
      if (enrolledStudent.length) enrolled = true;
    }
    var course = await courseModel
      .find({ _id: req.body.courseid })
      .populate({
        path: "modules",
        model: "modules",
        populate: {
          path: "content",
        },
      })
      .populate({
        path: "instructors",
      });
    if (course.length > 0) {
      course = cloneDeep(course[0]);

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
        enrolled: enrolled,
      };
      let modules = course.modules;
      let courseLecturesLength = 0;
      for (let i = 0; i < modules.length; i++) {
        let content = modules[i].content;

        let contentData = [];
        courseLecturesLength += content.length;
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
            let questions = contentQuiz.questions;

            let newContent = {
              type: content[j].type,
              _id: contentQuiz._id,
              name: contentQuiz.name,
              description: contentQuiz.description,
              length: contentQuiz["length"],
            };

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
      newCourseData.courseLecturesLength = courseLecturesLength;
      // console.log(JSON.stringify(course))
      res.status(200).send({ course: newCourseData });
    } else {
      res.status(500).send({ message: "Course not found" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: "Something went wrong" });
  }
};
module.exports = { getCourse };
