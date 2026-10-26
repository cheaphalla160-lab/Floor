import React from 'react';
import {
  Trophy,
  BookOpen,
  RotateCcw,
  Pause,
  Play,
  Maximize2,
  Minimize2,
  Clock,
  Sparkles,
  Flame,
} from 'lucide-react';
import { AudioControls } from './AudioControls';
import { GameMode } from '../types/game';

interface GameHUDProps {
  score: number;
  itemsFound: number;
  streakCount: number;
  timeLeft: number;
  gameMode: GameMode;
  isPaused: boolean;
  isFullscreen: boolean;
  onTogglePause: () => void;
  onRestart: () => void;
  onOpenLeaderboard: () => void;
  onOpenFlashcards: () => void;
  onToggleFullscreen: () => void;
  onModeChange: (mode: GameMode) => void;
}

export const GameHUD: React.FC<GameHUDProps> = ({
  score,
  itemsFound,
  streakCount,
  timeLeft,
  gameMode,
  isPaused,
  isFullscreen,
  onTogglePause,
  onRestart,
  onOpenLeaderboard,
  onOpenFlashcards,
  onToggleFullscreen,
  onModeChange,
}) => {
  return (
    <div className="w-full bg-white/95 backdrop-blur-md rounded-2xl border-2 border-amber-300 p-3 sm:p-4 shadow-md flex flex-col gap-3">
      {/* Top Row: Title, Target Words, Audio Controls, Tools */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-amber-100">
        {/* Brand & Word Pill-free tags */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center font-black text-xl shadow-sm shrink-0">
            🎬
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                寻宝大侦探: Costume & Film Quest
              </h1>
            </div>
            <div className="flex items-center gap-2 text-xs text-amber-900/80 font-bold">
              <span>costume</span>
              <span aria-hidden="true">·</span>
              <span>film</span>
              <span aria-hidden="true">·</span>
              <span>second floor</span>
              <span aria-hidden="true">·</span>
              <span>third floor</span>
            </div>
          </div>
        </div>

        {/* Center / Right Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Audio Synthesizer Controls */}
          <AudioControls />

          {/* Flashcards View Button */}
          <button
            type="button"
            onClick={onOpenFlashcards}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 transition-all cursor-pointer"
            title="查看核心单词与重点句型讲解"
          >
            <BookOpen className="w-3.5 h-3.5 text-amber-600" />
            <span className="whitespace-nowrap">词汇预习卡</span>
          </button>

          {/* Leaderboard Button */}
          <button
            type="button"
            onClick={onOpenLeaderboard}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-yellow-50 hover:bg-yellow-100 text-amber-900 border border-yellow-300 transition-all cursor-pointer shadow-xs"
            title="查看班级排行榜与小组PK榜"
          >
            <Trophy className="w-3.5 h-3.5 text-amber-600" />
            <span className="whitespace-nowrap">排行榜</span>
          </button>

          {/* Classroom Fullscreen Button */}
          <button
            type="button"
            onClick={onToggleFullscreen}
            className="p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 transition-all cursor-pointer"
            title={isFullscreen ? '退出全屏' : '投影全屏模式 (适合电子白板)'}
            aria-label="全屏切换"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Bottom Row: Scoreboard, Timer, Mode Selector, Pause/Restart */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
        {/* Score & Stats Meter */}
        <div className="flex flex-wrap items-center gap-4">
          {/* Score Box */}
          <div className="flex items-baseline gap-1.5 bg-amber-50/80 px-3.5 py-1.5 rounded-xl border border-amber-200">
            <span className="text-xs font-bold text-amber-900">得分:</span>
            <span className="font-mono text-xl sm:text-2xl font-black text-amber-600 tabular-nums">
              {score}
            </span>
          </div>

          {/* Found Count */}
          <div className="flex items-center gap-1.5 text-xs text-slate-600">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>已找到:</span>
            <span className="font-mono text-base font-bold text-slate-800 tabular-nums">
              {itemsFound}
            </span>
            <span>个</span>
          </div>

          {/* Streak Flame */}
          {streakCount > 1 && (
            <div className="flex items-center gap-1 text-xs font-bold text-orange-600 bg-orange-50 px-2.5 py-1 rounded-lg border border-orange-200">
              <Flame className="w-3.5 h-3.5 fill-orange-500 text-orange-500" />
              <span>{streakCount} 连中</span>
            </div>
          )}

          {/* Timer Display */}
          <div className="flex items-center gap-1.5 text-xs text-slate-700 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
            <Clock className="w-3.5 h-3.5 text-sky-600" />
            <span>
              {gameMode === 'free_play' ? (
                <span className="font-bold text-emerald-700">自由探索模式 (无时限)</span>
              ) : (
                <>
                  <span>倒计时:</span>{' '}
                  <span
                    className={`font-mono text-base font-black tabular-nums ${
                      timeLeft <= 10 ? 'text-rose-600 animate-pulse' : 'text-slate-800'
                    }`}
                  >
                    {timeLeft}s
                  </span>
                </>
              )}
            </span>
          </div>
        </div>

        {/* Game Mode Selector & Action Buttons */}
        <div className="flex items-center gap-2">
          {/* Duration Mode Selector */}
          <div className="hidden sm:flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs">
            <button
              type="button"
              onClick={() => onModeChange('timed_60')}
              className={`px-2.5 py-1 rounded-lg font-semibold transition-all ${
                gameMode === 'timed_60'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              60秒挑战
            </button>
            <button
              type="button"
              onClick={() => onModeChange('timed_90')}
              className={`px-2.5 py-1 rounded-lg font-semibold transition-all ${
                gameMode === 'timed_90'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              90秒竞技
            </button>
            <button
              type="button"
              onClick={() => onModeChange('free_play')}
              className={`px-2.5 py-1 rounded-lg font-semibold transition-all ${
                gameMode === 'free_play'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              自由精讲
            </button>
          </div>

          {/* Pause / Resume */}
          <button
            type="button"
            onClick={onTogglePause}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
              isPaused
                ? 'bg-emerald-500 text-white border-emerald-600 shadow-sm'
                : 'bg-white text-slate-700 hover:bg-slate-50 border-slate-200'
            }`}
          >
            {isPaused ? (
              <>
                <Play className="w-3.5 h-3.5" />
                <span>继续</span>
              </>
            ) : (
              <>
                <Pause className="w-3.5 h-3.5" />
                <span>暂停</span>
              </>
            )}
          </button>

          {/* Restart */}
          <button
            type="button"
            onClick={onRestart}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold bg-white text-slate-700 hover:bg-slate-50 border border-slate-200 transition-all cursor-pointer"
            title="重置当前游戏分数并重新开始"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
            <span>重新开始</span>
          </button>
        </div>
      </div>
    </div>
  );
};
