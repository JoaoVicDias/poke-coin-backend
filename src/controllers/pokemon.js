const { validationResult } = require("express-validator");
const satoshiBtc = require("satoshi-bitcoin");

const { onGetPokemonInformations } = require("../services/pokeApi");
const { onGetCurrentBTCValue } = require("../services/btcApi");
const {
  onCreatePokemon,
  onGetUserPokemonInformations,
  onGetUserPokemon,
  onGetAllUsersPokemonInformations,
  onGetAmountFromHistorics,
  onGetTotalSumFromHistorics,
  onDeleteUserPokemonByName,
} = require("../services/pokemon");
const { onCreateHistoric } = require("../services/historic");

const invalidFields = require("../errors/invalidFields");
const badDevNoCoffe = require("../errors/badDevNoCoffe");
const ErrorWithResponse = require("../errors/errorWithResponse");

const { onConvertBtcToDolar } = require("../utils/calculation");

const purchasePokemon = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return next(new invalidFields());

  const { name, amount } = req.body;

  let pokemonPrice;
  let btc;

  try {
    const [resPoke, resBtc] = await Promise.all([
      onGetPokemonInformations(name),
      onGetCurrentBTCValue(),
    ]);
    pokemonPrice = resPoke.data.base_experience;
    btc = +resBtc.data.data.amount;
  } catch (error) {
    console.error(error);
    return next(new badDevNoCoffe());
  }

  const pokemonData = {
    name,
    amount,
    price: onConvertBtcToDolar(btc, satoshiBtc.toBitcoin(pokemonPrice)),
    userId: req.user.id,
    base_experience: pokemonPrice,
  };

  try {
    const existingPokemon = await onGetUserPokemon({
      name,
      userId: req.user.id,
    });

    if (!existingPokemon) {
      const createdPokemon = await onCreatePokemon({ ...pokemonData });

      await onCreateHistoric({
        ...pokemonData,
        type: "purchase",
        pokeId: createdPokemon.dataValues.id,
      });
    } else {
      await onCreateHistoric({
        ...pokemonData,
        type: "purchase",
        pokeId: existingPokemon.dataValues.id,
      });
    }
  } catch (error) {
    console.error(error);
    return next(new badDevNoCoffe());
  }

  res.status(201).json();
};

const salePokemon = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return next(new invalidFields());

  const { name, amount } = req.body;

  let pokemon;
  let pokemonAmount;
  try {
    pokemon = await onGetUserPokemonInformations({ name, userId: req.user.id });

    if (!pokemon)
      return next(new ErrorWithResponse("Você não possui este pokemon!"));

    pokemonAmount = onGetAmountFromHistorics(pokemon.dataValues.Historics);

    if (pokemonAmount < amount)
      return next(
        new ErrorWithResponse("Você não possui tantos pokemons para vender")
      );
  } catch (error) {
    console.error(error);
    return next(new badDevNoCoffe());
  }

  let btc;
  try {
    const resBtc = await onGetCurrentBTCValue();
    btc = +resBtc.data.data.amount;
  } catch (error) {
    console.error(error);
    return next(new badDevNoCoffe());
  }

  try {
    await onCreateHistoric({
      name,
      amount,
      type: "sale",
      price: onConvertBtcToDolar(
        btc,
        satoshiBtc.toBitcoin(pokemon.dataValues.base_experience)
      ),
      userId: req.user.id,
      pokeId: pokemon.dataValues.id,
    });
  } catch (error) {
    console.error(error);
    return next(new badDevNoCoffe());
  }

  res.status(201).json();
};

const getMyPokemons = async (req, res, next) => {
  let response;
  try {
    response = await onGetAllUsersPokemonInformations(req.user.id);
  } catch (error) {
    console.error(error);
    return next(new badDevNoCoffe());
  }

  let btc;
  try {
    const resBtc = await onGetCurrentBTCValue();
    btc = +resBtc.data.data.amount;
  } catch (error) {
    console.error(error);
    return next(new badDevNoCoffe());
  }

  const pokemons = response.map((pokemon) => {
    const amountSpent = onGetTotalSumFromHistorics(
      pokemon.dataValues.Historics
    );

    const price = onConvertBtcToDolar(
      btc,
      satoshiBtc.toBitcoin(pokemon.dataValues.base_experience)
    );
    const amount = onGetAmountFromHistorics(pokemon.dataValues.Historics);

    const currentValue = amount * price;
    return {
      amountSpent,
      currentValue,
      amount,
      ...pokemon.dataValues,
    };
  });

  res.json(pokemons);
};

module.exports = { purchasePokemon, salePokemon, getMyPokemons };
