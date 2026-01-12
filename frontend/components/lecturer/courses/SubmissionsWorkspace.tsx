"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  Clock,
  Download,
  Eye,
  FileText,
  Loader,
  TrendingUp,
  X,
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

      {/* Summary cards */}
      {selectedAssessmentId && submissions.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl border border-gray-100 p-4 flex flex-col items-center">
            <span className="text-xs text-gray-500 mb-1">
              Total Submissions
            </span>
            <span className="text-xl font-bold text-emerald-700">
              {submissions.length}
            </span>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 p-4 flex flex-col items-center">
            <span className="text-xs text-gray-500 mb-1">
              Graded Submissions
            </span>
            <span className="text-xl font-bold text-blue-700">
              {submissions.filter((s) => s.graded).length}
            </span>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 p-4 flex flex-col items-center">
            <span className="text-xs text-gray-500 mb-1">
              Average Score
            </span>
            <span className="text-xl font-bold text-rose-700 inline-flex items-center">
              <TrendingUp className="w-4 h-4 mr-1" />
              {(() => {
                const graded = submissions.filter((s) => s.graded);
                if (!graded.length) return "0.00";
                const avg =
                  graded.reduce((acc, s) => acc + (s.total_marks || 0), 0) /
                  graded.length;
                return avg.toFixed(2);
              })()}
            </span>
          </div>
        </div>
      )}

      {/* Submissions table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-gray-900">
            Student submissions
          </h2>
          {loadingSubmissions && (
            <Loader className="w-4 h-4 animate-spin text-emerald-600" />
          )}
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-100 text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-[11px] font-semibold text-gray-500 uppercase">
                  Student
                </th>
                <th className="px-4 py-2 text-left text-[11px] font-semibold text-gray-500 uppercase">
                  Reg No.
                </th>
                <th className="px-4 py-2 text-left text-[11px] font-semibold text-gray-500 uppercase">
                  Assessment
                </th>
                <th className="px-4 py-2 text-left text-[11px] font-semibold text-gray-500 uppercase">
                  Graded
                </th>
                <th className="px-4 py-2 text-left text-[11px] font-semibold text-gray-500 uppercase">
                  Total Marks
                </th>
                <th className="px-4 py-2 text-left text-[11px] font-semibold text-gray-500 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {submissions.length === 0 && !loadingSubmissions && (
                <tr>
                  <td
                    colSpan={6}
                    className="px-4 py-8 text-center text-xs text-gray-500"
                  >
                    No submissions found for this assessment.
                  </td>
                </tr>
              )}
              {submissions.map((s) => (
                <tr key={s.submission_id} className="hover:bg-gray-50">
                  <td className="px-4 py-2 whitespace-nowrap">
                    {s.student_name}
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap">
                    {s.reg_number}
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap">
                    {s.assessment_topic}
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap">
                    {s.graded ? "Yes" : "No"}
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap">
                    {s.total_marks}
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap">
                    <button
                      className="inline-flex items-center px-3 py-1 rounded-lg bg-emerald-600 text-white text-xs hover:bg-emerald-700"
                      onClick={() => handleSeeResult(s)}
                    >
                      <Eye className="w-3 h-3 mr-1" />
                      View / Grade
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
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/10">
          <div className="bg-white rounded-xl shadow-lg max-w-2xl w-full p-6 relative max-h-[90vh] flex flex-col">
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-700"
              onClick={closeModal}
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-lg font-bold mb-4">Submission results</h3>

            {/* Submission details */}
            <div className="mb-4 space-y-1 text-sm text-gray-700">
              <div>
                <span className="font-semibold">Student Name:</span>{" "}
                {selectedResult.student_name}
              </div>
              <div>
                <span className="font-semibold">Reg Number:</span>{" "}
                {selectedResult.reg_number}
              </div>
              <div>
                <span className="font-semibold">Course:</span>{" "}
                {selectedResult.course_name}
              </div>
              <div>
                <span className="font-semibold">Unit:</span>{" "}
                {selectedResult.unit_name}
              </div>
              <div>
                <span className="font-semibold">Assessment Topic:</span>{" "}
                {selectedResult.assessment_topic}
              </div>
              <div>
                <span className="font-semibold">Total Marks:</span>{" "}
                {selectedResult.total_marks}
              </div>
            </div>

            <div className="overflow-y-auto" style={{ maxHeight: "65vh" }}>
              {selectedResult.results && selectedResult.results.length > 0 ? (
                <div className="space-y-4">
                  {selectedResult.results.map((result) => (
                    <div key={result.id} className="border rounded-lg p-4">
                      <div className="font-semibold text-gray-800 mb-1">
                        Question: {result.question_text}
                      </div>
                      <div className="text-gray-700 mb-2">
                        Score:{" "}
                        {editingResultId === result.id ? (
                          <input
                            type="number"
                            min={0}
                            max={result.marks}
                            step="0.01"
                            value={editScore ?? ""}
                            onChange={(e) =>
                              setEditScore(
                                Math.max(
                                  0,
                                  Math.min(Number(e.target.value), result.marks)
                                )
                              )
                            }
                            className="border rounded px-2 py-1 w-24 mr-2 text-sm"
                            disabled={updateLoading}
                          />
                        ) : (
                          <>
                            {result.score} / {result.marks}
                          </>
                        )}
                      </div>
                      <div className="text-gray-600 mb-2 text-sm">
                        Feedback:{" "}
                        {editingResultId === result.id ? (
                          <textarea
                            value={editFeedback}
                            onChange={(e) => setEditFeedback(e.target.value)}
                            className="border rounded px-2 py-1 w-full text-sm"
                            rows={2}
                            disabled={updateLoading}
                          />
                        ) : (
                          <>{result.feedback}</>
                        )}
                      </div>
                      <div className="text-xs text-gray-400 mb-2">
                        Graded at: {formatDate(result.graded_at)}
                      </div>
                      {editingResultId === result.id ? (
                        <div className="flex flex-wrap items-center space-x-2 mt-2">
                          <button
                            className="bg-emerald-500 text-white px-3 py-1 rounded hover:bg-emerald-600 text-xs"
                            onClick={() => handleSaveResult(result)}
                            disabled={updateLoading}
                          >
                            {updateLoading ? "Saving..." : "Save"}
                          </button>
                          <button
                            className="bg-gray-200 text-gray-700 px-3 py-1 rounded hover:bg-gray-300 text-xs"
                            onClick={() => setEditingResultId(null)}
                            disabled={updateLoading}
                          >
                            Cancel
                          </button>
                          {updateError && (
                            <span className="text-xs text-red-500 ml-2">
                              {updateError}
                            </span>
                          )}
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
                <div className="text-gray-500 text-sm">
                  No question-level results available for this submission.
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

