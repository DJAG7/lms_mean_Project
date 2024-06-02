

const enrolledTestsModel = require("../../models/enrolledTestModel");
const testModel = require("../../models/testModel");
const getTestReview = async (req, res) => {
  try {
         var testsData = await enrolledTestsModel
           .find({
            testId:req.body.testId,
            studentId: req.body.id,
             status:'completed'
           })
           .populate({
             path: "testId",
             populate:{
                path:'sections',
                populate:{
                    path:'questions',
                    model:'question'
                }
             }
           })
         if (testsData.length > 0 && testsData[0].testId.testType==='mock') {
           res.status(200).send(testsData);
         } else {
           res.status(500).send({ message: "Test not assigned" });
         }
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: "Something went wrong" });
  }
};
module.exports = { getTestReview };
