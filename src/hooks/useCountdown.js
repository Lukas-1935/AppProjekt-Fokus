import { useEffect, useRef, useState } from 'react';

/**
 * Echter Countdown auf Zeitstempel-Basis (driftet nicht, übersteht Tab-Wechsel).
 * Liefert pause/resume und skip (für den versteckten Demo-Skip).
 * onEnd feuert genau einmal, sobald 0 erreicht ist.
 */
export function useCountdown(totalSeconds, onEnd) {
  const [remaining, setRemaining] = useState(totalSeconds);
  const [running, setRunning] = useState(true);
  const onEndRef = useRef(onEnd);
  const firedRef = useRef(false);
  onEndRef.current = onEnd;

  useEffect(() => {
    if (!running || remaining <= 0) return undefined;
    const endAt = Date.now() + remaining * 1000;
    const id = setInterval(() => {
      const left = Math.max(0, Math.ceil((endAt - Date.now()) / 1000));
      setRemaining(left);
      if (left <= 0) clearInterval(id);
    }, 200);
    return () => clearInterval(id);
    // "remaining" absichtlich nicht als Dependency: der Intervall-Tick selbst
    // aktualisiert remaining; neu aufsetzen nur bei Pause/Resume.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running]);

  useEffect(() => {
    if (remaining <= 0 && !firedRef.current) {
      firedRef.current = true;
      onEndRef.current?.();
    }
  }, [remaining]);

  return {
    remaining,
    running,
    pause: () => setRunning(false),
    resume: () => setRunning(true),
    skip: () => setRemaining(0),
  };
}
