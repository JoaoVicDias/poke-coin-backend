const express = require("express");
const { check } = require("express-validator");

const auth = require("../middlewares/auth");

const pokemonController = require("../controllers/pokemon");

const routes = express.Router();

routes.post(
  "/purchase",
  auth,
  [
    check("name").trim().not().isEmpty(),
    check("amount")
      .trim()
      .not()
      .isEmpty()
      .isNumeric()
      .isLength({ min: 1 })
      .isInt(),
  ],
  pokemonController.purchasePokemon
);
routes.post(
  "/sale",
  auth,
  [
    check("name").trim().not().isEmpty(),
    check("amount")
      .trim()
      .not()
      .isEmpty()
      .isNumeric()
      .isLength({ min: 1 })
      .isInt(),
  ],
  pokemonController.salePokemon
);

routes.get("/my-pokemons", auth, pokemonController.getMyPokemons);

module.exports = routes;
