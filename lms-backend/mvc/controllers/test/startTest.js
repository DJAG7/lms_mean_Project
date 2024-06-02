

const { set } = require("mongoose");
const enrolledTestsModel = require("../../models/enrolledTestModel");
const testModel = require("../../models/testModel");
const startTest = async (req, res) => {
  try {
    if(req.body.type==='student'){
         var testsData = await enrolledTestsModel
           .find({
            testId:req.body.testId,
             studentId: req.body.id,
             status:'pending'
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
        //  console.log("stud",testsData);
         if (testsData.length > 0) {
           res.status(200).send({
             tests: testsData.map((test) => {
               return {
                 ...test.testId.toObject(),
               };
             }),  
           });
           let newTestData=await enrolledTestsModel.updateOne({_id:testsData[0]._id},{$set:{status:'started',startTime:Date.now()}})
         } else {
           res.status(200).send({ message: "Test not assigned" });
         }
    }
    else{
        throw new Error("Invalid Type")
    }
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: "Something went wrong" });
  }
};
module.exports = { startTest };
