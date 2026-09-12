/** True once the app is actually running as an installed/standalone app. */
export function isRunningStandalone(): boolean {
  if (window.matchMedia("(display-mode: standalone)").matches) return true;
  // iOS Safari's own (non-standard) flag for "added to home screen".
  if ((window.navigator as Navigator & { standalone?: boolean }).standalone) {
    return true;
  }
  return false;
}

export function isIOS(): boolean {
  const ua = window.navigator.userAgent;
  const isAppleTouchDevice =
    /iphone|ipad|ipod/i.test(ua) ||
    // iPadOS 13+ reports as "MacIntel" with touch support enabled.
    (ua.includes("Macintosh") && navigator.maxTouchPoints > 1);
  return isAppleTouchDevice;
}

export function isSafari(): boolean {
  const ua = window.navigator.userAgent;
  return /safari/i.test(ua) && !/crios|fxios|edgios|chrome|android/i.test(ua);
}
