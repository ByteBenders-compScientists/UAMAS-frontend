/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  BookMarked,
  BarChart3,
  Clock,
  Users,
  Bell,
  Menu,
  User,
  GraduationCap,
  FileText,
  MessageSquare,
  CheckCircle,
  BookOpen,
  ChevronRight,
  TrendingUp,
  PlusCircle,
  ClipboardList,
  Library,
  Copy,
  Sparkles,
  Zap,
} from "lucide-react";
import Sidebar from "@/components/lecturerSidebar";
import { useLayout } from "@/components/LayoutController";
import { useTheme, useThemeColors } from "@/context/ThemeContext";
import FloatingThemeButton from "@/components/FloatingThemeButton";

// ===== TYPES =====
interface StatData {
  icon: React.ElementType;
  label: string;
  value: string;
  change?: number;
  changeLabel?: string;
  color?: string;
}

interface Course {
  id: string;
  name: string;
  code: string;
  department: string;
  school: string;
  units: Unit[];
}

interface Unit {
  id: string;
  unit_name: string;
  unit_code: string;
  level: number;
  semester: number;
  course_id: string;
}

interface Student {
  id: string;
  firstname: string;
  surname: string;
  othernames: string;
  reg_number: string;
  year_of_study: number;
  semester: number;
  course: {
    id: string;
    name: string;
  };
  units: Unit[];
}

interface Assessment {
  id: string;
  title: string;
  type: string;
  description: string;
  total_marks: number;
  deadline: string;
  status: string;
  verified: boolean;
  questions: unknown[];
  unit_id: string;
}

interface Submission {
  submission_id: string;
  student_id: string;
  assessment_id: string;
  graded: boolean;
  total_marks: number;
  results: unknown[];
}

interface QuickActionCard {
  icon: React.ElementType;
  title: string;
  description: string;
  path: string;
  color: string;
  iconBg: string;
}

interface LecturerProfile {
  name: string;
  surname: string;
  email?: string;
  staff_number?: string;
  department?: string;
  title?: string;
}

// Creative Loading Component
const CreativeLoader: React.FC = () => {
  const colors = useThemeColors();
  
  return (
    <div 
      className="min-h-screen flex items-center justify-center"
      style={{ background: colors.background }}
    >
      <div className="relative">
        {/* Orbiting particles */}
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute inset-0"
            animate={{ rotate: 360 }}
            transition={{ 
              duration: 2 + i, 
              repeat: Infinity, 
              ease: "linear",
              delay: i * 0.2
            }}
          >
            <div 
              className="w-32 h-32 rounded-full border-2"
              style={{ 
                borderColor: i === 0 ? `${colors.primary}40` : i === 1 ? `${colors.secondary}40` : `${colors.accent}40`,
                borderTopColor: 'transparent',
                borderRightColor: 'transparent'
              }}
            />
          </motion.div>
        ))}

        {/* Center animated icon */}
        <motion.div
          className="relative w-32 h-32 flex items-center justify-center"
          animate={{ 
            scale: [1, 1.15, 1],
            rotate: [0, 180, 360]
          }}
          transition={{ 
            duration: 3, 
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <div 
            className="w-20 h-20 rounded-2xl flex items-center justify-center shadow-lg"
            style={{ 
              background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`
            }}
          >
            <motion.div
              animate={{ rotate: [0, -180, -360] }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              <Zap 
                className="w-10 h-10"
                style={{ color: colors.background }}
              />
            </motion.div>
          </div>
        </motion.div>

        {/* Pulsing rings */}
        {[...Array(2)].map((_, i) => (
          <motion.div
            key={`ring-${i}`}
            className="absolute inset-0 rounded-full border-2"
            style={{ 
              borderColor: `${colors.primary}30`,
            }}
            animate={{ 
              scale: [1, 1.5, 1],
              opacity: [0.5, 0, 0.5]
            }}
            transition={{ 
              duration: 2, 
              repeat: Infinity,
              delay: i * 1,
              ease: "easeOut"
            }}
          />
        ))}

        {/* Loading text */}
        <motion.div
          className="absolute -bottom-16 left-1/2 transform -translate-x-1/2 whitespace-nowrap"
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="flex items-center gap-2">
            <Sparkles 
              className="w-5 h-5"
              style={{ color: colors.primary }}
            />
            <span 
              className="text-lg font-bold"
              style={{ color: colors.textPrimary }}
            >
              Loading Dashboard
            </span>
            <Sparkles 
              className="w-5 h-5"
              style={{ color: colors.secondary }}
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
};

// Main Dashboard Component with proper sidebar integration
const LecturerDashboard: React.FC = () => {
  const router = useRouter();
  const { isLoading: themeLoading } = useTheme();
  const colors = useThemeColors();

  const {
    sidebarCollapsed,
    isMobileMenuOpen,
    setMobileMenuOpen,
    isMobileView,
    isTabletView,
  } = useLayout();

  const [courses, setCourses] = useState<Course[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [submissions] = useState<Submission[]>([]);
  const [, setUnits] = useState<Unit[]>([]);
  const [profile, setProfile] = useState<LecturerProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [lecturerProfile, setLecturerProfile] = useState<LecturerProfile | null>(null);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // API Base URL
  const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080/api/v1";

  // Navigation handler
  const handleNavigation = (path: string) => {
    router.push(path);
  };

  // Get lecturer's initials for avatar
  const getInitials = (name: string, surname: string) => {
    return `${name.charAt(0)}${surname.charAt(0)}`.toUpperCase();
  };

  // Copy to clipboard handler
  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
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
    }
  };

  // Fetch data functions
  const fetchCourses = async () => {
    try {
      const response = await fetch(`${API_BASE}/auth/lecturer/courses`, {
        credentials: "include",
      });
      if (response.ok) {
        const data = await response.json();
        setCourses(data);
      }
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };

  const fetchStudents = async () => {
    try {
      const response = await fetch(`${API_BASE}/auth/lecturer/students`, {
        credentials: "include",
      });
      if (response.ok) {
        const data = await response.json();
        setStudents(data);
      }
    } catch (error) {
      console.error("Error fetching students:", error);
    }
  };

  const fetchAssessments = async () => {
    try {
      const response = await fetch(`${API_BASE}/bd/lecturer/assessments`, {
        credentials: "include",
      });
      if (response.ok) {
        const data = await response.json();
        setAssessments(data);
      }
    } catch (error) {
      console.error("Error fetching assessments:", error);
    }
  };

  const fetchUnits = async () => {
    try {
      const response = await fetch(`${API_BASE}/auth/lecturer/units`, {
        credentials: "include",
      });
      if (response.ok) {
        const data = await response.json();
        setUnits(data);
      }
    } catch (error) {
      console.error("Error fetching units:", error);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([
        fetchProfile(),
        fetchCourses(),
        fetchStudents(),
        fetchAssessments(),
        fetchUnits(),
      ]);
      setLoading(false);
    };

    loadData();
  }, []);

  useEffect(() => {
    fetch(`${API_BASE}/auth/me`, { credentials: 'include' })
      .then(res => res.ok ? res.json() : null)
      .then(data => setLecturerProfile(data))
      .catch(() => setLecturerProfile(null));
  }, []);

  // Calculate statistics
  const statsData: StatData[] = [
    {
      icon: Users,
      label: "Total Students",
      value: students.length.toString(),
      change: 5,
      changeLabel: "+12%",
      color: colors.primary,
    },
    {
      icon: FileText,
      label: "Active Assessments",
      value: assessments.filter((a) => a.status === "start").length.toString(),
      change: -2,
      changeLabel: "+5%",
      color: colors.success,
    },
    {
      icon: Clock,
      label: "Pending Reviews",
      value: submissions.filter((s) => !s.graded).length.toString(),
      change: 3,
      changeLabel: "+2%",
      color: colors.warning,
    },
    {
      icon: BookMarked,
      label: "Courses Teaching",
      value: courses.length.toString(),
      change: 0,
      changeLabel: "+8%",
      color: colors.secondary,
    },
  ];

  // Quick actions with navigation paths
  const quickActions: QuickActionCard[] = [
    {
      icon: PlusCircle,
      title: "Create Assessment",
      description: "Generate new assignments and CATs with AI",
      path: "/lecturer/courses",
      color: colors.primary,
      iconBg: `${colors.primary}20`,
    },
    {
      icon: Users,
      title: "Manage Students",
      description: "View students who have joined your units",
      path: "/lecturer/students",
      color: colors.success,
      iconBg: `${colors.success}20`,
    },
    {
      icon: GraduationCap,
      title: "Course Management",
      description: "Create and manage your courses",
      path: "/lecturer/course",
      color: colors.secondary,
      iconBg: `${colors.secondary}20`,
    },
    {
      icon: ClipboardList,
      title: "Grade Submissions",
      description: "Review and grade student work",
      path: "/lecturer/submission",
      color: colors.warning,
      iconBg: `${colors.warning}20`,
    },
    {
      icon: BookOpen,
      title: "Manage Units",
      description: "Organize your teaching units",
      path: "/lecturer/units",
      color: colors.accent,
      iconBg: `${colors.accent}20`,
    },
    {
      icon: Library,
      title: "Library Resources",
      description: "Access teaching materials and resources",
      path: "/lecturer/library",
      color: colors.error,
      iconBg: `${colors.error}20`,
    },
    {
      icon: MessageSquare,
      title: "Discussion Forums",
      description: "Engage with students in forums",
      path: "/lecturer/forums",
      color: colors.info,
      iconBg: `${colors.info}20`,
    },
    {
      icon: BarChart3,
      title: "Analytics",
      description: "View performance analytics",
      path: "/lecturer/analytics",
      color: colors.primary,
      iconBg: `${colors.primary}20`,
    },
  ];

  // Components
  const TopHeader: React.FC = () => (
    <header 
      className="border-b shadow-sm sticky top-0 z-20"
      style={{
        background: colors.cardBackground,
        borderColor: colors.border
      }}
    >
      <div className="flex items-center justify-between px-4 lg:px-6 py-4">
        <div className="flex items-center space-x-3">
          {(isMobileView || isTabletView) && (
            <button
              className="transition-colors"
              onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle sidebar"
              style={{ color: colors.primary }}
            >
              <Menu className="w-6 h-6" />
            </button>
          )}
          <div className="hidden sm:block">
            <h1 
              className="text-xl font-bold"
              style={{ color: colors.textPrimary }}
            >
              Dashboard
            </h1>
            <p 
              className="text-sm"
              style={{ color: colors.textSecondary }}
            >
              Welcome back, {lecturerProfile ? `${lecturerProfile.name} ${lecturerProfile.surname}` : '...'}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <button 
            className="relative transition-colors"
            style={{ color: colors.textSecondary }}
          >
            <Bell className="w-6 h-6" />
            <span 
              className="absolute -top-1 -right-1 text-xs rounded-full px-1.5 py-0.5"
              style={{
                background: colors.primary,
                color: colors.background
              }}
            >
              3
            </span>
          </button>

          <div className="flex items-center space-x-2">
            <div 
              className="w-8 h-8 rounded-full flex items-center justify-center"
              style={{ background: `${colors.primary}30` }}
            >
              {profile ? (
                <span 
                  className="text-sm font-semibold"
                  style={{ color: colors.primary }}
                >
                  {getInitials(profile.name, profile.surname)}
                </span>
              ) : (
                <User className="w-4 h-4" style={{ color: colors.primary }} />
              )}
            </div>
            <span 
              className="text-sm font-semibold hidden md:inline"
              style={{ color: colors.textPrimary }}
            >
              {lecturerProfile ? `${lecturerProfile.name} ${lecturerProfile.surname}` : '...'}
            </span>
          </div>
        </div>
      </div>
    </header>
  );

  const HeroSection: React.FC = () => (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="rounded-xl p-6 lg:p-8 mb-6 text-white relative overflow-hidden"
      style={{
        background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`
      }}
    >
      <div className="relative z-10">
        <h1 className="text-xl lg:text-3xl font-bold mb-2">
          Welcome back, {lecturerProfile ? `${lecturerProfile.name} ${lecturerProfile.surname}` : '...'}
        </h1>
        <p 
          className="mb-4"
          style={{ color: `${colors.background}e6` }}
        >
          Manage your courses and engage with students efficiently
        </p>
        {profile && profile.department && (
          <div 
            className="flex items-center space-x-2 px-3 py-2 rounded-lg w-fit mb-4"
            style={{ background: `${colors.background}20` }}
          >
            <GraduationCap className="w-4 h-4" />
            <span className="text-sm">
              {profile.department}
              {profile.staff_number && ` • Staff ID: ${profile.staff_number}`}
            </span>
          </div>
        )}
        <div 
          className="flex items-center space-x-2 px-3 py-2 rounded-lg w-fit"
          style={{ background: `${colors.background}20` }}
        >
          <CheckCircle className="w-4 h-4" />
          <span className="text-sm">
            {courses.length} active courses • {students.length} students enrolled
          </span>
        </div>
      </div>
      <div 
        className="absolute top-0 right-0 w-32 lg:w-64 h-32 lg:h-64 rounded-full -translate-y-16 lg:-translate-y-32 translate-x-16 lg:translate-x-32"
        style={{ background: `${colors.background}10` }}
      ></div>
    </motion.div>
  );

  const StatsCard: React.FC<{ stat: StatData; index: number }> = ({ stat, index }) => (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 + index * 0.1 }}
      className="rounded-xl shadow-sm border p-4 lg:p-6 hover:shadow-md transition-all duration-300"
      style={{
        background: colors.cardBackground,
        borderColor: colors.border
      }}
      whileHover={{ y: -4 }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div
            className="p-2 lg:p-3 rounded-full"
            style={{ background: `${stat.color}20` }}
          >
            <stat.icon 
              className="w-5 h-5 lg:w-6 lg:h-6"
              style={{ color: stat.color }}
            />
          </div>
          <div>
            <div 
              className="text-xl lg:text-2xl font-bold"
              style={{ color: colors.textPrimary }}
            >
              {stat.value}
            </div>
            <div 
              className="text-xs lg:text-sm"
              style={{ color: colors.textSecondary }}
            >
              {stat.label}
            </div>
          </div>
        </div>
        {stat.changeLabel && (
          <div className="flex items-center space-x-1">
            <TrendingUp 
              className="w-3 h-3 lg:w-4 lg:h-4"
              style={{ color: colors.success }}
            />
            <span 
              className="text-xs lg:text-sm font-semibold"
              style={{ color: colors.success }}
            >
              {stat.changeLabel}
            </span>
          </div>
        )}
      </div>
    </motion.div>
  );

  const QuickActionsGrid: React.FC = () => (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="rounded-xl shadow-sm border p-4 lg:p-6 mb-6"
      style={{
        background: colors.cardBackground,
        borderColor: colors.border
      }}
    >
      <div className="flex items-center justify-between mb-6">
        <h2 
          className="text-xl font-bold"
          style={{ color: colors.textPrimary }}
        >
          Quick Actions
        </h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {quickActions.map((action, index) => (
          <motion.button
            key={action.title}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6 + index * 0.05 }}
            onClick={() => handleNavigation(action.path)}
            className="text-left p-4 rounded-xl border transition-all duration-300 group"
            style={{
              background: colors.backgroundSecondary,
              borderColor: colors.borderLight
            }}
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
          >
            <div 
              className="w-12 h-12 rounded-xl flex items-center justify-center mb-3 transition-all duration-300"
              style={{ background: action.iconBg }}
            >
              <action.icon 
                className="w-6 h-6"
                style={{ color: action.color }}
              />
            </div>
            <h3 
              className="font-semibold mb-1"
              style={{ color: colors.textPrimary }}
            >
              {action.title}
            </h3>
            <p 
              className="text-sm"
              style={{ color: colors.textSecondary }}
            >
              {action.description}
            </p>
            <div className="mt-3 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <span 
                className="text-xs font-medium"
                style={{ color: action.color }}
              >
                Get started
              </span>
              <ChevronRight 
                className="w-4 h-4"
                style={{ color: action.color }}
              />
            </div>
          </motion.button>
        ))}
      </div>
    </motion.div>
  );

  const UnitsJoinCodeSection: React.FC = () => {
    const unitsWithCourse = courses.flatMap((course) =>
      (course.units || []).map((unit) => ({ course, unit }))
    );

    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="rounded-xl shadow-sm border p-4 lg:p-6"
        style={{
          background: colors.cardBackground,
          borderColor: colors.border
        }}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 
            className="text-xl font-bold"
            style={{ color: colors.textPrimary }}
          >
            Unit Join Codes
          </h2>
          <button
            onClick={() => handleNavigation("/lecturer/course")}
            className="text-sm font-medium hover:underline"
            style={{ color: colors.primary }}
          >
            Manage units
          </button>
        </div>
        {unitsWithCourse.length === 0 ? (
          <div 
            className="text-center py-8 text-sm"
            style={{ color: colors.textSecondary }}
          >
            <p>No units found.</p>
            <p className="mt-1">
              Create courses and units in Course Management to generate join codes for students.
            </p>
          </div>
        ) : (
          <div className="space-y-3 max-h-72 overflow-y-auto">
            {unitsWithCourse.slice(0, 8).map(({ course, unit }, index) => (
              <motion.div
                key={unit.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8 + index * 0.05 }}
                className="flex items-start justify-between p-3 rounded-lg border transition-all duration-300"
                style={{
                  background: colors.backgroundSecondary,
                  borderColor: colors.borderLight
                }}
                whileHover={{ x: 4 }}
              >
                <div className="flex-1 min-w-0">
                  <div 
                    className="text-sm font-medium truncate"
                    style={{ color: colors.textPrimary }}
                  >
                    {unit.unit_code} - {unit.unit_name}
                  </div>
                  <div 
                    className="text-xs mt-1"
                    style={{ color: colors.textSecondary }}
                  >
                    {course.name} • Level {unit.level} • Sem {unit.semester}
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <code 
                      className="text-xs font-mono px-2 py-1 rounded"
                      style={{
                        background: `${colors.primary}15`,
                        color: colors.primary
                      }}
                    >
                      {unit.id}
                    </code>
                    <motion.button
                      onClick={() => handleCopyCode(unit.id)}
                      className="p-1 rounded transition-colors"
                      style={{
                        background: copiedCode === unit.id ? `${colors.success}20` : 'transparent',
                        color: copiedCode === unit.id ? colors.success : colors.textSecondary
                      }}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Copy className="w-3 h-3" />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    );
  };

  // Show loading screen while theme or data is loading
  if (themeLoading || loading) {
    return <CreativeLoader />;
  }

  return (
    <div 
      className="min-h-screen flex"
      style={{ background: colors.background }}
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
        className="flex-1 flex flex-col"
      >
        <TopHeader />
        
        <main className="flex-1 p-4 lg:p-6">
          <div className="max-w-7xl mx-auto">
            <HeroSection />

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-6">
              {statsData.map((stat, index) => (
                <StatsCard key={stat.label} stat={stat} index={index} />
              ))}
            </div>

            {/* Quick Actions */}
            <QuickActionsGrid />

            {/* Unit Join Codes */}
            <UnitsJoinCodeSection />
          </div>
        </main>
      </motion.div>
      <FloatingThemeButton/>
    </div>
  );
};

export default LecturerDashboard;