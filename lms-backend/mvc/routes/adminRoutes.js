const express = require('express');
let routes = express.Router();
const { adminLogin } = require('../controllers/admin/loginAdmin');
const { registerAdmin } = require('../controllers/admin/registerAdmin');
routes.post("/login",adminLogin);
routes.post("/register",registerAdmin);
module.exports = routes;