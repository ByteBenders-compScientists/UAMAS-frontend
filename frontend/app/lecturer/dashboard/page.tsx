"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; // For Next.js routing
// import { useNavigate } from "react-router-dom"; // For React Router (uncomment if using React Router)
import {
  BookMarked,
  BarChart3,
  Clock,
  Monitor,
  Users,
  Bell,
  Menu,
  User,
  GraduationCap,
  FileText,
  MessageSquare,
  Calendar,
  CheckCircle,
  AlertCircle,
  BookOpen,
  ChevronRight,
  TrendingUp,
  Activity,
  PlusCircle,
  ClipboardList,
  Star,
  Award,
  Upload,
  Eye,
  Edit,
  Trash2,
  Plus,
  Download,
  Filter,
  Search,
  Library,
} from "lucide-react";
import Sidebar from "@/components/lecturerSidebar";
import { useLayout } from "@/components/LayoutController";

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
  questions: any[];
  unit_id: string;
}

interface Submission {
  submission_id: string;
  student_id: string;
  assessment_id: string;
  graded: boolean;
  total_marks: number;
  results: any[];
}

interface QuickActionCard {
  icon: React.ElementType;
  title: string;
  description: string;
  path: string; // Changed from onClick to path
  color: string;
  iconBg: string;
}

// Main Dashboard Component with proper sidebar integration
const LecturerDashboard: React.FC = () => {
  const router = useRouter(); // For Next.js
  // const navigate = useNavigate(); // For React Router (uncomment if using React Router)
  
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
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [units, setUnits] = useState<Unit[]>([]);
  const [loading, setLoading] = useState(true);
  const [lecturerProfile, setLecturerProfile] = useState<any>(null);

  // API Base URL
  const API_BASE = "http://localhost:8080/api/v1";

  // Navigation handler
  const handleNavigation = (path: string) => {
    router.push(path); // For Next.js
    // navigate(path); // For React Router (uncomment if using React Router)
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
    fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080/api/v1"}/auth/me`, { credentials: 'include' })
      .then(res => res.ok ? res.json() : null)
      .then(data => setLecturerProfile(data))
      .catch(() => setLecturerProfile(null));
  }, []);

  // Calculate proper margin based on sidebar state
  const getMainContentMargin = () => {
    if (isMobileView || isTabletView) {
      return "ml-0"; // No margin on mobile/tablet
    }
    return sidebarCollapsed ? "ml-20" : "ml-60"; // 80px = ml-20, 240px = ml-60
  };

  // Calculate statistics
  const statsData: StatData[] = [
    {
      icon: Users,
      label: "Total Students",
      value: students.length.toString(),
      change: 5,
      changeLabel: "+12%",
      color: "text-blue-600",
    },
    {
      icon: FileText,
      label: "Active Assessments",
      value: assessments.filter((a) => a.status === "start").length.toString(),
      change: -2,
      changeLabel: "+5%",
      color: "text-green-600",
    },
    {
      icon: Clock,
      label: "Pending Reviews",
      value: submissions.filter((s) => !s.graded).length.toString(),
      change: 3,
      changeLabel: "+2%",
      color: "text-orange-600",
    },
    {
      icon: BookMarked,
      label: "Courses Teaching",
      value: courses.length.toString(),
      change: 0,
      changeLabel: "+8%",
      color: "text-purple-600",
    },
  ];

  // Quick actions with navigation paths
  const quickActions: QuickActionCard[] = [
    {
      icon: PlusCircle,
      title: "Create Assessment",
      description: "Generate new assignments and CATs with AI",
      path: "/lecturer/assessments",
      color: "text-blue-600",
      iconBg: "bg-blue-100",
    },
    {
      icon: Users,
      title: "Manage Students",
      description: "Add and manage your students",
      path: "/lecturer/students",
      color: "text-green-600",
      iconBg: "bg-green-100",
    },
    {
      icon: GraduationCap,
      title: "Course Management",
      description: "Create and manage your courses",
      path: "/lecturer/course",
      color: "text-purple-600",
      iconBg: "bg-purple-100",
    },
    {
      icon: ClipboardList,
      title: "Grade Submissions",
      description: "Review and grade student work",
      path: "/lecturer/submission",
      color: "text-orange-600",
      iconBg: "bg-orange-100",
    },
    {
      icon: BookOpen,
      title: "Manage Units",
      description: "Organize your teaching units",
      path: "/lecturer/units",
      color: "text-indigo-600",
      iconBg: "bg-indigo-100",
    },
    {
      icon: Library,
      title: "Library Resources",
      description: "Access teaching materials and resources",
      path: "/lecturer/library",
      color: "text-red-600",
      iconBg: "bg-red-100",
    },
    {
      icon: MessageSquare,
      title: "Discussion Forums",
      description: "Engage with students in forums",
      path: "/lecturer/forums",
      color: "text-teal-600",
      iconBg: "bg-teal-100",
    },
    {
      icon: BarChart3,
      title: "Analytics",
      description: "View performance analytics",
      path: "/lecturer/analytics",
      color: "text-pink-600",
      iconBg: "bg-pink-100",
    },
  ];

  // Components
  const TopHeader: React.FC = () => (
    <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-20">
      <div className="flex items-center justify-between px-4 lg:px-6 py-4">
        <div className="flex items-center space-x-3">
          {(isMobileView || isTabletView) && (
            <button
              className="text-emerald-600 hover:text-emerald-800 transition-colors"
              onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle sidebar"
            >
              <Menu className="w-6 h-6" />
            </button>
          )}
          <div className="hidden sm:block">
            <h1 className="text-xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-sm text-gray-600">
              Welcome back, {lecturerProfile ? `${lecturerProfile.name} ${lecturerProfile.surname}` : '...'}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <button className="relative text-gray-500 hover:text-emerald-600 transition-colors">
            <Bell className="w-6 h-6" />
            <span className="absolute -top-1 -right-1 bg-emerald-500 text-white text-xs rounded-full px-1.5 py-0.5">
              3
            </span>
          </button>

          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-emerald-200 rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-emerald-600" />
            </div>
            <span className="text-sm font-semibold text-gray-700 hidden md:inline">
              {lecturerProfile ? `${lecturerProfile.name} ${lecturerProfile.surname}` : '...'}
            </span>
          </div>
        </div>
      </div>
    </header>
  );

  const HeroSection: React.FC = () => (
    <div className="bg-gradient-to-r from-emerald-900 to-gray-700 rounded-xl p-6 lg:p-8 mb-6 text-white relative overflow-hidden">
      <div className="relative z-10">
        <h1 className="text-xl lg:text-3xl font-bold mb-2">
          Welcome back, {lecturerProfile ? `${lecturerProfile.name} ${lecturerProfile.surname}` : '...'}
        </h1>
        <p className="text-slate-200 mb-4">
          Manage your courses and engage with students efficiently
        </p>
        <div className="flex items-center space-x-2 bg-slate-700/50 px-3 py-2 rounded-lg w-fit">
          <CheckCircle className="w-4 h-4 text-green-400" />
          <span className="text-sm">
            {courses.length} active courses • {students.length} students
            enrolled
          </span>
        </div>
      </div>
      <div className="absolute top-0 right-0 w-32 lg:w-64 h-32 lg:h-64 bg-emerald-500/10 rounded-full -translate-y-16 lg:-translate-y-32 translate-x-16 lg:translate-x-32"></div>
    </div>
  );

  const StatsCard: React.FC<{ stat: StatData }> = ({ stat }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 lg:p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div
            className={`p-2 lg:p-3 rounded-full bg-gray-100 ${
              stat.color || "text-emerald-600"
            }`}
          >
            <stat.icon className="w-5 h-5 lg:w-6 lg:h-6" />
          </div>
          <div>
            <div className="text-xl lg:text-2xl font-bold text-gray-900">
              {stat.value}
            </div>
            <div className="text-xs lg:text-sm text-gray-500">{stat.label}</div>
          </div>
        </div>
        {stat.changeLabel && (
          <div className="flex items-center space-x-1">
            <TrendingUp className="w-3 h-3 lg:w-4 lg:h-4 text-green-500" />
            <span className="text-xs lg:text-sm font-semibold text-green-600">
              {stat.changeLabel}
            </span>
          </div>
        )}
      </div>
    </div>
  );

  const QuickActionCard: React.FC<{ action: QuickActionCard }> = ({
    action,
  }) => (
    <div
      onClick={() => handleNavigation(action.path)}
      className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 lg:p-6 hover:shadow-md transition-all hover:border-emerald-200 group cursor-pointer"
    >
      <div className="flex items-start space-x-3 lg:space-x-4">
        <div
          className={`p-2 lg:p-3 rounded-xl ${action.iconBg} ${action.color} group-hover:scale-110 transition-transform`}
        >
          <action.icon className="w-5 h-5 lg:w-6 lg:h-6" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-emerald-600 transition-colors text-sm lg:text-base">
            {action.title}
          </h3>
          <p className="text-xs lg:text-sm text-gray-600 mb-3">
            {action.description}
          </p>
          <div className="flex items-center text-emerald-600 text-xs lg:text-sm font-medium group-hover:translate-x-1 transition-transform">
            <span>Access</span>
            <ChevronRight className="w-3 h-3 lg:w-4 lg:h-4 ml-1" />
          </div>
        </div>
      </div>
    </div>
  );

  const RecentActivitySection: React.FC = () => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 lg:p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-900">Recent Activity</h2>
        <button
          onClick={() => handleNavigation("/lecturer/assessments")}
          className="text-emerald-600 hover:text-emerald-800 text-sm font-medium"
        >
          View All
        </button>
      </div>
      <div className="space-y-4">
        {assessments.slice(0, 5).map((assessment) => (
          <div
            key={assessment.id}
            className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer"
            onClick={() => handleNavigation("/lecturer/assessments")}
          >
            <div className="p-2 rounded-lg bg-blue-100 text-blue-600 flex-shrink-0">
              <FileText className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-medium text-gray-900 truncate text-sm lg:text-base">
                {assessment.title}
              </h4>
              <p className="text-xs lg:text-sm text-gray-600 truncate">
                {assessment.description}
              </p>
              <p className="text-xs text-gray-400 mt-1">
                {assessment.type} • {assessment.total_marks} marks
              </p>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
          </div>
        ))}
        {assessments.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <FileText className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p>No recent assessments</p>
            <button
              onClick={() => handleNavigation("/lecturer/assessments")}
              className="mt-2 text-emerald-600 hover:text-emerald-800 text-sm font-medium"
            >
              Create your first assessment
            </button>
          </div>
        )}
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Sidebar />
        <div className={`${getMainContentMargin()} transition-all duration-300 ease-in-out`}>
          <div className="flex items-center justify-center h-screen">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading dashboard...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <div
        className={`${getMainContentMargin()} transition-all duration-300 ease-in-out`}
      >
        <div className="flex flex-col min-h-screen">
          <TopHeader />

          <main className="flex-1 p-4 lg:p-6 max-w-7xl mx-auto w-full">
            <HeroSection />

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 lg:gap-6 mb-6 lg:mb-8">
              {statsData.map((stat, index) => (
                <StatsCard key={index} stat={stat} />
              ))}
            </div>

            {/* Quick Actions */}
            <div className="mb-6 lg:mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4 lg:mb-6">
                Quick Actions
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 lg:gap-6">
                {quickActions.map((action, index) => (
                  <QuickActionCard key={index} action={action} />
                ))}
              </div>
            </div>

            {/* Recent Activity */}
            <RecentActivitySection />
          </main>
        </div>
      </div>
    </div>
  );
};

export default LecturerDashboard;