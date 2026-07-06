import { useState } from 'react';
import { TIME_PRESETS } from '../data/mock.js';

const FREQUENCIES = [1, 2, 3];

/** Session einrichten: Ziel, Zeitblock (Preset oder Eigen), Häufigkeit. */
export default function SetupScreen({ onStart, onBack }) {
  const [goal, setGoal] = useState('');
  const [presetId, setPresetId] = useState('25-5');
  const [customFocus, setCustomFocus] = useState(30);
  const [customBreak, setCustomBreak] = useState(5);
  const [blocks, setBlocks] = useState(2);

  const isCustom = presetId === 'custom';
  const preset = TIME_PRESETS.find((p) => p.id === presetId);
  const focusMin = isCustom ? Number(customFocus) : preset.focusMin;
  const breakMin = isCustom ? Number(customBreak) : preset.breakMin;

  const goalOk = goal.trim().length > 0;
  const timesOk =
    Number.isFinite(focusMin) && focusMin >= 1 && focusMin <= 180 &&
    Number.isFinite(breakMin) && breakMin >= 1 && breakMin <= 60;
  const canStart = goalOk && timesOk;

  const start = () => {
    if (!canStart) return;
    onStart({ goal: goal.trim(), focusMin, breakMin, totalBlocks: blocks });
  };

  return (
    <div className="screen">
      <header className="screen__header">
        <button type="button" className="icon-btn" aria-label="Zurück" onClick={onBack}>
          ←
        </button>
        <h1 className="screen__title screen__title--center">Neue Session</h1>
        <span className="icon-btn icon-btn--ghost" aria-hidden="true" />
      </header>

      <section className="card">
        <label className="field-label" htmlFor="goal">
          Woran arbeitest du?
        </label>
        <input
          id="goal"
          className="text-input"
          type="text"
          placeholder="z. B. Kapitel 3 der Bachelorarbeit"
          value={goal}
          onChange={(e) => setGoal(e.target.value)}
          maxLength={80}
        />
      </section>

      <section className="card">
        <h2 className="card__title">Zeitblock (Fokus / Pause)</h2>
        <div className="choice-row">
          {TIME_PRESETS.map((p) => (
            <button
              key={p.id}
              type="button"
              className={`choice${presetId === p.id ? ' is-active' : ''}`}
              onClick={() => setPresetId(p.id)}
            >
              <span className="choice__big">{p.label}</span>
              <span className="choice__small">Minuten</span>
            </button>
          ))}
          <button
            type="button"
            className={`choice${isCustom ? ' is-active' : ''}`}
            onClick={() => setPresetId('custom')}
          >
            <span className="choice__big">Eigen</span>
            <span className="choice__small">anpassen</span>
          </button>
        </div>

        {isCustom && (
          <div className="custom-times">
            <label className="custom-times__field">
              <span>Fokus (Min.)</span>
              <input
                type="number"
                min="1"
                max="180"
                value={customFocus}
                onChange={(e) => setCustomFocus(e.target.value)}
              />
            </label>
            <label className="custom-times__field">
              <span>Pause (Min.)</span>
              <input
                type="number"
                min="1"
                max="60"
                value={customBreak}
                onChange={(e) => setCustomBreak(e.target.value)}
              />
            </label>
          </div>
        )}
      </section>

      <section className="card">
        <h2 className="card__title">Wie viele Blöcke?</h2>
        <div className="choice-row">
          {FREQUENCIES.map((n) => (
            <button
              key={n}
              type="button"
              className={`choice${blocks === n ? ' is-active' : ''}`}
              onClick={() => setBlocks(n)}
            >
              <span className="choice__big">{n}×</span>
              <span className="choice__small">{n === 1 ? 'Block' : 'Blöcke'}</span>
            </button>
          ))}
        </div>
      </section>

      <button
        type="button"
        className="btn btn--primary btn--big"
        disabled={!canStart}
        onClick={start}
      >
        Fokus starten
      </button>
      {!goalOk && <p className="form-hint">Gib zuerst dein Ziel ein.</p>}
    </div>
  );
}
