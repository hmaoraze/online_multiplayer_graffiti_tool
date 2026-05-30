import { useCallback, useRef } from 'react';
import { useCanvasStore } from '../stores/canvasStore';
import { useUserStore } from '../stores/userStore';
import { Point, Stroke } from '../types';
import { v4 as uuidv4 } from 'uuid';
import { getStrokePoints } from '../utils/canvas';

export const useCanvas = () => {
  const {
    currentTool,
    currentColor,
    currentSize,
    currentOpacity,
    addStroke: addStrokeToStore,
  } = useCanvasStore();

  const { currentUser } = useUserStore();
  const currentStrokeRef = useRef<Stroke | null>(null);

  const startDrawing = useCallback((point: Point) => {
    if (!currentUser) return;

    const stroke: Stroke = {
      id: uuidv4(),
      userId: currentUser.id,
      tool: currentTool,
      color: currentColor,
      size: currentSize,
      opacity: currentOpacity,
      points: [point],
      createdAt: Date.now(),
    };

    currentStrokeRef.current = stroke;
  }, [currentUser, currentTool, currentColor, currentSize, currentOpacity]);

  const continueDrawing = useCallback((point: Point) => {
    if (!currentStrokeRef.current) return;

    currentStrokeRef.current.points.push(point);
  }, []);

  const finishDrawing = useCallback(() => {
    if (!currentStrokeRef.current || currentStrokeRef.current.points.length === 0) {
      currentStrokeRef.current = null;
      return null;
    }

    const stroke = { ...currentStrokeRef.current };

    if (stroke.tool === 'brush' || stroke.tool === 'marker') {
      stroke.points = getStrokePoints(stroke.points, stroke.tool);
    }

    addStrokeToStore(stroke);
    currentStrokeRef.current = null;

    return stroke;
  }, [addStrokeToStore]);

  const getCurrentStroke = useCallback(() => {
    return currentStrokeRef.current;
  }, []);

  return {
    startDrawing,
    continueDrawing,
    finishDrawing,
    getCurrentStroke,
  };
};
