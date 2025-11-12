import React from "react";
import { Link, useLocation } from "@tanstack/react-router";
import { HomeIcon, ListIcon, BarChart3Icon } from "lucide-react";

const Sidebar: React.FC = () => {
    const location = useLocation();
    const isActive = (path: string) =>
        location.pathname === path ? "bg-teal-100 text-teal-700" : "text-gray-700 hover:bg-gray-100";

    return (
        <aside className="hidden md:block w-64 bg-white border-r border-gray-200 pt-5 pb-4 flex flex-col">
            <nav className="flex-1 px-2 space-y-1">
                <Link to="/" className={`flex items-center px-4 py-3 text-sm font-medium rounded-md ${isActive('/')}`}>
                    <HomeIcon className="mr-3" size={20} />
                    Home
                </Link>
                <Link to="/subscriptions" className={`flex items-center px-4 py-3 text-sm font-medium rounded-md ${isActive('/subscriptions')}`}>
                    <ListIcon className="mr-3" size={20} />
                    Subscriptions
                </Link>
                {/* <Link to="/insights" className={`flex items-center px-4 py-3 text-sm font-medium rounded-md ${isActive('/insights')}`}>
                    <BarChart3Icon className="mr-3" size={20} />
                    Insights
                </Link> */}
            </nav>
        </aside>
    );
};

export default Sidebar;
