const { request } = require("express");
const courseModel = require("../../../models/courseModel");
const enrolledStudentsModel = require("../../../models/enrolledStudentModel");
const studentModel = require("../../../models/studentModel");

const enrollCourse = async (req, res) => {
  try {
    var courses = await courseModel.find({ _id: req.body.courseid }).populate({
      path: "modules",
    });
    // console.log(courses,req.body);
    courses = courses[0];

    let modules = courses.modules;
    // console.log("modules",modules);
    let modulesTracker = [];
    for (let i = 0; i < modules.length; i++) {
      let content = modules[i].content;
      // console.log("Content",content);
      let contentTracker = [];
      for (let j = 0; j < content.length; j++) {
        let contentInfo = {
          type: content[j].type,
          contentId: content[j].id,
          isCompleted: false,
        };
        contentTracker.push(contentInfo);
      }
      let moduleInfo = {
        moduleId: modules[i]._id,
        contentCompleted: 0,
        content: contentTracker,
      };
      modulesTracker.push(moduleInfo);
    }
    let student = await studentModel.find({ email: req.body.email });
    if (student.length > 0) {
      student = student[0];
      var enrolledStudentcheck = await enrolledStudentsModel.find({
        courseId: req.body.courseid,
        studentId: student._id,
      });
      // console.log(enrolledStudentcheck);
      if (enrolledStudentcheck.length > 0) {
        res.status(500).send({ message: "Student already Enrolled" });
        return;
      }
      let enrollCourse = new enrolledStudentsModel({
        courseId: req.body.courseid,
        studentId: student._id,
        modulesCompleted: 0,
        modules: modulesTracker,
      });
      enrollCourse = await enrollCourse.save();
      res.status(200).send({ courses: courses });
    } else {
      res.status(200).send({ message: "Student not forund" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: "Something went wrong" });
  }
};
module.exports = { enrollCourse };
