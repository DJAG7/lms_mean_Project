const courseModel = require("../../models/courseModel");
var XLSX = require('xlsx');
const fs=require('fs');
const excelToJson = require("convert-excel-to-json");
const enrolledStudentsModel = require("../../models/enrolledStudentModel");
const studentModel = require("../../models/studentModel");
let filename="";
const bulkEnroll = async (req, res) => {
  try {
    const csvDta=excelToJson({
        sourceFile:'uploads/'+req.file.filename,
        header:{
            rows:1
        },
        columnToKey:{
            '*':"{{columnHeader}}"
        }
    })
    filename='uploads/'+req.file.filename;
    let FinalObj=[];
    const emails=csvDta.Sheet1.map(ele=>ele.Email);
    const courseId=req.body.courseId;
    let courses = await courseModel.find({ _id: req.body.courseId }).populate({
        path: "modules",
    });
    // console.log(courses);
    if(courses.length<=0){
        res.status(500).send("Course Not Found");
        return;
    }
    courses=courses[0];
    // console.log("COURSES",courses);
    for(let i=0;i<emails.length;i++){
        let email=emails[i];
        // console.log("EMAIL",email);
        let student = await studentModel.find({ email: email });
        if (student.length <= 0) {
          FinalObj.push({
            email:email,
            status:false,
            reason:"Student not found"
          })
        }
        else{
            student = student[0];
            var enrolledStudentcheck= await enrolledStudentsModel.find({courseId:courses._id,studentId:student._id});
            // console.log("ENROLLED CHECK",enrolledStudentcheck.length);
            if(enrolledStudentcheck.length>0){
                FinalObj.push({
                    email:email,
                    status:false,
                    reason:"Student already Enrolled"
                  })
            }
            else{
                let modules = courses.modules;
                // console.log("modules",modules);
                let modulesTracker = [];
                for (let i = 0; i < modules.length; i++) {
                let content = modules[i].content;
                // console.log("Content",content);
                let contentTracker = [];
                for (let j = 0; j < content.length; j++) {
                    let contentInfo = {
                    type:content[j].type,
                    contentId: content[j].id,
                    isCompleted: false,
                    };
                    contentTracker.push(contentInfo);
                }
                let moduleInfo = {
                    moduleId: modules[i]._id,
                    contentCompleted: 0,
                    content: contentTracker,
                };
                modulesTracker.push(moduleInfo);
                }
                var enrolledStudent= enrolledStudentsModel.find({courseId:req.body.courseId,studentId:student._id});
                let enrollCourse = new enrolledStudentsModel({
                    courseId: req.body.courseId,
                    studentId: student._id,
                    modulesCompleted: 0,
                    modules: modulesTracker,
                });
                enrollCourse = await enrollCourse.save();
                FinalObj.push({
                    email:email,
                    status:true,
                    reason:"SuccessFully Enrolled"
                })
            }
        }
        // console.log("HERE");
    }
    res.send({FinalObj})
    fs.unlink('uploads/'+req.file.filename,(err)=>{
        if (err) throw err;
        // if no error, file has been deleted successfully
        // console.log('File deleted!');
    })
  } 
  catch (err) {
    console.log(err);
    fs.unlink(filename,(err)=>{
        if (err) throw err;
        // if no error, file has been deleted successfully
        // console.log('File deleted!');
    })
    res.status(500).send({ message: "Something went wrong" });
  }
};
module.exports = { bulkEnroll };
