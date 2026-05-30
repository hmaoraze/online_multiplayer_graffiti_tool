import {
  Pen,
  PenTool,
  Highlighter,
  Brush,
  SprayCan,
  Eraser,
  Undo2,
  Redo2,
  Trash2,
} from 'lucide-react';
import { useCanvasStore } from '../../stores/canvasStore';

const tools = [
  { type: 'pencil' as const, icon: <Pen className="w-5 h-5" />, label: '铅笔' },
  { type: 'marker' as const, icon: <PenTool className="w-5 h-5" />, label: '马克笔' },
  { type: 'highlighter' as const, icon: <Highlighter className="w-5 h-5" />, label: '荧光笔' },
  { type: 'brush' as const, icon: <Brush className="w-5 h-5" />, label: '毛笔' },
  { type: 'spray' as const, icon: <SprayCan className="w-5 h-5" />, label: '喷漆' },
  { type: 'eraser' as const, icon: <Eraser className="w-5 h-5" />, label: '橡皮擦' },
];

export const Toolbar: React.FC = () => {
  const {
    currentTool,
    setTool,
    currentSize,
    setSize,
    undo,
    redo,
    clearCanvas,
  } = useCanvasStore();

  return (
    <div className="flex flex-col items-center gap-1 p-2 glass-panel rounded-xl shadow-lg">
      <div className="flex flex-col gap-1">
        {tools.map((tool) => (
          <button
            key={tool.type}
            onClick={() => setTool(tool.type)}
            className={`p-3 rounded-lg transition-all ${
              currentTool === tool.type
                ? 'bg-slate-900 text-white shadow-md'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
            title={tool.label}
          >
            {tool.icon}
          </button>
        ))}
      </div>

      <div className="w-full h-px bg-slate-200 my-1"></div>

      <div className="w-12 flex flex-col items-center p-2">
        <div className="text-xs text-slate-500 mb-2">粗细</div>
        <input
          type="range"
          min="1"
          max="50"
          value={currentSize}
          onChange={(e) => setSize(Number(e.target.value))}
          className="w-20 -rotate-90 origin-center"
        />
      </div>

      <div className="w-full h-px bg-slate-200 my-1"></div>

      <div className="flex flex-col gap-1">
        <button
          onClick={undo}
          className="p-3 rounded-lg text-slate-600 hover:bg-slate-100 transition-all"
          title="撤销"
        >
          <Undo2 className="w-5 h-5" />
        </button>
        <button
          onClick={redo}
          className="p-3 rounded-lg text-slate-600 hover:bg-slate-100 transition-all"
          title="重做"
        >
          <Redo2 className="w-5 h-5" />
        </button>
        <button
          onClick={clearCanvas}
          className="p-3 rounded-lg text-red-500 hover:bg-red-50 transition-all"
          title="清空画布"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
