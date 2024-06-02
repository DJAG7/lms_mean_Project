const express = require('express');
const { createNewMeeting } = require('../controllers/live-class/createMeeting');

let routes = express.Router();
routes.post("/create-class",createNewMeeting);
module.exports = routes;