"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { useLayout } from "./LayoutController";
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

  const navItems: NavItemType[] = [

    {
      name: "Dashboard",
      icon: <LayoutDashboard size={20} />,
      path: "/lecturer/dashboard",
    },
    {
      name: "Assessments",
      icon: <ClipboardList size={20} />,
      path: "/lecturer/assessments",
      badge: 3,
    },
    {
      name: "Grades",
      icon: <GraduationCap size={20} />,
      path: "/lecturer/grades",
    },
    {
      name: "Students",
      icon: <User size={20} />,
      path: "/lecturer/students",
      badge: 5,
    },
    {
      name: "Course",
      icon: <GraduationCap size={20} />,
      path: "/lecturer/course",
      badge: 2,
    },
    { name: "Units", icon: <BookOpen size={20} />, path: "/lecturer/units" },
    { name: "Library", icon: <Library size={20} />, path: "/lecturer/library" },
    {
      name: "Forums",
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

  const sidebarVariants = {
    desktop: {
      width: sidebarCollapsed ? 80 : 240,
      transition: { duration: 0.3, ease: "easeInOut" },
    },
    mobile: {
      x: 0,
      transition: { duration: 0.3, ease: "easeInOut" },
    },
    mobileHidden: {
      x: "-100%",
      transition: { duration: 0.3, ease: "easeInOut" },
    },
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
          ${
            isActive
              ? "bg-emerald-50 text-emerald-700 border border-emerald-200 font-medium"
              : "text-gray-600 hover:bg-gray-50 hover:text-gray-800"
          }
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
            className={`ml-auto ${
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
    if (loading) {
      return (
        <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center">
            <div className="h-10 w-10 rounded-xl bg-gray-200 animate-pulse"></div>
            <div className="ml-3 space-y-2">
              <div className="h-4 bg-gray-200 rounded animate-pulse w-24"></div>
              <div className="h-3 bg-gray-200 rounded animate-pulse w-20"></div>
            </div>
          </div>
        </div>
      );
    }

    if (!profile) {
      return (
        <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
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
      <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center">
          <div className="h-10 w-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600 font-medium text-sm shadow-sm">
            {getInitials(profile.name, profile.surname)}
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-800 truncate max-w-[140px]">
              {getDisplayName(profile)}
            </p>
            <p className="text-xs text-gray-500 truncate max-w-[140px]">
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
      <motion.div
        initial={isMobileView || isTabletView ? "mobileHidden" : "desktop"}
        animate={
          isMobileView || isTabletView
            ? isMobileMenuOpen
              ? "mobile"
              : "mobileHidden"
            : "desktop"
        }
        variants={sidebarVariants}
        className={`
          h-screen fixed left-0 top-0 z-40 flex flex-col
          bg-white text-gray-700 shadow-xl border-r border-gray-200
          ${isMobileView || isTabletView ? "w-[270px]" : ""}
        `}
      >
        {/* Header Section */}
        <div className="flex items-center mt-3 justify-between p-4 border-b border-gray-200">
          <div className="flex items-center">
            <div className="w-9 h-9 bg-emerald-600 rounded-xl flex items-center justify-center shadow-md">
              <span className="text-white font-extrabold text-lg">E</span>
            </div>
            {(!sidebarCollapsed || isMobileView || isTabletView) && (
              <span className="ml-3 font-semibold text-lg tracking-wide text-gray-800">
                EduPortal
              </span>
            )}
          </div>

          {isMobileView || isTabletView ? (
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
              {sidebarCollapsed ? (
                <ChevronRight size={18} />
              ) : (
                <ChevronLeft size={18} />
              )}
            </button>
          )}
        </div>

        {/* User Profile Section */}
        {(!sidebarCollapsed || isMobileView || isTabletView) && (

          <UserProfileSection />

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
          )}
        </div>
      </motion.div>
    </>
  );
};

export default LecturerSidebar;
