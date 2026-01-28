"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { useLayout } from "./LayoutController";
import { useTheme } from "@/context/ThemeContext";
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
    const title = profile.title || "Dr.";
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
    { name: "Settings", icon: <Settings size={20} />, path: "/settings" },
    { name: "Logout", icon: <LogOut size={20} />, path: "/logout" },
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
          backgroundColor: isActive 
            ? isDark ? 'rgba(16, 185, 129, 0.1)' : 'var(--color-primary-light)'
            : 'transparent',
          color: isActive 
            ? 'var(--color-primary)' 
            : 'var(--color-text-secondary)',
          border: isActive 
            ? `1px solid ${isDark ? 'rgba(16, 185, 129, 0.2)' : 'var(--color-primary-light)'}` 
            : '1px solid transparent',
          fontWeight: isActive ? 500 : 400,
        }}
        onMouseEnter={(e) => {
          if (!isActive) {
            e.currentTarget.style.backgroundColor = isDark 
              ? 'rgba(148, 163, 184, 0.05)' 
              : 'var(--color-background-secondary)';
          }
        }}
        onMouseLeave={(e) => {
          if (!isActive) {
            e.currentTarget.style.backgroundColor = 'transparent';
          }
        }}
      >
        <div style={{ color: isActive ? 'var(--color-primary)' : 'var(--color-text-tertiary)' }}>
          {item.icon}
        </div>

        {(!sidebarCollapsed || isMobileView || isTabletView) && (
          <span className="ml-3">{item.name}</span>
        )}

        {(!sidebarCollapsed || isMobileView || isTabletView) && item.badge && (
          <div
            className="ml-auto text-white text-xs px-2 py-0.5 rounded-full font-medium"
            style={{
              backgroundColor: typeof item.badge === "number"
                ? 'var(--color-primary)'
                : 'var(--color-warning)',
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
            borderBottom: `1px solid ${isDark ? '#1e293b' : '#e5e7eb'}`,
            backgroundColor: isDark ? '#0f172a' : '#f9fafb',
            opacity: isProfileVisible ? 1 : 0,
          }}
        >
          <div className="flex items-center">
            <div 
              className="h-10 w-10 rounded-xl animate-pulse"
              style={{ backgroundColor: isDark ? '#1e293b' : '#e5e7eb' }}
            />
            <div className="ml-3 space-y-2 flex-1">
              <div 
                className="h-4 rounded animate-pulse"
                style={{ 
                  backgroundColor: isDark ? '#1e293b' : '#e5e7eb',
                  width: '60%'
                }}
              />
              <div 
                className="h-3 rounded animate-pulse"
                style={{ 
                  backgroundColor: isDark ? '#1e293b' : '#e5e7eb',
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
            borderBottom: `1px solid ${isDark ? '#1e293b' : '#e5e7eb'}`,
            backgroundColor: isDark ? '#0f172a' : '#f9fafb',
            opacity: isProfileVisible ? 1 : 0,
          }}
        >
          <div className="flex items-center">
            <div
              className="h-10 w-10 rounded-xl flex items-center justify-center font-medium text-sm shadow-sm"
              style={{
                backgroundColor: isDark ? 'rgba(16, 185, 129, 0.15)' : 'var(--color-primary-light)',
                color: 'var(--color-primary)',
              }}
            >
              <User size={16} />
            </div>
            <div className="ml-3">
              <p 
                className="text-sm font-medium"
                style={{ color: isDark ? '#f8fafc' : '#1f2937' }}
              >
                Loading...
              </p>
              <p 
                className="text-xs"
                style={{ color: isDark ? '#94a3b8' : '#6b7280' }}
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
          borderBottom: `1px solid ${isDark ? '#1e293b' : '#e5e7eb'}`,
          backgroundColor: isDark ? '#0f172a' : '#f9fafb',
          opacity: isProfileVisible ? 1 : 0,
        }}
      >
        <div className="flex items-center">
          <div
            className="h-10 w-10 rounded-xl flex items-center justify-center font-medium text-sm shadow-sm"
            style={{
              backgroundColor: isDark ? 'rgba(16, 185, 129, 0.15)' : 'var(--color-primary-light)',
              color: 'var(--color-primary)',
            }}
          >
            {getInitials(profile.name, profile.surname)}
          </div>
          <div className="ml-3 overflow-hidden">
            <p
              className="text-sm font-medium truncate max-w-[140px]"
              style={{ color: isDark ? '#f8fafc' : '#1f2937' }}
            >
              {getDisplayName(profile)}
            </p>
            <p
              className="text-xs truncate max-w-[140px]"
              style={{ color: isDark ? '#94a3b8' : '#6b7280' }}
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
          backgroundColor: isDark ? '#0f172a' : '#ffffff',
          color: isDark ? '#f8fafc' : '#1f2937',
          borderRight: `1px solid ${isDark ? '#1e293b' : '#e5e7eb'}`,
        }}
      >
        {/* Header Section */}
        <div
          className="flex items-center mt-3 justify-between p-4"
          style={{ borderBottom: `1px solid ${isDark ? '#1e293b' : '#e5e7eb'}` }}
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
                color: isDark ? '#94a3b8' : '#6b7280',
                backgroundColor: 'transparent',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = isDark ? '#1e293b' : '#f3f4f6';
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
                color: isDark ? '#94a3b8' : '#6b7280',
                backgroundColor: 'transparent',
                transform: sidebarCollapsed ? 'rotate(0deg)' : 'rotate(180deg)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = isDark ? '#1e293b' : '#f3f4f6';
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
          </nav>

          {/* Bottom Navigation Section */}
          <div
            className="mt-auto px-3 py-4"
            style={{ borderTop: `1px solid ${isDark ? '#1e293b' : '#e5e7eb'}` }}
          >
            {bottomNavItems.map((item) => renderNavItem(item))}
          </div>

          {/* Bottom SVG Illustration */}
          {(!sidebarCollapsed || isMobileView || isTabletView) && (
            <div className="px-4 pb-4">
              <div
                className="rounded-xl p-4 text-center"
                style={{
                  background: isDark
                    ? 'linear-gradient(to bottom right, rgba(16, 185, 129, 0.1), rgba(20, 184, 166, 0.15))'
                    : 'linear-gradient(to bottom right, #d1fae5, #a7f3d0)',
                }}
              >
                <div className="mx-auto mb-2 -mt-6 h-24 w-full flex justify-center">
                  <svg
                    width="100"
                    height="100"
                    viewBox="0 0 100 100"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M50 87.5C70.7107 87.5 87.5 70.7107 87.5 50C87.5 29.2893 70.7107 12.5 50 12.5C29.2893 12.5 12.5 29.2893 12.5 50C12.5 70.7107 29.2893 87.5 50 87.5Z"
                      fill={isDark ? 'rgba(16, 185, 129, 0.1)' : '#E6F7F1'}
                    />
                    <path
                      d="M65 35H35C33.619 35 32.5 36.119 32.5 37.5V62.5C32.5 63.881 33.619 65 35 65H65C66.381 65 67.5 63.881 67.5 62.5V37.5C67.5 36.119 66.381 35 65 35Z"
                      stroke={isDark ? '#10b981' : '#047857'}
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M57.5 27.5V32.5"
                      stroke={isDark ? '#10b981' : '#047857'}
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M42.5 27.5V32.5"
                      stroke={isDark ? '#10b981' : '#047857'}
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M32.5 42.5H67.5"
                      stroke={isDark ? '#10b981' : '#047857'}
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path d="M45 50H40V55H45V50Z" fill={isDark ? '#10b981' : '#047857'} />
                    <path d="M55 50H50V55H55V50Z" fill={isDark ? '#10b981' : '#047857'} />
                    <path d="M45 57.5H40V62.5H45V57.5Z" fill={isDark ? '#10b981' : '#047857'} />
                    <path d="M55 57.5H50V62.5H55V57.5Z" fill={isDark ? '#10b981' : '#047857'} />
                    <path d="M65 50H60V55H65V50Z" fill={isDark ? '#10b981' : '#047857'} />
                  </svg>
                </div>
                <p
                  className="text-xs font-medium"
                  style={{ color: isDark ? '#10b981' : '#047857' }}
                >
                  Academic excellence
                </p>
                <p
                  className="text-xs mt-1"
                  style={{ color: isDark ? '#34d399' : '#059669' }}
                >
                  Track your courses
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
            background: ${isDark ? '#0f172a' : '#f3f4f6'};
            border-radius: 3px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background: ${isDark ? '#334155' : '#d1d5db'};
            border-radius: 3px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: ${isDark ? '#475569' : '#9ca3af'};
          }
        `}</style>
      </div>
    </>
  );
};

export default LecturerSidebar;