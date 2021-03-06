import React, { useCallback, useEffect, useState } from "react";

import InputService from "../inputs/InputService";
import pools from "../pools/uniswap";
import Uniswap from "./Uniswap";

const inputService = new InputService();

/**
 *
 * @param {object} props
 * @param {import("ethers").providers.Provider} props.provider
 */
export default function Platform({ provider }) {
  const [invested, setInvested] = useState(1000);

  useEffect(() => {
    setInvested(inputService.getInvestmentAmount() || 1000);
  }, [setInvested]);

  const updateInvested = useCallback(
    x => {
      setInvested(x);
      inputService.setInvestmentAmount(x);
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
