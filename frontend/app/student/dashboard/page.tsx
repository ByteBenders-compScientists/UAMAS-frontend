/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLayout } from '@/components/LayoutController';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import EmptyState from '@/components/EmptyState';
import { 
  BookOpen, 
  ClipboardList, 
  Calendar,
  Users,
  Award,
  GraduationCap,
  Bell,
  ArrowRight,
  BookMarked,
  FileText,
  LucideIcon
} from 'lucide-react';
import { getCurrentWeek } from '@/utils/WeekSelector';
import Link from 'next/link';

const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.waltertayarg.me/api/v1"

type QuickLinkProps = {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
  href: string;
};

const QuickLink = ({ icon, title, description, color, href }: QuickLinkProps) => (
  <Link href={href} className="block">
    <div className={`bg-white rounded-xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer group`}>
      <div className={`w-12 h-12 ${color} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
        {icon}
      </div>
      <h3 className="font-semibold text-gray-800 mb-1">{title}</h3>
      <p className="text-sm text-gray-500">{description}</p>
      <div className="flex items-center mt-3 text-sm font-medium text-emerald-600 group-hover:translate-x-1 transition-transform duration-300">
        <span>Explore</span>
        <ArrowRight size={14} className="ml-1" />
      </div>
    </div>
  </Link>
);

export default function Dashboard() {
  const { 
    sidebarCollapsed, 
    isMobileView, 
    isTabletView 
  } = useLayout();

  const [hasContent, setHasContent] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [profile, setProfile] = useState<{ name: string; surname: string; reg_number: string } | null>(null);

  useEffect(() => {
    // Simulate loading data
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

  const quickLinks = [
    {
      icon: <BookOpen size={24} className="text-white" />,
      title: "Learning Materials",
      description: "Access lecture notes, slides, and readings",
      color: "bg-emerald-500",
      href: "/student/library"
    },
    {
      icon: <ClipboardList size={24} className="text-white" />,
      title: "Assignments",
      description: "View and submit your assignments",
      color: "bg-amber-500",
      href: "/student/assignments"
    },
    {
      icon: <Award size={24} className="text-white" />,
      title: "CATS",
      description: "View and attempt your CATS (Continuous Assessment Tests)",
      color: "bg-violet-500",
      href: "/student/cats"
    },
    {
      icon: <FileText size={24} className="text-white" />,
      title: "Submission",
      description: "Submit your coursework and projects",
      color: "bg-blue-500",
      href: "/student/submission"
    }
  ];

  return (
    <div className="flex h-screen bg-gray-50">
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
            // Loading state
            <div className="max-w-8xl mx-auto">
              <div className="animate-pulse space-y-8">
                <div className="h-32 bg-gray-200 rounded-xl"></div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="h-48 bg-gray-200 rounded-xl"></div>
                  ))}
                </div>
                <div className="h-64 bg-gray-200 rounded-xl"></div>
              </div>
            </div>
          ) : !hasContent ? (
            // Empty State
            <div className="max-w-8xl mx-auto">
              {/* Welcome Banner */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="mb-8 bg-gradient-to-br from-slate-400 to-gray-300 rounded-xl p-6 md:p-8 shadow-md text-white relative overflow-hidden"
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
                    <p className="text-emerald-50">
                      {/* Remove all references to mockData */}
                    </p>
                    
                    <div className="mt-4 bg-white/20 backdrop-blur-sm rounded-lg p-4 max-w-md">
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
                    <div className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
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
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Access</h3>
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
                className="mb-8 bg-white rounded-xl p-6 shadow-sm border border-gray-100"
              >
                <h3 className="text-lg font-semibold text-gray-800 mb-6">Recent Activity</h3>
                
                <div className="flex flex-col items-center justify-center py-12">
                  <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 mb-4">
                    <FileText size={32} />
                  </div>
                  <h4 className="text-lg font-medium text-gray-700 mb-2">No Recent Activity</h4>
                  <p className="text-gray-500 text-center max-w-md mb-6">
                    Your recent activities, assignments, and notifications will appear here once your courses begin.
                  </p>
                  <button className="px-4 py-2 bg-emerald-100 text-emerald-700 rounded-lg hover:bg-emerald-200 transition-colors font-medium text-sm">
                    Explore Your Courses
                  </button>
                </div>
              </motion.div>

              {/* Upcoming Events */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
              >
                <h3 className="text-lg font-semibold text-gray-800 mb-6">Upcoming Events</h3>
                
                <div className="flex flex-col items-center justify-center py-12">
                  <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 mb-4">
                    <Calendar size={32} />
                  </div>
                  <h4 className="text-lg font-medium text-gray-700 mb-2">No Upcoming Events</h4>
                  <p className="text-gray-500 text-center max-w-md">
                    Your schedule is clear. Events, deadlines, and important dates will be displayed here.
                  </p>
                </div>
              </motion.div>
            </div>
          ) : (
            // Content State (when lecturer adds materials)
            <div className="max-w-8xl mx-auto">
              {/* This section would show actual content */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Course materials, assignments, etc. would go here */}
                <div className="md:col-span-2 bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Materials</h3>
                  {/* Content would be populated here */}
                </div>
                
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Upcoming</h3>
                  {/* Content would be populated here */}
                </div>
              </div>
            </div>
          )}
        </main>
      </motion.div>
    </div>
  );
}