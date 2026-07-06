import { useState } from 'react';

const MIN_REASON_LENGTH = 5;

/**
 * Pause während des Fokus: fragt einen Grund ab, bevor es in den
 * Pausenbildschirm geht. Der laufende Block wird dabei abgeschlossen –
 * z. B. weil die Aufgabe schon in kürzerer Zeit erledigt war.
 */
export default function PauseSheet({ isLastBlock, nextBlock, onConfirm, onDismiss }) {
  const [reason, setReason] = useState('');
  const ok = reason.trim().length >= MIN_REASON_LENGTH;
  const missing = Math.max(0, MIN_REASON_LENGTH - reason.trim().length);

  return (
    <div className="overlay" role="dialog" aria-modal="true" aria-label="Pause einlegen">
      <div className="dialog">
        <div className="dialog__grabber" aria-hidden="true" />
        <div className="dialog__emoji">🌿</div>
        <h2 className="dialog__title">Kurze Pause?</h2>
        <p className="dialog__streak">
          {isLastBlock
            ? 'Das war dein letzter Block – deine Session wird damit abgeschlossen.'
            : `Der laufende Block wird gewertet, danach geht es mit Block ${nextBlock} weiter.`}
        </p>

        <label className="dialog__label" htmlFor="pause-reason">
          Warum pausierst du jetzt?
        </label>
        <textarea
          id="pause-reason"
          className="dialog__textarea"
          rows={2}
          placeholder="z. B. Aufgabe schon geschafft …"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          autoFocus
        />
        {!ok && (
          <p className="dialog__hint">Noch mindestens {missing} Zeichen.</p>
        )}

        <button
          type="button"
          className="btn btn--success btn--big"
          disabled={!ok}
          onClick={() => onConfirm(reason.trim())}
        >
          {isLastBlock ? 'Session abschließen' : 'Pause starten'}
        </button>
        <button type="button" className="link" onClick={onDismiss}>
          Weiter fokussieren
        </button>
      </div>
    </div>
  );
}
