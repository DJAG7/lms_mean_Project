const lessonModel = require("../../../models/lessonModel");
const enrolledStudentsModel = require("../../../models/enrolledStudentModel");
const courseModel = require("../../../models/courseModel");
const getStudentLesson = async (req, res) => {
  try {
    var enrolledCourse = await enrolledStudentsModel.find({
      studentId: req.body.studentId,
      courseId: req.body.courseId,
    });
    if (enrolledCourse.length > 0) {
      enrolledCourse = enrolledCourse[0];
      courseCompleted = false;
      var modules = enrolledCourse.modules;
      var previous = {
        type:"",
        moduleId: "-1",
        lessonId: "-1",
      };
      var next = {
        type:"",
        moduleId: "-1",
        lessonId: "-1",
      };
      var foundLesson = false;
      var currentLesson = null;
      var lessonCompleted = false;
      for (let [moduleIndex, module] of modules.entries()) {
        for (let [lessonIndex, lesson] of module.content.entries()) {
          if (lesson.contentId == req.body.lessonId) {
            foundLesson = true;
            lessonCompleted = lesson.isCompleted;
            if (lessonIndex < module.content.length - 1) {
              next.type = module.content[lessonIndex + 1].type;
              next.moduleId = module.moduleId;
              next.lessonId = module.content[lessonIndex + 1].contentId;
            } else {
              enrolledCourse.modulesCompleted += 1;
              if (moduleIndex < modules.length - 1) {
                next.type = modules[moduleIndex + 1].content[0].type;
                next.moduleId = modules[moduleIndex + 1].moduleId;
                next.lessonId = modules[moduleIndex + 1].content[0].contentId;
              }
            }
            currentLesson = await lessonModel.find({_id:lesson.contentId});
            break;
          } else {
            previous.type = lesson.type;
            previous.moduleId = module.moduleId;
            previous.lessonId = lesson.contentId;
          }
        }
        if (foundLesson) break;
      }
      // console.log(enrolledCourse);
      courseCompleted =
        enrolledCourse.modules.length == enrolledCourse.modulesCompleted;
        // console.log(currentLesson);
      var course = await courseModel.find({_id:req.body.courseId}).populate({
        path:'instructors',
        model:"instructor"
      }).select("name instructors");
      res
        .status(200)
        .send({ data: {previousLesson:previous, nextLesson: next, courseCompleted: courseCompleted ,lessonCompleted:lessonCompleted,currentLesson:currentLesson[0] },course:course[0] });
    } else {
      res.status(500).send({ message: "Not enrolled in course" });
    }

    //OLD
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: "Something went wrong" });
  }
};
module.exports = { getStudentLesson };
