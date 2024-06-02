const { default: axios } = require("axios");
const studentModel = require("../../../models/studentModel");
const dotenv = require("dotenv");
const { downloadExcelFromS3 } = require("../../s3/s3.js");
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

function waitResult(options,callbackCount){
  console.log(callbackCount);
  if(callbackCount > 30)
    reject({});
  return new Promise((resolve,reject)=>{
    setTimeout(async ()=>{
      try{
        let data = await getResult(options,callbackCount+1);
        resolve(data);
      }
      catch(e){
        try{
        let data = await waitResult(options,callbackCount+1);
        resolve(data);
        }
        catch(e){
          reject({});
        }

      }
    },2000)
  })
}
const getResult = async(options,callbackCount=0)=>{
  try{
  let result = await axios.request(options);
      result = result.data;
      return result;
  }
  catch(err){
    try{
      console.log(callbackCount);
    let data = await waitResult(options,callbackCount+1);
    return data;
    }
    catch(e){
      return {};
    }
  }

}
const verifyCode = async (code, language, question) => {
  try {
    if (!code || !language) {
      return {
        success: 0,
        failure: 1,
      };
    }
    var testcases;
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
    } else {
      testcases = [];
      for (let i = 0; i < question.inputTestCases.length; i++) {
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
    var failure = 0,
      success = 0;
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
          language_id: lang[language],
          stdin: btoa(inputTestCases[i]),
          source_code: btoa(code),
        },
      };
      testPromises.push(getResult(options));
      
      // result = await getResult(options);
      // if (
      //   result &&
      //   result.stdout &&
      //   cleanString(atob(result.stdout)) == cleanString(outputTestCases[i])
      // ) {
      //   success += 1;
      // } else {
      //   failure += 1;
      // }
    }
    let data = await Promise.all(testPromises);
    // console.log(data);
    for(let j=0;j<data.length;j++) {
      if (
        data[j] &&
        data[j].stdout &&
        cleanString(atob(data[j].stdout)) == cleanString(outputTestCases[j])
      ) {
        success += 1;
      } else {
        failure += 1;
      }
    }
  } catch (err) {
    success = 0;
    failure = 1;
  }
  return { success, failure };
};
module.exports = { verifyCode };
