
const instructorModel = require("../../models/instructorModel");
const testModel = require("../../models/testModel");
const getAllTests = async (req, res) => {
  try {
    //  console.log(req.body);
    var tests = await testModel.find().populate({
      path: "instructor",
    });
    if (tests.length > 0) {
      res.status(200).send({ tests: tests.map(test=>{return {...test.toObject(),sections:test.sections.length}}) });
    } else {
      res.status(200).send({ message: "No courses Added" });
    }
  } catch (err) {
    res.status(500).send({ message: "Something went wrong" });
  }
};
module.exports = { getAllTests };
