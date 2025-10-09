import React from "react";
import { BellIcon, MenuIcon, SearchIcon } from "lucide-react";



const Header = () => (
    <header className="bg-white border-b border-gray-200 py-3 px-4 sm:px-6 flex items-center justify-between">
        <div className="flex items-center">
            <button className="md:hidden p-2 mr-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors mobile-menu-button" aria-label="Menu">
                <MenuIcon size={20} />
            </button>
            <h1 className="text-xl font-bold text-teal-700">SubTracker</h1>
        </div>
        <div className="flex items-center space-x-3 sm:space-x-6">
            <div className="relative hidden md:block">
                <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input type="text" placeholder="Search..." className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 w-full sm:w-auto" />
            </div>
            <button className="md:hidden p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors" aria-label="Search">
                <SearchIcon size={20} />
            </button>
        </div>
    </header>
);

export default Header;
