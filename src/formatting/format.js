export default function (data, type) {
  if (data === null || data === undefined) {
    return data;
  }

  const options = {};

  if (type === "0") {
    options.maximumFractionDigits = 0;
  }

  if (type === "2") {
    options.maximumFractionDigits = 2;
  }

  if (type === "$") {
    options.currency = "USD";
    options.style = "currency";
  }

  if (type === "%") {
    options.style = "percent";
  }

  return data && data.toLocaleString(undefined, options);
}
