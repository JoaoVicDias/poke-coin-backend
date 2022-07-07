const { DataTypes } = require("sequelize");

const sequelize = require("./dataBase");

const user = sequelize.define("User", {
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
  email: {
    type: DataTypes.CHAR,
    allowNull: false,
  },
  password: {
    type: DataTypes.CHAR,
    allowNull: false,
  },
});

module.exports = user;
