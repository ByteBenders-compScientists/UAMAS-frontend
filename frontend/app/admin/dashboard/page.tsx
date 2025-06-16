"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { useLayout } from "@/components/LayoutController"
import AdminSidebar from "@/components/AdminSidebar"
import Header from "@/components/Header"
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
} from "lucide-react"

// Mock data - replace with real API calls
const mockStats = {
  totalStudents: 1247,
  totalLecturers: 89,
  totalCourses: 23,
  totalUnits: 156,
  recentActivity: [
    { type: "student", action: "New student registered", name: "Alice Wambui", time: "2 hours ago" },
    { type: "lecturer", action: "Lecturer added", name: "Dr. John Doe", time: "4 hours ago" },
    { type: "course", action: "Course updated", name: "Computer Science", time: "1 day ago" },
  ],
}

type StatCardProps = {
  icon: React.ReactNode
  title: string
  value: string | number
  change: string
  color: string
  trend: "up" | "down"
}

const StatCard = ({ icon, title, value, change, color, trend }: StatCardProps) => (
  <motion.div
    whileHover={{ y: -2 }}
    className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300"
  >
    <div className="flex items-center justify-between mb-4">
      <div className={`w-12 h-12 ${color} rounded-lg flex items-center justify-center`}>{icon}</div>
      <div className={`flex items-center text-sm font-medium ${trend === "up" ? "text-emerald-600" : "text-red-500"}`}>
        <TrendingUp size={16} className={`mr-1 ${trend === "down" ? "rotate-180" : ""}`} />
        {change}
      </div>
    </div>
    <h3 className="text-2xl font-bold text-gray-800 mb-1">{value.toLocaleString()}</h3>
    <p className="text-sm text-gray-500">{title}</p>
  </motion.div>
)

type QuickActionProps = {
  icon: React.ReactNode
  title: string
  description: string
  color: string
  href: string
}

const QuickAction = ({ icon, title, description, color, href }: QuickActionProps) => (
  <motion.div
    whileHover={{ scale: 1.02 }}
    className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer group"
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
)

export default function AdminDashboard() {
  const { sidebarCollapsed, isMobileView, isTabletView } = useLayout()
  const [isLoading, setIsLoading] = useState(true)
  const [stats, setStats] = useState(mockStats)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 800)
    return () => clearTimeout(timer)
  }, [])

  const statCards = [
    {
      icon: <Users size={24} className="text-white" />,
      title: "Total Students",
      value: stats.totalStudents,
      change: "+12%",
      color: "bg-blue-500",
      trend: "up" as const,
    },
    {
      icon: <UserCheck size={24} className="text-white" />,
      title: "Total Lecturers",
      value: stats.totalLecturers,
      change: "+5%",
      color: "bg-emerald-500",
      trend: "up" as const,
    },
    {
      icon: <GraduationCap size={24} className="text-white" />,
      title: "Total Courses",
      value: stats.totalCourses,
      change: "+2%",
      color: "bg-violet-500",
      trend: "up" as const,
    },
    {
      icon: <BookOpen size={24} className="text-white" />,
      title: "Total Units",
      value: stats.totalUnits,
      change: "+8%",
      color: "bg-amber-500",
      trend: "up" as const,
    },
  ]

  const quickActions = [
    {
      icon: <Users size={24} className="text-white" />,
      title: "Manage Students",
      description: "Add, edit, or remove student records",
      color: "bg-blue-500",
      href: "/admin/students",
    },
    {
      icon: <UserCheck size={24} className="text-white" />,
      title: "Manage Lecturers",
      description: "Handle lecturer profiles and assignments",
      color: "bg-emerald-500",
      href: "/admin/lecturers",
    },
    {
      icon: <GraduationCap size={24} className="text-white" />,
      title: "Manage Courses",
      description: "Create and modify course programs",
      color: "bg-violet-500",
      href: "/admin/courses",
    },
    {
      icon: <BookOpen size={24} className="text-white" />,
      title: "Manage Units",
      description: "Organize course units and modules",
      color: "bg-amber-500",
      href: "/admin/units",
    },
  ]

  return (
    <div className="flex h-screen bg-gray-50">
      <AdminSidebar />

      <motion.div
        initial={{
          marginLeft: !isMobileView && !isTabletView ? (sidebarCollapsed ? 80 : 240) : 0,
        }}
        animate={{
          marginLeft: !isMobileView && !isTabletView ? (sidebarCollapsed ? 80 : 240) : 0,
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
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {[...Array(4)].map((_, i) => (
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
                  <h1 className="text-3xl md:text-4xl font-bold mb-2">Admin Dashboard</h1>
                  <p className="text-gray-200 mb-4">Manage your university&apos;s academic system efficiently</p>

                  <div className="flex items-center bg-white/20 backdrop-blur-sm rounded-lg p-4 max-w-md">
                    <Bell size={18} className="text-white mr-3 flex-shrink-0" />
                    <p className="text-sm text-white">System running smoothly. All services operational.</p>
                  </div>
                </div>
              </motion.div>

              {/* Statistics Cards */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="mb-8"
              >
                <h2 className="text-xl font-semibold text-gray-800 mb-4">System Overview</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                {/* Quick Actions */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  className="lg:col-span-2"
                >
                  <h2 className="text-xl font-semibold text-gray-800 mb-4">Quick Actions</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                  </div>
                </motion.div>

                {/* Recent Activity */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                  className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
                >
                  <h2 className="text-xl font-semibold text-gray-800 mb-4">Recent Activity</h2>
                  <div className="space-y-4">
                    {stats.recentActivity.map((activity, index) => (
                      <div
                        key={index}
                        className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            activity.type === "student"
                              ? "bg-blue-100 text-blue-600"
                              : activity.type === "lecturer"
                                ? "bg-emerald-100 text-emerald-600"
                                : "bg-violet-100 text-violet-600"
                          }`}
                        >
                          <Activity size={16} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-800">{activity.action}</p>
                          <p className="text-sm text-gray-500">{activity.name}</p>
                          <p className="text-xs text-gray-400">{activity.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <button className="w-full mt-4 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium text-sm">
                    View All Activity
                  </button>
                </motion.div>
              </div>

              {/* System Status */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.8 }}
                className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
              >
                <h2 className="text-xl font-semibold text-gray-800 mb-4">System Status</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center justify-between p-4 bg-emerald-50 rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-emerald-800">Database</p>
                      <p className="text-xs text-emerald-600">Operational</p>
                    </div>
                    <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-emerald-50 rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-emerald-800">API Services</p>
                      <p className="text-xs text-emerald-600">Operational</p>
                    </div>
                    <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-emerald-50 rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-emerald-800">File Storage</p>
                      <p className="text-xs text-emerald-600">Operational</p>
                    </div>
                    <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </main>
      </motion.div>
    </div>
  )
}
