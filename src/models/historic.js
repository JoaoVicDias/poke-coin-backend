const { DataTypes } = require("sequelize");

const sequelize = require("./dataBase");

const historic = sequelize.define("Historic", {
  id: {
    primaryKey: true,
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    allowNull: false,
  },
  type: {
    type: DataTypes.CHAR,
    allowNull: false,
  },
  name: {
    type: DataTypes.CHAR,
    allowNull: false,
  },
  amount: {
    type: DataTypes.BIGINT,
    allowNull: false,
  },
  price: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  pokeId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
});

module.exports = historic;
