const { Mongoose } = require("mongoose");

const mongoose = require("./conn").mongoose;
const draftCourseSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default:''
  },
  courseHours:{
    type:Number,
    required: true,
  },
  courseMinutes:{
    type:Number,
    required: true,
  },
  thumbnaail: {
    type: String,
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
    type:String
  }]
});

let draftCourseModel = mongoose.model("draftCourse", draftCourseSchema);
module.exports = draftCourseModel;
