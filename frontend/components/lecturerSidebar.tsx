"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { useLayout } from "./LayoutController";
import { useTheme, useThemeColors } from "@/context/ThemeContext";
import ThemeCustomizer from "./ThemeCustomizer";
import {
  LayoutDashboard,
  GraduationCap,
  MessageSquare,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  User,
  X,
} from "lucide-react";

interface SidebarProps {
  showMobileOnly?: boolean;
}

type NavItemType = {
  name: string;
  icon: React.ReactNode;
  path: string;
  badge?: number | string;
};

interface LecturerProfile {
  name: string;
  surname: string;
  email?: string;
  staff_number?: string;
  department?: string;
  title?: string;
}

const LecturerSidebar = ({ showMobileOnly = false }: SidebarProps) => {
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
    isTabletView,
  } = useLayout();

  const [mounted, setMounted] = useState(false);
  const [profile, setProfile] = useState<LecturerProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [overlayVisible, setOverlayVisible] = useState(false);

  const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "https://68.221.169.119/api/v1";

  const getInitials = (name: string, surname: string) => {
    return `${name.charAt(0)}${surname.charAt(0)}`.toUpperCase();
  };

  const getDisplayName = (profile: LecturerProfile) => {
    const title = profile.title;
    return `${title} ${profile.name} ${profile.surname}`;
  };

  const getStaffDisplay = (profile: LecturerProfile) => {
    if (profile.staff_number) {
      return `Staff ID: ${profile.staff_number}`;
    }
    return "Lecturer";
  };

  const fetchProfile = async () => {
    try {
      const response = await fetch(`${API_BASE}/auth/me`, {
        credentials: "include",
      });
      if (response.ok) {
        const data = await response.json();
        if (data && data.name && data.surname) {
          setProfile({
            name: data.name,
            surname: data.surname,
            email: data.email,
            staff_number: data.staff_number,
            department: data.department,
            title: data.title,
          });
        }
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      const response = await fetch(`${API_BASE}/auth/logout`, {
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

  useEffect(() => {
    if ((isMobileView || isTabletView) && isMobileMenuOpen) {
      setOverlayVisible(true);
    } else {
      setOverlayVisible(false);
    }
  }, [isMobileView, isTabletView, isMobileMenuOpen]);

  useEffect(() => {
    setMounted(true);
    fetchProfile();
  }, []);

  if (!mounted) return null;
  if (showMobileOnly && !isMobileView && !isTabletView) return null;
  if (!showMobileOnly && (isMobileView || isTabletView) && !isMobileMenuOpen) return null;

  const navItems: NavItemType[] = [
    {
      name: "Dashboard",
      icon: <LayoutDashboard size={20} />,
      path: "/lecturer/dashboard",
    },
    {
      name: "Courses",
      icon: <GraduationCap size={20} />,
      path: "/lecturer/courses",
    },
    {
      name: "Forum",
      icon: <MessageSquare size={20} />,
      path: "/lecturer/forums",
      badge: "New",
    },
  ];

  const bottomNavItems: NavItemType[] = [
    { name: "Profile", icon: <User size={20} />, path: "/lecturer/profile" },
    { name: "Settings", icon: <Settings size={20} />, path: "/lecturer/settings" },
  ];

  const renderOverlay = () => {
    if (overlayVisible) {
      return (
        <div
          className="fixed inset-0 bg-black/50 z-30 transition-opacity duration-300"
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
          ${sidebarCollapsed && !isMobileView && !isTabletView ? "justify-center" : ""}
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
              backgroundColor: typeof item.badge === "number" ? colors.primary : colors.warning,
            }}
          >
            {item.badge}
          </div>
        )}
      </Link>
    );
  };

  const UserProfileSection = () => {
    const isProfileVisible = !sidebarCollapsed || isMobileView || isTabletView;
    
    if (loading) {
      return (
        <div
          className="px-4 py-3 transition-opacity duration-300"
          style={{
            borderBottom: `1px solid ${colors.border}`,
            backgroundColor: colors.backgroundSecondary,
            opacity: isProfileVisible ? 1 : 0,
          }}
        >
          <div className="flex items-center">
            <div 
              className="h-10 w-10 rounded-xl animate-pulse"
              style={{ backgroundColor: colors.borderLight }}
            />
            <div className="ml-3 space-y-2 flex-1">
              <div 
                className="h-4 rounded animate-pulse"
                style={{ 
                  backgroundColor: colors.borderLight,
                  width: '60%'
                }}
              />
              <div 
                className="h-3 rounded animate-pulse"
                style={{ 
                  backgroundColor: colors.borderLight,
                  width: '40%'
                }}
              />
            </div>
          </div>
        </div>
      );
    }

    if (!profile) {
      return (
        <div
          className="px-4 py-3 transition-opacity duration-300"
          style={{
            borderBottom: `1px solid ${colors.border}`,
            backgroundColor: colors.backgroundSecondary,
            opacity: isProfileVisible ? 1 : 0,
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
              <User size={16} />
            </div>
            <div className="ml-3">
              <p 
                className="text-sm font-medium"
                style={{ color: colors.textPrimary }}
              >
                Loading...
              </p>
              <p 
                className="text-xs"
                style={{ color: colors.textSecondary }}
              >
                Please wait
              </p>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div
        className="px-4 py-3 transition-opacity duration-300"
        style={{
          borderBottom: `1px solid ${colors.border}`,
          backgroundColor: colors.backgroundSecondary,
          opacity: isProfileVisible ? 1 : 0,
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
              {getInitials(profile.name, profile.surname)}
            </p>
          </div>
          <div className="ml-3 overflow-hidden">
            <p
              className="text-sm font-medium truncate max-w-[140px]"
              style={{ color: colors.textPrimary }}
            >
              {getDisplayName(profile)}
            </p>
            <p
              className="text-xs truncate max-w-[140px]"
              style={{ color: colors.textSecondary }}
            >
              {getStaffDisplay(profile)}
            </p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      {renderOverlay()}
      <div
        className={`
          h-screen fixed left-0 top-0 z-40 flex flex-col shadow-xl transition-all duration-300
          ${(isMobileView || isTabletView) ? 'w-[270px]' : (sidebarCollapsed ? 'w-[80px]' : 'w-[240px]')}
          ${(isMobileView || isTabletView) && !isMobileMenuOpen ? '-translate-x-full' : 'translate-x-0'}
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
              <div className="flex items-center space-x-2">
                {(!sidebarCollapsed || isMobileView) && (
                  <Image
                    src="/assets/logo3.png"
                    alt="logo"
                    width={210}
                    height={180}
                    quality={100}
                    className={isDark ? 'brightness-110' : ''}
                  />
                )}
              </div>
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
              className="rounded-full p-1.5 transition-all duration-200"
              style={{
                color: colors.textSecondary,
                backgroundColor: 'transparent',
                transform: sidebarCollapsed ? 'rotate(0deg)' : 'rotate(180deg)',
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
        <UserProfileSection />

        {/* Navigation Section */}
        <div className="flex flex-col flex-1 overflow-y-auto py-4 custom-scrollbar">
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
                ${sidebarCollapsed && !isMobileView && !isTabletView ? "justify-center" : ""}
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
                    src='/assets/lec.svg'
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

        <style jsx>{`
          .custom-scrollbar::-webkit-scrollbar {
            width: 6px;
          }
          .custom-scrollbar::-webkit-scrollbar-track {
            background: ${colors.backgroundSecondary};
            border-radius: 3px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background: ${colors.border};
            border-radius: 3px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: ${colors.borderLight};
          }
        `}</style>
      </div>
    </>
  );
};

export default LecturerSidebar;