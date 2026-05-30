import { useState } from 'react';
import { useCanvasStore } from '../../stores/canvasStore';
import { DEFAULT_COLORS } from '../../types';

export const ColorPicker: React.FC = () => {
  const { currentColor, setColor } = useCanvasStore();
  const [showCustomColor, setShowCustomColor] = useState(false);

  return (
    <div className="glass-panel rounded-xl shadow-xl p-4 w-64">
      <div className="grid grid-cols-5 gap-2 mb-4">
        {DEFAULT_COLORS.map((color) => (
          <button
            key={color}
            onClick={() => setColor(color)}
            className={`w-10 h-10 rounded-lg transition-all ${
              currentColor === color
                ? 'ring-2 ring-offset-1 ring-slate-700'
                : 'hover:scale-110'
            }`}
            style={{ backgroundColor: color }}
            title={color}
          ></button>
        ))}
      </div>

      <div className="border-t border-slate-200 pt-3">
        <button
          onClick={() => setShowCustomColor(!showCustomColor)}
          className="w-full py-2 text-xs font-medium text-slate-600 hover:text-slate-900 transition-colors"
        >
          {showCustomColor ? '隐藏自定义颜色' : '自定义颜色'}
        </button>

        {showCustomColor && (
          <div className="mt-3 space-y-3">
            <input
              type="color"
              value={currentColor}
              onChange={(e) => setColor(e.target.value)}
              className="w-full h-12 rounded-lg cursor-pointer border border-slate-200"
            />
            <div>
              <input
                type="text"
                value={currentColor}
                onChange={(e) => setColor(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg font-mono text-slate-700 outline-none focus:border-slate-400 transition-colors"
                placeholder="#000000"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
