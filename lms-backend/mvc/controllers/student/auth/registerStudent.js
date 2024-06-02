const studentModel = require("../../../models/studentModel");
const bycrypt = require("bcryptjs");
const { sendTemplateEmail, sendEmail } = require("../../ses/sendEmail");
const jwt = require("jsonwebtoken");
const studentDetailsModel = require("../../../models/studentDetailsModel");
const orgModel = require("../../../models/organizationModel");
const registerStudent = async (req, res) => {
  try {
    const student = await studentModel.find({ email: req.body.email });
    if (student.length == 0) {
      var salt = bycrypt.genSaltSync(10);
      var hash = bycrypt.hashSync(req.body.password, salt);
      const orgDetails = await orgModel.find({
        _id: req.body.organization,
      });
      if (orgDetails.length <= 0) {
        res.status(500).send({ message: "Invalid Organization" });
        return;
      }
      let studentDetails = new studentDetailsModel({
        name: { value: req.body.name },
        email: { value: req.body.email },
        organization: {
          value: orgDetails[0].organizationName,
          organizationId: orgDetails[0]._id,
        },
      });
      studentDetails = await studentDetails.save();
      const newStudent = new studentModel({
        name: req.body.name,
        studentDetails: studentDetails._id,
        firstname: req.body.name.split(" ")[0],
        lastname: req.body.name.split(" ")[1]
          ? req.body.name.split(" ")[1]
          : " ",
        organization: orgDetails[0].organizationName,
        organizationId: orgDetails[0]._id,
        email: req.body.email,
        password: hash,
      });
      await newStudent.save();
      const accessToken = jwt.sign(
        {
          user: {
            email: req.body.email,
            type: 2,
          },
        },
        process.env.JWT_TOKEN_SECRET
      );
      await sendEmail(
        req.body.email,
        req.body.name,
        `<html><body>Hey ${req.body.name}, <a href='https://learn.sparrowcodinglabs.com/auth/confirm/${accessToken}'>Click here to verify your account.</a><br/></body></html>`
      );
      res.status(200).send({
        message: "User Successfully Registered.Please verify your account.",
      });
    } else {
      res.status(406).send({ message: "already registered" });
    }
  } catch (error) {
    console.log(error);
    res.status(407).send(error);
  }
};

module.exports = { registerStudent };
