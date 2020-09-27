import tokens from "../tokens/tokenData";

export default async function getPrices() {
  const ids = [...tokens.values()].map(x => x.name).join(",");

  const response = await fetch(
    `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&ids=${ids}`,
  );

  const data = await response.json();

  for (const item of data) {
    item.symbol = item.symbol.toUpperCase();
  }

  return data;
}
