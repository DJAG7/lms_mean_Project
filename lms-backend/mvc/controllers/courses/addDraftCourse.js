const draftCourseModel = require('../../models/draftCourseModel.js');
const instructorModel = require('../../models/instructorModel.js');
const lessonModel = require('../../models/lessonModel.js');
const moduleModel = require('../../models/moduleModel.js');

const addDraftCourse = async(req,res)=>{
    try{
        var coursehours = 0;
        var courseminutes=0;
        for(i=0;i<req.body.modules.length;i++){
                for(j=0;j<req.body.modules[i].lessons.length;j++){
                    coursehours+=req.body.modules[i].lessons[j]['length'].hour;
                    courseminutes+=req.body.modules[i].lessons[j]['length'].hour;
                }
        }
        coursehours+=courseminutes/60;
        courseminutes=courseminutes%60;
        coursehours=Math.floor(coursehours);
        let modules=req.body.modules;
        let modulesIds=[];
        for(let i=0;i<modules.length;i++){
            let lessons=modules[i].lessons;
            let lessonsIds=[];
            for(let j=0;j<lessons.length;j++){
                let lesson=lessons[j];
                lesson= new lessonModel(lesson);
                lesson=await lesson.save();
                lessonsIds.push(lesson._id);
            }
            modules[i].lessons=lessonsIds;
            let curmodule=new moduleModel(modules[i]);
            curmodule=await curmodule.save();
            modulesIds.push(curmodule._id)
        }
   course=new draftCourseModel({
    name: req.body.name,
    description:req.body.description,
    instructors:req.body.instructors,
    trailer: req.body.trailer,
    thumbnail: req.body.thumbnail,
    difficulty: req.body.difficulty,
    keyPoints: req.body.keypoints,
    modules:modulesIds,
    thumbnail: req.body.thumbnail,
    courseHours:coursehours,
    courseMinutes:courseminutes,
    tags:req.body.tags
   });
   course=await course.save();
//    console.log(course,req.body.instructors);
   for(let i=0;i<req.body.instructors.length;i++){
    let instructor=await instructorModel.findById(req.body.instructors[i]);
    instructor.courses.push(course._id);
    let newIns=await instructor.save();
   }
   res.status(200).send({"message":"Successfully  saved as draft"});
}
catch (err) {
    console.log(err);
    res.status(500).send({"message":"Something went wrong"})
}

}
module.exports={addDraftCourse};