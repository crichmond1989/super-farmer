export function getInvestmentAmount() {
  return +localStorage.getItem("investmentAmount");
}

export function setInvestmentAmount(value) {
  localStorage.setItem("investmentAmount", value);
}
