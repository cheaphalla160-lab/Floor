import React, { useState, useEffect, useRef } from 'react';
import { ActiveTarget } from '../types/game';
import {
  Volume2,
  Mic,
  MicOff,
  Sparkles,
  ArrowRight,
  Star,
  CheckCircle2,
  RotateCcw,
  BookOpen,
} from 'lucide-react';
import { speakEnglish, createSpeechRecognizer, SpeechEvaluationResult, isSpeechRecognitionSupported } from '../utils/speechHelper';
import { soundManager } from '../utils/soundEffects';
import confetti from 'canvas-confetti';

interface SentenceFollowModalProps {
  target: ActiveTarget;
  onContinue: (bonusPoints: number, starsEarned: number) => void;
}

export const SentenceFollowModal: React.FC<SentenceFollowModalProps> = ({
  target,
  onContinue,
}) => {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [speechResult, setSpeechResult] = useState<SpeechEvaluationResult | null>(null);
  const [activeWordIndex, setActiveWordIndex] = useState<number | null>(null);
  const [starsAwarded, setStarsAwarded] = useState<number>(3);
  const [hasPracticed, setHasPracticed] = useState(false);

  const isCostume = target.type === 'costume';
  const isSecondFloor = target.spot.floor === 'second_floor';

  const itemWord = isCostume ? 'costume' : 'film';
  const floorWord = isSecondFloor ? 'second floor' : 'third floor';

  const englishSentence = `The ${itemWord} is on the ${floorWord}.`;
  const chineseSentence = isCostume
    ? `这件戏服在${isSecondFloor ? '二楼' : '三楼'}。`
    : `这盘胶卷在${isSecondFloor ? '二楼' : '三楼'}。`;

  const questionDialogue = `Where is the ${itemWord}? It's on the ${floorWord}!`;

  // Words breakdown for interactive pronunciation
  const words = [
    { text: 'The', ipa: '/ðə/', meaning: '这 / 那' },
    {
      text: itemWord,
      ipa: isCostume ? '/ˈkɒstjuːm/' : '/fɪlm/',
      meaning: isCostume ? '戏服 (重点)' : '胶卷/电影 (重点)',
      highlight: true,
      color: isCostume ? 'text-indigo-600 bg-indigo-50 border-indigo-200' : 'text-amber-700 bg-amber-50 border-amber-200',
    },
    { text: 'is', ipa: '/ɪz/', meaning: '在 / 是' },
    { text: 'on the', ipa: '/ɒn ðə/', meaning: '在...之上' },
    {
      text: floorWord,
      ipa: isSecondFloor ? '/ˈsekənd flɔː/' : '/θɜːd flɔː/',
      meaning: isSecondFloor ? '二楼 (重点)' : '三楼 (重点)',
      highlight: true,
      color: isSecondFloor ? 'text-rose-600 bg-rose-50 border-rose-200' : 'text-indigo-600 bg-indigo-50 border-indigo-200',
    },
  ];

  // Auto speak on open
  useEffect(() => {
    soundManager.playStarChime();
    confetti({
      particleCount: 40,
      spread: 60,
      origin: { y: 0.6 },
    });

    // Auto read sentence after short delay
    const timer = setTimeout(() => {
      handlePlaySentence(0.85);
    }, 400);

    return () => clearTimeout(timer);
  }, []);

  const handlePlaySentence = (rate = 0.85) => {
    setIsPlayingAudio(true);
    speakEnglish(
      englishSentence,
      rate,
      () => setIsPlayingAudio(true),
      () => setIsPlayingAudio(false)
    );
  };

  const handlePlayDialogue = () => {
    setIsPlayingAudio(true);
    speakEnglish(
      questionDialogue,
      0.85,
      () => setIsPlayingAudio(true),
      () => setIsPlayingAudio(false)
    );
  };

  const handleWordClick = (wordText: string, index: number) => {
    setActiveWordIndex(index);
    soundManager.playPop();
    speakEnglish(wordText, 0.8, undefined, () => setActiveWordIndex(null));
  };

  // Microphone read-along
  const speechRecognizerRef = useRef<{ start: () => void; stop: () => void } | null>(null);

  const startSpeechPractice = () => {
    if (!isSpeechRecognitionSupported()) {
      // Fallback: simulated teacher rating
      simulateSpeechEvaluation();
      return;
    }

    setIsListening(true);
    setSpeechResult(null);

    const recognizer = createSpeechRecognizer(
      englishSentence,
      (result) => {
        setIsListening(false);
        setSpeechResult(result);
        setStarsAwarded(result.stars);
        setHasPracticed(true);
        soundManager.playStarChime();
        confetti({
          particleCount: 50,
          spread: 70,
          origin: { y: 0.5 },
        });
      },
      (error) => {
        console.warn('Speech err:', error);
        setIsListening(false);
        // Fallback friendly praise so kids don't feel discouraged
        simulateSpeechEvaluation();
      },
      () => {
        setIsListening(false);
      }
    );

    if (recognizer) {
      speechRecognizerRef.current = recognizer;
      recognizer.start();
    } else {
      simulateSpeechEvaluation();
    }
  };

  const simulateSpeechEvaluation = () => {
    setIsListening(true);
    setTimeout(() => {
      setIsListening(false);
      const res: SpeechEvaluationResult = {
        transcript: englishSentence,
        score: 95,
        stars: 3,
        feedbackText: 'Super Star! 发音非常标准，太棒了！🌟🌟🌟',
        matchedKeywords: [itemWord, floorWord],
      };
      setSpeechResult(res);
      setStarsAwarded(3);
      setHasPracticed(true);
      soundManager.playStarChime();
      confetti({
        particleCount: 45,
        spread: 60,
        origin: { y: 0.6 },
      });
    }, 1800);
  };

  const handleManualStarRating = (stars: number) => {
    setStarsAwarded(stars);
    setHasPracticed(true);
    soundManager.playStarChime();
  };

  const handleComplete = () => {
    // Bonus points based on stars: 3 stars = 100, 2 stars = 60, 1 star = 30
    const bonus = starsAwarded === 3 ? 100 : starsAwarded === 2 ? 60 : 30;
    onContinue(bonus, starsAwarded);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border-4 border-amber-300 overflow-hidden flex flex-col my-auto">
        {/* Header Ribbon */}
        <div className="bg-linear-to-r from-amber-500 via-orange-400 to-amber-500 text-white px-6 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-yellow-200 animate-spin" />
            <h2 className="text-lg sm:text-xl font-black tracking-wide">
              🎉 太棒了！找到了目标单词！
            </h2>
          </div>
          <span className="text-xs bg-amber-700/60 px-3 py-1 rounded-full font-bold">
            跟读练习 · 视觉与听觉互动
          </span>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 flex flex-col gap-5">
          {/* Item & Location Discovery Banner */}
          <div className="flex items-center gap-4 p-3.5 bg-amber-50 rounded-2xl border-2 border-amber-200">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl bg-white p-1 border-2 border-amber-300 shadow-sm shrink-0 flex items-center justify-center overflow-hidden">
              <img
                src={
                  isCostume
                    ? '/src/assets/images/magic_costume_icon_1793024736027.jpg'
                    : '/src/assets/images/cinema_film_roll_1793024736452.jpg'
                }
                alt={itemWord}
                className="w-full h-full object-contain"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-500 mb-0.5">
                <span>发现位置：</span>
                <span className="text-amber-800 font-extrabold">{target.spot.roomName}</span>
                <span>({target.spot.chineseName})</span>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xl sm:text-2xl font-black text-slate-800 uppercase tracking-tight">
                  {itemWord}
                </span>
                <span className="text-sm font-semibold text-slate-500">
                  {isCostume ? '(戏服/服装)' : '(胶卷/电影)'}
                </span>
                <span className="text-slate-300">·</span>
                <span
                  className={`px-2.5 py-0.5 rounded-lg text-xs font-black text-white ${
                    isSecondFloor ? 'bg-rose-500' : 'bg-indigo-600'
                  }`}
                >
                  {isSecondFloor ? '2F Second Floor (二楼)' : '3F Third Floor (三楼)'}
                </span>
              </div>
            </div>
          </div>

          {/* Main Core Sentence to Read Aloud */}
          <div className="bg-linear-to-b from-sky-50 to-indigo-50/50 p-5 rounded-2xl border-2 border-sky-200 text-center flex flex-col items-center">
            <div className="text-xs font-bold text-sky-800 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-sky-600" />
              <span>请认真大声朗读这句英语 (Read Aloud)</span>
            </div>

            {/* Clickable Word Tiles */}
            <div className="flex flex-wrap items-center justify-center gap-2 my-2">
              {words.map((w, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleWordClick(w.text, idx)}
                  className={`group px-3 py-2 sm:px-4 sm:py-2.5 rounded-xl border-2 transition-all cursor-pointer font-black text-lg sm:text-2xl flex flex-col items-center shadow-xs active:scale-95 ${
                    w.highlight
                      ? w.color + ' scale-105 shadow-sm'
                      : 'bg-white text-slate-800 border-slate-200 hover:border-sky-300'
                  } ${activeWordIndex === idx ? 'ring-4 ring-sky-300 animate-pulse' : ''}`}
                  title="点击单独听此单词发音"
                >
                  <span>{w.text}</span>
                  <span className="text-[10px] sm:text-xs font-mono font-medium text-slate-400 group-hover:text-sky-600">
                    {w.ipa}
                  </span>
                </button>
              ))}
            </div>

            {/* Chinese Meaning */}
            <div className="text-base sm:text-lg font-bold text-slate-700 mt-2">
              {chineseSentence}
            </div>

            {/* Audio Listen Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-2 mt-4">
              <button
                type="button"
                onClick={() => handlePlaySentence(0.85)}
                disabled={isPlayingAudio}
                className="flex items-center gap-1.5 px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-xl font-bold text-sm shadow-md transition-all active:scale-95"
              >
                <Volume2 className="w-4 h-4" />
                <span>{isPlayingAudio ? '朗读中...' : '标准朗读 (Listen)'}</span>
              </button>

              <button
                type="button"
                onClick={() => handlePlaySentence(0.65)}
                disabled={isPlayingAudio}
                className="flex items-center gap-1.5 px-3 py-2 bg-sky-100 hover:bg-sky-200 text-sky-800 rounded-xl font-semibold text-xs transition-all border border-sky-300"
                title="放慢语速，适合初学跟读"
              >
                <span>🐢 慢速听 (0.7x)</span>
              </button>

              <button
                type="button"
                onClick={handlePlayDialogue}
                disabled={isPlayingAudio}
                className="flex items-center gap-1.5 px-3 py-2 bg-amber-100 hover:bg-amber-200 text-amber-900 rounded-xl font-semibold text-xs transition-all border border-amber-300"
                title="听问答对话: Where is it? It's on..."
              >
                <span>💬 问答句式</span>
              </button>
            </div>
          </div>

          {/* Read Along / Microphone Practice Section */}
          <div className="bg-amber-50/70 p-4 rounded-2xl border-2 border-amber-200 flex flex-col items-center">
            <div className="w-full flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-amber-950 flex items-center gap-1">
                <Mic className="w-4 h-4 text-amber-600" />
                <span>学生语音跟读互动：</span>
              </span>
              <span className="text-[11px] text-slate-500">
                可点击麦克风评测，或由老师课堂直接评分
              </span>
            </div>

            {/* Mic Action Button */}
            <div className="flex flex-col sm:flex-row items-center gap-3 w-full justify-center my-1">
              <button
                type="button"
                onClick={startSpeechPractice}
                disabled={isListening}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-2xl font-black text-sm transition-all shadow-md active:scale-95 cursor-pointer ${
                  isListening
                    ? 'bg-rose-500 text-white animate-pulse ring-4 ring-rose-200'
                    : 'bg-linear-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white'
                }`}
              >
                {isListening ? (
                  <>
                    <Mic className="w-5 h-5 animate-bounce" />
                    <span>正在倾听中... 请大声朗读！</span>
                  </>
                ) : (
                  <>
                    <Mic className="w-5 h-5" />
                    <span>🎤 点击麦克风跟读 (Follow Me)</span>
                  </>
                )}
              </button>

              {/* Manual Teacher Star Rating Affordance */}
              <div className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-xl border border-amber-300 shadow-xs">
                <span className="text-xs font-bold text-slate-600 mr-1">教师评分:</span>
                {[1, 2, 3].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => handleManualStarRating(star)}
                    className="p-1 hover:scale-120 transition-transform cursor-pointer"
                    title={`打分: ${star} 颗星`}
                  >
                    <Star
                      className={`w-5 h-5 ${
                        star <= starsAwarded
                          ? 'fill-amber-400 text-amber-400'
                          : 'text-slate-300'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Speech Result / Encouragement */}
            {speechResult && (
              <div className="mt-3 p-3 bg-white w-full rounded-xl border border-emerald-200 flex items-center justify-between gap-2 animate-in fade-in">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  <div>
                    <div className="text-xs font-bold text-emerald-900">
                      {speechResult.feedbackText}
                    </div>
                    {speechResult.transcript && (
                      <div className="text-[11px] text-slate-500">
                        识别内容: "{speechResult.transcript}"
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-0.5 shrink-0">
                  {Array.from({ length: starsAwarded }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Action Footer Button */}
          <div className="flex items-center justify-between gap-3 pt-2 border-t border-slate-100">
            <div className="text-xs text-slate-500">
              找到奖励: <span className="font-bold text-amber-600">+100分</span> · 跟读加分:{' '}
              <span className="font-bold text-emerald-600">
                +{starsAwarded === 3 ? '100' : starsAwarded === 2 ? '60' : '30'}分
              </span>
            </div>

            <button
              type="button"
              onClick={handleComplete}
              className="flex items-center gap-2 px-6 py-2.5 bg-linear-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-xl font-black text-sm shadow-lg transition-all active:scale-95 cursor-pointer"
            >
              <span>继续寻找下一处 (Next)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
