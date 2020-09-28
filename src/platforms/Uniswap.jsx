import React, { useCallback, useEffect, useMemo, useState } from "react";

import { Contract } from "ethers";

import uniswapPairAbi from "../contracts/uniswapPairAbi";
import useStore from "../data/useStore";
import format from "../formatting/format";
import poolAuxService from "../poolAux/poolAuxService";
import tokenAuxService from "../tokenAux/tokenAuxService";
import TokenIcon from "../tokenIcon/TokenIcon";
import tokens from "../tokens/tokenData";

/**
 *
 * @param {object} props
 * @param {number} props.invested
 * @param {{
 *  address: string
 *  crop: string
 *  cropAmount: number
 *  symbols: string[]
 * }} props.pool
 * @param {import("ethers").providers.Provider} props.provider
 */
export default function Uniswap({ invested, pool, provider }) {
  const [contract, setContract] = useState();
  const [cropImage, setCropImage] = useState();
  const [cropPrice, setCropPrice] = useState();
  const [reserves, setReserves] = useState([]);
  const [reserveImages, setReserveImages] = useState([]);
  const [reservePrices, setReservePrices] = useState([]);

  useStore(
    `poolAux/${pool.address}`,
    async () => {
      const poolAux = await poolAuxService.get(pool.address);

      if (poolAux) {
        setReserves(poolAux.reserves);
      }
    },
    [pool.address, setReserves],
  );

  useStore(
    "tokenAux",
    async () => {
      const cropData = await tokenAuxService.get(pool.crop);

      if (cropData) {
        setCropImage(cropData.image);
        setCropPrice(cropData.current_price);
      }

      if (reserves.length) {
        const reserveData = await Promise.all(pool.symbols.map(tokenAuxService.get));

        setReserveImages(reserveData.filter(x => x).map(x => x.image));
        setReservePrices(reserveData.filter(x => x).map(x => x.current_price));
      }
    },
    [pool.crop, pool.symbols, reserves.length],
  );

  const digits = useMemo(() => pool.symbols.map(x => tokens.get(x).digits), [pool.symbols]);

  const updateReservesFromRaw = useCallback(
    raw => {
      const newReserves = raw.map((x, i) => x / Math.pow(10, digits[i]));

      poolAuxService.put({ address: pool.address, reserves: newReserves });
    },
    [digits, pool.address],
  );

  const updateReservesFromContract = useCallback(async () => {
    if (contract) {
      const raw = await contract.getReserves();

      updateReservesFromRaw(raw.slice(0, 2));
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

  let liquidity;

  if (reserves.length && reservePrices.length) {
    liquidity = reserves.reduce((p, x, i) => p + x * reservePrices[i], 0);
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
                <td>{getReserve(reserves[0], pool.symbols[0], reserveImages[0], reservePrices[0]) || "Loading..."}</td>
              </tr>
              {pool.symbols.slice(1).map((symbol, i) => (
                <tr key={i}>
                  <td />
                  <td>
                    {getReserve(reserves[i + 1], symbol, reserveImages[i + 1], reservePrices[i + 1]) || "Loading..."}
                  </td>
                </tr>
              ))}
              <tr>
                <td>Liquidity:</td>
                <td>{format(liquidity, "$")}</td>
              </tr>
              <tr>
                <td>Crops Available:</td>
                <td>
                  <TokenIcon image={cropImage} /> {format(pool.cropAmount, "0")} {pool.crop} ({format(cropPrice, "$")})
                </td>
              </tr>
              <tr>
                <td>Crops Farmed:</td>
                <td>
                  <TokenIcon image={cropImage} /> {format(crops, "2")} {pool.crop}
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

function getReserve(data, symbol, image, price) {
  return (
    data && (
      <>
        <TokenIcon image={image} /> {format(data, "0")} {symbol} ({format(price, "$")})
      </>
    )
  );
}
