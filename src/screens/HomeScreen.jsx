import { useEffect, useRef } from 'react';
import { buildLeaderboard, leaderboardHint } from '../utils/streak.js';
import { GearIcon } from '../components/Icons.jsx';

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
      <header className="nav-bar">
        <span className="nav-bar__side" />
        <span style={{ flex: 1 }} />
        <button
          type="button"
          className="icon-btn"
          aria-label="Einstellungen"
          onClick={onOpenSettings}
        >
          <GearIcon />
        </button>
      </header>

      <div className="large-title-block">
        <h1 className="large-title">FokusApp</h1>
        <p className="eyebrow">{greeting()}, bleib dran.</p>
      </div>

      <section className="card card--streak">
        <span className="card--streak__flame" aria-hidden="true">
          🔥
        </span>
        <span className="card--streak__number">{stats.streak}</span>
        <span className="card--streak__label">
          {stats.streak === 1 ? 'Tag Streak' : 'Tage Streak'}
        </span>
        <span className="card--streak__meta">
          {stats.totalMinutes} Fokusminuten · {stats.sessionsCompleted}{' '}
          {stats.sessionsCompleted === 1 ? 'Session' : 'Sessions'}
        </span>
      </section>

      <p className="section-header">Rangliste</p>
      <section
        ref={boardRef}
        className={`card card--list${highlightLeaderboard ? ' card--flash' : ''}`}
      >
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
      </section>
      <p className="section-footer board__hint">{leaderboardHint(stats.streak)}</p>

      <button type="button" className="btn btn--primary btn--big" onClick={onNewSession}>
        Neue Session einrichten
      </button>
    </div>
  );
}
