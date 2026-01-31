/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
// lecturer/submission/page.tsx
'use client';
import React, { useState, useEffect, useMemo } from 'react';
// useSearchParams removed - using window.location.search instead
import { useLayout } from '@/components/LayoutController';
import Sidebar from '@/components/lecturerSidebar';
import { 
  Clock, Menu, Bell, User, X, CheckCircle, BarChart3, 
  TrendingUp, Edit, Eye, Download, FileText, Award, 
  CheckCircle2, AlertCircle, Sparkles, ChevronRight
} from 'lucide-react';

// ===== TYPES =====
interface Assessment {
  id: string;
  title: string;
  type: string;
  description: string;
  total_marks: number;
  deadline: string;
  status: string;
  verified: boolean;
  questions: unknown[];
  unit_id: string;
  course_id?: string;
  course_name?: string;
  unit_name?: string;
}

interface Course {
  id: string;
  name: string;
  units: Unit[];
}

interface Unit {
  id: string;
  unit_name: string;
}

interface Submission {
  submission_id: string;
  student_name: string;
  reg_number: string;
  course_name: string;
  unit_name: string;
  assessment_topic: string;
  graded: boolean;
  total_marks: number;
  results?: SubmissionResult[];
}

interface SubmissionResult {
  id: string;
  question_text: string;
  score: number;
  marks: number;
  feedback: string;
  graded_at: string;
  question_id: string;
  image_url?: string;
  text_answer?: string;
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

const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.taya-dev.tech/api/v1";

// ===== UTILITY FUNCTIONS =====
const formatDate = (dateString: string): string => {
  if (!dateString) return 'N/A';
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

// Download file utility
const downloadFile = async (url: string, filename: string) => {
  try {
    const res = await fetch(url, {
      method: 'GET',
      credentials: 'include',
    });
    if (!res.ok) throw new Error('Failed to download file');
    const blob = await res.blob();
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
  } catch (err) {
    alert('Download failed: ' + (err instanceof Error ? err.message : 'Unknown error'));
  }
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

const GradeStats: React.FC<{ grades: SubmissionEntry[] }> = ({ grades }) => {
  const totalGraded = grades.filter(g => g.status === 'Graded').length;
  const totalPending = grades.filter(g => g.status === 'Pending').length;
  const gradedGrades = grades.filter(g => g.status === 'Graded');
  const averageScore = gradedGrades.length > 0 ? gradedGrades.reduce((acc, g) => acc + g.score, 0) / gradedGrades.length : 0;
  const highestScore = gradedGrades.length > 0 ? Math.max(...gradedGrades.map(g => g.score)) : 0;

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
const Page: React.FC = () => {
  const [initialCourseParam, setInitialCourseParam] = useState<string | null>(null);
  const [initialUnitParam, setInitialUnitParam] = useState<string | null>(null);
  const [initialAssessmentParam, setInitialAssessmentParam] = useState<string | null>(null);

  useEffect(() => {
    // Get URL parameters on client side only
    const params = new URLSearchParams(window.location.search);
    setInitialCourseParam(params.get('courseId'));
    setInitialUnitParam(params.get('unitId'));
    setInitialAssessmentParam(params.get('assessmentId'));
  }, []);
  const { sidebarCollapsed, isMobileView, isTabletView } = useLayout();
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [selectedAssessmentId, setSelectedAssessmentId] = useState<string>('');
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loadingAssessments, setLoadingAssessments] = useState(false);
  const [loadingSubmissions, setLoadingSubmissions] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedResult, setSelectedResult] = useState<Submission | null>(null);
  const [showResultModal, setShowResultModal] = useState(false);
  const [editingResultId, setEditingResultId] = useState<string | null>(null);
  const [editScore, setEditScore] = useState<number | null>(null);
  const [editFeedback, setEditFeedback] = useState<string>('');
  const [updateLoading, setUpdateLoading] = useState(false);
  const [updateError, setUpdateError] = useState<string | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState('');
  const [selectedUnitId, setSelectedUnitId] = useState('');
  const [downloadLoading, setDownloadLoading] = useState(false);

  // Set initial values from URL params when they're loaded
  useEffect(() => {
    if (initialCourseParam) {
      setSelectedCourseId(initialCourseParam);
    }
  }, [initialCourseParam]);

  useEffect(() => {
    if (initialUnitParam) {
      setSelectedUnitId(initialUnitParam);
    }
  }, [initialUnitParam]);

  // Fetch courses/units on mount
  useEffect(() => {
    fetch(`${apiBaseUrl}/auth/lecturer/courses`, { credentials: 'include' })
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch courses');
        return res.json();
      })
      .then((data: Course[]) => setCourses(data))
      .catch(() => setCourses([]));
  }, []);

  // Filtered units for selected course
  const filteredUnits = useMemo(() => {
    if (!selectedCourseId) return [];
    const course = courses.find((c: Course) => c.id === selectedCourseId);
    return course ? course.units : [];
  }, [selectedCourseId, courses]);

  // Filtered assessments for selected course/unit
  const filteredAssessments = useMemo(() => {
    let filtered = assessments;
    if (selectedCourseId) {
      filtered = filtered.filter(a => {
        const course = courses.find((c: Course) => c.id === selectedCourseId);
        return course && (a.course_name === course.name || a.course_id === course.id);
      });
    }
    if (selectedUnitId) {
      filtered = filtered.filter(a => a.unit_id === selectedUnitId || a.unit_name === (filteredUnits.find((u: Unit) => u.id === selectedUnitId)?.unit_name));
    }
    return filtered;
  }, [assessments, selectedCourseId, selectedUnitId, courses, filteredUnits]);

  // When filters change via UI, clear dependent selections
  useEffect(() => {
    if (!initialCourseParam) {
      setSelectedUnitId('');
      setSelectedAssessmentId('');
    }
  }, [selectedCourseId, initialCourseParam]);

  useEffect(() => {
    if (!initialUnitParam) {
      setSelectedAssessmentId('');
    }
  }, [selectedUnitId, initialUnitParam]);

  // Fetch assessments on mount
  useEffect(() => {
    setLoadingAssessments(true);
    fetch(`${apiBaseUrl}/bd/lecturer/assessments`, {
      credentials: 'include',
    })
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch assessments');
        return res.json();
      })
      .then((data: Assessment[]) => {
        setAssessments(data);
        setLoadingAssessments(false);
        // If an assessmentId was passed in the URL, pre-select it
        if (initialAssessmentParam) {
          const exists = data.find(a => a.id === initialAssessmentParam);
          if (exists) {
            setSelectedAssessmentId(initialAssessmentParam);
          }
        }
      })
      .catch(err => {
        setError(err.message);
        setLoadingAssessments(false);
      });
  }, []);

  const fetchSubmissions = async () => {
    if (!selectedAssessmentId) return;
    setLoadingSubmissions(true);
    try {
      const response = await fetch(`${apiBaseUrl}/bd/lecturer/submissions/assessments/${selectedAssessmentId}`, {
        credentials: 'include',
      });
      if (!response.ok) throw new Error('Failed to fetch submissions');
      const data = await response.json();
      console.log('Lecturer submissions raw data:', data);
      console.log('Lecturer submissions type:', typeof data);
      console.log('Lecturer submissions is array:', Array.isArray(data));
      
      if (Array.isArray(data)) {
        data.forEach((submission: any, index: number) => {
          console.log(`Lecturer submission ${index}:`, submission);
          if (submission.results && Array.isArray(submission.results)) {
            submission.results.forEach((result: any, resultIndex: number) => {
              console.log(`Lecturer submission ${index} result ${resultIndex}:`, result);
              console.log(`Lecturer submission ${index} result ${resultIndex} image_url:`, result.image_url);
              console.log(`Lecturer submission ${index} result ${resultIndex} text_answer:`, result.text_answer);
              console.log(`Lecturer submission ${index} result ${resultIndex} has image_url:`, !!result.image_url);
              console.log(`Lecturer submission ${index} result ${resultIndex} has text_answer:`, !!result.text_answer);
            });
          }
        });
      }
      
      setSubmissions(data);
    } catch (err) {
      console.error('Error fetching submissions:', err);
      setSubmissions([]);
    } finally {
      setLoadingSubmissions(false);
    }
  };

  useEffect(() => {
    fetchSubmissions();
  }, [selectedAssessmentId]);

  // Modal for result details
  const handleSeeResult = (submission: Submission) => {
    setSelectedResult(submission);
    setShowResultModal(true);
  };

  const closeModal = () => {
    setShowResultModal(false);
    setSelectedResult(null);
  };

  // Handle edit click
  const handleEditResult = (result: SubmissionResult) => {
    setEditingResultId(result.id);
    setEditScore(result.score);
    setEditFeedback(result.feedback || '');
    setUpdateError(null);
  };

  // Handle save
  const handleSaveResult = async (result: SubmissionResult) => {
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
      const res = await fetch(`${apiBaseUrl}/bd/lecturer/submissions/${selectedResult?.submission_id}`, {
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
      setSelectedResult((prev: Submission | null) => {
        if (!prev) return prev;
        return {
          ...prev,
          results: prev.results?.map((r: SubmissionResult) =>
            r.id === result.id ? { ...r, score: editScore, feedback: editFeedback || r.feedback } : r
          ),
        };
      });
      setEditingResultId(null);
      setEditScore(null);
      setEditFeedback('');
    } catch (err: unknown) {
      if (err instanceof Error) {
        setUpdateError(err.message);
      } else {
        setUpdateError('Failed to update result');
      }
    } finally {
      setUpdateLoading(false);
    }
  };

  const handleGradeEdit = (gradeId: string) => {
    // Implementation for editing grades
    console.log('Edit grade:', gradeId);
  };

  // Mock data for stats - replace with actual data when available
  const mockGrades: SubmissionEntry[] = [];

  // Download handlers
  const handleDownloadUnit = async () => {
    if (!selectedUnitId) {
      alert('Please select a unit first.');
      return;
    }
    setDownloadLoading(true);
    const url = `${apiBaseUrl}/bd/lecturer/submissions/units/${selectedUnitId}/download`;
    await downloadFile(url, `submissions_unit_${selectedUnitId}.xlsx`);
    setDownloadLoading(false);
  };

  const handleDownloadAssessment = async () => {
    if (!selectedAssessmentId) {
      alert('Please select an assessment first.');
      return;
    }
    setDownloadLoading(true);
    const url = `${apiBaseUrl}/bd/lecturer/submissions/assessments/${selectedAssessmentId}/download`;
    await downloadFile(url, `submissions_assessment_${selectedAssessmentId}.xlsx`);
    setDownloadLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />
      <div className="flex-1 flex flex-col lg:ml-64">
        <TopHeader onSidebarToggle={() => {}} />
        <main className="flex-1 p-6 lg:p-8">
          <div className="max-w-8xl mx-auto">
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
                      {courses.map((course: Course) => (
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
                      {filteredUnits.map((unit: Unit) => (
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
              {/* Download buttons below filter selects - Enhanced */}
              <div className="flex flex-wrap gap-3 mt-6 pt-6 border-t border-gray-200">
                {selectedUnitId && (
                  <button
                    className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-5 py-2.5 rounded-lg hover:from-blue-600 hover:to-indigo-600 disabled:opacity-60 transition-all shadow-sm hover:shadow-md font-medium flex items-center space-x-2"
                    onClick={handleDownloadUnit}
                    disabled={downloadLoading}
                  >
                    {downloadLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        <span>Downloading...</span>
                      </>
                    ) : (
                      <>
                        <Download className="w-4 h-4" />
                        <span>Download Submissions (Unit)</span>
                      </>
                    )}
                  </button>
                )}
                {selectedAssessmentId && (
                  <button
                    className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-5 py-2.5 rounded-lg hover:from-emerald-600 hover:to-teal-600 disabled:opacity-60 transition-all shadow-sm hover:shadow-md font-medium flex items-center space-x-2"
                    onClick={handleDownloadAssessment}
                    disabled={downloadLoading}
                  >
                    {downloadLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        <span>Downloading...</span>
                      </>
                    ) : (
                      <>
                        <Download className="w-4 h-4" />
                        <span>Download Submissions (Assessment)</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>

            {/* Summary Cards - Enhanced */}
            {selectedAssessmentId && submissions.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl shadow-sm border-2 border-emerald-200 p-6 hover:shadow-lg transition-all">
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-12 h-12 bg-emerald-500 rounded-xl flex items-center justify-center">
                      <FileText className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <div className="text-sm font-medium text-gray-600 mb-1">Total Submissions</div>
                  <div className="text-3xl font-bold text-emerald-700">{submissions.length}</div>
                </div>
                
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl shadow-sm border-2 border-blue-200 p-6 hover:shadow-lg transition-all">
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
                      <CheckCircle2 className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <div className="text-sm font-medium text-gray-600 mb-1">Graded Submissions</div>
                  <div className="text-3xl font-bold text-blue-700">{submissions.filter(s => s.graded).length}</div>
                </div>
                
                <div className="bg-gradient-to-br from-rose-50 to-pink-50 rounded-xl shadow-sm border-2 border-rose-200 p-6 hover:shadow-lg transition-all">
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-12 h-12 bg-rose-500 rounded-xl flex items-center justify-center">
                      <BarChart3 className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <div className="text-sm font-medium text-gray-600 mb-1">Average Score</div>
                  <div className="text-3xl font-bold text-rose-700">
                    {(() => {
                      const graded = submissions.filter(s => s.graded);
                      if (graded.length === 0) return '0.00';
                      const totalPossible = graded.reduce((acc, s) => {
                        const possible = s.results?.reduce((sum: number, r: SubmissionResult) => sum + r.marks, 0) || 100;
                        return acc + possible;
                      }, 0);
                      const totalScored = graded.reduce((acc, s) => acc + (s.total_marks || 0), 0);
                      const avg = totalPossible > 0 ? (totalScored / totalPossible) * 100 : 0;
                      return avg.toFixed(1);
                    })()}%
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-xl shadow-sm border-2 border-purple-200 p-6 hover:shadow-lg transition-all">
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center">
                      <Sparkles className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <div className="text-sm font-medium text-gray-600 mb-1">Assessment</div>
                  <div className="text-sm font-bold text-gray-900 line-clamp-2 mb-1">
                    {submissions[0].assessment_topic}
                  </div>
                  <div className="text-xs text-gray-600">
                    {submissions[0].unit_name} | {submissions[0].course_name}
                  </div>
                </div>
              </div>
            )}

            {/* Stats component - shown only when there's data */}
            {mockGrades.length > 0 && <GradeStats grades={mockGrades} />}

            {/* Grades table - shown only when there's data */}
            {mockGrades.length > 0 && <GradesTable grades={mockGrades} onGradeEdit={handleGradeEdit} />}

            {/* Submissions Display - Modern Card Layout */}
            {submissions.length === 0 && !loadingSubmissions && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
                <div className="flex flex-col items-center justify-center space-y-4">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                    <FileText className="w-8 h-8 text-gray-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">No submissions found</h3>
                    <p className="text-sm text-gray-500 mt-1">Select an assessment to view student submissions</p>
                  </div>
                </div>
              </div>
            )}

            {loadingSubmissions && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
                <div className="flex flex-col items-center justify-center space-y-4">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
                  <p className="text-sm text-gray-500">Loading submissions...</p>
                </div>
              </div>
            )}

            {submissions.length > 0 && !loadingSubmissions && (
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Student Submissions</h2>
                    <p className="text-sm text-gray-500 mt-1">{submissions.length} {submissions.length === 1 ? 'submission' : 'submissions'} found</p>
                  </div>
                </div>

                {/* Modern Card Grid Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {submissions.map((submission) => {
                    const initials = submission.student_name
                      .split(' ')
                      .map((n: string) => n[0])
                      .join('')
                      .toUpperCase()
                      .slice(0, 2);
                    
                    const scorePercentage = submission.total_marks > 0 
                      ? Math.round((submission.total_marks / (submission.results?.reduce((acc: number, r: SubmissionResult) => acc + r.marks, 0) || 100)) * 100)
                      : 0;

                    return (
                      <div
                        key={submission.submission_id}
                        className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-lg hover:border-emerald-300 transition-all duration-300 overflow-hidden group"
                      >
                        {/* Card Header with Gradient */}
                        <div className={`${submission.graded ? 'bg-gradient-to-r from-emerald-500 to-teal-500' : 'bg-gradient-to-r from-amber-500 to-orange-500'} p-5`}>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border-2 border-white/30">
                                <span className="text-white font-bold text-sm">{initials}</span>
                              </div>
                              <div>
                                <h3 className="text-white font-semibold text-lg">{submission.student_name}</h3>
                                <p className="text-white/80 text-sm">{submission.reg_number}</p>
                              </div>
                            </div>
                            {submission.graded ? (
                              <div className="bg-white/20 backdrop-blur-sm rounded-full p-2 border border-white/30">
                                <CheckCircle2 className="w-5 h-5 text-white" />
                              </div>
                            ) : (
                              <div className="bg-white/20 backdrop-blur-sm rounded-full p-2 border border-white/30">
                                <Clock className="w-5 h-5 text-white" />
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Card Body */}
                        <div className="p-6 space-y-4">
                          {/* Course & Unit Info */}
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Course</p>
                              <p className="text-sm font-medium text-gray-900">{submission.course_name}</p>
                            </div>
                            <div className="space-y-1">
                              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Unit</p>
                              <p className="text-sm font-medium text-gray-900">{submission.unit_name}</p>
                            </div>
                          </div>

                          {/* Assessment Topic */}
                          <div className="space-y-1">
                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Assessment</p>
                            <p className="text-sm font-medium text-gray-900 line-clamp-2">{submission.assessment_topic}</p>
                          </div>

                          {/* Score Display */}
                          {submission.graded && submission.total_marks > 0 && (
                            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                              <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-gray-700">Total Score</span>
                                <span className="text-lg font-bold text-emerald-600">
                                  {submission.total_marks} / {submission.results?.reduce((acc: number, r: SubmissionResult) => acc + r.marks, 0) || 'N/A'}
                                </span>
                              </div>
                              {/* Progress Bar */}
                              <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                                <div
                                  className={`h-full rounded-full transition-all duration-500 ${scorePercentage >= 80 ? 'bg-emerald-500' : scorePercentage >= 60 ? 'bg-blue-500' : scorePercentage >= 40 ? 'bg-amber-500' : 'bg-red-500'}`}
                                  style={{ width: `${Math.min(scorePercentage, 100)}%` }}
                                ></div>
                              </div>
                              <p className="text-xs text-gray-500 text-right">{scorePercentage}%</p>
                            </div>
                          )}

                          {/* Status Badge */}
                          <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                            <div className="flex items-center space-x-2">
                              {submission.graded ? (
                                <>
                                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
                                    <CheckCircle2 className="w-3 h-3 mr-1" />
                                    Graded
                                  </span>
                                  {submission.results && submission.results.length > 0 && (
                                    <span className="text-xs text-gray-500">
                                      {submission.results.length} {submission.results.length === 1 ? 'question' : 'questions'}
                                    </span>
                                  )}
                                </>
                              ) : (
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-200">
                                  <AlertCircle className="w-3 h-3 mr-1" />
                                  Pending Review
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Card Footer with Action */}
                        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
                          <button
                            onClick={() => handleSeeResult(submission)}
                            className="w-full flex items-center justify-center space-x-2 bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-3 rounded-lg font-medium transition-all duration-200 group-hover:shadow-lg"
                          >
                            <Eye className="w-4 h-4" />
                            <span>View Submission</span>
                            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Result Modal */}
            {showResultModal && selectedResult && (
              <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/50 animate-in fade-in duration-200">
                <div className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full mx-4 max-h-[90vh] flex flex-col animate-in slide-in-from-bottom-4 duration-300">
                  {/* Modal Header with Gradient */}
                  <div className="bg-gradient-to-r from-emerald-500 to-teal-500 p-6 rounded-t-2xl">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border-2 border-white/30">
                          <Award className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="text-2xl font-bold text-white">Submission Results</h3>
                          <p className="text-sm text-white/90 mt-0.5">Review and grade student responses</p>
                        </div>
                      </div>
                      <button
                        className="text-white/80 hover:text-white hover:bg-white/20 transition-all p-2 rounded-lg"
                        onClick={closeModal}
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                  
                  {/* Student Info Card - Enhanced */}
                  <div className="p-6 border-b border-gray-200 bg-gray-50">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="flex items-start space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center flex-shrink-0">
                            <User className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Student</p>
                            <p className="text-sm font-semibold text-gray-900">{selectedResult.student_name}</p>
                            <p className="text-xs text-gray-500 mt-0.5">{selectedResult.reg_number}</p>
                          </div>
                        </div>
                        <div className="flex items-start space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center flex-shrink-0">
                            <FileText className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Course</p>
                            <p className="text-sm font-semibold text-gray-900">{selectedResult.course_name}</p>
                            <p className="text-xs text-gray-500 mt-0.5">{selectedResult.unit_name}</p>
                          </div>
                        </div>
                        <div className="flex items-start space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-rose-500 to-pink-500 rounded-lg flex items-center justify-center flex-shrink-0">
                            <Sparkles className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Assessment</p>
                            <p className="text-sm font-semibold text-gray-900 line-clamp-1">{selectedResult.assessment_topic}</p>
                            <p className="text-xs text-gray-500 mt-0.5">Total: {selectedResult.total_marks} marks</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Results Content */}
                  <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
                    {selectedResult.results && selectedResult.results.length > 0 ? (
                      <div className="space-y-6">
                        {selectedResult.results.map((result: SubmissionResult, index: number) => {
                          const scorePercentage = result.marks > 0 ? Math.round((result.score / result.marks) * 100) : 0;
                          return (
                            <div key={result.id} className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                              {/* Question Header - Enhanced */}
                              <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-5 border-b border-gray-200">
                                <div className="flex items-start justify-between">
                                  <div className="flex items-start space-x-3 flex-1">
                                    <div className="flex-shrink-0 w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center text-white font-bold text-sm mt-0.5">
                                      {index + 1}
                                    </div>
                                    <div className="flex-1">
                                      <h4 className="font-semibold text-gray-900 text-base leading-relaxed">
                                        {result.question_text}
                                      </h4>
                                    </div>
                                  </div>
                                  <div className="ml-4 flex-shrink-0">
                                    {/* Score Display - Enhanced */}
                                    <div className="bg-white rounded-lg p-3 border-2 border-gray-200 shadow-sm">
                                      <div className="text-center">
                                        {editingResultId === result.id ? (
                                          <input
                                            type="number"
                                            min={0}
                                            max={result.marks}
                                            step="0.01"
                                            value={editScore ?? ''}
                                            onChange={e => setEditScore(Math.max(0, Math.min(Number(e.target.value), result.marks)))}
                                            className="border-2 border-emerald-500 rounded-lg px-3 py-2 w-24 text-center font-mono text-lg font-bold focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                                            disabled={updateLoading}
                                            autoFocus
                                          />
                                        ) : (
                                          <div className="space-y-1">
                                            <div className="text-2xl font-bold text-gray-900">
                                              {result.score}
                                              <span className="text-sm text-gray-500 font-normal"> / {result.marks}</span>
                                            </div>
                                            <div className={`text-xs font-semibold px-2 py-0.5 rounded-full inline-block ${
                                              scorePercentage >= 80 ? 'bg-emerald-100 text-emerald-700' :
                                              scorePercentage >= 60 ? 'bg-blue-100 text-blue-700' :
                                              scorePercentage >= 40 ? 'bg-amber-100 text-amber-700' :
                                              'bg-red-100 text-red-700'
                                            }`}>
                                              {scorePercentage}%
                                            </div>
                                          </div>
                                        )}
                                      </div>
                                      {result.graded_at && (
                                        <div className="text-xs text-gray-500 mt-2 text-center">
                                          {formatDate(result.graded_at)}
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            
                            {/* Student Answer Section - Enhanced */}
                            <div className="p-6 space-y-5">
                              {result.text_answer && (
                                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl p-5 shadow-sm">
                                  <div className="flex items-center mb-4">
                                    <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center mr-3">
                                      <FileText className="w-4 h-4 text-white" />
                                    </div>
                                    <h5 className="text-sm font-bold text-blue-900 uppercase tracking-wide">Student Answer</h5>
                                  </div>
                                  <div className="bg-white rounded-lg p-4 border border-blue-100">
                                    <div className="text-sm text-gray-800 whitespace-pre-wrap leading-relaxed">
                                      {result.text_answer}
                                    </div>
                                  </div>
                                </div>
                              )}
                              
                              {result.image_url && (
                                <div className="bg-gradient-to-br from-gray-50 to-slate-50 border-2 border-gray-200 rounded-xl p-5 shadow-sm">
                                  <div className="flex items-center mb-4">
                                    <div className="w-8 h-8 bg-gray-600 rounded-lg flex items-center justify-center mr-3">
                                      <Download className="w-4 h-4 text-white" />
                                    </div>
                                    <h5 className="text-sm font-bold text-gray-900 uppercase tracking-wide">Submitted Image</h5>
                                  </div>
                                  <div className="rounded-lg border-2 border-gray-300 overflow-hidden bg-white shadow-inner">
                                    <img 
                                      src={result.image_url} 
                                      alt="Submitted work" 
                                      className="w-full h-auto max-h-96 object-contain"
                                      onError={(e) => {
                                        e.currentTarget.style.display = 'none';
                                      }}
                                    />
                                  </div>
                                </div>
                              )}
                              
                              {/* Feedback Section - Enhanced */}
                              <div className="bg-gradient-to-br from-emerald-50 to-teal-50 border-2 border-emerald-200 rounded-xl p-5 shadow-sm">
                                <div className="flex items-center mb-4">
                                  <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center mr-3">
                                    <Edit className="w-4 h-4 text-white" />
                                  </div>
                                  <h5 className="text-sm font-bold text-emerald-900 uppercase tracking-wide">Feedback</h5>
                                </div>
                                {editingResultId === result.id ? (
                                  <div className="bg-white rounded-lg border-2 border-emerald-300 p-3">
                                    <textarea
                                      value={editFeedback}
                                      onChange={e => setEditFeedback(e.target.value)}
                                      className="w-full border-0 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none resize-none"
                                      rows={4}
                                      placeholder="Provide detailed feedback for this answer..."
                                      disabled={updateLoading}
                                    />
                                  </div>
                                ) : (
                                  <div className="bg-white rounded-lg border border-emerald-100 p-4">
                                    <div className="text-sm text-gray-800 whitespace-pre-wrap leading-relaxed">
                                      {result.feedback || (
                                        <span className="text-gray-400 italic flex items-center">
                                          <AlertCircle className="w-4 h-4 mr-2" />
                                          No feedback provided yet
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                )}
                              </div>
                              
                              {/* Action Buttons - Enhanced */}
                              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                                <div className="text-xs text-gray-500 font-mono">
                                  ID: {result.question_id}
                                </div>
                                {editingResultId === result.id ? (
                                  <div className="flex items-center space-x-3">
                                    {updateError && (
                                      <div className="flex items-center space-x-1 text-xs text-red-600 bg-red-50 px-3 py-1.5 rounded-lg">
                                        <AlertCircle className="w-3 h-3" />
                                        <span>{updateError}</span>
                                      </div>
                                    )}
                                    <button
                                      className="bg-emerald-500 text-white px-5 py-2.5 rounded-lg hover:bg-emerald-600 transition-all text-sm font-semibold shadow-sm hover:shadow-md flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                      onClick={() => handleSaveResult(result)}
                                      disabled={updateLoading}
                                    >
                                      {updateLoading ? (
                                        <>
                                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                          <span>Saving...</span>
                                        </>
                                      ) : (
                                        <>
                                          <CheckCircle className="w-4 h-4" />
                                          <span>Save Changes</span>
                                        </>
                                      )}
                                    </button>
                                    <button
                                      className="bg-gray-200 text-gray-700 px-5 py-2.5 rounded-lg hover:bg-gray-300 transition-all text-sm font-semibold"
                                      onClick={() => setEditingResultId(null)}
                                      disabled={updateLoading}
                                    >
                                      Cancel
                                    </button>
                                  </div>
                                ) : (
                                  <button
                                    className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-5 py-2.5 rounded-lg hover:from-blue-600 hover:to-indigo-600 transition-all text-sm font-semibold shadow-sm hover:shadow-md flex items-center space-x-2"
                                    onClick={() => handleEditResult(result)}
                                  >
                                    <Edit className="w-4 h-4" />
                                    <span>Edit Result</span>
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="text-center py-16">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                          <FileText className="w-8 h-8 text-gray-400" />
                        </div>
                        <h4 className="text-lg font-semibold text-gray-900 mb-2">No results available</h4>
                        <p className="text-sm text-gray-500">This submission doesn&apos;t have any graded results yet.</p>
                      </div>
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

export default Page;