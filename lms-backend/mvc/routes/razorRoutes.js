const express = require("express");
const { createOrder } = require("../../mvc/controllers/razorpay/createOrder");
const { verifyOrder } = require("../controllers/razorpay/verifyOrder");
let routes = express.Router();
routes.post("/verifyOrder", verifyOrder);
routes.post("/createOrder", createOrder);
module.exports = routes;
