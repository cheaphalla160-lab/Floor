export type TargetItemType = 'costume' | 'film';
export type FloorLevel = 'second_floor' | 'third_floor';

export interface HidingSpot {
  id: string;
  name: string;
  chineseName: string;
  floor: FloorLevel;
  x: number; // percentage from left
  y: number; // percentage from top
  roomName: string;
  description: string;
}

export interface ActiveTarget {
  id: string;
  type: TargetItemType;
  spot: HidingSpot;
  spawnTime: number;
  duration: number; // in milliseconds
  isFound: boolean;
}

export interface SentenceRecord {
  english: string;
  chinese: string;
  targetItem: TargetItemType;
  targetFloor: FloorLevel;
  itemWord: string;
  floorWord: string;
}

export interface LeaderboardEntry {
  id: string;
  studentName: string;
  groupName?: string;
  score: number;
  itemsFound: number;
  starsEarned: number;
  accuracy: number;
  date: string;
}

export type GameSpeed = 'slow' | 'normal' | 'fast' | 'custom';
export type GameMode = 'timed_60' | 'timed_90' | 'free_play';
export type AppView = 'game' | 'flashcards' | 'leaderboard';
