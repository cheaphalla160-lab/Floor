import React, { useState } from 'react';
import { VOCABULARY_FLASHCARDS, FlashcardItem } from '../data/gameData';
import { Volume2, Sparkles, BookOpen, MessageSquare, ArrowLeft, Play } from 'lucide-react';
import { speakEnglish } from '../utils/speechHelper';
import { soundManager } from '../utils/soundEffects';

interface FlashcardsViewProps {
  onBackToGame: () => void;
}

export const FlashcardsView: React.FC<FlashcardsViewProps> = ({ onBackToGame }) => {
  const [selectedCard, setSelectedCard] = useState<FlashcardItem>(VOCABULARY_FLASHCARDS[0]);
  const [drillSentence, setDrillSentence] = useState({
    item: 'costume',
    floor: 'second floor',
  });

  const handleSpeak = (text: string, rate = 0.85) => {
    soundManager.playPop();
    speakEnglish(text, rate);
  };

  const currentChantSentence = `The ${drillSentence.item} is on the ${drillSentence.floor}.`;

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Top Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-5 bg-linear-to-r from-amber-500 via-orange-400 to-amber-500 rounded-3xl text-white shadow-lg">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBackToGame}
            className="p-2 bg-white/20 hover:bg-white/30 rounded-xl transition-colors cursor-pointer"
            title="返回寻宝游戏"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-xl sm:text-2xl font-black tracking-wide">
              📚 核心词汇预习与备课讲堂
            </h2>
            <p className="text-xs sm:text-sm text-amber-100">
              costume · film · second floor · third floor 重点操练
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onBackToGame}
          className="flex items-center gap-2 px-5 py-2.5 bg-white text-amber-800 rounded-2xl font-black text-sm shadow-md hover:bg-amber-50 transition-transform active:scale-95 cursor-pointer"
        >
          <Play className="w-4 h-4 fill-amber-600 text-amber-600" />
          <span>开始寻宝游戏 (Play Game)</span>
        </button>
      </div>

      {/* 4 Core Vocabulary Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {VOCABULARY_FLASHCARDS.map((card) => {
          const isSelected = selectedCard.id === card.id;
          return (
            <div
              key={card.id}
              onClick={() => {
                setSelectedCard(card);
                handleSpeak(card.word);
              }}
              className={`p-4 rounded-3xl border-3 transition-all cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? 'bg-amber-50/90 border-amber-400 shadow-lg scale-102 ring-4 ring-amber-200'
                  : 'bg-white border-slate-200 hover:border-amber-300 hover:shadow-md'
              }`}
            >
              <div>
                {/* Visual Thumbnail */}
                <div className="w-full aspect-square rounded-2xl overflow-hidden bg-amber-100/50 mb-3 border border-amber-200">
                  <img
                    src={card.image}
                    alt={card.word}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>

                <div className="flex items-start justify-between gap-1 mb-1">
                  <h3 className="text-xl font-black text-slate-800 tracking-tight">
                    {card.word}
                  </h3>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSpeak(card.word);
                    }}
                    className="p-1.5 rounded-full bg-amber-100 text-amber-700 hover:bg-amber-200"
                    title="点击听发音"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="text-xs font-mono text-slate-400 mb-1">{card.ipa}</div>
                <div className="text-sm font-bold text-slate-700">{card.chinese}</div>
              </div>

              <div className="mt-3 pt-2 border-t border-slate-100 text-[11px] text-slate-500">
                点击展开详细例句与讲解
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Card Deep Dive */}
      <div className="p-6 bg-white rounded-3xl border-3 border-amber-300 shadow-md">
        <div className="flex flex-col md:flex-row gap-6 items-center">
          <div className="w-40 h-40 rounded-2xl overflow-hidden border-2 border-amber-300 shadow-md shrink-0">
            <img
              src={selectedCard.image}
              alt={selectedCard.word}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>

          <div className="flex-1 space-y-3">
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-3xl font-black text-slate-900 tracking-tight">
                {selectedCard.word}
              </span>
              <span className="text-sm font-mono text-slate-500 bg-slate-100 px-3 py-1 rounded-lg">
                {selectedCard.ipa}
              </span>
              <span className="text-sm font-bold text-amber-700 bg-amber-100 px-3 py-1 rounded-lg">
                {selectedCard.chinese}
              </span>
              <button
                type="button"
                onClick={() => handleSpeak(selectedCard.word)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-bold shadow-xs cursor-pointer"
              >
                <Volume2 className="w-4 h-4" />
                <span>发音 (Pronounce)</span>
              </button>
            </div>

            {/* Example sentence */}
            <div className="p-3.5 bg-amber-50 rounded-2xl border border-amber-200">
              <div className="flex items-center justify-between gap-2 mb-1">
                <span className="text-xs font-bold text-amber-900">核心例句 (Example):</span>
                <button
                  type="button"
                  onClick={() => handleSpeak(selectedCard.exampleSentence)}
                  className="text-xs font-bold text-sky-700 hover:underline flex items-center gap-1"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>朗读例句</span>
                </button>
              </div>
              <p className="text-base font-black text-slate-800">
                "{selectedCard.exampleSentence}"
              </p>
              <p className="text-xs text-slate-600 mt-0.5">
                {selectedCard.exampleTranslation}
              </p>
            </div>

            {/* Teacher Tips */}
            <div className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-200">
              {selectedCard.teacherTips}
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Sentence Matrix Drill (句型组合操练器) */}
      <div className="p-6 bg-linear-to-b from-sky-50 to-white rounded-3xl border-3 border-sky-300 shadow-md space-y-4">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-sky-600" />
          <h3 className="text-lg font-black text-slate-800">
            🎯 课堂互动句型组合操练 (Sentence Maker & Chant)
          </h3>
        </div>

        <p className="text-xs text-slate-600">
          老师可点击切换组合，带全班学生进行 “Where is...?” 与 “The ... is on the ... floor” 的节拍律动跟读：
        </p>

        {/* Combiners */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-white rounded-2xl border border-sky-200">
            <span className="text-xs font-bold text-slate-500 block mb-2">
              1. 选择目标物品 (Item):
            </span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setDrillSentence((prev) => ({ ...prev, item: 'costume' }))}
                className={`flex-1 py-2 px-3 rounded-xl text-sm font-black transition-all ${
                  drillSentence.item === 'costume'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                🎭 costume (戏服)
              </button>
              <button
                type="button"
                onClick={() => setDrillSentence((prev) => ({ ...prev, item: 'film' }))}
                className={`flex-1 py-2 px-3 rounded-xl text-sm font-black transition-all ${
                  drillSentence.item === 'film'
                    ? 'bg-amber-600 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                🎞️ film (胶卷)
              </button>
            </div>
          </div>

          <div className="p-4 bg-white rounded-2xl border border-sky-200">
            <span className="text-xs font-bold text-slate-500 block mb-2">
              2. 选择所在楼层 (Floor):
            </span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setDrillSentence((prev) => ({ ...prev, floor: 'second floor' }))}
                className={`flex-1 py-2 px-3 rounded-xl text-sm font-black transition-all ${
                  drillSentence.floor === 'second floor'
                    ? 'bg-rose-600 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                2F second floor (二楼)
              </button>
              <button
                type="button"
                onClick={() => setDrillSentence((prev) => ({ ...prev, floor: 'third floor' }))}
                className={`flex-1 py-2 px-3 rounded-xl text-sm font-black transition-all ${
                  drillSentence.floor === 'third floor'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                3F third floor (三楼)
              </button>
            </div>
          </div>
        </div>

        {/* Current Result Sentence */}
        <div className="p-4 bg-yellow-50 rounded-2xl border-2 border-yellow-300 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div>
            <div className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              "{currentChantSentence}"
            </div>
            <div className="text-sm font-medium text-slate-600 mt-1">
              这件{drillSentence.item === 'costume' ? '戏服' : '胶卷'}在
              {drillSentence.floor === 'second floor' ? '二楼' : '三楼'}。
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => handleSpeak(currentChantSentence, 0.85)}
              className="flex items-center gap-1.5 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl text-xs shadow-md transition-all active:scale-95"
            >
              <Volume2 className="w-4 h-4" />
              <span>标准读</span>
            </button>
            <button
              type="button"
              onClick={() => handleSpeak(currentChantSentence, 0.65)}
              className="flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-amber-50 text-amber-800 font-bold rounded-xl text-xs border border-amber-300 transition-all active:scale-95"
            >
              <span>慢速跟读</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
