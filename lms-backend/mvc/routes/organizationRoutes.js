const express = require('express');
const { getOrganization } = require('../controllers/orgs/getOrgs');
const { organizationLogin } = require('../controllers/orgs/auth/loginOrg');
const { getOrganizationTests } = require('../controllers/orgs/getOrgTests');
const { getOrganizationTestWiseStudents } = require('../controllers/orgs/getOrgTestsWiseStudents');
let routes = express.Router();

routes.get("/getOrganizations",getOrganization);
routes.post("/getOrgTests",getOrganizationTests);
routes.post("/getOrgTestwiseStudents",getOrganizationTestWiseStudents);
routes.post("/login",organizationLogin);
module.exports = routes;