const { set } = require("mongoose");
const enrolledTestsModel = require("../../models/enrolledTestModel");
const testModel = require("../../models/testModel");
const { uploadBase64ImgToS3 } = require("../s3/s3");
const proctoring = async (req, res) => {
  try {
    var testsData = await enrolledTestsModel.find({
      testId: req.body.testId,
      studentId: req.body.student,
    });
    //  console.log("stud",testsData);
    if (testsData.length > 0) {
      const type = req.body.camSS.split(";")[0].split("/")[1];
      let camSS = await uploadBase64ImgToS3(
        "",
        Date.now() + "camss/LMS." + type,
        req.body.camSS
      );
      let videoSS = await uploadBase64ImgToS3(
        "",
        Date.now() + "ss/LMS." + type,
        req.body.videoSS
      );
    //   testsData={...testsData[0].toObject()};
      testsData=testsData[0];
      if(testsData.webcamImages){
        testsData.webcamImages.push(camSS.Location)
      }
      else{
        testsData.webcamImages=[camSS.Location];
      }
      if(testsData.screenImages){
        testsData.screenImages.push(videoSS.Location)
      }
      else{
        testsData.screenImages=[videoSS.Location]
      }
    //   testsData=new enrolledTestsModel(testsData);
      testsData=await testsData.save();
      res.status(200).send({ message: "Uploaded Successfully" });
    } else {
      res.status(200).send({ message: "Test not assigned" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: "Something went wrong" });
  }
};
module.exports = { proctoring };
