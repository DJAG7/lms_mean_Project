const studentDetailsModel = require("../../../models/studentDetailsModel");
const removeGithubAccess = async (req, res) => {
  try {
    studentDetails = await studentDetailsModel.find({
      "email.value": req.body.email,
    });
    if (studentDetails.length > 0) {
      studentDetails = studentDetails[0];
      studentDetails.gitHub.givenAccess = false;
      studentDetails.gitHub.accessToken = "";
      studentDetails.gitHub.githubUsername = "";
      await studentDetails.save();
      res.status(200).send({ message: "Successfully removed github access" });
    } else {
      res.status(500).send({ message: "Student details not found" });
    }
  } catch (e) {
    console.log(e);
    res.status(500).send({ message: "something went wrong" });
  }
};
module.exports = { removeGithubAccess };
