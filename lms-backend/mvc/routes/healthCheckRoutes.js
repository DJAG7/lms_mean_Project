const express = require('express');
let routes = express.Router();
const {healthCheck} = require("../controllers/healthcheck/healthCheckController");
routes.get("/check",healthCheck);

module.exports = routes;