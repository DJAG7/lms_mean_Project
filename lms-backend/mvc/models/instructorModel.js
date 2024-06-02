const mongoose = require("mongoose");
const instructorSchema = {
  firstname: {
    type: String,
    required: true,
    // minlength: 1,
    // maxlength: 40,
  },
  lastname: {
    type: String,
    required: true,
    // minlength: 1,
    // maxlength: 40,
  },
  email: {
    type: String,
    unique: true,
    required: true,
    // minlength: 8,
    // maxlength: 50,
  },
  password: {
    type: String,
    required: true,
    // minlength: 8,
  },
  profilePicture: {
    type: String,
    default:"https://img.freepik.com/premium-vector/training-icon-vector-training-education-icon-blackboard-with-teacher-seminar-vector-sign_578506-396.jpg"
  },
  companyName: {
    type: String,
  },
  courses: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "courses",
    },
  ],
  //   phoneNumber: {
  //     type: Number,
  //     // length: 10,
  //   },
};
let instructorModel = mongoose.model("instructor", instructorSchema);
module.exports = instructorModel;
