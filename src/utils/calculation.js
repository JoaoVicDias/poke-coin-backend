const onConvertBtcToDolar = (currentBtcPriceDolar, btc) => {
  return (currentBtcPriceDolar * btc).toFixed(3);
};

module.exports = {
    onConvertBtcToDolar
};
