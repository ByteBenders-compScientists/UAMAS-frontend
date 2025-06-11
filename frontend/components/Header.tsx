'use client';

import { useState } from 'react';
import { useLayout } from './LayoutController';
import WeekSelector from './WeekSelector';
import { getCurrentWeek, getWeekDateRange, formatDateRange } from '@/utils/WeekSelector';

interface HeaderProps {
  title: string;
  showWeekSelector?: boolean;
}

const Header = ({ title = "Dashboard" }: HeaderProps) => {
  const { setMobileMenuOpen, isMobileView, isTabletView } = useLayout();
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  return (
    <motion.header 
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white border-b border-gray-200 px-4 md:px-6 py-4 h-20 sticky top-0 z-20"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          {(isMobileView || isTabletView) && (
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="mr-4 p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Menu size={20} />
            </button>
          )}
          
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-gray-800">{title}</h1>
            {showWeekSelector && (
              <div className="flex items-center text-sm text-gray-500 mt-1">
                <Calendar size={14} className="mr-1" />
                {formatDateRange(weekRange.start, weekRange.end)}
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center space-x-4">
          {showWeekSelector && (
            <WeekSelector
              currentWeek={currentWeek}
              totalWeeks={15}
              onWeekChange={handleWeekChange}
            />
          )}
          
          {/* Search Bar - Hidden on mobile */}
          <div className="hidden md:block relative">
            <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm"
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
    </motion.header>
  );
};

export default Header;