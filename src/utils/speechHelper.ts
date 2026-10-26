/**
 * Web Speech API helper for child-friendly pronunciation and interactive read-along.
 */

// Available speech recognition interface
interface SpeechRecognitionErrorEvent extends Event {
  error: string;
  message?: string;
}

interface SpeechRecognitionResultItem {
  transcript: string;
  confidence: number;
}

interface SpeechRecognitionEventLike extends Event {
  results: {
    [index: number]: {
      [index: number]: SpeechRecognitionResultItem;
      length: number;
    };
    length: number;
  };
}

interface SpeechRecognitionInstance {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onresult: ((event: SpeechRecognitionEventLike) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
  onend: (() => void) | null;
}

type SpeechRecognitionConstructor = new () => SpeechRecognitionInstance;

declare global {
  interface Window {
    SpeechRecognition?: SpeechRecognitionConstructor;
    webkitSpeechRecognition?: SpeechRecognitionConstructor;
  }
}

export function speakEnglish(
  text: string,
  rate = 0.88,
  onStart?: () => void,
  onEnd?: () => void
) {
  if (!('speechSynthesis' in window)) {
    console.warn('Speech synthesis not supported in this browser.');
    onEnd?.();
    return;
  }

  // Cancel any ongoing speech
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'en-US';
  utterance.rate = rate; // Gentle, clear speed for young learners
  utterance.pitch = 1.05; // Slightly cheerful, friendly pitch

  // Pick high quality English voice if available
  const voices = window.speechSynthesis.getVoices();
  const englishVoice = voices.find(
    (v) => (v.lang.startsWith('en') && (v.name.includes('Google') || v.name.includes('Natural') || v.name.includes('Samantha') || v.name.includes('David') || v.name.includes('English')))
  ) || voices.find((v) => v.lang.startsWith('en'));

  if (englishVoice) {
    utterance.voice = englishVoice;
  }

  if (onStart) utterance.onstart = onStart;
  if (onEnd) utterance.onend = onEnd;
  utterance.onerror = () => onEnd?.();

  window.speechSynthesis.speak(utterance);
}

export function isSpeechRecognitionSupported(): boolean {
  return typeof window !== 'undefined' && !!(window.SpeechRecognition || window.webkitSpeechRecognition);
}

export interface SpeechEvaluationResult {
  transcript: string;
  score: number; // 0 to 100
  stars: 1 | 2 | 3;
  feedbackText: string;
  matchedKeywords: string[];
}

export function createSpeechRecognizer(
  targetSentence: string,
  onResult: (res: SpeechEvaluationResult) => void,
  onError: (err: string) => void,
  onEnd: () => void
): { start: () => void; stop: () => void } | null {
  const SpeechConstructor = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechConstructor) {
    return null;
  }

  try {
    const recognition = new SpeechConstructor();
    recognition.lang = 'en-US';
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onresult = (event: SpeechRecognitionEventLike) => {
      const transcript = event.results[0]?.[0]?.transcript?.trim() || '';
      const normalizedSpoken = transcript.toLowerCase().replace(/[^a-z0-9 ]/g, '');
      const normalizedTarget = targetSentence.toLowerCase().replace(/[^a-z0-9 ]/g, '');

      // Check key vocabulary words
      const keywords = ['costume', 'film', 'second', 'third', 'floor'];
      const targetKeywords = keywords.filter((kw) => normalizedTarget.includes(kw));
      const matchedKeywords = targetKeywords.filter((kw) => normalizedSpoken.includes(kw));

      // Calculate confidence & match
      let score = 50;
      if (targetKeywords.length > 0) {
        const keywordRatio = matchedKeywords.length / targetKeywords.length;
        score = Math.round(keywordRatio * 80 + (normalizedSpoken.length > 3 ? 20 : 0));
      }

      let stars: 1 | 2 | 3 = 1;
      let feedbackText = 'Good try! Keep practicing!';

      if (score >= 80 || matchedKeywords.length === targetKeywords.length) {
        stars = 3;
        feedbackText = 'Super Star! Outstanding pronunciation! 🌟🌟🌟';
      } else if (score >= 45 || matchedKeywords.length >= 1) {
        stars = 2;
        feedbackText = 'Great job! Very close! 🌟🌟';
      } else {
        stars = 1;
        feedbackText = 'Nice try! Let’s listen and try once more! 🌟';
      }

      onResult({
        transcript,
        score,
        stars,
        feedbackText,
        matchedKeywords,
      });
    };

    recognition.onerror = (e: SpeechRecognitionErrorEvent) => {
      onError(e.error || 'Speech recognition error');
    };

    recognition.onend = () => {
      onEnd();
    };

    return {
      start: () => {
        try {
          recognition.start();
        } catch (e) {
          console.warn('Recognition start exception:', e);
        }
      },
      stop: () => {
        try {
          recognition.stop();
        } catch {
          // ignore
        }
      },
    };
  } catch (err) {
    console.error('Failed to initialize speech recognition', err);
    return null;
  }
}
