import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Registers the service worker and tracks whether an updated version is
 * waiting to take over. Activation of that new version is never automatic —
 * `applyUpdate()` only runs when the person explicitly clicks "Actualizar",
 * so it can never interrupt them mid-way through the Sala de Controlo.
 */
export function useServiceWorkerUpdate() {
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const waitingWorker = useRef<ServiceWorker | null>(null);
  const reloadedOnce = useRef(false);

  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;

    function handleWaitingWorker(worker: ServiceWorker | null) {
      if (!worker) return;
      waitingWorker.current = worker;
      setUpdateAvailable(true);
    }

    navigator.serviceWorker.register("/sw.js").then((reg) => {
      if (reg.waiting && reg.active) {
        handleWaitingWorker(reg.waiting);
      }

      reg.addEventListener("updatefound", () => {
        const installing = reg.installing;
        if (!installing) return;
        installing.addEventListener("statechange", () => {
          if (installing.state === "installed" && reg.active) {
            handleWaitingWorker(reg.waiting ?? installing);
          }
        });
      });
    });

    function onControllerChange() {
      if (reloadedOnce.current) return;
      reloadedOnce.current = true;
      window.location.reload();
    }
    navigator.serviceWorker.addEventListener(
      "controllerchange",
      onControllerChange
    );

    return () => {
      navigator.serviceWorker.removeEventListener(
        "controllerchange",
        onControllerChange
      );
    };
  }, []);

  const applyUpdate = useCallback(() => {
    waitingWorker.current?.postMessage({ type: "SKIP_WAITING" });
    setUpdateAvailable(false);
  }, []);

  return { updateAvailable, applyUpdate };
}
