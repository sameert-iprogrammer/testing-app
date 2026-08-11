import React from 'react';
import { Info, AlertCircle } from 'lucide-react';

export interface MockNotification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  type: string;
}

export interface NotificationPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const mockNotifications: MockNotification[] = [
  {
    id: '1',
    title: 'New User Registered',
    message: 'A new user just signed up for your platform.',
    timestamp: '2 min ago',
    type: 'info',
  },
  {
    id: '2',
    title: 'Report Generated',
    message: 'Your monthly analytics report is ready to view.',
    timestamp: '1 hour ago',
    type: 'info',
  },
  {
    id: '3',
    title: 'High Server Load',
    message: 'Server CPU usage has exceeded 90%.',
    timestamp: '3 hours ago',
    type: 'alert',
  },
  {
    id: '4',
    title: 'Payment Received',
    message: 'A payment of $1,250.00 has been processed.',
    timestamp: '5 hours ago',
    type: 'info',
  },
];

const NotificationPanel: React.FC<NotificationPanelProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) {
    return null;
  }

  const iconMap: Record<string, React.ReactNode> = {
    info: <Info size={18} className="text-slate-400 shrink-0" />,
    alert: <AlertCircle size={18} className="text-amber-400 shrink-0" />,
  };

  return (
    <div
      className="absolute top-full right-0 mt-2 w-80 bg-slate-900 border border-slate-800 rounded-xl shadow-xl z-50 max-h-96 overflow-y-auto"
      onClick={onClose}
    >
      <div className="p-4 border-b border-slate-800">
        <h3 className="font-semibold text-sm text-white">Notifications</h3>
      </div>

      <div className="py-2">
        {mockNotifications.map((notification) => (
          <div
            key={notification.id}
            className="px-4 py-3 hover:bg-slate-800/50 transition-colors cursor-default"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex gap-3">
              <span className="mt-0.5">{iconMap[notification.type] || null}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-200 truncate">
                  {notification.title}
                </p>
                <p className="text-xs text-slate-400 mt-0.5">
                  {notification.message}
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  {notification.timestamp}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotificationPanel;