const adminModel = require("../../models/adminModel");
const bycrypt = require("bcryptjs");

const registerAdmin = async (req, res) => {
  try {
    // console.log(req.body);
    // const admin = await adminModel.find({ email: req.body.email });
    // if (admin.length == 0) {
    //   var salt = bycrypt.genSaltSync(10);
    //   var hash = bycrypt.hashSync(req.body.password, salt);

    //   const newadmin = new adminModel({
    //     name: req.body.name,
    //     email: req.body.email,
    //     password: hash,
    //   });
    //   await newadmin.save();
      res.status(200).send({message:"Sorry That won't be possible, :-)LOL"});
    // } else {
    //   res.status(406).send({message:"already registered"});
    // }
  } catch (error) {
    console.log(error);
    res.status(407).send(error);
  }
};

module.exports = { registerAdmin };
