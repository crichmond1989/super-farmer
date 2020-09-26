import getDb from "../db/getDb";

const name = "prices";

export async function createTransaction() {
  return (await getDb()).transaction(name, "readwrite");
}

export async function get(key) {
  return (await getDb()).get(name, key);
}

export async function getAll() {
  return (await getDb()).getAll(name);
}

export async function createStore(db) {
  db.createObjectStore(name, { keyPath: "symbol" });
}
