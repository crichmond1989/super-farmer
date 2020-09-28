export default class {
  getInvestmentAmount() {
    return +localStorage.getItem("investmentAmount");
  }

  setInvestmentAmount(value) {
    localStorage.setItem("investmentAmount", value);
  }
}
