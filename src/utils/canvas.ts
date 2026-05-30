import { Point, Stroke, ToolType } from '../types';

export const getStrokePoints = (
  points: Point[],
  tool: ToolType
): Point[] => {
  if (points.length < 2) return points;

  const smoothedPoints: Point[] = [points[0]];

  for (let i = 1; i < points.length - 1; i++) {
    const prev = points[i - 1];
    const curr = points[i];
    const next = points[i + 1];

    const smoothedX = (prev.x + curr.x * 2 + next.x) / 4;
    const smoothedY = (prev.y + curr.y * 2 + next.y) / 4;

    smoothedPoints.push({
      x: smoothedX,
      y: smoothedY,
      pressure: curr.pressure,
    });
  }

  smoothedPoints.push(points[points.length - 1]);
  return smoothedPoints;
};

export const simplifyStroke = (points: Point[], tolerance: number = 2): Point[] => {
  if (points.length <= 2) return points;

  const simplified: Point[] = [points[0]];
  let lastAdded = points[0];

  for (let i = 1; i < points.length; i++) {
    const dx = points[i].x - lastAdded.x;
    const dy = points[i].y - lastAdded.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance >= tolerance) {
      simplified.push(points[i]);
      lastAdded = points[i];
    }
  }

  if (simplified[simplified.length - 1] !== points[points.length - 1]) {
    simplified.push(points[points.length - 1]);
  }

  return simplified;
};

export const strokeToSvgPath = (stroke: Stroke): string => {
  const points = stroke.points;
  if (points.length === 0) return '';
  if (points.length === 1) {
    return `M ${points[0].x} ${points[0].y} L ${points[0].x} ${points[0].y}`;
  }

  let path = `M ${points[0].x} ${points[0].y}`;

  if (points.length === 2) {
    path += ` L ${points[1].x} ${points[1].y}`;
    return path;
  }

  for (let i = 1; i < points.length - 1; i++) {
    const xc = (points[i].x + points[i + 1].x) / 2;
    const yc = (points[i].y + points[i + 1].y) / 2;
    path += ` Q ${points[i].x} ${points[i].y} ${xc} ${yc}`;
  }

  const last = points[points.length - 1];
  path += ` L ${last.x} ${last.y}`;

  return path;
};

export const createSprayPoints = (
  x: number,
  y: number,
  density: number,
  spread: number
): Point[] => {
  const points: Point[] = [];
  for (let i = 0; i < density; i++) {
    const angle = Math.random() * Math.PI * 2;
    const distance = Math.random() * spread;
    points.push({
      x: x + Math.cos(angle) * distance,
      y: y + Math.sin(angle) * distance,
      pressure: Math.random(),
    });
  }
  return points;
};

export const isPointNearStroke = (
  point: Point,
  stroke: Stroke,
  threshold: number
): boolean => {
  for (const strokePoint of stroke.points) {
    const dx = point.x - strokePoint.x;
    const dy = point.y - strokePoint.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    if (distance <= threshold + stroke.size / 2) {
      return true;
    }
  }
  return false;
};

export const calculateBoundingBox = (
  strokes: Stroke[]
): { x: number; y: number; width: number; height: number } => {
  if (strokes.length === 0) {
    return { x: 0, y: 0, width: 0, height: 0 };
  }

  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;

  strokes.forEach((stroke) => {
    stroke.points.forEach((point) => {
      minX = Math.min(minX, point.x - stroke.size);
      minY = Math.min(minY, point.y - stroke.size);
      maxX = Math.max(maxX, point.x + stroke.size);
      maxY = Math.max(maxY, point.y + stroke.size);
    });
  });

  return {
    x: minX,
    y: minY,
    width: maxX - minX,
    height: maxY - minY,
  };
};
