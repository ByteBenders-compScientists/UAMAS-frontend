/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLayout } from '@/components/LayoutController';
import { useTheme, useThemeColors } from '@/context/ThemeContext';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import { 
  BookOpen, 
  ClipboardList, 
  Calendar,
  Users,
  Award,
  GraduationCap,
  Bell,
  ArrowRight,
  FileText,
  KeyRound,
  CheckCircle2,
  AlertCircle,
  X
} from 'lucide-react';
import Link from 'next/link';
import FloatingThemeButton from '@/components/FloatingThemeButton';

const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "https://68.221.169.119/api/v1"

type QuickLinkProps = {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
  href?: string;
  onClick?: () => void;
};

const QuickLink = ({ icon, title, description, color, href, onClick }: QuickLinkProps) => {
  const colors = useThemeColors();

  const content = (
    <div 
      className="rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer group"
      style={{
        backgroundColor: colors.cardBackground,
        border: `1px solid ${colors.border}`,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = colors.borderLight;
        e.currentTarget.style.backgroundColor = colors.cardHover;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = colors.border;
        e.currentTarget.style.backgroundColor = colors.cardBackground;
      }}
    >
      <div className={`w-12 h-12 ${color} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
        {icon}
      </div>
      <h3 
        className="font-semibold mb-1"
        style={{ color: colors.textPrimary }}
      >
        {title}
      </h3>
      <p 
        className="text-sm"
        style={{ color: colors.textSecondary }}
      >
        {description}
      </p>
      <div 
        className="flex items-center mt-3 text-sm font-medium group-hover:translate-x-1 transition-transform duration-300"
        style={{ color: colors.primary }}
      >
        <span>Explore</span>
        <ArrowRight size={14} className="ml-1" />
      </div>
    </div>
  );

  if (onClick) {
    return <div onClick={onClick} className="block">{content}</div>;
  }

  return href ? <Link href={href} className="block">{content}</Link> : <div className="block">{content}</div>;
};

export default function Dashboard() {
  const { 
    sidebarCollapsed, 
    isMobileView, 
    isTabletView 
  } = useLayout();

  const { config } = useTheme();
  const colors = useThemeColors();
  const isDark = config.mode === 'dark';

  const [hasContent, setHasContent] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [profile, setProfile] = useState<{ name: string; surname: string; reg_number: string } | null>(null);
  const [showJoinUnitModal, setShowJoinUnitModal] = useState(false);
  const [joinCode, setJoinCode] = useState("");
  const [isJoining, setIsJoining] = useState(false);
  const [joinError, setJoinError] = useState("");
  const [joinSuccess, setJoinSuccess] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
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

  const handleJoinUnit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!joinCode.trim()) {
      setJoinError("Join code is required");
      return;
    }

    setIsJoining(true);
    setJoinError("");
    setJoinSuccess("");

    try {
      const res = await fetch(`${apiBaseUrl}/auth/join-unit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ join_code: joinCode.trim() }),
      });

      const data = await res.json().catch(() => ({}));

      if (res.ok) {
        const unit = data.unit;
        setJoinSuccess(
          unit && unit.unit_name
            ? `You have successfully joined ${unit.unit_name} (${unit.unit_code || "unit"}).`
            : data.message || "You have successfully joined the unit."
        );
        setJoinCode("");
        setTimeout(() => {
          setShowJoinUnitModal(false);
          setJoinSuccess("");
        }, 2000);
      } else {
        setJoinError(
          data.error ||
          data.message ||
          (res.status === 404
            ? "No unit was found for that join code. Please check with your lecturer."
            : "Could not join unit. Please check the code and try again.")
        );
      }
    } catch (err) {
      console.error("Join unit error", err);
      setJoinError("Network error. Please check your connection and try again.");
    } finally {
      setIsJoining(false);
    }
  };

  const quickLinks = [
    {
      icon: <BookOpen size={24} className="text-white" />,
      title: "Learning Materials",
      description: "Access lecture notes, slides, and readings",
      color: "bg-emerald-500",
      href: "/student/unitworkspace?action=library"
    },
    {
      icon: <ClipboardList size={24} className="text-white" />,
      title: "Assignments",
      description: "View and submit your assignments",
      color: "bg-amber-500",
      href: "/student/unitworkspace?action=assignments"
    },
    {
      icon: <Award size={24} className="text-white" />,
      title: "CATS",
      description: "View and attempt your CATS (Continuous Assessment Tests)",
      color: "bg-violet-500",
      href: "/student/unitworkspace?action=cats"
    },
    {
      icon: <FileText size={24} className="text-white" />,
      title: "Submission",
      description: "Submit your coursework and projects",
      color: "bg-blue-500",
      href: "/student/unitworkspace?action=results"
    },
    {
      icon: <Users size={24} className="text-white" />,
      title: "Join Unit by Code",
      description: "Use a join code from your lecturer to join a class",
      color: "bg-rose-500",
      onClick: () => setShowJoinUnitModal(true)
    }
  ];

  return (
    <div 
      className="flex h-screen"
      style={{ backgroundColor: colors.background }}
    >
      <Sidebar />
      
      <motion.div 
        initial={{ 
          marginLeft: (!isMobileView && !isTabletView) ? (sidebarCollapsed ? 80 : 240) : 0 
        }}
        animate={{ 
          marginLeft: (!isMobileView && !isTabletView) ? (sidebarCollapsed ? 80 : 240) : 0 
        }}
        transition={{ duration: 0.3 }}
        className="flex-1 overflow-auto"
      >
        <Header title="Dashboard" showWeekSelector={hasContent} />
        
        <main className="p-4 md:p-6 lg:p-8">
          {isLoading ? (
            <div className="max-w-8xl mx-auto">
              <div className="animate-pulse space-y-8">
                <div 
                  className="h-32 rounded-xl"
                  style={{ backgroundColor: colors.cardBackground }}
                />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {[...Array(4)].map((_, i) => (
                    <div 
                      key={i} 
                      className="h-48 rounded-xl"
                      style={{ backgroundColor: colors.cardBackground }}
                    />
                  ))}
                </div>
                <div 
                  className="h-64 rounded-xl"
                  style={{ backgroundColor: colors.cardBackground }}
                />
              </div>
            </div>
          ) : !hasContent ? (
            <div className="max-w-8xl mx-auto">
              {/* Welcome Banner */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="mb-8 rounded-xl p-6 md:p-8 shadow-md text-white relative overflow-hidden"
                style={{
                  background: `linear-gradient(to bottom right, ${colors.primary}, ${colors.primaryHover})`,
                }}
              >
                <div className="absolute top-0 right-0 w-64 h-64 opacity-10">
                  <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                    <path fill="#FFFFFF" d="M47.5,-57.2C59.9,-45.8,67.3,-29.2,70.3,-11.9C73.2,5.5,71.7,23.5,63.1,38.3C54.5,53.1,39,64.6,21.2,71C3.4,77.5,-16.7,78.8,-33.3,71.2C-49.9,63.6,-63,47.1,-71.6,27.8C-80.1,8.5,-84.1,-13.7,-77.7,-32.2C-71.2,-50.7,-54.3,-65.5,-36.4,-74.9C-18.5,-84.2,0.3,-88.1,16.9,-83.5C33.5,-78.9,35.2,-68.7,47.5,-57.2Z" transform="translate(100 100)" />
                  </svg>
                </div>
                
                <div className="flex flex-col md:flex-row md:items-center md:justify-between relative z-10">
                  <div>
                    <h2 className="text-2xl md:text-3xl font-bold mb-2">
                      Welcome back, {profile ? `${profile.name} ${profile.surname}` : 'John Opondo'}!
                    </h2>
                    
                    <div 
                      className="mt-4 rounded-lg p-4 max-w-md"
                      style={{
                        backgroundColor: 'rgba(255, 255, 255, 0.2)',
                        backdropFilter: 'blur(10px)',
                      }}
                    >
                      <div className="flex items-start">
                        <Bell size={18} className="text-white mr-3 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-sm text-white">
                            Your portal is ready! Your lecturers will add course materials, assignments, and announcements soon. Check back regularly for updates.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="hidden md:block">
                    <div 
                      className="w-24 h-24 rounded-full flex items-center justify-center"
                      style={{
                        backgroundColor: 'rgba(255, 255, 255, 0.2)',
                        backdropFilter: 'blur(10px)',
                      }}
                    >
                      <GraduationCap size={40} className="text-white" />
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Quick Links */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <h3 
                  className="text-lg font-semibold mb-4"
                  style={{ color: colors.textPrimary }}
                >
                  Quick Access
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  {quickLinks.map((link, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.1 * (index + 1) }}
                    >
                      <QuickLink {...link} />
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Recent Activity Section */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="mb-8 rounded-xl p-6 shadow-sm"
                style={{
                  backgroundColor: colors.cardBackground,
                  border: `1px solid ${colors.border}`,
                }}
              >
                <h3 
                  className="text-lg font-semibold mb-6"
                  style={{ color: colors.textPrimary }}
                >
                  Recent Activity
                </h3>
                
                <div className="flex flex-col items-center justify-center py-12">
                  <div 
                    className="w-20 h-20 rounded-full flex items-center justify-center mb-4"
                    style={{
                      backgroundColor: colors.backgroundSecondary,
                      color: colors.textTertiary,
                    }}
                  >
                    <FileText size={32} />
                  </div>
                  <h4 
                    className="text-lg font-medium mb-2"
                    style={{ color: colors.textPrimary }}
                  >
                    No Recent Activity
                  </h4>
                  <p 
                    className="text-center max-w-md mb-6"
                    style={{ color: colors.textSecondary }}
                  >
                    Your recent activities, assignments, and notifications will appear here once your courses begin.
                  </p>
                  <button 
                    className="px-4 py-2 rounded-lg transition-colors font-medium text-sm"
                    style={{
                      backgroundColor: colors.primaryLight,
                      color: colors.textPrimary,
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = colors.primary;
                      e.currentTarget.style.color = '#ffffff';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = colors.primaryLight;
                      e.currentTarget.style.color = colors.primary;
                    }}
                  >
                    Explore Your Courses
                  </button>
                </div>
              </motion.div>

              {/* Upcoming Events */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="rounded-xl p-6 shadow-sm"
                style={{
                  backgroundColor: colors.cardBackground,
                  border: `1px solid ${colors.border}`,
                }}
              >
                <h3 
                  className="text-lg font-semibold mb-6"
                  style={{ color: colors.textPrimary }}
                >
                  Upcoming Events
                </h3>
                
                <div className="flex flex-col items-center justify-center py-12">
                  <div 
                    className="w-20 h-20 rounded-full flex items-center justify-center mb-4"
                    style={{
                      backgroundColor: colors.backgroundSecondary,
                      color: colors.textTertiary,
                    }}
                  >
                    <Calendar size={32} />
                  </div>
                  <h4 
                    className="text-lg font-medium mb-2"
                    style={{ color: colors.textPrimary }}
                  >
                    No Upcoming Events
                  </h4>
                  <p 
                    className="text-center max-w-md"
                    style={{ color: colors.textSecondary }}
                  >
                    Your schedule is clear. Events, deadlines, and important dates will be displayed here.
                  </p>
                </div>
              </motion.div>
            </div>
          ) : (
            <div className="max-w-8xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div 
                  className="md:col-span-2 rounded-xl p-6 shadow-sm"
                  style={{
                    backgroundColor: colors.cardBackground,
                    border: `1px solid ${colors.border}`,
                  }}
                >
                  <h3 
                    className="text-lg font-semibold mb-4"
                    style={{ color: colors.textPrimary }}
                  >
                    Recent Materials
                  </h3>
                </div>
                
                <div 
                  className="rounded-xl p-6 shadow-sm"
                  style={{
                    backgroundColor: colors.cardBackground,
                    border: `1px solid ${colors.border}`,
                  }}
                >
                  <h3 
                    className="text-lg font-semibold mb-4"
                    style={{ color: colors.textPrimary }}
                  >
                    Upcoming
                  </h3>
                </div>
              </div>
            </div>
          )}
        </main>
      </motion.div>

      {/* Join Unit Modal */}
      {showJoinUnitModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <div 
              className="fixed inset-0 bg-black/50 transition-opacity"
              onClick={() => {
                setShowJoinUnitModal(false);
                setJoinCode("");
                setJoinError("");
                setJoinSuccess("");
              }}
            />
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="relative w-full max-w-md rounded-2xl shadow-xl p-6 md:p-8"
              style={{
                backgroundColor: colors.cardBackground,
              }}
            >
              <button
                onClick={() => {
                  setShowJoinUnitModal(false);
                  setJoinCode("");
                  setJoinError("");
                  setJoinSuccess("");
                }}
                className="absolute top-4 right-4 transition-colors"
                style={{ color: colors.textTertiary }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = colors.textSecondary;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = colors.textTertiary;
                }}
              >
                <X size={20} />
              </button>

              <div className="flex items-center space-x-4 mb-4">
                <div className="w-12 h-12 rounded-xl bg-rose-100 border border-rose-200 flex items-center justify-center">
                  <KeyRound className="w-6 h-6 text-rose-600" />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-rose-600">
                    Join a unit
                  </p>
                  <h2 
                    className="text-xl font-semibold"
                    style={{ color: colors.textPrimary }}
                  >
                    Enter join code
                  </h2>
                </div>
              </div>

              <p 
                className="text-sm mb-6"
                style={{ color: colors.textSecondary }}
              >
                Ask your lecturer for the unit join code and paste it below. Once you join, the
                unit will appear in your courses and assessments.
              </p>

              <form onSubmit={handleJoinUnit} className="space-y-4">
                <div>
                  <label 
                    className="block text-sm font-medium mb-2"
                    style={{ color: colors.textPrimary }}
                  >
                    Unit join code
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={joinCode}
                      onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                      placeholder="e.g. ABCD1234"
                      className="w-full px-4 py-3 pr-10 rounded-lg text-sm transition-all"
                      style={{
                        backgroundColor: colors.inputBackground,
                        border: `1px solid ${colors.inputBorder}`,
                        color: colors.textPrimary,
                      }}
                      maxLength={16}
                      disabled={isJoining}
                      onFocus={(e) => {
                        e.currentTarget.style.borderColor = colors.inputFocus;
                        e.currentTarget.style.outline = '2px solid';
                        e.currentTarget.style.outlineColor = `${colors.primary}20`;
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.borderColor = colors.inputBorder;
                        e.currentTarget.style.outline = 'none';
                      }}
                    />
                    <KeyRound 
                      className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2"
                      style={{ color: colors.textTertiary }}
                    />
                  </div>
                </div>

                {joinError && (
                  <div 
                    className="flex items-start space-x-2 rounded-lg px-4 py-3 text-sm"
                    style={{
                      backgroundColor: `${colors.error}10`,
                      border: `1px solid ${colors.error}40`,
                      color: colors.error,
                    }}
                  >
                    <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                    <p>{joinError}</p>
                  </div>
                )}

                {joinSuccess && (
                  <div 
                    className="flex items-start space-x-2 rounded-lg px-4 py-3 text-sm"
                    style={{
                      backgroundColor: `${colors.success}10`,
                      border: `1px solid ${colors.success}40`,
                      color: colors.success,
                    }}
                  >
                    <CheckCircle2 className="w-5 h-5 mt-0.5 flex-shrink-0" />
                    <p>{joinSuccess}</p>
                  </div>
                )}

                <div className="flex space-x-3 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setShowJoinUnitModal(false);
                      setJoinCode("");
                      setJoinError("");
                      setJoinSuccess("");
                    }}
                    className="flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                    style={{
                      backgroundColor: colors.cardHover,
                      border: `1px solid ${colors.border}`,
                      color: colors.textPrimary,
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = colors.backgroundTertiary;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = colors.cardHover;
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isJoining || !joinCode.trim()}
                    className="flex-1 px-4 py-2 text-white rounded-lg text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    style={{
                      backgroundColor: colors.primary,
                    }}
                    onMouseEnter={(e) => {
                      if (!isJoining && joinCode.trim()) {
                        e.currentTarget.style.backgroundColor = colors.primaryHover;
                      }
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = colors.primary;
                    }}
                  >
                    {isJoining ? (
                      <span className="flex items-center justify-center">
                        <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                        Joining...
                      </span>
                    ) : (
                      "Join Unit"
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        </div>
      )}
      <FloatingThemeButton/>
    </div>
  );
}