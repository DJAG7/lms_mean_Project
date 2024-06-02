const studentModel = require("../../../models/studentModel");

const studentSubscribe = async (req, res) => {
  var date = new Date(
    new Date().getTime() + parseInt(req.body.days) * 86400000
  );

  await studentModel.findOneAndUpdate(
    { email: req.headers.email },
    {
      subStart: Date.now(),
      subEnd: date,
    }
  );
  res.send("Subscribed");
};
module.exports = { studentSubscribe };
