/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter, useSearchParams } from 'next/navigation';
import { useLayout } from '@/components/LayoutController';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import EmptyState from '@/components/EmptyState';

import { 
  BookOpen, 
  Calendar, 
  Clock, 
  Users,
  GraduationCap,
  FileText,
  ExternalLink,
  CheckCircle,
  AlertCircle,
  BarChart2,
  ChevronRight,
  ChevronDown,
  Bookmark
} from 'lucide-react';

const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080/api/v1"

const getColorClasses = (color: string) => {
  switch (color) {
    case 'blue':
      return { bg: 'bg-blue-500', light: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-700' };
    case 'green':
      return { bg: 'bg-green-500', light: 'bg-green-50', border: 'border-green-200', text: 'text-green-700' };
    case 'purple':
      return { bg: 'bg-purple-500', light: 'bg-purple-50', border: 'border-purple-200', text: 'text-purple-700' };
    case 'amber':
      return { bg: 'bg-amber-500', light: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-700' };
    case 'red':
      return { bg: 'bg-red-500', light: 'bg-red-50', border: 'border-red-200', text: 'text-red-700' };
    default:
      return { bg: 'bg-gray-500', light: 'bg-gray-50', border: 'border-gray-200', text: 'text-gray-700' };
  }
};

export default function MyUnitsPage() {
  const { sidebarCollapsed, isMobileView, isTabletView } = useLayout();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedUnit, setSelectedUnit] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [apiUnits, setApiUnits] = useState<unknown[] | null>(null);
  const [allAssessments, setAllAssessments] = useState<any[]>([]);

  useEffect(() => {
    const standalone = searchParams.get('standalone');
    if (standalone !== '1') {
      router.replace('/student/courses');
    }
  }, [router, searchParams]);

  // Simulate loading state for skeleton UI
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    fetch(`${apiBaseUrl}/auth/me`, {
      credentials: 'include',
    })
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data && Array.isArray(data.units)) {
          setApiUnits(data.units);
        }
      })
      .catch(() => {});
  }, []);

  // Fetch all assessments once for the student
  useEffect(() => {
    fetch(`${apiBaseUrl}/bd/student/assessments`, {
      credentials: 'include',
    })
      .then(res => res.ok ? res.json() : [])
      .then(data => {
        if (Array.isArray(data)) {
          setAllAssessments(data);
        }
      })
      .catch(() => {});
  }, []);

  const getDaysUntilDue = (dueDate: string) => {
    const due = new Date(dueDate);
    const now = new Date();
    const diffTime = due.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

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
        <Header title="My Units" showWeekSelector={!!(apiUnits && apiUnits.length > 0)} />
        
        <main className="p-4 md:p-6">
          {!apiUnits ? (
            <div className="max-w-4xl mx-auto">
              <EmptyState
                title="No Units Available"
                description="You haven't been enrolled in any units yet. Contact your academic advisor or check the unit registration portal."
                icon={<BookOpen size={48} />}
              />
            </div>
          ) : (
            <div className="max-w-8xl mx-auto">
              {/* Stats Overview */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                {/* Total Units */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: isLoading ? 0 : 1, y: isLoading ? 20 : 0 }}
                  transition={{ delay: 0.1 }}
                  className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Units</p>
                      <p className="text-2xl font-bold text-blue-600">{apiUnits.length}</p>
                    </div>
                    <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                      <BookOpen size={24} className="text-blue-600" />
                    </div>
                  </div>
                </motion.div>
                {/* Total Assessments */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: isLoading ? 0 : 1, y: isLoading ? 20 : 0 }}
                  transition={{ delay: 0.2 }}
                  className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Assessments</p>
                      <p className="text-2xl font-bold text-emerald-600">{allAssessments.length}</p>
                    </div>
                    <div className="w-12 h-12 bg-emerald-50 rounded-lg flex items-center justify-center">
                      <BarChart2 size={24} className="text-emerald-600" />
                    </div>
                  </div>
                </motion.div>
                {/* CATS */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: isLoading ? 0 : 1, y: isLoading ? 20 : 0 }}
                  transition={{ delay: 0.3 }}
                  className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">CATS</p>
                      <p className="text-2xl font-bold text-violet-600">{allAssessments.filter(a => a.type && a.type.toLowerCase().includes('cat')).length}</p>
                    </div>
                    <div className="w-12 h-12 bg-violet-50 rounded-lg flex items-center justify-center">
                      <Calendar size={24} className="text-violet-600" />
                    </div>
                  </div>
                </motion.div>
                {/* Assignment */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: isLoading ? 0 : 1, y: isLoading ? 20 : 0 }}
                  transition={{ delay: 0.4 }}
                  className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Assignment</p>
                      <p className="text-2xl font-bold text-amber-600">{allAssessments.filter(a => a.type && a.type.toLowerCase().includes('assignment')).length}</p>
                    </div>
                    <div className="w-12 h-12 bg-amber-50 rounded-lg flex items-center justify-center">
                      <FileText size={24} className="text-amber-600" />
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Units List */}
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-900">Current Semester Units</h2>
                
                {isLoading ? (
                  // Skeleton loading for units
                  Array.from({ length: 3 }).map((_, index) => (
                    <div 
                      key={index}
                      className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 animate-pulse"
                    >
                      <div className="flex justify-between items-start">
                        <div className="space-y-3 w-full">
                          <div className="h-6 bg-gray-300 rounded w-1/4"></div>
                          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                          <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                          <div className="h-4 bg-gray-200 rounded w-full"></div>
                        </div>
                        <div className="h-16 w-16 bg-gray-300 rounded-lg"></div>
                      </div>
                    </div>
                  ))
                ) : (
                  apiUnits.map((unit: any) => {
                    return (
                      <motion.div
                        key={unit.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden ${selectedUnit === unit.id ? 'ring-2 ring-blue-500' : 'hover:shadow-md'} transition-all`}
                      >
                        <div 
                          className="p-6 cursor-pointer"
                          onClick={() => setSelectedUnit(selectedUnit === unit.id ? null : unit.id)}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center mb-2">
                                <div className={`w-2 h-10 ${getColorClasses(unit.color).bg} rounded-full mr-3`}></div>
                                <div>
                                  <h3 className="text-lg font-semibold text-gray-900">{unit.unit_name || unit.name}</h3>
                                  <p className="text-sm text-gray-600">{unit.unit_code || unit.code}</p>
                                  <div className="flex flex-wrap gap-2 mt-2">
                                    {unit.level && (
                                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">Level {unit.level}</span>
                                    )}
                                    {unit.semester && (
                                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">Semester {unit.semester}</span>
                                    )}
                                    {unit.course_name && (
                                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-700">{unit.course_name}</span>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="flex flex-col items-center ml-4">
                              <div className={`w-16 h-16 ${getColorClasses(unit.color).light} ${getColorClasses(unit.color).text} rounded-lg flex items-center justify-center mb-2`}>
                                <BookOpen size={32} />
                              </div>
                              <span className="text-xs text-gray-500">{0} Materials</span>
                            </div>
                          </div>
                          {Array.isArray(unit.upcoming) && unit.upcoming.length > 0 && (
                            <div className="mt-4 ml-5">
                              <h4 className="text-sm font-medium text-gray-700 mb-2">Upcoming</h4>
                              <div className="space-y-2">
                                {unit.upcoming.map((item: any, index: number) => (
                                  <div 
                                    key={index}
                                    className={`flex items-center justify-between p-2 rounded-lg ${
                                      getDaysUntilDue(item.dueDate) <= 3 
                                        ? 'bg-red-50 text-red-700' 
                                        : 'bg-gray-50 text-gray-700'
                                    }`}
                                  >
                                    <div className="flex items-center">
                                      {item.type === 'assignment' ? (
                                        <FileText size={16} className="mr-2" />
                                      ) : (
                                        <BookOpen size={16} className="mr-2" />
                                      )}
                                      <span className="text-sm font-medium">{item.title}</span>
                                    </div>
                                    <div className="flex items-center">
                                      <Clock size={14} className="mr-1" />
                                      <span className="text-xs">
                                        Due in {getDaysUntilDue(item.dueDate)} days
                                      </span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                          <div className="flex justify-center mt-4">
                            <ChevronDown 
                              size={20} 
                              className={`text-gray-400 transition-transform ${selectedUnit === unit.id ? 'rotate-180' : ''}`} 
                            />
                          </div>
                        </div>
                        {/* Expanded Unit Detail (dummy for now) */}
                        {selectedUnit === unit.id && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="border-t border-gray-200"
                          >
                            {/* Tabs */}
                            <div className="flex border-b border-gray-200">
                              {['overview', 'assessments', 'materials'].map(tab => (
                                <button
                                  key={tab}
                                  className={`px-6 py-3 text-sm font-medium border-b-2 ${
                                    activeTab === tab
                                      ? 'border-blue-500 text-blue-600'
                                      : 'border-transparent text-gray-500 hover:text-gray-700'
                                  }`}
                                  onClick={() => setActiveTab(tab)}
                                >
                                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                                </button>
                              ))}
                            </div>

                            {/* Tab Content */}
                            <div className="p-6">
                              {activeTab === 'overview' && (
                                <div>
                                  <p className="text-gray-700 mb-6">{unit.description || 'No description available.'}</p>
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                      <h4 className="text-lg font-medium text-gray-900 mb-3">Instructor Information</h4>
                                      <div className="p-4 rounded-lg bg-blue-50 border border-blue-200">
                                        <p className="text-sm font-medium text-gray-900 mb-1">{unit.instructorDetails?.name || 'N/A'}</p>
                                        <p className="text-sm text-gray-700 mb-1">{unit.instructorDetails?.email || ''}</p>
                                        <p className="text-sm text-gray-700 mb-1">{unit.instructorDetails?.office || ''}</p>
                                        <p className="text-sm text-gray-700">Office Hours: {unit.instructorDetails?.officeHours || ''}</p>
                                      </div>
                                    </div>
                                    <div>
                                      <h4 className="text-lg font-medium text-gray-900 mb-3">Schedule</h4>
                                      <div className="space-y-2">
                                        {(unit.scheduleDetails || []).map((item: any, idx: number) => (
                                          <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                            <div className="flex items-center">
                                              <Calendar size={16} className="mr-2 text-gray-500" />
                                              <span className="text-sm text-gray-900">{item.day}</span>
                                            </div>
                                            <div className="flex items-center">
                                              <Clock size={16} className="mr-2 text-gray-500" />
                                              <span className="text-sm text-gray-900">{item.time}</span>
                                            </div>
                                            <div>
                                              <span className={`px-2 py-1 text-xs rounded-full ${
                                                item.type === 'Lecture'
                                                  ? 'bg-blue-50 text-blue-700'
                                                  : 'bg-green-50 text-green-700'
                                              }`}>
                                                {item.type}
                                              </span>
                                            </div>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              )}

                              {activeTab === 'assessments' && (
                                <div>
                                  <h4 className="text-lg font-medium text-gray-900 mb-3">Assessments</h4>
                                  <div className="space-y-2">
                                    {allAssessments.length === 0 ? (
                                      <p className="text-gray-500">No assessments available.</p>
                                    ) : (
                                      allAssessments.map((a, idx) => (
                                        <div key={a.id || idx} className="flex items-center justify-between p-2 rounded-lg bg-gray-50 text-gray-700">
                                          <div>
                                            <span className="font-medium">{a.title}</span>
                                            <span className="ml-2 text-xs text-gray-500">{a.type}</span>
                                          </div>
                                          <div className="text-xs text-gray-500">
                                            {a.total_marks} marks • {a.number_of_questions} questions
                                          </div>
                                        </div>
                                      ))
                                    )}
                                  </div>
                                </div>
                              )}

                              {activeTab === 'materials' && (
                                <div>
                                  <h4 className="text-lg font-medium text-gray-900 mb-3">Materials</h4>
                                  <div className="text-gray-500">No materials available (dummy).</div>
                                </div>
                              )}
                            </div>
                          </motion.div>
                        )}
                      </motion.div>
                    );
                  })
                )}
              </div>
            </div>
          )}
        </main>
      </motion.div>
    </div>
  );
}