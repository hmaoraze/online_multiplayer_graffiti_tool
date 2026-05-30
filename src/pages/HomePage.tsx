import { useState } from 'react';
import { Plus, LogIn, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useRoomStore } from '../stores/roomStore';
import { useUserStore } from '../stores/userStore';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { createRoom } = useRoomStore();
  const { createUser } = useUserStore();

  const [roomName, setRoomName] = useState('');
  const [joinRoomId, setJoinRoomId] = useState('');
  const [userName, setUserName] = useState('');

  const handleCreateRoom = () => {
    if (!roomName.trim()) return;

    const user = createUser(
      userName.trim() || `用户${Math.floor(Math.random() * 10000)}`,
      !userName.trim()
    );

    const room = createRoom(
      roomName,
      'blank',
      'public',
      20
    );

    navigate(`/room/${room.id}`);
  };

  const handleJoinRoom = () => {
    if (!joinRoomId.trim()) return;

    const user = createUser(
      userName.trim() || `用户${Math.floor(Math.random() * 10000)}`,
      !userName.trim()
    );

    navigate(`/room/${joinRoomId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(148,163,184,0.15)_0%,_transparent_60%)]"></div>

      <div className="relative z-10 container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="mb-16 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-slate-200 bg-white/40 backdrop-blur-sm">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
              <span className="text-xs font-medium text-slate-600 tracking-wide">多人协作画板</span>
            </div>

            <h1 className="mt-8 text-5xl md:text-6xl font-semibold tracking-tight text-slate-900">
              专业协作画板
            </h1>
            <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
              简洁高效的多人协作涂鸦工具，适合毕业、聚会、纪念等活动场景
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="glass-panel rounded-2xl p-8 hover:shadow-[0_16px_48px_rgba(0,0,0,0.06)] transition-all duration-300 hover:-translate-y-1">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 rounded-xl bg-slate-900 flex items-center justify-center">
                  <Plus className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-semibold text-slate-900">创建新画板</h2>
                  <p className="text-sm text-slate-500 mt-1">开始一段全新的创作</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    你的昵称
                  </label>
                  <input
                    type="text"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    placeholder="输入你的昵称（可选）"
                    className="w-full px-4 py-3 glass-input rounded-xl text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    画板名称
                  </label>
                  <input
                    type="text"
                    value={roomName}
                    onChange={(e) => setRoomName(e.target.value)}
                    placeholder="例如：毕业纪念"
                    className="w-full px-4 py-3 glass-input rounded-xl text-slate-900"
                    onKeyDown={(e) => e.key === 'Enter' && handleCreateRoom()}
                  />
                </div>

                <button
                  onClick={handleCreateRoom}
                  disabled={!roomName.trim()}
                  className="w-full py-3 glass-button-primary rounded-xl font-medium text-white disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  创建画板
                </button>
              </div>
            </div>

            <div className="glass-panel rounded-2xl p-8 hover:shadow-[0_16px_48px_rgba(0,0,0,0.06)] transition-all duration-300 hover:-translate-y-1">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 rounded-xl bg-emerald-500 flex items-center justify-center">
                  <LogIn className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-semibold text-slate-900">加入现有画板</h2>
                  <p className="text-sm text-slate-500 mt-1">加入朋友的协作</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    你的昵称
                  </label>
                  <input
                    type="text"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    placeholder="输入你的昵称（可选）"
                    className="w-full px-4 py-3 glass-input rounded-xl text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    房间 ID
                  </label>
                  <input
                    type="text"
                    value={joinRoomId}
                    onChange={(e) => setJoinRoomId(e.target.value)}
                    placeholder="输入房间 ID"
                    className="w-full px-4 py-3 glass-input rounded-xl text-slate-900 font-mono"
                    onKeyDown={(e) => e.key === 'Enter' && handleJoinRoom()}
                  />
                </div>

                <button
                  onClick={handleJoinRoom}
                  disabled={!joinRoomId.trim()}
                  className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  加入画板
                </button>
              </div>
            </div>
          </div>

          <div className="mt-16 grid grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-slate-100 flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-slate-600" />
              </div>
              <h3 className="font-semibold text-slate-900">多种画笔</h3>
              <p className="text-sm text-slate-500 mt-1">马克笔、毛笔、荧光笔等</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-slate-100 flex items-center justify-center">
                <Plus className="w-6 h-6 text-slate-600" />
              </div>
              <h3 className="font-semibold text-slate-900">实时同步</h3>
              <p className="text-sm text-slate-500 mt-1">多人笔迹实时同步</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-slate-100 flex items-center justify-center">
                <LogIn className="w-6 h-6 text-slate-600" />
              </div>
              <h3 className="font-semibold text-slate-900">高清导出</h3>
              <p className="text-sm text-slate-500 mt-1">支持导出为图片或PDF</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
