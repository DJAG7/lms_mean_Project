const studentModel = require("../../../models/studentModel");
const checkStudentSubscription = async (req, res) => {
  try {
    var student = await studentModel.find({ email: req.headers.email });
    end = 0;
    if (student.length > 0) {
      student = student[0];
      if (student.subEnd) {
        subscriptionEnd = new Date(student.subEnd);
        if (Date.now() < subscriptionEnd.getTime()) {
          res.status(200).send({ message: " Subscription Active" });
        } else {
          res.statusCode = 411;
          res.status(411).send({ message: " Subscription Expired" });
        }
      } else {
        res.status(411).send({ message: "Subscription not found" });
      }
    } else {
      res.status(405).send({ message: "Student not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Something went wrong" });
  }
};

module.exports = { checkStudentSubscription };
