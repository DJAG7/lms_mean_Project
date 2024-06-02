const courseModel = require("../../models/courseModel");
const lessonModel = require("../../models/lessonModel");
const moduleModel = require("../../models/moduleModel");
const questionModel = require("../../models/questionModel");
const quizModel = require("../../models/quizModel");

const deleteCourse = async (req, res) => {
  try {
    let courseId=req.body.courseId;
    let course=await courseModel.find({_id:courseId}).populate({
        path: "modules",
      });
    if(!course){
        res.status(500).send({ message: "Course Not Found" });
        return
    }
    course=course[0];
    let modules=course.modules;
    for(let i=0;i<modules.length;i++){
        let curModule=modules[i];
        // console.log("Modules",curModule);
        let content=curModule.content;
        for(let j=0;j<content.length;j++){
            let curContent=content[j];
            // console.log("COntent",curContent);
            if(curContent.type=='lesson'){
                let lesson=await lessonModel.find({_id:curContent.id});
                lesson=lesson[0];
                // console.log("LESSON",lesson);
                await lessonModel.deleteOne({_id:lesson._id})
            }
            else{
                let quiz=await quizModel.find({_id:curContent.id});
                quiz=quiz[0];
                // console.log("QUIZ",quiz);
                await questionModel.deleteMany({_id:{$in:quiz.questions}});
                await quizModel.deleteOne({_id:quiz._id})
            }
        }
        await moduleModel.deleteOne({_id:curModule._id})
    }
    await courseModel.deleteOne({_id:courseId})
    // console.log("Course",course);
    res.status(200).send({message:"Course Deleted Successfully"})
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: "Something went wrong" });
  }
};
module.exports = { deleteCourse };
