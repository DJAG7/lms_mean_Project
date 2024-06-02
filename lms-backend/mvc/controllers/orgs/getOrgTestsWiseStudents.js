const organizationModel = require("../../models/organizationModel");
const enrolledTestsModel = require("../../models/enrolledTestModel");
const { default: mongoose } = require("mongoose");

const getOrganizationTestWiseStudents = async (req, res) => {
  try {
   let orgId=req.body.organizationId;
   let testId=req.body.testId;
   let students = await enrolledTestsModel.aggregate(
    [
      {
        '$match': {
          'testId': new mongoose.Types.ObjectId(testId)
        }
      }, {
        '$lookup': {
          'from': 'students', 
          'localField': 'studentId', 
          'foreignField': '_id', 
          'as': 'student'
        }
      }, {
        '$unwind': {
          'path': '$student', 
          'preserveNullAndEmptyArrays': false
        }
      }, {
        '$match': {
          'student.organizationId': new mongoose.Types.ObjectId(orgId)
        }
      }, {
        '$project': {
          'status': 1, 
          'score': 1, 
          'student': {
            'name': 1, 
            'email': 1
          },
          'sectionwiseScore':1
        }
      }
    ]
   );
   
   res.status(200).send({"students": students});
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Something went wrong" });
  }
};
module.exports = { getOrganizationTestWiseStudents };
