import React, { useEffect, useMemo, useState } from "react";

import { providers } from "ethers";

import Platform from "../platforms/Platform";
import getPrices from "../prices/getPrices";
import Header from "./Header";

const intervalSecs = 15;

export default function App() {
  const [address, setAddress] = useState("");
  const [clock, setClock] = useState(0);
  const [prices, setPrices] = useState();

  /**
   * @type {import("ethers").providers.Provider}
   */
  const provider = useMemo(() => providers.getDefaultProvider(), []);

  useEffect(() => {
    // TODO: import MetaMask amounts to show real APY
    // if (window.ethereum) {
    //   window.ethereum.request({ method: "eth_requestAccounts" }).then(x => {
    //     setAddress(x[0]);
    //   });
    // }
  }, []);

  useEffect(() => {
    getPrices().then(x => setPrices(new Map(x.map(y => [y.symbol.toUpperCase(), y.current_price]))));
  }, [clock]);

  useEffect(() => {
    const intervalId = setInterval(() => setClock(clock + 1), intervalSecs * 1000);

    return () => {
      clearInterval(intervalId);
    };
  });

  return (
    <div>
      <Header address={address} />
      <main className="container my-3">
        <Platform address={address} clock={clock} prices={prices} provider={provider} />
      </main>
    </div>
  );
}
