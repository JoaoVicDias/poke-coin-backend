const satoshiBitcoin = require("satoshi-bitcoin");

const {
  onGetTotalSumFromHistorics,
  onGetAmountFromHistorics,
  onGetAllUsersPokemonInformations,
} = require("../services/pokemon");
const { onGetAllUserHistoric } = require("../services/historic");
const { onGetCurrentBTCValue } = require("../services/btcApi");

const { onConvertBtcToDolar } = require("../utils/calculation");

const BadDevNoCoffe = require("../errors/badDevNoCoffe");

const getWallet = async (req, res, next) => {
  let amountSpent;
  let currentValue;
  let btc;

  try {
    const [responseHistoric, responsePokemons, responseBtc] = await Promise.all(
      [
        onGetAllUserHistoric({ userId: req.user.id }),
        onGetAllUsersPokemonInformations(req.user.id),
        onGetCurrentBTCValue(),
      ]
    );

    btc = +responseBtc.data.data.amount;
    amountSpent = onGetTotalSumFromHistorics(responseHistoric);

    currentValue = responsePokemons.reduce((prevValue, currentValue) => {
      const pokemonPriceDolar = onConvertBtcToDolar(
        btc,
        satoshiBitcoin.toBitcoin(currentValue.dataValues.base_experience)
      );
      const pokemonAmount = onGetAmountFromHistorics(
        currentValue.dataValues.Historics
      );

      return (prevValue += pokemonAmount * pokemonPriceDolar);
    }, 0);
  } catch (error) {
    console.error(error);
    return next(new BadDevNoCoffe());
  }

  res.status(200).json({
    amountSpent,
    currentValue,
  });
};

module.exports = { getWallet };
