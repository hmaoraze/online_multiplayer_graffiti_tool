import { useCallback } from 'react';
import { useCanvasStore } from '../stores/canvasStore';
import { ToolType, TOOL_SIZES, TOOL_OPACITY } from '../types';

export const useTools = () => {
  const {
    currentTool,
    currentColor,
    currentSize,
    currentOpacity,
    setTool,
    setColor,
    setSize,
    undo,
    redo,
    clearCanvas,
    resetTool,
  } = useCanvasStore();

  const selectTool = useCallback(
    (tool: ToolType) => {
      setTool(tool);
    },
    [setTool]
  );

  const selectColor = useCallback(
    (color: string) => {
      setColor(color);
    },
    [setColor]
  );

  const adjustSize = useCallback(
    (size: number) => {
      setSize(size);
    },
    [setSize]
  );

  const increaseSize = useCallback(() => {
    const config = TOOL_SIZES[currentTool];
    const newSize = Math.min(currentSize + 2, config.max);
    setSize(newSize);
  }, [currentTool, currentSize, setSize]);

  const decreaseSize = useCallback(() => {
    const config = TOOL_SIZES[currentTool];
    const newSize = Math.max(currentSize - 2, config.min);
    setSize(newSize);
  }, [currentTool, currentSize, setSize]);

  const undoLastAction = useCallback(() => {
    undo();
  }, [undo]);

  const redoLastAction = useCallback(() => {
    redo();
  }, [redo]);

  const clearAll = useCallback(() => {
    clearCanvas();
  }, [clearCanvas]);

  const reset = useCallback(() => {
    resetTool();
  }, [resetTool]);

  return {
    currentTool,
    currentColor,
    currentSize,
    currentOpacity,
    selectTool,
    selectColor,
    adjustSize,
    increaseSize,
    decreaseSize,
    undoLastAction,
    redoLastAction,
    clearAll,
    reset,
    sizeConfig: TOOL_SIZES[currentTool],
  };
};
