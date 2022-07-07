const express = require("express");

const auth = require("../middlewares/auth");

const historicController = require("../controllers/historic");

const routes = express.Router();

routes.get("/my-historic", auth, historicController.getAllHistoric);

module.exports = routes;
