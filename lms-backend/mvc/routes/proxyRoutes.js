const express = require("express");
const { getImageProxyApi } = require("../controllers/proxy/imageProxyApi");
let routes = express.Router();
routes.post("/imageproxy", getImageProxyApi);
module.exports = routes;
