import { Users } from 'lucide-react';
import { User } from '../../types';

interface ParticipantListProps {
  users: User[];
  currentUserId?: string;
}

export const ParticipantList: React.FC<ParticipantListProps> = ({
  users,
  currentUserId,
}) => {
  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-200">
        <Users className="w-4 h-4 text-slate-500" />
        <h3 className="text-sm font-semibold text-slate-900">参与者</h3>
        <span className="ml-auto text-xs text-slate-400">{users.length}</span>
      </div>

      <div className="flex-1 space-y-2 overflow-y-auto">
        {users.map((user) => (
          <div
            key={user.id}
            className={`flex items-center gap-3 p-2 rounded-lg transition-colors ${
              user.id === currentUserId ? 'bg-slate-100' : ''
            }`}
          >
            <div
              className="w-9 h-9 rounded-lg flex items-center justify-center text-white text-sm font-semibold"
              style={{ backgroundColor: user.cursorColor }}
            >
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-900 truncate">
                {user.name}
                {user.id === currentUserId && (
                  <span className="ml-2 text-xs text-slate-400">（我）</span>
                )}
              </p>
              <p className="text-xs text-slate-500">
                {user.isAnonymous ? '访客' : '已登录'}
              </p>
            </div>
            <div
              className="w-2 h-2 rounded-full animate-pulse"
              style={{ backgroundColor: user.cursorColor }}
            ></div>
          </div>
        ))}

        {users.length === 0 && (
          <div className="text-center py-12">
            <Users className="w-10 h-10 mx-auto mb-2 text-slate-300" />
            <p className="text-sm text-slate-400">暂无其他参与者</p>
          </div>
        )}
      </div>
    </div>
  );
};
