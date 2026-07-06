---
name: verify
description: Build, run and drive the FokusApp end-to-end to verify changes at the UI surface.
---

# FokusApp verifizieren

## Build & Start

```bash
npm install
npm run build
npm run preview -- --port 4173 --strictPort   # im Hintergrund laufen lassen
```

## Fahren (Playwright, Viewport 400×850)

Chromium liegt vorinstalliert unter `/opt/pw-browsers/chromium` — mit
`chromium.launch({ executablePath: '/opt/pw-browsers/chromium' })` starten,
niemals `playwright install` ausführen.

Flows, die den Kern abdecken:

1. **Home** → `.card--streak__number`, 5 `.board__row`, `.board__hint`
2. **Setup**: `#goal` leer ⇒ „Fokus starten" disabled; Eigen-Zeit `0` ⇒ disabled
3. **Fokus**: `.circle-timer__time` tickt; Doppelklick auf `.circle-timer`
   = versteckter Skip (Demo-Feature)
4. **Abbruchhürde**: `.btn--stop` per `mouse.down()` + 3,3 s + `mouse.up()`
   halten (kürzeres Halten darf KEINEN Dialog öffnen); im Dialog:
   `.link--danger` erst nach Cooldown UND ≥5 Zeichen in `.dialog__textarea`
   aktiv; Timer muss währenddessen pausieren
4b. **Pause-Sheet**: „Pause" öffnet `#pause-reason`-Sheet („Pause starten"
   erst ab 5 Zeichen; „Weiter fokussieren" schließt + Timer läuft weiter).
   Bestätigen wertet den Block mit den echten Minuten
   (`Math.round(elapsed/60)` – bei sofortiger Pause 0!) und führt in die
   Pause; auf dem LETZTEN Block direkt zum Erfolg (Button heißt dann
   „Session abschließen"). Exakte Minuten-Assertions daher mit Toleranz.
4c. **Musik/Suche**: Musik-Klick zeigt Panel „Fokus-Klang läuft" + `.volume`-
   Slider (Web Audio, kein Netz nötig). Suche fragt die Wikipedia-API ab —
   in der Sandbox blockt der Proxy `de.wikipedia.org` (403), es MUSS die
   Meldung „Keine Verbindung …" erscheinen; `.search-hit`-Treffer sind nur
   mit echtem Netz testbar.
5. **Pause**: Shell-Hintergrund wird grünlich (`rgb(230,236,218)`),
   Checkliste abhakbar (Achtung: 0,15 s Farbtransition vor Screenshot abwarten)
6. **Erfolg**: Stats `[Minuten, Streak, Blöcke heute]` prüfen; vor Screenshot
   ~1 s warten (0,3 s Einblend-Animation, Konfetti braucht Anlauf)
7. **Persistenz**: `localStorage`-Keys `fokusapp.stats` / `fokusapp.settings`;
   Reload ⇒ Streak bleibt

Streak seeden (für Dialog-Text „5-Tage-Streak" & Meilenstein-Karte):

```js
localStorage.setItem('fokusapp.stats', JSON.stringify({
  streak: 5, lastCompletedDate: '<gestern als YYYY-MM-DD, lokal>',
  totalMinutes: 250, sessionsCompleted: 5, blocksToday: 0, blocksTodayDate: null,
}));
```

## Dark Mode

Die App folgt `prefers-color-scheme`. Beide Modi prüfen:
`browser.newPage({ colorScheme: 'dark' })` bzw. `'light'`.

## Gotchas

- Screenshots direkt nach Screen-Wechsel wirken blass/halbtransparent —
  das ist die `screen-in`-Animation, kein Bug. Kurz warten.
- Timer sind zeitstempelbasiert; `page.waitForTimeout(1600)` reicht, um
  einen Tick zu sehen.
