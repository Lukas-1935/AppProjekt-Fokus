import { useEffect } from 'react';

const STARS = [
  { left: '28%', top: '30%', delay: '0s', size: '22px' },
  { left: '62%', top: '22%', delay: '0.1s', size: '16px' },
  { left: '48%', top: '42%', delay: '0.05s', size: '28px' },
  { left: '70%', top: '48%', delay: '0.2s', size: '18px' },
  { left: '34%', top: '55%', delay: '0.15s', size: '15px' },
];

/**
 * Kleine, nicht ablenkende Belohnung nach "Doch weitermachen":
 * kurzes Aufleuchten plus ein paar Sterne, danach ruft onDone auf.
 */
export default function RewardBurst({ onDone }) {
  useEffect(() => {
    const id = setTimeout(onDone, 1400);
    return () => clearTimeout(id);
  }, [onDone]);

  return (
    <div className="reward" aria-hidden="true">
      <div className="reward__glow" />
      {STARS.map((s, i) => (
        <span
          key={i}
          className="reward__star"
          style={{ left: s.left, top: s.top, animationDelay: s.delay, fontSize: s.size }}
        >
          ✦
        </span>
      ))}
      <p className="reward__text">Starke Entscheidung!</p>
    </div>
  );
}
