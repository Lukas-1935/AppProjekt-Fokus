import Confetti from '../components/Confetti.jsx';
import { milestoneProgress } from '../utils/streak.js';

export default function SuccessScreen({ session, stats, onDone, onShowLeaderboard }) {
  const { reached, next, progress } = milestoneProgress(stats.streak);

  return (
    <div className="screen screen--success">
      <Confetti />

      <div className="success-hero">
        <span className="success-hero__emoji" aria-hidden="true">
          🎉
        </span>
        <h1 className="success-hero__title">
          Alle {session.totalBlocks} {session.totalBlocks === 1 ? 'Block' : 'Blöcke'} geschafft!
        </h1>
        <p className="success-hero__sub">„{session.goal}" – sauber durchgezogen.</p>
      </div>

      <div className="stat-grid">
        <div className="stat-tile">
          <span className="stat-tile__value">{stats.totalMinutes}</span>
          <span className="stat-tile__label">Minuten gesamt</span>
        </div>
        <div className="stat-tile">
          <span className="stat-tile__value">{stats.streak}</span>
          <span className="stat-tile__label">Tage Streak</span>
        </div>
        <div className="stat-tile">
          <span className="stat-tile__value">{stats.blocksToday}</span>
          <span className="stat-tile__label">Blöcke heute</span>
        </div>
      </div>

      <section className="card card--milestone">
        <span className="card--milestone__icon" aria-hidden="true">
          {reached ? '🏆' : '🎯'}
        </span>
        <div>
          <p className="card--milestone__title">
            {reached
              ? `${reached} Tage in Folge – Pokal freigeschaltet!`
              : `Nächster Meilenstein: ${next} Tage in Folge`}
          </p>
          {next && (
            <>
              <div
                className="progress"
                role="progressbar"
                aria-valuemin={0}
                aria-valuemax={next}
                aria-valuenow={stats.streak}
              >
                <div className="progress__fill" style={{ width: `${progress * 100}%` }} />
              </div>
              <p className="card--milestone__sub">
                Noch {next - stats.streak} {next - stats.streak === 1 ? 'Tag' : 'Tage'} bis{' '}
                {next} Tage in Folge
              </p>
            </>
          )}
        </div>
      </section>

      <div className="success-actions">
        <button type="button" className="btn btn--primary btn--big" onClick={onDone}>
          Fertig
        </button>
        <button type="button" className="btn btn--secondary btn--big" onClick={onShowLeaderboard}>
          Rangliste ansehen
        </button>
      </div>
    </div>
  );
}
