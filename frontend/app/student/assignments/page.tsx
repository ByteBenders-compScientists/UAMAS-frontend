'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLayout } from '@/components/LayoutController';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import EmptyState from '@/components/EmptyState';
import { 
  ClipboardList, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  Calendar,
  FileText,
  Upload,
  Download,
  Eye,
  Plus,
  X,
  HelpCircle,
  FileUp,
  Check
} from 'lucide-react';

// Mock data
const mockAssignments = [
  {
    id: 1,
    title: 'Web Development Project',
    course: 'Computer Science 301',
    description: 'Create a full-stack web application using React and Node.js. Your application should include user authentication, database integration, and responsive design.',
    dueDate: '2025-06-15',
    submittedAt: null,
    status: 'pending',
    maxScore: 100,
    score: null,
    attachments: ['project-requirements.pdf'],
    submissionType: 'file',
    feedback: null
  },
  {
    id: 2,
    title: 'Algorithm Analysis Report',
    course: 'Computer Science 302',
    description: 'Analyze time complexity of sorting algorithms. Compare at least three different sorting algorithms and provide detailed analysis with Big O notation.',
    dueDate: '2025-02-28',
    submittedAt: '2025-02-27',
    status: 'submitted',
    maxScore: 50,
    score: null,
    attachments: ['algorithm-analysis-template.pdf'],
    submissionType: 'file',
    feedback: null
  },
  {
    id: 3,
    title: 'Statistics Problem Set',
    course: 'Mathematics 202',
    description: 'Solve probability and statistics problems. Include all steps in your calculations and provide explanations for your approach.',
    dueDate: '2025-02-10',
    submittedAt: '2025-02-08',
    status: 'graded',
    maxScore: 75,
    score: 68,
    attachments: ['problem-set-3.pdf'],
    submissionType: 'file',
    feedback: 'Good work on the probability problems. Your hypothesis testing could use more detailed explanations, but overall your understanding of the concepts is solid.'
  },
  {
    id: 4,
    title: 'Database Design Quiz',
    course: 'Database Systems',
    description: 'Answer multiple choice questions about database normalization, SQL, and relational algebra.',
    dueDate: '2025-06-05',
    submittedAt: null,
    status: 'pending',
    maxScore: 30,
    score: null,
    attachments: [],
    submissionType: 'quiz',
    feedback: null
  },
  {
    id: 5,
    title: 'Operating Systems Essay',
    course: 'Operating Systems',
    description: 'Write a 1000-word essay on modern operating system security challenges and solutions.',
    dueDate: '2025-06-20',
    submittedAt: null,
    status: 'pending',
    maxScore: 50,
    score: null,
    attachments: ['essay-guidelines.pdf'],
    submissionType: 'text',
    feedback: null
  }
];

export default function AssignmentsPage() {
  const { sidebarCollapsed, isMobileView, isTabletView } = useLayout();
  const [loading, setLoading] = useState(true);
  const [hasContent, setHasContent] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [activeAssignment, setActiveAssignment] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [textSubmission, setTextSubmission] = useState('');
  const [submissionSuccess, setSubmissionSuccess] = useState(false);
  const [expanded, setExpanded] = useState<number[]>([]);

  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setLoading(false);
      setHasContent(mockAssignments.length > 0);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'text-amber-600 bg-amber-50 border-amber-200';
      case 'submitted': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'graded': return 'text-green-600 bg-green-50 border-green-200';
      case 'overdue': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock size={16} />;
      case 'submitted': return <CheckCircle size={16} />;
      case 'graded': return <CheckCircle size={16} />;
      case 'overdue': return <AlertTriangle size={16} />;
      default: return <FileText size={16} />;
    }
  };

  const filteredAssignments = mockAssignments.filter(assignment => {
    if (selectedFilter === 'all') return true;
    return assignment.status === selectedFilter;
  });

  const getDaysUntilDue = (dueDate: string) => {
    const due = new Date(dueDate);
    const now = new Date();
    const diffTime = due.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setUploadedFiles(prev => [...prev, ...filesArray]);
    }
  };

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleStartSubmission = (id: number) => {
    setActiveAssignment(id);
    setIsSubmitting(true);
  };

  const handleCancelSubmission = () => {
    setIsSubmitting(false);
    setActiveAssignment(null);
    setUploadedFiles([]);
    setTextSubmission('');
  };

  const handleSubmit = () => {
    // In a real app, this would upload files or submit text
    setIsSubmitting(false);
    setSubmissionSuccess(true);
    
    // Reset after showing success message
    setTimeout(() => {
      setSubmissionSuccess(false);
      setActiveAssignment(null);
      setUploadedFiles([]);
      setTextSubmission('');
    }, 3000);
  };

  const toggleExpanded = (id: number) => {
    setExpanded(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
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
          <Header title="Assignments" showWeekSelector={false} />
          
          <main className="p-4 md:p-6">
            <div className="max-w-6xl mx-auto">
              {/* Skeleton Loading */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
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
              
              <div className="mb-6 animate-pulse">
                <div className="w-64 h-10 bg-gray-200 rounded-lg"></div>
              </div>
              
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 animate-pulse">
                    <div className="flex items-start justify-between">
                      <div className="w-2/3">
                        <div className="h-5 bg-gray-300 rounded mb-2"></div>
                        <div className="h-4 bg-gray-200 rounded mb-3"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/2 mb-3"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                      </div>
                      <div className="w-1/4">
                        <div className="h-10 bg-gray-200 rounded mb-2"></div>
                        <div className="h-6 bg-gray-300 rounded"></div>
                      </div>
                    </div>
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
        <Header title="Assignments" showWeekSelector={hasContent} />
        
        <main className="p-4 md:p-6">
          {!hasContent ? (
            <div className="max-w-4xl mx-auto">
              <EmptyState
                title="No Assignments Yet"
                description="Your assignments will appear here once your lecturers create them. You'll be able to view requirements, submit work, and track your progress."
                icon={<ClipboardList size={48} />}
              />
            </div>
          ) : (
            <div className="max-w-6xl mx-auto">
              {/* Stats Overview */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total</p>
                      <p className="text-2xl font-bold text-gray-900">{mockAssignments.length}</p>
                    </div>
                    <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                      <ClipboardList size={24} className="text-blue-600" />
                    </div>
                  </div>
                </motion.div>

                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Pending</p>
                      <p className="text-2xl font-bold text-amber-600">
                        {mockAssignments.filter(a => a.status === 'pending').length}
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-amber-50 rounded-lg flex items-center justify-center">
                      <Clock size={24} className="text-amber-600" />
                    </div>
                  </div>
                </motion.div>

                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Submitted</p>
                      <p className="text-2xl font-bold text-blue-600">
                        {mockAssignments.filter(a => a.status === 'submitted').length}
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                      <CheckCircle size={24} className="text-blue-600" />
                    </div>
                  </div>
                </motion.div>

                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Graded</p>
                      <p className="text-2xl font-bold text-green-600">
                        {mockAssignments.filter(a => a.status === 'graded').length}
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
                      <CheckCircle size={24} className="text-green-600" />
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Filter Tabs */}
              <div className="mb-6">
                <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-fit">
                  {['all', 'pending', 'submitted', 'graded'].map((filter) => (
                    <button
                      key={filter}
                      onClick={() => setSelectedFilter(filter)}
                      className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                        selectedFilter === filter
                          ? 'bg-white text-blue-600 shadow-sm'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      {filter.charAt(0).toUpperCase() + filter.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Success message */}
              <AnimatePresence>
                {submissionSuccess && (
                  <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="bg-green-100 border border-green-300 rounded-lg p-4 mb-4 flex items-center text-green-800"
                  >
                    <CheckCircle size={20} className="mr-2" />
                    <span>Your assignment has been submitted successfully!</span>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Assignments List */}
              <div className="space-y-4">
                {filteredAssignments.map((assignment, index) => (
                  <motion.div
                    key={assignment.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow overflow-hidden ${
                      activeAssignment === assignment.id ? 'ring-2 ring-blue-500' : ''
                    }`}
                  >
                    <div 
                      className={`p-6 ${expanded.includes(assignment.id) ? 'border-b border-gray-200' : ''}`}
                      onClick={() => toggleExpanded(assignment.id)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center mb-2">
                            <h3 className="text-lg font-semibold text-gray-900 mr-3">{assignment.title}</h3>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(assignment.status)}`}>
                              {getStatusIcon(assignment.status)}
                              <span className="ml-1">{assignment.status.charAt(0).toUpperCase() + assignment.status.slice(1)}</span>
                            </span>
                          </div>
                          
                          <p className="text-sm text-gray-600 mb-2">{assignment.course}</p>
                          <p className="text-sm text-gray-700 mb-4 line-clamp-2">{assignment.description}</p>
                          
                          <div className="flex items-center space-x-6 text-sm text-gray-500 mb-1">
                            <div className="flex items-center">
                              <Calendar size={16} className="mr-1" />
                              <span>Due: {new Date(assignment.dueDate).toLocaleDateString()}</span>
                            </div>
                            
                            {assignment.status === 'pending' && (
                              <div className="flex items-center">
                                <Clock size={16} className="mr-1" />
                                <span className={getDaysUntilDue(assignment.dueDate) <= 3 ? 'text-red-600 font-medium' : ''}>
                                  {getDaysUntilDue(assignment.dueDate)} days left
                                </span>
                              </div>
                            )}

                            {assignment.score !== null && (
                              <div className="flex items-center">
                                <span>Score: {assignment.score}/{assignment.maxScore}</span>
                              </div>
                            )}
                          </div>

                          {assignment.attachments.length > 0 && (
                            <div className="flex items-center space-x-2">
                              <FileText size={16} className="text-gray-400" />
                              <span className="text-sm text-gray-600">
                                {assignment.attachments.length} attachment(s)
                              </span>
                            </div>
                          )}
                        </div>

                        <div className="flex items-center space-x-2 ml-4">
                          {assignment.status === 'pending' && !isSubmitting && (
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                handleStartSubmission(assignment.id);
                              }}
                              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            >
                              <Upload size={16} className="mr-2" />
                              Submit
                            </button>
                          )}
                          
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                            }}
                            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                          >
                            <Eye size={18} />
                          </button>
                          
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                            }}
                            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                          >
                            <Download size={18} />
                          </button>
                          
                          {assignment.score !== null && (
                            <div className="text-right ml-4">
                              <div className="text-2xl font-bold text-green-600">
                                {Math.round((assignment.score / assignment.maxScore) * 100)}%
                              </div>
                              <div className="text-xs text-gray-500">Grade</div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Expanded content */}
                    {expanded.includes(assignment.id) && (
                      <div className="p-6 bg-gray-50">
                        <div className="mb-4">
                          <h4 className="font-medium text-gray-900 mb-2">Description</h4>
                          <p className="text-gray-700">{assignment.description}</p>
                        </div>
                        
                        {assignment.attachments.length > 0 && (
                          <div className="mb-4">
                            <h4 className="font-medium text-gray-900 mb-2">Attachments</h4>
                            <div className="space-y-2">
                              {assignment.attachments.map((attachment, idx) => (
                                <div key={idx} className="flex items-center space-x-2 p-2 bg-white rounded-lg border border-gray-200">
                                  <FileText size={16} className="text-gray-400" />
                                  <span className="text-sm text-gray-700">{attachment}</span>
                                  <button className="ml-auto p-1 text-gray-600 hover:bg-gray-100 rounded-full">
                                    <Download size={16} />
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        {assignment.feedback && (
                          <div className="mb-4">
                            <h4 className="font-medium text-gray-900 mb-2">Feedback</h4>
                            <div className="p-3 bg-blue-50 rounded-lg text-blue-800">
                              {assignment.feedback}
                            </div>
                          </div>
                        )}
                        
                        {assignment.status === 'pending' && (
                          <div className="mt-4">
                            <button
                              onClick={() => handleStartSubmission(assignment.id)}
                              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            >
                              <Upload size={16} className="mr-2" />
                              Submit Assignment
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                    
                    {/* Submission UI */}
                    {isSubmitting && activeAssignment === assignment.id && (
                      <div className="p-6 bg-gray-50 border-t border-gray-200">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-lg font-semibold text-gray-900">Submit Assignment</h3>
                          <button 
                            onClick={handleCancelSubmission}
                            className="p-1 text-gray-500 hover:bg-gray-200 rounded-full"
                          >
                            <X size={20} />
                          </button>
                        </div>
                        
                        {assignment.submissionType === 'file' && (
                          <div className="space-y-4">
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                              <input
                                type="file"
                                id="file-upload"
                                onChange={handleFileChange}
                                className="hidden"
                                multiple
                              />
                              <label 
                                htmlFor="file-upload"
                                className="cursor-pointer flex flex-col items-center justify-center"
                              >
                                <FileUp size={40} className="text-gray-400 mb-2" />
                                <p className="text-sm text-gray-600 mb-1">Drag and drop your files here, or click to browse</p>
                                <p className="text-xs text-gray-500">Accepted file types: PDF, DOC, DOCX, ZIP (Max 10MB)</p>
                              </label>
                            </div>
                            
                            {uploadedFiles.length > 0 && (
                              <div className="mt-4">
                                <h4 className="font-medium text-gray-900 mb-2">Uploaded Files</h4>
                                <div className="space-y-2">
                                  {uploadedFiles.map((file, idx) => (
                                    <div key={idx} className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200">
                                      <div className="flex items-center">
                                        <FileText size={16} className="text-gray-400 mr-2" />
                                        <div>
                                          <p className="text-sm font-medium text-gray-700">{file.name}</p>
                                          <p className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                                        </div>
                                      </div>
                                      <button 
                                        onClick={() => removeFile(idx)}
                                        className="p-1 text-gray-500 hover:bg-gray-100 rounded-full"
                                      >
                                        <X size={16} />
                                      </button>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                            
                            <div className="flex justify-end space-x-3 mt-6">
                              <button
                                onClick={handleCancelSubmission}
                                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                              >
                                Cancel
                              </button>
                              <button
                                onClick={handleSubmit}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                disabled={uploadedFiles.length === 0}
                              >
                                Submit Assignment
                              </button>
                            </div>
                          </div>
                        )}
                        
                        {assignment.submissionType === 'text' && (
                          <div className="space-y-4">
                            <div>
                              <label htmlFor="text-submission" className="block text-sm font-medium text-gray-700 mb-1">
                                Your Answer
                              </label>
                              <textarea
                                id="text-submission"
                                rows={8}
                                value={textSubmission}
                                onChange={(e) => setTextSubmission(e.target.value)}
                                placeholder="Type your answer here..."
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              ></textarea>
                            </div>
                            
                            <div className="flex justify-end space-x-3 mt-6">
                              <button
                                onClick={handleCancelSubmission}
                                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                              >
                                Cancel
                              </button>
                              <button
                                onClick={handleSubmit}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                disabled={textSubmission.trim() === ''}
                              >
                                Submit Assignment
                              </button>
                            </div>
                          </div>
                        )}
                        
                        {assignment.submissionType === 'quiz' && (
                          <div className="space-y-4">
                            <div className="p-4 bg-blue-50 rounded-lg flex items-start">
                              <HelpCircle size={20} className="text-blue-600 mr-2 flex-shrink-0 mt-0.5" />
                              <p className="text-sm text-blue-800">
                                This assignment contains multiple choice questions. Click the button below to start the quiz. 
                                Your answers will be automatically saved as you progress.
                              </p>
                            </div>
                            
                            <div className="flex justify-end space-x-3 mt-6">
                              <button
                                onClick={handleCancelSubmission}
                                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                              >
                                Cancel
                              </button>
                              <button
                                onClick={handleSubmit}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                              >
                                Start Quiz
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </main>
      </motion.div>
    </div>
  );
}