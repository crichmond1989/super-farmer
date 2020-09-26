import React, { useState } from "react";

import pools from "../pools/uniswap";
import Uniswap from "./Uniswap";

/**
 *
 * @param {object} props
 * @param {Map<string,number>} props.prices
 * @param {import("ethers").providers.Provider} props.provider
 */
export default function Platform({ clock, prices, provider }) {
  const [invested, setInvested] = useState(1000);

  return (
    <div>
      <div className="grid">
        <form>
          <div className="form-group">
            <label htmlFor="invested">Investment Amount</label>
            <input type="tel" className="form-control" value={invested} onChange={e => setInvested(e.target.value)} />
          </div>
        </form>
      </div>
      <div className="grid">
        {[...pools.values()].map(pool => (
          <Uniswap key={pool.address} {...{ clock, invested, pool, prices, provider }} />
        ))}
      </div>
    </div>
  );
}
