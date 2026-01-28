'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Menu, Bell, Search, Calendar } from 'lucide-react';
import { useLayout } from './LayoutController';
import { useTheme } from '@/context/ThemeContext';
import WeekSelector from './WeekSelector';
import { getCurrentWeek, getWeekDateRange, formatDateRange } from '@/utils/WeekSelector';

const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "https://68.221.169.119/api/v1";

interface HeaderProps {
  title: string;
  showWeekSelector?: boolean;
}

const Header = ({ title, showWeekSelector = false }: HeaderProps) => {
  const { isMobileView, isTabletView, setMobileMenuOpen } = useLayout();
  const { config } = useTheme();
  const isDark = config.mode === 'dark';
  
  const [currentWeek, setCurrentWeek] = useState(getCurrentWeek());
  const [searchQuery, setSearchQuery] = useState('');
  const [notificationCount] = useState(2);
  const [profile, setProfile] = useState<{ name: string; surname: string } | null>(null);

  useEffect(() => {
    fetch(`${apiBaseUrl}/auth/me`, {
      credentials: 'include',
    })
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data && data.name && data.surname) {
          setProfile({ name: data.name, surname: data.surname });
        }
      })
      .catch(() => {});
  }, []);

  const handleWeekChange = (week: number) => {
    setCurrentWeek(week);
  };

  const weekRange = getWeekDateRange(currentWeek);

  const getInitials = () => {
    if (profile) {
      return `${profile.name[0]}${profile.surname[0]}`.toUpperCase();
    }
    return 'JO';
  };

  return (
    <motion.header 
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="px-4 md:px-6 py-4 h-20 sticky top-0 z-20 border-b"
      style={{
        backgroundColor: isDark ? '#0f172a' : '#ffffff',
        borderBottomColor: isDark ? '#1e293b' : '#e5e7eb',
      }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          {(isMobileView || isTabletView) && (
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="mr-4 p-2 rounded-lg transition-colors"
              style={{
                color: isDark ? '#94a3b8' : '#4b5563',
                backgroundColor: 'transparent',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = isDark ? '#1e293b' : '#f3f4f6';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              <Menu size={20} />
            </button>
          )}
          
          <div>
            <h1 
              className="text-xl md:text-2xl font-bold"
              style={{ color: isDark ? '#f8fafc' : '#1f2937' }}
            >
              {title}
            </h1>
            {showWeekSelector && (
              <div 
                className="flex items-center text-sm mt-1"
                style={{ color: isDark ? '#94a3b8' : '#6b7280' }}
              >
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
            <Search 
              size={16} 
              className="absolute left-3 top-1/2 transform -translate-y-1/2"
              style={{ color: isDark ? '#64748b' : '#9ca3af' }}
            />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 rounded-lg text-sm transition-all duration-200"
              style={{
                backgroundColor: isDark ? '#1e293b' : '#ffffff',
                border: `1px solid ${isDark ? '#334155' : '#e5e7eb'}`,
                color: isDark ? '#f8fafc' : '#1f2937',
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = 'var(--color-primary)';
                e.currentTarget.style.outline = '2px solid';
                e.currentTarget.style.outlineColor = isDark ? 'rgba(16, 185, 129, 0.2)' : 'rgba(16, 185, 129, 0.1)';
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = isDark ? '#334155' : '#e5e7eb';
                e.currentTarget.style.outline = 'none';
              }}
            />
          </div>
          
          {/* Notifications */}
          <button 
            className="relative p-2 rounded-lg transition-colors"
            style={{
              color: isDark ? '#94a3b8' : '#4b5563',
              backgroundColor: 'transparent',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = isDark ? '#1e293b' : '#f3f4f6';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            <Bell size={20} />
            {notificationCount > 0 && (
              <span 
                className="absolute -top-1 -right-1 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium"
                style={{ backgroundColor: '#ef4444' }}
              >
                {notificationCount}
              </span>
            )}
          </button>
          
          {/* Profile */}
          <button 
            className="flex items-center p-1.5 rounded-lg transition-colors"
            style={{
              color: isDark ? '#94a3b8' : '#4b5563',
              backgroundColor: 'transparent',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = isDark ? '#1e293b' : '#f3f4f6';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            <div 
              className="w-8 h-8 rounded-full flex items-center justify-center font-medium text-sm"
              style={{
                backgroundColor: isDark ? 'rgba(16, 185, 129, 0.15)' : 'var(--color-primary-light)',
                color: 'var(--color-primary)',
              }}
            >
              {getInitials()}
            </div>
          </button>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;