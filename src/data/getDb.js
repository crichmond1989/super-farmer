import { openDB } from "idb/with-async-ittr.js";

import { createStore as createPriceStore } from "../prices/priceStore";

export default function () {
  return openDB("main", 1, {
    upgrade(db) {
      createPriceStore(db);
    },
  });
}
