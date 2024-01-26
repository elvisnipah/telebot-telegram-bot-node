const axios = require("axios");
require("dotenv").config();

const URL = `https://v6.exchangerate-api.com/v6/${process.env.CURRENCY_TOKEN}/latest`;

const getCurrencyRates = async (currency) => {
  const response = await axios.get(`${URL}/${currency}`);

  //   console.log("getCurrency function" + response.data);
  return response.data;
};

module.exports = { getCurrencyRates };
