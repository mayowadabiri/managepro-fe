import React from "react";
import { BellIcon } from "lucide-react";

interface NotificationsMenuProps {
    unreadCount: number;
    showNotifications: boolean;
    onToggle: () => void;
    notificationRef: React.RefObject<HTMLDivElement>;
    notifications: Array<any>;
    onMarkAllRead: () => void;
}

const NotificationsMenu: React.FC<NotificationsMenuProps> = ({ unreadCount, showNotifications, onToggle, notificationRef, notifications, onMarkAllRead }) => (
    <div className="relative" ref={notificationRef}>
        <button className="relative p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors" onClick={onToggle} aria-label="Notifications">
            <BellIcon size={20} />
            {unreadCount > 0 && <span className="absolute -top-1 -right-1 flex items-center justify-center w-5 h-5 bg-red-500 text-white text-xs font-medium rounded-full">{unreadCount}</span>}
        </button>
        {/* Notifications Dropdown */}
        {showNotifications && <div className="absolute right-0 mt-2 w-80 max-w-[calc(100vw-2rem)] bg-white rounded-xl shadow-lg py-2 z-50 border border-gray-100 transform transition-all duration-200 ease-out">
            <div className="px-4 py-3 border-b border-gray-100">
                <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-gray-900">Notifications</h3>
                    <button className="text-xs text-blue-600 hover:text-blue-800 font-medium" onClick={onMarkAllRead}>Mark all as read</button>
                </div>
            </div>
            <div className="max-h-96 overflow-y-auto">
                {notifications.length > 0 ? <div>
                    {notifications.map(notification => <div key={notification.id} className={`px-4 py-3 hover:bg-gray-50 border-l-2 ${notification.read ? 'border-transparent' : 'border-blue-500 bg-blue-50/50'}`}>
                        <div className="flex items-start">
                            <div className="flex-shrink-0 mr-3 mt-0.5">{notification.icon}</div>
                            <div className="flex-1 min-w-0">
                                <p className={`text-sm font-medium ${notification.read ? 'text-gray-700' : 'text-gray-900'}`}>{notification.title}</p>
                                <p className="text-xs text-gray-500 mt-1 line-clamp-2">{notification.message}</p>
                                <p className="text-xs text-gray-400 mt-1">{notification.time}</p>
                            </div>
                        </div>
                    </div>)}
                </div> : <div className="px-4 py-6 text-center">
                    <p className="text-sm text-gray-500">No notifications yet</p>
                </div>}
            </div>
            {notifications.length > 0 && <div className="px-4 py-3 border-t border-gray-100 text-center">
                <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">View all notifications</button>
            </div>}
        </div>}
    </div>
);

export default NotificationsMenu;
