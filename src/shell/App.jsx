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
  const provider = useMemo(
    () =>
      providers.getDefaultProvider("homestead", {
        alchemy: "jSOkP3oJXXlVsP9IpTpA-Rnhg7aVolb2",
        etherscan: "EI3F81HDGHQ7E77I7EWPXGNXE41UGJDIW6",
        infura: "cb4f03b5b06646bdb999f6b98249cb59",
      }),
    [],
  );

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
