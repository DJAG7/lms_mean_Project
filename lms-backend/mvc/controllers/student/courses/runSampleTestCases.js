const { default: axios } = require("axios");
const studentModel = require("../../../models/studentModel");
const dotenv = require("dotenv");
const { downloadExcelFromS3 } = require("../../s3/s3.js");
const questionModel = require("../../../models/questionModel");
dotenv.config();

const COMPILER_URL = `${process.env.COMPILER_URL}submission?base64_encoded=true&wait=true`;

function cleanString(s1) {
  if (!s1) return null;
  if (typeof s1 != "string") s1 = s1.toString();

  s1 = s1.toString();
  s1 = s1.split("");
  len = s1.length;
  for (let i = len - 1; i >= 0; i--) {
    if (s1[i] == " " || s1[i] == "\n" || s1[i] == "\r") {
      s1.splice(i, 1);
    } else {
      break;
    }
  }
  for (let i = 0; i < s1.length; i++) {
    if (s1[i] == " " || s1[i] == "\n" || s1[i] == "\r") {
      s1.splice(i, 1);
      i--;
    } else {
      break;
    }
  }
  for (let i = len - 1; i >= 0; i--) {
    if (s1[i] == "\r") {
      s1.splice(i, 1);
    }
  }
  s1 = s1.join("");
  return s1;
}

function waitResult(options, callbackCount) {
  console.log(callbackCount);
  if (callbackCount > 30) reject({});
  return new Promise((resolve, reject) => {
    setTimeout(async () => {
      try {
        let data = await getResult(options, callbackCount + 1);
        resolve(data);
      } catch (e) {
        try {
          let data = await waitResult(options, callbackCount + 1);
          resolve(data);
        } catch (e) {
          reject({});
        }
      }
    }, 2000);
  });
}
const getResult = async (options, callbackCount = 0) => {
  try {
    let result = await axios.request(options);
    result = result.data;
    return result;
  } catch (err) {
    try {
      console.log(callbackCount);
      let data = await waitResult(options, callbackCount + 1);
      return data;
    } catch (e) {
      return {};
    }
  }
};
const runSampleTestCases = async (req, res) => {
  try {
    if (!req.body.code || !req.body.language || !req.body.questionId) {
      res.status(200).send({
        Message: "No Test Cases found, something Missing",
        result: [],
      });
      return;
    }

    var testcases;
    let question = await questionModel.find({ _id: req.body.questionId });
    if (question.length) {
      question = question[0];
    } else {
      res.status(500).send({ Message: "Question not found" });
      return;
    }
    if (
      question &&
      (typeof question.inputTestCases === "string" ||
        question.inputTestCases instanceof String)
    ) {
      var workbookname =
        question && question.inputTestCases
          ? question.inputTestCases.split("/").pop()
          : [];
      var workbook = await downloadExcelFromS3(workbookname);
      testcases = workbook && workbook.length > 0 ? workbook[0].data : [];
      testcases = testcases.filter((item) => item.length);
      if(testcases?.length<4){
        testcases=testcases.slice(0,testcases?.length);
      }
      else{
        testcases=testcases.slice(0,4);
      }
    } else {
      testcases = [];
      const minimumTestCases = 3;
      for (
        let i = 0;
        i < Math.min(question.inputTestCases.length, minimumTestCases);
        i++
      ) {
        if (question.inputTestCases[i] && question.outputTestCases[i])
          testcases.push([
            question.inputTestCases[i],
            question.outputTestCases[i],
          ]);
      }
    }
    testcases.shift();
    let inputTestCases = testcases.map((item) => item[0]);
    let outputTestCases = testcases.map((item) => item[1]);
    var sampleTestCasesResult = [];
    var lang = {
      python: 71,
      java: 62,
      c_cpp: 54,
      csharp: 51,
      golang: 60,
      javascript: 63,
    };
    let testPromises = [];

    for (let i = 0; i < inputTestCases.length; i++) {
      let options = {
        method: "POST",
        url: "COMPILER_URL",
        headers: {
          "content-type": "application/json",
        },
        data: {
          language_id: lang[req.body.language],
          stdin: btoa(inputTestCases[i]),
          source_code: btoa(req.body.code),
        },
      };
      testPromises.push(getResult(options));
    }

    let data = await Promise.all(testPromises);
    for (let j = 0; j < data.length; j++) {
      if (
        data[j] &&
        data[j].stdout &&
        cleanString(atob(data[j].stdout)) == cleanString(outputTestCases[j])
      ) {
        sampleTestCasesResult.push({
          input: inputTestCases[j],
          passed: true,
          expectedOutput: cleanString(outputTestCases[j]),
          actualOutput: cleanString(atob(data[j].stdout)),
        });
      } else {
        sampleTestCasesResult.push({
          input: inputTestCases[j],
          passed: false,
          expectedOutput: cleanString(outputTestCases[j]),
          actualOutput: cleanString(atob(data[j].stdout)),
        });
      }
    }
  } catch (err) {
    console.log(err);
    sampleTestCasesResult = [];
  }
  res.status(200).send({
    message: "Sample Test Cases found",
    result: sampleTestCasesResult,
  });
  return;
};
module.exports = { runSampleTestCases };
