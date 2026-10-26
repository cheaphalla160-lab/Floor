import React from 'react';
import { HelpCircle, X, Sparkles, CheckCircle2, GraduationCap, Lightbulb } from 'lucide-react';

interface TeacherGuideModalProps {
  onClose: () => void;
}

export const TeacherGuideModal: React.FC<TeacherGuideModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border-4 border-amber-300 overflow-hidden flex flex-col my-auto max-h-[90vh]">
        {/* Header */}
        <div className="bg-linear-to-r from-amber-500 via-orange-400 to-amber-500 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <GraduationCap className="w-6 h-6 text-yellow-100" />
            <div>
              <h2 className="text-xl font-black tracking-wide">
                👩‍🏫 备课助手与课堂教学方案指南
              </h2>
              <p className="text-xs text-amber-100">
                专为小学英语教师设计 · 词汇游戏互动备课手册
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/20 transition-colors cursor-pointer"
            aria-label="关闭教学指南"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5 overflow-y-auto text-xs sm:text-sm text-slate-700">
          {/* Target Objectives */}
          <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 space-y-2">
            <h3 className="text-sm font-black text-amber-900 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-600" />
              <span>本课核心三维教学目标</span>
            </h3>
            <ul className="space-y-1.5 text-xs text-slate-700">
              <li className="flex items-start gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  <strong>词汇掌握：</strong>能够听懂、准确认读核心高频词汇{' '}
                  <code className="text-indigo-700 font-bold bg-white px-1 py-0.5 rounded border border-indigo-200">
                    costume (戏服)
                  </code>{' '}
                  和{' '}
                  <code className="text-amber-800 font-bold bg-white px-1 py-0.5 rounded border border-amber-200">
                    film (胶卷/电影)
                  </code>
                  。
                </span>
              </li>
              <li className="flex items-start gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  <strong>序数词与空间介词：</strong>掌握{' '}
                  <code className="text-rose-700 font-bold bg-white px-1 py-0.5 rounded border border-rose-200">
                    second floor (二楼)
                  </code>{' '}
                  与{' '}
                  <code className="text-indigo-700 font-bold bg-white px-1 py-0.5 rounded border border-indigo-200">
                    third floor (三楼)
                  </code>
                  ，注意固定搭配介词 <strong>on</strong> the second/third floor。
                </span>
              </li>
              <li className="flex items-start gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  <strong>句型输出与听觉跟读：</strong>在“点-听-读-评”四步中自然输出：
                  <em>"The costume is on the second/third floor."</em> /{' '}
                  <em>"The film is on the second/third floor."</em>。
                </span>
              </li>
            </ul>
          </div>

          {/* 4-Step Lesson Flow */}
          <div className="space-y-3">
            <h3 className="text-sm font-black text-slate-900 flex items-center gap-1.5">
              <Lightbulb className="w-4 h-4 text-yellow-500" />
              <span>建议的课堂 4 步互动流程</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-white rounded-xl border-2 border-slate-200 space-y-1">
                <div className="font-black text-amber-700 flex items-center gap-1">
                  <span>Step 1. 词汇预热 (Warm-up)</span>
                </div>
                <p className="text-slate-600">
                  点击顶部“词汇预习卡”，利用形象配图与音标带读，讲授 costume 与 film 的助记诀窍与发音技巧。
                </p>
              </div>

              <div className="p-3 bg-white rounded-xl border-2 border-slate-200 space-y-1">
                <div className="font-black text-amber-700 flex items-center gap-1">
                  <span>Step 2. 趣味眼力大寻宝 (Play)</span>
                </div>
                <p className="text-slate-600">
                  投影至全屏，调至“慢速”或“标准”，让学生观察二楼和三楼各房间，发现并点击跳出的戏服与胶卷！
                </p>
              </div>

              <div className="p-3 bg-white rounded-xl border-2 border-slate-200 space-y-1">
                <div className="font-black text-amber-700 flex items-center gap-1">
                  <span>Step 3. 互动跟读评测 (Read Aloud)</span>
                </div>
                <p className="text-slate-600">
                  弹窗出现后先听标准读音，带全班齐读，可邀请学生到讲台麦克风跟读获取 3 颗星奖励或教师打分。
                </p>
              </div>

              <div className="p-3 bg-white rounded-xl border-2 border-slate-200 space-y-1">
                <div className="font-black text-amber-700 flex items-center gap-1">
                  <span>Step 4. 小组对抗与排行榜 (PK Rank)</span>
                </div>
                <p className="text-slate-600">
                  将班级分为“红星组”与“小英雄组”，轮流上台寻宝计分，榜单实时展示团队总分，激发全体参与感！
                </p>
              </div>
            </div>
          </div>

          {/* Sound & Classroom Features */}
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1 text-slate-600">
            <span className="font-bold text-slate-800">💡 课堂小贴士：</span>
            <div>
              • <strong>背景音乐：</strong>
              采用纯纯正正的合成八音盒与木琴音色，轻快欢快，随时可在顶部开关静音。
            </div>
            <div>
              • <strong>速度调节：</strong>
              低年级可设置 3.8s 慢速，让孩子慢慢辨识二楼与三楼；中高年级可设置 1.4s 快速挑战！
            </div>
            <div>
              • <strong>自由精讲模式：</strong>
              可切换为“自由精讲 (无时限)”，老师可随时暂停画面，引导全班观察舞台、放映厅等房间细节。
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-black shadow-md transition-all active:scale-95 cursor-pointer"
          >
            我明白了，返回游戏课堂
          </button>
        </div>
      </div>
    </div>
  );
};
