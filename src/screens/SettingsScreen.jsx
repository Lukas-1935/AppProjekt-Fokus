import Toggle from '../components/Toggle.jsx';
import { CONTACTS } from '../data/mock.js';

const TOGGLES = [
  { key: 'allowMusic', label: 'Musik erlauben', hint: 'Ruhige Playlists während des Fokus' },
  { key: 'allowLookup', label: 'Nachschlagen erlauben', hint: 'Kurze Suchen, ohne die Session zu verlassen' },
  { key: 'filterNotifications', label: 'Benachrichtigungen filtern', hint: 'Nur Wichtiges kommt durch' },
];

export default function SettingsScreen({ settings, onChange, onBack }) {
  const setField = (key, value) => onChange({ ...settings, [key]: value });

  const toggleContact = (id) =>
    onChange({
      ...settings,
      whitelist: { ...settings.whitelist, [id]: !settings.whitelist[id] },
    });

  return (
    <div className="screen">
      <header className="screen__header">
        <button type="button" className="icon-btn" aria-label="Zurück" onClick={onBack}>
          ←
        </button>
        <h1 className="screen__title screen__title--center">Einstellungen</h1>
        <span className="icon-btn icon-btn--ghost" aria-hidden="true" />
      </header>

      <section className="card">
        <h2 className="card__title">Während der Session</h2>
        {TOGGLES.map((t) => (
          <div key={t.key} className="setting-row">
            <div>
              <p className="setting-row__label">{t.label}</p>
              <p className="setting-row__hint">{t.hint}</p>
            </div>
            <Toggle
              checked={settings[t.key]}
              onChange={(v) => setField(t.key, v)}
              label={t.label}
            />
          </div>
        ))}
      </section>

      <section className="card">
        <h2 className="card__title">Wichtige Anrufe zulassen</h2>
        <p className="card__subtitle">
          Diese Kontakte dürfen dich auch im Fokus erreichen.
        </p>
        <ul className="contact-list">
          {CONTACTS.map((c) => (
            <li key={c.id}>
              <label className="check-row">
                <input
                  type="checkbox"
                  checked={Boolean(settings.whitelist[c.id])}
                  onChange={() => toggleContact(c.id)}
                />
                <span className="check-row__box" aria-hidden="true" />
                <span className="check-row__label">{c.name}</span>
              </label>
            </li>
          ))}
        </ul>
      </section>

      <button type="button" className="btn btn--primary btn--big" onClick={onBack}>
        Fertig
      </button>
    </div>
  );
}
