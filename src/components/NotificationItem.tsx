import React from 'react';

interface NotificationItemProps {
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  onClick: () => void;
}

const NotificationItem: React.FC<NotificationItemProps> = ({
  title,
  message,
  timestamp,
  read,
  onClick,
}) => (
  <div
    onClick={onClick}
    role="button"
    tabIndex={0}
    onKeyDown={(e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        onClick();
      }
    }}
    className={`px-4 py-3 cursor-pointer transition-colors border-l-2 ${read
      ? 'bg-slate-900/20 border-l-transparent hover:bg-slate-800/30'
      : 'bg-slate-800/50 border-l-indigo-500 hover:bg-slate-800/50'
    }`}
  >
    <div className="flex items-start justify-between gap-2">
      <p className={`text-sm font-medium ${read ? 'text-slate-300' : 'text-white'}`}>
        {title}
      </p>
      {!read && (
        <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-1.5 shrink-0"></span>
      )}
    </div>
    <p className="text-xs text-slate-400 mt-1 line-clamp-2">{message}</p>
    <p className="text-xs text-slate-500 mt-1">{timestamp}</p>
  </div>
);

export default NotificationItem;