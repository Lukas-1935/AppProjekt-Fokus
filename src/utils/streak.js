import { FRIENDS, MILESTONES } from '../data/mock.js';

/**
 * Rangliste: Mock-Freunde + eigene Streak, absteigend sortiert.
 * Bei Gleichstand steht der Freund vor mir – das motiviert zum Überholen.
 */
export function buildLeaderboard(myStreak) {
  const entries = [
    ...FRIENDS.map((f) => ({ ...f, me: false })),
    { id: 'me', name: 'Du', streak: myStreak, me: true, color: '#2D2D2D' },
  ];
  return entries.sort((a, b) => b.streak - a.streak || (a.me ? 1 : -1));
}

/** Motivationshinweis zur Rangliste ("Dir fehlen noch X Fokustage bis Platz Y"). */
export function leaderboardHint(myStreak) {
  const board = buildLeaderboard(myStreak);
  const myIndex = board.findIndex((e) => e.me);
  if (myIndex === 0) {
    return 'Du führst die Rangliste an – verteidige deinen Platz! 🏆';
  }
  const above = board[myIndex - 1];
  const missing = above.streak - myStreak + 1;
  return `Dir ${missing === 1 ? 'fehlt' : 'fehlen'} noch ${missing} Fokustag${
    missing === 1 ? '' : 'e'
  } bis Platz ${myIndex}.`;
}

/** Höchster erreichter und nächster Meilenstein inkl. Fortschritt (0–1). */
export function milestoneProgress(streak) {
  const reached = [...MILESTONES].reverse().find((m) => streak >= m) ?? null;
  const next = MILESTONES.find((m) => m > streak) ?? null;
  const base = reached ?? 0;
  const progress = next ? Math.min(1, (streak - base) / (next - base)) : 1;
  return { reached, next, progress };
}
