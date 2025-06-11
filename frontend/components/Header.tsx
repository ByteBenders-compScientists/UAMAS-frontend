'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Menu, Bell, Search, User, Calendar } from 'lucide-react';
import { useLayout } from './LayoutController';
import WeekSelector from './WeekSelector';
import { getCurrentWeek, getWeekDateRange, formatDateRange } from '@/utils/WeekSelector';

interface HeaderProps {
  title: string;
  showWeekSelector?: boolean;
}

const Header = ({ title, showWeekSelector = false }: HeaderProps) => {
  const { isMobileView, isTabletView, setMobileMenuOpen } = useLayout();
  const [currentWeek, setCurrentWeek] = useState(getCurrentWeek());
  const [searchQuery, setSearchQuery] = useState('');
  const [notificationCount, setNotificationCount] = useState(2);

  const handleWeekChange = (week: number) => {
    setCurrentWeek(week);
    // You can add logic here to update the content based on the selected week
  };

  const weekRange = getWeekDateRange(currentWeek);

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
          
          {/* Notifications */}
          <button className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
            <Bell size={20} />
            {notificationCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {notificationCount}
              </span>
            )}
          </button>
          
          {/* Profile */}
          <button className="flex items-center p-1.5 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
            <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-700 font-medium text-sm">
              JO
            </div>
          </button>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;