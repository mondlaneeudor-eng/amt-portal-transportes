import { useCallback, useEffect, useRef, useState } from "react";
import {
  fetchCredentials,
  fetchSession,
  login as loginRequest,
  logout as logoutRequest,
  type ServiceCredential,
} from "../../lib/controlRoomApi";
import { ControlRoomModal } from "./ControlRoomModal";
import { ControlRoomPage } from "./ControlRoomPage";

// Client-side mirror of the server's sliding session window, used only to
// decide how often to re-check — the server cookie's own expiry is what
// actually enforces the 30-minute inactivity timeout.
const SESSION_POLL_MS = 60_000;

type Status = "checking" | "unauthenticated" | "authenticated";

interface ControlRoomContainerProps {
  onExit: () => void;
}

export function ControlRoomContainer({ onExit }: ControlRoomContainerProps) {
  const [status, setStatus] = useState<Status>("checking");
  const [services, setServices] = useState<ServiceCredential[] | null>(null);
  const pollRef = useRef<number | null>(null);

  const clearCredentials = useCallback(() => {
    // Drop credentials from memory the moment a session is known to be gone.
    setServices(null);
  }, []);

  const loadCredentials = useCallback(async () => {
    const result = await fetchCredentials();
    if (result.ok) {
      setServices(result.services);
      setStatus("authenticated");
    } else {
      clearCredentials();
      setStatus("unauthenticated");
    }
  }, [clearCredentials]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const authenticated = await fetchSession();
      if (cancelled) return;
      if (authenticated) {
        await loadCredentials();
      } else {
        setStatus("unauthenticated");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [loadCredentials]);

  // Poll the session while authenticated so a 30-minute-inactivity expiry
  // (or a lockout that happened elsewhere) is caught even if the user is
  // just idly looking at an already-loaded card, not clicking anything.
  useEffect(() => {
    if (status !== "authenticated") {
      if (pollRef.current) window.clearInterval(pollRef.current);
      return;
    }
    pollRef.current = window.setInterval(async () => {
      const authenticated = await fetchSession();
      if (!authenticated) {
        clearCredentials();
        setStatus("unauthenticated");
      }
    }, SESSION_POLL_MS);
    return () => {
      if (pollRef.current) window.clearInterval(pollRef.current);
    };
  }, [status, clearCredentials]);

  async function handleSubmitCode(code: string) {
    const result = await loginRequest(code);
    if (!result.ok) {
      return result.error;
    }
    await loadCredentials();
    return null;
  }

  async function handleLogout() {
    await logoutRequest();
    clearCredentials();
    setStatus("unauthenticated");
    onExit();
  }

  if (status !== "authenticated") {
    return (
      <ControlRoomModal
        loading={status === "checking"}
        onSubmitCode={handleSubmitCode}
        onClose={onExit}
      />
    );
  }

  return <ControlRoomPage services={services ?? []} onLogout={handleLogout} />;
}
