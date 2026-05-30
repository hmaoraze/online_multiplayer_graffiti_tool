export type ToolType = 'pencil' | 'marker' | 'highlighter' | 'brush' | 'spray' | 'eraser';

export type AccessType = 'public' | 'password' | 'invite';

export type TemplateType = 'graduation' | 'uniform' | 'blank' | 'wedding' | 'party';

export interface Point {
  x: number;
  y: number;
  pressure?: number;
  tiltX?: number;
  tiltY?: number;
}

export interface Stroke {
  id: string;
  userId: string;
  tool: ToolType;
  color: string;
  size: number;
  opacity: number;
  points: Point[];
  createdAt: number;
}

export interface Sticker {
  id: string;
  type: string;
  x: number;
  y: number;
  scale: number;
  rotation: number;
}

export interface User {
  id: string;
  name: string;
  avatar?: string;
  isAnonymous: boolean;
  cursorColor: string;
  cursorPosition?: Point;
}

export interface Room {
  id: string;
  name: string;
  template: TemplateType;
  backgroundUrl?: string;
  isLocked: boolean;
  accessType: AccessType;
  password?: string;
  maxParticipants: number;
  createdAt: number;
  expiresAt?: number;
}

export interface CanvasState {
  strokes: Stroke[];
  stickers: Sticker[];
  background: string;
  viewPosition: { x: number; y: number };
  zoom: number;
}

export interface ToolState {
  currentTool: ToolType;
  currentColor: string;
  currentSize: number;
  currentOpacity: number;
}

export const CURSOR_COLORS = [
  '#FF6B6B',
  '#4ECDC4',
  '#FFD93D',
  '#6BCB77',
  '#4D96FF',
  '#FF6B9D',
  '#C9B1FF',
  '#FF8C42',
];

export const STICKERS = [
  'heart',
  'star',
  'graduation-cap',
  'confetti',
  'balloon',
  'gift',
  'flower',
  'rainbow',
];

export const DEFAULT_COLORS = [
  '#000000',
  '#333333',
  '#666666',
  '#999999',
  '#CCCCCC',
  '#FFFFFF',
  '#E74C3C',
  '#E67E22',
  '#F39C12',
  '#F1C40F',
  '#2ECC71',
  '#27AE60',
  '#1ABC9C',
  '#16A085',
  '#3498DB',
  '#2980B9',
  '#9B59B6',
  '#8E44AD',
  '#E91E63',
  '#C0392B',
];

export const TOOL_SIZES = {
  pencil: { min: 1, max: 10, default: 3 },
  marker: { min: 5, max: 30, default: 15 },
  highlighter: { min: 10, max: 50, default: 30 },
  brush: { min: 10, max: 50, default: 20 },
  spray: { min: 20, max: 60, default: 40 },
  eraser: { min: 10, max: 100, default: 30 },
};

export const TOOL_OPACITY = {
  pencil: 1,
  marker: 0.8,
  highlighter: 0.4,
  brush: 0.9,
  spray: 0.6,
  eraser: 1,
};
