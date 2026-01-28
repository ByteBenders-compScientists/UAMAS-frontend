'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { useLayout } from './LayoutController';
import { useTheme, useThemeColors } from '@/context/ThemeContext';
import { easeInOut } from 'framer-motion';
import ThemeCustomizer from './ThemeCustomizer';
import {
  LayoutDashboard,
  BookOpen,
  MessageSquare,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  User,
  X,
} from 'lucide-react';

import Image from 'next/image';

interface SidebarProps {
  showMobileOnly?: boolean;
}

type NavItemType = {
  name: string;
  icon: React.ReactNode;
  path: string;
  badge?: number | string;
};

const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "https://68.221.169.119/api/v1";

const Sidebar = ({ showMobileOnly = false }: SidebarProps) => {
  const pathname = usePathname();
  const { config } = useTheme();
  const colors = useThemeColors();
  const isDark = config.mode === 'dark';
  
  const { 
    sidebarCollapsed, 
    setSidebarCollapsed, 
    isMobileMenuOpen, 
    setMobileMenuOpen,
    isMobileView,
    isTabletView
  } = useLayout();
  
  const [mounted, setMounted] = useState(false);
  const [profile, setProfile] = useState<{ name: string; surname: string; reg_number: string } | null>(null);

  useEffect(() => {
    setMounted(true);
    
    fetch(`${apiBaseUrl}/auth/me`, {
      credentials: 'include',
    })
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data && data.name && data.surname && data.reg_number) {
          setProfile({ name: data.name, surname: data.surname, reg_number: data.reg_number });
        }
      })
      .catch(() => {});
  }, []);

  if (!mounted) return null;

  if (showMobileOnly && !isMobileView && !isTabletView) return null;
  if (!showMobileOnly && (isMobileView || isTabletView) && !isMobileMenuOpen) return null;

  const navItems: NavItemType[] = [
    { name: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/student/dashboard' },
    { name: 'My Workspace', icon: <BookOpen size={20} />, path: '/student/unitworkspace' },
    { name: 'Forums', icon: <MessageSquare size={20} />, path: '/student/forums', badge: 'New' },
  ];

  const handleLogout = async () => {
    try {
      const response = await fetch(`${apiBaseUrl}/auth/logout`, {
        method: 'POST',
        credentials: 'include',
      });
      
      if (response.ok) {
        // Redirect to login page after successful logout
        window.location.href = '/auth';
      } else {
        console.error('Logout failed');
        // Still redirect even if logout fails
        window.location.href = '/auth';
      }
    } catch (error) {
      console.error('Logout error:', error);
      // Redirect to login on error
      window.location.href = '/auth';
    }
  };

  const bottomNavItems: NavItemType[] = [
    { name: 'Profile', icon: <User size={20} />, path: '/student/profile' },
    { name: 'Settings', icon: <Settings size={20} />, path: '/student/settings' },
  ];

  const sidebarVariants = {
    desktop: {
      width: sidebarCollapsed ? 80 : 240,
      transition: { duration: 0.3, ease: easeInOut }
    },
    mobile: {
      x: 0,
      transition: { duration: 0.3, ease: easeInOut }
    },
    mobileHidden: {
      x: "-100%",
      transition: { duration: 0.3, ease: easeInOut }
    }
  };

  const renderOverlay = () => {
    if ((isMobileView || isTabletView) && isMobileMenuOpen) {
      return (
        <motion.div 
          className="fixed inset-0 bg-black/50 z-30"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setMobileMenuOpen(false)}
        />
      );
    }
    return null;
  };

  const renderNavItem = (item: NavItemType) => {
    const isActive = pathname === item.path;
    
    return (
      <Link
        key={item.path}
        href={item.path}
        className={`
          flex items-center px-3 py-2.5 my-1 rounded-xl text-sm transition-all duration-200
          ${sidebarCollapsed && !isMobileView && !isTabletView ? 'justify-center' : ''}
        `}
        style={{
          backgroundColor: isActive ? colors.sidebarActive : 'transparent',
          color: isActive ? colors.primary : colors.textSecondary,
          border: `1px solid ${isActive ? colors.primary : 'transparent'}`,
          fontWeight: isActive ? 500 : 400,
        }}
        onMouseEnter={(e) => {
          if (!isActive) {
            e.currentTarget.style.backgroundColor = colors.sidebarHover;
          }
        }}
        onMouseLeave={(e) => {
          if (!isActive) {
            e.currentTarget.style.backgroundColor = 'transparent';
          }
        }}
      >
        <div style={{ color: isActive ? colors.primary : colors.textTertiary }}>
          {item.icon}
        </div>
        
        {(!sidebarCollapsed || isMobileView || isTabletView) && (
          <span className="ml-3">{item.name}</span>
        )}
        
        {(!sidebarCollapsed || isMobileView || isTabletView) && item.badge && (
          <div 
            className="ml-auto text-white text-xs px-2 py-0.5 rounded-full font-medium"
            style={{
              backgroundColor: typeof item.badge === 'number' ? colors.primary : colors.warning
            }}
          >
            {item.badge}
          </div>
        )}
      </Link>
    );
  };

  return (
    <>
      {renderOverlay()}
      <motion.div 
        initial={isMobileView || isTabletView ? "mobileHidden" : "desktop"}
        animate={
          isMobileView || isTabletView 
            ? (isMobileMenuOpen ? "mobile" : "mobileHidden") 
            : "desktop"
        }
        variants={sidebarVariants}
        className={`
          h-screen fixed left-0 top-0 z-40 flex flex-col shadow-xl
          ${(isMobileView || isTabletView) ? 'w-[270px]' : ''}
        `}
        style={{
          backgroundColor: colors.sidebarBackground,
          color: colors.textPrimary,
          borderRight: `1px solid ${colors.border}`,
        }}
      >
        {/* Header Section */}
        <div 
          className="flex items-center mt-3 justify-between p-4"
          style={{ borderBottom: `1px solid ${colors.border}` }}
        >
          <div className="container mx-auto px-6">
            <div className="flex justify-between items-center h-16">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="flex items-center space-x-2"
              >
                {(!sidebarCollapsed || isMobileView) && (
                  <Image
                    src="/assets/logo3.png"
                    alt="logo"
                    width={200}
                    height={160}
                    quality={100}
                    className={isDark ? 'brightness-110' : ''}
                  />
                )}
              </motion.div>
            </div>
          </div>
          {(isMobileView || isTabletView) ? (
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="rounded-full p-1.5 transition-colors"
              style={{
                color: colors.textSecondary,
                backgroundColor: 'transparent',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = colors.sidebarHover;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              <X size={18} />
            </button>
          ) : (
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="rounded-full p-1.5 transition-colors"
              style={{
                color: colors.textSecondary,
                backgroundColor: 'transparent',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = colors.sidebarHover;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              {sidebarCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
            </button>
          )}
        </div>

        {/* User Profile Section */}
        {(!sidebarCollapsed || isMobileView || isTabletView) && (
          <div 
            className="px-4 py-3"
            style={{
              borderBottom: `1px solid ${colors.border}`,
              backgroundColor: colors.backgroundSecondary,
            }}
          >
            <div className="flex items-center">
              <div 
                className="h-10 w-10 rounded-xl flex items-center justify-center font-medium text-sm shadow-sm"
                style={{
                  backgroundColor: colors.primaryLight,
                  color: colors.primary,
                }}
              >
                 <p style={{ color: colors.textPrimary }}>
                 {profile ? (profile.name[0] + (profile.surname ? profile.surname[0] : '')) : 'JO'}
                 </p>
              </div>
              <div className="ml-3">
                <p 
                  className="text-sm font-medium"
                  style={{ color: colors.textPrimary }}
                >
                  {profile ? `${profile.name} ${profile.surname}` : 'John Opondo'}
                </p>
                <p 
                  className="text-xs"
                  style={{ color: colors.textSecondary }}
                >
                  Student ID: {profile ? profile.reg_number : '2028061'}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Section */}
        <div className="flex flex-col flex-1 overflow-y-auto py-4">
          <nav className="flex-1 px-3 space-y-1">
            {navItems.map((item) => renderNavItem(item))}
            
            {/* Theme Customizer - Add after main nav items */}
            <div 
              className="pt-2 mt-2"
              style={{ borderTop: `1px solid ${colors.border}` }}
            >
              <ThemeCustomizer 
                isCollapsed={sidebarCollapsed} 
                isMobileView={isMobileView}
                isTabletView={isTabletView}
              />
            </div>
          </nav>
          
          {/* Bottom Navigation Section */}
          <div 
            className="mt-auto px-3 py-4"
            style={{ borderTop: `1px solid ${colors.border}` }}
          >
            {bottomNavItems.map((item) => renderNavItem(item))}
            
            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className={`
                flex items-center px-3 py-2.5 my-1 rounded-xl text-sm transition-all duration-200 w-full
                ${sidebarCollapsed && !isMobileView && !isTabletView ? 'justify-center' : ''}
              `}
              style={{
                backgroundColor: 'transparent',
                color: colors.textSecondary,
                border: `1px solid transparent`,
                fontWeight: 400,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = colors.sidebarHover;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              <div style={{ color: colors.textTertiary }}>
                <LogOut size={20} />
              </div>
              
              {(!sidebarCollapsed || isMobileView || isTabletView) && (
                <span className="ml-3">Logout</span>
              )}
            </button>
          </div>
          
          {/* Bottom SVG Illustration */}
          {(!sidebarCollapsed || isMobileView || isTabletView) && (
            <div className="px-4 pb-4">
              <div 
                className="rounded-xl p-4 text-center"
                style={{
                  backgroundColor: colors.primaryLight,
                }}
              >
                <div className="mx-auto mb-2 -mt-6 h-24 w-full flex justify-center">
                  <Image
                    src='/assets/academic-excellence.svg'
                    width={150}
                    height={150}
                    quality={100}
                    className={isDark ? 'brightness-110' : ''}
                    alt='svg'
                  />
                </div>
                <p 
                  className="text-xs font-medium"
                  style={{ color: colors.textPrimary }}
                >
                  Academic Excellence
                </p>
                <p 
                  className="text-xs mt-1"
                  style={{ color: colors.textPrimary }}
                >
                  Track your progress
                </p>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </>
  );
};

export default Sidebar;