import { useRef, useEffect, useState } from 'react';
import { Stage, Layer, Line, Circle, Group } from 'react-konva';
import { useCanvasStore } from '../../stores/canvasStore';
import { useUserStore } from '../../stores/userStore';
import { Stroke, Point, ToolType } from '../../types';
import { v4 as uuidv4 } from 'uuid';
import { getStrokePoints, createSprayPoints, isPointNearStroke } from '../../utils/canvas';

interface CanvasProps {
  width: number;
  height: number;
  isLocked?: boolean;
  onStrokeComplete?: (stroke: Stroke) => void;
}

export const Canvas: React.FC<CanvasProps> = ({
  width,
  height,
  isLocked = false,
  onStrokeComplete,
}) => {
  const stageRef = useRef<any>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentPoints, setCurrentPoints] = useState<Point[]>([]);

  const {
    strokes,
    currentTool,
    currentColor,
    currentSize,
    currentOpacity,
    addStroke,
    removeStroke,
  } = useCanvasStore();

  const { currentUser } = useUserStore();

  const getPointerPosition = (): Point | null => {
    const stage = stageRef.current;
    if (!stage) return null;

    const pointerPos = stage.getPointerPosition();
    if (!pointerPos) return null;

    return {
      x: pointerPos.x,
      y: pointerPos.y,
      pressure: 0.5,
    };
  };

  const handleMouseDown = () => {
    if (isLocked) return;

    const pos = getPointerPosition();
    if (!pos) return;

    setIsDrawing(true);
    setCurrentPoints([pos]);
  };

  const handleMouseMove = () => {
    if (!isDrawing || isLocked) return;

    const pos = getPointerPosition();
    if (!pos) return;

    if (currentTool === 'spray') {
      const sprayPoints = createSprayPoints(pos.x, pos.y, currentSize * 2, currentSize);
      setCurrentPoints([...currentPoints, ...sprayPoints]);
    } else {
      setCurrentPoints([...currentPoints, pos]);
    }
  };

  const handleMouseUp = () => {
    if (!isDrawing || isLocked) return;

    setIsDrawing(false);

    if (currentPoints.length === 0) return;

    if (currentTool === 'eraser') {
      handleErase();
      setCurrentPoints([]);
      return;
    }

    const smoothedPoints =
      currentTool === 'brush' || currentTool === 'marker'
        ? getStrokePoints(currentPoints, currentTool)
        : currentPoints;

    const stroke: Stroke = {
      id: uuidv4(),
      userId: currentUser?.id || 'anonymous',
      tool: currentTool,
      color: currentColor,
      size: currentSize,
      opacity: currentOpacity,
      points: smoothedPoints,
      createdAt: Date.now(),
    };

    addStroke(stroke);
    onStrokeComplete?.(stroke);
    setCurrentPoints([]);
  };

  const handleErase = () => {
    const eraserThreshold = currentSize;

    strokes.forEach((stroke) => {
      // 只允许擦除自己创建的内容
      if (stroke.userId !== currentUser?.id) {
        return;
      }

      currentPoints.forEach((point) => {
        if (isPointNearStroke(point, stroke, eraserThreshold)) {
          removeStroke(stroke.id);
        }
      });
    });
  };

  const renderStroke = (stroke: Stroke, index: number) => {
    const points = stroke.points.flatMap((p) => [p.x, p.y]);

    if (stroke.tool === 'spray') {
      return (
        <Group key={stroke.id}>
          {stroke.points.map((point, i) => (
            <Circle
              key={`${stroke.id}-${i}`}
              x={point.x}
              y={point.y}
              radius={stroke.size * (point.pressure || 0.5) * 0.3}
              fill={stroke.color}
              opacity={stroke.opacity * (point.pressure || 0.5)}
            />
          ))}
        </Group>
      );
    }

    return (
      <Line
        key={stroke.id}
        points={points}
        stroke={stroke.color}
        strokeWidth={stroke.size}
        opacity={stroke.opacity}
        tension={0.5}
        lineCap="round"
        lineJoin="round"
        globalCompositeOperation={
          stroke.tool === 'eraser' ? 'destination-out' : 'source-over'
        }
      />
    );
  };

  const renderCurrentStroke = () => {
    if (currentPoints.length === 0) return null;

    if (currentTool === 'spray') {
      return (
        <Group>
          {currentPoints.map((point, i) => (
            <Circle
              key={`current-${i}`}
              x={point.x}
              y={point.y}
              radius={currentSize * 0.3}
              fill={currentColor}
              opacity={currentOpacity * 0.5}
            />
          ))}
        </Group>
      );
    }

    const points = currentPoints.flatMap((p) => [p.x, p.y]);

    return (
      <Line
        points={points}
        stroke={currentTool === 'eraser' ? '#000000' : currentColor}
        strokeWidth={currentTool === 'eraser' ? currentSize * 2 : currentSize}
        opacity={currentTool === 'eraser' ? 0.3 : currentOpacity}
        tension={0.5}
        lineCap="round"
        lineJoin="round"
      />
    );
  };

  useEffect(() => {
    const preventDefault = (e: TouchEvent) => {
      if (isDrawing) {
        e.preventDefault();
      }
    };

    document.addEventListener('touchmove', preventDefault, { passive: false });
    return () => {
      document.removeEventListener('touchmove', preventDefault);
    };
  }, [isDrawing]);

  return (
    <Stage
      ref={stageRef}
      width={width}
      height={height}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onTouchStart={handleMouseDown}
      onTouchMove={handleMouseMove}
      onTouchEnd={handleMouseUp}
      style={{ touchAction: 'none', backgroundColor: '#ffffff' }}
    >
      <Layer>
        {strokes.map((stroke, index) => renderStroke(stroke, index))}
        {renderCurrentStroke()}
      </Layer>
    </Stage>
  );
};
