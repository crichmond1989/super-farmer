import getPrices from "./getPrices";
import { createTransaction } from "./priceStore";

export { getAll } from "./priceStore";

export async function sync() {
  const data = await getPrices();

  const tx = await createTransaction();
  const { store } = tx;

  for (const item of data) {
    const existing = await store.get(item.symbol);

    await store.put({ ...existing, ...item });
  }

  await tx.done;

  window.dispatchEvent(new CustomEvent("prices"));
}
