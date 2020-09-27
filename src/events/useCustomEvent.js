import { useCallback } from "react";

import useEventListener from "./useEventListener";

export default function (type, listener, deps) {
  const frozen = useCallback(listener, deps);

  const dispatch = ev => {
    const event = new CustomEvent(type, { detail: ev });
    window.dispatchEvent(event);
  };

  useEventListener(type, frozen, deps);

  return dispatch;
}
