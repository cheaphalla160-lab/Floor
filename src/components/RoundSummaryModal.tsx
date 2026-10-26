import React, { useState } from 'react';
import { Trophy, RotateCcw, ArrowRight, Star, Award, Sparkles } from 'lucide-react';
import { soundManager } from '../utils/soundEffects';
import confetti from 'canvas-confetti';

interface RoundSummaryModalProps {
  score: number;
  itemsFound: number;
  costumeCount: number;
  filmCount: number;
  secondFloorCount: number;
  thirdFloorCount: number;
  starsEarned: number;
  onPlayAgain: () => void;
  onSaveToLeaderboard: (name: string, group: string) => void;
}

export const RoundSummaryModal: React.FC<RoundSummaryModalProps> = ({
  score,
  itemsFound,
  costumeCount,
  filmCount,
  secondFloorCount,
  thirdFloorCount,
  starsEarned,
  onPlayAgain,
  onSaveToLeaderboard,
}) => {
  const [studentName, setStudentName] = useState('');
  const [selectedGroup, setSelectedGroup] = useState('Star Team (红星组)');
  const [saved, setSaved] = useState(false);

  React.useEffect(() => {
    soundManager.playFanfare();
    confetti({
      particleCount: 80,
      spread: 90,
      origin: { y: 0.5 },
    });
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentName.trim() || saved) return;
    onSaveToLeaderboard(studentName.trim(), selectedGroup);
    setSaved(true);
    soundManager.playStarChime();
  };

  const groups = [
    'Star Team (红星组)',
    'Hero Team (小英雄组)',
    'Sunshine Team (阳光组)',
    'Rainbow Team (彩虹组)',
  ];

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border-4 border-amber-300 overflow-hidden flex flex-col my-auto">
        {/* Top Banner */}
        <div className="bg-linear-to-r from-amber-500 via-orange-400 to-amber-500 text-white p-6 text-center relative overflow-hidden">
          <div className="relative z-10 flex flex-col items-center">
            <div className="w-20 h-20 rounded-full bg-white/20 p-2 border-2 border-white/50 mb-2 overflow-hidden shadow-inner">
              <img
                src="/src/assets/images/cute_owl_teacher_1793024736062.jpg"
                alt="Teacher Owl Mascot"
                className="w-full h-full object-cover rounded-full"
                referrerPolicy="no-referrer"
              />
            </div>
            <h2 className="text-2xl font-black tracking-wide">🎉 寻宝挑战圆满完成！</h2>
            <p className="text-xs text-amber-100 mt-0.5">
              Costume & Film 大侦探 · 词汇大满贯
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {/* Main Score Display */}
          <div className="text-center p-4 bg-amber-50 rounded-2xl border-2 border-amber-200">
            <div className="text-xs font-bold text-amber-900 uppercase tracking-wider">
              本轮总得分
            </div>
            <div className="text-4xl sm:text-5xl font-black font-mono text-amber-600 my-1 tabular-nums">
              {score}
              <span className="text-lg font-sans text-amber-800 ml-1">分</span>
            </div>
            <div className="text-xs font-semibold text-slate-600 flex items-center justify-center gap-1">
              <span>获得发音跟读之星：</span>
              <strong className="text-amber-600 font-bold">{starsEarned}</strong>
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            </div>
          </div>

          {/* Detailed Discovery Breakdown */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-indigo-50/70 rounded-xl border border-indigo-200">
              <div className="text-xs text-indigo-700 font-bold mb-1">🎭 词汇发现数量</div>
              <div className="text-xs text-slate-700 space-y-0.5">
                <div>
                  costume (戏服): <strong className="text-indigo-800">{costumeCount}</strong> 次
                </div>
                <div>
                  film (胶卷): <strong className="text-amber-800">{filmCount}</strong> 次
                </div>
              </div>
            </div>

            <div className="p-3 bg-rose-50/70 rounded-xl border border-rose-200">
              <div className="text-xs text-rose-700 font-bold mb-1">🏢 楼层分布统计</div>
              <div className="text-xs text-slate-700 space-y-0.5">
                <div>
                  second floor (2F): <strong className="text-rose-800">{secondFloorCount}</strong> 次
                </div>
                <div>
                  third floor (3F): <strong className="text-indigo-800">{thirdFloorCount}</strong> 次
                </div>
              </div>
            </div>
          </div>

          {/* Submit to Leaderboard Form */}
          {!saved ? (
            <form
              onSubmit={handleSave}
              className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2.5"
            >
              <div className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <Trophy className="w-4 h-4 text-amber-500" />
                <span>登记成绩至班级排行榜：</span>
              </div>
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  required
                  placeholder="输入学生名字 (例如: Amy / Tom)"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  className="flex-1 px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
                <select
                  value={selectedGroup}
                  onChange={(e) => setSelectedGroup(e.target.value)}
                  className="px-2.5 py-2 bg-white border border-slate-300 rounded-xl text-xs font-semibold focus:outline-none"
                >
                  {groups.map((g) => (
                    <option key={g} value={g}>
                      {g}
                    </option>
                  ))}
                </select>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-black shadow-xs cursor-pointer active:scale-95 transition-all whitespace-nowrap"
                >
                  登记上榜
                </button>
              </div>
            </form>
          ) : (
            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-center text-xs font-bold text-emerald-800">
              ✅ 成绩已成功登记至班级排行榜！
            </div>
          )}

          {/* Action buttons */}
          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={onPlayAgain}
              className="flex-1 py-3 bg-linear-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-2xl font-black text-sm shadow-lg flex items-center justify-center gap-2 cursor-pointer transition-transform active:scale-95"
            >
              <RotateCcw className="w-4 h-4" />
              <span>再玩一局 (Play Again)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
