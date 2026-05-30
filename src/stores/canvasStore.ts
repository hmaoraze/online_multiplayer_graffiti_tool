import { create } from 'zustand';
import {
  Stroke,
  Sticker,
  ToolType,
  ToolState,
  TOOL_OPACITY,
  TOOL_SIZES,
} from '../types';

interface CanvasStore extends ToolState {
  strokes: Stroke[];
  stickers: Sticker[];
  undoStack: Stroke[][];
  redoStack: Stroke[][];
  background: string;
  viewPosition: { x: number; y: number };
  zoom: number;

  setTool: (tool: ToolType) => void;
  setColor: (color: string) => void;
  setSize: (size: number) => void;
  addStroke: (stroke: Stroke) => void;
  removeStroke: (strokeId: string) => void;
  addSticker: (sticker: Sticker) => void;
  removeSticker: (stickerId: string) => void;
  setStickers: (stickers: Sticker[]) => void;
  setStrokes: (strokes: Stroke[]) => void;
  setBackground: (background: string) => void;
  undo: () => void;
  redo: () => void;
  clearCanvas: () => void;
  setZoom: (zoom: number) => void;
  setViewPosition: (position: { x: number; y: number }) => void;
  resetTool: () => void;
}

export const useCanvasStore = create<CanvasStore>((set, get) => ({
  currentTool: 'marker',
  currentColor: '#000000',
  currentSize: 15,
  currentOpacity: TOOL_OPACITY.marker,
  strokes: [],
  stickers: [],
  undoStack: [],
  redoStack: [],
  background: '',
  viewPosition: { x: 0, y: 0 },
  zoom: 1,

  setTool: (tool) => {
    const size = TOOL_SIZES[tool].default;
    const opacity = TOOL_OPACITY[tool];
    set({
      currentTool: tool,
      currentSize: size,
      currentOpacity: opacity,
    });
  },

  setColor: (color) => set({ currentColor: color }),

  setSize: (size) => {
    const { currentTool } = get();
    const minSize = TOOL_SIZES[currentTool].min;
    const maxSize = TOOL_SIZES[currentTool].max;
    const clampedSize = Math.max(minSize, Math.min(maxSize, size));
    set({ currentSize: clampedSize });
  },

  addStroke: (stroke) =>
    set((state) => ({
      strokes: [...state.strokes, stroke],
      undoStack: [...state.undoStack, state.strokes],
      redoStack: [],
    })),

  removeStroke: (strokeId) =>
    set((state) => ({
      strokes: state.strokes.filter((s) => s.id !== strokeId),
    })),

  addSticker: (sticker) =>
    set((state) => ({
      stickers: [...state.stickers, sticker],
    })),

  removeSticker: (stickerId) =>
    set((state) => ({
      stickers: state.stickers.filter((s) => s.id !== stickerId),
    })),

  setStickers: (stickers) => set({ stickers }),

  setStrokes: (strokes) => set({ strokes }),

  setBackground: (background) => set({ background }),

  undo: () => {
    const { undoStack, strokes } = get();
    if (undoStack.length > 0) {
      const previousState = undoStack[undoStack.length - 1];
      set({
        strokes: previousState,
        undoStack: undoStack.slice(0, -1),
        redoStack: [...get().redoStack, strokes],
      });
    }
  },

  redo: () => {
    const { redoStack, strokes } = get();
    if (redoStack.length > 0) {
      const nextState = redoStack[redoStack.length - 1];
      set({
        strokes: nextState,
        redoStack: redoStack.slice(0, -1),
        undoStack: [...get().undoStack, strokes],
      });
    }
  },

  clearCanvas: () =>
    set((state) => ({
      strokes: [],
      stickers: [],
      undoStack: [...state.undoStack, state.strokes],
      redoStack: [],
    })),

  setZoom: (zoom) => set({ zoom: Math.max(0.1, Math.min(3, zoom)) }),

  setViewPosition: (position) => set({ viewPosition: position }),

  resetTool: () =>
    set({
      currentTool: 'marker',
      currentColor: '#000000',
      currentSize: TOOL_SIZES.marker.default,
      currentOpacity: TOOL_OPACITY.marker,
    }),
}));
