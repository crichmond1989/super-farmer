import React from "react";

export default function ({ image }) {
  return image ? <img src={image} alt="symbol" className="token-icon" /> : <span className="token-icon"></span>;
}
