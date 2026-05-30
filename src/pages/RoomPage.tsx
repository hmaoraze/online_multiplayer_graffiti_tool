import { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Settings,
  Share2,
  Download,
  Lock,
  Unlock,
  ArrowLeft,
  Minus,
  Plus,
  Maximize2,
} from 'lucide-react';
import { useRoomStore } from '../stores/roomStore';
import { useUserStore } from '../stores/userStore';
import { useCanvasStore } from '../stores/canvasStore';
import { Canvas } from '../components/canvas/Canvas';
import { Toolbar } from '../components/toolbar/Toolbar';
import { ColorPicker } from '../components/toolbar/ColorPicker';
import { ParticipantList } from '../components/room/ParticipantList';
import { ShareModal } from '../components/room/ShareModal';
import { SettingsModal } from '../components/room/SettingsModal';
import { ExportModal } from '../components/room/ExportModal';
import { Room } from '../types';

export const RoomPage: React.FC = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const navigate = useNavigate();

  const { currentRoom, participants, addParticipant, lockRoom, unlockRoom } = useRoomStore();
  const { currentUser, createUser } = useUserStore();
  const { zoom, setZoom } = useCanvasStore();

  const [showShareModal, setShowShareModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [dimensions, setDimensions] = useState({ width: 2000, height: 1600 });

  const canvasContainerRef = useRef<HTMLDivElement>(null);

  // 模拟一个房间，因为 store 中没有 getRoom 和 rooms
  const [room] = useState<Room>(() => ({
    id: roomId || 'demo-room',
    name: '协作画板',
    template: 'blank',
    isLocked: false,
    accessType: 'public',
    maxParticipants: 20,
    createdAt: Date.now(),
    expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000,
  }));

  useEffect(() => {
    if (!currentUser) {
      const user = createUser('用户' + Math.random().toString(36).substr(2, 6), true);
      addParticipant(user);
    }
  }, [currentUser, createUser, addParticipant]);

  useEffect(() => {
    const handleResize = () => {
      if (canvasContainerRef.current) {
        const { clientWidth, clientHeight } = canvasContainerRef.current;
        const baseWidth = 2000;
        const baseHeight = 1600;
        const ratio = baseWidth / baseHeight;

        let newWidth = baseWidth;
        let newHeight = baseHeight;

        if (clientWidth < baseWidth || clientHeight < baseHeight) {
          if (clientWidth / clientHeight > ratio) {
            newHeight = Math.max(800, Math.floor(clientHeight * 0.85));
            newWidth = Math.floor(newHeight * ratio);
          } else {
            newWidth = Math.max(1000, Math.floor(clientWidth * 0.9));
            newHeight = Math.floor(newWidth / ratio);
          }
        }

        setDimensions({ width: newWidth, height: newHeight });
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
        const delta = e.deltaY > 0 ? -0.1 : 0.1;
        setZoom(Math.max(0.5, Math.min(2, zoom + delta)));
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    return () => window.removeEventListener('wheel', handleWheel);
  }, [zoom, setZoom]);

  const handleLockToggle = () => {
    if (room.isLocked) {
      unlockRoom();
    } else {
      lockRoom();
    }
  };

  const handleZoomIn = () => {
    setZoom(Math.min(2, zoom + 0.1));
  };

  const handleZoomOut = () => {
    setZoom(Math.max(0.5, zoom - 0.1));
  };

  const handleResetZoom = () => {
    setZoom(1);
  };

  return (
    <div className="h-screen bg-slate-50 flex overflow-hidden">
      <div className="absolute left-4 top-1/2 -translate-y-1/2 z-20">
        <Toolbar />
        <button
          onClick={() => setShowColorPicker(!showColorPicker)}
          className={`mt-2 w-12 h-12 glass-panel rounded-xl flex items-center justify-center transition-all ${
            showColorPicker ? 'ring-2 ring-slate-700' : ''
          }`}
        >
          <div
            className="w-6 h-6 rounded-lg shadow-inner"
            style={{ backgroundColor: useCanvasStore.getState().currentColor }}
          ></div>
        </button>

        {showColorPicker && (
          <div className="absolute left-full top-0 ml-3">
            <ColorPicker />
          </div>
        )}
      </div>

      <div className="absolute left-4 bottom-8 z-20 glass-panel rounded-xl p-3 flex items-center gap-2">
        <button
          onClick={handleZoomOut}
          className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
          title="缩小"
        >
          <Minus className="w-4 h-4 text-slate-600" />
        </button>
        <div className="w-24 text-center text-sm font-medium text-slate-700">
          {Math.round(zoom * 100)}%
        </div>
        <button
          onClick={handleZoomIn}
          className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
          title="放大"
        >
          <Plus className="w-4 h-4 text-slate-600" />
        </button>
        <div className="w-px h-6 bg-slate-200 mx-1"></div>
        <button
          onClick={handleResetZoom}
          className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
          title="重置缩放"
        >
          <Maximize2 className="w-4 h-4 text-slate-600" />
        </button>
      </div>

      <div className="flex-1 flex flex-col">
        <header className="flex items-center justify-between px-6 py-4 bg-white/70 backdrop-blur-xl border-b border-slate-200">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/')}
              className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-slate-600" />
            </button>
            <div>
              <h1 className="text-lg font-semibold text-slate-900">
                {room.name}
              </h1>
              <div className="flex items-center gap-2 mt-1">
                <span
                  className={`inline-flex items-center gap-1 text-xs ${
                    room.isLocked ? 'text-amber-600' : 'text-emerald-600'
                  }`}
                >
                  {room.isLocked ? (
                    <Lock className="w-3 h-3" />
                  ) : (
                    <Unlock className="w-3 h-3" />
                  )}
                  {room.isLocked ? '已锁定' : '可编辑'}
                </span>
                <span className="text-slate-400">•</span>
                <span className="text-xs text-slate-500">
                  房间 ID: {room.id}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowExportModal(true)}
              className="p-3 glass-button rounded-xl text-slate-700"
              title="导出"
            >
              <Download className="w-5 h-5" />
            </button>
            <button
              onClick={() => setShowShareModal(true)}
              className="p-3 glass-button rounded-xl text-slate-700"
              title="分享"
            >
              <Share2 className="w-5 h-5" />
            </button>
            <button
              onClick={() => setShowSettingsModal(true)}
              className="p-3 glass-button rounded-xl text-slate-700"
              title="设置"
            >
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </header>

        <div className="flex-1 p-4 overflow-auto">
          <div
            ref={canvasContainerRef}
            className="bg-white rounded-xl shadow-[0_4px_48px_rgba(0,0,0,0.08)] overflow-hidden mx-auto transition-transform"
            style={{
              width: dimensions.width,
              height: dimensions.height,
              transform: `scale(${zoom})`,
              transformOrigin: 'top left',
            }}
          >
            <Canvas
              width={dimensions.width}
              height={dimensions.height}
              isLocked={room.isLocked}
            />
          </div>
        </div>
      </div>

      <div className="w-72 p-4 border-l border-slate-200 bg-white/50 backdrop-blur-sm">
        <ParticipantList
          users={participants}
          currentUserId={currentUser?.id}
        />
      </div>

      {showShareModal && (
        <ShareModal
          roomId={room.id}
          roomName={room.name}
          onClose={() => setShowShareModal(false)}
        />
      )}

      {showSettingsModal && (
        <SettingsModal
          room={room}
          onClose={() => setShowSettingsModal(false)}
          onLockToggle={handleLockToggle}
        />
      )}

      {showExportModal && (
        <ExportModal
          roomName={room.name}
          onClose={() => setShowExportModal(false)}
        />
      )}
    </div>
  );
};
