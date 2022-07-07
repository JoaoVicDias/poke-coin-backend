const express = require("express");

const userRoutes = require("./user");
const pokemonRoutes = require("./pokemon");
const historicRoutes = require("./historic");
const walletRoutes = require("./wallet");

const app = express();

app.use("/user", userRoutes);
app.use("/pokemon", pokemonRoutes);
app.use("/historic", historicRoutes);
app.use("/wallet", walletRoutes);

module.exports = app;
