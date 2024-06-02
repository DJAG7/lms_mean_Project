const organizationModel = require("../../models/organizationModel");

const getOrganization = async (req, res) => {
  try {
    let organizations = await organizationModel.find({});
    let organizationsArray = [];
    organizations.forEach((element) => {
      organizationsArray.push({
        name: element.organizationName,
        id: element._id,
      });
    });
    res.status(200).send({ organizations: organizationsArray });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Something went wrong" });
  }
};
module.exports = { getOrganization };
