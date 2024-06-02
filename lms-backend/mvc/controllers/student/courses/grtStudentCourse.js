const studentModel = require("../../../models/studentModel");
const lessonModel = require("../../../models/lessonModel");

const quizModel = require("../../../models/quizModel");
const enrolledStudentModel = require("../../../models/enrolledStudentModel");
const getStudentCourse = async (req, res) => {
  try {
    var enrolledCourse = await enrolledStudentModel
      .find({ studentId: req.body.studentid, courseId: req.body.courseid })
      .populate({
        path: "courseId",
        populate: {
          path: "instructors",
          model: "instructor",
          select: "firstname lastname profilePicture",
        },
        populate: {
          path: "modules",
          model: "modules",
        },
      });
    if (enrolledCourse.length > 0) {
      enrolledCourse = enrolledCourse[0];
      courseModules = [];
      completed = false;
      resumeLessonId = "";
      resumeModuleId = "";

      for (var i = 0; i < enrolledCourse.modules.length; i++) {
        courseModules.push({
          content: [],
          name: enrolledCourse.modules[i].name,
          description: enrolledCourse.modules[i].description,
          _id: enrolledCourse.modules[i]._id,
        });
        for (let j = 0; j < enrolledCourse.modules[i].content.length; j++) {
          if (enrolledCourse.modules[i].content[j].type == "lesson") {
            var content = await lessonModel.find({
              _id: enrolledCourse.modules[i].content[j].contentId,
            });
            content = content[0];

            var obj = {
              isCompleted: enrolledCourse.modules[i].content[j].isCompleted,
              type: enrolledCourse.modules[i].content[j].type,
              contentId: enrolledCourse.modules[i].content[j].contentId,
              length: content["length"],
              name: content["name"],
              description: content["description"],
              content: content["content"],
            };
            courseModules[i].content.push(obj);
          } else {
            var content = await quizModel
              .find({
                _id: enrolledCourse.modules[i].content[j].contentId,
              })
              .populate({
                path: "questions",
                model: "question",
              });
            if (content[0]) {
              var obj = {
                isCompleted: enrolledCourse.modules[i].content[j].isCompleted,
                type: enrolledCourse.modules[i].content[j].type,
                contentId: enrolledCourse.modules[i].content[j].contentId,
                length: content[0]["length"],
                name: content[0]["name"],
                description: content[0]["description"],
              };
              courseModules[i].content.push(obj);
            }
          }
        }
      }

      resumeFlag = false;
      for (var i = 0; i < enrolledCourse.modules.length; i++) {
        for (var j = 0; j < enrolledCourse.modules[i].content.length; j++) {
          if (!enrolledCourse.modules[i].content[j].isCompleted) {
            resumeLessonId = enrolledCourse.modules[i].content[j].contentId;
            resumeModuleId = enrolledCourse.modules[i].moduleId;
            resumeFlag = true;
            break;
          }
        }
        if (resumeFlag) break;
      }
      if (!resumeFlag) {
        completed = true;
      }

      res.status(200).send({
        enrollId: enrolledCourse._id,
        course: enrolledCourse.courseId,
        courseModules: courseModules,
        enrolledCourseModulesMappings: enrolledCourse.modules,
        courseId: enrolledCourse.courseId._id,
        resumeLessonId: resumeLessonId,
        resumeModuleId: resumeModuleId,
        completed: completed,
      });
    } else {
      res.status(500).send({ message: "Student or course not found" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: "Something went wrong" });
  }
};
module.exports = { getStudentCourse };
