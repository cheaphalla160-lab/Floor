import React, { useState } from 'react';
import { ActiveTarget, HidingSpot, TargetItemType } from '../types/game';
import { Sparkles, MapPin, Film, Shirt } from 'lucide-react';
import { soundManager } from '../utils/soundEffects';

interface FloorBuildingStageProps {
  activeTarget: ActiveTarget | null;
  allSpots: HidingSpot[];
  onTargetClicked: (target: ActiveTarget) => void;
  isPaused: boolean;
  streakCount: number;
}

export const FloorBuildingStage: React.FC<FloorBuildingStageProps> = ({
  activeTarget,
  allSpots,
  onTargetClicked,
  isPaused,
  streakCount,
}) => {
  const [clickEffectPos, setClickEffectPos] = useState<{ x: number; y: number } | null>(null);

  const handleSpotClick = (target: ActiveTarget, e: React.MouseEvent) => {
    e.stopPropagation();
    if (isPaused) return;

    soundManager.playSuccessClick();

    // Trigger visual burst
    const rect = e.currentTarget.getBoundingClientRect();
    setClickEffectPos({
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
    });
    setTimeout(() => setClickEffectPos(null), 800);

    onTargetClicked(target);
  };

  return (
    <div className="relative w-full rounded-2xl overflow-hidden border-4 border-amber-300 shadow-xl bg-amber-900/10 select-none">
      {/* Background Theatre Image */}
      <div className="relative aspect-16/9 w-full max-h-[640px] overflow-hidden bg-slate-900">
        <img
          src="/src/assets/images/theatre_floors_building_1793024735865.jpg"
          alt="School Theatre Building Second and Third Floor"
          className="w-full h-full object-cover pointer-events-none transition-transform duration-700"
          referrerPolicy="no-referrer"
        />

        {/* Floor Level Badges / Banners on the Left Edge */}
        <div className="absolute top-[18%] left-3 sm:left-6 z-20 pointer-events-none">
          <div className="flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 bg-indigo-900/90 text-white rounded-xl shadow-lg border-2 border-indigo-300/60 backdrop-blur-md">
            <span className="w-6 h-6 sm:w-8 sm:h-8 rounded-lg bg-indigo-600 flex items-center justify-center font-black text-sm sm:text-base shadow-inner">
              3F
            </span>
            <div>
              <div className="text-xs sm:text-sm font-black tracking-wide text-amber-300">
                Third Floor
              </div>
              <div className="text-[10px] sm:text-xs text-indigo-200">三楼 · 影院与放映室</div>
            </div>
          </div>
        </div>

        <div className="absolute top-[58%] left-3 sm:left-6 z-20 pointer-events-none">
          <div className="flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 bg-rose-900/90 text-white rounded-xl shadow-lg border-2 border-rose-300/60 backdrop-blur-md">
            <span className="w-6 h-6 sm:w-8 sm:h-8 rounded-lg bg-rose-600 flex items-center justify-center font-black text-sm sm:text-base shadow-inner">
              2F
            </span>
            <div>
              <div className="text-xs sm:text-sm font-black tracking-wide text-amber-300">
                Second Floor
              </div>
              <div className="text-[10px] sm:text-xs text-rose-200">二楼 · 剧场与化妆间</div>
            </div>
          </div>
        </div>

        {/* Floor Divider Guides for Visual Clarity */}
        <div className="absolute top-[49%] left-0 right-0 h-1 bg-gradient-to-r from-amber-400/80 via-white/80 to-amber-400/80 shadow-md pointer-events-none z-10 flex items-center justify-center">
          <span className="bg-amber-500 text-white text-[10px] sm:text-xs font-bold px-3 py-0.5 rounded-full shadow border border-amber-300">
            楼层分界线 (Floor Division)
          </span>
        </div>

        {/* Background Hiding Spot subtle markers */}
        {allSpots.map((spot) => (
          <div
            key={spot.id}
            style={{ left: `${spot.x}%`, top: `${spot.y}%` }}
            className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-none z-10 opacity-30 hover:opacity-60 transition-opacity"
          >
            <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-full border border-dashed border-white/60 flex items-center justify-center text-white text-[10px]">
              <MapPin className="w-3.5 h-3.5" />
            </div>
          </div>
        ))}

        {/* The Active Moving Target! (Costume or Film) */}
        {activeTarget && !isPaused && (
          <div
            style={{
              left: `${activeTarget.spot.x}%`,
              top: `${activeTarget.spot.y}%`,
            }}
            className="absolute -translate-x-1/2 -translate-y-1/2 z-30 transition-all duration-300 animate-in fade-in zoom-in"
          >
            {/* Clickable Card Container with Pulsing Halo */}
            <button
              type="button"
              onClick={(e) => handleSpotClick(activeTarget, e)}
              className="group relative flex flex-col items-center justify-center cursor-pointer transform hover:scale-115 active:scale-95 transition-all duration-200 focus:outline-none"
              title={`点击找到 ${activeTarget.type === 'costume' ? 'Costume (戏服)' : 'Film (胶卷)'}!`}
            >
              {/* Pulsing Target Ring */}
              <div className="absolute -inset-2 sm:-inset-3 bg-amber-400/50 rounded-full animate-ping pointer-events-none" />
              <div className="absolute -inset-1 sm:-inset-1.5 bg-yellow-300/60 rounded-full animate-pulse pointer-events-none" />

              {/* Target Item Image Sprite */}
              <div className="relative w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-2xl bg-white p-1.5 shadow-2xl border-3 border-amber-400 overflow-hidden group-hover:rotate-6 transition-transform">
                <img
                  src={
                    activeTarget.type === 'costume'
                      ? '/src/assets/images/magic_costume_icon_1793024736027.jpg'
                      : '/src/assets/images/cinema_film_roll_1793024736452.jpg'
                  }
                  alt={activeTarget.type}
                  className="w-full h-full object-contain pointer-events-none rounded-xl"
                  referrerPolicy="no-referrer"
                />

                {/* Sparkling Badge */}
                <div className="absolute top-1 right-1 bg-amber-500 text-white p-0.5 rounded-full shadow">
                  <Sparkles className="w-3 h-3 animate-spin" />
                </div>
              </div>

              {/* Word Tag beneath item */}
              <div className="mt-1.5 px-3 py-1 bg-slate-900/90 text-white rounded-lg text-xs sm:text-sm font-black shadow-lg border border-yellow-300 whitespace-nowrap flex items-center gap-1 backdrop-blur-xs group-hover:bg-amber-600 transition-colors">
                {activeTarget.type === 'costume' ? (
                  <>
                    <Shirt className="w-3.5 h-3.5 text-yellow-300" />
                    <span>costume</span>
                  </>
                ) : (
                  <>
                    <Film className="w-3.5 h-3.5 text-yellow-300" />
                    <span>film</span>
                  </>
                )}
                <span className="text-[10px] text-yellow-200 ml-1">点我!</span>
              </div>
            </button>
          </div>
        )}

        {/* Streak indicator on corner */}
        {streakCount >= 2 && (
          <div className="absolute bottom-4 right-4 z-20 bg-linear-to-r from-amber-500 to-orange-500 text-white px-3.5 py-1.5 rounded-xl shadow-lg border border-yellow-200 flex items-center gap-1.5 animate-bounce">
            <span className="text-base font-black">🔥 {streakCount} 连中!</span>
            <span className="text-xs text-amber-100 font-medium">连续找到!</span>
          </div>
        )}
      </div>

      {/* Floating Instructions Bar at the bottom of Stage */}
      <div className="bg-amber-100/90 border-t-2 border-amber-300 px-4 py-2 flex flex-wrap items-center justify-between gap-2 text-xs text-amber-950 font-medium">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span>
            寻找目标：注意看 <strong className="text-indigo-800 font-bold">Third Floor (3F)</strong> 和{' '}
            <strong className="text-rose-800 font-bold">Second Floor (2F)</strong> 的各个角落！
          </span>
        </div>
        <div className="flex items-center gap-3 text-slate-700">
          <span className="inline-flex items-center gap-1">
            <Shirt className="w-3.5 h-3.5 text-indigo-600" />
            <span>costume = 戏服</span>
          </span>
          <span className="inline-flex items-center gap-1">
            <Film className="w-3.5 h-3.5 text-amber-600" />
            <span>film = 胶卷/电影</span>
          </span>
        </div>
      </div>
    </div>
  );
};
