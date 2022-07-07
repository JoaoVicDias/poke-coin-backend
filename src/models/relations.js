const pokemonModel = require("./pokemon");
const userModel = require("./user");
const historicModel = require("./historic");

module.exports = () => {
  userModel.hasMany(pokemonModel, { foreignKey: "userId" });
  userModel.hasMany(historicModel, { foreignKey: "userId" });

  pokemonModel.hasMany(historicModel, { foreignKey: "pokeId" });
};
