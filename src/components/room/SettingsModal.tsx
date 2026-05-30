import { X, Lock, Unlock, Users, Clock } from 'lucide-react';
import { Room } from '../../types';

interface SettingsModalProps {
  room: Room;
  onClose: () => void;
  onLockToggle: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  room,
  onClose,
  onLockToggle,
}) => {
  const getTimeRemaining = () => {
    if (!room.expiresAt) return '无限制';
    const now = Date.now();
    const diff = room.expiresAt - now;
    if (diff <= 0) return '已过期';

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

    if (days > 0) return `${days}天 ${hours}小时后过期`;
    if (hours > 0) return `${hours}小时后过期`;
    return '即将过期';
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
          <h2 className="text-2xl font-semibold text-slate-900 mb-2">设置</h2>
          <p className="text-slate-500 text-sm">{room.name}</p>
        </div>

        <div className="space-y-4">
          <div className="bg-slate-50 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {room.isLocked ? (
                  <Lock className="w-5 h-5 text-amber-500" />
                ) : (
                  <Unlock className="w-5 h-5 text-emerald-500" />
                )}
                <div>
                  <p className="text-sm font-medium text-slate-900">画板锁定</p>
                  <p className="text-xs text-slate-500">
                    {room.isLocked ? '任何人都无法编辑' : '所有人都可以编辑'}
                  </p>
                </div>
              </div>
              <button
                onClick={onLockToggle}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  room.isLocked
                    ? 'bg-emerald-500 text-white hover:bg-emerald-600'
                    : 'bg-amber-500 text-white hover:bg-amber-600'
                }`}
              >
                {room.isLocked ? '解锁' : '锁定'}
              </button>
            </div>
          </div>

          <div className="bg-slate-50 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <Users className="w-5 h-5 text-blue-500" />
              <div>
                <p className="text-sm font-medium text-slate-900">最多参与者</p>
                <p className="text-xs text-slate-500">
                  最多 {room.maxParticipants} 人
                </p>
              </div>
            </div>
          </div>

          <div className="bg-slate-50 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-slate-500" />
              <div>
                <p className="text-sm font-medium text-slate-900">画板有效期</p>
                <p className="text-xs text-slate-500">{getTimeRemaining()}</p>
              </div>
            </div>
          </div>

          <div className="bg-slate-50 rounded-xl p-4">
            <p className="text-sm font-medium text-slate-900 mb-2">房间信息</p>
            <div className="space-y-1 text-xs text-slate-600">
              <p>房间 ID: <span className="font-mono">{room.id}</span></p>
              <p>模板: <span className="capitalize">{room.template}</span></p>
              <p>访问类型: <span className="capitalize">{room.accessType}</span></p>
            </div>
          </div>

          <div className="pt-4">
            <button
              onClick={onClose}
              className="w-full py-3 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors font-medium"
            >
              完成
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
