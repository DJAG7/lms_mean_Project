

const enrolledTestsModel = require("../../models/enrolledTestModel");
const testModel = require("../../models/testModel");
const { downloadExcelFromS3 } = require("../s3/s3");
let processSectionWiseScore=(sectionwiseScore)=>{
  let categories = sectionwiseScore.map((item) => item.name);
  let correctScore = sectionwiseScore.map((item) => item.correct);
  let incorrectScore = sectionwiseScore.map((item) => item.incorrect);
  return {
    categories,
    correctScore,
    incorrectScore,
  };
}
const getStudentReport = async (req, res) => {
  try {
         var testsData = await enrolledTestsModel
           .find({
            _id:req.body.enrolledId,
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
           }).populate({
            path: "studentId",
            select:"name email"
          })
         if (testsData.length > 0) {
          testsData=testsData[0].toObject();
          delete testsData.webcamImages;
          delete testsData.screenImages
           testsData.test=testsData.testId;
           testsData.testId=testsData.testId._id;
           let testCasesMap={};
           let testCasesPromises=[];
           for(let i=0; i<testsData.test.sections.length; i++) {
            let section=testsData.test.sections[i];
            for(let j=0;j<section.questions.length;j++){
              let que=section.questions[j];
              if(que.queType==='coding'){
                var workbookname =
                  que && que.inputTestCases
                    ? que.inputTestCases.split("/").pop()
                    : [];
                // console.log(que.inputTestCases);
                testCasesPromises.push(downloadExcelFromS3(workbookname));
                // if(testCasesMap[i]){
                //     testCasesMap[i][j]=testCasesPromises.length;
                // }
                // else{
                //     testCasesMap[i]={
                //         [j]:testCasesPromises.length
                //     }
                // }
                testCasesMap[testCasesPromises.length-1]={
                    sec:i,
                    que:j
                }
                
                // var workbook = await downloadExcelFromS3(workbookname);
                // let testcases = workbook && workbook.length > 0 ? workbook[0].data : [];
                // testcases = testcases.filter((item) => item.length)
                // testcases=testcases.slice(0, Math.min(testcases.length,4));
                // console.log(testcases);
                // que.inputTestCases=testcases;
              }
            }
          }
          let allInputTestCases=(await Promise.all(testCasesPromises)).map((workbook) => workbook && workbook.length > 0 ? workbook[0].data : []).filter((item) => item.length).map((testCases) => testCases.slice(0, Math.min(testCases.length,4)));
          resultData = {
            totalQuestions: testsData.score.correct + testsData.score.wrong,
            totalCorrect: testsData.score.correct,
            correctPercentage: Math.floor((100*testsData.score.correct)/(testsData.score.correct + testsData.score.wrong)),
            timeTaken: Math.floor((testsData.endTime-testsData.startTime)/60000),
            sectionwiseScore: processSectionWiseScore(
              testsData.sectionwiseScore
            ),
          };
          allInputTestCases.forEach((item,index) =>{
            testsData.test.sections[testCasesMap[index].sec].questions[testCasesMap[index].que].inputTestCases=item;
          })
          testsData.resultData=resultData;
           res.status(200).send(testsData);
         } else {
           res.status(500).send({ message: "Test not assigned" });
         }
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: "Something went wrong" });
  }
};
module.exports = { getStudentReport };
