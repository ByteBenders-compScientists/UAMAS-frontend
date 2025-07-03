"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useLayout } from "@/components/LayoutController";
import AdminSidebar from "@/components/AdminSidebar";
import Header from "@/components/Header";
import {
  Users,
  GraduationCap,
  BookOpen,
  UserCheck,
  TrendingUp,
  Bell,
  ArrowRight,
  BarChart3,
  Activity,
  Shield,
  User,
} from "lucide-react";

type Stats = {
  totalUsers: number;
  totalAdmins: number;
  totalStudents: number;
  totalLecturers: number;
  totalCourses: number;
  totalUnits: number;
  recentActivity: Array<{
    type: string;
    action: string;
    name: string;
    time: string;
  }>;
};

type StatCardProps = {
  icon: React.ReactNode;
  title: string;
  value: string | number;
  change: string;
  color: string;
  trend: "up" | "down";
};

const apiBaseUrl =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080/api/v1";

const StatCard = ({
  icon,
  title,
  value,
  change,
  color,
  trend,
}: StatCardProps) => (
  <motion.div
    whileHover={{ y: -2 }}
    className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300"
  >
    <div className="flex items-center justify-between mb-4">
      <div
        className={`w-12 h-12 ${color} rounded-lg flex items-center justify-center`}
      >
        {icon}
      </div>
      <div
        className={`flex items-center text-sm font-medium ${
          trend === "up" ? "text-emerald-600" : "text-red-500"
        }`}
      >
        <TrendingUp
          size={16}
          className={`mr-1 ${trend === "down" ? "rotate-180" : ""}`}
        />
        {change}
      </div>
    </div>
    <h3 className="text-2xl font-bold text-gray-800 mb-1">
      {value.toLocaleString()}
    </h3>
    <p className="text-sm text-gray-500">{title}</p>
  </motion.div>
);

type QuickActionProps = {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
  href: string;
};

const QuickAction = ({
  icon,
  title,
  description,
  color,
  href,
}: QuickActionProps) => (
  <Link href={href} className="block">
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer group h-full"
    >
      <div
        className={`w-12 h-12 ${color} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}
      >
        {icon}
      </div>
      <h3 className="font-semibold text-gray-800 mb-2">{title}</h3>
      <p className="text-sm text-gray-500 mb-4">{description}</p>
      <div className="flex items-center text-sm font-medium text-emerald-600 group-hover:translate-x-1 transition-transform duration-300">
        <span>Manage</span>
        <ArrowRight size={14} className="ml-1" />
      </div>
    </motion.div>
  </Link>
);

type Activity = {
  type: "student" | "lecturer" | "course" | "unit";
  action: string;
  name: string;
  time: string;
  icon: React.ReactNode;
};

export default function AdminDashboard() {
  const { sidebarCollapsed, isMobileView, isTabletView } = useLayout();
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState<Stats>({
    totalUsers: 0,
    totalAdmins: 0,
    totalStudents: 0,
    totalLecturers: 0,
    totalCourses: 0,
    totalUnits: 0,
    recentActivity: [],
  });

  // Dummy recent activities
  const recentActivities: Activity[] = [
    {
      type: "student",
      action: "New student registered",
      name: "John Doe",
      time: "2 minutes ago",
      icon: <Users size={16} className="text-blue-600" />,
    },
    {
      type: "lecturer",
      action: "Lecturer profile updated",
      name: "Dr. Jane Smith",
      time: "15 minutes ago",
      icon: <UserCheck size={16} className="text-emerald-600" />,
    },
 

  ];

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch students
        const studentsResponse = await fetch("https://api.waltertayarg.me/api/v1/admin/students", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        })
        const studentsData = await studentsResponse.json()

        // Fetch lecturers
        const lecturersResponse = await fetch("https://api.waltertayarg.me/api/v1/admin/lecturers", {

          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        });

        // Fetch analytics
        const analyticsResponse = await fetch("https://api.waltertayarg.me/api/v1/admin/analytics", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        });
        const analyticsData = await analyticsResponse.json();


        // Fetch courses
        const coursesResponse = await fetch("https://api.waltertayarg.me/api/v1/admin/courses", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        })
        const coursesData = await coursesResponse.json()


        // Calculate total users
        const totalUsers =
          analyticsData.user_counts.admins +
          analyticsData.user_counts.lecturers +
          analyticsData.user_counts.students;

        setStats({
          totalUsers,
          totalAdmins: analyticsData.user_counts.admins,
          totalStudents: analyticsData.user_counts.students,
          totalLecturers: analyticsData.user_counts.lecturers,
          totalCourses: analyticsData.course_counts.courses,
          totalUnits: analyticsData.course_counts.units,
          recentActivity: [], // We can implement this later if needed
        });
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statCards = [
    {
      icon: <Users size={24} className="text-white" />,
      title: "Total Users",
      value: stats.totalUsers,
      change: "+8%",
      color: "bg-gray-500",
      trend: "up" as const,
    },
    {
      icon: <Shield size={24} className="text-white" />,
      title: "Admins",
      value: stats.totalAdmins,
      change: "0%",
      color: "bg-red-500",
      trend: "up" as const,
    },
    {
      icon: <UserCheck size={24} className="text-white" />,
      title: "Registered Lecturers",
      value: stats.totalLecturers,
      change: "+5%",
      color: "bg-emerald-500",
      trend: "up" as const,
    },

  ];

  const quickActions = [
   
    {
      icon: <UserCheck size={24} className="text-white" />,
      title: "Manage Lecturers",
      description: "Handle lecturer profiles and assignments",
      color: "bg-emerald-500",
      href: "/admin/lecturers",
    },
  
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      <AdminSidebar />

      <motion.div
        initial={{
          marginLeft:
            !isMobileView && !isTabletView ? (sidebarCollapsed ? 80 : 240) : 0,
        }}
        animate={{
          marginLeft:
            !isMobileView && !isTabletView ? (sidebarCollapsed ? 80 : 240) : 0,
        }}
        transition={{ duration: 0.3 }}
        className="flex-1 overflow-auto"
      >
        <Header title="Admin Dashboard" />

        <main className="p-4 md:p-6 lg:p-8">
          {isLoading ? (
            <div className="max-w-7xl mx-auto">
              <div className="animate-pulse space-y-8">
                <div className="h-32 bg-gray-200 rounded-xl"></div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="h-32 bg-gray-200 rounded-xl"></div>
                  ))}
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2 h-64 bg-gray-200 rounded-xl"></div>
                  <div className="h-64 bg-gray-200 rounded-xl"></div>
                </div>
              </div>
            </div>
          ) : (
            <div className="max-w-7xl mx-auto">
              {/* Welcome Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="mb-8 bg-gradient-to-br from-slate-600 to-gray-700 rounded-xl p-6 md:p-8 shadow-lg text-white relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-64 h-64 opacity-10">
                  <BarChart3 size={200} />
                </div>

                <div className="relative z-10">
                  <h1 className="text-3xl md:text-4xl font-bold mb-2">
                    Admin Dashboard
                  </h1>
                  <p className="text-gray-200 mb-4">
                    Manage your university&apos;s academic system efficiently
                  </p>

                  <div className="flex items-center bg-white/20 backdrop-blur-sm rounded-lg p-4 max-w-md">
                    <Bell size={18} className="text-white mr-3 flex-shrink-0" />
                    <p className="text-sm text-white">
                      System running smoothly. All services operational.
                    </p>
                  </div>
                </div>
              </motion.div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                {/* Statistics Cards */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="lg:col-span-2"
                >
                  <h2 className="text-xl font-semibold text-gray-800 mb-4">
                    System Overview
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {statCards.map((stat, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.1 * (index + 1) }}
                      >
                        <StatCard {...stat} />
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

                {/* Recent Activity */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
                >
                  <h2 className="text-xl font-semibold text-gray-800 mb-4">
                    Recent Activity
                  </h2>
                  <div className="space-y-4">
                    {recentActivities.map((activity, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: 0.1 * index }}
                        className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            activity.type === "student"
                              ? "bg-blue-100"
                              : activity.type === "lecturer"
                              ? "bg-emerald-100"
                              : activity.type === "course"
                              ? "bg-violet-100"
                              : "bg-amber-100"
                          }`}
                        >
                          {activity.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-800">
                            {activity.action}
                          </p>
                          <p className="text-sm text-gray-500">
                            {activity.name}
                          </p>
                          <p className="text-xs text-gray-400">
                            {activity.time}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </div>

              {/* Quick Actions */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
              >
                {quickActions.map((action, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.1 * (index + 1) }}
                  >
                    <QuickAction {...action} />
                  </motion.div>
                ))}
              </motion.div>
            </div>
          )}
        </main>
        {/* System Overview Section (Bottom) */}
        <div className="max-w-7xl mx-auto mt-10">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8">
            <h2 className="text-lg font-bold text-gray-900 mb-6">
              System Overview
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              {/* Current Semester */}
              <div>
                <div className="flex justify-center mb-3">
                  <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-8 w-8 text-blue-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                </div>
                <div className="font-semibold text-gray-900 text-lg mb-1">
                  Current Semester
                </div>
                <div className="text-gray-500 text-sm">
                  Semester 2, 2024/2025
                </div>
              </div>
              {/* Active Users */}
              <div>
                <div className="flex justify-center mb-3">
                  <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-8 w-8 text-green-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87m9-4a4 4 0 11-8 0 4 4 0 018 0zm6 4v2a2 2 0 01-2 2h-4a2 2 0 01-2-2v-2a2 2 0 012-2h4a2 2 0 012 2z"
                      />
                    </svg>
                  </div>
                </div>
                <div className="font-semibold text-gray-900 text-lg mb-1">
                  Active Users
                </div>
                <div className="text-gray-500 text-sm">1,336 total users</div>
              </div>
              {/* System Health */}
              <div>
                <div className="flex justify-center mb-3">
                  <div className="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-8 w-8 text-purple-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 17v-2a4 4 0 018 0v2m-4-4V7m0 0V3m0 4a4 4 0 00-4 4v4a4 4 0 004 4"
                      />
                    </svg>
                  </div>
                </div>
                <div className="font-semibold text-gray-900 text-lg mb-1">
                  System Health
                </div>
                <div className="text-green-600 text-sm">
                  All systems operational
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
