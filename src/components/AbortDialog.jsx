import { useEffect, useState } from 'react';

const COOLDOWN_S = 3;
const MIN_REASON_LENGTH = 5;

/**
 * Abbruchhürde: Streak-Motivation, Pflicht-Begründung (min. 5 Zeichen)
 * und 3s-Cooldown auf "Trotzdem beenden".
 */
export default function AbortDialog({ streak, onContinue, onQuit }) {
  const [reason, setReason] = useState('');
  const [cooldown, setCooldown] = useState(COOLDOWN_S);

  useEffect(() => {
    if (cooldown <= 0) return undefined;
    const id = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(id);
  }, [cooldown]);

  const reasonOk = reason.trim().length >= MIN_REASON_LENGTH;
  const quitEnabled = reasonOk && cooldown <= 0;
  const missing = Math.max(0, MIN_REASON_LENGTH - reason.trim().length);

  return (
    <div className="overlay" role="dialog" aria-modal="true" aria-label="Session wirklich beenden?">
      <div className="dialog">
        <div className="dialog__emoji">🔥</div>
        <h2 className="dialog__title">Bleib dran!</h2>
        <p className="dialog__streak">
          {streak > 0 ? (
            <>
              Du würdest deine <strong>{streak}-Tage-Streak</strong> verlieren!
            </>
          ) : (
            <>Heute ist der Start deiner neuen Streak – gib nicht auf!</>
          )}
        </p>

        <label className="dialog__label" htmlFor="abort-reason">
          Warum jetzt aufhören?
        </label>
        <textarea
          id="abort-reason"
          className="dialog__textarea"
          rows={3}
          placeholder="Sei ehrlich mit dir …"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          autoFocus
        />
        {!reasonOk && (
          <p className="dialog__hint">
            Noch mindestens {missing} Zeichen, dann kannst du beenden.
          </p>
        )}

        <button type="button" className="btn btn--primary btn--big" onClick={onContinue}>
          Doch weitermachen
        </button>
        <button
          type="button"
          className="link link--danger"
          disabled={!quitEnabled}
          onClick={onQuit}
        >
          {cooldown > 0 ? `Trotzdem beenden (${cooldown})` : 'Trotzdem beenden'}
        </button>
      </div>
    </div>
  );
}
