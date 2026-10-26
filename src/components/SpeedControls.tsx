import React from 'react';
import { Gauge, SlidersHorizontal, Sparkles } from 'lucide-react';
import { GameSpeed } from '../types/game';

interface SpeedControlsProps {
  speedMode: GameSpeed;
  intervalMs: number;
  onSpeedChange: (mode: GameSpeed, customMs?: number) => void;
  itemSpawnFilter: 'all' | 'costume' | 'film';
  onFilterChange: (filter: 'all' | 'costume' | 'film') => void;
}

export const SpeedControls: React.FC<SpeedControlsProps> = ({
  speedMode,
  intervalMs,
  onSpeedChange,
  itemSpawnFilter,
  onFilterChange,
}) => {
  return (
    <div className="flex flex-wrap items-center gap-3 p-2.5 bg-white/90 backdrop-blur-sm rounded-xl border border-amber-200/80 shadow-sm text-xs">
      {/* Speed Buttons */}
      <div className="flex items-center gap-1.5">
        <span className="flex items-center gap-1 font-bold text-amber-900 shrink-0">
          <Gauge className="w-3.5 h-3.5 text-amber-600" />
          <span>换位速度:</span>
        </span>

        <div className="flex items-center gap-1 bg-amber-50 p-1 rounded-lg border border-amber-200">
          <button
            type="button"
            onClick={() => onSpeedChange('slow', 3800)}
            className={`px-2.5 py-1 rounded font-semibold transition-all whitespace-nowrap ${
              speedMode === 'slow'
                ? 'bg-amber-500 text-white shadow-xs'
                : 'text-amber-900 hover:bg-amber-100'
            }`}
            title="3.8秒/换位 - 适合低年级或初学"
          >
            🐢 慢速 (3.8s)
          </button>
          <button
            type="button"
            onClick={() => onSpeedChange('normal', 2400)}
            className={`px-2.5 py-1 rounded font-semibold transition-all whitespace-nowrap ${
              speedMode === 'normal'
                ? 'bg-amber-500 text-white shadow-xs'
                : 'text-amber-900 hover:bg-amber-100'
            }`}
            title="2.4秒/换位 - 标准教学节奏"
          >
            🏃 标准 (2.4s)
          </button>
          <button
            type="button"
            onClick={() => onSpeedChange('fast', 1400)}
            className={`px-2.5 py-1 rounded font-semibold transition-all whitespace-nowrap ${
              speedMode === 'fast'
                ? 'bg-amber-500 text-white shadow-xs'
                : 'text-amber-900 hover:bg-amber-100'
            }`}
            title="1.4秒/换位 - 刺激挑战与反应训练"
          >
            🚀 快速 (1.4s)
          </button>
        </div>
      </div>

      {/* Manual Fine-tuning Slider */}
      <div className="hidden lg:flex items-center gap-2 pl-2 border-l border-amber-200">
        <SlidersHorizontal className="w-3.5 h-3.5 text-amber-700" />
        <span className="text-slate-600">微调:</span>
        <input
          type="range"
          min="1000"
          max="5000"
          step="200"
          value={intervalMs}
          onChange={(e) => onSpeedChange('custom', Number(e.target.value))}
          className="w-20 accent-amber-500 cursor-pointer"
        />
        <span className="font-mono text-amber-800 font-bold tabular-nums w-10">
          {(intervalMs / 1000).toFixed(1)}s
        </span>
      </div>

      {/* Vocabulary Item Focus Filter */}
      <div className="flex items-center gap-1.5 pl-2 border-l border-amber-200">
        <span className="flex items-center gap-1 font-bold text-slate-700 shrink-0">
          <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
          <span>目标单词:</span>
        </span>
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
          <button
            type="button"
            onClick={() => onFilterChange('all')}
            className={`px-2 py-0.5 rounded font-medium transition-all ${
              itemSpawnFilter === 'all'
                ? 'bg-white text-slate-900 shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            全部随机
          </button>
          <button
            type="button"
            onClick={() => onFilterChange('costume')}
            className={`px-2 py-0.5 rounded font-medium transition-all ${
              itemSpawnFilter === 'costume'
                ? 'bg-white text-indigo-700 shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            仅 costume (戏服)
          </button>
          <button
            type="button"
            onClick={() => onFilterChange('film')}
            className={`px-2 py-0.5 rounded font-medium transition-all ${
              itemSpawnFilter === 'film'
                ? 'bg-white text-amber-700 shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            仅 film (胶卷)
          </button>
        </div>
      </div>
    </div>
  );
};
