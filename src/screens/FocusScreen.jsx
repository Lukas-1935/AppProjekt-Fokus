import { useEffect, useState } from 'react';
import CircleTimer from '../components/CircleTimer.jsx';
import HoldToStopButton from '../components/HoldToStopButton.jsx';
import AbortDialog from '../components/AbortDialog.jsx';
import PauseSheet from '../components/PauseSheet.jsx';
import RewardBurst from '../components/RewardBurst.jsx';
import { useCountdown } from '../hooks/useCountdown.js';
import { MusicIcon, SearchIcon } from '../components/Icons.jsx';
import { startFocusSound, stopFocusSound, setFocusVolume } from '../utils/audio.js';

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

export default function FocusScreen({
  session,
  currentBlock,
  settings,
  streak,
  onComplete,
  onEarlyBreak,
  onQuit,
}) {
  const totalSeconds = session.focusMin * 60;
  const { remaining, pause, resume, skip } = useCountdown(totalSeconds, onComplete);

  const [showAbortDialog, setShowAbortDialog] = useState(false);
  const [showPauseSheet, setShowPauseSheet] = useState(false);
  const [showReward, setShowReward] = useState(false);

  const [musicOn, setMusicOn] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [search, setSearch] = useState({ status: 'idle' });

  // Klang beim Verlassen des Screens (Blockende, Abbruch, Pause) stoppen
  useEffect(() => () => stopFocusSound(), []);

  const toggleMusic = () => {
    if (musicOn) {
      stopFocusSound();
      setMusicOn(false);
    } else {
      setMusicOn(startFocusSound(volume));
    }
  };

  const changeVolume = (v) => {
    setVolume(v);
    setFocusVolume(v);
  };

  const runSearch = async (event) => {
    event.preventDefault();
    const term = query.trim();
    if (!term) return;
    setSearch({ status: 'loading' });
    try {
      const url =
        'https://de.wikipedia.org/w/api.php?action=query&list=search&format=json&origin=*&srlimit=2&srsearch=' +
        encodeURIComponent(term);
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      const hits = (data.query?.search ?? []).map((h) => ({
        title: h.title,
        snippet: h.snippet.replace(/<[^>]+>/g, ''),
      }));
      setSearch({ status: 'done', hits });
    } catch {
      setSearch({ status: 'error' });
    }
  };

  const openAbortDialog = () => {
    pause();
    setShowAbortDialog(true);
  };

  const continueSession = () => {
    setShowAbortDialog(false);
    setShowReward(true);
    resume();
  };

  const openPauseSheet = () => {
    pause();
    setShowPauseSheet(true);
  };

  const dismissPauseSheet = () => {
    setShowPauseSheet(false);
    resume();
  };

  const confirmPause = () => {
    // Angefangenen Block mit den tatsächlich fokussierten Minuten werten
    onEarlyBreak(Math.round((totalSeconds - remaining) / 60));
  };

  return (
    <div className="screen screen--focus">
      <BlockDots current={currentBlock} total={session.totalBlocks} />

      <CircleTimer
        totalSeconds={totalSeconds}
        remaining={remaining}
        sublabel="Fokus"
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
          title={settings.allowMusic ? 'Fokus-Klang' : 'In den Einstellungen deaktiviert'}
          onClick={toggleMusic}
        >
          <span className="tool-btn__icon">
            <MusicIcon />
          </span>
          Musik
        </button>
        <button
          type="button"
          className={`tool-btn${searchOpen ? ' is-active' : ''}`}
          disabled={!settings.allowLookup}
          title={settings.allowLookup ? 'Nachschlagen' : 'In den Einstellungen deaktiviert'}
          onClick={() => setSearchOpen(!searchOpen)}
        >
          <span className="tool-btn__icon">
            <SearchIcon />
          </span>
          Suche
        </button>
      </div>

      {musicOn && (
        <div className="mini-panel">
          <span className="equalizer" aria-hidden="true">
            <i />
            <i />
            <i />
          </span>
          <span className="mini-panel__text">Fokus-Klang läuft</span>
          <input
            className="volume"
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={volume}
            aria-label="Lautstärke"
            onChange={(e) => changeVolume(Number(e.target.value))}
          />
        </div>
      )}

      {searchOpen && (
        <form className="mini-panel mini-panel--search" onSubmit={runSearch}>
          <input
            className="text-input text-input--small"
            type="search"
            placeholder="Wikipedia durchsuchen …"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          {search.status === 'idle' && (
            <p className="mini-panel__hint">Nur fürs Thema – dann zurück in den Fokus.</p>
          )}
          {search.status === 'loading' && <p className="mini-panel__hint">Suche …</p>}
          {search.status === 'error' && (
            <p className="mini-panel__hint">Keine Verbindung – versuch es gleich nochmal.</p>
          )}
          {search.status === 'done' &&
            (search.hits.length === 0 ? (
              <p className="mini-panel__hint">Nichts gefunden.</p>
            ) : (
              search.hits.map((hit) => (
                <a
                  key={hit.title}
                  className="search-hit"
                  href={`https://de.wikipedia.org/wiki/${encodeURIComponent(hit.title)}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  <span className="search-hit__title">{hit.title} ↗</span>
                  <span className="search-hit__snippet">{hit.snippet}…</span>
                </a>
              ))
            ))}
        </form>
      )}

      <div className="focus-actions">
        <button type="button" className="btn btn--secondary" onClick={openPauseSheet}>
          Pause
        </button>
        <HoldToStopButton onComplete={openAbortDialog} />
      </div>

      {showPauseSheet && (
        <PauseSheet
          isLastBlock={currentBlock >= session.totalBlocks}
          nextBlock={currentBlock + 1}
          onConfirm={confirmPause}
          onDismiss={dismissPauseSheet}
        />
      )}
      {showAbortDialog && (
        <AbortDialog streak={streak} onContinue={continueSession} onQuit={onQuit} />
      )}
      {showReward && <RewardBurst onDone={() => setShowReward(false)} />}
    </div>
  );
}
