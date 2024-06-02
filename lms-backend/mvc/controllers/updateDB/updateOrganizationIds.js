const studentModel = require("../../models/studentModel");
const studentDetailsModel = require("../../models/studentDetailsModel");
const orgModel = require("../../models/organizationModel");
const dotenv = require("dotenv");
dotenv.config();

const updateOrganizationIds = async (req, res) => {
  try {
    let students = await studentModel.find({});
    if (students.length > 0) {
      for (let student of students) {
        let orgName = student.organization;
        if (orgName) {
          let orgDetails = await orgModel.find({
            organizationName: orgName,
          });
          if (orgDetails.length > 0) {
            student.organizationId = orgDetails[0]._id;
            if (student.studentDetails) {
              let studentDetails = await studentDetailsModel.find({
                _id: student.studentDetails,
              });
              if (studentDetails.length) {
                studentDetails[0].organization.organizationId =
                  orgDetails[0]._id;
                await studentDetails[0].save();
              }
            }
            await student.save();
          } else {
            console.log("org not found");
          }
        }
      }
      res.status(200).send({ message: "Updated Successfully" });
      return;
    } else {
      res.status(500).send({ message: "Student Not Found" });
      return;
    }
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: err });
  }
};
module.exports = { updateOrganizationIds };
