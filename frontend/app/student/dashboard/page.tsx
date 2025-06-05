"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useLayout } from "@/components/LayoutController";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import {
  BookOpen,
  ClipboardList,
  ArrowRight,
  Clock,
  Award,
  BarChart,
  Check,
  BookMarked,
  Calendar,
  Users,
  FileText,
  Library,
} from "lucide-react";

export default function Dashboard() {
  const { sidebarCollapsed, isMobileView, isTabletView } = useLayout();
  const [user, setUser] = useState<{ name?: string }>({});


useEffect(() => {
    const storedUser = localStorage.getItem("userData");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Regular Sidebar */}
      <Sidebar />

      {/* Main Content */}
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
        <Header title="Dashboard" />

        <main className="p-4 md:p-6">
          {/* Welcome Banner */}
          <div className="mb-6 bg-gradient-to-r from-emerald-400 via-emerald-500 to-emerald-600/80 rounded-xl p-6 text-white shadow-md relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-4.0.3')] bg-cover bg-right opacity-15 rounded-xl"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 via-emerald-500/95 via-emerald-500/80 via-emerald-500/60 via-emerald-600/40 to-emerald-600/10 rounded-xl"></div>
            <div className="relative z-10">
              <h1 className="text-2xl font-bold mb-2">Welcome back, { user.name ? user.name : 'User' }</h1>
              <p className="text-emerald-100 mb-4">
                Here's what's happening with your academic progress today.
              </p>
              <div className="flex flex-wrap gap-4 mt-4">
                <div className="bg-white/10 px-4 py-2 rounded-lg flex items-center">
                  <Clock className="text-emerald-300 mr-2" size={18} />
                  <span>Current Semester: Spring 2025</span>
                </div>
                <div className="bg-white/10 px-4 py-2 rounded-lg flex items-center">
                  <Award className="text-emerald-300 mr-2" size={18} />
                  <span>Academic Standing: Excellent</span>
                </div>
                <div className="bg-white/10 px-4 py-2 rounded-lg flex items-center">
                  <BarChart className="text-emerald-300 mr-2" size={18} />
                  <span>Progress: 88% Completed</span>
                </div>
              </div>
            </div>
          </div>

          {/* Academic Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            {/* Units Card */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-600 mr-3">
                    <BookMarked size={20} />
                  </div>
                  <h2 className="text-lg font-semibold text-gray-800">Units</h2>
                </div>
                <span className="text-3xl font-bold text-indigo-600">7</span>
              </div>
              <p className="text-sm text-gray-500 mb-4">
                Total Registered Units
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="bg-indigo-50 text-indigo-700 text-xs px-2.5 py-1 rounded-full">
                  Theory of Computation
                </span>
                <span className="bg-indigo-50 text-indigo-700 text-xs px-2.5 py-1 rounded-full">
                  Probability & Statistics
                </span>
                <span className="bg-indigo-50 text-indigo-700 text-xs px-2.5 py-1 rounded-full">
                  Computer Security
                </span>
                <span className="bg-indigo-50 text-indigo-700 text-xs px-2.5 py-1 rounded-full">
                  Philosophy
                </span>
                <span className="bg-indigo-50 text-indigo-700 text-xs px-2.5 py-1 rounded-full">
                  Calculus II
                </span>
              </div>
            </div>

            {/* CATs Card */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-lg bg-cyan-100 flex items-center justify-center text-cyan-600 mr-3">
                    <BookOpen size={20} />
                  </div>
                  <h2 className="text-lg font-semibold text-gray-800">CATs</h2>
                </div>
                <span className="text-3xl font-bold text-cyan-600">4</span>
              </div>
              <p className="text-sm text-gray-500 mb-4">
                Continuous Assessment Tests
              </p>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-700">Discrete Math</span>
                  <span className="text-sm font-medium text-cyan-600">92%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-cyan-500 h-2 rounded-full"
                    style={{ width: "92%" }}
                  ></div>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-700">Databases</span>
                  <span className="text-sm font-medium text-cyan-600">87%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-cyan-500 h-2 rounded-full"
                    style={{ width: "87%" }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Assignments Card */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center text-amber-600 mr-3">
                    <ClipboardList size={20} />
                  </div>
                  <h2 className="text-lg font-semibold text-gray-800">
                    Assignments
                  </h2>
                </div>
                <span className="text-3xl font-bold text-amber-600">3</span>
              </div>
              <p className="text-sm text-gray-500 mb-4">Upcoming & Submitted</p>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <div>
                    <span className="text-sm font-medium text-gray-800">
                      Algorithms
                    </span>
                    <div className="flex items-center text-xs text-amber-600">
                      <Clock size={12} className="mr-1" />
                      <span>Due 28 May</span>
                    </div>
                  </div>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                    Pending
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <div>
                    <span className="text-sm font-medium text-gray-800">
                      Networks
                    </span>
                    <div className="flex items-center text-xs text-emerald-600">
                      <Check size={12} className="mr-1" />
                      <span>Submitted</span>
                    </div>
                  </div>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                    Completed
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Performance Cards Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
              <h3 className="text-sm font-medium text-gray-500 mb-2">
                Overall Performance
              </h3>
              <div className="flex items-end">
                <span className="text-2xl font-bold text-gray-800">88%</span>
                <span className="text-xs text-emerald-600 ml-2 pb-1 flex items-center">
                  <svg
                    className="w-3 h-3 mr-1"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                  3.2%
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-1">Current Semester</p>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
              <h3 className="text-sm font-medium text-gray-500 mb-2">
                Class Rank
              </h3>
              <div className="flex items-end">
                <span className="text-2xl font-bold text-gray-800">#3</span>
                <span className="text-xs text-emerald-600 ml-2 pb-1 flex items-center">
                  <svg
                    className="w-3 h-3 mr-1"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                  2 positions
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-1">Among 90 students</p>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
              <h3 className="text-sm font-medium text-gray-500 mb-2">
                Completion rate
              </h3>
              <div className="flex items-end">
                <span className="text-2xl font-bold text-gray-800">96%</span>
                <span className="text-xs text-emerald-600 ml-2 pb-1 flex items-center">
                  <svg
                    className="w-3 h-3 mr-1"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                  4.5%
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-1">This semester</p>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
              <h3 className="text-sm font-medium text-gray-500 mb-2">
                Pending assignments
              </h3>
              <div className="flex items-end">
                <span className="text-2xl font-bold text-gray-800">3</span>
                <span className="text-xs text-amber-600 ml-2 pb-1 flex items-center">
                  <Clock size={12} className="mr-1" />
                  Upcoming
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-1">To be done</p>
            </div>
          </div>

          {/* Rest of the dashboard content would follow here, exactly as in your provided code */}
          {/* I'm including just a portion for brevity, but the full implementation would include everything */}

          {/* Upcoming Deadlines */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-6">
            <div className="p-5 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center">
                <Clock size={18} className="text-red-500 mr-2" />
                <h2 className="text-lg font-semibold text-gray-800">
                  Upcoming Deadlines
                </h2>
              </div>
            </div>
            <div className="divide-y divide-gray-100">
              <div className="p-4 flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mr-3">
                    <FileText size={16} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-800">
                      Assignment: Web Dev Project
                    </p>
                    <p className="text-xs text-gray-500">
                      Computer Science 301
                    </p>
                  </div>
                </div>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                  Due in 2 days
                </span>
              </div>

              <div className="p-4 flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-9 h-9 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 mr-3">
                    <BookOpen size={16} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-800">
                      CAT: Probability
                    </p>
                    <p className="text-xs text-gray-500">Mathematics 202</p>
                  </div>
                </div>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                  Due in 5 days
                </span>
              </div>

              <div className="p-4 flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-9 h-9 rounded-full bg-green-100 flex items-center justify-center text-green-600 mr-3">
                    <FileText size={16} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-800">
                      Assignment: Data Structures
                    </p>
                    <p className="text-xs text-gray-500">
                      Computer Science 202
                    </p>
                  </div>
                </div>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                  Due in 1 week
                </span>
              </div>
            </div>
          </div>

          {/* Final Grades */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">
                  Calculus II
                </h3>
                <span className="text-2xl font-bold text-blue-600">B</span>
              </div>
              <p className="text-sm text-gray-500 mb-2">Final Grade</p>
              <div className="mt-4 flex">
                <div className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                  Final: 82%
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">
                  Computer Security
                </h3>
                <span className="text-2xl font-bold text-emerald-600">A</span>
              </div>
              <p className="text-sm text-gray-500 mb-2">Final Grade</p>
              <div className="mt-4 flex">
                <div className="bg-emerald-100 text-emerald-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                  Final: 94%
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">
                  Statistics
                </h3>
                <span className="text-2xl font-bold text-emerald-600">A</span>
              </div>
              <p className="text-sm text-gray-500 mb-2">Final Grade</p>
              <div className="mt-4 flex">
                <div className="bg-emerald-100 text-emerald-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                  Final: 91%
                </div>
              </div>
            </div>
          </div>

          {/* Instructor Feedback */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-6">
            <div className="p-5 border-b border-gray-100">
              <div className="flex items-center">
                <Users size={18} className="text-purple-600 mr-2" />
                <h2 className="text-lg font-semibold text-gray-800">
                  Recent Feedback from Instructors
                </h2>
              </div>
            </div>
            <div className="divide-y divide-gray-100">
              <div className="p-4">
                <div className="flex items-start">
                  <div className="w-10 h-10 rounded-full bg-gray-200 flex-shrink-0 mr-3"></div>
                  <div>
                    <div className="flex items-center mb-1">
                      <h3 className="font-medium text-gray-800 mr-2">
                        Dr. Kituku
                      </h3>
                      <span className="text-xs text-gray-500">Algorithms</span>
                    </div>
                    <p className="text-sm text-gray-600">
                      "Excellent progress on the project. Keep up the creativity
                      and thoroughness!"
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4">
                <div className="flex items-start">
                  <div className="w-10 h-10 rounded-full bg-gray-200 flex-shrink-0 mr-3"></div>
                  <div>
                    <div className="flex items-center mb-1">
                      <h3 className="font-medium text-gray-800 mr-2">
                        Prof. Wambui
                      </h3>
                      <span className="text-xs text-gray-500">Statistics</span>
                    </div>
                    <p className="text-sm text-gray-600">
                      "Participation in class is strong. Consider practicing
                      more sample problems."
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Assignment Hours */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="p-5 border-b border-gray-100">
                <div className="flex items-center">
                  <Clock size={18} className="text-blue-600 mr-2" />
                  <h2 className="text-lg font-semibold text-gray-800">
                    Assignment Hours This Week
                  </h2>
                </div>
                <p className="text-sm text-gray-500 mt-1">Target: 20 hrs</p>
              </div>
              <div className="p-5">
                <div className="w-full bg-gray-200 rounded-full h-4 mb-2">
                  <div
                    className="bg-blue-600 h-4 rounded-full"
                    style={{ width: "75%" }}
                  ></div>
                </div>
                <div className="text-sm text-gray-600">15/20 hrs completed</div>
              </div>
            </div>

            {/* Next Study Task */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="p-5 border-b border-gray-100">
                <div className="flex items-center">
                  <Calendar size={18} className="text-emerald-600 mr-2" />
                  <h2 className="text-lg font-semibold text-gray-800">
                    Next Study Task
                  </h2>
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  Scheduled for Today
                </p>
              </div>
              <div className="p-5">
                <h3 className="font-medium text-gray-800 mb-2">
                  Read: Chapter 6 - Graph Theory and Write a case study
                </h3>
                <p className="text-sm text-gray-600 mb-3">8:00 PM - 10:00 PM</p>
                <button className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-2 px-4 rounded-lg transition-colors">
                  Mark as Complete
                </button>
              </div>
            </div>
          </div>

          {/* Top Performing Units */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-6">
            <div className="p-5 border-b border-gray-100">
              <div className="flex items-center">
                <Award size={18} className="text-pink-600 mr-2" />
                <h2 className="text-lg font-semibold text-gray-800">
                  My Top Performing Units
                </h2>
              </div>
            </div>
            <div className="p-5 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                <div className="w-10 h-10 rounded-lg bg-pink-100 flex items-center justify-center text-pink-600 mr-3">
                  <BookMarked size={18} />
                </div>
                <div>
                  <h3 className="font-medium text-gray-800">Statistics</h3>
                  <p className="text-sm text-gray-500">92%</p>
                </div>
              </div>

              <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600 mr-3">
                  <BookMarked size={18} />
                </div>
                <div>
                  <h3 className="font-medium text-gray-800">Probability</h3>
                  <p className="text-sm text-gray-500">90%</p>
                </div>
              </div>

              <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                <div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-600 mr-3">
                  <BookMarked size={18} />
                </div>
                <div>
                  <h3 className="font-medium text-gray-800">
                    Theory Of Computation
                  </h3>
                  <p className="text-sm text-gray-500">88%</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Access */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 text-center">
              <div className="mx-auto w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mb-3">
                <Calendar size={20} />
              </div>
              <h3 className="font-semibold text-gray-800 mb-1">
                View Timetable
              </h3>
              <p className="text-xs text-gray-500 mb-3">
                See your weekly class schedule
              </p>
              <button className="text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors">
                Open Schedule
              </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 text-center">
              <div className="mx-auto w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 mb-3">
                <Library size={20} />
              </div>
              <h3 className="font-semibold text-gray-800 mb-1">
                Library Access
              </h3>
              <p className="text-xs text-gray-500 mb-3">
                Browse online resources
              </p>
              <button className="text-purple-600 hover:text-purple-700 text-sm font-medium transition-colors">
                Visit Library
              </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 text-center">
              <div className="mx-auto w-12 h-12 rounded-full bg-cyan-100 flex items-center justify-center text-cyan-600 mb-3">
                <Users size={20} />
              </div>
              <h3 className="font-semibold text-gray-800 mb-1">
                Consult Instructor
              </h3>
              <p className="text-xs text-gray-500 mb-3">Book a session</p>
              <button className="text-cyan-600 hover:text-cyan-700 text-sm font-medium transition-colors">
                Request Meeting
              </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 text-center">
              <div className="mx-auto w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 mb-3">
                <FileText size={20} />
              </div>
              <h3 className="font-semibold text-gray-800 mb-1">
                Student Support
              </h3>
              <p className="text-xs text-gray-500 mb-3">Get help & support</p>
              <button className="text-emerald-600 hover:text-emerald-700 text-sm font-medium transition-colors">
                Contact Support
              </button>
            </div>
          </div>

          {/* Quote */}
          <div className="bg-gradient-to-r from-pink-500 to-purple-600 rounded-xl p-6 text-white">
            <div className="flex items-start">
              <span className="text-4xl font-serif">"</span>
              <div>
                <p className="text-lg font-medium">
                  Education is the most powerful weapon which you can use to
                  change the world.
                </p>
                <p className="text-sm mt-2">— Nelson Mandela</p>
              </div>
            </div>
          </div>
        </main>
      </motion.div>
    </div>
  );
}
