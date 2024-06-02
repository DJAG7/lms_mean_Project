const { Mongoose } = require("mongoose");

const mongoose = require("./conn").mongoose;
const courseSchema = mongoose.Schema({
  name: {
    type: String,
    // required: true,
  },
  description: {
    type: String,
    // required: true,
    default:''
  },
  courseHours:{
    type:Number,
    // required: true,
  },
  courseMinutes:{
    type:Number,
    // required: true,
  },
  thumbnail: {
    type: String,
    // required: true,
  },
  instructors: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref:"instructor",
    },
  ],
  trailer: {
    type: String,
    default: "",
  },
  difficulty: {
    type: String,
    enum: ["beginner", "intermediate", "advanced"],
    // required: true,
  },
  rating: {
    stars: {
      type: Number,
      default: 0,
    },
    count: {
      type: Number,
      default: 0,
    },
  },
  keyPoints: {
    type: Array,
    default: [],
  },
  price: {
    type: Number,
  },
  modules: [
    {
      type:mongoose.Schema.Types.ObjectId,
      ref:"modules",
     }
  ],
  tags:[{
    type:Array
  }]
});

let courseModel = mongoose.model("courses", courseSchema);
module.exports = courseModel;
