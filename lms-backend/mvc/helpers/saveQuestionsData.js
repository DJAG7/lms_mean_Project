const {
  downloadExcelFromS3,
  downloadExcelFromS3asFile,
} = require("../controllers/s3/s3");
const excelToJson = require("convert-excel-to-json");
const questionModel = require("../models/questionModel");
const { uploadFileToS3 } = require("../controllers/s3/s3");
const xlsx = require("node-xlsx");
const fs = require("fs");

const saveQuestionsData = async (excelLink) => {
try {
  let questionsFile = excelLink.split("/").pop();
  let questionsData = await downloadExcelFromS3asFile(questionsFile);
  //fs.unlinkSync("uploads/" + questionsFile + ".xlsx");
  const csvDta = excelToJson({
    sourceFile: questionsData,
    header: {
      rows: 1,
    },
    columnToKey: {
      "*": "{{columnHeader}}",
    },
  });
  let questions = csvDta.Sheet1;
  let savedQueList = [];
  for (let k = 0; k < questions.length; k++) {
    let questionObj = questions[k];
    let inputTests = Object.keys(questionObj)
      .filter((queKey) => {
        return queKey.includes("inputTestCase", 0);
      })
      .sort()
      .map((queKey) => questionObj[queKey]);
    let outputTests = Object.keys(questionObj)
      .filter((queKey) => {
        return queKey.includes("outputTestCase", 0);
      })
      .sort()
      .map((queKey) => questionObj[queKey]);
    let sampleInputTests = Object.keys(questionObj)
      .filter((queKey) => {
        return queKey.includes("sampleInputTestCase", 0);
      })
      .sort()
      .map((queKey) => questionObj[queKey]);
    let sampleOutputTests = Object.keys(questionObj)
      .filter((queKey) => {
        return queKey.includes("sampleOutputTestCase", 0);
      })
      .sort()
      .map((queKey) => questionObj[queKey]);
    let testInputOutput = [];
    let sampleInputOutput = [];
    inputTests.forEach((testCase, index) => {
      testInputOutput.push([inputTests[index], outputTests[index]]);
    });
    sampleInputTests.forEach((testCase, index) => {
      sampleInputOutput.push([
        sampleInputTests[index],
        sampleOutputTests[index],
      ]);
    });
    let testCaseLink = "";
    let sampleTestCaseLink = "";
    if (questionObj.question_type === "coding") {
      testCaseLink = await arrayToExcelinS3(testInputOutput);
      sampleTestCaseLink = await arrayToExcelinS3(sampleInputOutput);
    }
    if (questionObj.question_Type == "true/false") {
      questionObj.queType = "truefalse";
    }
    let question = {
      queType: questionObj?.question_type,
      questionTitle: questionObj?.question_title,
      questionDescripton: questionObj?.question_description,
      tags: questionObj?.tags?.split(",") ?? [],
      questionTitleType: "text",
      option1: questionObj?.option1 ?? "",
      option2: questionObj?.option2 ?? "",
      option3: questionObj?.option3 ?? "",
      option4: questionObj?.option4 ?? "",
      option1Correct: questionObj?.option1_correct ?? null,
      option2Correct: questionObj?.option2_correct ?? null,
      option3Correct: questionObj?.option3_correct ?? null,
      option4Correct: questionObj?.option4_correct ?? null,
      inputTestCases: testCaseLink,
      sampleTestCases: sampleTestCaseLink,
    };
    console.log(question);
    let questionContent = {
      queType: question.queType,
      questionTitle: question.questionTitle,
      questionDescripton: question.questionDescripton,
      tags: question.tags,
    };
    if (question.queType != "coding" && question.queType !== "mcq") {
      (questionContent.options = [
        question.option1,
        question.option2,
        question.option3,
        question.option4,
      ]),
        (questionContent.correctOptions = [
          question.option1Correct == 'TRUE',
          question.option2Correct == 'TRUE',
          question.option3Correct == 'TRUE',
          question.option4Correct == 'TRUE',
        ]);
    } else if (question.queType === "mcq") {
      let correctOption = 0;
      if(question.option1Correct == 'TRUE') {correctOption = 1}
      if(question.option2Correct == 'TRUE') {correctOption = 2}
      if(question.option3Correct == 'TRUE') {correctOption = 3}
      if(question.option4Correct == 'TRUE') {correctOption = 4}
      // question.option2Correct === true && (correctOption = 2);
      // question.option3Correct === true && (correctOption = 3);
      // question.option4Correct === true && (correctOption = 4);
      questionContent.options = [
        question.option1,
        question.option2,
        question.option3,
        question.option4,
      ];
      questionContent.correctOptions = [correctOption, null, null, null];
    } else {
      questionContent.inputTestCases = question.inputTestCases;
      questionContent.sampleTestCases = question.sampleTestCases;
      // console.log("122", questionContent);
      // questionContent.outputTestCases = question.outputTestCases;
    }
    // console.log("QUECONTENT",questionContent);
    // console.log(questionContent);
    questionContent = new questionModel(questionContent);
    questionContent = await questionContent.save();
    savedQueList.push(questionContent._id);
  }
  return savedQueList;
} catch (err) {
  console.log("CATCH ERROR",err);
  throw new Error("Bulk Upload Failed")
}
};

// const saveQuestionsData=async (excelLink)=>{
//   let questionsFile = excelLink.split('/').pop();
//   let questionsData = await downloadExcelFromS3asFile(questionsFile);
//   const csvDta=excelToJson({
//     sourceFile:questionsData,
//     header:{
//         rows:1
//     },
//     columnToKey:{
//         '*':"{{columnHeader}}"
//     }
// })
//   let questions = questionsData[0].data;
//   questions= questions.slice(1);
//   let savedQueList=[];
//   for (let k = 0; k < questions.length; k++) {
//       let questionObj = questions[k];
//       let inputTests=questionObj.slice(12);
//       let inputTestCases=inputTests.filter((ele,ind)=> ind%2==0);
//       let outputTestCases=inputTests.filter((ele,ind)=> ind%2==1);
//       console.log(inputTestCases,outputTestCases);
//       if(questionObj[0]=='true/false'){
//         questionObj[0]='truefalse';
//       }
//       let question={
//           queType: questionObj[0],
//           questionTitle: questionObj[1],
//           questionDescripton: questionObj[2],
//           tags:questionObj[3]?.split(','),
//           questionTitleType:'text',
//           option1:questionObj[4] ?? '',
//           option2:questionObj[5] ?? '',
//           option3:questionObj[6] ?? '',
//           option4:questionObj[7] ?? '',
//           option1Correct:questionObj[8] ?? null,
//           option2Correct:questionObj[9] ?? null,
//           option3Correct:questionObj[10] ?? null,
//           option4Correct:questionObj[11] ?? null,
//           inputTestCases:inputTestCases,
//           outputTestCases:outputTestCases
//       };

//       let questionContent = {
//         queType: question.queType,
//         questionTitle: question.questionTitle,
//         questionDescripton: question.questionDescripton,
//       };
//       if (question.queType != "coding" && question.queType !== "mcq") {
//         (questionContent.options = [
//           question.option1,
//           question.option2,
//           question.option3,
//           question.option4,
//         ]),
//           (questionContent.correctOptions = [
//               question.option1Correct===true,
//               question.option2Correct===true,
//               question.option3Correct===true,
//               question.option4Correct===true,
//           ]);
//       }
//       else if(question.queType === "mcq"){
//         let correctOption=0;
//         ((question.option1Correct===true) && (correctOption=1));
//         ((question.option2Correct===true) && (correctOption=2));
//         ((question.option3Correct===true) && (correctOption=3));
//         ((question.option4Correct===true) && (correctOption=4));
//         (questionContent.options = [
//           question.option1,
//           question.option2,
//           question.option3,
//           question.option4,
//         ]);
//         (questionContent.correctOptions = [
//               correctOption,
//               null,
//               null,
//               null,
//         ]);
//       } else {
//           questionContent.inputTestCases = question.inputTestCases;
//           questionContent.outputTestCases = question.outputTestCases;
//       }
//       // console.log("QUECONTENT",questionContent);
//       questionContent=new questionModel(questionContent);
//       questionContent=await questionContent.save();
//       savedQueList.push(questionContent._id);
//     }
//   return savedQueList;
// }
const arrayToExcelinS3 = async (data) => {
  let x = [{ name: "Sheet1 ", data: data }];
  let buffer = xlsx.build(x);
  let uploadData = await uploadFileToS3("", Date.now() + "LMS.xlsx", buffer);
  // console.log("230", uploadData);
  return uploadData.Location;
};
module.exports = { saveQuestionsData };
