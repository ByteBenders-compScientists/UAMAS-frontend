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
const mockCourses = [
  {
    id: 1,
    code: 'CS 301',
    name: 'Database Systems',
    instructor: 'Dr. Smith',
    schedule: 'Monday, Wednesday 08:00 - 10:00',
    location: 'Room A101',
    progress: 75,
    upcoming: [
      { type: 'assignment', title: 'Database Design Project', dueDate: '2025-02-25' },
      { type: 'cat', title: 'SQL Queries CAT', dueDate: '2025-03-05' }
    ],
    materials: 12,
    color: 'blue'
  },
  {
    id: 2,
    code: 'MATH 202',
    name: 'Statistics & Probability',
    instructor: 'Prof. Johnson',
    schedule: 'Tuesday, Thursday 10:30 - 12:30',
    location: 'Room C301',
    progress: 60,
    upcoming: [
      { type: 'assignment', title: 'Statistical Analysis Report', dueDate: '2025-02-28' }
    ],
    materials: 8,
    color: 'green'
  },
  {
    id: 3,
    code: 'CS 302',
    name: 'Algorithms & Data Structures',
    instructor: 'Dr. Wilson',
    schedule: 'Tuesday, Friday 14:00 - 16:00',
    location: 'Room B205',
    progress: 82,
    upcoming: [
      { type: 'cat', title: 'Algorithm Complexity CAT', dueDate: '2025-03-10' },
      { type: 'assignment', title: 'Sorting Algorithms Implementation', dueDate: '2025-03-15' }
    ],
    materials: 15,
    color: 'purple'
  }
];

// Course details data for the expanded view
const mockCourseDetails = {
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

export default function MyCoursesPage() {
  const { sidebarCollapsed, isMobileView, isTabletView } = useLayout();
  const [hasContent] = useState(mockCourses.length > 0);
  const [selectedCourse, setSelectedCourse] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  
  // Simulate loading state for skeleton UI
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    
    return () => clearTimeout(timer);
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
        <Header title="My Courses" showWeekSelector={hasContent} />
        
        <main className="p-4 md:p-6">
          {!hasContent ? (
            <div className="max-w-4xl mx-auto">
              <EmptyState
                title="No Courses Available"
                description="You haven't been enrolled in any courses yet. Contact your academic advisor or check the course registration portal."
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
                        <p className="text-sm font-medium text-gray-600">Total Courses</p>
                        <p className="text-2xl font-bold text-gray-900">{mockCourses.length}</p>
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
                          {Math.round(mockCourses.reduce((acc, course) => acc + course.progress, 0) / mockCourses.length)}%
                        </p>
                      </div>
                      <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center">
                        <BarChart2 size={24} className="text-purple-600" />
                      </div>
                    </div>
                  )}
                </motion.div>
              </div>

              {/* Courses List */}
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-900">Current Semester Courses</h2>
                
                {isLoading ? (
                  // Skeleton loading for courses
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
                  mockCourses.map((course) => (
                    <motion.div
                      key={course.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden ${selectedCourse === course.id ? 'ring-2 ring-blue-500' : 'hover:shadow-md'} transition-all`}
                    >
                      <div 
                        className="p-6 cursor-pointer"
                        onClick={() => setSelectedCourse(selectedCourse === course.id ? null : course.id)}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center mb-2">
                              <div className={`w-2 h-10 ${getColorClasses(course.color).bg} rounded-full mr-3`}></div>
                              <div>
                                <h3 className="text-lg font-semibold text-gray-900">{course.name}</h3>
                                <p className="text-sm text-gray-600">{course.code}</p>
                              </div>
                            </div>
                            
                            <div className="ml-5 space-y-2">
                              <div className="flex items-center text-sm text-gray-600">
                                <Users size={16} className="mr-2" />
                                <span>Instructor: {course.instructor}</span>
                              </div>
                              
                              <div className="flex items-center text-sm text-gray-600">
                                <Calendar size={16} className="mr-2" />
                                <span>{course.schedule}</span>
                              </div>
                              
                              <div className="flex items-center text-sm text-gray-600">
                                <Clock size={16} className="mr-2" />
                                <span>{course.location}</span>
                              </div>
                              
                              <div className="mt-4">
                                <div className="flex items-center justify-between mb-1">
                                  <span className="text-sm font-medium text-gray-700">Progress</span>
                                  <span className="text-sm font-medium text-gray-700">{course.progress}%</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2.5">
                                  <div 
                                    className={`h-2.5 rounded-full ${getColorClasses(course.color).bg}`}
                                    style={{ width: `${course.progress}%` }}
                                  ></div>
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex flex-col items-center ml-4">
                            <div className={`w-16 h-16 ${getColorClasses(course.color).light} ${getColorClasses(course.color).text} rounded-lg flex items-center justify-center mb-2`}>
                              <BookOpen size={32} />
                            </div>
                            <span className="text-xs text-gray-500">{course.materials} Materials</span>
                          </div>
                        </div>
                        
                        {course.upcoming.length > 0 && (
                          <div className="mt-4 ml-5">
                            <h4 className="text-sm font-medium text-gray-700 mb-2">Upcoming</h4>
                            <div className="space-y-2">
                              {course.upcoming.map((item, index) => (
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
                            className={`text-gray-400 transition-transform ${selectedCourse === course.id ? 'rotate-180' : ''}`} 
                          />
                        </div>
                      </div>

                      {/* Expanded Course Detail */}
                      {selectedCourse === course.id && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="border-t border-gray-200"
                        >
                          {/* Tabs */}
                          <div className="flex border-b border-gray-200">
                            <button
                              className={`px-6 py-3 text-sm font-medium border-b-2 ${
                                activeTab === 'overview'
                                  ? `border-${course.color}-500 text-${course.color}-600`
                                  : 'border-transparent text-gray-500 hover:text-gray-700'
                              }`}
                              onClick={() => setActiveTab('overview')}
                            >
                              Overview
                            </button>
                            <button
                              className={`px-6 py-3 text-sm font-medium border-b-2 ${
                                activeTab === 'assessments'
                                  ? `border-${course.color}-500 text-${course.color}-600`
                                  : 'border-transparent text-gray-500 hover:text-gray-700'
                              }`}
                              onClick={() => setActiveTab('assessments')}
                            >
                              Assessments
                            </button>
                            <button
                              className={`px-6 py-3 text-sm font-medium border-b-2 ${
                                activeTab === 'materials'
                                  ? `border-${course.color}-500 text-${course.color}-600`
                                  : 'border-transparent text-gray-500 hover:text-gray-700'
                              }`}
                              onClick={() => setActiveTab('materials')}
                            >
                              Materials
                            </button>
                          </div>

                          {/* Tab Content */}
                          <div className="p-6">
                            {activeTab === 'overview' && (
                              <div>
                                <p className="text-gray-700 mb-6">{mockCourseDetails.description}</p>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                  <div>
                                    <h4 className="text-lg font-medium text-gray-900 mb-3">Instructor Information</h4>
                                    <div className={`p-4 rounded-lg ${getColorClasses(course.color).light} ${getColorClasses(course.color).border} border`}>
                                      <p className="text-sm font-medium text-gray-900 mb-1">{mockCourseDetails.instructor.name}</p>
                                      <p className="text-sm text-gray-700 mb-1">{mockCourseDetails.instructor.email}</p>
                                      <p className="text-sm text-gray-700 mb-1">{mockCourseDetails.instructor.office}</p>
                                      <p className="text-sm text-gray-700">Office Hours: {mockCourseDetails.instructor.officeHours}</p>
                                    </div>
                                  </div>
                                  
                                  <div>
                                    <h4 className="text-lg font-medium text-gray-900 mb-3">Schedule</h4>
                                    <div className="space-y-2">
                                      {mockCourseDetails.schedule.map((item, index) => (
                                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
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
                                <div className="mb-6">
                                  <h4 className="text-lg font-medium text-gray-900 mb-3">Assessment Breakdown</h4>
                                  <div className="grid grid-cols-5 gap-2">
                                    {mockCourseDetails.assessments.map((assessment, index) => (
                                      <div 
                                        key={index}
                                        className="text-center"
                                      >
                                        <div className="flex flex-col items-center">
                                          <div 
                                            className={`w-20 h-20 rounded-full flex items-center justify-center ${
                                              assessment.completed
                                                ? 'bg-green-100 text-green-700'
                                                : 'bg-gray-100 text-gray-700'
                                            }`}
                                          >
                                            <span className="text-lg font-bold">{assessment.weight}</span>
                                          </div>
                                          <span className="text-sm mt-2">{assessment.type}</span>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                                
                                <h4 className="text-lg font-medium text-gray-900 mb-3">Assessment Schedule</h4>
                                <div className="space-y-2">
                                  {mockCourseDetails.assessments.map((assessment, index) => (
                                    <div 
                                      key={index}
                                      className={`p-4 rounded-lg border ${
                                        assessment.completed
                                          ? 'border-green-200 bg-green-50'
                                          : 'border-gray-200 bg-gray-50'
                                      }`}
                                    >
                                      <div className="flex items-center justify-between">
                                        <div className="flex items-center">
                                          {assessment.completed ? (
                                            <CheckCircle size={16} className="mr-2 text-green-600" />
                                          ) : (
                                            <AlertCircle size={16} className="mr-2 text-amber-600" />
                                          )}
                                          <span className="text-sm font-medium text-gray-900">{assessment.title}</span>
                                          <span className={`ml-2 px-2 py-0.5 text-xs rounded-full ${
                                            assessment.type === 'Final Exam'
                                              ? 'bg-purple-100 text-purple-700'
                                              : assessment.type === 'CAT'
                                                ? 'bg-blue-100 text-blue-700'
                                                : 'bg-amber-100 text-amber-700'
                                          }`}>
                                            {assessment.type}
                                          </span>
                                        </div>
                                        
                                        <div className="flex items-center">
                                          <Calendar size={14} className="mr-1 text-gray-500" />
                                          <span className="text-sm text-gray-700">{assessment.date}</span>
                                          
                                          {assessment.completed && assessment.score && (
                                            <span className="ml-4 text-sm font-medium text-green-600">
                                              Score: {assessment.score}%
                                            </span>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            {activeTab === 'materials' && (
                              <div>
                                <h4 className="text-lg font-medium text-gray-900 mb-3">Course Materials</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                  {mockCourseDetails.materials.map((material, index) => (
                                    <div 
                                      key={index}
                                      className="p-4 bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
                                    >
                                      <div className="flex items-start justify-between">
                                        <div>
                                          <h5 className="text-sm font-medium text-gray-900 mb-1">{material.title}</h5>
                                          <div className="flex items-center text-xs text-gray-500 mb-2">
                                            <Calendar size={12} className="mr-1" />
                                            <span>{material.date}</span>
                                          </div>
                                          <span className={`px-2 py-1 text-xs rounded-full ${
                                            material.type === 'PDF'
                                              ? 'bg-red-50 text-red-700'
                                              : 'bg-blue-50 text-blue-700'
                                          }`}>
                                            {material.type}
                                          </span>
                                        </div>
                                        <button className="p-1 text-gray-400 hover:text-gray-600">
                                          <ExternalLink size={16} />
                                        </button>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </motion.div>
                  ))
                )}
              </div>
            </div>
          )}
        </main>
      </motion.div>
    </div>
  );
}