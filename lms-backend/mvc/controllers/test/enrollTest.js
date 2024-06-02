const enrolledTestsModel = require("../../models/enrolledTestModel");
const studentModel = require("../../models/studentModel");
const testModel = require("../../models/testModel");

const enrollTest = async (req, res) => {
  try {
    var test = await testModel.find({ _id: req.body.testId });
    if (test.length <= 0) {
      res.status(500).send({ message: "Something went wrong" });
      return;
    }
    test = test[0];
    let student = await studentModel.find({ email: req.body.email });
    if (student.length <= 0) {
      res.status(500).send({ message: "Student not forund" });
      return;
    } else {
      student = student[0];
      let enrolledStatus = await enrolledTestsModel.find({
        testId: req.body.testId,
        studentId: student._id,
      });
      // console.log(enrolledStatus);
      if (enrolledStatus.length > 0) {
        res.status(500).send({ message: "Student already enrolled to Test" });
        return;
      }
      let enrolledTest = new enrolledTestsModel({
        testId: test._id,
        studentId: student._id,
        status: "pending",
      });
      enrolledTest = await enrolledTest.save();
      res
        .status(200)
        .send({ message: "Student successfully enrolled to Test" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: "Something went wrong" });
  }
};

module.exports = { enrollTest };
