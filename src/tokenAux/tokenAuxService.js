import tokens from "../tokens/tokenData";
import tokenAuxStore from "./tokenAuxStore";

class TokenAuxService {
  get = symbol => {
    return tokenAuxStore.get(symbol);
  };

  getAll() {
    return tokenAuxStore.getAll();
  }

  sync = async () => {
    const data = await this.getTokenAux();

    const tx = await tokenAuxStore.createTransaction();
    const { store } = tx;

    for (const item of data) {
      const existing = await store.get(item.symbol);

      await store.put({ ...existing, ...item });
    }

    await tx.done;

    window.dispatchEvent(new CustomEvent("tokenAux"));
  };

  getTokenAux = async () => {
    const ids = [...tokens.values()].map(x => x.name).join(",");

    const response = await fetch(
      `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&ids=${ids}`,
    );

    const data = await response.json();

    for (const item of data) {
      item.symbol = item.symbol.toUpperCase();
    }

    return data;
  };
}

export default new TokenAuxService();
