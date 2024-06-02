const { forEach } = require("lodash");
const enrolledStudentModel = require("../../../models/enrolledStudentModel");
const getStudentOverview = async (req, res) => {
  try {
    var enrolledstudent = await enrolledStudentModel
      .find({ studentId: req.body.studentId })
      .populate({
        path: "courseId",
      });
    if (enrolledstudent.length > 0) {
      let beginner = 0,
        intermediate = 0,
        advanced = 0;
      let courseArray = [],
        expArray = [];
      for (let i = 0; i < enrolledstudent.length; i++) {
        courseArray.push(enrolledstudent[i].courseId.name);
        expArray.push(Math.floor(enrolledstudent[i].exp));
        beginner += enrolledstudent[i].courseId.difficulty == "beginner";
        intermediate +=
          enrolledstudent[i].courseId.difficulty == "intermediate";
        advanced += enrolledstudent[i].courseId.difficulty == "advanced";
      }
      res.status(200).send({
        showOverview: true,
        coursesTypes: {
          beginner,
          intermediate,
          advanced,
        },
        percourseExp: {
          courseArray: courseArray,
          expArray: expArray,
        },
      });
    } else {
      res.status(200).send({ showOverview: false });
    }
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: "Something went wrong" });
  }
};
module.exports = { getStudentOverview };
