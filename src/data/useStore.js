import { useCallback, useEffect } from "react";

import useCustomEvent from "../events/useCustomEvent";

export default function (type, listener, deps) {
  const frozen = useCallback(listener, deps);

  useEffect(() => {
    frozen();
  }, [frozen]);

  useCustomEvent(type, frozen, [frozen]);
}
