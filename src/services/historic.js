const historicModel = require("../models/historic");

const onCreateHistoric = ({ name, type, amount, price, userId, pokeId }) =>
  historicModel.create({ name, type, amount, price, userId, pokeId });

const onGetAllUserHistoric = ({ userId }) =>
  historicModel.findAll({
    where: { userId },
    order: [['createdAt', 'DESC']]
  });

module.exports = { onCreateHistoric, onGetAllUserHistoric };
