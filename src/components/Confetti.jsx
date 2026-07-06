import { useMemo } from 'react';

const COLORS = ['#1E3A5F', '#9CAF88', '#E8985E', '#D9C58F', '#7A8CA3'];

/** Konfettiregen für den Erfolgs-Screen (rein CSS-animiert). */
export default function Confetti({ count = 80 }) {
  const pieces = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        id: i,
        left: `${Math.random() * 100}%`,
        delay: `${Math.random() * 2.2}s`,
        duration: `${2.6 + Math.random() * 2}s`,
        size: 6 + Math.random() * 6,
        color: COLORS[i % COLORS.length],
        rotate: Math.random() * 360,
        round: Math.random() > 0.6,
      })),
    [count]
  );

  return (
    <div className="confetti" aria-hidden="true">
      {pieces.map((p) => (
        <span
          key={p.id}
          className="confetti__piece"
          style={{
            left: p.left,
            width: p.size,
            height: p.size * (p.round ? 1 : 1.7),
            background: p.color,
            borderRadius: p.round ? '50%' : '2px',
            animationDelay: p.delay,
            animationDuration: p.duration,
            transform: `rotate(${p.rotate}deg)`,
          }}
        />
      ))}
    </div>
  );
}
