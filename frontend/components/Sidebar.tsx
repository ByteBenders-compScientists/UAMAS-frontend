'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useLayout } from './LayoutController';
import {
  LayoutDashboard,
  BookOpen,
  ClipboardList,
  GraduationCap,
  Calendar,
  Library,
  MessageSquare,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  User,
  X,
  LucideIcon,
  FileText
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

const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080/api/v1";

const Sidebar = ({ showMobileOnly = false }: SidebarProps) => {
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
  const [profile, setProfile] = useState<{ name: string; surname: string; reg_number: string } | null>(null);

  useEffect(() => {
    setMounted(true);
    // Fetch student profile
   
    fetch(`${apiBaseUrl}/auth/me`, {
      main
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

  // Only show the mobile version if explicitly requested
  if (showMobileOnly && !isMobileView && !isTabletView) return null;

  // Hide desktop sidebar on mobile/tablet unless menu is open
  if (!showMobileOnly && (isMobileView || isTabletView) && !isMobileMenuOpen) return null;

  const navItems: NavItemType[] = [
    { name: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/student/dashboard' },
    { name: 'My CATs', icon: <BookOpen size={20} />, path: '/student/cats' },
    { name: 'Assignments', icon: <ClipboardList size={20} />, path: '/student/assignments', badge: 3 },
    { name: 'Results', icon: <FileText size={20} />, path: '/student/submission' },
    { name: 'My Units', icon: <Calendar size={20} />, path: '/student/units' },
    { name: 'Library', icon: <Library size={20} />, path: '/student/library' },
    { name: 'Forums', icon: <MessageSquare size={20} />, path: '/student/forums', badge: 'New' },
  ];

  const bottomNavItems: NavItemType[] = [
    { name: 'Profile', icon: <User size={20} />, path: '/student/profile' },
    { name: 'Settings', icon: <Settings size={20} />, path: '/settings' },
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

  const renderNavItem = (item: NavItemType) => {
    const isActive = pathname === item.path;
    
    return (
      <Link
        key={item.path}
        href={item.path}
        className={`
          flex items-center px-3 py-2.5 my-1 rounded-xl text-sm transition-all duration-200
          ${isActive 
            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 font-medium' 
            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-800'
          }
          ${sidebarCollapsed && !isMobileView && !isTabletView ? 'justify-center' : ''}
        `}
      >
        <div className={`${isActive ? 'text-emerald-600' : 'text-gray-500'}`}>
          {item.icon}
        </div>
        
        {(!sidebarCollapsed || isMobileView || isTabletView) && (
          <span className={`ml-3 ${isActive ? 'font-medium' : ''}`}>{item.name}</span>
        )}
        
        {(!sidebarCollapsed || isMobileView || isTabletView) && item.badge && (
          <div className={`ml-auto ${typeof item.badge === 'number' ? 'bg-emerald-500' : 'bg-amber-500'} text-white text-xs px-2 py-0.5 rounded-full`}>
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
          h-screen fixed left-0 top-0 z-40 flex flex-col
          bg-white text-gray-700 shadow-xl border-r border-gray-200
          ${(isMobileView || isTabletView) ? 'w-[270px]' : ''}
        `}
      >
        {/* Header Section */}
        <div className="flex items-center mt-3 justify-between p-4 border-b border-gray-200">
          <div className="flex items-center">
            {(!sidebarCollapsed || isMobileView || isTabletView) && (
              <span className="ml-3 font-semibold text-lg tracking-wide text-gray-800">
                 <Image
                src="/assets/logo.png"
                alt="logo"
                width={180}
                height={160}
                quality={100}
                />
              </span>
            )}
          </div>
          
          {(isMobileView || isTabletView) ? (
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="text-gray-500 hover:bg-gray-100 rounded-full p-1.5 transition-colors"
            >
              <X size={18} />
            </button>
          ) : (
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="text-gray-500 hover:bg-gray-100 rounded-full p-1.5 transition-colors"
            >
              {sidebarCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
            </button>
          )}
        </div>

        {/* User Profile Section */}
        {(!sidebarCollapsed || isMobileView || isTabletView) && (
          <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
            <div className="flex items-center">
              <div className="h-10 w-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600 font-medium text-sm shadow-sm">
                {profile ? (profile.name[0] + (profile.surname ? profile.surname[0] : '')) : 'JO'}
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-800">{profile ? `${profile.name} ${profile.surname}` : 'John Opondo'}</p>
                <p className="text-xs text-gray-500">Student ID: {profile ? profile.reg_number : '2028061'}</p>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Section */}
        <div className="flex flex-col flex-1 overflow-y-auto py-4">
          <nav className="flex-1 px-3 space-y-1">
            {navItems.map((item) => renderNavItem(item))}
          </nav>
          
          {/* Bottom Navigation Section */}
          <div className="mt-auto px-3 py-4 border-t border-gray-200">
            {bottomNavItems.map((item) => renderNavItem(item))}
          </div>
          
          {/* Bottom SVG Illustration */}
          {(!sidebarCollapsed || isMobileView || isTabletView) && (
            <div className="px-4 pb-4">
              <div className="bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-xl p-4 text-center">
                {/* We'll use an inline SVG instead of an Image component */}
                <div className="mx-auto mb-2 -mt-6 h-24 w-full flex justify-center">
                  <Image
                  src='/assets/academic-excellence.svg'
                  width={150}
                  height={150}
                  quality={100}
                  className=''
                  alt='svg'
                  />
                </div>
                <p className="text-xs text-emerald-800 font-medium">Academic Excellence</p>
                <p className="text-xs text-emerald-600 mt-1">Track your progress</p>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </>
  );
};

export default Sidebar;