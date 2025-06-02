'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useLayout } from './LayoutController';
import {
  LayoutDashboard,
  Users,
  BookOpen,
  AlertCircle,
  BarChart2,
  Bell,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  X,
  GraduationCap,
  FileText
} from 'lucide-react';

interface AdminSidebarProps {
  showMobileOnly?: boolean;
}

const AdminSidebar = ({ showMobileOnly = false }: AdminSidebarProps) => {
  const pathname = usePathname();
  const { 
    sidebarCollapsed, 
    setSidebarCollapsed, 
    isMobileMenuOpen, 
    setMobileMenuOpen,
    isMobileView,
    isTabletView
  } = useLayout();
  
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  // Only show the mobile version if explicitly requested
  if (showMobileOnly && !isMobileView && !isTabletView) return null;

  // Hide desktop sidebar on mobile/tablet unless menu is open
  if (!showMobileOnly && (isMobileView || isTabletView) && !isMobileMenuOpen) return null;

  const navItems = [
    { name: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/admin/dashboard' },
    { name: 'User Management', icon: <Users size={20} />, path: '/admin/users' },
    { name: 'Units & Courses', icon: <BookOpen size={20} />, path: '/admin/courses' },
    { name: 'Account Issues', icon: <AlertCircle size={20} />, path: '/admin/issues' },
    { name: 'AI Tools Usage', icon: <FileText size={20} />, path: '/admin/ai-tools' },
    { name: 'Analytics', icon: <BarChart2 size={20} />, path: '/admin/analytics' },
    { name: 'Notifications', icon: <Bell size={20} />, path: '/admin/notifications', badge: 5 },
  ];

  const bottomNavItems = [
    { name: 'Settings', icon: <Settings size={20} />, path: '/admin/settings' },
    { name: 'Logout', icon: <LogOut size={20} />, path: '/logout' },
  ];

  const sidebarVariants = {
    desktop: {
      width: sidebarCollapsed ? 80 : 240,
      transition: { duration: 0.3, ease: "easeInOut" }
    },
    mobile: {
      x: 0,
      transition: { duration: 0.3, ease: "easeInOut" }
    },
    mobileHidden: {
      x: "-100%",
      transition: { duration: 0.3, ease: "easeInOut" }
    }
  };

  // Mobile/tablet overlay when sidebar is open
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
          h-screen fixed left-0 top-0 z-40 flex flex-col
          bg-gradient-to-b from-purple-500 to-purple-700 text-white shadow-xl
          ${(isMobileView || isTabletView) ? 'w-[270px]' : ''}
        `}
      >
        {/* Header Section */}
        <div className="flex items-center justify-between p-4 border-b border-purple-500/30">
          <div className="flex items-center">
            <div className="w-9 h-9 bg-white rounded-xl flex items-center justify-center shadow-md">
              <span className="text-purple-600 font-extrabold text-lg">E</span>
            </div>
            {(!sidebarCollapsed || isMobileView || isTabletView) && (
              <span className="ml-3 font-semibold text-lg tracking-wide">EduPortal</span>
            )}
          </div>
          
          {(isMobileView || isTabletView) ? (
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="text-white hover:bg-purple-600/50 rounded-full p-1.5 transition-colors"
            >
              <X size={18} />
            </button>
          ) : (
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="text-white hover:bg-purple-600/50 rounded-full p-1.5 transition-colors"
            >
              {sidebarCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
            </button>
          )}
        </div>

        {/* Navigation Section */}
        <div className="flex flex-col flex-1 overflow-y-auto py-4">
          <nav className="flex-1 px-3 space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.path;
              return (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`
                    flex items-center px-3 py-2.5 my-1 rounded-xl text-sm transition-all duration-200
                    ${isActive 
                      ? 'bg-white text-purple-600 shadow-md font-medium' 
                      : 'text-white hover:bg-purple-500/30'
                    }
                    ${sidebarCollapsed && !isMobileView && !isTabletView ? 'justify-center' : ''}
                  `}
                >
                  <div className={`${isActive ? 'text-purple-600' : 'text-white'}`}>
                    {item.icon}
                  </div>
                  
                  {(!sidebarCollapsed || isMobileView || isTabletView) && (
                    <span className={`ml-3 ${isActive ? 'font-medium' : ''}`}>{item.name}</span>
                  )}
                  
                  {item.badge && (!sidebarCollapsed || isMobileView || isTabletView) && (
                    <span className="ml-auto bg-red-500 text-white px-1.5 py-0.5 rounded-full text-xs">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
          
          {/* Bottom Navigation Section */}
          <div className="mt-auto px-3 py-4 border-t border-purple-500/30">
            {bottomNavItems.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                className={`
                  flex items-center px-3 py-2.5 my-1 rounded-xl text-sm transition-all duration-200
                  text-white hover:bg-purple-500/30
                  ${sidebarCollapsed && !isMobileView && !isTabletView ? 'justify-center' : ''}
                `}
              >
                <div className="text-white">{item.icon}</div>
                
                {(!sidebarCollapsed || isMobileView || isTabletView) && (
                  <span className="ml-3">{item.name}</span>
                )}
              </Link>
            ))}
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default AdminSidebar;