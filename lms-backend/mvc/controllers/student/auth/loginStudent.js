const studentModel = require("../../../models/studentModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const studentLogin = async (req, res) => {
  try {
    var student = await studentModel.find({ email: req.body.email });
    if (student.length > 0) {
      student = student[0];
      if (bcrypt.compareSync(req.body.password, student.password)) {
        if (!student.verified) {
          res
            .status(405)
            .send({
              message:
                "Please verify your account an email has been sent to registered email address.",
            });
        } else {
          var hash = bcrypt.hashSync(req.body.password, 10);
          const accessToken = jwt.sign(
            {
              user: {
                email: req.body.email,
              },
            },
            process.env.JWT_TOKEN_SECRET
          );
          student = student.toObject();
          delete student.password;
          delete student["__v"];
          delete student["coursesEnrolled"];
          delete student["todo"];
          delete student["notes"];
          delete student["adminTestImages"], delete student["earnedBadges"];
          student.token = accessToken;
          student.role = "student";
          res.status(200).send(student);
        }
      } else {
        res.status(405).send({ message: "wrong password" });
      }
    } else {
      res.status(405).send({ message: "User not found" });
    }
  } catch (error) {
    console.log(error);
    res.status(404).send({ message: error });
  }
};

module.exports = { studentLogin };
