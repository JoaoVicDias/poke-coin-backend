const { DataTypes } = require("sequelize");

const sequelize = require("./dataBase");

const pokemon = sequelize.define("Pokemons", {
  id: {
    primaryKey: true,
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    allowNull: false,
  },
  name: {
    type: DataTypes.CHAR,
    allowNull: false,
  },
  base_experience: {
    type: DataTypes.CHAR,
    allowNull: false,
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
});

module.exports = pokemon;
