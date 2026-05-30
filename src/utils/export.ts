import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { Stroke, Sticker } from '../types';
import { calculateBoundingBox } from './canvas';

export type ExportFormat = 'png' | 'jpg' | 'pdf' | 'svg';

export interface ExportOptions {
  format: ExportFormat;
  quality: number;
  scale: number;
  backgroundColor?: string;
  includeWatermark?: boolean;
}

export const exportCanvasToImage = async (
  element: HTMLElement,
  options: ExportOptions
): Promise<Blob | null> => {
  try {
    const canvas = await html2canvas(element, {
      scale: options.scale || 2,
      backgroundColor: options.backgroundColor || '#ffffff',
      logging: false,
      useCORS: true,
      allowTaint: true,
    });

    const mimeType = options.format === 'jpg' ? 'image/jpeg' : 'image/png';
    const quality = options.quality || 0.95;

    return new Promise((resolve) => {
      canvas.toBlob(
        (blob) => {
          if (options.includeWatermark && blob) {
            addWatermarkToCanvas(canvas).then((watermarkedBlob) => {
              resolve(watermarkedBlob);
            });
          } else {
            resolve(blob);
          }
        },
        mimeType,
        quality
      );
    });
  } catch (error) {
    console.error('Error exporting canvas:', error);
    return null;
  }
};

export const exportCanvasToPdf = async (
  element: HTMLElement,
  options: ExportOptions
): Promise<Blob | null> => {
  try {
    const canvas = await html2canvas(element, {
      scale: options.scale || 2,
      backgroundColor: '#ffffff',
      logging: false,
      useCORS: true,
      allowTaint: true,
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: canvas.width > canvas.height ? 'landscape' : 'portrait',
      unit: 'px',
      format: [canvas.width, canvas.height],
    });

    pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);

    if (options.includeWatermark) {
      pdf.setFontSize(12);
      pdf.setTextColor(150);
      pdf.text('Created with Doodle Sign', 10, pdf.internal.pageSize.height - 10);
    }

    return pdf.output('blob');
  } catch (error) {
    console.error('Error exporting to PDF:', error);
    return null;
  }
};

export const exportStrokesToSvg = (
  strokes: Stroke[],
  width: number,
  height: number
): string => {
  let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">`;

  strokes.forEach((stroke) => {
    if (stroke.points.length === 0) return;

    const pathData = stroke.points
      .map((point, i) => {
        if (i === 0) return `M ${point.x} ${point.y}`;
        return `L ${point.x} ${point.y}`;
      })
      .join(' ');

    svg += `<path
      d="${pathData}"
      stroke="${stroke.color}"
      stroke-width="${stroke.size}"
      stroke-linecap="round"
      stroke-linejoin="round"
      fill="none"
      opacity="${stroke.opacity}"
    />`;
  });

  svg += '</svg>';
  return svg;
};

export const downloadBlob = (blob: Blob, filename: string) => {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const downloadSvg = (svgContent: string, filename: string) => {
  const blob = new Blob([svgContent], { type: 'image/svg+xml' });
  downloadBlob(blob, filename);
};

const addWatermarkToCanvas = async (canvas: HTMLCanvasElement): Promise<Blob> => {
  return new Promise((resolve) => {
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      const emptyBlob = new Blob([''], { type: 'image/png' });
      resolve(emptyBlob);
      return;
    }

    ctx.save();
    ctx.font = '12px sans-serif';
    ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
    ctx.textAlign = 'right';
    ctx.fillText('Created with Doodle Sign', canvas.width - 10, canvas.height - 10);
    ctx.restore();

    canvas.toBlob((blob) => {
      resolve(blob as Blob);
    }, 'image/png');
  });
};

export const getExportFilename = (roomName: string, format: ExportFormat): string => {
  const timestamp = new Date().toISOString().split('T')[0];
  const sanitizedName = roomName.replace(/[^a-zA-Z0-9\u4e00-\u9fa5]/g, '_');
  return `${sanitizedName}_${timestamp}.${format}`;
};
