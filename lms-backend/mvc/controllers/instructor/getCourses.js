const instructorModel = require("../../models/instructorModel");
const { getImageProxyHandler } = require("../proxy/getImageProxyHandler");
const getProxies = (arr) => {
  const promises = arr.map(async (item) => {
    return {
      ...item.toObject(),
      thumbnail: await getImageProxyHandler(item.thumbnail),
    };
  });
  return Promise.all(promises);
};
const getCourses = async (req, res) => {
  try {
    //  console.log(req.body);
    var instructor = await instructorModel
      .find({
        email: req.body.email,
      })
      .populate("courses");
    if (instructor.length > 0) {
      instructor = instructor[0];
      var courses = await getProxies(instructor.courses);
      res.status(200).send({ courses: courses });
    } else {
      res.status(500).send({ message: "instructor not found" });
    }
  } catch (err) {
    res.status(500).send({ message: "Something went wrong" });
  }
};
module.exports = { getCourses };
