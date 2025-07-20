/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLayout } from '@/components/LayoutController';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import EmptyState from '@/components/EmptyState';
import { FileText, ChevronDown, ChevronUp, CheckCircle, Star, Info, BarChart3, Clock, TrendingUp, ListChecks } from 'lucide-react';

const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080/api/v1"

export default function SubmissionPage() {
  const { sidebarCollapsed, isMobileView, isTabletView } = useLayout();
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    fetch(`${apiBaseUrl}/bd/student/submissions`, {
      credentials: 'include',
    })
      .then(res => res.ok ? res.json() : [])
      .then(data => {
        setSubmissions(Array.isArray(data) ? data : []);
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  }, []);

  // Stats derived from submissions data
  const totalSubmissions = submissions.length;
  const gradedSubmissions = submissions.filter(s => s.graded).length;
  const pendingSubmissions = submissions.filter(s => !s.graded).length;
  const totalQuestions = submissions.reduce((acc, s) => acc + (Array.isArray(s.results) ? s.results.length : 0), 0);
  const allScores = submissions.flatMap(s => (Array.isArray(s.results) ? s.results.map((r: any) => r.score ?? 0) : []));
  const averageScore = allScores.length > 0 ? (allScores.reduce((a, b) => a + b, 0) / allScores.length) : 0;
  const highestScore = allScores.length > 0 ? Math.max(...allScores) : 0;

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <motion.div
        initial={{ marginLeft: (!isMobileView && !isTabletView) ? (sidebarCollapsed ? 80 : 240) : 0 }}
        animate={{ marginLeft: (!isMobileView && !isTabletView) ? (sidebarCollapsed ? 80 : 240) : 0 }}
        transition={{ duration: 0.3 }}
        className="flex-1 overflow-auto"
      >
        <Header title="Submission" showWeekSelector={false} />
        <main className="p-4 md:p-6">
          {/* Stats Cards */}
          {!isLoading && submissions.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex items-center space-x-4">
                <div className="p-2 rounded-full bg-blue-100 text-blue-600"><FileText className="w-6 h-6" /></div>
                <div>
                  <div className="text-lg font-bold">{totalSubmissions}</div>
                  <div className="text-sm text-gray-500">Total Submissions</div>
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex items-center space-x-4">
                <div className="p-2 rounded-full bg-green-100 text-green-600"><CheckCircle className="w-6 h-6" /></div>
                <div>
                  <div className="text-lg font-bold">{gradedSubmissions}</div>
                  <div className="text-sm text-gray-500">Graded</div>
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex items-center space-x-4">
                <div className="p-2 rounded-full bg-amber-100 text-amber-600"><Clock className="w-6 h-6" /></div>
                <div>
                  <div className="text-lg font-bold">{pendingSubmissions}</div>
                  <div className="text-sm text-gray-500">Pending</div>
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex items-center space-x-4">
                <div className="p-2 rounded-full bg-purple-100 text-purple-600"><ListChecks className="w-6 h-6" /></div>
                <div>
                  <div className="text-lg font-bold">{totalQuestions}</div>
                  <div className="text-sm text-gray-500">Total Questions</div>
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex items-center space-x-4">
                <div className="p-2 rounded-full bg-blue-100 text-blue-600"><BarChart3 className="w-6 h-6" /></div>
                <div>
                  <div className="text-lg font-bold">{averageScore.toFixed(2)}</div>
                  <div className="text-sm text-gray-500">Average Score</div>
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex items-center space-x-4">
                <div className="p-2 rounded-full bg-emerald-100 text-emerald-600"><TrendingUp className="w-6 h-6" /></div>
                <div>
                  <div className="text-lg font-bold">{highestScore}</div>
                  <div className="text-sm text-gray-500">Highest Score</div>
                </div>
              </div>
            </div>
          )}
          {isLoading ? (
            <div className="max-w-4xl mx-auto text-center py-24">
              <div className="w-16 h-16 mx-auto mb-4 animate-spin text-emerald-500">
                <FileText size={64} />
              </div>
              <p className="text-emerald-600 font-medium">Loading submissions...</p>
            </div>
          ) : submissions.length === 0 ? (
            <div className="max-w-4xl mx-auto">
              <EmptyState
                title="No Submissions Found"
                description="You have not made any submissions yet. Your submitted assessments will appear here."
                icon={<FileText size={48} />}
              />
            </div>
          ) : (
            <div className="max-w-4xl mx-auto space-y-6">
              {submissions.map((submission, idx) => (
                <motion.div
                  key={submission.submission_id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
                >
                  <div
                    className="p-6 cursor-pointer flex items-center justify-between hover:bg-gray-50 transition-colors"
                    onClick={() => setExpanded(expanded === submission.submission_id ? null : submission.submission_id)}
                  >
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-1 flex items-center gap-2">
                        <FileText className="w-5 h-5 text-emerald-500" />
                        {submission.topic || 'Assessment'}
                      </h3>
                      <div className="flex flex-wrap gap-2 text-xs text-gray-500 mb-1">
                        <span>Assessment ID: {submission.assessment_id}</span>
                        <span>Submission ID: {submission.submission_id}</span>
                        <span>Blooms Level: {submission.blooms_level}</span>
                        <span>Difficulty: {submission.difficulty}</span>
                        <span>Questions: {submission.number_of_questions}</span>
                        <span>Total Marks: {submission.total_marks}</span>
                        <span>Created: {new Date(submission.created_at).toLocaleString()}</span>
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        {submission.graded && <CheckCircle className="w-4 h-4 text-green-500" />}
                        <span className="text-xs text-gray-400">{submission.graded ? 'Graded' : 'Not Graded'}</span>
                      </div>
                    </div>
                    <div>
                      {expanded === submission.submission_id ? (
                        <ChevronUp className="w-6 h-6 text-gray-400" />
                      ) : (
                        <ChevronDown className="w-6 h-6 text-gray-400" />
                      )}
                    </div>
                  </div>
                  <AnimatePresence>
                    {expanded === submission.submission_id && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="border-t border-gray-200 bg-gray-50 p-6"
                      >
                        <h4 className="text-md font-semibold text-emerald-700 mb-4">Questions & Feedback</h4>
                        {submission.results && submission.results.length > 0 ? (
                          <div className="space-y-4">
                            {submission.results.map((result: any, qidx: number) => (
                              <div key={result.id} className="bg-white rounded-lg p-4 border border-gray-100">
                                <div className="flex items-center justify-between mb-2">
                                  <span className="font-medium text-gray-800">Q{qidx + 1}: {result.question_text}</span>
                                  <span className="text-xs text-gray-500">Marks: {result.marks} | Score: {result.score}</span>
                                </div>
                                <div className="text-xs text-gray-500 mb-1">Rubric: {result.rubric}</div>
                                <div className="text-xs text-gray-500 mb-1">Feedback: <span className="text-gray-700">{result.feedback}</span></div>
                                {result.correct_answer && (
                                  <div className="text-xs text-gray-500 mb-1">Correct Answer: <span className="text-gray-700">{result.correct_answer}</span></div>
                                )}
                                <div className="text-xs text-gray-400">Graded at: {result.graded_at ? new Date(result.graded_at).toLocaleString() : 'N/A'}</div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-gray-500 text-sm">No results/questions found for this submission.</div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>
          )}
        </main>
      </motion.div>
    </div>
  );
}