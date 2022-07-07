const axios = require("axios");

const baseUrl = "https://api.coinbase.com/v2";

const btcApi = axios.default.create({
  baseURL: baseUrl,
});

const onGetCurrentBTCValue = () => btcApi.get(`/prices/spot?currency=USD`);

module.exports = { onGetCurrentBTCValue };
