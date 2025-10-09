import React from "react";
import { SettingsIcon, LogOutIcon } from "lucide-react";

interface ProfileMenuProps {
    user: any;
    showProfileMenu: boolean;
    profileMenuRef: React.RefObject<HTMLDivElement>;
    getUserInitials: () => string;
    onSettings: () => void;
    onLogout: () => void;
}

const ProfileMenu: React.FC<ProfileMenuProps> = ({ user, showProfileMenu, profileMenuRef, getUserInitials, onSettings, onLogout }) => (
    <div className="relative" ref={profileMenuRef}>
        <button className="flex items-center justify-center rounded-full overflow-hidden hover:ring-2 hover:ring-teal-500 transition-all" onClick={onSettings} aria-label="User menu">
            {user && user.profilePicture ? <img src={user.profilePicture} alt={`${user.firstName} ${user.lastName}`} className="w-9 h-9 rounded-full object-cover" /> : <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-medium">{getUserInitials()}</div>}
        </button>
        {/* Profile Dropdown Menu */}
        {showProfileMenu && <div className="absolute right-0 mt-2 w-64 max-w-[calc(100vw-2rem)] bg-white rounded-xl shadow-lg py-2 z-50 border border-gray-100 transform transition-all duration-200 ease-out">
            <div className="px-4 py-3 border-b border-gray-100">
                <div className="flex items-center space-x-3">
                    {user && user.profilePicture ? <img src={user.profilePicture} alt={`${user.firstName} ${user.lastName}`} className="w-10 h-10 rounded-full object-cover" /> : <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-medium">{getUserInitials()}</div>}
                    <div>
                        <p className="text-sm font-medium text-gray-900">{user ? `${user.firstName} ${user.lastName}` : 'User'}</p>
                        <p className="text-xs text-gray-500 truncate">{user?.email || 'user@example.com'}</p>
                    </div>
                </div>
            </div>
            <div className="py-1">
                <button onClick={onSettings} className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 w-full text-left transition-colors">
                    <SettingsIcon className="mr-3 text-gray-500" size={16} />
                    Settings
                </button>
                <button onClick={onLogout} className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 w-full text-left transition-colors">
                    <LogOutIcon className="mr-3 text-gray-500" size={16} />
                    Sign out
                </button>
            </div>
        </div>}
    </div>
);

export default ProfileMenu;
