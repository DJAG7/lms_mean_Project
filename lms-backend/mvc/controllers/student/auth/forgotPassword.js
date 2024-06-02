const studentModel = require("../../../models/studentModel");
const { sendEmail } = require("../../ses/sendEmail");
const jwt = require("jsonwebtoken");
const forgotPassword = async (req, res) => {
  try {
    var student = await studentModel.find({ email: req.body.email });
    if (student.length > 0) {
      student = student[0];
      const accessToken = jwt.sign(
        {
          user: {
            email: req.body.email,
            type: 2,
          },
        },
        process.env.JWT_TOKEN_SECRET,
        { expiresIn: "10m" }
      );
      await sendEmail(req.body.email, student.name, `<html><body>Hey ${student.name}, <a href='https://learn.sparrowcodinglabs.com/auth/forgot/${accessToken}'>Click here to Reset Password.</a><br/>This is only valid for 10 minutes.</body></html>`);
    }
    res.status(200).send({ message: "If user exists than an email is sent. " });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Something went wrong" });
  }
};
module.exports = { forgotPassword };
