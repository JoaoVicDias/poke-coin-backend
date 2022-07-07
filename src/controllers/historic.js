const { onGetAllUserHistoric } = require("../services/historic");

const BadDevNoCoffe = require("../errors/badDevNoCoffe");

const getAllHistoric = async (req, res, next) => {
  let response;
  try {
    response = await onGetAllUserHistoric({ userId: req.user.id });
  } catch (error) {
    console.error(error);
    return next(new BadDevNoCoffe());
  }

  res.status(200).json(response);
};

module.exports = { getAllHistoric };
