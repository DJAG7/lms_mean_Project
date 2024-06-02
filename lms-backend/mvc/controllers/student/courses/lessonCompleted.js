const enrolledStudentsModel = require("../../../models/enrolledStudentModel");
const { calculateExperience } = require("./calculateExperience");
const lessonCompleted = async (req, res) => {
  try {
    var enrolledCourse = await enrolledStudentsModel.find({
      studentId: req.body.studentId,
      courseId: req.body.courseId,
    });
    if (enrolledCourse.length > 0) {
      enrolledCourse = enrolledCourse[0];
      courseCompleted = false;
      var modules = enrolledCourse.modules;
      var foundLesson = false;
      for (let [moduleIndex, module] of modules.entries()) {
        for (let [lessonIndex, lesson] of module.content.entries()) {
          if (lesson.contentId == req.body.lessonId) {
            foundLesson = true;
            if (!lesson.isCompleted) {
              lesson.isCompleted = true;
              module.contentCompleted += 1;
              if (lessonIndex >= module.content.length - 1) {
                enrolledCourse.modulesCompleted += 1;
              }
              await calculateExperience(req.body.studentId,req.body.courseId,true,false);
            }
            break;
          }
        }
        if (foundLesson) break;
      }
      // console.log(enrolledCourse);
      await enrolledCourse.save();
      courseCompleted =
        enrolledCourse.modules.length == enrolledCourse.modulesCompleted;
      res.status(200).send({ data: { courseCompleted: courseCompleted } });
    } else {
      res.status(500).send({ message: "Not enrolled in course" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: "Something went wrong" });
  }
};
module.exports = { lessonCompleted };
