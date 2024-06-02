const organizationModel = require("../../models/organizationModel");
const enrolledTestsModel = require("../../models/enrolledTestModel");
const { default: mongoose } = require("mongoose");

const getOrganizationTests = async (req, res) => {
  try {
   let orgId=req.body.organizationId
   let tests = await enrolledTestsModel.aggregate(
    [
      {
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
        '$group': {
          '_id': '$testId', 
          'completed': {
            '$sum': {
              '$cond': [
                {
                  '$eq': [
                    '$status', 'completed'
                  ]
                }, 1, 0
              ]
            }
          }, 
          'pending': {
            '$sum': {
              '$cond': [
                {
                  '$eq': [
                    '$status', 'pending'
                  ]
                }, 1, 0
              ]
            }
          }
        }
      }, {
        '$lookup': {
          'from': 'tests', 
          'localField': '_id', 
          'foreignField': '_id', 
          'as': 'test'
        }
      }, {
        '$unwind': {
          'path': '$test', 
          'preserveNullAndEmptyArrays': false
        }
      }
    ]
   );
   
   res.status(200).send({"tests": tests});
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Something went wrong" });
  }
};
module.exports = { getOrganizationTests };
