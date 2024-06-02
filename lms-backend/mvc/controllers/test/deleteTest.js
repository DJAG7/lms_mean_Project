const enrolledTestsModel = require("../../models/enrolledTestModel");
const testModel = require("../../models/testModel");
const testSectionModel = require("../../models/testSectionModel");
const deleteTest = async (req, res) => {
  try {
    //  console.log(req.body);
    var tests = await testModel.find({
      _id: req.body.testId,
      instructor: req.body.instructor,
    });
    // console.log("INS",tests);
    if (tests.length > 0) {
      let test = tests[0];
      // console.log(test.sections);
      for (let i = 0; i < test.sections.length; i++) {
        await testSectionModel.deleteOne({ _id: test.sections[i] });
      }
      await enrolledTestsModel.deleteMany({ testId: req.body.testId });
      await testModel.deleteOne({ _id: req.body.testId });
      res.status(200).send({ message: "Test Deleted Successfully" });
    } else {
      res.status(500).send({ message: "Test not Found" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: "Something went wrong" });
  }
};
module.exports = { deleteTest };
