import React, { useState } from 'react';
import { LeaderboardEntry } from '../types/game';
import { Trophy, Medal, Plus, RotateCcw, X, Users, Award } from 'lucide-react';
import { soundManager } from '../utils/soundEffects';

interface LeaderboardModalProps {
  entries: LeaderboardEntry[];
  currentScore?: number;
  currentFoundCount?: number;
  currentStars?: number;
  onClose: () => void;
  onAddEntry: (name: string, group: string) => void;
  onResetLeaderboard: () => void;
}

export const LeaderboardModal: React.FC<LeaderboardModalProps> = ({
  entries,
  currentScore = 0,
  currentFoundCount = 0,
  currentStars = 0,
  onClose,
  onAddEntry,
  onResetLeaderboard,
}) => {
  const [studentName, setStudentName] = useState('');
  const [selectedGroup, setSelectedGroup] = useState('Star Team (红星组)');
  const [activeTab, setActiveTab] = useState<'individual' | 'group'>('individual');
  const [savedThisSession, setSavedThisSession] = useState(false);

  const groups = [
    'Star Team (红星组)',
    'Hero Team (小英雄组)',
    'Sunshine Team (阳光组)',
    'Rainbow Team (彩虹组)',
  ];

  const handleSaveScore = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentName.trim()) return;

    soundManager.playStarChime();
    onAddEntry(studentName.trim(), selectedGroup);
    setSavedThisSession(true);
    setStudentName('');
  };

  // Sort entries descending by score
  const sortedEntries = [...entries].sort((a, b) => b.score - a.score);

  // Group aggregation for Group PK mode
  const groupStats = groups.map((g) => {
    const groupEntries = entries.filter((e) => e.groupName === g);
    const totalScore = groupEntries.reduce((sum, e) => sum + e.score, 0);
    const totalFound = groupEntries.reduce((sum, e) => sum + e.itemsFound, 0);
    return { group: g, totalScore, totalFound, count: groupEntries.length };
  }).sort((a, b) => b.totalScore - a.totalScore);

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border-4 border-amber-300 overflow-hidden flex flex-col my-auto max-h-[90vh]">
        {/* Header */}
        <div className="bg-linear-to-r from-amber-500 via-yellow-500 to-amber-600 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Trophy className="w-6 h-6 text-yellow-100" />
            <div>
              <h2 className="text-xl font-black tracking-wide">🏆 寻宝荣誉排行榜</h2>
              <p className="text-xs text-amber-100">激发学习兴趣 · 记录课堂互动成果</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/20 transition-colors cursor-pointer"
            aria-label="关闭排行榜"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switch */}
        <div className="px-6 pt-4 pb-2 flex items-center justify-between border-b border-slate-100">
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
            <button
              type="button"
              onClick={() => setActiveTab('individual')}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'individual'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              个人英雄榜 (Top Students)
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('group')}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'group'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              小组PK榜 (Group PK)
            </button>
          </div>

          <button
            type="button"
            onClick={onResetLeaderboard}
            className="text-xs text-slate-400 hover:text-rose-600 flex items-center gap-1 transition-colors"
            title="清空并重置示例榜单"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>重置榜单</span>
          </button>
        </div>

        {/* Body content */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4">
          {/* Quick Score Submission Card if score > 0 */}
          {currentScore > 0 && !savedThisSession && (
            <form
              onSubmit={handleSaveScore}
              className="p-4 bg-amber-50 rounded-2xl border-2 border-amber-300 flex flex-col sm:flex-row items-center gap-3"
            >
              <div className="flex-1 w-full">
                <div className="text-xs font-bold text-amber-900 mb-1 flex items-center gap-1">
                  <Award className="w-4 h-4 text-amber-600" />
                  <span>记录当前成绩：得分 {currentScore} 分 (找到 {currentFoundCount} 个)</span>
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    required
                    placeholder="输入学生姓名 (如: Amy / 齐天大圣)"
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                    className="flex-1 px-3 py-1.5 bg-white border border-amber-300 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                  <select
                    value={selectedGroup}
                    onChange={(e) => setSelectedGroup(e.target.value)}
                    className="px-2.5 py-1.5 bg-white border border-amber-300 rounded-xl text-xs font-medium focus:outline-none"
                  >
                    {groups.map((g) => (
                      <option key={g} value={g}>
                        {g}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <button
                type="submit"
                className="w-full sm:w-auto px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-black shadow-md flex items-center justify-center gap-1.5 cursor-pointer shrink-0 transition-transform active:scale-95"
              >
                <Plus className="w-4 h-4" />
                <span>上榜登记</span>
              </button>
            </form>
          )}

          {/* Individual Ranking List */}
          {activeTab === 'individual' ? (
            <div className="space-y-2">
              {sortedEntries.map((entry, index) => {
                const isTop1 = index === 0;
                const isTop2 = index === 1;
                const isTop3 = index === 2;

                return (
                  <div
                    key={entry.id}
                    className={`flex items-center justify-between p-3 rounded-2xl border transition-all ${
                      isTop1
                        ? 'bg-yellow-50/80 border-yellow-300 shadow-sm'
                        : isTop2
                        ? 'bg-slate-50 border-slate-200'
                        : isTop3
                        ? 'bg-amber-50/50 border-amber-200'
                        : 'bg-white border-slate-100 hover:border-slate-200'
                    }`}
                  >
                    {/* Rank & Name */}
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center font-black text-sm shrink-0">
                        {isTop1 ? (
                          <span className="text-xl">🥇</span>
                        ) : isTop2 ? (
                          <span className="text-xl">🥈</span>
                        ) : isTop3 ? (
                          <span className="text-xl">🥉</span>
                        ) : (
                          <span className="font-mono text-slate-500">{index + 1}</span>
                        )}
                      </div>
                      <div>
                        <div className="text-sm font-extrabold text-slate-800 flex items-center gap-1.5">
                          <span>{entry.studentName}</span>
                          {entry.groupName && (
                            <span className="text-[11px] font-normal text-slate-400">
                              · {entry.groupName}
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-slate-500">
                          找到词汇: <strong className="text-amber-700">{entry.itemsFound}</strong> 个 ·
                          跟读获星: <strong className="text-yellow-600">{entry.starsEarned}</strong> ⭐
                        </div>
                      </div>
                    </div>

                    {/* Score */}
                    <div className="text-right">
                      <div className="font-mono text-lg font-black text-amber-600 tabular-nums">
                        {entry.score}
                        <span className="text-xs font-sans text-amber-800 ml-0.5">分</span>
                      </div>
                      <div className="text-[10px] text-slate-400">{entry.date}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* Group PK Ranking */
            <div className="space-y-3">
              {groupStats.map((stat, idx) => (
                <div
                  key={stat.group}
                  className="p-4 bg-linear-to-r from-amber-50/60 to-white rounded-2xl border-2 border-amber-200 flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-lg bg-amber-500 text-white font-black flex items-center justify-center text-sm shadow-xs">
                      #{idx + 1}
                    </span>
                    <div>
                      <div className="font-black text-slate-800 text-base">{stat.group}</div>
                      <div className="text-xs text-slate-500">
                        上榜人次: {stat.count} 人 · 累计找到: {stat.totalFound} 个目标
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-black text-amber-600 font-mono tabular-nums">
                      {stat.totalScore}
                      <span className="text-xs font-sans text-slate-600 ml-1">团队总分</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          <span className="text-xs text-slate-500">
            💡 教师小妙招：可在全班开展分组轮流寻找挑战，比比谁读得更准、找得更快！
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
          >
            返回游戏
          </button>
        </div>
      </div>
    </div>
  );
};
