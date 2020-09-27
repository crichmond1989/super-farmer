import { useCallback, useEffect } from "react";

export default function (type, listener, deps) {
  const frozen = useCallback(listener, deps);

  useEffect(() => {
    window.addEventListener(type, frozen);

    return () => window.removeEventListener(type, frozen);
  }, [type, frozen]);
}
