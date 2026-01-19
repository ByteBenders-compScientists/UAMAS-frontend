"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  Clock,
  Download,
  Eye,
  FileText,
  X,
  CheckCircle2,
  Award,
  Edit,
  CheckCircle,
  BarChart3,
  Sparkles,
  ChevronRight,
  User,
} from "lucide-react";

const apiBaseUrl =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080/api/v1";

// Types adapted from original submissions page
interface Assessment {
  id: string;
  title: string;
  type: string;
  description: string;
  total_marks: number;
  deadline: string;
  status: string;
  verified: boolean;
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

interface SubmissionsWorkspaceProps {
  selectedCourseId: string;
  selectedUnitId: string;
}

const formatDate = (dateString: string): string => {
  if (!dateString) return "N/A";
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
  };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

const SubmissionsWorkspace: React.FC<SubmissionsWorkspaceProps> = ({
  selectedCourseId,
  selectedUnitId,
}) => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [selectedAssessmentId, setSelectedAssessmentId] = useState("");
  const [loadingMeta, setLoadingMeta] = useState(true);
  const [loadingSubmissions, setLoadingSubmissions] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [downloadLoading, setDownloadLoading] = useState(false);

  // Result modal + editing state
  const [selectedResult, setSelectedResult] = useState<Submission | null>(null);
  const [showResultModal, setShowResultModal] = useState(false);
  const [editingResultId, setEditingResultId] = useState<string | null>(null);
  const [editScore, setEditScore] = useState<number | null>(null);
  const [editFeedback, setEditFeedback] = useState<string>("");
  const [updateLoading, setUpdateLoading] = useState(false);
  const [updateError, setUpdateError] = useState<string | null>(null);

  const filteredUnits = useMemo(() => {
    if (!selectedCourseId) return [];
    const course = courses.find((c) => c.id === selectedCourseId);
    return course ? course.units : [];
  }, [selectedCourseId, courses]);

  const filteredAssessments = useMemo(() => {
    let filtered = assessments;
    if (selectedCourseId) {
      filtered = filtered.filter((a) => a.course_id === selectedCourseId);
    }
    if (selectedUnitId) {
      filtered = filtered.filter((a) => a.unit_id === selectedUnitId);
    }
    return filtered;
  }, [assessments, selectedCourseId, selectedUnitId]);

  // Load course + assessment metadata
  useEffect(() => {
    const loadMeta = async () => {
      try {
        setLoadingMeta(true);
        setError(null);

        const [coursesRes, assessmentsRes] = await Promise.all([
          fetch(`${apiBaseUrl}/auth/lecturer/courses`, {
            credentials: "include",
          }),
          fetch(`${apiBaseUrl}/bd/lecturer/assessments`, {
            credentials: "include",
          }),
        ]);

        if (!coursesRes.ok) throw new Error("Failed to fetch courses");
        if (!assessmentsRes.ok) throw new Error("Failed to fetch assessments");

        const coursesData: Course[] = await coursesRes.json();
        const assessmentsData: Assessment[] = await assessmentsRes.json();

        setCourses(coursesData);
        setAssessments(assessmentsData);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load submissions data"
        );
      } finally {
        setLoadingMeta(false);
      }
    };

    loadMeta();
  }, []);

  // Load submissions when assessment changes
  useEffect(() => {
    const loadSubs = async () => {
      if (!selectedAssessmentId) {
        setSubmissions([]);
        return;
      }
      try {
        setLoadingSubmissions(true);
        setError(null);

        const res = await fetch(
          `${apiBaseUrl}/bd/lecturer/submissions/assessments/${selectedAssessmentId}`,
          { credentials: "include" }
        );
        if (!res.ok) throw new Error("Failed to fetch submissions");
        const data: Submission[] = await res.json();
        setSubmissions(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load submissions"
        );
        setSubmissions([]);
      } finally {
        setLoadingSubmissions(false);
      }
    };

    loadSubs();
  }, [selectedAssessmentId]);

  const handleDownloadAssessment = async () => {
    if (!selectedAssessmentId) return;
    try {
      setDownloadLoading(true);
      const res = await fetch(
        `${apiBaseUrl}/bd/lecturer/submissions/assessments/${selectedAssessmentId}/download`,
        {
          method: "GET",
          credentials: "include",
        }
      );
      if (!res.ok) throw new Error("Failed to download file");
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `submissions_${selectedAssessmentId}.xlsx`;
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      alert(
        err instanceof Error ? err.message : "Failed to download submissions"
      );
    } finally {
      setDownloadLoading(false);
    }
  };

  const handleSeeResult = (submission: Submission) => {
    setSelectedResult(submission);
    setShowResultModal(true);
    setEditingResultId(null);
    setEditScore(null);
    setEditFeedback("");
    setUpdateError(null);
  };

  const closeModal = () => {
    setShowResultModal(false);
    setSelectedResult(null);
    setEditingResultId(null);
    setEditScore(null);
    setEditFeedback("");
    setUpdateError(null);
  };

  const handleEditResult = (result: SubmissionResult) => {
    setEditingResultId(result.id);
    setEditScore(result.score);
    setEditFeedback(result.feedback || "");
    setUpdateError(null);
  };

  const handleSaveResult = async (result: SubmissionResult) => {
    if (editScore === null || isNaN(editScore)) {
      setUpdateError("Score is required.");
      return;
    }
    if (editScore < 0 || editScore > result.marks) {
      setUpdateError(`Score must be between 0 and ${result.marks}`);
      return;
    }

    if (!selectedResult) return;

    setUpdateLoading(true);
    setUpdateError(null);

    try {
      const res = await fetch(
        `${apiBaseUrl}/bd/lecturer/submissions/${selectedResult.submission_id}`,
        {
          method: "PUT",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            score: editScore,
            question_id: result.question_id,
            feedback: editFeedback || result.feedback || "",
          }),
        }
      );
      if (!res.ok) throw new Error("Failed to update result");

      // Update modal state
      let newTotal = 0;
      setSelectedResult((prev) => {
        if (!prev || !prev.results) return prev;
        const updatedResults = prev.results.map((r) =>
          r.id === result.id
            ? { ...r, score: editScore, feedback: editFeedback || r.feedback }
            : r
        );
        newTotal = updatedResults.reduce((sum, r) => sum + (r.score || 0), 0);
        return {
          ...prev,
          results: updatedResults,
          total_marks: newTotal,
          graded: true,
        };
      });

      // Reflect new total in table row without reload
      if (newTotal) {
        setSubmissions((prev) =>
          prev.map((s) =>
            s.submission_id === selectedResult.submission_id
              ? { ...s, total_marks: newTotal, graded: true }
              : s
          )
        );
      }

      setEditingResultId(null);
      setEditScore(null);
      setEditFeedback("");
    } catch (err) {
      setUpdateError(
        err instanceof Error ? err.message : "Failed to update result"
      );
    } finally {
      setUpdateLoading(false);
    }
  };

  if (!selectedCourseId || !selectedUnitId) {
    return (
      <div className="py-12 text-center bg-white rounded-2xl border border-dashed border-emerald-200">
        <FileText className="w-10 h-10 mx-auto mb-3 text-emerald-500" />
        <p className="font-semibold text-gray-800 mb-1">
          Select a course and unit in the sidebar to view submissions.
        </p>
        <p className="text-sm text-gray-500">
          The shared Courses selection controls which submissions appear here.
        </p>
      </div>
    );
  }

  const courseName =
    courses.find((c) => c.id === selectedCourseId)?.name || "Selected course";
  const unitName =
    filteredUnits.find((u) => u.id === selectedUnitId)?.unit_name ||
    "Selected unit";

  return (
    <div className="space-y-6">
      {/* Context + select assessment */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase">
              Submissions context
            </p>
            <p className="text-sm text-gray-700">
              {courseName} · {unitName}
            </p>
          </div>
          <div className="flex items-center space-x-2 text-xs text-gray-500">
            <Clock className="w-4 h-4" />
            <span>
              {submissions.length} submission
              {submissions.length === 1 ? "" : "s"}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Assessment
            </label>
            <select
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              value={selectedAssessmentId}
              onChange={(e) => setSelectedAssessmentId(e.target.value)}
              disabled={loadingMeta || filteredAssessments.length === 0}
            >
              <option value="">Select assessment</option>
              {filteredAssessments.map((assess) => (
                <option key={assess.id} value={assess.id}>
                  {assess.title}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-end justify-end">
            <button
              onClick={handleDownloadAssessment}
              disabled={!selectedAssessmentId || downloadLoading}
              className="inline-flex items-center px-4 py-2 text-xs rounded-lg border border-gray-200 bg-gray-50 text-gray-700 hover:bg-gray-100 disabled:opacity-50"
            >
              <Download className="w-4 h-4 mr-1.5" />
              {downloadLoading ? "Downloading..." : "Download submissions (XLSX)"}
            </button>
          </div>
        </div>

        {error && (
          <div className="mt-2 flex items-start space-x-2 text-xs text-red-600">
            <AlertCircle className="w-4 h-4 mt-0.5" />
            <span>{error}</span>
          </div>
        )}
      </div>

      {/* Summary cards - Enhanced */}
      {selectedAssessmentId && submissions.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
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
            <div className="text-3xl font-bold text-blue-700">
              {submissions.filter((s) => s.graded).length}
            </div>
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
                const graded = submissions.filter((s) => s.graded);
                if (!graded.length) return "0.00";
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
        </div>
      )}

      {/* Submissions Display - Efficient Table Layout */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Student Submissions</h2>
            <p className="text-sm text-gray-500 mt-1">
              {loadingSubmissions ? 'Loading...' : `${submissions.length} ${submissions.length === 1 ? 'submission' : 'submissions'} found`}
            </p>
          </div>
          {loadingSubmissions && (
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-emerald-600"></div>
          )}
        </div>
        
        {submissions.length === 0 && !loadingSubmissions ? (
          <div className="p-12 text-center">
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
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Student
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Reg Number
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Course
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Unit
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Assessment
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Score
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {submissions.map((submission) => {
                  const initials = submission.student_name
                    .split(' ')
                    .map((n: string) => n[0])
                    .join('')
                    .toUpperCase()
                    .slice(0, 2);
                  
                  const totalPossible = submission.results?.reduce((acc: number, r: SubmissionResult) => acc + r.marks, 0) || 0;
                  const scorePercentage = submission.total_marks > 0 && totalPossible > 0
                    ? Math.round((submission.total_marks / totalPossible) * 100)
                    : 0;

                  return (
                    <tr 
                      key={submission.submission_id} 
                      className="hover:bg-gray-50 transition-colors"
                    >
                      {/* Student Info */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-3">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold ${
                            submission.graded 
                              ? 'bg-gradient-to-r from-emerald-500 to-teal-500' 
                              : 'bg-gradient-to-r from-amber-500 to-orange-500'
                          }`}>
                            {initials}
                          </div>
                          <div>
                            <div className="text-sm font-semibold text-gray-900">{submission.student_name}</div>
                          </div>
                        </div>
                      </td>
                      
                      {/* Reg Number */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 font-mono">{submission.reg_number}</div>
                      </td>
                      
                      {/* Course */}
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 max-w-xs truncate">{submission.course_name}</div>
                      </td>
                      
                      {/* Unit */}
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 max-w-xs truncate">{submission.unit_name}</div>
                      </td>
                      
                      {/* Assessment */}
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 max-w-md truncate" title={submission.assessment_topic}>
                          {submission.assessment_topic}
                        </div>
                      </td>
                      
                      {/* Status */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        {submission.graded ? (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
                            <CheckCircle2 className="w-3 h-3 mr-1" />
                            Graded
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-200">
                            <Clock className="w-3 h-3 mr-1" />
                            Pending
                          </span>
                        )}
                      </td>
                      
                      {/* Score */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        {submission.graded && submission.total_marks > 0 ? (
                          <div className="space-y-1">
                            <div className="text-sm font-semibold text-gray-900">
                              {submission.total_marks} / {totalPossible || 'N/A'}
                            </div>
                            <div className="flex items-center space-x-2">
                              <div className="w-20 bg-gray-200 rounded-full h-1.5 overflow-hidden">
                                <div
                                  className={`h-full rounded-full ${
                                    scorePercentage >= 80 ? 'bg-emerald-500' : 
                                    scorePercentage >= 60 ? 'bg-blue-500' : 
                                    scorePercentage >= 40 ? 'bg-amber-500' : 
                                    'bg-red-500'
                                  }`}
                                  style={{ width: `${Math.min(scorePercentage, 100)}%` }}
                                ></div>
                              </div>
                              <span className={`text-xs font-medium ${
                                scorePercentage >= 80 ? 'text-emerald-600' : 
                                scorePercentage >= 60 ? 'text-blue-600' : 
                                scorePercentage >= 40 ? 'text-amber-600' : 
                                'text-red-600'
                              }`}>
                                {scorePercentage}%
                              </span>
                            </div>
                          </div>
                        ) : (
                          <span className="text-sm text-gray-400">—</span>
                        )}
                      </td>
                      
                      {/* Actions */}
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <button
                          onClick={() => handleSeeResult(submission)}
                          className="inline-flex items-center px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-medium rounded-lg transition-colors space-x-2"
                        >
                          <Eye className="w-4 h-4" />
                          <span>View</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Result Modal - Enhanced */}
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
                          {/* Display image_url if available, otherwise text_answer */}
                          {result.image_url ? (
                            <div className="bg-gradient-to-br from-gray-50 to-slate-50 border-2 border-gray-200 rounded-xl p-5 shadow-sm">
                              <div className="flex items-center mb-4">
                                <div className="w-8 h-8 bg-gray-600 rounded-lg flex items-center justify-center mr-3">
                                  <Download className="w-4 h-4 text-white" />
                                </div>
                                <h5 className="text-sm font-bold text-gray-900 uppercase tracking-wide">Student Answer (Image)</h5>
                              </div>
                              <div className="rounded-lg border-2 border-gray-300 overflow-hidden bg-white shadow-inner">
                                <img 
                                  src={result.image_url} 
                                  alt="Student submitted work" 
                                  className="w-full h-auto max-h-96 object-contain"
                                  onError={(e) => {
                                    e.currentTarget.style.display = 'none';
                                    // Show fallback if image fails to load
                                    const container = e.currentTarget.parentElement;
                                    if (container) {
                                      container.innerHTML = '<div class="p-4 text-center text-gray-500 text-sm">Image failed to load</div>';
                                    }
                                  }}
                                />
                              </div>
                            </div>
                          ) : result.text_answer ? (
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
                          ) : (
                            <div className="bg-gray-50 border-2 border-gray-200 border-dashed rounded-xl p-5">
                              <div className="flex items-center justify-center text-gray-400">
                                <AlertCircle className="w-5 h-5 mr-2" />
                                <span className="text-sm">No answer submitted for this question</span>
                              </div>
                            </div>
                          )}
                          
                          {/* Feedback Section */}
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
  );
};

export default SubmissionsWorkspace;

