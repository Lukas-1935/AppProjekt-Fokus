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
  echter **Fokus-Klang** (Web Audio, offline, mit Lautstärkeregler) und
  echte **Wikipedia-Schnellsuche** in der App (beides nur aktiv, wenn in
  den Einstellungen erlaubt)
- **Frühe Pause**: Der Pause-Button fragt einen Grund ab (min. 5 Zeichen) –
  z. B. wenn die Aufgabe schon vor Ablauf des Timers erledigt war. Der
  laufende Block wird mit den tatsächlich fokussierten Minuten gewertet;
  danach geht es in die Pause bzw. nach dem letzten Block direkt zum Erfolg
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

## Design

Gestaltet nach den [Apple Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines):
System-Schrift (SF Pro auf Apple-Geräten, Inter als Fallback), iOS-Typo-Skala,
gruppierte Inset-Listen mit Hairline-Trennern, Segmented Control, Sheet mit
Grabber für die Abbruchhürde, 44pt-Touch-Ziele, heller **und** dunkler Modus
(folgt der Systemeinstellung) sowie respektierte Reduzierte-Bewegung-Einstellung.

## Stack

React 18 + Vite, reines CSS (keine UI-Bibliothek), keine weiteren Laufzeit-Dependencies.
