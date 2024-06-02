const studentModel = require("../../../models/studentModel");
const enrolledStudentModel = require("../../../models/enrolledStudentModel");
const courseModel = require("../../../models/courseModel");
const expPoints = {
  beginner: 500,
  intermediate: 1200,
  advanced: 3000,
};
const calculateExperience = async (
  studentId,
  courseId,
  lessonCompleted = false,
  quizCompleted = false,
  quizType = "",
  score = 0
) => {
  var enrolledCourse = await enrolledStudentModel
    .find({
      courseId: courseId,
      studentId: studentId,
    })
    .populate({
      path: "courseId",
      model: "courses",
      select: "difficulty",
    });
  if (enrolledCourse.length > 0) {
    enrolledCourse = enrolledCourse[0];
    var coursePoints = expPoints[enrolledCourse.courseId.difficulty];
    var ModulePoints = (coursePoints * 40) / 100,
      assignmentPoints = (coursePoints * 25) / 100,
      assessmentPoints = (coursePoints * 35) / 100;
    nullPoints = 0;
    var numOfLessons = 0,
      numOfAssignments = 0,
      numOfAssessments = 0;
    let modules = enrolledCourse.modules;
    for (let module of modules) {
      for (let item of module.content) {
        if (item.type == "lesson") numOfLessons += 1;
        else if (item.type == "assessment") numOfAssessments += 1;
        else if (item.type == "assignment") numOfAssignments += 1;
      }
    }
    if (numOfLessons == 0) {
      nullPoints += ModulePoints;
    }
    if (numOfAssessments == 0) {
      nullPoints += assessmentPoints;
    }
    if (numOfAssignments == 0) {
      nullPoints += assignmentPoints;
    }
    var perLessonPoints = ModulePoints / numOfLessons,
      perAssessmentPoints = assessmentPoints / numOfAssessments,
      perAssignmentPoints = assignmentPoints / numOfAssignments;
    perTaskNullPoints =
      nullPoints / (numOfAssignments + numOfLessons + numOfAssignments);

    var pointsEarned = 0;
    if (lessonCompleted) {
      pointsEarned = perLessonPoints + perTaskNullPoints;
    } else if (quizCompleted && quizType == "assignment") {
      pointsEarned = (perAssignmentPoints * score) / 100 + perTaskNullPoints;
    } else if (quizCompleted && quizType == "assessment") {
      pointsEarned = (perAssessmentPoints * score) / 100 + perTaskNullPoints;
    }

    enrolledCourse.exp += pointsEarned;

    var student = await studentModel.find({ _id: studentId });
    if (student.length > 0) {
      student = student[0];
      
      student.exp += pointsEarned;
      // console.log(pointsEarned);
      // await student.save();
      await enrolledCourse.save();
      return {points:pointsEarned,maxPoints:(quizType == "assessment"?perAssessmentPoints:perAssignmentPoints)+perTaskNullPoints};
    }
  }
};
module.exports = { calculateExperience };
