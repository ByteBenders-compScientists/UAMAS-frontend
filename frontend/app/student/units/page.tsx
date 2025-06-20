'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
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

// Mock data
const mockUnits = [
  {
    id: 1,
    unit_code: 'CS 301',
    unit_name: 'Database Systems',
    name: 'Database Systems',
    code: 'CS 301',
    instructor: 'Dr. Smith',
    lecturers: [
      { id: 1, name: 'Dr. Smith', email: 'smith@university.edu' }
    ],
    schedule: 'Monday, Wednesday 08:00 - 10:00',
    location: 'Room A101',
    progress: 75,
    upcoming: [
      { type: 'assignment', title: 'Database Design Project', dueDate: '2025-02-25' },
      { type: 'cat', title: 'SQL Queries CAT', dueDate: '2025-03-05' }
    ],
    materials: 12,
    color: 'blue',
    scheduleDetails: [
      { day: 'Monday', time: '08:00 - 10:00', type: 'Lecture', location: 'Room A101' },
      { day: 'Wednesday', time: '08:00 - 10:00', type: 'Lecture', location: 'Room A101' },
      { day: 'Wednesday', time: '14:00 - 16:00', type: 'Lab', location: 'Computer Lab 1' }
    ],
    instructorDetails: {
      name: 'Dr. Smith',
      email: 'smith@university.edu',
      office: 'Computer Science Building, Room 305',
      officeHours: 'Wednesday 14:00 - 16:00'
    },
    description: 'This course covers principles of database design and management. Topics include data models, query languages, normalization, indexing, transactions, and distributed databases.'
  },
  {
    id: 2,
    unit_code: 'MATH 202',
    unit_name: 'Statistics & Probability',
    name: 'Statistics & Probability',
    code: 'MATH 202',
    instructor: 'Prof. Johnson',
    lecturers: [
      { id: 2, name: 'Prof. Johnson', email: 'johnson@university.edu' }
    ],
    schedule: 'Tuesday, Thursday 10:30 - 12:30',
    location: 'Room C301',
    progress: 60,
    upcoming: [
      { type: 'assignment', title: 'Statistical Analysis Report', dueDate: '2025-02-28' }
    ],
    materials: 8,
    color: 'green',
    scheduleDetails: [
      { day: 'Tuesday', time: '10:30 - 12:30', type: 'Lecture', location: 'Room C301' },
      { day: 'Thursday', time: '10:30 - 12:30', type: 'Lecture', location: 'Room C301' }
    ],
    instructorDetails: {
      name: 'Prof. Johnson',
      email: 'johnson@university.edu',
      office: 'Mathematics Building, Room 210',
      officeHours: 'Tuesday 13:00 - 15:00'
    },
    description: 'This unit covers probability theory, statistical inference, hypothesis testing, and regression analysis.'
  },
  {
    id: 3,
    unit_code: 'CS 302',
    unit_name: 'Algorithms & Data Structures',
    name: 'Algorithms & Data Structures',
    code: 'CS 302',
    instructor: 'Dr. Wilson',
    lecturers: [
      { id: 3, name: 'Dr. Wilson', email: 'wilson@university.edu' }
    ],
    schedule: 'Tuesday, Friday 14:00 - 16:00',
    location: 'Room B205',
    progress: 82,
    upcoming: [
      { type: 'cat', title: 'Algorithm Complexity CAT', dueDate: '2025-03-10' },
      { type: 'assignment', title: 'Sorting Algorithms Implementation', dueDate: '2025-03-15' }
    ],
    materials: 15,
    color: 'purple',
    scheduleDetails: [
      { day: 'Tuesday', time: '14:00 - 16:00', type: 'Lecture', location: 'Room B205' },
      { day: 'Friday', time: '14:00 - 16:00', type: 'Lecture', location: 'Room B205' }
    ],
    instructorDetails: {
      name: 'Dr. Wilson',
      email: 'wilson@university.edu',
      office: 'Computer Science Building, Room 210',
      officeHours: 'Friday 10:00 - 12:00'
    },
    description: 'This unit covers algorithm design, complexity analysis, and fundamental data structures.'
  }
];

// Unit details data for the expanded view
const mockUnitDetails = {
  id: 1,
  code: 'CS 301',
  name: 'Database Systems',
  description: 'This course covers principles of database design and management. Topics include data models, query languages, normalization, indexing, transactions, and distributed databases.',
  instructor: {
    name: 'Dr. Smith',
    email: 'smith@university.edu',
    office: 'Computer Science Building, Room 305',
    officeHours: 'Wednesday 14:00 - 16:00'
  },
  schedule: [
    { day: 'Monday', time: '08:00 - 10:00', type: 'Lecture', location: 'Room A101' },
    { day: 'Wednesday', time: '08:00 - 10:00', type: 'Lecture', location: 'Room A101' },
    { day: 'Wednesday', time: '14:00 - 16:00', type: 'Lab', location: 'Computer Lab 1' }
  ],
  assessments: [
    { type: 'CAT', title: 'SQL Basics', weight: '15%', date: '2025-02-05', completed: true, score: 88 },
    { type: 'Assignment', title: 'ER Diagram', weight: '20%', date: '2025-02-15', completed: true, score: 92 },
    { type: 'CAT', title: 'SQL Queries', weight: '15%', date: '2025-03-05', completed: false },
    { type: 'Assignment', title: 'Database Design Project', weight: '20%', date: '2025-02-25', completed: false },
    { type: 'Final Exam', title: 'Final Examination', weight: '30%', date: '2025-04-20', completed: false }
  ],
  materials: [
    { title: 'Introduction to Database Systems', type: 'PDF', date: '2025-01-10' },
    { title: 'ER Modeling Techniques', type: 'PDF', date: '2025-01-15' },
    { title: 'SQL Fundamentals', type: 'Video', date: '2025-01-20' },
    { title: 'Normalization Principles', type: 'PDF', date: '2025-01-25' },
    { title: 'Indexing and Query Optimization', type: 'PDF', date: '2025-02-01' }
  ],
  progress: 75,
  color: 'blue'
};

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
  const [hasContent] = useState(mockUnits.length > 0);
  const [selectedUnit, setSelectedUnit] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [apiUnits, setApiUnits] = useState<any[] | null>(null);
  const [assessmentsByUnit, setAssessmentsByUnit] = useState<{ [unitId: string]: any[] }>({});
  
  // Simulate loading state for skeleton UI
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    fetch('http://localhost:8080/api/v1/profile/student/details/units', {
      credentials: 'include',
    })
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        console.log(data);
        if (data && Array.isArray(data.units)) {
          setApiUnits(data.units);
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!apiUnits) return;

    // Assume you have year_of_study and semester from the student profile or API
    const year = apiUnits.length > 0 ? apiUnits[0].level : 4; // fallback
    const semester = apiUnits.length > 0 ? apiUnits[0].semester : 1; // fallback

    apiUnits.forEach((unit) => {
      const courseId = unit.course_id;
      if (!courseId) return;

      fetch(`http://localhost:8080/api/v1/bd/student/${courseId}/assessments?year=${year}&semester=${semester}`, {
        credentials: 'include',
      })
        .then(res => res.ok ? res.json() : [])
        .then(data => {
          setAssessmentsByUnit(prev => ({
            ...prev,
            [unit.id]: Array.isArray(data) ? data : [],
          }));
        })
        .catch(() => {});
    });
  }, [apiUnits]);

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
        <Header title="My Units" showWeekSelector={hasContent} />
        
        <main className="p-4 md:p-6">
          {!hasContent ? (
            <div className="max-w-4xl mx-auto">
              <EmptyState
                title="No Units Available"
                description="You haven't been enrolled in any units yet. Contact your academic advisor or check the unit registration portal."
                icon={<BookOpen size={48} />}
              />
            </div>
          ) : (
            <div className="max-w-7xl mx-auto">
              {/* Stats Overview */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: isLoading ? 0 : 1, y: isLoading ? 20 : 0 }}
                  transition={{ delay: 0.1 }}
                  className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
                >
                  {isLoading ? (
                    <div className="animate-pulse space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                      <div className="h-8 bg-gray-300 rounded w-1/3"></div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Total Units</p>
                        <p className="text-2xl font-bold text-gray-900">{mockUnits.length}</p>
                      </div>
                      <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                        <BookOpen size={24} className="text-blue-600" />
                      </div>
                    </div>
                  )}
                </motion.div>

                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: isLoading ? 0 : 1, y: isLoading ? 20 : 0 }}
                  transition={{ delay: 0.2 }}
                  className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
                >
                  {isLoading ? (
                    <div className="animate-pulse space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                      <div className="h-8 bg-gray-300 rounded w-1/3"></div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Credit Hours</p>
                        <p className="text-2xl font-bold text-green-600">12</p>
                      </div>
                      <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
                        <GraduationCap size={24} className="text-green-600" />
                      </div>
                    </div>
                  )}
                </motion.div>

                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: isLoading ? 0 : 1, y: isLoading ? 20 : 0 }}
                  transition={{ delay: 0.3 }}
                  className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
                >
                  {isLoading ? (
                    <div className="animate-pulse space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                      <div className="h-8 bg-gray-300 rounded w-1/3"></div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Upcoming Tasks</p>
                        <p className="text-2xl font-bold text-amber-600">5</p>
                      </div>
                      <div className="w-12 h-12 bg-amber-50 rounded-lg flex items-center justify-center">
                        <Clock size={24} className="text-amber-600" />
                      </div>
                    </div>
                  )}
                </motion.div>

                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: isLoading ? 0 : 1, y: isLoading ? 20 : 0 }}
                  transition={{ delay: 0.4 }}
                  className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
                >
                  {isLoading ? (
                    <div className="animate-pulse space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                      <div className="h-8 bg-gray-300 rounded w-1/3"></div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Average Progress</p>
                        <p className="text-2xl font-bold text-purple-600">
                          {Math.round(mockUnits.reduce((acc, unit) => acc + unit.progress, 0) / mockUnits.length)}%
                        </p>
                      </div>
                      <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center">
                        <BarChart2 size={24} className="text-purple-600" />
                      </div>
                    </div>
                  )}
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
                  (apiUnits || mockUnits).map((unit: any) => {
                    // Fill missing fields with dummy values for API units
                    const safeUnit = {
                      ...unit,
                      color: unit.color || 'blue',
                      progress: typeof unit.progress === 'number' ? unit.progress : 70,
                      schedule: unit.schedule || [],
                      upcoming: unit.upcoming || [],
                      materials: unit.materials || [],
                    };
                    const allAssessments = assessmentsByUnit[safeUnit.id] || [];
                    const assessments = allAssessments.filter(a => a.unit_id === safeUnit.id);
                    return (
                      <motion.div
                        key={safeUnit.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden ${selectedUnit === safeUnit.id ? 'ring-2 ring-blue-500' : 'hover:shadow-md'} transition-all`}
                      >
                        <div 
                          className="p-6 cursor-pointer"
                          onClick={() => setSelectedUnit(selectedUnit === safeUnit.id ? null : safeUnit.id)}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center mb-2">
                                <div className={`w-2 h-10 ${getColorClasses(safeUnit.color).bg} rounded-full mr-3`}></div>
                                <div>
                                  <h3 className="text-lg font-semibold text-gray-900">{safeUnit.unit_name || safeUnit.name}</h3>
                                  <p className="text-sm text-gray-600">{safeUnit.unit_code || safeUnit.code}</p>
                                  {safeUnit.lecturers && safeUnit.lecturers.length > 0 && (
                                    <p className="text-xs text-gray-500 mt-1">
                                      Lecturers: {safeUnit.lecturers.map((l: any) => l.name).join(', ')}
                                    </p>
                                  )}
                                </div>
                              </div>
                              <div className="ml-5 space-y-2">
                                <div className="flex items-center text-sm text-gray-600">
                                  <Users size={16} className="mr-2" />
                                  <span>Instructor: {(safeUnit.lecturers && safeUnit.lecturers.length > 0) ? safeUnit.lecturers.map((l: any) => l.name).join(', ') : 'N/A'}</span>
                                </div>
                                <div className="flex items-center text-sm text-gray-600">
                                  <Calendar size={16} className="mr-2" />
                                  <span>{safeUnit.schedule.length > 0 ? safeUnit.schedule.map((s: any) => `${s.day} ${s.time}`).join(', ') : 'Mon, Wed 08:00 - 10:00'}</span>
                                </div>
                                <div className="flex items-center text-sm text-gray-600">
                                  <Clock size={16} className="mr-2" />
                                  <span>{safeUnit.location || 'Room A101'}</span>
                                </div>
                                <div className="mt-4">
                                  <div className="flex items-center justify-between mb-1">
                                    <span className="text-sm font-medium text-gray-700">Progress</span>
                                    <span className="text-sm font-medium text-gray-700">{safeUnit.progress}%</span>
                                  </div>
                                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                                    <div 
                                      className={`h-2.5 rounded-full ${getColorClasses(safeUnit.color).bg}`}
                                      style={{ width: `${safeUnit.progress}%` }}
                                    ></div>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="flex flex-col items-center ml-4">
                              <div className={`w-16 h-16 ${getColorClasses(safeUnit.color).light} ${getColorClasses(safeUnit.color).text} rounded-lg flex items-center justify-center mb-2`}>
                                <BookOpen size={32} />
                              </div>
                              <span className="text-xs text-gray-500">{safeUnit.materials.length} Materials</span>
                            </div>
                          </div>
                          {safeUnit.upcoming.length > 0 && (
                            <div className="mt-4 ml-5">
                              <h4 className="text-sm font-medium text-gray-700 mb-2">Upcoming</h4>
                              <div className="space-y-2">
                                {safeUnit.upcoming.map((item: any, index: number) => (
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
                          {assessments.length > 0 && (
                            <div className="mt-4 ml-5">
                              <h4 className="text-sm font-medium text-gray-700 mb-2">Assessments</h4>
                              <div className="space-y-2">
                                {assessments.map((a, idx) => (
                                  <div key={a.id || idx} className="flex items-center justify-between p-2 rounded-lg bg-gray-50 text-gray-700">
                                    <div>
                                      <span className="font-medium">{a.title}</span>
                                      <span className="ml-2 text-xs text-gray-500">{a.type}</span>
                                    </div>
                                    <div className="text-xs text-gray-500">
                                      {a.total_marks} marks • {a.number_of_questions} questions
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                          <div className="flex justify-center mt-4">
                            <ChevronDown 
                              size={20} 
                              className={`text-gray-400 transition-transform ${selectedUnit === safeUnit.id ? 'rotate-180' : ''}`} 
                            />
                          </div>
                        </div>
                        {/* Expanded Unit Detail (dummy for now) */}
                        {selectedUnit === safeUnit.id && (
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
                                  <p className="text-gray-700 mb-6">{safeUnit.description || 'No description available.'}</p>
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                      <h4 className="text-lg font-medium text-gray-900 mb-3">Instructor Information</h4>
                                      <div className="p-4 rounded-lg bg-blue-50 border border-blue-200">
                                        <p className="text-sm font-medium text-gray-900 mb-1">{safeUnit.instructorDetails?.name || 'N/A'}</p>
                                        <p className="text-sm text-gray-700 mb-1">{safeUnit.instructorDetails?.email || ''}</p>
                                        <p className="text-sm text-gray-700 mb-1">{safeUnit.instructorDetails?.office || ''}</p>
                                        <p className="text-sm text-gray-700">Office Hours: {safeUnit.instructorDetails?.officeHours || ''}</p>
                                      </div>
                                    </div>
                                    <div>
                                      <h4 className="text-lg font-medium text-gray-900 mb-3">Schedule</h4>
                                      <div className="space-y-2">
                                        {(safeUnit.scheduleDetails || []).map((item: any, idx: number) => (
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
                                    {assessments.length === 0 ? (
                                      <p className="text-gray-500">No assessments available.</p>
                                    ) : (
                                      assessments.map((a, idx) => (
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