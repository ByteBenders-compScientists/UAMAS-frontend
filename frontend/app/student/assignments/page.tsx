'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
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
  Plus
} from 'lucide-react';

// Mock data
const mockAssignments = [
  {
    id: 1,
    title: 'Web Development Project',
    course: 'Computer Science 301',
    description: 'Create a full-stack web application using React and Node.js',
    dueDate: '2025-03-15',
    submittedAt: null,
    status: 'pending',
    maxScore: 100,
    score: null,
    attachments: ['project-requirements.pdf'],
    submissionType: 'file'
  },
  {
    id: 2,
    title: 'Algorithm Analysis Report',
    course: 'Computer Science 302',
    description: 'Analyze time complexity of sorting algorithms',
    dueDate: '2025-02-28',
    submittedAt: '2025-02-27',
    status: 'submitted',
    maxScore: 50,
    score: 45,
    attachments: ['algorithm-analysis.pdf'],
    submissionType: 'file'
  },
  {
    id: 3,
    title: 'Statistics Problem Set',
    course: 'Mathematics 202',
    description: 'Solve probability and statistics problems',
    dueDate: '2025-02-10',
    submittedAt: '2025-02-08',
    status: 'graded',
    maxScore: 75,
    score: 68,
    attachments: ['problem-set-3.pdf'],
    submissionType: 'file'
  }
];

export default function AssignmentsPage() {
  const { sidebarCollapsed, isMobileView, isTabletView } = useLayout();
  const [hasContent] = useState(mockAssignments.length > 0);
  const [selectedFilter, setSelectedFilter] = useState('all');

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

              {/* Assignments List */}
              <div className="space-y-4">
                {filteredAssignments.map((assignment, index) => (
                  <motion.div
                    key={assignment.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
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
                        <p className="text-sm text-gray-700 mb-4">{assignment.description}</p>
                        
                        <div className="flex items-center space-x-6 text-sm text-gray-500 mb-4">
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
                        {assignment.status === 'pending' && (
                          <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                            <Upload size={16} className="mr-2" />
                            Submit
                          </button>
                        )}
                        
                        <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                          <Eye size={18} />
                        </button>
                        
                        <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
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