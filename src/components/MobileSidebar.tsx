import React, { useRef } from "react";
import { Link, useLocation, useNavigate } from "@tanstack/react-router";
import { HomeIcon, ListIcon, BarChart3Icon, SettingsIcon, LogOutIcon, XIcon } from "lucide-react";

interface MobileSidebarProps {
    show: boolean;
    onClose: () => void;
    handleLogout: () => void;
}

const MobileSidebar: React.FC<MobileSidebarProps> = ({ show, onClose, handleLogout }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const mobileMenuRef = useRef<HTMLDivElement>(null);
    const isActive = (path: string) =>
        location.pathname === path ? "bg-teal-100 text-teal-700" : "text-gray-700 hover:bg-gray-100";

    if (!show) return null;

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75 z-40 md:hidden" onClick={onClose}>
            <div className="fixed inset-y-0 left-0 flex flex-col w-64 max-w-[80%] bg-white h-full shadow-xl transform transition-all duration-300 ease-in-out" ref={mobileMenuRef} onClick={e => e.stopPropagation()}>
                <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
                    <h2 className="text-xl font-bold text-teal-700">SubTracker</h2>
                    <button onClick={onClose} className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                        <XIcon size={20} />
                    </button>
                </div>
                <nav className="flex-1 px-2 pt-5 pb-4 space-y-1 overflow-y-auto">
                    <Link to="/" className={`flex items-center px-4 py-3 text-sm font-medium rounded-md ${isActive('/')}`} onClick={onClose}>
                        <HomeIcon className="mr-3" size={20} />
                        Home
                    </Link>
                    <Link to="/subscriptions" className={`flex items-center px-4 py-3 text-sm font-medium rounded-md ${isActive('/subscriptions')}`} onClick={onClose}>
                        <ListIcon className="mr-3" size={20} />
                        Subscriptions
                    </Link>
                    <Link to="/insights" className={`flex items-center px-4 py-3 text-sm font-medium rounded-md ${isActive('/insights')}`} onClick={onClose}>
                        <BarChart3Icon className="mr-3" size={20} />
                        Insights
                    </Link>
                    <div className="border-t border-gray-200 my-3"></div>
                    <Link to="/settings" className={`flex items-center px-4 py-3 text-sm font-medium rounded-md ${isActive('/settings')}`} onClick={onClose}>
                        <SettingsIcon className="mr-3" size={20} />
                        Settings
                    </Link>
                </nav>
                <div className="p-4 border-t border-gray-200">
                    <button onClick={handleLogout} className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 w-full text-left transition-colors rounded-md">
                        <LogOutIcon className="mr-3 text-gray-500" size={16} />
                        Sign out
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MobileSidebar;
