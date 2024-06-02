const studentModel = require("../../../models/studentModel");

const getValidity = async (req, res) => {
    await studentModel
      .findOne({ email: req.headers.email }, { subStart: 1, subEnd: 1 })
      .then((data) => {
        res.send(data);
      });
  };
module.exports = {getValidity}