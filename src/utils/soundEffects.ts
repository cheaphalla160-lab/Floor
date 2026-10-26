/**
 * Web Audio API synthesizer for cheerful kids classroom background music & sound effects.
 * 100% self-contained, no external mp3 dependencies, zero broken links.
 */

class SoundSystem {
  private audioCtx: AudioContext | null = null;
  private bgmGainNode: GainNode | null = null;
  private sfxGainNode: GainNode | null = null;
  private isBgmPlaying = false;
  private isBgmUserMuted = false;
  private isSfxMuted = false;
  private bgmTimeoutId: number | null = null;
  private currentNoteIndex = 0;

  // Gentle, cheerful pentatonic marimba / music box melody notes (C major / G major)
  private readonly melodyFrequencies = [
    261.63, // C4
    293.66, // D4
    329.63, // E4
    392.00, // G4
    440.00, // A4
    523.25, // C5
    440.00, // A4
    392.00, // G4
    329.63, // E4
    392.00, // G4
    440.00, // A4
    523.25, // C5
    587.33, // D5
    523.25, // C5
    440.00, // A4
    392.00, // G4
  ];

  private readonly chordRootFrequencies = [
    130.81, // C3
    174.61, // F3
    196.00, // G3
    130.81, // C3
  ];

  private initAudio() {
    if (!this.audioCtx) {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.audioCtx = new AudioContextClass();

      // Master BGM gain
      this.bgmGainNode = this.audioCtx.createGain();
      this.bgmGainNode.gain.value = 0.18;
      this.bgmGainNode.connect(this.audioCtx.destination);

      // SFX gain
      this.sfxGainNode = this.audioCtx.createGain();
      this.sfxGainNode.gain.value = 0.35;
      this.sfxGainNode.connect(this.audioCtx.destination);
    }

    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  public startBGM() {
    if (this.isBgmPlaying || this.isBgmUserMuted) return;
    this.initAudio();
    if (!this.audioCtx) return;

    this.isBgmPlaying = true;
    this.scheduleNextBgmStep();
  }

  public stopBGM() {
    this.isBgmPlaying = false;
    if (this.bgmTimeoutId !== null) {
      window.clearTimeout(this.bgmTimeoutId);
      this.bgmTimeoutId = null;
    }
  }

  public toggleBGM(): boolean {
    this.isBgmUserMuted = !this.isBgmUserMuted;
    if (this.isBgmUserMuted) {
      this.stopBGM();
      return false;
    } else {
      this.startBGM();
      return true;
    }
  }

  public getBgmStatus() {
    return !this.isBgmUserMuted && this.isBgmPlaying;
  }

  public toggleSFX(): boolean {
    this.isSfxMuted = !this.isSfxMuted;
    return !this.isSfxMuted;
  }

  public getSfxStatus() {
    return !this.isSfxMuted;
  }

  private scheduleNextBgmStep() {
    if (!this.isBgmPlaying || !this.audioCtx || !this.bgmGainNode) return;

    const ctx = this.audioCtx;
    const now = ctx.currentTime;
    const noteFreq = this.melodyFrequencies[this.currentNoteIndex % this.melodyFrequencies.length];
    const chordIndex = Math.floor(this.currentNoteIndex / 4) % this.chordRootFrequencies.length;
    const bassFreq = this.chordRootFrequencies[chordIndex];

    // Marimba/Chime tone for melody
    const osc = ctx.createOscillator();
    const noteGain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(noteFreq, now);

    // Envelope: quick attack, pleasant warm decay
    noteGain.gain.setValueAtTime(0.001, now);
    noteGain.gain.linearRampToValueAtTime(0.12, now + 0.03);
    noteGain.gain.exponentialRampToValueAtTime(0.001, now + 0.38);

    osc.connect(noteGain);
    noteGain.connect(this.bgmGainNode);

    osc.start(now);
    osc.stop(now + 0.4);

    // Every 4th beat play soft warm bass root note
    if (this.currentNoteIndex % 4 === 0) {
      const bassOsc = ctx.createOscillator();
      const bassGain = ctx.createGain();
      bassOsc.type = 'sine';
      bassOsc.frequency.setValueAtTime(bassFreq, now);
      bassGain.gain.setValueAtTime(0.08, now);
      bassGain.gain.exponentialRampToValueAtTime(0.001, now + 0.8);
      bassOsc.connect(bassGain);
      bassGain.connect(this.bgmGainNode);
      bassOsc.start(now);
      bassOsc.stop(now + 0.85);
    }

    this.currentNoteIndex++;

    // Tempo: ~140 bpm, eighth notes = ~220ms
    const stepIntervalMs = 260;
    this.bgmTimeoutId = window.setTimeout(() => {
      this.scheduleNextBgmStep();
    }, stepIntervalMs);
  }

  // Cute bubble pop when item moves or appears
  public playPop() {
    if (this.isSfxMuted) return;
    this.initAudio();
    if (!this.audioCtx || !this.sfxGainNode) return;

    const ctx = this.audioCtx;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(450, now);
    osc.frequency.exponentialRampToValueAtTime(880, now + 0.08);

    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);

    osc.connect(gain);
    gain.connect(this.sfxGainNode);

    osc.start(now);
    osc.stop(now + 0.11);
  }

  // Joyful bell chime when student spots and clicks the item
  public playSuccessClick() {
    if (this.isSfxMuted) return;
    this.initAudio();
    if (!this.audioCtx || !this.sfxGainNode) return;

    const ctx = this.audioCtx;
    const now = ctx.currentTime;
    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6 arpeggio

    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const noteTime = now + idx * 0.06;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, noteTime);

      gain.gain.setValueAtTime(0.001, noteTime);
      gain.gain.linearRampToValueAtTime(0.22, noteTime + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, noteTime + 0.35);

      osc.connect(gain);
      gain.connect(this.sfxGainNode!);

      osc.start(noteTime);
      osc.stop(noteTime + 0.38);
    });
  }

  // Sparkle chime when student reads along correctly
  public playStarChime() {
    if (this.isSfxMuted) return;
    this.initAudio();
    if (!this.audioCtx || !this.sfxGainNode) return;

    const ctx = this.audioCtx;
    const now = ctx.currentTime;
    const notes = [587.33, 739.99, 880.0, 1174.66]; // D5, F#5, A5, D6

    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const t = now + idx * 0.08;

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, t);

      gain.gain.setValueAtTime(0.01, t);
      gain.gain.linearRampToValueAtTime(0.25, t + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.45);

      osc.connect(gain);
      gain.connect(this.sfxGainNode!);

      osc.start(t);
      osc.stop(t + 0.48);
    });
  }

  // Triumphant game over or high score fanfare
  public playFanfare() {
    if (this.isSfxMuted) return;
    this.initAudio();
    if (!this.audioCtx || !this.sfxGainNode) return;

    const ctx = this.audioCtx;
    const now = ctx.currentTime;
    const chords = [
      { notes: [523.25, 659.25, 783.99], time: 0, dur: 0.2 },
      { notes: [587.33, 698.46, 880.00], time: 0.22, dur: 0.2 },
      { notes: [659.25, 783.99, 1046.50], time: 0.44, dur: 0.55 },
    ];

    chords.forEach(({ notes, time, dur }) => {
      notes.forEach((freq) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const t = now + time;

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, t);

        gain.gain.setValueAtTime(0.01, t);
        gain.gain.linearRampToValueAtTime(0.18, t + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.001, t + dur);

        osc.connect(gain);
        gain.connect(this.sfxGainNode!);

        osc.start(t);
        osc.stop(t + dur + 0.05);
      });
    });
  }
}

export const soundManager = new SoundSystem();
