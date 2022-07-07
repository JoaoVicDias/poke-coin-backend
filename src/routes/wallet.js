const express = require("express");

const auth = require("../middlewares/auth");

const walletController = require("../controllers/wallet");

const routes = express.Router();

routes.get("/", auth, walletController.getWallet);

module.exports = routes;
