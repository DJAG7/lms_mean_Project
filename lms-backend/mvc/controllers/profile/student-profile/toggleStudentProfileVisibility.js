const studentDetailsModel = require("../../../models/studentDetailsModel");
const toggleStudentProfileVisibility = async (req, res) => {
  try {
    studentDetails = await studentDetailsModel.find({
      "email.value": req.body.email,
    });
    if (studentDetails.length > 0) {
      studentDetails = studentDetails[0];
      studentDetails.profileVisibility = req.body.visibility;
      await studentDetails.save();
      res
        .status(200)
        .send({ message: "Successfully changed Visibility Status" });
    } else {
      res.status(500).send({ message: "Student details not found" });
    }
  } catch (e) {
    console.log(e);
    res.status(500).send({ message: "something went wrong" });
  }
};
module.exports = { toggleStudentProfileVisibility };
