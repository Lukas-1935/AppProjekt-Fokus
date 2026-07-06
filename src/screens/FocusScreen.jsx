import { useState } from 'react';
import CircleTimer from '../components/CircleTimer.jsx';
import HoldToStopButton from '../components/HoldToStopButton.jsx';
import AbortDialog from '../components/AbortDialog.jsx';
import RewardBurst from '../components/RewardBurst.jsx';
import { useCountdown } from '../hooks/useCountdown.js';

/** Punktreihe "Block X von Y": abgeschlossene + aktueller Block gefüllt. */
function BlockDots({ current, total }) {
  return (
    <div className="block-dots" aria-label={`Block ${current} von ${total}`}>
      <span className="block-dots__text">
        Block {current} von {total}
      </span>
      <span className="block-dots__row" aria-hidden="true">
        {Array.from({ length: total }, (_, i) => (
          <span key={i} className={`dot${i < current ? ' is-filled' : ''}`} />
        ))}
      </span>
    </div>
  );
}

export default function FocusScreen({ session, currentBlock, settings, streak, onComplete, onQuit }) {
  const { remaining, pause, resume, skip } = useCountdown(session.focusMin * 60, onComplete);
  const [showAbortDialog, setShowAbortDialog] = useState(false);
  const [showReward, setShowReward] = useState(false);
  const [userPaused, setUserPaused] = useState(false);
  const [musicOn, setMusicOn] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const totalSeconds = session.focusMin * 60;

  const openAbortDialog = () => {
    pause();
    setShowAbortDialog(true);
  };

  const continueSession = () => {
    setShowAbortDialog(false);
    setShowReward(true);
    if (!userPaused) resume();
  };

  const togglePause = () => {
    if (userPaused) {
      resume();
    } else {
      pause();
    }
    setUserPaused(!userPaused);
  };

  return (
    <div className="screen screen--focus">
      <BlockDots current={currentBlock} total={session.totalBlocks} />

      <CircleTimer
        totalSeconds={totalSeconds}
        remaining={remaining}
        sublabel={userPaused ? 'pausiert' : 'Fokus'}
        onSecretSkip={skip}
      />

      <p className="focus-goal">
        <span className="focus-goal__label">Dein Ziel</span>
        {session.goal}
      </p>

      <div className="tool-row">
        <button
          type="button"
          className={`tool-btn${musicOn ? ' is-active' : ''}`}
          disabled={!settings.allowMusic}
          title={settings.allowMusic ? 'Musik' : 'In den Einstellungen deaktiviert'}
          onClick={() => setMusicOn(!musicOn)}
        >
          ♪ Musik{!settings.allowMusic && ' 🔒'}
        </button>
        <button
          type="button"
          className={`tool-btn${searchOpen ? ' is-active' : ''}`}
          disabled={!settings.allowLookup}
          title={settings.allowLookup ? 'Nachschlagen' : 'In den Einstellungen deaktiviert'}
          onClick={() => setSearchOpen(!searchOpen)}
        >
          🔍 Suche{!settings.allowLookup && ' 🔒'}
        </button>
      </div>

      {musicOn && (
        <div className="mini-panel">
          <span className="equalizer" aria-hidden="true">
            <i /><i /><i />
          </span>
          Lo-Fi Fokus läuft leise …
        </div>
      )}
      {searchOpen && (
        <div className="mini-panel mini-panel--search">
          <input className="text-input text-input--small" type="search" placeholder="Kurz nachschlagen …" />
          <p className="mini-panel__hint">Nur fürs Thema – dann zurück in den Fokus.</p>
        </div>
      )}

      <div className="focus-actions">
        <button type="button" className="btn btn--secondary" onClick={togglePause}>
          {userPaused ? 'Weiter' : 'Pause'}
        </button>
        <HoldToStopButton onComplete={openAbortDialog} />
      </div>

      {showAbortDialog && (
        <AbortDialog streak={streak} onContinue={continueSession} onQuit={onQuit} />
      )}
      {showReward && <RewardBurst onDone={() => setShowReward(false)} />}
    </div>
  );
}
