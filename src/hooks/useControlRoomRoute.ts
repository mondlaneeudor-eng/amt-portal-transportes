import { useCallback, useEffect, useState } from "react";

export const CONTROL_ROOM_PATH = "/sala-de-controlo";

/**
 * Tracks whether the app is currently on the Sala de Controlo route, using
 * plain History API push/pop — this project has no router dependency, and
 * a single extra path doesn't need one. Kept as a real route (not just
 * component state) so a direct hit on /sala-de-controlo is caught by the
 * same "no valid session → ask for the code" gate as the header button.
 */
export function useControlRoomRoute() {
  const [path, setPath] = useState(() => window.location.pathname);

  useEffect(() => {
    function onPopState() {
      setPath(window.location.pathname);
    }
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  const enter = useCallback(() => {
    window.history.pushState({}, "", CONTROL_ROOM_PATH);
    setPath(CONTROL_ROOM_PATH);
  }, []);

  const exit = useCallback(() => {
    window.history.pushState({}, "", "/");
    setPath("/");
  }, []);

  return { isControlRoom: path === CONTROL_ROOM_PATH, enter, exit };
}
