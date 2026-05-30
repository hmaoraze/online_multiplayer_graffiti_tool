import { X, Download, Image as ImageIcon, FileText } from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

interface ExportModalProps {
  roomName: string;
  onClose: () => void;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  roomName,
  onClose,
}) => {
  const handleExportImage = async () => {
    const canvasContainer = document.querySelector('.bg-white.rounded-xl');
    if (!canvasContainer) return;

    const canvas = await html2canvas(canvasContainer as HTMLElement, {
      backgroundColor: '#ffffff',
      scale: 2,
    });

    const link = document.createElement('a');
    link.download = `${roomName}-${Date.now()}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  const handleExportPDF = async () => {
    const canvasContainer = document.querySelector('.bg-white.rounded-xl');
    if (!canvasContainer) return;

    const canvas = await html2canvas(canvasContainer as HTMLElement, {
      backgroundColor: '#ffffff',
      scale: 2,
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: canvas.width > canvas.height ? 'landscape' : 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const imgWidth = pdf.internal.pageSize.getWidth();
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
    pdf.save(`${roomName}-${Date.now()}.pdf`);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-slate-100 rounded-lg transition-colors"
        >
          <X className="w-5 h-5 text-slate-500" />
        </button>

        <div className="text-center mb-8">
          <h2 className="text-2xl font-semibold text-slate-900 mb-2">导出画板</h2>
          <p className="text-slate-500 text-sm">将当前画板导出为文件</p>
        </div>

        <div className="space-y-3">
          <button
            onClick={handleExportImage}
            className="w-full py-4 px-6 bg-slate-50 hover:bg-slate-100 rounded-xl transition-colors flex items-center gap-4"
          >
            <div className="w-12 h-12 rounded-xl bg-slate-900 flex items-center justify-center">
              <ImageIcon className="w-6 h-6 text-white" />
            </div>
            <div className="text-left flex-1">
              <h3 className="font-semibold text-slate-900">导出为图片</h3>
              <p className="text-sm text-slate-500">PNG 格式，高清画质</p>
            </div>
            <Download className="w-5 h-5 text-slate-400" />
          </button>

          <button
            onClick={handleExportPDF}
            className="w-full py-4 px-6 bg-slate-50 hover:bg-slate-100 rounded-xl transition-colors flex items-center gap-4"
          >
            <div className="w-12 h-12 rounded-xl bg-emerald-500 flex items-center justify-center">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <div className="text-left flex-1">
              <h3 className="font-semibold text-slate-900">导出为 PDF</h3>
              <p className="text-sm text-slate-500">PDF 格式，适合打印</p>
            </div>
            <Download className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        <div className="mt-6 pt-6 border-t border-slate-200">
          <button
            onClick={onClose}
            className="w-full py-3 bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition-colors font-medium"
          >
            取消
          </button>
        </div>
      </div>
    </div>
  );
};
