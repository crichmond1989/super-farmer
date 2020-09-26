import React, { useEffect, useMemo, useState } from "react";

import { providers } from "ethers";

import Platform from "../platforms/Platform";
import { sync } from "../prices/priceService";
import Header from "./Header";

const intervalSecs = 15;

export default function App() {
  const [clock, setClock] = useState(0);

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
    sync();
  }, [clock]);

  useEffect(() => {
    const intervalId = setInterval(() => setClock(clock + 1), intervalSecs * 1000);

    return () => {
      clearInterval(intervalId);
    };
  });

  return (
    <div>
      <Header />
      <main className="container my-3">
        <Platform provider={provider} />
      </main>
    </div>
  );
}
