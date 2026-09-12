import { useEffect, useState, useCallback } from "react";
import { isIOS, isRunningStandalone, isSafari } from "../lib/pwaEnvironment";

const DISMISSED_AT_KEY = "amt-install-dismissed-at";
const SNOOZE_DAYS = 7;

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

function wasRecentlyDismissed(): boolean {
  const raw = window.localStorage.getItem(DISMISSED_AT_KEY);
  if (!raw) return false;
  const dismissedAt = Number(raw);
  if (Number.isNaN(dismissedAt)) return false;
  const elapsedDays = (Date.now() - dismissedAt) / (1000 * 60 * 60 * 24);
  return elapsedDays < SNOOZE_DAYS;
}

export type InstallPromptKind = "native" | "ios-instructions" | null;

export function useInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  // Safari never fires beforeinstallprompt, so its (manual-instructions)
  // banner state is knowable synchronously at mount — derived directly as
  // initial state rather than set from inside the effect below.
  const [visible, setVisible] = useState(
    () => !isRunningStandalone() && !wasRecentlyDismissed() && isIOS() && isSafari()
  );
  const [kind, setKind] = useState<InstallPromptKind>(() =>
    !isRunningStandalone() && !wasRecentlyDismissed() && isIOS() && isSafari()
      ? "ios-instructions"
      : null
  );

  useEffect(() => {
    if (isRunningStandalone() || wasRecentlyDismissed()) return;

    function onBeforeInstallPrompt(event: Event) {
      event.preventDefault();
      setDeferredPrompt(event as BeforeInstallPromptEvent);
      setKind("native");
      setVisible(true);
    }

    function onAppInstalled() {
      setVisible(false);
      setDeferredPrompt(null);
    }

    window.addEventListener("beforeinstallprompt", onBeforeInstallPrompt);
    window.addEventListener("appinstalled", onAppInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", onBeforeInstallPrompt);
      window.removeEventListener("appinstalled", onAppInstalled);
    };
  }, []);

  const install = useCallback(async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    setDeferredPrompt(null);
    setVisible(false);
  }, [deferredPrompt]);

  const dismiss = useCallback(() => {
    window.localStorage.setItem(DISMISSED_AT_KEY, String(Date.now()));
    setVisible(false);
  }, []);

  return { visible, kind, install, dismiss };
}
