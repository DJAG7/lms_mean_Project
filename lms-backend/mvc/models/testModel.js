const { Mongoose } = require("mongoose");

const mongoose = require("./conn").mongoose;
const testSchema = mongoose.Schema({
  name: {
    type: String,
    // required: true,
  },
  description: {
    type: String,
    // required: true,
    default: "",
  },
  useCamera: {
    type: Boolean,
    default: false,
  },
  instructions: {
    type: String,
    // required: true,
    default: "",
  },
  length: {
    type: Object,
  },
  instructor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "instructor",
  },
  sections: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "testSection",
    },
  ],
  testType:{
    type: String,
    default: "mock",
  }
},
{ timestamps: true });

let testModel = mongoose.model("test", testSchema);
module.exports = testModel;
