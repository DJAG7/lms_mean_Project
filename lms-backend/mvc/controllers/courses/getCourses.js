const courseModel = require("../../models/courseModel");

const getCourses = async (req, res) => {
  try {
    var courses =await courseModel.find({}).populate(
      {
        path: "modules",
        populate:{
          path:'content',
        }
      }
      ).populate({
        path: "instructors",
      });
    res.status(200).send({ courses: courses });
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: "Something went wrong" });
  }
};
module.exports = { getCourses };
