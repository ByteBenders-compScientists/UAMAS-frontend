'use client';

import { useState } from 'react';
import { useLayout } from './LayoutController';
import { Menu, Bell, Search, ChevronDown } from 'lucide-react';

interface HeaderProps {
  title?: string;
}

const Header = ({ title = "Dashboard" }: HeaderProps) => {
  const { setMobileMenuOpen, isMobileView, isTabletView } = useLayout();
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  return (
    <header className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-20">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-4">
          {(isMobileView || isTabletView) && (
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="text-gray-500 hover:text-gray-700 focus:outline-none"
            >
              <Menu size={24} />
            </button>
          )}
          
          <h1 className="text-xl font-semibold text-gray-800">{title}</h1>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="relative hidden md:block">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={16} className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search..."
              className="pl-10 pr-4 py-1.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm"
            />
          </div>
          
          <div className="relative">
            <button
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              className="relative text-gray-500 hover:text-gray-700 p-1.5 rounded-full hover:bg-gray-100"
            >
              <Bell size={20} />
              <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500"></span>
            </button>
            
            {notificationsOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg py-2 z-10 border border-gray-100">
                <div className="px-4 py-2 border-b border-gray-100">
                  <h3 className="text-sm font-semibold text-gray-800">Notifications</h3>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  <div className="px-4 py-3 hover:bg-gray-50 border-b border-gray-100">
                    <p className="text-sm font-medium text-gray-800">New assignment added</p>
                    <p className="text-xs text-gray-500 mt-1">5 minutes ago</p>
                  </div>
                  <div className="px-4 py-3 hover:bg-gray-50 border-b border-gray-100">
                    <p className="text-sm font-medium text-gray-800">Deadline reminder: CS301 Project</p>
                    <p className="text-xs text-gray-500 mt-1">2 hours ago</p>
                  </div>
                  <div className="px-4 py-3 hover:bg-gray-50">
                    <p className="text-sm font-medium text-gray-800">Your grade has been updated</p>
                    <p className="text-xs text-gray-500 mt-1">Yesterday</p>
                  </div>
                </div>
                <div className="px-4 py-2 border-t border-gray-100">
                  <button className="text-sm text-emerald-600 hover:text-emerald-700 font-medium">
                    View all notifications
                  </button>
                </div>
              </div>
            )}
          </div>
          
          <div className="flex items-center">
            <div className="h-8 w-8 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-600 font-medium text-sm">
              JO
            </div>
            <div className="hidden md:block ml-2">
              <div className="flex items-center text-sm">
                <span className="font-medium text-gray-800">John Opondo</span>
                <ChevronDown size={16} className="ml-1 text-gray-500" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;