import { useCallback, useEffect } from "react";

export default function (seconds, listener, deps) {
  const frozen = useCallback(listener, deps);

  useEffect(() => {
    const intervalId = setInterval(frozen, seconds * 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, [frozen, seconds]);
}
