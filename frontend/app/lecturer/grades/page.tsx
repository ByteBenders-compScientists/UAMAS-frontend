'use client';
import React, { useState } from 'react';
import {useLayout} from '@/components/LayoutController';
import Sidebar from '@/components/lecturerSidebar';
import { 
  BookMarked, BarChart3, Clock, Monitor, Plus, Star, User, 
  Users, Bell, Menu, X, LetterText, ChevronDown, ChevronUp, GraduationCap,
  FileText, MessageSquare, Library, Settings, Upload, Image, Calendar,
  File, CheckCircle, AlertCircle, BookOpen, ChevronRight, Download,
  MessageCircle, Book, Edit, Trash2, Search, Filter, Eye, TrendingUp
} from 'lucide-react';

// ===== TYPES =====
interface NavigationItem {
  icon: React.ElementType;
  label: string;
  active?: boolean;
  count?: number;
  hasDropdown?: boolean;
  dropdownItems?: DropdownItem[];
  path?: string;
}

interface DropdownItem {
  label: string;
  path: string;
  icon?: React.ElementType;
}

interface GradeEntry {
  id: string;
  studentId: string;
  studentName: string;
  course: string;
  courseCode: string;
  assignmentType: string;
  assignmentTitle: string;
  grade: string;
  score: number;
  maxScore: number;
  submissionDate: string;
  gradedDate: string;
  status: 'Graded' | 'Pending' | 'Late' | 'Resubmission';
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

const SAMPLE_GRADES: GradeEntry[] = [
  {
    id: '1',
    studentId: 'STU001',
    studentName: 'Alice Johnson',
    course: 'Computer Science 201',
    courseCode: 'CS201',
    assignmentType: 'Assignment',
    assignmentTitle: 'Data Structures Project',
    grade: 'A',
    score: 85,
    maxScore: 100,
    submissionDate: '2025-02-10',
    gradedDate: '2025-02-12',
    status: 'Graded'
  },
  {
    id: '2',
    studentId: 'STU002',
    studentName: 'Bob Smith',
    course: 'Database Management',
    courseCode: 'CS202',
    assignmentType: 'CAT',
    assignmentTitle: 'Midterm Assessment',
    grade: 'B+',
    score: 78,
    maxScore: 100,
    submissionDate: '2025-02-08',
    gradedDate: '2025-02-10',
    status: 'Graded'
  },
  {
    id: '3',
    studentId: 'STU003',
    studentName: 'Carol Davis',
    course: 'Operating Systems',
    courseCode: 'CS203',
    assignmentType: 'Task',
    assignmentTitle: 'Process Management',
    grade: 'A-',
    score: 82,
    maxScore: 100,
    submissionDate: '2025-02-11',
    gradedDate: '2025-02-13',
    status: 'Graded'
  },
  {
    id: '4',
    studentId: 'STU004',
    studentName: 'David Wilson',
    course: 'Software Engineering',
    courseCode: 'CS302',
    assignmentType: 'Assignment',
    assignmentTitle: 'SDLC Documentation',
    grade: 'Pending',
    score: 0,
    maxScore: 100,
    submissionDate: '2025-02-12',
    gradedDate: '',
    status: 'Pending'
  },
  {
    id: '5',
    studentId: 'STU005',
    studentName: 'Eva Brown',
    course: 'Computer Science 301',
    courseCode: 'CS301',
    assignmentType: 'CAT',
    assignmentTitle: 'Algorithm Analysis',
    grade: 'B',
    score: 72,
    maxScore: 100,
    submissionDate: '2025-02-09',
    gradedDate: '2025-02-11',
    status: 'Graded'
  },
  {
    id: '6',
    studentId: 'STU006',
    studentName: 'Frank Miller',
    course: 'Database Management',
    courseCode: 'CS202',
    assignmentType: 'Task',
    assignmentTitle: 'SQL Queries Lab',
    grade: 'A',
    score: 88,
    maxScore: 100,
    submissionDate: '2025-02-13',
    gradedDate: '2025-02-14',
    status: 'Graded'
  }
];

// ===== UTILITY FUNCTIONS =====
const formatDate = (dateString: string) => {
  if (!dateString) return 'N/A';
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

const getStatusBadgeClass = (status: string): string => {
  const statusClasses: Record<string, string> = {
    'Graded': 'bg-emerald-100 text-emerald-800 border border-emerald-200',
    'Pending': 'bg-amber-100 text-amber-800 border border-amber-200',
    'Late': 'bg-red-100 text-red-800 border border-red-200',
    'Resubmission': 'bg-blue-100 text-blue-800 border border-blue-200'
  };
  return statusClasses[status] || 'bg-gray-100 text-gray-700 border border-gray-200';
};

const getGradeBadgeClass = (grade: string): string => {
  if (grade === 'Pending') return 'bg-amber-100 text-amber-800 border border-amber-200';
  const gradeClasses: Record<string, string> = {
    'A': 'bg-emerald-100 text-emerald-800 border border-emerald-200',
    'A-': 'bg-emerald-100 text-emerald-800 border border-emerald-200',
    'B+': 'bg-blue-100 text-blue-800 border border-blue-200',
    'B': 'bg-blue-100 text-blue-800 border border-blue-200',
    'B-': 'bg-blue-100 text-blue-800 border border-blue-200',
    'C+': 'bg-orange-100 text-orange-800 border border-orange-200',
    'C': 'bg-orange-100 text-orange-800 border border-orange-200',
    'D': 'bg-red-100 text-red-800 border border-red-200',
    'F': 'bg-red-100 text-red-800 border border-red-200'
  };
  return gradeClasses[grade] || 'bg-gray-100 text-gray-700 border border-gray-200';
};

// ===== COMPONENTS =====
const SidebarHeader: React.FC<{ onClose: () => void }> = ({ onClose }) => (
  <div className="flex items-center justify-between p-6 border-b border-rose-200/50">
    <div className="flex items-center space-x-3">
      <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
        <LetterText className="w-5 h-5 text-rose-600" />
      </div>
      <span className="text-xl font-bold text-white">EduPortal</span>
    </div>
    <button 
      className="lg:hidden text-white hover:text-rose-100 transition-colors p-1"
      onClick={onClose}
      aria-label="Close sidebar"
    >
      <X className="w-5 h-5" />
    </button>
  </div>
);

const TopHeader: React.FC<{ onSidebarToggle: () => void }> = ({ onSidebarToggle }) => (
  <header className="h-16 flex items-center justify-between px-6 bg-white border-b border-gray-200 shadow-sm">
    <div className="flex items-center space-x-4">
      <button
        className="lg:hidden text-gray-600 hover:text-rose-600 transition-colors p-2"
        onClick={onSidebarToggle}
        aria-label="Open sidebar"
      >
        <Menu className="w-5 h-5" />
      </button>
      <div className="hidden lg:block">
        <h1 className="text-lg font-semibold text-gray-900">Grades Management</h1>
        <p className="text-sm text-gray-500">Track and manage student grades</p>
      </div>
    </div>
    
    <div className="flex items-center space-x-4">
      <button className="relative text-gray-500 hover:text-rose-600 transition-colors p-2">
        <Bell className="w-5 h-5" />
        <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">3</span>
      </button>
      <div className="flex items-center space-x-3">
        <div className="w-8 h-8 bg-gradient-to-r from-rose-500 to-pink-500 rounded-full flex items-center justify-center">
          <User className="w-4 h-4 text-white" />
        </div>
        <div className="hidden md:block">
          <div className="text-sm font-semibold text-gray-900">Dr. Alex Kimani</div>
          <div className="text-xs text-gray-500">Senior Lecturer</div>
        </div>
      </div>
    </div>
  </header>
);

const UserProfile: React.FC = () => (
  <div className="p-6 border-b border-rose-200/50">
    <div className="flex items-center space-x-3">
      <div className="w-12 h-12 bg-gradient-to-r from-white to-rose-50 rounded-xl flex items-center justify-center">
        <div className="w-8 h-8 bg-gradient-to-r from-rose-500 to-pink-500 rounded-lg flex items-center justify-center">
          <User className="w-4 h-4 text-white" />
        </div>
      </div>
      <div>
        <div className="font-semibold text-white">Dr. Alex Kimani</div>
        <div className="text-sm text-rose-100">Senior Lecturer</div>
      </div>
    </div>
  </div>
);

const NavigationDropdown: React.FC<{
  items: DropdownItem[];
  isOpen: boolean;
}> = ({ items, isOpen }) => {
  if (!isOpen) return null;

  return (
    <div className="ml-6 mt-2 space-y-1">
      {items.map((item, index) => (
        <button
          key={index}
          className="w-full text-left flex items-center space-x-3 p-2 text-sm rounded-lg hover:bg-rose-300/30 transition-all duration-200 text-rose-100"
        >
          {item.icon && <item.icon className="w-4 h-4" />}
          <span>{item.label}</span>
        </button>
      ))}
    </div>
  );
};

const NavigationItemComponent: React.FC<{
  item: NavigationItem;
  isDropdownOpen: boolean;
  onDropdownToggle: () => void;
}> = ({ item, isDropdownOpen, onDropdownToggle }) => {
  if (item.hasDropdown) {
    return (
      <div>
        <button
          onClick={onDropdownToggle}
          className={`w-full flex items-center justify-between space-x-3 p-3 rounded-xl transition-all duration-200 ${
            item.active 
              ? 'bg-white text-rose-600 shadow-lg' 
              : 'hover:bg-rose-300/20 text-white'
          }`}
          aria-expanded={isDropdownOpen}
        >
          <div className="flex items-center space-x-3">
            <item.icon className="w-5 h-5" />
            <span className="text-sm font-medium">{item.label}</span>
          </div>
          {isDropdownOpen ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </button>
        
        <NavigationDropdown 
          items={item.dropdownItems || []} 
          isOpen={isDropdownOpen}
        />
      </div>
    );
  }

  return (
    <button 
      className={`w-full flex items-center justify-between space-x-3 p-3 rounded-xl transition-all duration-200 ${
        item.active 
          ? 'bg-white text-rose-600 shadow-lg' 
          : 'hover:bg-rose-300/20 text-white'
      }`}
    >
      <div className="flex items-center space-x-3">
        <item.icon className="w-5 h-5" />
        <span className="text-sm font-medium">{item.label}</span>
      </div>
      {item.count && (
        <span className="bg-white text-rose-600 text-xs font-bold px-2 py-1 rounded-full min-w-[20px] text-center">
          {item.count}
        </span>
      )}
    </button>
  );
};

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  navigationItems: NavigationItem[];
  isCreateDropdownOpen: boolean;
  onCreateDropdownToggle: () => void;
}

const GradeStats: React.FC<{ grades: GradeEntry[] }> = ({ grades }) => {
  const totalGraded = grades.filter(g => g.status === 'Graded').length;
  const totalPending = grades.filter(g => g.status === 'Pending').length;
  const averageScore = grades.filter(g => g.status === 'Graded').reduce((acc, g) => acc + g.score, 0) / totalGraded || 0;
  const highestScore = Math.max(...grades.filter(g => g.status === 'Graded').map(g => g.score));

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Graded</p>
            <p className="text-3xl font-bold text-gray-900 mt-2">{totalGraded}</p>
          </div>
          <div className="p-3 rounded-xl bg-emerald-100">
            <CheckCircle className="w-6 h-6 text-emerald-600" />
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Pending</p>
            <p className="text-3xl font-bold text-gray-900 mt-2">{totalPending}</p>
          </div>
          <div className="p-3 rounded-xl bg-amber-100">
            <Clock className="w-6 h-6 text-amber-600" />
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Average Score</p>
            <p className="text-3xl font-bold text-gray-900 mt-2">{averageScore.toFixed(1)}%</p>
          </div>
          <div className="p-3 rounded-xl bg-blue-100">
            <BarChart3 className="w-6 h-6 text-blue-600" />
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Highest Score</p>
            <p className="text-3xl font-bold text-gray-900 mt-2">{highestScore}%</p>
          </div>
          <div className="p-3 rounded-xl bg-rose-100">
            <TrendingUp className="w-6 h-6 text-rose-600" />
          </div>
        </div>
      </div>
    </div>
  );
};

const GradesTable: React.FC<{ grades: GradeEntry[], onGradeEdit: (gradeId: string) => void }> = ({ grades, onGradeEdit }) => (
  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
    <div className="p-6 border-b border-gray-200">
      <h2 className="text-xl font-bold text-gray-900">Student Grades</h2>
      <p className="text-sm text-gray-500 mt-1">Manage and track all student grades</p>
    </div>
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Student</th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Course</th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Assignment</th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Score</th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Grade</th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Dates</th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {grades.map((grade) => (
            <tr key={grade.id} className="hover:bg-gray-50 transition-colors">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold text-sm">
                      {grade.studentName.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-gray-900">{grade.studentName}</div>
                    <div className="text-sm text-gray-500">{grade.studentId}</div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div>
                  <div className="text-sm font-semibold text-gray-900">{grade.courseCode}</div>
                  <div className="text-sm text-gray-500">{grade.course}</div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div>
                  <div className="text-sm font-semibold text-gray-900">{grade.assignmentTitle}</div>
                  <div className="text-sm text-gray-500">{grade.assignmentType}</div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-semibold text-gray-900">
                  {grade.status === 'Pending' ? 'N/A' : `${grade.score}/${grade.maxScore}`}
                </div>
                {grade.status !== 'Pending' && (
                  <div className="text-sm text-gray-500">{((grade.score / grade.maxScore) * 100).toFixed(1)}%</div>
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${getGradeBadgeClass(grade.grade)}`}>
                  {grade.grade}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${getStatusBadgeClass(grade.status)}`}>
                  {grade.status}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <div>Submitted: {formatDate(grade.submissionDate)}</div>
                {grade.gradedDate && <div>Graded: {formatDate(grade.gradedDate)}</div>}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div className="flex space-x-2">
                  <button 
                    onClick={() => onGradeEdit(grade.id)}
                    className="p-2 text-rose-600 hover:text-rose-900 hover:bg-rose-50 rounded-lg transition-all"
                    title="Edit Grade"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded-lg transition-all" title="View Details">
                    <Eye className="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

// ===== MAIN COMPONENT =====
const page: React.FC = () => {
  const { sidebarCollapsed, isMobileView, isTabletView } = useLayout();
  const [createDropdownOpen, setCreateDropdownOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [grades, setGrades] = useState<GradeEntry[]>(SAMPLE_GRADES);

  

  
  const toggleCreateDropdown = () => setCreateDropdownOpen(!createDropdownOpen);

  const handleGradeEdit = (gradeId: string) => {
    console.log('Editing grade:', gradeId);
    // Implement grade editing logic here
  };

  // Filter grades based on search and filters
  const filteredGrades = grades.filter(grade => {
    const matchesSearch = grade.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         grade.assignmentTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         grade.courseCode.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCourse = !selectedCourse || grade.courseCode === selectedCourse;
    const matchesStatus = !selectedStatus || grade.status === selectedStatus;
    
    return matchesSearch && matchesCourse && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar 
      />
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col lg:ml-64">
        
        
        <TopHeader onSidebarToggle={toggleCreateDropdown} />
        
        <main className="flex-1 p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {/* Page Header - Mobile Only */}
            <div className="mb-8 lg:hidden">
              <h1 className="text-2xl font-bold text-gray-900">Grades Management</h1>
              <p className="text-gray-600 mt-1">Track and manage student grades across all your courses.</p>
            </div>

            <GradeStats grades={grades} />

            {/* Filters and Search */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                <div className="flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0 flex-1">
                  <div className="relative flex-1 max-w-md">
                    
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Search students, assignments, or courses..."
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent w-full"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <select
                    className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                    value={selectedCourse}
                    onChange={(e) => setSelectedCourse(e.target.value)}
                  >
                    <option value="">All Courses</option>
                    {SAMPLE_COURSES.map(course => (
                      <option key={course.id} value={course.code}>{course.code}</option>
                    ))}
                  </select>
                  <select
                    className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                  >
                    <option value="">All Status</option>
                    <option value="Graded">Graded</option>
                    <option value="Pending">Pending</option>
                    <option value="Late">Late</option>
                    <option value="Resubmission">Resubmission</option>
                  </select>
                </div>
                <div className="flex space-x-2">
                  <button className="bg-rose-500 text-white px-4 py-2 rounded-lg hover:bg-rose-600 transition-colors flex items-center space-x-2">
                    <Download className="w-4 h-4" />
                    <span>Export</span>
                  </button>
                </div>
              </div>
            </div>
            
            <GradesTable grades={filteredGrades} onGradeEdit={handleGradeEdit} />
          </div>
        </main>
      </div>
    </div>
  );
};
export default page;
