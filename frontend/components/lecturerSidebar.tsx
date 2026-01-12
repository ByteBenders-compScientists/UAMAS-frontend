/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { useLayout } from "./LayoutController";
import {
  LayoutDashboard,
  ClipboardList,
  GraduationCap,
  Library,
  MessageSquare,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  User,
  X,
} from "lucide-react";

// Import the SASS file
import "./LecturerSidebar.scss";

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

  // API Base URL
  const API_BASE =
    process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080/api/v1";

  // Get lecturer's initials for avatar
  const getInitials = (name: string, surname: string) => {
    return `${name.charAt(0)}${surname.charAt(0)}`.toUpperCase();
  };

  // Get display name without title for sidebar
  const getDisplayName = (profile: LecturerProfile) => {
    const title = profile.title || "Dr.";
    return `${title} ${profile.name} ${profile.surname}`;
  };

  // Get staff ID display
  const getStaffDisplay = (profile: LecturerProfile) => {
    if (profile.staff_number) {
      return `Staff ID: ${profile.staff_number}`;
    }
    return "Lecturer";
  };

  // Fetch lecturer profile
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

  // Get sidebar CSS classes
  const getSidebarClasses = () => {
    let classes = "sidebar-container h-screen fixed left-0 top-0 z-40 flex flex-col bg-white text-gray-700 shadow-xl border-r border-gray-200";
    
    if (isMobileView || isTabletView) {
      classes += " sidebar-mobile";
      classes += isMobileMenuOpen ? " sidebar-mobile-visible" : " sidebar-mobile-hidden";
    } else {
      classes += sidebarCollapsed ? " sidebar-collapsed" : " sidebar-expanded";
    }
    
    return classes;
  };

  // Handle overlay visibility
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

  // Only show the mobile version if explicitly requested
  if (showMobileOnly && !isMobileView && !isTabletView) return null;

  // Hide desktop sidebar on mobile/tablet unless menu is open
  if (!showMobileOnly && (isMobileView || isTabletView) && !isMobileMenuOpen)
    return null;

  // Main lecturer navigation – intentionally minimal to avoid duplication
  const navItems: NavItemType[] = [
    {
      name: "Dashboard",
      icon: <LayoutDashboard size={20} />,
      path: "/lecturer/dashboard",
    },
    {
      name: "Courses",
      icon: <GraduationCap size={20} />,
      // Route to the main teaching workspace where course/unit context is selected
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

  // Mobile/tablet overlay when sidebar is open
  const renderOverlay = () => {
    if (overlayVisible) {
      return (
        <div
          className={`sidebar-overlay fixed inset-0 bg-black/50 z-30 ${
            overlayVisible ? "overlay-enter-active" : "overlay-exit-active"
          }`}
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
          nav-item flex items-center px-3 py-2.5 my-1 rounded-xl text-sm focus-visible
          ${isActive ? "nav-item-active" : "text-gray-600"}
          ${
            sidebarCollapsed && !isMobileView && !isTabletView
              ? "justify-center"
              : ""
          }
        `}
      >
        <div className={`${isActive ? "text-emerald-600" : "text-gray-500"}`}>
          {item.icon}
        </div>

        {(!sidebarCollapsed || isMobileView || isTabletView) && (
          <span className={`ml-3 ${isActive ? "font-medium" : ""}`}>
            {item.name}
          </span>
        )}

        {(!sidebarCollapsed || isMobileView || isTabletView) && item.badge && (
          <div
            className={`nav-badge ml-auto ${
              typeof item.badge === "number" ? "bg-emerald-500" : "bg-amber-500"
            } text-white text-xs px-2 py-0.5 rounded-full`}
          >
            {item.badge}
          </div>
        )}
      </Link>
    );
  };

  // User Profile Section Component
  const UserProfileSection = () => {
    const isProfileVisible = !sidebarCollapsed || isMobileView || isTabletView;
    
    if (loading) {
      return (
        <div className={`profile-section px-4 py-3 border-b border-gray-200 bg-gray-50 ${
          isProfileVisible ? "profile-visible" : "profile-hidden"
        }`}>
          <div className="flex items-center">
            <div className="h-10 w-10 rounded-xl bg-gray-200 skeleton-loader"></div>
            <div className="ml-3 space-y-2">
              <div className="h-4 bg-gray-200 rounded skeleton-loader w-24"></div>
              <div className="h-3 bg-gray-200 rounded skeleton-loader w-20"></div>
            </div>
          </div>
        </div>
      );
    }

    if (!profile) {
      return (
        <div className={`profile-section px-4 py-3 border-b border-gray-200 bg-gray-50 ${
          isProfileVisible ? "profile-visible" : "profile-hidden"
        }`}>
          <div className="flex items-center">
            <div className="h-10 w-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600 font-medium text-sm shadow-sm">
              <User size={16} />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-800">Loading...</p>
              <p className="text-xs text-gray-500">Please wait</p>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className={`profile-section px-4 py-3 border-b border-gray-200 bg-gray-50 ${
        isProfileVisible ? "profile-visible" : "profile-hidden"
      }`}>
        <div className="flex items-center">
          <div className="h-10 w-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600 font-medium text-sm shadow-sm">
            {getInitials(profile.name, profile.surname)}
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-800 text-truncate-animated max-w-[140px]">
              {getDisplayName(profile)}
            </p>
            <p className="text-xs text-gray-500 text-truncate-animated max-w-[140px]">
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
      <div className={getSidebarClasses()}>
        {/* Header Section */}
        <div className="flex items-center mt-3 justify-between p-4 border-b border-gray-200">
          <div className="container mx-auto px-6">
            <div className="flex justify-between items-center h-16">
              <div className="logo-container flex items-center space-x-2">
                {(!sidebarCollapsed || isMobileView) && (
                  <Image
                    src="/assets/logo3.png"
                    alt="logo"
                    width={210}
                    height={180}
                    quality={100}
                  />
                )}
              </div>
            </div>
          </div>
          {(isMobileView || isTabletView) ? (
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="sidebar-toggle-btn text-gray-500 rounded-full p-1.5 focus-visible"
            >
              <X size={18} />
            </button>
          ) : (
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="sidebar-toggle-btn text-gray-500 rounded-full p-1.5 focus-visible"
            >
              <div className={`icon-rotate ${sidebarCollapsed ? "" : "rotate-180"}`}>
                {sidebarCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
              </div>
            </button>
          )}
        </div>

        {/* User Profile Section */}
        <UserProfileSection />

        {/* Navigation Section */}
        <div className="flex flex-col flex-1 overflow-y-auto py-4 nav-scroll-container">
          <nav className="nav-items-container flex-1 px-3 space-y-1">
            {navItems.map((item) => renderNavItem(item))}
          </nav>

          {/* Bottom Navigation Section */}
          <div className="mt-auto px-3 py-4 border-t border-gray-200">
            {bottomNavItems.map((item) => renderNavItem(item))}
          </div>

          {/* Bottom SVG Illustration */}
          <div className={`bottom-illustration px-4 pb-4 ${
            (!sidebarCollapsed || isMobileView || isTabletView) 
              ? "illustration-visible" 
              : "illustration-hidden"
          }`}>
            <div className="bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-xl p-4 text-center">
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
                    fill="#E6F7F1"
                  />
                  <path
                    d="M65 35H35C33.619 35 32.5 36.119 32.5 37.5V62.5C32.5 63.881 33.619 65 35 65H65C66.381 65 67.5 63.881 67.5 62.5V37.5C67.5 36.119 66.381 35 65 35Z"
                    stroke="#047857"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M57.5 27.5V32.5"
                    stroke="#047857"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M42.5 27.5V32.5"
                    stroke="#047857"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M32.5 42.5H67.5"
                    stroke="#047857"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path d="M45 50H40V55H45V50Z" fill="#047857" />
                  <path d="M55 50H50V55H55V50Z" fill="#047857" />
                  <path d="M45 57.5H40V62.5H45V57.5Z" fill="#047857" />
                  <path d="M55 57.5H50V62.5H55V57.5Z" fill="#047857" />
                  <path d="M65 50H60V55H65V50Z" fill="#047857" />
                </svg>
              </div>
              <p className="text-xs text-emerald-800 font-medium">
                Academic excellence
              </p>
              <p className="text-xs text-emerald-600 mt-1">
                Track your courses
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LecturerSidebar;