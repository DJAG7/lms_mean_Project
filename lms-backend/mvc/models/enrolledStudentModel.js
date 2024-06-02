const { Mongoose } = require("mongoose");

const mongoose = require("./conn").mongoose;
const EnrolledStudentsSchema = mongoose.Schema({
  exp: {
    type: Number,
    default: 0,
  },
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "courses",
  },
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "students",
  },
  modulesCompleted: {
    type: Number,
  },
  modules: [
    {
      moduleId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "modules",
      },
      contentCompleted: {
        type: Number,
      },
      content: [
        {
          type: {
            type: String,
          },
          score: {
            type: Number,
            default: 0,
          },
          submittedAnswers: {
            type: Array,
          },
          totalCorrect: {
            type: Number,
          },
          totalIncorrect: {
            type: Number,
          },
          contentId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "lessons",
          },
          isCompleted: {
            type: Boolean,
          },
          pointsEarned: {
            type: Number,
          },
        },
      ],
    },
  ],
});

let enrolledStudentsModel = mongoose.model(
  "enrolledStudents",
  EnrolledStudentsSchema
);
module.exports = enrolledStudentsModel;
