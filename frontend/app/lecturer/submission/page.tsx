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

interface Assessment {
  id: string;
  title: string;
  type: string;
  description: string;
  total_marks: number;
  deadline: string;
  status: string;
  verified: boolean;
  questions: any[];
  unit_id: string;
  course_id?: string;
  course_name?: string;
  unit_name?: string;
}

interface SubmissionEntry {
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

const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080/api/v1"

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

const GradeStats: React.FC<{ grades: SubmissionEntry[] }> = ({ grades }) => {
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

const GradesTable: React.FC<{ grades: SubmissionEntry[], onGradeEdit: (gradeId: string) => void }> = ({ grades, onGradeEdit }) => (
  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
    <div className="p-6 border-b border-gray-200">
      <h2 className="text-xl font-bold text-gray-900">Student Submissions</h2>
      <p className="text-sm text-gray-500 mt-1">Manage and track all student submissions</p>
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
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [selectedAssessmentId, setSelectedAssessmentId] = useState<string>('');
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [loadingAssessments, setLoadingAssessments] = useState(false);
  const [loadingSubmissions, setLoadingSubmissions] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedResult, setSelectedResult] = useState<any | null>(null);
  const [showResultModal, setShowResultModal] = useState(false);
  const [editingResultId, setEditingResultId] = useState<string | null>(null);
  const [editScore, setEditScore] = useState<number | null>(null);
  const [editFeedback, setEditFeedback] = useState<string>('');
  const [updateLoading, setUpdateLoading] = useState(false);
  const [updateError, setUpdateError] = useState<string | null>(null);
  const [courses, setCourses] = useState<any[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState('');
  const [selectedUnitId, setSelectedUnitId] = useState('');

  // Fetch courses/units on mount
  React.useEffect(() => {
    fetch(`${apiBaseUrl}/auth/lecturer/courses`, { credentials: 'include' })
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch courses');
        return res.json();
      })
      .then(data => setCourses(data))
      .catch(() => setCourses([]));
  }, []);

  // Filtered units for selected course
  const filteredUnits = React.useMemo(() => {
    if (!selectedCourseId) return [];
    const course = courses.find((c: any) => c.id === selectedCourseId);
    return course ? course.units : [];
  }, [selectedCourseId, courses]);

  // Filtered assessments for selected course/unit
  const filteredAssessments = React.useMemo(() => {
    let filtered = assessments;
    if (selectedCourseId) {
      filtered = filtered.filter(a => {
        // Try to match course by course_name or course_id
        const course = courses.find((c: any) => c.id === selectedCourseId);
        return course && (a.course_name === course.name || a.course_id === course.id);
      });
    }
    if (selectedUnitId) {
      filtered = filtered.filter(a => a.unit_id === selectedUnitId || a.unit_name === (filteredUnits.find((u: any) => u.id === selectedUnitId)?.unit_name));
    }
    return filtered;
  }, [assessments, selectedCourseId, selectedUnitId, courses, filteredUnits]);

  // Reset unit and assessment when course changes
  React.useEffect(() => {
    setSelectedUnitId('');
    setSelectedAssessmentId('');
  }, [selectedCourseId]);
  // Reset assessment when unit changes
  React.useEffect(() => {
    setSelectedAssessmentId('');
  }, [selectedUnitId]);

  // Fetch assessments on mount
  React.useEffect(() => {
    setLoadingAssessments(true);
    fetch(`${apiBaseUrl}/bd/lecturer/assessments`, {
      credentials: 'include',
    })
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch assessments');
        return res.json();
      })
      .then(data => {
        setAssessments(data);
        setLoadingAssessments(false);
      })
      .catch(err => {
        setError(err.message);
        setLoadingAssessments(false);
      });
  }, []);

  // Fetch submissions when assessment changes
  React.useEffect(() => {
    if (!selectedAssessmentId) {
      setSubmissions([]);
      return;
    }
    setLoadingSubmissions(true);
    fetch(`${apiBaseUrl}/bd/lecturer/submissions/assessments/${selectedAssessmentId}`, {
      credentials: 'include',
    })
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch submissions');
        return res.json();
      })
      .then(data => {
        setSubmissions(data);
        setLoadingSubmissions(false);
      })
      .catch(err => {
        setError(err.message);
        setLoadingSubmissions(false);
      });
  }, [selectedAssessmentId]);

  // Modal for result details
  const handleSeeResult = (submission: any) => {
    setSelectedResult(submission);
    setShowResultModal(true);
  };

  const closeModal = () => {
    setShowResultModal(false);
    setSelectedResult(null);
  };

  // Handle edit click
  const handleEditResult = (result: any) => {
    setEditingResultId(result.id);
    setEditScore(result.score);
    setEditFeedback(result.feedback || '');
    setUpdateError(null);
  };

  // Handle save
  const handleSaveResult = async (result: any) => {
    if (editScore === null || isNaN(editScore)) {
      setUpdateError('Score is required.');
      return;
    }
    if (editScore < 0 || editScore > result.marks) {
      setUpdateError(`Score must be between 0 and ${result.marks}`);
      return;
    }
    setUpdateLoading(true);
    setUpdateError(null);
    try {
      const res = await fetch(`${apiBaseUrl}/bd/lecturer/submissions/${selectedResult.submission_id}`, {
        method: 'PUT',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          score: editScore,
          question_id: result.question_id,
          feedback: editFeedback || result.feedback || '',
        }),
      });
      if (!res.ok) throw new Error('Failed to update result');
      // Update UI locally
      setSelectedResult((prev: any) => {
        if (!prev) return prev;
        return {
          ...prev,
          results: prev.results.map((r: any) =>
            r.id === result.id ? { ...r, score: editScore, feedback: editFeedback || r.feedback } : r
          ),
        };
      });
      setEditingResultId(null);
      setEditScore(null);
      setEditFeedback('');
    } catch (err: any) {
      setUpdateError(err.message || 'Failed to update result');
    } finally {
      setUpdateLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />
      <div className="flex-1 flex flex-col lg:ml-64">
        <TopHeader onSidebarToggle={() => {}} />
        <main className="flex-1 p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8 lg:hidden">
              <h1 className="text-2xl font-bold text-gray-900">Submission Management</h1>
              <p className="text-gray-600 mt-1">Track and manage student submissions across all your courses.</p>
            </div>

            {/* Filter Selects */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
              <div className="flex flex-col md:flex-row md:items-center md:space-x-4 space-y-4 md:space-y-0">
                <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Course Select */}
                  <div>
                    <label htmlFor="course-select" className="block text-sm font-medium text-gray-700 mb-1">Filter by Course</label>
                    <select
                      id="course-select"
                      className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-rose-500 focus:border-transparent w-full"
                      value={selectedCourseId}
                      onChange={e => setSelectedCourseId(e.target.value)}
                    >
                      <option value="">-- All Courses --</option>
                      {courses.map((course: any) => (
                        <option key={course.id} value={course.id}>{course.name}</option>
                      ))}
                    </select>
                  </div>
                  {/* Unit Select */}
                  <div>
                    <label htmlFor="unit-select" className="block text-sm font-medium text-gray-700 mb-1">Filter by Unit</label>
                    <select
                      id="unit-select"
                      className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-rose-500 focus:border-transparent w-full"
                      value={selectedUnitId}
                      onChange={e => setSelectedUnitId(e.target.value)}
                      disabled={!selectedCourseId}
                    >
                      <option value="">-- All Units --</option>
                      {filteredUnits.map((unit: any) => (
                        <option key={unit.id} value={unit.id}>{unit.unit_name}</option>
                      ))}
                    </select>
                  </div>
                  {/* Assessment Select */}
                  <div>
                    <label htmlFor="assessment-select" className="block text-sm font-medium text-gray-700 mb-1">Select Assessment</label>
                    <select
                      id="assessment-select"
                      className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-rose-500 focus:border-transparent w-full"
                      value={selectedAssessmentId}
                      onChange={e => setSelectedAssessmentId(e.target.value)}
                      disabled={loadingAssessments}
                    >
                      <option value="">-- Select an assessment --</option>
                      {filteredAssessments.map(assess => (
                        <option key={assess.id} value={assess.id}>{assess.title}</option>
                      ))}
                    </select>
                    {loadingAssessments && <div className="text-xs text-gray-500 mt-2">Loading assessments...</div>}
                    {error && <div className="text-xs text-red-500 mt-2">{error}</div>}
                  </div>
                </div>
              </div>
            </div>

            {/* Summary Cards */}
            {selectedAssessmentId && submissions.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex flex-col items-center">
                  <div className="text-xs text-gray-500 mb-1">Total Submissions</div>
                  <div className="text-2xl font-bold text-emerald-600">{submissions.length}</div>
                </div>
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex flex-col items-center">
                  <div className="text-xs text-gray-500 mb-1">Graded Submissions</div>
                  <div className="text-2xl font-bold text-blue-600">{submissions.filter(s => s.graded).length}</div>
                </div>
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex flex-col items-center">
                  <div className="text-xs text-gray-500 mb-1">Average Score</div>
                  <div className="text-2xl font-bold text-rose-600">
                    {(() => {
                      const graded = submissions.filter(s => s.graded);
                      if (graded.length === 0) return '0.00';
                      const avg = graded.reduce((acc, s) => acc + (s.total_marks || 0), 0) / graded.length;
                      return avg.toFixed(2);
                    })()}
                  </div>
                </div>
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex flex-col items-center">
                  <div className="text-xs text-gray-500 mb-1">Assessment</div>
                  <div className="text-sm font-semibold text-gray-800 text-center">
                    {submissions[0].assessment_topic}<br/>
                    <span className="text-xs text-gray-500">{submissions[0].unit_name} | {submissions[0].course_name}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Submissions Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Student Submissions</h2>
                {loadingSubmissions && <span className="text-xs text-gray-500 ml-4">Loading submissions...</span>}
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Student Name</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Reg Number</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Course</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Unit</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Assessment Topic</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Graded</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Total Marks</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {submissions.length === 0 && !loadingSubmissions && (
                      <tr>
                        <td colSpan={8} className="text-center py-8 text-gray-500">No submissions found.</td>
                      </tr>
                    )}
                    {submissions.map((submission) => (
                      <tr key={submission.submission_id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">{submission.student_name}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{submission.reg_number}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{submission.course_name}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{submission.unit_name}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{submission.assessment_topic}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{submission.graded ? 'Yes' : 'No'}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{submission.total_marks}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <button
                            className="bg-emerald-500 text-white px-3 py-1 rounded-lg hover:bg-emerald-600 transition-colors text-xs"
                            onClick={() => handleSeeResult(submission)}
                          >
                            See
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Result Modal */}
            {showResultModal && selectedResult && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
                <div className="bg-white rounded-xl shadow-lg max-w-2xl w-full p-6 relative max-h-[90vh] flex flex-col">
                  <button
                    className="absolute top-2 right-2 text-gray-400 hover:text-gray-700"
                    onClick={closeModal}
                  >
                    <X className="w-5 h-5" />
                  </button>
                  <h3 className="text-lg font-bold mb-4">Submission Results</h3>
                  {/* Submission details */}
                  <div className="mb-4 space-y-1 text-sm text-gray-700">
                    <div><span className="font-semibold">Student Name:</span> {selectedResult.student_name}</div>
                    <div><span className="font-semibold">Reg Number:</span> {selectedResult.reg_number}</div>
                    <div><span className="font-semibold">Course:</span> {selectedResult.course_name}</div>
                    <div><span className="font-semibold">Unit:</span> {selectedResult.unit_name}</div>
                    <div><span className="font-semibold">Assessment Topic:</span> {selectedResult.assessment_topic}</div>
                    <div><span className="font-semibold">Total Marks:</span> {selectedResult.total_marks}</div>
                  </div>
                  <div className="overflow-y-auto" style={{ maxHeight: '65vh' }}>
                    {selectedResult.results && selectedResult.results.length > 0 ? (
                      <div className="space-y-4">
                        {selectedResult.results.map((result: any) => (
                          <div key={result.id} className="border rounded-lg p-4">
                            <div className="font-semibold text-gray-800 mb-1">Question: {result.question_text}</div>
                            <div className="text-gray-700 mb-2">Score: {editingResultId === result.id ? (
                              <input
                                type="number"
                                min={0}
                                max={result.marks}
                                step="0.01"
                                value={editScore ?? ''}
                                onChange={e => setEditScore(Math.max(0, Math.min(Number(e.target.value), result.marks)))}
                                className="border rounded px-2 py-1 w-24 mr-2"
                                disabled={updateLoading}
                              />
                            ) : (
                              <>{result.score} / {result.marks}</>
                            )}
                            </div>
                            <div className="text-gray-600 mb-2">Feedback: {editingResultId === result.id ? (
                              <textarea
                                value={editFeedback}
                                onChange={e => setEditFeedback(e.target.value)}
                                className="border rounded px-2 py-1 w-full"
                                rows={2}
                                disabled={updateLoading}
                              />
                            ) : (
                              <>{result.feedback}</>
                            )}
                            </div>
                            <div className="text-xs text-gray-400 mb-2">Graded at: {formatDate(result.graded_at)}</div>
                            {editingResultId === result.id ? (
                              <div className="flex space-x-2 mt-2">
                                <button
                                  className="bg-emerald-500 text-white px-3 py-1 rounded hover:bg-emerald-600 text-xs"
                                  onClick={() => handleSaveResult(result)}
                                  disabled={updateLoading}
                                >
                                  {updateLoading ? 'Saving...' : 'Save'}
                                </button>
                                <button
                                  className="bg-gray-200 text-gray-700 px-3 py-1 rounded hover:bg-gray-300 text-xs"
                                  onClick={() => setEditingResultId(null)}
                                  disabled={updateLoading}
                                >
                                  Cancel
                                </button>
                                {updateError && <span className="text-xs text-red-500 ml-2">{updateError}</span>}
                              </div>
                            ) : (
                              <button
                                className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 text-xs"
                                onClick={() => handleEditResult(result)}
                              >
                                Edit
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-gray-500">No results available for this submission.</div>
                    )}
                  </div>
                </div>
              </div>
            )}

          </div>
        </main>
      </div>
    </div>
  );
};
export default page;
