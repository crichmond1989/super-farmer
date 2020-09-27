import React, { useCallback, useEffect, useState } from "react";

import { getInvestmentAmount, setInvestmentAmount } from "../inputs/inputService";
import pools from "../pools/uniswap";
import Uniswap from "./Uniswap";

/**
 *
 * @param {object} props
 * @param {import("ethers").providers.Provider} props.provider
 */
export default function Platform({ provider }) {
  const [invested, setInvested] = useState(1000);

  useEffect(() => {
    setInvested(getInvestmentAmount() || 1000);
  }, [setInvested]);

  const updateInvested = useCallback(
    x => {
      setInvested(x);
      setInvestmentAmount(x);
    },
    [setInvested],
  );

  return (
    <div>
      <div className="grid">
        <form>
          <div className="form-group">
            <label htmlFor="invested">Investment Amount</label>
            <input
              type="tel"
              className="form-control"
              value={invested}
              onChange={e => updateInvested(e.target.value)}
            />
          </div>
        </form>
      </div>
      <div className="grid">
        {[...pools.values()].map(pool => (
          <Uniswap key={pool.address} {...{ invested, pool, provider }} />
        ))}
      </div>
    </div>
  );
}
