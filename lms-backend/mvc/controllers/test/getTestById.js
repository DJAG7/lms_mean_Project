

const enrolledTestsModel = require("../../models/enrolledTestModel");
const testModel = require("../../models/testModel");
const getTestById = async (req, res) => {
  try {
    //  console.log(req.body);
    if(req.body.type==='instructor'){
        var tests = await testModel
        .find({
          _id: req.body.testId,
          instructor: req.body.id,
        }).populate({
               path:'sections',
               populate:{
                   path:'questions',
                   model:'question'
               }
          })
        // console.log("INS",tests);
      if (tests.length > 0) {
        res.status(200).send({ tests: tests.map(test=>{return {...test.toObject()}}) });
      } else {
        res.status(500).send({ message: "Test not Found" }); 
      }
    }
    else if(req.body.type==='student'){
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
module.exports = { getTestById };
