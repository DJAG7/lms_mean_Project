const enrolledTestsModel = require("../../models/enrolledTestModel");
const studentModel = require("../../models/studentModel");
const testModel = require("../../models/testModel");
const fs=require('fs');
const excelToJson = require("convert-excel-to-json");
const bulkEnrollTest = async (req, res) => {
  let FinalObj = [];
  try {
    console.log(req.file);
    const csvDta = excelToJson({
      sourceFile: "uploads/" + req.file.filename,
      header: {
        rows: 1,
      },
      columnToKey: {
        "*": "{{columnHeader}}",
      },
    });
    filename = "uploads/" + req.file.filename;
    const emails = csvDta.Sheet1.map((ele) => ele.Email);
    var test = await testModel.find({ _id: req.body.testId });
    if (test.length <= 0) {
      res.status(500).send({ message: "Test not Found" });
      return;
    }
    test = test[0];

    for (let i = 0; i < emails.length; i++) {
      let student = await studentModel.find({ email: emails[i]});
      if (student.length <= 0) {
       //do nothing
       FinalObj.push({
        email:emails[i],
        status:false,
        reason:"Student not found"
      })
      } else {
        student = student[0];
        let enrolledStatus = await enrolledTestsModel.find({
          testId: req.body.testId,
          studentId: student._id,
        });
        if (enrolledStatus.length > 0) {
            //do nothing
            FinalObj.push({
              email:emails[i],
              status:false,
              reason:"Student already Enrolled"
            })
        } else {
          let enrolledTest = new enrolledTestsModel({
            testId: test._id,
            studentId: student._id,
            status: "pending",
          });
          enrolledTest = await enrolledTest.save();
          FinalObj.push({
            email:emails[i],
            status:true,
            reason:"SuccessFully Enrolled"
        })
        }
      }
    }
    res.status(200).send({ message: "Students successfully enrolled to Test.Unregistered/repetitive students ignored. ", FinalObj });
    fs.unlink('uploads/'+req.file.filename,(err)=>{
        if (err) throw err;
        // if no error, file has been deleted successfully
        // console.log('File deleted!');
    })
    // res.status(200).send({ message: "Students successfully enrolled to Test.Unregistered/repetitive students ignored. " });
  } catch (err) {
    console.log(err);
    fs.unlink(filename,(err)=>{
        if (err) throw err;
        // if no error, file has been deleted successfully
        // console.log('File deleted!');
    })
    res.status(500).send({ message: "Something went wrong",FinalObj });
  }
};

module.exports = { bulkEnrollTest };
