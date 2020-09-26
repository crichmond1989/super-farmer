import React, { useEffect, useState } from "react";

import { Contract } from "ethers";

import uniswapPairAbi from "../contracts/uniswapPairAbi";
import format from "../formatting/format";
import tokens from "../tokens/tokens";

/**
 *
 * @param {object} props
 * @param {number} props.invested
 * @param {object} props.pool
 * @param {Map<string,number>} props.prices
 * @param {import("ethers").providers.Provider} props.provider
 */
export default function Uniswap({ clock, invested, pool, prices, provider }) {
  const [contract, setContract] = useState();
  const [reserves, setReserves] = useState([]);

  useEffect(() => {
    if (provider) {
      setContract(new Contract(pool.address, uniswapPairAbi, provider));
    }
  }, [pool, provider, setContract]);

  useEffect(() => {
    if (contract) {
      const digitsA = tokens.get(pool.symbols[0]).digits;
      const digitsB = tokens.get(pool.symbols[1]).digits;

      contract
        .getReserves()
        .then(([reserve1, reserve2]) =>
          setReserves([reserve1 / Math.pow(10, digitsA), reserve2 / Math.pow(10, digitsB)]),
        );
    }
  }, [clock, contract, setReserves, pool.symbols]);

  const [reserve1, reserve2] = reserves;
  const [symbol1, symbol2] = pool.symbols;

  const cropPrice = prices && prices.get(pool.crop);

  let liquidity;

  if (prices && reserve1 && reserve2) {
    liquidity = reserve1 * prices.get(symbol1) + reserve2 * prices.get(symbol2);
  }

  let crops;

  if (liquidity) {
    crops = (invested * pool.cropAmount) / liquidity;
  }

  return (
    <div>
      <div className="card">
        <div className="card-header" style={{ display: "flex", justifyContent: "space-between" }}>
          <span className="mr-2">
            {pool.symbols[0]}/{pool.symbols[1]}
          </span>
          <a
            href={`https://etherscan.io/address/${pool.address}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{ textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap" }}
          >
            {pool.address}
          </a>
        </div>
        <div className="card-body swap-card">
          <table>
            <tbody>
              <tr>
                <td>Reserves:</td>
                <td>{getReserve(reserve1, pool.symbols[0])}</td>
              </tr>
              <tr>
                <td />
                <td>{getReserve(reserve2, pool.symbols[1])}</td>
              </tr>
              <tr>
                <td>Liquidity:</td>
                <td>{format(liquidity, "$")}</td>
              </tr>
              <tr>
                <td>Crops Available:</td>
                <td>
                  {format(pool.cropAmount, "0")} {pool.crop} ({format(cropPrice, "$")})
                </td>
              </tr>
              <tr>
                <td>Crops Farmed:</td>
                <td>
                  {format(crops, "2")} {pool.crop}
                </td>
              </tr>
              <tr>
                <td>Profit:</td>
                <td>
                  {format(crops * cropPrice, "$")} ({format((crops * cropPrice * 365.0) / invested, "%")} APY)
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function getReserve(data, symbol) {
  return (
    data && (
      <>
        {format(data, "0")} {symbol}
      </>
    )
  );
}
