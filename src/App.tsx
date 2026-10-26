import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  ActiveTarget,
  AppView,
  FloorLevel,
  GameMode,
  GameSpeed,
  LeaderboardEntry,
  TargetItemType,
} from './types/game';
import { HIDING_SPOTS, INITIAL_LEADERBOARD } from './data/gameData';
import { FloorBuildingStage } from './components/FloorBuildingStage';
import { GameHUD } from './components/GameHUD';
import { SpeedControls } from './components/SpeedControls';
import { SentenceFollowModal } from './components/SentenceFollowModal';
import { LeaderboardModal } from './components/LeaderboardModal';
import { FlashcardsView } from './components/FlashcardsView';
import { RoundSummaryModal } from './components/RoundSummaryModal';
import { TeacherGuideModal } from './components/TeacherGuideModal';
import { soundManager } from './utils/soundEffects';
import {
  GraduationCap,
  Sparkles,
  Trophy,
  BookOpen,
  HelpCircle,
  Play,
  RotateCcw,
} from 'lucide-react';

export default function App() {
  // App views
  const [appView, setAppView] = useState<AppView>('game');
  const [isLeaderboardOpen, setIsLeaderboardOpen] = useState(false);
  const [isTeacherGuideOpen, setIsTeacherGuideOpen] = useState(false);
  const [isRoundSummaryOpen, setIsRoundSummaryOpen] = useState(false);

  // Game States
  const [gameMode, setGameMode] = useState<GameMode>('timed_60');
  const [speedMode, setSpeedMode] = useState<GameSpeed>('normal');
  const [intervalMs, setIntervalMs] = useState(2400); // 2.4s normal
  const [itemFilter, setItemFilter] = useState<'all' | 'costume' | 'film'>('all');

  const [score, setScore] = useState(0);
  const [itemsFound, setItemsFound] = useState(0);
  const [streakCount, setStreakCount] = useState(0);
  const [starsEarnedTotal, setStarsEarnedTotal] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [isPaused, setIsPaused] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Statistics for round summary
  const [costumeCount, setCostumeCount] = useState(0);
  const [filmCount, setFilmCount] = useState(0);
  const [secondFloorCount, setSecondFloorCount] = useState(0);
  const [thirdFloorCount, setThirdFloorCount] = useState(0);

  // Active target & Discovery modal
  const [activeTarget, setActiveTarget] = useState<ActiveTarget | null>(null);
  const [discoveredTarget, setDiscoveredTarget] = useState<ActiveTarget | null>(null);

  // Leaderboard data with localStorage persistence
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>(() => {
    try {
      const saved = localStorage.getItem('floors_treasures_leaderboard');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return INITIAL_LEADERBOARD;
  });

  const saveLeaderboard = (updated: LeaderboardEntry[]) => {
    setLeaderboard(updated);
    try {
      localStorage.setItem('floors_treasures_leaderboard', JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  // Helper to spawn a new random target item at a random spot
  const spawnNewTarget = useCallback(() => {
    // Pick item based on filter
    let type: TargetItemType = 'costume';
    if (itemFilter === 'all') {
      type = Math.random() > 0.5 ? 'costume' : 'film';
    } else {
      type = itemFilter;
    }

    // Pick a random spot, preferring a different spot than current
    const availableSpots = HIDING_SPOTS.filter(
      (s) => !activeTarget || s.id !== activeTarget.spot.id
    );
    const chosenSpot =
      availableSpots[Math.floor(Math.random() * availableSpots.length)] || HIDING_SPOTS[0];

    soundManager.playPop();

    setActiveTarget({
      id: `target_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      type,
      spot: chosenSpot,
      spawnTime: Date.now(),
      duration: intervalMs,
      isFound: false,
    });
  }, [activeTarget, intervalMs, itemFilter]);

  // Spawn timer interval
  useEffect(() => {
    if (appView !== 'game' || isPaused || discoveredTarget || isRoundSummaryOpen) {
      return;
    }

    // Initial spawn if null
    if (!activeTarget) {
      spawnNewTarget();
    }

    const timer = setInterval(() => {
      spawnNewTarget();
    }, intervalMs);

    return () => clearInterval(timer);
  }, [appView, isPaused, discoveredTarget, isRoundSummaryOpen, activeTarget, intervalMs, spawnNewTarget]);

  // Round countdown timer
  useEffect(() => {
    if (
      appView !== 'game' ||
      isPaused ||
      discoveredTarget ||
      isRoundSummaryOpen ||
      gameMode === 'free_play'
    ) {
      return;
    }

    if (timeLeft <= 0) {
      setIsRoundSummaryOpen(true);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setIsRoundSummaryOpen(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [appView, isPaused, discoveredTarget, isRoundSummaryOpen, gameMode, timeLeft]);

  // Handle clicking on target item
  const handleTargetClicked = (target: ActiveTarget) => {
    setDiscoveredTarget(target);
    setActiveTarget(null); // Pause target while sentence modal is active
  };

  // Continue after sentence read aloud modal
  const handleContinueFromModal = (bonusPoints: number, stars: number) => {
    if (!discoveredTarget) return;

    const isCostume = discoveredTarget.type === 'costume';
    const isSecondFloor = discoveredTarget.spot.floor === 'second_floor';

    // Update counts
    if (isCostume) setCostumeCount((c) => c + 1);
    else setFilmCount((c) => c + 1);

    if (isSecondFloor) setSecondFloorCount((c) => c + 1);
    else setThirdFloorCount((c) => c + 1);

    setScore((s) => s + 100 + bonusPoints);
    setItemsFound((f) => f + 1);
    setStreakCount((st) => st + 1);
    setStarsEarnedTotal((star) => star + stars);

    setDiscoveredTarget(null);
    // Trigger next item immediately
    setTimeout(() => {
      spawnNewTarget();
    }, 200);
  };

  // Speed Mode Change
  const handleSpeedChange = (mode: GameSpeed, customMs?: number) => {
    setSpeedMode(mode);
    if (mode === 'slow') setIntervalMs(3800);
    else if (mode === 'normal') setIntervalMs(2400);
    else if (mode === 'fast') setIntervalMs(1400);
    else if (mode === 'custom' && customMs) setIntervalMs(customMs);
  };

  // Game Mode Change (60s, 90s, Free)
  const handleModeChange = (mode: GameMode) => {
    setGameMode(mode);
    if (mode === 'timed_60') setTimeLeft(60);
    else if (mode === 'timed_90') setTimeLeft(90);
    else setTimeLeft(999);
  };

  // Restart game session
  const handleRestart = () => {
    setScore(0);
    setItemsFound(0);
    setStreakCount(0);
    setStarsEarnedTotal(0);
    setCostumeCount(0);
    setFilmCount(0);
    setSecondFloorCount(0);
    setThirdFloorCount(0);
    setTimeLeft(gameMode === 'timed_60' ? 60 : gameMode === 'timed_90' ? 90 : 999);
    setIsRoundSummaryOpen(false);
    setDiscoveredTarget(null);
    setActiveTarget(null);
    setTimeout(() => spawnNewTarget(), 100);
  };

  // Add score to leaderboard
  const handleAddLeaderboardEntry = (name: string, group: string) => {
    const newEntry: LeaderboardEntry = {
      id: `entry_${Date.now()}`,
      studentName: name,
      groupName: group,
      score: score,
      itemsFound: itemsFound,
      starsEarned: starsEarnedTotal,
      accuracy: Math.min(100, 85 + streakCount * 2),
      date: 'Today',
    };
    saveLeaderboard([newEntry, ...leaderboard]);
  };

  const handleResetLeaderboard = () => {
    saveLeaderboard(INITIAL_LEADERBOARD);
  };

  // Fullscreen toggle for classroom whiteboard
  const handleToggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-amber-50 via-orange-50/30 to-amber-100/40 text-slate-800 flex flex-col font-['Outfit','Quicksand',sans-serif]">
      {/* Top Bar Contract: 3 zones separated by gap-8: [Brand wordmark] - [4 Nav links] - [Primary action] */}
      <header className="flex items-center justify-between gap-8 px-4 sm:px-8 py-3.5 bg-white/90 backdrop-blur-md border-b border-amber-200 shadow-xs sticky top-0 z-40">
        {/* Zone 1: Single text element wordmark */}
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-xl sm:text-2xl">🎭</span>
          <span className="text-base sm:text-lg font-black tracking-tight text-amber-950 whitespace-nowrap">
            Floors & Treasures
          </span>
        </div>

        {/* Zone 2: 4 single-line text navigation links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-bold text-slate-600">
          <button
            type="button"
            onClick={() => {
              setAppView('game');
              soundManager.startBGM();
            }}
            className={`hover:text-amber-600 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              appView === 'game' ? 'text-amber-600 font-black' : ''
            }`}
          >
            寻宝游戏课堂
          </button>
          <button
            type="button"
            onClick={() => setAppView('flashcards')}
            className={`hover:text-amber-600 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              appView === 'flashcards' ? 'text-amber-600 font-black' : ''
            }`}
          >
            词汇卡与句型
          </button>
          <button
            type="button"
            onClick={() => setIsLeaderboardOpen(true)}
            className="hover:text-amber-600 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            荣誉排行榜
          </button>
          <button
            type="button"
            onClick={() => setIsTeacherGuideOpen(true)}
            className="hover:text-amber-600 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            备课指南
          </button>
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={() => setIsTeacherGuideOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-amber-500 hover:bg-amber-600 rounded-xl shadow-sm transition-all whitespace-nowrap shrink-0 active:scale-95 cursor-pointer"
          >
            <GraduationCap className="w-3.5 h-3.5" />
            <span>教师教学备课</span>
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-3 sm:px-6 py-4 sm:py-6 flex flex-col gap-4">
        {/* Conditional View: Flashcards vs Main Game */}
        {appView === 'flashcards' ? (
          <FlashcardsView onBackToGame={() => setAppView('game')} />
        ) : (
          <>
            {/* Top Game HUD */}
            <GameHUD
              score={score}
              itemsFound={itemsFound}
              streakCount={streakCount}
              timeLeft={timeLeft}
              gameMode={gameMode}
              isPaused={isPaused}
              isFullscreen={isFullscreen}
              onTogglePause={() => setIsPaused((p) => !p)}
              onRestart={handleRestart}
              onOpenLeaderboard={() => setIsLeaderboardOpen(true)}
              onOpenFlashcards={() => setAppView('flashcards')}
              onToggleFullscreen={handleToggleFullscreen}
              onModeChange={handleModeChange}
            />

            {/* Speed & Vocabulary Filter Controls */}
            <SpeedControls
              speedMode={speedMode}
              intervalMs={intervalMs}
              onSpeedChange={handleSpeedChange}
              itemSpawnFilter={itemFilter}
              onFilterChange={(f) => {
                setItemFilter(f);
                spawnNewTarget();
              }}
            />

            {/* Floor Building Visual Playfield */}
            <FloorBuildingStage
              activeTarget={activeTarget}
              allSpots={HIDING_SPOTS}
              onTargetClicked={handleTargetClicked}
              isPaused={isPaused}
              streakCount={streakCount}
            />

            {/* Quick Word & Floor Classroom Helper Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 bg-white rounded-xl border border-amber-200/80 shadow-xs flex items-center gap-3">
                <span className="text-2xl">🎭</span>
                <div>
                  <div className="text-xs font-black text-slate-900">costume [ˈkɒstjuːm]</div>
                  <div className="text-[11px] text-slate-500">戏服 / 演出服装</div>
                </div>
              </div>

              <div className="p-3 bg-white rounded-xl border border-amber-200/80 shadow-xs flex items-center gap-3">
                <span className="text-2xl">🎞️</span>
                <div>
                  <div className="text-xs font-black text-slate-900">film [fɪlm]</div>
                  <div className="text-[11px] text-slate-500">胶卷 / 电影</div>
                </div>
              </div>

              <div className="p-3 bg-white rounded-xl border border-rose-200/80 shadow-xs flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-rose-500 text-white font-black flex items-center justify-center text-xs">
                  2F
                </span>
                <div>
                  <div className="text-xs font-black text-slate-900">second floor</div>
                  <div className="text-[11px] text-slate-500">二楼 (剧场与更衣室)</div>
                </div>
              </div>

              <div className="p-3 bg-white rounded-xl border border-indigo-200/80 shadow-xs flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-indigo-600 text-white font-black flex items-center justify-center text-xs">
                  3F
                </span>
                <div>
                  <div className="text-xs font-black text-slate-900">third floor</div>
                  <div className="text-[11px] text-slate-500">三楼 (迷你电影院)</div>
                </div>
              </div>
            </div>
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-amber-200/80 bg-white/70 py-4 px-6 text-center text-xs text-slate-500">
        <p>
          小学英语趣味教学备课助手 · 互动寻宝游戏 · 强化 costume, film, second/third floor 词汇与句型记忆
        </p>
      </footer>

      {/* Discovery & Sentence Read-Aloud Modal */}
      {discoveredTarget && (
        <SentenceFollowModal
          target={discoveredTarget}
          onContinue={handleContinueFromModal}
        />
      )}

      {/* Leaderboard Modal */}
      {isLeaderboardOpen && (
        <LeaderboardModal
          entries={leaderboard}
          currentScore={score}
          currentFoundCount={itemsFound}
          currentStars={starsEarnedTotal}
          onClose={() => setIsLeaderboardOpen(false)}
          onAddEntry={handleAddLeaderboardEntry}
          onResetLeaderboard={handleResetLeaderboard}
        />
      )}

      {/* Teacher Guide Modal */}
      {isTeacherGuideOpen && (
        <TeacherGuideModal onClose={() => setIsTeacherGuideOpen(false)} />
      )}

      {/* Round Summary Modal */}
      {isRoundSummaryOpen && (
        <RoundSummaryModal
          score={score}
          itemsFound={itemsFound}
          costumeCount={costumeCount}
          filmCount={filmCount}
          secondFloorCount={secondFloorCount}
          thirdFloorCount={thirdFloorCount}
          starsEarned={starsEarnedTotal}
          onPlayAgain={handleRestart}
          onSaveToLeaderboard={(name, group) => {
            handleAddLeaderboardEntry(name, group);
          }}
        />
      )}
    </div>
  );
}
