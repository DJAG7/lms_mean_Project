const quizModel = require("../../../models/quizModel");
const courseModel = require("../../../models/courseModel");
const getQuiz = async (req, res) => {
    try{
        // console.log(req.body);
  var quiz = await quizModel.find({ _id: req.body.quizid }).populate({
    path: "questions",
    model: "question",
  });
  var course = await courseModel.find({_id: req.body.courseid}).populate({
    path: "instructors",
    model:"instructor",
  }).select("name instructors");
  if (quiz.length > 0) {
    quiz=quiz[0];
    res.status(200).send({"quiz":quiz , "course":course[0]});
  }
  else
  {
    res.status(500).send({"message":"Quiz not found"});
  }
}
catch(e){
    console.log(e);
    res.status(500).send({"message":"Something went wrong"});
}
};
module.exports = {getQuiz}