import axios from "axios";

async function fetchCurrencies() {
  try {
    const params = `?apiKey=${process.env.CURRENCY_API_KEY}&code=USD,gram-altin,EUR,gumus`;
    const url = `https://www.nosyapi.com/apiv2/service/economy/currency/exchange-rate${params}`;
    const response = await axios.get(url);
    return response.data;
  } 
  catch (error) {
    console.log("CURRENCY_FETCH_ERROR", error);
  }
}

export { fetchCurrencies };
