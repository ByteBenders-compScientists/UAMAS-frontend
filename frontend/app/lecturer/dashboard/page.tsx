'use client'
import React, { useState } from 'react';
import Sidebar from '@/components/lecturerSidebar';
import { 
  BookMarked, BarChart3, Clock, Monitor, Users, Bell, Menu, User, 
  GraduationCap, FileText, MessageSquare, Calendar, CheckCircle, 
  AlertCircle, BookOpen, ChevronRight, TrendingUp, Activity,
  PlusCircle, ClipboardList, Star, Award
} from 'lucide-react';
import Link from 'next/link';

// ===== TYPES =====
interface StatData {
  icon: React.ElementType;
  label: string;
  value: string;
  change?: number;
  changeLabel?: string;
}

interface QuickActionCard {
  icon: React.ElementType;
  title: string;
  description: string;
  path: string;
  color: string;
  iconBg: string;
}

interface ActivityItem {
  id: string;
  type: 'submission' | 'grade' | 'course' | 'announcement';
  title: string;
  description: string;
  time: string;
  icon: React.ElementType;
}

// Sample data
const STATS_DATA: StatData[] = [
  { icon: Users, label: 'Total Students', value: '132', change: 5, changeLabel: '+12%' },
  { icon: FileText, label: 'Active Assessments', value: '8', change: -2, changeLabel: '+5%' },
  { icon: Clock, label: 'Pending Reviews', value: '15', change: 3, changeLabel: '+2%' },
  { icon: BookMarked, label: 'Courses Teaching', value: '5', change: 0, changeLabel: '+8%' }
];

const QUICK_ACTIONS: QuickActionCard[] = [
  {
    icon: PlusCircle,
    title: 'Manage Assessments',
    description: 'Create and manage assignments and CATs',
    path: '/lecturer/assessments',
    color: 'text-blue-600',
    iconBg: 'bg-blue-100'
  },
     {
    icon: Users,
    title: 'Students',
    description: 'Add all your students ',
    path: '/lecturer/students',
    color: 'text-orange-600',
    iconBg: 'bg-orange-100'
  },
    {
    icon: GraduationCap,
    title: 'Course',
    description: 'Create your course',
    path: '/lecturer/course',
    color: 'text-red-600',
    iconBg: 'bg-yellow-100'
  },
  {
    icon: ClipboardList,
    title: 'Manage Grades',
    description: 'Review submissions and assign grades',
    path: '/lecturer/grades',
    color: 'text-green-600',
    iconBg: 'bg-green-100'
  },

  {
    icon: MessageSquare,
    title: 'Forums',
    description: 'Engage with students in discussions',
    path: '/lecturer/forums',
    color: 'text-orange-600',
    iconBg: 'bg-orange-100'
  },
 
];

const RECENT_ACTIVITIES: ActivityItem[] = [
  {
    id: '1',
    type: 'submission',
    title: 'New assignment submission',
    description: 'John Doe submitted Binary Search Tree Implementation',
    time: '2 minutes ago',
    icon: FileText
  },
  {
    id: '2',
    type: 'grade',
    title: 'Grades updated',
    description: 'Database Normalization Project grades published',
    time: '15 minutes ago',
    icon: Award
  },
  {
    id: '3',
    type: 'course',
    title: 'Course material added',
    description: 'New lecture notes uploaded to CS301',
    time: '1 hour ago',
    icon: BookOpen
  },
  {
    id: '4',
    type: 'announcement',
    title: 'CAT scheduled',
    description: 'Operating Systems midterm scheduled for next week',
    time: '2 hours ago',
    icon: Calendar
  }
];

// Components
const TopHeader: React.FC<{ onSidebarToggle: () => void }> = ({ onSidebarToggle }) => (
  <header className="flex items-center justify-between px-4 py-4 lg:py-6 bg-white border-b border-gray-200 shadow-sm lg:shadow-none">
    <div className="flex items-center space-x-3">
      <button
        className="lg:hidden text-rose-600 hover:text-emerald-800 transition-colors"
        onClick={onSidebarToggle}
        aria-label="Open sidebar"
      >
        <Menu className="w-6 h-6" />
      </button>
      <span className="text-xl font-bold text-emerald-600">EduPortal</span>
    </div>
    <div className="flex items-center space-x-4">
      <button className="relative text-gray-500 hover:text-emerald-600 transition-colors">
        <Bell className="w-6 h-6" />
        <span className="absolute -top-1 -right-1 bg-emerald-500 text-white text-xs rounded-full px-1.5 py-0.5">3</span>
      </button>
      <div className="flex items-center space-x-2">
        <div className="w-8 h-8 bg-emerald-200 rounded-full flex items-center justify-center">
          <User className="w-4 h-4 text-emerald-600" />
        </div>
        <span className="text-sm font-semibold text-gray-700 hidden md:inline">Dr. Alex Kimani</span>
      </div>
    </div>
  </header>
);

// Hero Section Component
const HeroSection: React.FC = () => (
  <div className="bg-gradient-to-r from-emerald-900 to-gray-700 rounded-xl p-6 lg:p-8 mb-6 text-white relative overflow-hidden">
    <div className="relative z-10">
      <h1 className="text-2xl lg:text-3xl font-bold mb-2">Welcome back, Dr. Alex Kimani</h1>
      <p className="text-slate-200 mb-4">Manage your courses and engage with students efficiently</p>
      <div className="flex items-center space-x-2 bg-slate-700/50 px-3 py-2 rounded-lg w-fit">
        <CheckCircle className="w-4 h-4 text-green-400" />
        <span className="text-sm">All courses up to date. Ready for new semester.</span>
      </div>
    </div>
    <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full -translate-y-32 translate-x-32"></div>
    <div className="absolute bottom-0 right-0 w-48 h-48 bg-blue-500/10 rounded-full translate-y-24 translate-x-24"></div>
  </div>
);

// Stats Card Component
const StatsCard: React.FC<{ stat: StatData }> = ({ stat }) => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 hover:shadow-md transition-shadow">
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <div className="p-2 rounded-full bg-emerald-100 text-emerald-600">
          <stat.icon className="w-6 h-6" />
        </div>
        <div>
          <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
          <div className="text-sm text-gray-500">{stat.label}</div>
        </div>
      </div>
      {stat.changeLabel && (
        <div className="flex items-center space-x-1">
          <TrendingUp className="w-4 h-4 text-green-500" />
          <span className="text-sm font-semibold text-green-600">{stat.changeLabel}</span>
        </div>
      )}
    </div>
  </div>
);

// Quick Action Card Component
const QuickActionCard: React.FC<{ action: QuickActionCard }> = ({ action }) => (
  <Link href={action.path}>
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all hover:border-emerald-200 group cursor-pointer">
      <div className="flex items-start space-x-4">
        <div className={`p-3 rounded-xl ${action.iconBg} ${action.color} group-hover:scale-110 transition-transform`}>
          <action.icon className="w-6 h-6" />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-emerald-600 transition-colors">
            {action.title}
          </h3>
          <p className="text-sm text-gray-600 mb-3">{action.description}</p>
          <div className="flex items-center text-emerald-600 text-sm font-medium group-hover:translate-x-1 transition-transform">
            <span>View</span>
            <ChevronRight className="w-4 h-4 ml-1" />
          </div>
        </div>
      </div>
    </div>
  </Link>
);

// Activity Item Component
const ActivityItem: React.FC<{ activity: ActivityItem }> = ({ activity }) => {
  const getActivityColor = (type: string) => {
    switch (type) {
      case 'submission': return 'bg-blue-100 text-blue-600';
      case 'grade': return 'bg-green-100 text-green-600';
      case 'course': return 'bg-purple-100 text-purple-600';
      case 'announcement': return 'bg-orange-100 text-orange-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <div className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
      <div className={`p-2 rounded-lg ${getActivityColor(activity.type)}`}>
        <activity.icon className="w-4 h-4" />
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="font-medium text-gray-900 truncate">{activity.title}</h4>
        <p className="text-sm text-gray-600 truncate">{activity.description}</p>
        <p className="text-xs text-gray-400 mt-1">{activity.time}</p>
      </div>
    </div>
  );
};

// System Overview Section
const SystemOverview: React.FC = () => (
  <div className="mb-8">
    <h2 className="text-xl font-bold text-gray-900 mb-6">Teaching Overview</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {STATS_DATA.map((stat, index) => (
        <StatsCard key={index} stat={stat} />
      ))}
    </div>
  </div>
);

// Quick Actions Section
const QuickActionsSection: React.FC = () => (
  <div className="mb-8">
    <h2 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {QUICK_ACTIONS.map((action, index) => (
        <QuickActionCard key={index} action={action} />
      ))}
    </div>
  </div>
);

// Recent Activity Section
const RecentActivitySection: React.FC = () => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
    <div className="flex items-center justify-between mb-6">
      <h2 className="text-xl font-bold text-gray-900">Recent Activity</h2>
      <Link href="/lecturer/activity" className="text-emerald-600 hover:text-emerald-700 text-sm font-medium flex items-center">
        View all
        <ChevronRight className="w-4 h-4 ml-1" />
      </Link>
    </div>
    <div className="space-y-2">
      {RECENT_ACTIVITIES.map((activity) => (
        <ActivityItem key={activity.id} activity={activity} />
      ))}
    </div>
  </div>
);

// Main Component
const LecturerDashboard: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />
      
      <div className="flex-1 flex flex-col lg:ml-64">
        <TopHeader onSidebarToggle={() => setSidebarOpen(true)} />
        
        <main className="flex-1 p-4 lg:p-6 max-w-7xl mx-auto w-full">
          <HeroSection />
          <SystemOverview />
          <QuickActionsSection />
          <RecentActivitySection />
        </main>
      </div>
    </div>
  );
};

export default LecturerDashboard;