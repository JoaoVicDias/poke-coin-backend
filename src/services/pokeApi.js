const axios = require("axios");

const baseUrl = "https://pokeapi.co/api/v2";

const pokeApi = axios.default.create({
  baseURL: baseUrl,
});

const onGetPokemonInformations = (name) => pokeApi.get(`/pokemon/${name}`);

module.exports = { onGetPokemonInformations };
