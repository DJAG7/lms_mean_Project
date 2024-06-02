const studentModel = require("../../../models/studentModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();
const changePassword = async (req, res) => {
  try {
    // console.log(req.body.token);
    if (req.body.token) {
      const decoded = jwt.verify(req.body.token, process.env.JWT_TOKEN_SECRET);
      var student = await studentModel.find({ email: decoded.user.email });
      if (student.length > 0) {
        student = student[0];
        var hash = bcrypt.hashSync(req.body.password, 10);

        if (req.body.confirmPassword == req.body.password) {
          student.password = hash;
          await student.save();
          res.status(200).send({ message: "Password Successfully Changed" });
        } else {
          res.statusCode = 400;
          res.status(400).send({ message: "passwords do not match" });
        }
      } else res.status(500).send({ message: "Something went wrong" });
    } else {
      res.status(401).send({ message: "Invalid current password" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Something went wrong" });
  }
};
module.exports = { changePassword };
