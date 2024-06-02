const { SchemaTypes } = require("mongoose");
const { Mongoose } = require("mongoose");

const mongoose = require("./conn").mongoose;
const questionSchema = mongoose.Schema({
  queType: {
    type: String,
  },
  questionTitle: {
    type: String,
  },
  questionTitleType: {
    type: String,
  },
  questionDescripton: {
    type: String,
  },
  tags: {
    type: Array,
  },
  options: {
    type: Array,
  },
  correctOptions: {
    type: Array,
  },
  inputTestCases: {
    type: SchemaTypes.Mixed,
  },
  sampleTestCases: {
    type: SchemaTypes.Mixed,
  },
  outputTestCases: {
    type: SchemaTypes.Mixed,
  },
});

let questionModel = mongoose.model("question", questionSchema);
module.exports = questionModel;
