const instructorModel = require("../../../models/instructorModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const instructorLogin = async (req, res) => {
  try {
    
    var instructor = await instructorModel.find({ email: req.body.email });
    if (instructor.length > 0) {
      instructor = instructor[0];
      if (bcrypt.compareSync(req.body.password, instructor.password)) {
        var hash = bcrypt.hashSync(req.body.password, 10);
        const accessToken = jwt.sign(
          {
            user: {
              username: req.body.email,
              password: hash,
            },
          },
          process.env.JWT_TOKEN_SECRET,
          { expiresIn: "60m" }
        );
        instructor = instructor.toObject();
        delete instructor.password;
        delete instructor["__v"];
        instructor.name=instructor.firstname+instructor.lastname
        instructor.token=accessToken;
        instructor.role="instructor";
        res.send(instructor);
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

module.exports = { instructorLogin };
