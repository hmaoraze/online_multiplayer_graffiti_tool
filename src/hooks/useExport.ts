import { useCallback } from 'react';
import { useCanvasStore } from '../stores/canvasStore';
import { useRoomStore } from '../stores/roomStore';
import {
  exportCanvasToImage,
  exportCanvasToPdf,
  downloadBlob,
  downloadSvg,
  getExportFilename,
  ExportFormat,
} from '../utils/export';
import { exportStrokesToSvg } from '../utils/export';
import { calculateBoundingBox } from '../utils/canvas';

export const useExport = () => {
  const { strokes, stickers } = useCanvasStore();
  const { currentRoom } = useRoomStore();

  const exportAsImage = useCallback(
    async (format: 'png' | 'jpg', container: HTMLElement) => {
      const blob = await exportCanvasToImage(container, {
        format,
        scale: 2,
        quality: 0.95,
        includeWatermark: true,
      });

      if (blob) {
        const filename = getExportFilename(
          currentRoom?.name || 'canvas',
          format
        );
        downloadBlob(blob, filename);
      }
    },
    [currentRoom]
  );

  const exportAsPdf = useCallback(
    async (container: HTMLElement) => {
      const blob = await exportCanvasToPdf(container, {
        format: 'pdf',
        scale: 2,
        quality: 0.95,
        includeWatermark: true,
      });

      if (blob) {
        const filename = getExportFilename(currentRoom?.name || 'canvas', 'pdf');
        downloadBlob(blob, filename);
      }
    },
    [currentRoom]
  );

  const exportAsSvg = useCallback(() => {
    const boundingBox = calculateBoundingBox(strokes);
    const width = Math.max(boundingBox.width + 100, 1200);
    const height = Math.max(boundingBox.height + 100, 800);

    const svgContent = exportStrokesToSvg(strokes, width, height);
    const filename = getExportFilename(currentRoom?.name || 'canvas', 'svg');
    downloadSvg(svgContent, filename);
  }, [strokes, currentRoom]);

  const exportAll = useCallback(
    async (format: ExportFormat, container: HTMLElement) => {
      switch (format) {
        case 'png':
        case 'jpg':
          await exportAsImage(format, container);
          break;
        case 'pdf':
          await exportAsPdf(container);
          break;
        case 'svg':
          exportAsSvg();
          break;
        default:
          console.error('Unsupported format:', format);
      }
    },
    [exportAsImage, exportAsPdf, exportAsSvg]
  );

  return {
    exportAsImage,
    exportAsPdf,
    exportAsSvg,
    exportAll,
  };
};
