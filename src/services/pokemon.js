const pokemonModel = require("../models/pokemon");
const historicModel = require("../models/historic");

const onCreatePokemon = ({ name, price, amount, userId, base_experience }) =>
  pokemonModel.create({ name, price, amount, userId, base_experience });

const onGetUserPokemon = ({ name, userId }) =>
  pokemonModel.findOne({
    where: {
      name,
      userId,
    },
  });

const onGetUserPokemonInformations = ({ name, userId }) =>
  pokemonModel.findOne({
    where: {
      name,
      userId,
    },
    include: [
      {
        model: historicModel,
        foreignKey: "pokeId",
      },
    ],
  });

const onGetAllUsersPokemonInformations = (userId) =>
  pokemonModel.findAll({
    where: {
      userId,
    },
    order: [["createdAt", "DESC"]],
    include: [
      {
        model: historicModel,
        foreignKey: "pokeId",
      },
    ],
  });

const onGetAmountFromHistorics = (historic) => {
  return +historic.reduce(
    (previousValue, currentValue) =>
      currentValue.type === "purchase"
        ? (previousValue += currentValue.amount)
        : (previousValue -= currentValue.amount),
    0
  );
};

const onGetTotalSumFromHistorics = (historic) => {
  return +historic
    .reduce(
      (prevValue, currentValue) =>
        currentValue.type === "purchase"
          ? (prevValue += currentValue.amount * currentValue.price)
          : (prevValue -= currentValue.amount * currentValue.price),
      0
    )
    .toFixed(3);
};

module.exports = {
  onCreatePokemon,
  onGetUserPokemon,
  onGetUserPokemonInformations,
  onGetAllUsersPokemonInformations,
  onGetAmountFromHistorics,
  onGetTotalSumFromHistorics,
};
