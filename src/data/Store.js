import { openDB } from "idb/with-async-ittr.js";

export const storeConfigs = [
  {
    name: "poolAux",
    key: "address",
  },
  {
    name: "tokenAux",
    key: "symbol",
  },
];

const dbPromise = openDB("main", 2, {
  upgrade(db) {
    for (const item of storeConfigs) {
      db.createObjectStore(item.name, { keyPath: item.key });
    }
  },
});

const getDb = () => {
  return dbPromise;
};

export default class {
  constructor(name) {
    this.name = name;
  }

  createTransaction = async () => {
    return (await getDb()).transaction(this.name, "readwrite");
  };

  get = async key => {
    return (await getDb()).get(this.name, key);
  };

  getAll = async () => {
    return (await getDb()).getAll(this.name);
  };

  put = async item => {
    return (await getDb()).put(this.name, item);
  };
}
