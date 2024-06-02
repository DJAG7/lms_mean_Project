const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const organizationeModel = require("../../../models/organizationModel");
const organizationLogin = async (req, res) => {
  try {
    var organization = await organizationeModel.find({ _id: req.body.org });
    if (organization.length > 0) {
      organization = organization[0];
      // if (bcrypt.compareSync(req.body.password, instructor.password)) {
      //   var hash = bcrypt.hashSync(req.body.password, 10);
      //   const accessToken = jwt.sign(
      //     {
      //       user: {
      //         username: req.body.email,
      //         password: hash,
      //       },
      //     },
      //     process.env.JWT_TOKEN_SECRET,
      //     { expiresIn: "60m" }
      //   );
      //   instructor = instructor.toObject();
      //   delete instructor.password;
      //   delete instructor["__v"];
      //   instructor.name=instructor.firstname+instructor.lastname
      //   instructor.token=accessToken;
      //   instructor.role="instructor";
      //   res.send(instructor);
      // } 
      console.log(organization,req.body,organization.password,req.body.password);
      if(organization.password==req.body.password){
        organization = organization.toObject();
        delete organization.password;
        delete organization["__v"];
        res.send(organization);
      }else {
        res.status(405).send({ message: "wrong password" });
      }
    } else {
      res.status(405).send({ message: "Organization not found" });
    }
  } catch (error) {
    console.log(error);
    res.status(404).send({ message: error });
  }
};

module.exports = { organizationLogin };
