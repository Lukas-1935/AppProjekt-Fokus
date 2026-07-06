import { formatSeconds } from '../utils/time.js';

/**
 * Großer Kreis-Timer mit Fortschrittsring.
 * Doppelklick auf den Kreis = versteckter Demo-Skip (via onSecretSkip).
 */
export default function CircleTimer({
  totalSeconds,
  remaining,
  sublabel,
  color = 'var(--blue)',
  onSecretSkip,
}) {
  const size = 260;
  const stroke = 10;
  const r = (size - stroke) / 2;
  const circumference = 2 * Math.PI * r;
  const fraction = totalSeconds > 0 ? remaining / totalSeconds : 0;
  const offset = circumference * (1 - fraction);

  return (
    <div
      className="circle-timer"
      onDoubleClick={onSecretSkip}
      role="timer"
      aria-label={`Noch ${formatSeconds(remaining)}`}
    >
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="var(--ring-track)"
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          style={{ transition: 'stroke-dashoffset 0.3s linear' }}
        />
      </svg>
      <div className="circle-timer__center">
        <span className="circle-timer__time">{formatSeconds(remaining)}</span>
        {sublabel && <span className="circle-timer__sub">{sublabel}</span>}
      </div>
    </div>
  );
}
