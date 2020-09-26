import React, { useCallback, useEffect, useMemo, useState } from "react";

import { Contract } from "ethers";

import uniswapPairAbi from "../contracts/uniswapPairAbi";
import useStore from "../data/useStore";
import format from "../formatting/format";
import { get } from "../prices/priceStore";
import tokens from "../tokens/tokenData";

/**
 *
 * @param {object} props
 * @param {number} props.invested
 * @param {object} props.pool
 * @param {Map<string,number>} props.prices
 * @param {import("ethers").providers.Provider} props.provider
 */
export default function Uniswap({ invested, pool, provider }) {
  const [contract, setContract] = useState();
  const [cropPrice, setCropPrice] = useState();
  const [reserves, setReserves] = useState([]);
  const [reservePrices, setReservePrices] = useState([]);

  useStore(
    "prices",
    async () => {
      const cropData = await get(pool.crop);

      setCropPrice(cropData.current_price);

      if (reserves.length) {
        const reserveData = [await get(pool.symbols[0]), await get(pool.symbols[1])];

        setReservePrices(reserveData.map(x => x.current_price));
      }
    },
    [pool.crop, pool.symbols, reserves.length],
  );

  const digits = useMemo(() => pool.symbols.map(x => tokens.get(x).digits), [pool.symbols]);

  const updateReservesFromRaw = useCallback(
    raw => {
      const newReserves = raw.map((x, i) => x / Math.pow(10, digits[i]));

      setReserves(newReserves);
    },
    [digits, setReserves],
  );

  const updateReservesFromContract = useCallback(async () => {
    if (contract) {
      const raw = await contract.getReserves();

      updateReservesFromRaw(raw);
    }
  }, [contract, updateReservesFromRaw]);

  const updateReservesFromSync = useCallback(async () => {
    if (contract) {
      contract.on("Sync", (newReserve1, newReserve2) => updateReservesFromRaw([newReserve1, newReserve2]));
    }
  }, [contract, updateReservesFromRaw]);

  useEffect(() => {
    updateReservesFromContract();
    updateReservesFromSync();
  }, [updateReservesFromContract, updateReservesFromSync]);

  useEffect(() => {
    if (provider) {
      setContract(new Contract(pool.address, uniswapPairAbi, provider));
    }
  }, [pool, provider, setContract]);

  const [reserve1, reserve2] = reserves;
  const [reservePrice1, reservePrice2] = reservePrices;

  let liquidity;

  if (reserves.length && reservePrices.length) {
    liquidity = reserve1 * reservePrice1 + reserve2 * reservePrice2;
  }

  let crops;

  if (liquidity) {
    crops = (invested * pool.cropAmount) / liquidity;
  }

  return (
    <div>
      <div className="card">
        <div className="card-header" style={{ display: "flex", justifyContent: "space-between" }}>
          <a
            className="mr-2"
            href={`https://uniswap.info/pair/${pool.address}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            {pool.symbols[0]}/{pool.symbols[1]}
          </a>
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
