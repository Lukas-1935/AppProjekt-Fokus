import Toggle from '../components/Toggle.jsx';
import { CONTACTS } from '../data/mock.js';

const TOGGLES = [
  { key: 'allowMusic', label: 'Musik erlauben', hint: 'Ruhiger Fokus-Klang, direkt in der App' },
  { key: 'allowLookup', label: 'Nachschlagen erlauben', hint: 'Wikipedia-Suche, ohne die Session zu verlassen' },
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
      <header className="nav-bar">
        <span className="nav-bar__side" />
        <h1 className="nav-bar__title">Einstellungen</h1>
        <button type="button" className="nav-bar__action" onClick={onBack}>
          Fertig
        </button>
      </header>

      <p className="section-header">Während der Session</p>
      <section className="card card--list">
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

      <p className="section-header">Wichtige Anrufe zulassen</p>
      <section className="card card--list">
        <ul className="contact-list">
          {CONTACTS.map((c) => (
            <li key={c.id}>
              <label className="check-row">
                <input
                  type="checkbox"
                  checked={Boolean(settings.whitelist[c.id])}
                  onChange={() => toggleContact(c.id)}
                />
                <span className="check-row__label">{c.name}</span>
                <span className="check-row__box" aria-hidden="true" />
              </label>
            </li>
          ))}
        </ul>
      </section>
      <p className="section-footer">
        Diese Kontakte dürfen dich auch im Fokus erreichen.
      </p>
    </div>
  );
}
