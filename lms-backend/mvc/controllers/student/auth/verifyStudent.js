const studentModel = require("../../../models/studentModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const verifyStudent = async (req, res) => {
  try {
    if (req.body.token) {
      const decoded = jwt.verify(req.body.token, process.env.JWT_TOKEN_SECRET);
      var student = await studentModel.find({ email: decoded.user.email });
      if (student.length > 0) {
        const accessToken = jwt.sign(
          {
            user: {
              username: req.body.email,
            },
          },
          process.env.JWT_TOKEN_SECRET,
          { expiresIn: "60m" }
        );
        student = student[0];
        student.verified = true;
        await student.save();

        student = student.toObject();
        delete student.verified;
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
      res.status(500).send({ message: "Something went wrong" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Something went wrong" });
  }
};
module.exports = { verifyStudent };