const data = [
  {
    digits: 18,
    name: "dai",
    symbol: "DAI",
  },
  {
    digits: 18,
    name: "ethereum",
    symbol: "ETH",
  },
  {
    digits: 18,
    name: "uniswap",
    symbol: "UNI",
  },
  {
    digits: 6,
    name: "usd-coin",
    symbol: "USDC",
  },
  {
    digits: 6,
    name: "tether",
    symbol: "USDT",
  },
  {
    digits: 8,
    name: "wrapped-bitcoin",
    symbol: "WBTC",
  },
];

export default new Map(data.map(x => [x.symbol, x]));
