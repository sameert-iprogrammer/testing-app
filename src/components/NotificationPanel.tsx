import React, { useState, useRef, useEffect } from 'react';
import { Bell } from 'lucide-react';
import NotificationItem from './NotificationItem';

interface Notification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
}

interface NotificationPanelProps {
  isOpen: boolean;
  notifications: Notification[];
  onClose: () => void;
  onMarkRead: (id: string) => void;
}

const mockNotifications: Notification[] = [
  {
    id: '1',
    title: 'New user registered',
    message: 'Jane Smith has created an account on the platform.',
    timestamp: '2 minutes ago',
    read: false,
  },
  {
    id: '2',
    title: 'Report completed',
    message: 'The monthly revenue summary report is ready for review.',
    timestamp: '1 hour ago',
    read: false,
  },
  {
    id: '3',
    title: 'Server alert',
    message: 'CPU usage exceeded 80% on production server.',
    timestamp: '3 hours ago',
    read: true,
  },
];

const NotificationPanel: React.FC<NotificationPanelProps> = ({
  isOpen,
  notifications = mockNotifications,
  onClose,
  onMarkRead,
}) => {
  const panelRef = useRef<HTMLDivElement>(null);
  const [isFocused] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    function handleClickOutside(event: MouseEvent) {
      if (
        panelRef.current &&
        !panelRef.current.contains(event.target as Node) &&
        !isFocused
      ) {
        onClose();
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, isFocused, onClose]);

  if (!isOpen) return null;

  return (
    <div
      ref={panelRef}
      className="absolute right-0 mt-2 w-80 max-h-96 overflow-y-auto rounded-xl shadow-lg border border-slate-800 bg-slate-900/90 backdrop-blur-sm z-50"
    >
      <div className="px-4 py-3 border-b border-slate-800 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-white">Notifications</h3>
        <button
          onClick={onClose}
          className="text-slate-500 hover:text-slate-300 transition-colors"
          aria-label="Close notifications"
        >
          <Bell size={16} className="rotate-180" />
        </button>
      </div>

      <div className="divide-y divide-slate-800/50">
        {notifications.map((notification) => (
          <NotificationItem
            key={notification.id}
            title={notification.title}
            message={notification.message}
            timestamp={notification.timestamp}
            read={notification.read}
            onClick={() => onMarkRead(notification.id)}
          />
        ))}
      </div>

      <div className="px-4 py-3 border-t border-slate-800 text-center">
        <button
          onClick={() => console.log('View all notifications clicked')}
          className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors font-medium"
        >
          View all notifications
        </button>
      </div>
    </div>
  );
};

export default NotificationPanel;