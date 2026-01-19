/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';
import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { useLayout } from '@/components/LayoutController';
import Sidebar from '@/components/lecturerSidebar';
import { 
  Clock, Menu, Bell, User, X, CheckCircle, BarChart3, 
  TrendingUp, Edit, Eye
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

const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080/api/v1";

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
  const searchParams = useSearchParams();
  const initialCourseParam = searchParams.get('courseId');
  const initialUnitParam = searchParams.get('unitId');
  const initialAssessmentParam = searchParams.get('assessmentId');
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
  const [selectedCourseId, setSelectedCourseId] = useState(
    initialCourseParam ?? ''
  );
  const [selectedUnitId, setSelectedUnitId] = useState(
    initialUnitParam ?? ''
  );
  const [downloadLoading, setDownloadLoading] = useState(false);

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
              {/* Download buttons below filter selects */}
              <div className="flex flex-wrap gap-2 mt-4">
                {selectedUnitId && (
                  <button
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg disabled:opacity-60"
                    onClick={handleDownloadUnit}
                    disabled={downloadLoading}
                  >
                    {downloadLoading ? 'Downloading...' : 'Download Submissions (Unit)'}
                  </button>
                )}
                {selectedAssessmentId && (
                  <button
                    className="bg-emerald-500 text-white px-4 py-2 rounded-lg disabled:opacity-60"
                    onClick={handleDownloadAssessment}
                    disabled={downloadLoading}
                  >
                    {downloadLoading ? 'Downloading...' : 'Download Submissions (Assessment)'}
                  </button>
                )}
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

            {/* Stats component - shown only when there's data */}
            {mockGrades.length > 0 && <GradeStats grades={mockGrades} />}

            {/* Grades table - shown only when there's data */}
            {mockGrades.length > 0 && <GradesTable grades={mockGrades} onGradeEdit={handleGradeEdit} />}

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
              <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/20">
                <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full mx-4 max-h-[90vh] flex flex-col">
                  {/* Modal Header */}
                  <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">Submission Results</h3>
                      <p className="text-sm text-gray-500 mt-1">Review and grade student responses</p>
                    </div>
                    <button
                      className="text-gray-400 hover:text-gray-700 transition-colors p-2 rounded-lg hover:bg-gray-100"
                      onClick={closeModal}
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  
                  {/* Student Info Card */}
                  <div className="p-6 border-b border-gray-200">
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="font-semibold text-gray-700">Student:</span>
                          <div className="text-gray-900 mt-1">{selectedResult.student_name}</div>
                          <div className="text-xs text-gray-500">{selectedResult.reg_number}</div>
                        </div>
                        <div>
                          <span className="font-semibold text-gray-700">Course:</span>
                          <div className="text-gray-900 mt-1">{selectedResult.course_name}</div>
                          <div className="text-xs text-gray-500">{selectedResult.unit_name}</div>
                        </div>
                        <div>
                          <span className="font-semibold text-gray-700">Assessment:</span>
                          <div className="text-gray-900 mt-1">{selectedResult.assessment_topic}</div>
                          <div className="text-xs text-gray-500">Total: {selectedResult.total_marks} marks</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Results Content */}
                  <div className="flex-1 overflow-y-auto p-6">
                    {selectedResult.results && selectedResult.results.length > 0 ? (
                      <div className="space-y-6">
                        {selectedResult.results.map((result: SubmissionResult) => (
                          <div key={result.id} className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                            {/* Question Header */}
                            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <h4 className="font-semibold text-gray-900 text-sm leading-relaxed">
                                    {result.question_text}
                                  </h4>
                                </div>
                                <div className="ml-4 text-right">
                                  <div className="text-sm font-semibold text-gray-900">
                                    {editingResultId === result.id ? (
                                      <input
                                        type="number"
                                        min={0}
                                        max={result.marks}
                                        step="0.01"
                                        value={editScore ?? ''}
                                        onChange={e => setEditScore(Math.max(0, Math.min(Number(e.target.value), result.marks)))}
                                        className="border rounded-lg px-3 py-1 w-20 text-center font-mono text-sm"
                                        disabled={updateLoading}
                                      />
                                    ) : (
                                      <span className="text-lg">{result.score}</span>
                                    )}
                                    <span className="text-gray-500 text-sm"> / {result.marks}</span>
                                  </div>
                                  <div className="text-xs text-gray-500 mt-1">
                                    {formatDate(result.graded_at)}
                                  </div>
                                </div>
                              </div>
                            </div>
                            
                            {/* Student Answer Section */}
                            <div className="p-6 space-y-4">
                              {result.text_answer && (
                                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                                  <div className="flex items-center mb-3">
                                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                                    <h5 className="text-sm font-semibold text-blue-900 uppercase tracking-wide">Student Answer</h5>
                                  </div>
                                  <div className="text-sm text-gray-800 whitespace-pre-wrap leading-relaxed">
                                    {result.text_answer}
                                  </div>
                                </div>
                              )}
                              
                              {result.image_url && (
                                <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                                  <div className="flex items-center mb-3">
                                    <div className="w-2 h-2 bg-gray-500 rounded-full mr-2"></div>
                                    <h5 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">Submitted Image</h5>
                                  </div>
                                  <div className="rounded-lg border border-gray-300 overflow-hidden bg-white">
                                    <img 
                                      src={result.image_url} 
                                      alt="Submitted work" 
                                      className="w-full h-auto max-h-80 object-contain"
                                      onError={(e) => {
                                        e.currentTarget.style.display = 'none';
                                      }}
                                    />
                                  </div>
                                </div>
                              )}
                              
                              {/* Feedback Section */}
                              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
                                <div className="flex items-center mb-3">
                                  <div className="w-2 h-2 bg-emerald-500 rounded-full mr-2"></div>
                                  <h5 className="text-sm font-semibold text-emerald-900 uppercase tracking-wide">Feedback</h5>
                                </div>
                                {editingResultId === result.id ? (
                                  <textarea
                                    value={editFeedback}
                                    onChange={e => setEditFeedback(e.target.value)}
                                    className="w-full border border-emerald-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none"
                                    rows={3}
                                    placeholder="Provide feedback for this answer..."
                                    disabled={updateLoading}
                                  />
                                ) : (
                                  <div className="text-sm text-gray-800 whitespace-pre-wrap leading-relaxed">
                                    {result.feedback || <span className="text-gray-400 italic">No feedback provided yet</span>}
                                  </div>
                                )}
                              </div>
                              
                              {/* Action Buttons */}
                              <div className="flex items-center justify-between pt-2">
                                <div className="text-xs text-gray-500">
                                  Question ID: {result.question_id}
                                </div>
                                {editingResultId === result.id ? (
                                  <div className="flex items-center space-x-2">
                                    <button
                                      className="bg-emerald-500 text-white px-4 py-2 rounded-lg hover:bg-emerald-600 transition-colors text-sm font-medium"
                                      onClick={() => handleSaveResult(result)}
                                      disabled={updateLoading}
                                    >
                                      {updateLoading ? 'Saving...' : 'Save Changes'}
                                    </button>
                                    <button
                                      className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors text-sm font-medium"
                                      onClick={() => setEditingResultId(null)}
                                      disabled={updateLoading}
                                    >
                                      Cancel
                                    </button>
                                    {updateError && <span className="text-xs text-red-500 ml-2">{updateError}</span>}
                                  </div>
                                ) : (
                                  <button
                                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium flex items-center"
                                    onClick={() => handleEditResult(result)}
                                  >
                                    <Edit className="w-4 h-4 mr-1" />
                                    Edit Result
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <div className="text-gray-400 text-lg">No results available for this submission.</div>
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