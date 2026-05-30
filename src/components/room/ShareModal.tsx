import { useState } from 'react';
import { X, Copy, Link2, QrCode } from 'lucide-react';

interface ShareModalProps {
  roomId: string;
  roomName: string;
  onClose: () => void;
}

export const ShareModal: React.FC<ShareModalProps> = ({
  roomId,
  roomName,
  onClose,
}) => {
  const [copied, setCopied] = useState(false);

  const shareUrl = `${window.location.origin}/room/${roomId}`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('复制失败:', err);
    }
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
          <h2 className="text-2xl font-semibold text-slate-900 mb-2">分享画板</h2>
          <p className="text-slate-500 text-sm">
            邀请其他人参与 {roomName}
          </p>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              分享链接
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={shareUrl}
                readOnly
                className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 font-mono"
              />
              <button
                onClick={handleCopyLink}
                className={`px-4 py-3 rounded-lg font-medium text-sm transition-all ${
                  copied
                    ? 'bg-emerald-500 text-white'
                    : 'bg-slate-900 text-white hover:bg-slate-800'
                }`}
              >
                {copied ? '已复制！' : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200"></div>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-2 bg-white text-slate-400">或者</span>
            </div>
          </div>

          <div className="bg-slate-50 rounded-xl p-6 text-center">
            <QrCode className="w-16 h-16 mx-auto mb-3 text-slate-400" />
            <p className="text-sm text-slate-500">
              扫描二维码加入
            </p>
            <p className="text-xs text-slate-400 mt-1 font-mono">
              房间 ID: {roomId}
            </p>
          </div>

          {navigator.share && (
            <button
              onClick={() => {
                navigator.share({
                  title: roomName,
                  text: `加入我的协作画板: ${roomName}`,
                  url: shareUrl,
                });
              }}
              className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors flex items-center justify-center gap-2 text-sm font-medium"
            >
              <Link2 className="w-4 h-4" />
              系统分享
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
