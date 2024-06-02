const adminModel = require("../../models/adminModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const adminLogin = async (req, res) => {
  try {
    
    var admin = await adminModel.find({ email: req.body.email })
    if (admin.length > 0) {
      admin = admin[0];
      if (bcrypt.compareSync(req.body.password, admin.password)) {
        var hash = bcrypt.hashSync(req.body.password, 10);
        const accessToken = jwt.sign(
          {
            user: {
              username: req.body.email,
            },
          },
          process.env.JWT_TOKEN_SECRET,
          { expiresIn: "60m" }
        );
        admin = admin.toObject();
        delete admin.password;
        delete admin.email;
        admin.token=accessToken;
        admin.role="admin";
        res.status(200).send(admin);
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

module.exports = { adminLogin };
