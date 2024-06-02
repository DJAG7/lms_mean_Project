const enrolledStudentModel = require("../../../models/enrolledStudentModel");
const { getImageProxyHandler } = require("../../proxy/getImageProxyHandler");
const getStudentCourses = async (req, res) => {
  try {
    var enrolledcourses = await enrolledStudentModel
      .find({ studentId: req.body.studentid })
      .populate({
        path: "courseId",
        populate: {
          path: "instructors",
          model: "instructor",
          select: "firstname lastname profilePicture",
        },
      });
    var courses = [];
    var resumeLessonId, resumeModuleId, type, resumeFlag;
    for (let course of enrolledcourses) {
      resumeFlag = false;
      for (let i = 0; i < course.modules.length; i++) {
        for (let j = 0; j < course.modules[i].content.length; j++) {
          if (!course.modules[i].content[j].isCompleted) {
            type = course.modules[i].content[j].type;
            resumeLessonId = course.modules[i].content[j].contentId;
            resumeModuleId = course.modules[i].moduleId;
            resumeFlag = true;
            break;
          }
        }
        if (resumeFlag) break;
      }
      let thumbnail = await getImageProxyHandler(course.courseId.thumbnail);
      courses.push({
        _id: course.courseId._id,
        name: course.courseId.name,
        courseHours: course.courseId.courseHours,
        courseMinutes: course.courseId.courseMinutes,
        instructors: course.courseId.instructors,
        thumbnail: thumbnail,
        type: type,
        resumeLessonId: resumeLessonId,
        resumeModuleId: resumeModuleId,
        courseCompleted: !resumeFlag,
        modulesLength: course.modules.length,
      });
    }
    // console.log(courses);
    res.status(200).send({ courses: courses });
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: "Something went wrong" });
  }
};
module.exports = { getStudentCourses };
