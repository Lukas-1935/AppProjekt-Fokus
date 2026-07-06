# FokusApp 🔥

Eine mobile-first Web-App, die dir hilft, Fokus-Sessions durchzuhalten – mit
Streaks, Freundes-Rangliste und einer bewussten Abbruchhürde.

## Starten

```bash
npm install
npm run dev
```

Dann die angezeigte URL öffnen (standardmäßig http://localhost:5173).
Die App ist auf ~400 px Breite ausgelegt – am besten im mobilen
Viewport des Browsers ansehen (oder einfach das gerahmte "iPhone" auf dem Desktop nutzen).

## Features

- **Startbildschirm**: eigene Streak, Freundes-Rangliste (Mock-Daten) mit
  Motivationshinweis, Einstieg in neue Sessions
- **Einstellungen**: Musik / Nachschlagen / Benachrichtigungsfilter als Toggles,
  Mock-Whitelist für wichtige Anrufe
- **Session einrichten**: Ziel, Zeitblöcke (25/5, 50/10 oder eigene Zeiten),
  1–3 Blöcke pro Session
- **Laufende Session**: echter Kreis-Countdown, Blockanzeige mit Punkten,
  Musik-/Such-Buttons (nur aktiv, wenn erlaubt), Pause-Button
- **Abbruchhürde**: Stopp nur per 3-Sekunden-Halten (mit Progress-Ring),
  danach Pflicht-Begründung (min. 5 Zeichen) + 3s-Cooldown auf
  „Trotzdem beenden" – und eine kleine Belohnung fürs Weitermachen
- **Pause**: grüner Ruhemodus mit abhakbarer Erholungs-Checkliste
- **Erfolg**: Konfetti, Statistiken (Minuten, Streak, Blöcke heute),
  Meilensteine mit Fortschrittsbalken

## Demo-Tipp

Doppelklick auf den Kreis-Timer überspringt den laufenden Block bzw. die
Pause (versteckter Skip für Präsentationen).

## Persistenz

Streak, Statistiken und Einstellungen liegen im `localStorage`
(`fokusapp.stats`, `fokusapp.settings`). Die Streak steigt, wenn an einem
neuen Tag das Tagesziel (eine komplette Session) abgeschlossen wird; ein
ausgelassener Tag setzt sie zurück.

## Stack

React 18 + Vite, reines CSS (keine UI-Bibliothek), keine weiteren Laufzeit-Dependencies.
