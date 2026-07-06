import { useState } from 'react';
import CircleTimer from '../components/CircleTimer.jsx';
import { useCountdown } from '../hooks/useCountdown.js';
import { BREAK_SUGGESTIONS } from '../data/mock.js';

export default function BreakScreen({ session, nextBlock, onContinue }) {
  const [done, setDone] = useState(false);
  const [checked, setChecked] = useState({});
  const [bursts, setBursts] = useState({});
  const { remaining, skip } = useCountdown(session.breakMin * 60, () => setDone(true));

  const toggleItem = (id) => {
    const nowChecked = !checked[id];
    setChecked({ ...checked, [id]: nowChecked });
    if (nowChecked) {
      setBursts((b) => ({ ...b, [id]: true }));
      setTimeout(() => setBursts((b) => ({ ...b, [id]: false })), 900);
    }
  };

  return (
    <div className="screen screen--break">
      <header className="nav-bar">
        <span className="nav-bar__side" />
        <h1 className="nav-bar__title">Pause</h1>
        <span className="nav-bar__side" />
      </header>

      <CircleTimer
        totalSeconds={session.breakMin * 60}
        remaining={remaining}
        sublabel={done ? 'Pause vorbei' : 'Durchatmen'}
        color="var(--sage-deep)"
        onSecretSkip={skip}
      />

      <section className="card card--list" style={{ textAlign: 'left' }}>
        <h2 className="card__title" style={{ marginTop: 10 }}>
          Gönn dir kurz was:
        </h2>
        <ul className="break-list">
          {BREAK_SUGGESTIONS.map((item) => (
            <li key={item.id} className="break-list__item">
              <label className={`check-row${checked[item.id] ? ' is-checked' : ''}`}>
                <input
                  type="checkbox"
                  checked={Boolean(checked[item.id])}
                  onChange={() => toggleItem(item.id)}
                />
                <span className="check-row__box" aria-hidden="true" />
                <span className="check-row__label">{item.label}</span>
              </label>
              {bursts[item.id] && (
                <span className="check-star" aria-hidden="true">
                  ✨
                </span>
              )}
            </li>
          ))}
        </ul>
        <p className="break-note">Lass dein Handy liegen – die Pause gehört dir.</p>
      </section>

      <button
        type="button"
        className={`btn btn--primary btn--big${done ? ' is-pulsing' : ''}`}
        onClick={onContinue}
      >
        Weiter mit Fokus · Block {nextBlock}
      </button>
    </div>
  );
}
