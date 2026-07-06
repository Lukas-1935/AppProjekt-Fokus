import { useEffect, useRef, useState } from 'react';

const HOLD_MS = 3000;

/**
 * Stopp-Button, der 3 Sekunden gedrückt gehalten werden muss.
 * Während des Haltens füllt sich ein Progress-Ring im Button;
 * Loslassen (oder Finger wegziehen) bricht ab.
 */
export default function HoldToStopButton({ onComplete }) {
  const [progress, setProgress] = useState(0);
  const intervalRef = useRef(null);
  const completedRef = useRef(false);

  const cancel = () => {
    clearInterval(intervalRef.current);
    intervalRef.current = null;
    setProgress(0);
  };

  const start = (event) => {
    event.preventDefault();
    if (intervalRef.current) return;
    completedRef.current = false;
    const startedAt = Date.now();
    intervalRef.current = setInterval(() => {
      const p = Math.min(1, (Date.now() - startedAt) / HOLD_MS);
      setProgress(p);
      if (p >= 1 && !completedRef.current) {
        completedRef.current = true;
        cancel();
        onComplete();
      }
    }, 50);
  };

  useEffect(() => cancel, []);

  const r = 9;
  const circumference = 2 * Math.PI * r;

  return (
    <button
      type="button"
      className={`btn btn--stop${progress > 0 ? ' is-holding' : ''}`}
      onPointerDown={start}
      onPointerUp={cancel}
      onPointerLeave={cancel}
      onPointerCancel={cancel}
      onContextMenu={(e) => e.preventDefault()}
    >
      <svg className="hold-ring" width="22" height="22" viewBox="0 0 22 22" aria-hidden="true">
        <circle cx="11" cy="11" r={r} fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="3" />
        <circle
          cx="11"
          cy="11"
          r={r}
          fill="none"
          stroke="#fff"
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference * (1 - progress)}
          transform="rotate(-90 11 11)"
        />
      </svg>
      Stopp – gedrückt halten
    </button>
  );
}
