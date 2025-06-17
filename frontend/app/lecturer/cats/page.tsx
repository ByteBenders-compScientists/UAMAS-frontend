'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLayout } from '@/components/LayoutController';
import Sidebar from '@/components/lecturerSidebar';
import Header from '@/components/Header';
import EmptyState from '@/components/EmptyState';
import { 
  BookMarked, BarChart3, Clock, Monitor, Plus, User, 
  Users, Bell, Menu, X, Type, ChevronDown, ChevronUp, GraduationCap,
  FileText, MessageSquare, Settings, Upload, Image, Calendar,
  File, CheckCircle, AlertCircle, BookOpen, ChevronRight, Download,
  MessageCircle, Book, Edit, Trash2, Eye, Filter, Search, 
  CalendarDays, Timer, FileCheck
} from 'lucide-react';

// ===== TYPES =====
interface CAT {
  id: string;
  title: string;
  course: string;
  date: string;
  status: 'Scheduled' | 'Completed' | 'Draft' | 'In Progress';
  duration: string;
  week: number;
  totalStudents: number;
  completedStudents: number;
  files?: File[];
  description?: string;
  createdAt: string;
}

interface Course {
  id: string;
  name: string;
  code: string;
  color: string;
}

// ===== CONSTANTS =====
const SAMPLE_COURSES: Course[] = [
  { id: '1', name: 'Computer Science 201', code: 'CS201', color: 'bg-rose-500' },
  { id: '2', name: 'Computer Science 301', code: 'CS301', color: 'bg-blue-500' },
  { id: '3', name: 'Database Management', code: 'CS202', color: 'bg-purple-500' },
  { id: '4', name: 'Operating Systems', code: 'CS203', color: 'bg-green-500' },
  { id: '5', name: 'Software Engineering', code: 'CS302', color: 'bg-yellow-500' }
];

// Week options for selection
const WEEK_OPTIONS = Array.from({ length: 15 }, (_, i) => ({
  value: i + 1,
  label: `Week ${i + 1}`,
  dateRange: `Feb ${1 + i * 7} - Feb ${7 + i * 7}`
}));

const INITIAL_CATS: CAT[] = [
  {
    id: '1',
    title: 'Math CAT 1',
    course: '1',
    date: '2025-02-20',
    status: 'Scheduled',
    duration: '2',
    week: 3,
    totalStudents: 45,
    completedStudents: 0,
    description: 'Comprehensive assessment covering algebra and calculus fundamentals',
    createdAt: '2025-01-15'
  },
  {
    id: '2',
    title: 'Science CAT 2',
    course: '3',
    date: '2025-02-25',
    status: 'Draft',
    duration: '1.5',
    week: 3,
    totalStudents: 38,
    completedStudents: 0,
    description: 'Laboratory practical assessment on chemical reactions',
    createdAt: '2025-01-18'
  },
  {
    id: '3',
    title: 'History CAT 3',
    course: '4',
    date: '2025-02-10',
    status: 'Completed',
    duration: '2',
    week: 2,
    totalStudents: 42,
    completedStudents: 42,
    description: 'Assessment on World War II and its impact on modern society',
    createdAt: '2025-01-10'
  },
  {
    id: '4',
    title: 'Programming Fundamentals CAT',
    course: '2',
    date: '2025-03-01',
    status: 'In Progress',
    duration: '3',
    week: 4,
    totalStudents: 50,
    completedStudents: 35,
    description: 'Practical coding assessment covering loops, functions, and data structures',
    createdAt: '2025-01-20'
  },
  {
    id: '5',
    title: 'Database Design CAT',
    course: '3',
    date: '2025-02-05',
    status: 'Completed',
    duration: '2',
    week: 1,
    totalStudents: 38,
    completedStudents: 38,
    description: 'Assessment on ER diagrams and normalization',
    createdAt: '2025-01-05'
  },
  {
    id: '6',
    title: 'Web Development CAT',
    course: '5',
    date: '2025-02-12',
    status: 'In Progress',
    duration: '2.5',
    week: 2,
    totalStudents: 55,
    completedStudents: 40,
    description: 'HTML, CSS, and JavaScript fundamentals assessment',
    createdAt: '2025-01-08'
  }
];

// ===== UTILITY FUNCTIONS =====
const formatDate = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

const getStatusBadgeClass = (status: string): string => {
  const statusClasses: Record<string, string> = {
    'Scheduled': 'bg-yellow-100 text-yellow-700',
    'Completed': 'bg-green-100 text-green-700',
    'Draft': 'bg-gray-100 text-gray-700',
    'In Progress': 'bg-blue-100 text-blue-700'
  };
  return statusClasses[status] || 'bg-gray-100 text-gray-700';
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'Scheduled': return CalendarDays;
    case 'Completed': return CheckCircle;
    case 'Draft': return FileText;
    case 'In Progress': return Timer;
    default: return FileText;
  }
};

const getCourseByCode = (courseCode: string) => {
  return SAMPLE_COURSES.find(course => course.id === courseCode) || SAMPLE_COURSES[0];
};

// ===== COMPONENTS =====
const WeekAndCourseSelector: React.FC<{
  selectedWeek: number;
  selectedCourse: string;
  onWeekChange: (week: number) => void;
  onCourseChange: (courseId: string) => void;
}> = ({ selectedWeek, selectedCourse, onWeekChange, onCourseChange }) => (
  <div className="flex flex-col md:flex-row md:space-x-4 mb-6 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
    <div className="flex-1 mb-3 md:mb-0">
      <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Course</label>
      <select
        className="border border-gray-300 p-3 w-full rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent bg-white"
        value={selectedCourse}
        onChange={e => onCourseChange(e.target.value)}
      >
        <option value="">All Courses</option>
        {SAMPLE_COURSES.map(course => (
          <option key={course.id} value={course.id}>{course.name} ({course.code})</option>
        ))}
      </select>
    </div>
    <div className="flex-1">
      <label className="block text-sm font-medium text-gray-700 mb-2">Select Week</label>
      <select
        className="border border-gray-300 p-3 w-full rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent bg-white"
        value={selectedWeek}
        onChange={e => onWeekChange(Number(e.target.value))}
      >
        {WEEK_OPTIONS.map(week => (
          <option key={week.value} value={week.value}>
            {week.label} ({week.dateRange})
          </option>
        ))}
      </select>
    </div>
  </div>
);

const CATStatsCards: React.FC<{ cats: CAT[] }> = ({ cats }) => {
  const totalCATs = cats.length;
  const scheduledCATs = cats.filter(cat => cat.status === 'Scheduled').length;
  const completedCATs = cats.filter(cat => cat.status === 'Completed').length;
  const inProgressCATs = cats.filter(cat => cat.status === 'In Progress').length;

  const statsData = [
    { icon: BookMarked, label: 'Total CATs', value: totalCATs.toString(), color: 'bg-blue-100 text-blue-600' },
    { icon: CalendarDays, label: 'Scheduled', value: scheduledCATs.toString(), color: 'bg-yellow-100 text-yellow-600' },
    { icon: Timer, label: 'In Progress', value: inProgressCATs.toString(), color: 'bg-purple-100 text-purple-600' },
    { icon: CheckCircle, label: 'Completed', value: completedCATs.toString(), color: 'bg-green-100 text-green-600' }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-6">
      {statsData.map((stat, index) => (
        <motion.div 
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex items-center space-x-4"
        >
          <div className={`p-2 rounded-full ${stat.color}`}>
            <stat.icon className="w-6 h-6" />
          </div>
          <div>
            <div className="text-lg font-bold">{stat.value}</div>
            <div className="text-sm text-gray-500">{stat.label}</div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

const CATCard: React.FC<{ 
  cat: CAT; 
  onEdit: (cat: CAT) => void; 
  onDelete: (catId: string) => void;
  onView: (cat: CAT) => void;
  index: number;
}> = ({ cat, onEdit, onDelete, onView, index }) => {
  const course = getCourseByCode(cat.course);
  const StatusIcon = getStatusIcon(cat.status);
  const completionPercentage = cat.totalStudents > 0 ? (cat.completedStudents / cat.totalStudents) * 100 : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow"
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-800 mb-1">{cat.title}</h3>
          <div className="flex items-center space-x-2 mb-2">
            <span className={`inline-block w-3 h-3 rounded-full ${course.color}`}></span>
            <span className="text-sm text-gray-600">{course.name}</span>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center ${getStatusBadgeClass(cat.status)}`}>
            <StatusIcon className="w-3 h-3 mr-1" />
            {cat.status}
          </span>
        </div>
      </div>

      {cat.description && (
        <p className="text-sm text-gray-600 mb-4 line-clamp-2">{cat.description}</p>
      )}

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="flex items-center text-sm text-gray-600">
          <CalendarDays className="w-4 h-4 mr-2" />
          {formatDate(cat.date)}
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <Timer className="w-4 h-4 mr-2" />
          {cat.duration} hour{cat.duration !== '1' ? 's' : ''}
        </div>
      </div>

      {cat.status === 'In Progress' || cat.status === 'Completed' ? (
        <div className="mb-4">
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm text-gray-600">Progress</span>
            <span className="text-sm font-medium text-gray-800">
              {cat.completedStudents}/{cat.totalStudents} completed
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-rose-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${completionPercentage}%` }}
            ></div>
          </div>
          <span className="text-xs text-gray-500 mt-1">
            {Math.round(completionPercentage)}% complete
          </span>
        </div>
      ) : (
        <div className="mb-4">
          <span className="text-sm text-gray-600">
            {cat.totalStudents} students enrolled
          </span>
        </div>
      )}

      <div className="flex justify-between items-center pt-4 border-t border-gray-100">
        <span className="text-xs text-gray-500">
          Created {formatDate(cat.createdAt)}
        </span>
        <div className="flex space-x-2">
          <button
            onClick={() => onView(cat)}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium px-3 py-1 rounded border border-blue-200 hover:bg-blue-50 transition-colors"
          >
            View
          </button>
          <button
            onClick={() => onEdit(cat)}
            className="text-green-600 hover:text-green-800 text-sm font-medium px-3 py-1 rounded border border-green-200 hover:bg-green-50 transition-colors"
          >
            Edit
          </button>
          <button
            onClick={() => onDelete(cat.id)}
            className="text-red-600 hover:text-red-800 text-sm font-medium px-3 py-1 rounded border border-red-200 hover:bg-red-50 transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </motion.div>
  );
};

// ===== MAIN COMPONENT =====
const page: React.FC = () => {
  const { sidebarCollapsed, isMobileView, isTabletView } = useLayout();
  const [loading, setLoading] = useState(true);
  const [hasContent, setHasContent] = useState(false);
  const [cats, setCats] = useState<CAT[]>(INITIAL_CATS);
  const [selectedWeek, setSelectedWeek] = useState<number>(2);
  const [selectedCourse, setSelectedCourse] = useState<string>('');

  // Filter CATs based on selected week and course
  const filteredCATs = cats.filter(
    (cat) =>
      cat.week === selectedWeek &&
      (selectedCourse === '' || cat.course === selectedCourse)
  );

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
      setHasContent(INITIAL_CATS.length > 0);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);

  const handleEdit = (cat: CAT) => {
    console.log('Edit CAT:', cat);
    // Implement edit functionality
  };

  const handleDelete = (catId: string) => {
    if (confirm('Are you sure you want to delete this CAT?')) {
      setCats(prev => prev.filter(cat => cat.id !== catId));
    }
  };

  const handleView = (cat: CAT) => {
    console.log('View CAT:', cat);
    // Implement view functionality
  };

  if (loading) {
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
          <Header title="CATs" showWeekSelector={false} />
          
          <main className="p-4 md:p-6">
            <div className="max-w-7xl mx-auto">
              {/* Skeleton Loading */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 animate-pulse">
                    <div className="flex items-center justify-between">
                      <div className="w-2/3">
                        <div className="h-4 bg-gray-200 rounded mb-2"></div>
                        <div className="h-6 bg-gray-300 rounded"></div>
                      </div>
                      <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 animate-pulse">
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-2/3">
                        <div className="h-5 bg-gray-300 rounded mb-2"></div>
                        <div className="h-4 bg-gray-200 rounded mb-3"></div>
                      </div>
                      <div className="w-16 h-6 bg-gray-200 rounded-full"></div>
                    </div>
                    <div className="space-y-2 mb-4">
                      <div className="h-3 bg-gray-200 rounded"></div>
                      <div className="h-3 bg-gray-200 rounded w-4/5"></div>
                    </div>
                    <div className="h-8 bg-gray-200 rounded"></div>
                  </div>
                ))}
              </div>
            </div>
          </main>
        </motion.div>
      </div>
    );
  }

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
        <Header title="CATs" showWeekSelector={hasContent} />
        
        <main className="p-4 md:p-6">
          {!hasContent ? (
            <div className="max-w-4xl mx-auto">
              <EmptyState
                title="No CATs Created"
                description="Create your first CAT to get started. You can schedule assessments, track progress, and manage submissions all in one place."
                icon={<BookMarked size={48} />}
                onAction={() => console.log("Create CAT")}
              />
            </div>
          ) : (
            <div className="max-w-7xl mx-auto">
              <div className="mb-6">
                <h1 className="text-2xl lg:text-3xl font-bold text-gray-800">CATs Dashboard</h1>
                <p className="text-gray-600 mt-2">Manage your Continuous Assessment Tests for Spring 2025 semester</p>
              </div>

              <WeekAndCourseSelector 
                selectedWeek={selectedWeek}
                selectedCourse={selectedCourse}
                onWeekChange={setSelectedWeek}
                onCourseChange={setSelectedCourse}
              />

              <CATStatsCards cats={filteredCATs} />

              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-800">
                      CATs - Week {selectedWeek}
                      {selectedCourse && ` (${getCourseByCode(selectedCourse).code})`}
                    </h2>
                    <p className="text-sm text-gray-600 mt-1">
                      {filteredCATs.length} CAT{filteredCATs.length !== 1 ? 's' : ''} found
                    </p>
                  </div>
                  <button 
                    className="bg-rose-500 text-white px-4 py-2 rounded-lg hover:bg-rose-600 transition-colors flex items-center"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    New CAT
                  </button>
                </div>

                {filteredCATs.length === 0 ? (
                  <div className="text-center py-12">
                    <BookMarked className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-600 mb-2">
                      No CATs found
                    </h3>
                    <p className="text-gray-500 mb-4">
                      {selectedCourse 
                        ? `No CATs for ${getCourseByCode(selectedCourse).name} in Week ${selectedWeek}` 
                        : `No CATs scheduled for Week ${selectedWeek}`
                      }
                    </p>
                    <button 
                      className="bg-rose-500 text-white px-6 py-3 rounded-lg hover:bg-rose-600 transition-colors inline-flex items-center"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Create CAT
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredCATs.map((cat, index) => (
                      <CATCard
                        key={cat.id}
                        cat={cat}
                        index={index}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        onView={handleView}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </main>
      </motion.div>
    </div>
  );
};

export default page;