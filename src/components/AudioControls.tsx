import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Music, Music2 } from 'lucide-react';
import { soundManager } from '../utils/soundEffects';

interface AudioControlsProps {
  onSoundInteracted?: () => void;
}

export const AudioControls: React.FC<AudioControlsProps> = ({ onSoundInteracted }) => {
  const [bgmActive, setBgmActive] = useState(false);
  const [sfxActive, setSfxActive] = useState(true);

  useEffect(() => {
    // Check initial status
    setBgmActive(soundManager.getBgmStatus());
    setSfxActive(soundManager.getSfxStatus());
  }, []);

  const handleToggleBgm = () => {
    onSoundInteracted?.();
    const active = soundManager.toggleBGM();
    setBgmActive(active);
  };

  const handleToggleSfx = () => {
    onSoundInteracted?.();
    const active = soundManager.toggleSFX();
    setSfxActive(active);
    if (active) {
      soundManager.playPop();
    }
  };

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={handleToggleBgm}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
          bgmActive
            ? 'bg-amber-100 text-amber-900 border-amber-300 shadow-sm'
            : 'bg-white/80 hover:bg-white text-slate-600 border-slate-200'
        }`}
        title={bgmActive ? '点击暂停背景音乐' : '点击开启欢快背景音乐'}
        aria-label="背景音乐开关"
      >
        {bgmActive ? (
          <>
            <Music className="w-3.5 h-3.5 text-amber-600 animate-bounce" />
            <span className="whitespace-nowrap">音乐: 播放中</span>
          </>
        ) : (
          <>
            <Music2 className="w-3.5 h-3.5 text-slate-400" />
            <span className="whitespace-nowrap">音乐: 静音</span>
          </>
        )}
      </button>

      <button
        type="button"
        onClick={handleToggleSfx}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
          sfxActive
            ? 'bg-sky-100 text-sky-900 border-sky-300 shadow-sm'
            : 'bg-white/80 hover:bg-white text-slate-600 border-slate-200'
        }`}
        title={sfxActive ? '点击关闭音效' : '点击开启游戏音效'}
        aria-label="游戏音效开关"
      >
        {sfxActive ? (
          <>
            <Volume2 className="w-3.5 h-3.5 text-sky-600" />
            <span className="whitespace-nowrap">音效: 开启</span>
          </>
        ) : (
          <>
            <VolumeX className="w-3.5 h-3.5 text-slate-400" />
            <span className="whitespace-nowrap">音效: 静音</span>
          </>
        )}
      </button>
    </div>
  );
};
