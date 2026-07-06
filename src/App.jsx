import { useState } from 'react';
import { useLocalStorage } from './hooks/useLocalStorage.js';
import { dateKey, yesterdayKey } from './utils/time.js';
import HomeScreen from './screens/HomeScreen.jsx';
import SettingsScreen from './screens/SettingsScreen.jsx';
import SetupScreen from './screens/SetupScreen.jsx';
import FocusScreen from './screens/FocusScreen.jsx';
import BreakScreen from './screens/BreakScreen.jsx';
import SuccessScreen from './screens/SuccessScreen.jsx';

const SCREENS = {
  HOME: 'home',
  SETTINGS: 'settings',
  SETUP: 'setup',
  FOCUS: 'focus',
  BREAK: 'break',
  SUCCESS: 'success',
};

const DEFAULT_SETTINGS = {
  allowMusic: true,
  allowLookup: true,
  filterNotifications: true,
  whitelist: { mama: true, papa: false, partner: true, chef: false, arzt: true },
};

const DEFAULT_STATS = {
  streak: 0,
  lastCompletedDate: null,
  totalMinutes: 0,
  sessionsCompleted: 0,
  blocksToday: 0,
  blocksTodayDate: null,
};

export default function App() {
  const [screen, setScreen] = useState(SCREENS.HOME);
  const [settings, setSettings] = useLocalStorage('fokusapp.settings', DEFAULT_SETTINGS);
  const [stats, setStats] = useLocalStorage('fokusapp.stats', DEFAULT_STATS);
  const [session, setSession] = useState(null);
  const [currentBlock, setCurrentBlock] = useState(1);
  const [highlightLeaderboard, setHighlightLeaderboard] = useState(false);

  // Blöcke von gestern nicht als "heute" anzeigen.
  const today = dateKey();
  const normalizedStats = {
    ...stats,
    blocksToday: stats.blocksTodayDate === today ? stats.blocksToday : 0,
  };

  const goHome = (highlight = false) => {
    setHighlightLeaderboard(highlight);
    setScreen(SCREENS.HOME);
  };

  const startSession = (config) => {
    setSession(config);
    setCurrentBlock(1);
    setScreen(SCREENS.FOCUS);
  };

  /** Ein Fokusblock ist durch: Minuten & Tageszähler gutschreiben. */
  const recordBlock = () => {
    setStats((s) => ({
      ...s,
      totalMinutes: s.totalMinutes + session.focusMin,
      blocksToday: (s.blocksTodayDate === today ? s.blocksToday : 0) + 1,
      blocksTodayDate: today,
    }));
  };

  /**
   * Ganze Session geschafft: Streak-Logik.
   * Erster Abschluss an einem neuen Tag erhöht die Streak (bzw. startet
   * sie neu, wenn ein Tag ausgelassen wurde).
   */
  const completeSession = () => {
    setStats((s) => {
      let streak = s.streak;
      if (s.lastCompletedDate !== today) {
        streak = s.lastCompletedDate === yesterdayKey() ? s.streak + 1 : 1;
      }
      return {
        ...s,
        streak,
        lastCompletedDate: today,
        sessionsCompleted: s.sessionsCompleted + 1,
      };
    });
  };

  const handleFocusComplete = () => {
    recordBlock();
    if (currentBlock < session.totalBlocks) {
      setScreen(SCREENS.BREAK);
    } else {
      completeSession();
      setScreen(SCREENS.SUCCESS);
    }
  };

  const handleBreakContinue = () => {
    setCurrentBlock((b) => b + 1);
    setScreen(SCREENS.FOCUS);
  };

  const abortSession = () => {
    setSession(null);
    goHome();
  };

  return (
    <div className={`app-shell${screen === SCREENS.BREAK ? ' app-shell--break' : ''}`}>
      {screen === SCREENS.HOME && (
        <HomeScreen
          stats={normalizedStats}
          highlightLeaderboard={highlightLeaderboard}
          onNewSession={() => setScreen(SCREENS.SETUP)}
          onOpenSettings={() => setScreen(SCREENS.SETTINGS)}
        />
      )}
      {screen === SCREENS.SETTINGS && (
        <SettingsScreen settings={settings} onChange={setSettings} onBack={() => goHome()} />
      )}
      {screen === SCREENS.SETUP && (
        <SetupScreen onStart={startSession} onBack={() => goHome()} />
      )}
      {screen === SCREENS.FOCUS && session && (
        <FocusScreen
          key={currentBlock}
          session={session}
          currentBlock={currentBlock}
          settings={settings}
          streak={normalizedStats.streak}
          onComplete={handleFocusComplete}
          onQuit={abortSession}
        />
      )}
      {screen === SCREENS.BREAK && session && (
        <BreakScreen
          key={currentBlock}
          session={session}
          nextBlock={currentBlock + 1}
          onContinue={handleBreakContinue}
        />
      )}
      {screen === SCREENS.SUCCESS && session && (
        <SuccessScreen
          session={session}
          stats={normalizedStats}
          onDone={() => goHome()}
          onShowLeaderboard={() => goHome(true)}
        />
      )}
    </div>
  );
}
