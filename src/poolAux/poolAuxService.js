import poolAuxStore from "./poolAuxStore";

class PoolAuxService {
  get(address) {
    return poolAuxStore.get(address);
  }

  getAll() {
    return poolAuxStore.getAll();
  }

  async put(item) {
    await poolAuxStore.put(item);

    window.dispatchEvent(new CustomEvent(`poolAux/${item.address}`));
  }
}

export default new PoolAuxService();
