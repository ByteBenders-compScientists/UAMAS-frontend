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
  CalendarDays, Timer, FileCheck, Sparkles, Brain, Loader2, Wand2
} from 'lucide-react';

// ===== TYPES =====
interface Assignment {
  id: string;
  title: string;
  course: string;
  dueDate: string;
  status: 'Active' | 'Pending Review' | 'Draft' | 'Completed';
  submissions: number;
  totalStudents: number;
  week: number;
  description?: string;
  createdAt: string;
  instructions?: string;
  rubric?: string;
  points?: number;
  allowLateSubmissions?: boolean;
  submissionTypes?: string[];
}

interface Course {
  id: string;
  name: string;
  code: string;
  color: string;
}

interface AssignmentFormData {
  title: string;
  course: string;
  dueDate: string;
  week: number;
  description: string;
  instructions: string;
  rubric: string;
  points: number;
  allowLateSubmissions: boolean;
  submissionTypes: string[];
}

// ===== CONSTANTS =====
const SAMPLE_ASSIGNMENTS: Assignment[] = [
  { 
    id: '1', 
    title: 'Data Structures Project', 
    course: 'CS201', 
    dueDate: '2025-02-15', 
    status: 'Active', 
    submissions: 45, 
    totalStudents: 132, 
    week: 1,
    description: 'Implement various data structures including arrays, linked lists, and trees',
    createdAt: '2025-01-20',
    points: 100,
    allowLateSubmissions: true
  },
  { 
    id: '2', 
    title: 'Database Design Task', 
    course: 'CS202', 
    dueDate: '2025-02-18', 
    status: 'Pending Review', 
    submissions: 120, 
    totalStudents: 132, 
    week: 1,
    description: 'Design and implement a complete database system for a library management system',
    createdAt: '2025-01-18',
    points: 150,
    allowLateSubmissions: false
  },
  { 
    id: '3', 
    title: 'Algorithm Analysis', 
    course: 'CS301', 
    dueDate: '2025-02-22', 
    status: 'Active', 
    submissions: 23, 
    totalStudents: 85, 
    week: 2,
    description: 'Analyze time and space complexity of various sorting algorithms',
    createdAt: '2025-01-25',
    points: 80,
    allowLateSubmissions: true
  },
  { 
    id: '4', 
    title: 'System Design Project', 
    course: 'CS302', 
    dueDate: '2025-02-25', 
    status: 'Draft', 
    submissions: 0, 
    totalStudents: 95, 
    week: 2,
    description: 'Design a scalable web application architecture',
    createdAt: '2025-01-22',
    points: 120,
    allowLateSubmissions: true
  },
  { 
    id: '5', 
    title: 'Network Security Lab', 
    course: 'CS203', 
    dueDate: '2025-03-01', 
    status: 'Active', 
    submissions: 67, 
    totalStudents: 110, 
    week: 3,
    description: 'Implement security protocols and analyze network vulnerabilities',
    createdAt: '2025-01-15',
    points: 90,
    allowLateSubmissions: false
  },
];

// Week options for selection
const WEEK_OPTIONS = Array.from({ length: 15 }, (_, i) => ({
  value: i + 1,
  label: `Week ${i + 1}`,
  dateRange: `Feb ${1 + i * 7} - Feb ${7 + i * 7}`
}));

// Sample courses
const SAMPLE_COURSES = [
  { id: '1', name: 'Computer Science 201', code: 'CS201', color: 'bg-rose-500' },
  { id: '2', name: 'Computer Science 301', code: 'CS301', color: 'bg-blue-500' },
  { id: '3', name: 'Database Management', code: 'CS202', color: 'bg-purple-500' },
  { id: '4', name: 'Operating Systems', code: 'CS203', color: 'bg-green-500' },
  { id: '5', name: 'Software Engineering', code: 'CS302', color: 'bg-yellow-500' }
];

const SUBMISSION_TYPES = [
  'File Upload',
  'Text Entry',
  'Website URL',
  'Media Recording',
  'Code Repository'
];

// ===== UTILITY FUNCTIONS =====
const formatDate = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

const getStatusBadgeClass = (status: string): string => {
  const statusClasses: Record<string, string> = {
    'Active': 'bg-green-100 text-green-700',
    'Pending Review': 'bg-orange-100 text-orange-700',
    'Draft': 'bg-gray-100 text-gray-700',
    'Completed': 'bg-blue-100 text-blue-700'
  };
  return statusClasses[status] || 'bg-gray-100 text-gray-700';
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'Active': return CheckCircle;
    case 'Pending Review': return Clock;
    case 'Draft': return FileText;
    case 'Completed': return FileCheck;
    default: return FileText;
  }
};

const getCourseByCode = (courseCode: string) => {
  return SAMPLE_COURSES.find(course => course.code === courseCode) || SAMPLE_COURSES[0];
};

const generateAIAssignment = async (prompt: string, course: string, week: number): Promise<Partial<AssignmentFormData>> => {
  // Simulate AI generation delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  const courseContext = getCourseByCode(course);
  const courseName = courseContext?.name || 'Computer Science';
  
  // Simple AI simulation based on course and prompt
  const templates = {
    'CS201': {
      title: 'Data Structures Implementation',
      description: 'Students will implement and analyze fundamental data structures including arrays, linked lists, stacks, queues, and binary trees.',
      instructions: `1. Choose one data structure from the provided list\n2. Implement the data structure in your preferred programming language\n3. Write comprehensive test cases\n4. Analyze time and space complexity\n5. Submit your code with documentation`,
      rubric: `Code Quality (30 points)\n- Clean, readable code\n- Proper naming conventions\n- Comments and documentation\n\nFunctionality (40 points)\n- Correct implementation\n- All required methods\n- Edge case handling\n\nAnalysis (30 points)\n- Time complexity analysis\n- Space complexity analysis\n- Performance comparison`,
      points: 100
    },
    'CS202': {
      title: 'Database Design Project',
      description: 'Design and implement a complete database system for a real-world application.',
      instructions: `1. Choose a real-world scenario\n2. Create an Entity-Relationship diagram\n3. Implement the database schema\n4. Write SQL queries for common operations\n5. Create a simple interface`,
      rubric: `Database Design (40 points)\n- Proper normalization\n- Relationship modeling\n- Constraint implementation\n\nSQL Queries (35 points)\n- Query correctness\n- Optimization\n- Complex operations\n\nDocumentation (25 points)\n- ER diagram quality\n- Written explanations\n- User guide`,
      points: 150
    },
    'CS301': {
      title: 'Algorithm Analysis Assignment',
      description: 'Analyze and compare the performance of various algorithms.',
      instructions: `1. Select algorithms from the provided list\n2. Implement each algorithm\n3. Measure execution time with different input sizes\n4. Create performance graphs\n5. Write a comparative analysis report`,
      rubric: `Implementation (35 points)\n- Correct algorithm implementation\n- Code efficiency\n- Test case coverage\n\nAnalysis (40 points)\n- Time complexity analysis\n- Empirical performance testing\n- Graph visualization\n\nReport (25 points)\n- Clear explanations\n- Comparative insights\n- Professional presentation`,
      points: 120
    }
  };

  const template = templates[course as keyof typeof templates] || templates['CS201'];
  
  return {
    title: `${template.title} - Week ${week}`,
    description: template.description,
    instructions: template.instructions,
    rubric: template.rubric,
    points: template.points,
    allowLateSubmissions: true,
    submissionTypes: ['File Upload', 'Code Repository']
  };
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
          <option key={course.id} value={course.code}>{course.name} ({course.code})</option>
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

const AssignmentStatsCards: React.FC<{ assignments: Assignment[] }> = ({ assignments }) => {
  const totalAssignments = assignments.length;
  const activeAssignments = assignments.filter(a => a.status === 'Active').length;
  const completedAssignments = assignments.filter(a => a.status === 'Completed').length;
  const totalSubmissions = assignments.reduce((sum, a) => sum + a.submissions, 0);
  const totalPossibleSubmissions = assignments.reduce((sum, a) => sum + a.totalStudents, 0);
  const submissionRate = totalPossibleSubmissions > 0 ? Math.round((totalSubmissions / totalPossibleSubmissions) * 100) : 0;

  const stats = [
    {
      title: 'Total Assignments',
      value: totalAssignments,
      icon: FileText,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      iconBg: 'bg-blue-100'
    },
    {
      title: 'Active Assignments',
      value: activeAssignments,
      icon: Clock,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      iconBg: 'bg-green-100'
    },
    {
      title: 'Completed',
      value: completedAssignments,
      icon: CheckCircle,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      iconBg: 'bg-purple-100'
    },
    {
      title: 'Submission Rate',
      value: `${submissionRate}%`,
      icon: BarChart3,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      iconBg: 'bg-orange-100'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className={`${stat.bgColor} rounded-xl p-6 border border-gray-100`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">{stat.title}</p>
              <p className={`text-2xl font-bold ${stat.color} mt-1`}>{stat.value}</p>
            </div>
            <div className={`${stat.iconBg} p-3 rounded-lg`}>
              <stat.icon className={`w-6 h-6 ${stat.color}`} />
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

const AssignmentCard: React.FC<{
  assignment: Assignment;
  index: number;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onView: (id: string) => void;
}> = ({ assignment, index, onEdit, onDelete, onView }) => {
  const StatusIcon = getStatusIcon(assignment.status);
  const course = getCourseByCode(assignment.course);
  const submissionPercentage = Math.round((assignment.submissions / assignment.totalStudents) * 100);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <div className={`w-3 h-3 rounded-full ${course.color}`}></div>
            <span className="text-sm font-medium text-gray-600">{assignment.course}</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-1">{assignment.title}</h3>
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">{assignment.description}</p>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(assignment.status)}`}>
          {assignment.status}
        </span>
      </div>

      <div className="space-y-3 mb-4">
        <div className="flex items-center text-sm text-gray-600">
          <Calendar className="w-4 h-4 mr-2" />
          <span>Due: {formatDate(assignment.dueDate)}</span>
        </div>
        
        <div className="flex items-center text-sm text-gray-600">
          <Users className="w-4 h-4 mr-2" />
          <span>Submissions: {assignment.submissions}/{assignment.totalStudents} ({submissionPercentage}%)</span>
        </div>

        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-rose-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${submissionPercentage}%` }}
          ></div>
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <div className="flex items-center space-x-2">
          <StatusIcon className="w-4 h-4 text-gray-500" />
          <span className="text-xs text-gray-500">
            Created {formatDate(assignment.createdAt)}
          </span>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={() => onView(assignment.id)}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            title="View Details"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            onClick={() => onEdit(assignment.id)}
            className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
            title="Edit Assignment"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(assignment.id)}
            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title="Delete Assignment"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

const CreateAssignmentModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: AssignmentFormData) => void;
  selectedWeek: number;
  selectedCourse: string;
}> = ({ isOpen, onClose, onSubmit, selectedWeek, selectedCourse }) => {
  const [activeTab, setActiveTab] = useState<'manual' | 'ai'>('manual');
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [formData, setFormData] = useState<AssignmentFormData>({
    title: '',
    course: selectedCourse || '',
    dueDate: '',
    week: selectedWeek,
    description: '',
    instructions: '',
    rubric: '',
    points: 100,
    allowLateSubmissions: true,
    submissionTypes: ['File Upload']
  });

  const handleInputChange = (field: keyof AssignmentFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmissionTypeToggle = (type: string) => {
    setFormData(prev => ({
      ...prev,
      submissionTypes: prev.submissionTypes.includes(type)
        ? prev.submissionTypes.filter(t => t !== type)
        : [...prev.submissionTypes, type]
    }));
  };

  const handleAIGenerate = async () => {
    if (!aiPrompt.trim() || !formData.course) return;
    
    setIsGenerating(true);
    try {
      const aiData = await generateAIAssignment(aiPrompt, formData.course, formData.week);
      setFormData(prev => ({ ...prev, ...aiData }));
    } catch (error) {
      console.error('AI generation failed:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
      >
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-xl">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-800">Create New Assignment</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div className="flex space-x-1 mt-4 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setActiveTab('manual')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'manual'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Edit className="w-4 h-4 inline mr-2" />
              Manual Creation
            </button>
            <button
              onClick={() => setActiveTab('ai')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'ai'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Sparkles className="w-4 h-4 inline mr-2" />
              AI Assistant
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {activeTab === 'ai' && (
            <div className="mb-6 p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border border-purple-200">
              <div className="flex items-center mb-3">
                <Brain className="w-5 h-5 text-purple-600 mr-2" />
                <h3 className="font-semibold text-gray-800">AI Assignment Generator</h3>
              </div>
              <p className="text-sm text-gray-600 mb-3">
                Describe what you want your students to learn or work on, and I'll generate a complete assignment for you.
              </p>
              <div className="flex space-x-3">
                <input
                  type="text"
                  placeholder="e.g., 'Create a project about sorting algorithms with time complexity analysis'"
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
                <button
                  type="button"
                  onClick={handleAIGenerate}
                  disabled={isGenerating || !aiPrompt.trim() || !formData.course}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  {isGenerating ? (
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  ) : (
                    <Wand2 className="w-4 h-4 mr-2" />
                  )}
                  Generate
                </button>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Assignment Title *</label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                placeholder="Enter assignment title"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Course *</label>
              <select
                required
                value={formData.course}
                onChange={(e) => handleInputChange('course', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
              >
                <option value="">Select a course</option>
                {SAMPLE_COURSES.map(course => (
                  <option key={course.id} value={course.code}>
                    {course.name} ({course.code})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Due Date *</label>
              <input
                type="date"
                required
                value={formData.dueDate}
                onChange={(e) => handleInputChange('dueDate', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Week *</label>
              <select
                required
                value={formData.week}
                onChange={(e) => handleInputChange('week', Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
              >
                {WEEK_OPTIONS.map(week => (
                  <option key={week.value} value={week.value}>
                    {week.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Points</label>
              <input
                type="number"
                min="0"
                value={formData.points}
                onChange={(e) => handleInputChange('points', Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                placeholder="100"
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="allowLate"
                checked={formData.allowLateSubmissions}
                onChange={(e) => handleInputChange('allowLateSubmissions', e.target.checked)}
                className="w-4 h-4 text-rose-600 bg-gray-100 border-gray-300 rounded focus:ring-rose-500"
              />
              <label htmlFor="allowLate" className="ml-2 text-sm text-gray-700">
                Allow late submissions
              </label>
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
            <textarea
              required
              rows={3}
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
              placeholder="Provide a brief description of the assignment"
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Instructions</label>
            <textarea
              rows={5}
              value={formData.instructions}
              onChange={(e) => handleInputChange('instructions', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
              placeholder="Detailed instructions for students..."
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Rubric</label>
            <textarea
              rows={4}
              value={formData.rubric}
              onChange={(e) => handleInputChange('rubric', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
              placeholder="Define the grading criteria and points distribution..."
            />
          </div>

          </form>
          </motion.div>
          </div>
  );
  };

// ===== MAIN COMPONENT =====
const AssignmentsDashboard: React.FC = () => {
  const { sidebarCollapsed, setSidebarCollapsed, isMobileView, isTabletView } = useLayout();
  const [loading, setLoading] = useState(true);
  const [selectedWeek, setSelectedWeek] = useState<number>(1);
  const [selectedCourse, setSelectedCourse] = useState<string>('');
  const [assignments, setAssignments] = useState(SAMPLE_ASSIGNMENTS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState<Assignment | null>(null);
  const [notification, setNotification] = useState<{message: string; type: 'success' | 'error' | 'info'} | null>(null);

  // Filter assignments based on selected week and course
  const filteredAssignments = assignments.filter(
    (assignment) =>
      assignment.week === selectedWeek &&
      (selectedCourse === '' || assignment.course === selectedCourse)
  );

  const hasContent = assignments.length > 0;

  // Show notification
  const showNotification = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  // Event handlers
  const handleEdit = (id: string) => {
    const assignment = assignments.find(a => a.id === id) || null;
    setEditingAssignment(assignment);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    const assignment = assignments.find(a => a.id === id);
    if (window.confirm(`Are you sure you want to delete "${assignment?.title}"?`)) {
      setAssignments(prev => prev.filter(a => a.id !== id));
      showNotification('Assignment deleted successfully', 'success');
    }
  };

  const handleView = (id: string) => {
    const assignment = assignments.find(a => a.id === id);
    showNotification(`Viewing assignment: ${assignment?.title}`, 'info');
  };

  const handleCreateNew = () => {
    setEditingAssignment(null);
    setIsModalOpen(true);
  };

  const handleSaveAssignment = (assignmentData: any) => {
    if (editingAssignment) {
      // Update existing assignment
      setAssignments(prev => prev.map(a => 
        a.id === assignmentData.id ? assignmentData : a
      ));
      showNotification('Assignment updated successfully');
    } else {
      // Create new assignment
      setAssignments(prev => [...prev, assignmentData]);
      showNotification('Assignment created successfully');
    }
    setIsModalOpen(false);
    setEditingAssignment(null);
  };

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

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
          <Header title="Assignments" />
          
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
        <Header title="Assignments" />
        
        {/* Notification */}
        <AnimatePresence>
          {notification && (
            <motion.div
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg ${
                notification.type === 'success' ? 'bg-green-500 text-white' :
                notification.type === 'error' ? 'bg-red-500 text-white' :
                'bg-blue-500 text-white'
              }`}
            >
              {notification.message}
            </motion.div>
          )}
        </AnimatePresence>
        
        <main className="p-4 md:p-6">
          {!hasContent ? (
            <div className="max-w-4xl mx-auto">
              <EmptyState
                title="No Assignments Created"
                description="Create your first assignment to get started. You can schedule assignments, track submissions, and manage grading all in one place."
                onAction={handleCreateNew}
              />
            </div>
          ) : (
            <div className="max-w-7xl mx-auto">
              <div className="mb-6">
                <h1 className="text-2xl lg:text-3xl font-bold text-gray-800">Assignments Dashboard</h1>
                <p className="text-gray-600 mt-2">Manage your course assignments for Spring 2025 semester</p>
              </div>

              <WeekAndCourseSelector 
                selectedWeek={selectedWeek}
                selectedCourse={selectedCourse}
                onWeekChange={setSelectedWeek}
                onCourseChange={setSelectedCourse}
              />

              <AssignmentStatsCards assignments={filteredAssignments} />

              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-800">
                      Assignments - Week {selectedWeek}
                      {selectedCourse && ` (${selectedCourse})`}
                    </h2>
                    <p className="text-sm text-gray-600 mt-1">
                      {filteredAssignments.length} assignment{filteredAssignments.length !== 1 ? 's' : ''} found
                    </p>
                  </div>
                  <button 
                    onClick={handleCreateNew}
                    className="bg-rose-500 text-white px-4 py-2 rounded-lg hover:bg-rose-600 transition-colors flex items-center"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    New Assignment
                  </button>
                </div>

                {filteredAssignments.length === 0 ? (
                  <div className="text-center py-12">
                    <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-600 mb-2">
                      No assignments found
                    </h3>
                    <p className="text-gray-500 mb-4">
                      {selectedCourse 
                        ? `No assignments for ${selectedCourse} in Week ${selectedWeek}` 
                        : `No assignments scheduled for Week ${selectedWeek}`
                      }
                    </p>
                    <button 
                      onClick={handleCreateNew}
                      className="bg-rose-500 text-white px-6 py-3 rounded-lg hover:bg-rose-600 transition-colors inline-flex items-center"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Create Assignment
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredAssignments.map((assignment, index) => (
                      <AssignmentCard
                        key={assignment.id}
                        assignment={assignment}
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

        {/* Assignment Modal */}
        <CreateAssignmentModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setEditingAssignment(null);
          }}
          onSubmit={handleSaveAssignment}
          selectedWeek={selectedWeek}
          selectedCourse={selectedCourse}
        />
      </motion.div>
    </div>
  );
};

export default AssignmentsDashboard;