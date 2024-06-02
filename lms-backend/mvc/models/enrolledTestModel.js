const { Mongoose } = require("mongoose");

const mongoose = require("./conn").mongoose;
const EnrolledTestSchema = mongoose.Schema(
  {
    testId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "test",
    },
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "students",
    },
    status: {
      type: String,
      enum: ["pending", "completed", "started", "expired"],
    },
    isResultMade: {
      type: Boolean,
      default: true,
    },
    isMailSent: {
      type: Boolean,
      default: false,
    },
    startTime: {
      type: String,
    },
    endTime: {
      type: String,
    },
    webcamImages: {
      type: Array,
    },
    screenImages: {
      type: Array,
    },
    score: {
      correct: {
        type: Number,
        default: -999,
      },
      wrong: {
        type: Number,
        default: -999,
      },
    },
    submittedAnswers: {
      type: Array,
    },
    sectionwiseScore: {
      type: Array,
    },
  },
  {
    timestamps: { createdAt: "registeredTime", updatedAt: "accessTime" },
  }
);

let enrolledTestsModel = mongoose.model("enrolledTest", EnrolledTestSchema);
module.exports = enrolledTestsModel;
