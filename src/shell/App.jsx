import React, { useMemo } from "react";

import { providers } from "ethers";

import useInterval from "../intervals/useInterval";
import Platform from "../platforms/Platform";
import { sync } from "../prices/priceService";
import Header from "./Header";

export default function App() {
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

  useInterval(60, sync);

  return (
    <div>
      <Header />
      <main className="container my-3">
        <Platform provider={provider} />
      </main>
    </div>
  );
}
