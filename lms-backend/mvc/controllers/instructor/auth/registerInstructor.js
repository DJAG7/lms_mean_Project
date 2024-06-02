const instructorModel = require("../../../models/instructorModel");
const bycrypt = require("bcryptjs");

const registerinstructor = async (req, res) => {
  try {
    const instructor = await instructorModel.find({ email: req.body.email });
    if (instructor.length == 0) {
      var salt = bycrypt.genSaltSync(10);
      var hash = bycrypt.hashSync(req.body.password, salt);

      const newinstructor = new instructorModel({
        name: req.body.name,
        firstname: req.body.name.split(" ")[0],
        lastname: req.body.name.split(" ")[1]
          ? req.body.name.split(" ")[1]
          : " ",
        email: req.body.email,
        password: hash,
      });
      await newinstructor.save();
      res.status(200).send({ message: "Please ask admin" });
    } else {
      res.status(406).send({ message: "already registered" });
    }
  } catch (error) {
    console.log(error);
    res.status(407).send(error);
  }
};

module.exports = { registerinstructor };
