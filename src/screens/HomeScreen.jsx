import { useEffect, useRef } from 'react';
import { buildLeaderboard, leaderboardHint } from '../utils/streak.js';

function greeting() {
  const h = new Date().getHours();
  if (h < 11) return 'Guten Morgen';
  if (h < 18) return 'Guten Tag';
  return 'Guten Abend';
}

export default function HomeScreen({ stats, onNewSession, onOpenSettings, highlightLeaderboard }) {
  const board = buildLeaderboard(stats.streak);
  const boardRef = useRef(null);

  useEffect(() => {
    if (highlightLeaderboard && boardRef.current) {
      boardRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [highlightLeaderboard]);

  return (
    <div className="screen">
      <header className="screen__header">
        <div>
          <p className="eyebrow">{greeting()} 👋</p>
          <h1 className="screen__title">FokusApp</h1>
        </div>
        <button
          type="button"
          className="icon-btn"
          aria-label="Einstellungen"
          onClick={onOpenSettings}
        >
          ⚙️
        </button>
      </header>

      <section className="card card--streak">
        <span className="card--streak__flame" aria-hidden="true">
          🔥
        </span>
        <span className="card--streak__number">{stats.streak}</span>
        <span className="card--streak__label">
          {stats.streak === 1 ? 'Tag Streak' : 'Tage Streak'}
        </span>
      </section>

      <section
        ref={boardRef}
        className={`card${highlightLeaderboard ? ' card--flash' : ''}`}
      >
        <h2 className="card__title">Rangliste</h2>
        <ol className="board">
          {board.map((entry, i) => (
            <li key={entry.id} className={`board__row${entry.me ? ' is-me' : ''}`}>
              <span className="board__rank">{i + 1}</span>
              <span className="board__avatar" style={{ background: entry.color }}>
                {entry.name[0]}
              </span>
              <span className="board__name">{entry.name}</span>
              <span className="board__streak">🔥 {entry.streak}</span>
            </li>
          ))}
        </ol>
        <p className="board__hint">{leaderboardHint(stats.streak)}</p>
      </section>

      <button type="button" className="btn btn--primary btn--big" onClick={onNewSession}>
        Neue Session einrichten
      </button>
    </div>
  );
}
