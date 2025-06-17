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
  CalendarDays, Timer, FileCheck, Sparkles, Save, Brain, Loader2, Wand2
} from 'lucide-react';

interface CAT {
  id: string;
  title: string;
  course: string;
  date: string;
  status: 'Scheduled' | 'Completed' | 'Draft' | 'In Progress';
  duration: string;
  week: number;
  totalStudents: number;
  completedStudents: number;
  files?: File[];
  description?: string;
  createdAt: string;
  questions?: Question[];
  instructions?: string;
}

interface Question {
  id: string;
  type: 'multiple-choice' | 'short-answer' | 'essay' | 'true-false';
  question: string;
  options?: string[];
  correctAnswer?: string;
  points: number;
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

const WEEK_OPTIONS = Array.from({ length: 15 }, (_, i) => ({
  value: i + 1,
  label: `Week ${i + 1}`,
  dateRange: `Feb ${1 + i * 7} - Feb ${7 + i * 7}`
}));

const INITIAL_CATS: CAT[] = [
  {
    id: '1',
    title: 'Math CAT 1',
    course: '1',
    date: '2025-02-20',
    status: 'Scheduled',
    duration: '2',
    week: 3,
    totalStudents: 45,
    completedStudents: 0,
    description: 'Comprehensive assessment covering algebra and calculus fundamentals',
    createdAt: '2025-01-15',
    instructions: 'Read all questions carefully. Show your work for partial credit.'
  },
  {
    id: '2',
    title: 'Science CAT 2',
    course: '3',
    date: '2025-02-25',
    status: 'Draft',
    duration: '1.5',
    week: 3,
    totalStudents: 38,
    completedStudents: 0,
    description: 'Laboratory practical assessment on chemical reactions',
    createdAt: '2025-01-18'
  },
  {
    id: '3',
    title: 'History CAT 3',
    course: '4',
    date: '2025-02-10',
    status: 'Completed',
    duration: '2',
    week: 2,
    totalStudents: 42,
    completedStudents: 42,
    description: 'Assessment on World War II and its impact on modern society',
    createdAt: '2025-01-10'
  }
];

// ===== UTILITY FUNCTIONS =====
const formatDate = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

const getStatusBadgeClass = (status: string): string => {
  const statusClasses: Record<string, string> = {
    'Scheduled': 'bg-yellow-100 text-yellow-700',
    'Completed': 'bg-green-100 text-green-700',
    'Draft': 'bg-gray-100 text-gray-700',
    'In Progress': 'bg-blue-100 text-blue-700'
  };
  return statusClasses[status] || 'bg-gray-100 text-gray-700';
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'Scheduled': return CalendarDays;
    case 'Completed': return CheckCircle;
    case 'Draft': return FileText;
    case 'In Progress': return Timer;
    default: return FileText;
  }
};

const getCourseByCode = (courseCode: string) => {
  return SAMPLE_COURSES.find(course => course.id === courseCode) || SAMPLE_COURSES[0];
};

// ===== AI QUESTION GENERATION =====
const generateAIQuestions = (course: string, topic: string, difficulty: string, count: number): Question[] => {
  const sampleQuestions: Question[] = [
    {
      id: '1',
      type: 'multiple-choice',
      question: 'What is the time complexity of binary search?',
      options: ['O(n)', 'O(log n)', 'O(n²)', 'O(1)'],
      correctAnswer: 'O(log n)',
      points: 5
    },
    {
      id: '2',
      type: 'short-answer',
      question: 'Explain the difference between a stack and a queue.',
      points: 10
    },
    {
      id: '3',
      type: 'essay',
      question: 'Discuss the advantages and disadvantages of object-oriented programming.',
      points: 15
    },
    {
      id: '4',
      type: 'true-false',
      question: 'Arrays in most programming languages are zero-indexed.',
      correctAnswer: 'true',
      points: 3
    }
  ];
  
  return sampleQuestions.slice(0, count);
};

// ===== COMPONENTS =====
const Modal: React.FC<{ isOpen: boolean; onClose: () => void; children: React.ReactNode }> = ({ 
  isOpen, 
  onClose, 
  children 
}) => (
  <AnimatePresence>
    {isOpen && (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto"
          onClick={e => e.stopPropagation()}
        >
          {children}
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);

const CreateCATModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSave: (cat: Omit<CAT, 'id' | 'createdAt'>) => void;
  editingCAT?: CAT | null;
}> = ({ isOpen, onClose, onSave, editingCAT }) => {
  const [formData, setFormData] = useState({
    title: '',
    course: '',
    date: '',
    duration: '',
    week: 1,
    totalStudents: '',
    description: '',
    instructions: '',
    status: 'Draft' as CAT['status']
  });

  const [questions, setQuestions] = useState<Question[]>([]);
  const [showAIGenerator, setShowAIGenerator] = useState(false);
  const [aiSettings, setAISettings] = useState({
    topic: '',
    difficulty: 'medium',
    questionCount: 5
  });

  useEffect(() => {
    if (editingCAT) {
      setFormData({
        title: editingCAT.title,
        course: editingCAT.course,
        date: editingCAT.date,
        duration: editingCAT.duration,
        week: editingCAT.week,
        totalStudents: editingCAT.totalStudents.toString(),
        description: editingCAT.description || '',
        instructions: editingCAT.instructions || '',
        status: editingCAT.status
      });
      setQuestions(editingCAT.questions || []);
    } else {
      setFormData({
        title: '',
        course: '',
        date: '',
        duration: '',
        week: 1,
        totalStudents: '',
        description: '',
        instructions: '',
        status: 'Draft'
      });
      setQuestions([]);
    }
  }, [editingCAT, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      totalStudents: parseInt(formData.totalStudents),
      completedStudents: 0,
      questions
    });
    onClose();
  };

  const generateAIContent = () => {
    const newQuestions = generateAIQuestions(
      formData.course,
      aiSettings.topic,
      aiSettings.difficulty,
      aiSettings.questionCount
    );
    setQuestions(prev => [...prev, ...newQuestions]);
    setShowAIGenerator(false);
  };

  const addManualQuestion = () => {
    const newQuestion: Question = {
      id: Date.now().toString(),
      type: 'multiple-choice',
      question: '',
      options: ['', '', '', ''],
      points: 5
    };
    setQuestions(prev => [...prev, newQuestion]);
  };

  const updateQuestion = (id: string, updates: Partial<Question>) => {
    setQuestions(prev => prev.map(q => q.id === id ? { ...q, ...updates } : q));
  };

  const removeQuestion = (id: string) => {
    setQuestions(prev => prev.filter(q => q.id !== id));
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            {editingCAT ? 'Edit CAT' : 'Create New CAT'}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">CAT Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={e => setFormData(prev => ({ ...prev, title: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Course</label>
              <select
                value={formData.course}
                onChange={e => setFormData(prev => ({ ...prev, course: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                required
              >
                <option value="">Select Course</option>
                {SAMPLE_COURSES.map(course => (
                  <option key={course.id} value={course.id}>
                    {course.name} ({course.code})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
              <input
                type="date"
                value={formData.date}
                onChange={e => setFormData(prev => ({ ...prev, date: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Duration (hours)</label>
              <input
                type="number"
                step="0.5"
                value={formData.duration}
                onChange={e => setFormData(prev => ({ ...prev, duration: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Week</label>
              <select
                value={formData.week}
                onChange={e => setFormData(prev => ({ ...prev, week: parseInt(e.target.value) }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-rose-500 focus:border-transparent"
              >
                {WEEK_OPTIONS.map(week => (
                  <option key={week.value} value={week.value}>
                    {week.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Total Students</label>
              <input
                type="number"
                value={formData.totalStudents}
                onChange={e => setFormData(prev => ({ ...prev, totalStudents: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea
              value={formData.description}
              onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={3}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-rose-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Instructions</label>
            <textarea
              value={formData.instructions}
              onChange={e => setFormData(prev => ({ ...prev, instructions: e.target.value }))}
              rows={2}
              placeholder="Special instructions for students..."
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-rose-500 focus:border-transparent"
            />
          </div>

          {/* Questions Section */}
          <div className="border-t pt-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Questions</h3>
              <div className="flex space-x-2">
                <button
                  type="button"
                  onClick={() => setShowAIGenerator(true)}
                  className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center text-sm"
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  AI Generate
                </button>
                <button
                  type="button"
                  onClick={addManualQuestion}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center text-sm"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Manual
                </button>
              </div>
            </div>

            {questions.length === 0 ? (
              <div className="text-center py-8 bg-gray-50 rounded-lg">
                <Brain className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-600">No questions added yet</p>
                <p className="text-sm text-gray-500">Use AI generation or add questions manually</p>
              </div>
            ) : (
              <div className="space-y-4 max-h-60 overflow-y-auto">
                {questions.map((question, index) => (
                  <div key={question.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-600">
                        Question {index + 1} ({question.type})
                      </span>
                      <button
                        type="button"
                        onClick={() => removeQuestion(question.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="text-sm text-gray-800 mb-2">{question.question || 'No question text'}</p>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>Points: {question.points}</span>
                      {question.options && <span>{question.options.length} options</span>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-end space-x-4 pt-6 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-rose-500 text-white rounded-lg hover:bg-rose-600 transition-colors flex items-center"
            >
              <Save className="w-4 h-4 mr-2" />
              {editingCAT ? 'Update CAT' : 'Create CAT'}
            </button>
          </div>
        </form>

        {/* AI Generator Modal */}
        <AnimatePresence>
          {showAIGenerator && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center"
            >
              <motion.div
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.95 }}
                className="bg-white rounded-lg p-6 w-96"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                    <Sparkles className="w-5 h-5 mr-2 text-purple-600" />
                    AI Question Generator
                  </h3>
                  <button
                    onClick={() => setShowAIGenerator(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Topic</label>
                    <input
                      type="text"
                      value={aiSettings.topic}
                      onChange={e => setAISettings(prev => ({ ...prev, topic: e.target.value }))}
                      placeholder="e.g., Data Structures, Algorithms"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Difficulty</label>
                    <select
                      value={aiSettings.difficulty}
                      onChange={e => setAISettings(prev => ({ ...prev, difficulty: e.target.value }))}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                      <option value="easy">Easy</option>
                      <option value="medium">Medium</option>
                      <option value="hard">Hard</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Number of Questions</label>
                    <input
                      type="number"
                      min="1"
                      max="20"
                      value={aiSettings.questionCount}
                      onChange={e => setAISettings(prev => ({ ...prev, questionCount: parseInt(e.target.value) }))}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    onClick={() => setShowAIGenerator(false)}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={generateAIContent}
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center"
                  >
                    <Brain className="w-4 h-4 mr-2" />
                    Generate
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Modal>
  );
};

const ViewCATModal: React.FC<{
  cat: CAT | null;
  isOpen: boolean;
  onClose: () => void;
}> = ({ cat, isOpen, onClose }) => {
  if (!cat) return null;

  const course = getCourseByCode(cat.course);
  const completionPercentage = cat.totalStudents > 0 ? (cat.completedStudents / cat.totalStudents) * 100 : 0;

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">{cat.title}</h2>
          <div className="flex items-center space-x-3">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusBadgeClass(cat.status)}`}>
              {cat.status}
            </span>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className={`w-4 h-4 rounded-full ${course.color}`}></div>
              <div>
                <p className="font-medium text-gray-800">{course.name}</p>
                <p className="text-sm text-gray-600">{course.code}</p>
              </div>
            </div>

            <div className="flex items-center space-x-2 text-gray-600">
              <CalendarDays className="w-4 h-4" />
              <span>{formatDate(cat.date)}</span>
            </div>

            <div className="flex items-center space-x-2 text-gray-600">
              <Timer className="w-4 h-4" />
              <span>{cat.duration} hour{cat.duration !== '1' ? 's' : ''}</span>
            </div>

            <div className="flex items-center space-x-2 text-gray-600">
              <Users className="w-4 h-4" />
              <span>{cat.totalStudents} students enrolled</span>
            </div>
          </div>

          <div className="space-y-4">
            {(cat.status === 'In Progress' || cat.status === 'Completed') && (
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">Progress</span>
                  <span className="text-sm text-gray-600">
                    {cat.completedStudents}/{cat.totalStudents}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className="bg-rose-500 h-3 rounded-full transition-all duration-300"
                    style={{ width: `${completionPercentage}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500 mt-1">{Math.round(completionPercentage)}% complete</p>
              </div>
            )}

            <div>
              <p className="text-sm font-medium text-gray-700 mb-1">Week</p>
              <p className="text-gray-600">Week {cat.week}</p>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-700 mb-1">Created</p>
              <p className="text-gray-600">{formatDate(cat.createdAt)}</p>
            </div>
          </div>
        </div>

        {cat.description && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Description</h3>
            <p className="text-gray-600 bg-gray-50 p-4 rounded-lg">{cat.description}</p>
          </div>
        )}

        {cat.instructions && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Instructions</h3>
            <p className="text-gray-600 bg-blue-50 p-4 rounded-lg border-l-4 border-blue-400">
              {cat.instructions}
            </p>
          </div>
        )}

        {cat.questions && cat.questions.length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Questions ({cat.questions.length})</h3>
            <div className="space-y-4 max-h-60 overflow-y-auto">
              {cat.questions.map((question, index) => (
                <div key={question.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-600">
                      Question {index + 1} - {question.type}
                    </span>
                    <span className="text-sm text-blue-600 font-medium">{question.points} pts</span>
                  </div>
                  <p className="text-gray-800 mb-2">{question.question}</p>
                  {question.options && (
                    <div className="text-sm text-gray-600">
                      {question.options.map((option, idx) => (
                        <div key={idx} className="ml-4">• {option}</div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex justify-end space-x-3 pt-6 border-t">
          <button
            onClick={onClose}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Close
          </button>
          <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center">
            <Download className="w-4 h-4 mr-2" />
            Export PDF
          </button>
        </div>
      </div>
    </Modal>
  );
};

const CATCard: React.FC<{ 
  cat: CAT; 
  onEdit: (cat: CAT) => void; 
  onDelete: (catId: string) => void;
  onView: (cat: CAT) => void;
  index: number;
}> = ({ cat, onEdit, onDelete, onView, index }) => {
  const course = getCourseByCode(cat.course);
  const StatusIcon = getStatusIcon(cat.status);
  const completionPercentage = cat.totalStudents > 0 ? (cat.completedStudents / cat.totalStudents) * 100 : 0;

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
            <span className="text-sm font-medium text-gray-600">{cat.course}</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-1">{cat.title}</h3>
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">{cat.description}</p>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(cat.status)}`}>
          {cat.status}
        </span>
      </div>

      <div className="space-y-3 mb-4">
        <div className="flex items-center text-sm text-gray-600">
          <Calendar className="w-4 h-4 mr-2" />
          <span>Due: {formatDate(cat.date)}</span>
        </div>
        
        <div className="flex items-center text-sm text-gray-600">
          <Users className="w-4 h-4 mr-2" />
          <span>Submissions: {cat.completedStudents}/{cat.totalStudents} ({Math.round(completionPercentage)}%)</span>
        </div>

        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-rose-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${completionPercentage}%` }}
          ></div>
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <div className="flex items-center space-x-2">
          <StatusIcon className="w-4 h-4 text-gray-500" />
          <span className="text-xs text-gray-500">
            Created {formatDate(cat.createdAt)}
          </span>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={() => onView(cat)}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            title="View Details"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            onClick={() => onEdit(cat)}
            className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
            title="Edit Cat"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(cat.id)}
            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title="Delete Cat"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
      </motion.div>
    );
  };

interface CatFormData {
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

const CreateCatModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: CatFormData) => void;
  selectedWeek: number;
  selectedCourse: string;
}> = ({ isOpen, onClose, onSubmit, selectedWeek, selectedCourse }) => {
  const [activeTab, setActiveTab] = useState<'manual' | 'ai'>('manual');
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [formData, setFormData] = useState<CatFormData>({
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

  const handleInputChange = (field: keyof CatFormData, value: any) => {
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

  // Dummy AI CAT generator function
  const generateAICat = async (prompt: string, course: string, week: number) => {
    // Simulate an API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000));
    // Return mock data
    return {
      title: `AI Generated Cat for ${course}`,
      description: `This Cat was generated based on the prompt: "${prompt}"`,
      instructions: 'Please follow the instructions carefully.',
      rubric: 'Standard grading rubric applies.',
      points: 100,
      allowLateSubmissions: true,
      submissionTypes: ['File Upload'],
      course,
      dueDate: '',
      week,
    };
  };

  const handleAIGenerate = async () => {
    if (!aiPrompt.trim() || !formData.course) return;
    
    setIsGenerating(true);
    try {
      const aiData = await generateAICat(aiPrompt, formData.course, formData.week);
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
            <h2 className="text-2xl font-bold text-gray-800">Create New Cat</h2>
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
                <h3 className="font-semibold text-gray-800">AI Cat Generator</h3>
              </div>
              <p className="text-sm text-gray-600 mb-3">
                Describe what you want your students to learn or work on, and I'll generate a complete cat for you.
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
              <label className="block text-sm font-medium text-gray-700 mb-2">Cat Title *</label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                placeholder="Enter Cat title"
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
              placeholder="Provide a brief description of the cat"
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


// ===== STATS CARDS COMPONENT =====
const CATStatsCards: React.FC<{ cats: CAT[] }> = ({ cats }) => {
  const total = cats.length;
  const completed = cats.filter(cat => cat.status === 'Completed').length;
  const scheduled = cats.filter(cat => cat.status === 'Scheduled').length;
  const draft = cats.filter(cat => cat.status === 'Draft').length;
  const inProgress = cats.filter(cat => cat.status === 'In Progress').length;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      <div className="bg-white rounded-lg p-4 flex items-center space-x-4 border border-gray-200">
        <BookOpen className="w-8 h-8 text-rose-500" />
        <div>
          <div className="text-lg font-bold text-gray-800">{total}</div>
          <div className="text-sm text-gray-600">Total CATs</div>
        </div>
      </div>
      <div className="bg-white rounded-lg p-4 flex items-center space-x-4 border border-gray-200">
        <CheckCircle className="w-8 h-8 text-green-500" />
        <div>
          <div className="text-lg font-bold text-gray-800">{completed}</div>
          <div className="text-sm text-gray-600">Completed</div>
        </div>
      </div>
      <div className="bg-white rounded-lg p-4 flex items-center space-x-4 border border-gray-200">
        <CalendarDays className="w-8 h-8 text-yellow-500" />
        <div>
          <div className="text-lg font-bold text-gray-800">{scheduled}</div>
          <div className="text-sm text-gray-600">Scheduled</div>
        </div>
      </div>
      <div className="bg-white rounded-lg p-4 flex items-center space-x-4 border border-gray-200">
        <FileText className="w-8 h-8 text-gray-400" />
        <div>
          <div className="text-lg font-bold text-gray-800">{draft + inProgress}</div>
          <div className="text-sm text-gray-600">Draft/In Progress</div>
        </div>
      </div>
    </div>
  );
};

// ===== MAIN COMPONENT =====
const page: React.FC = () => {
  const { sidebarCollapsed, isMobileView, isTabletView } = useLayout();
  const [loading, setLoading] = useState(true);
  const [hasContent, setHasContent] = useState(false);
  const [cats, setCats] = useState<CAT[]>(INITIAL_CATS);
  const [selectedWeek, setSelectedWeek] = useState<number>(2);
  const [selectedCourse, setSelectedCourse] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCat, setEditingCat] = useState<CAT | null>(null);
  const [notification, setNotification] = useState<{message: string; type: 'success' | 'error' | 'info'} | null>(null);

  // Filter CATs based on selected week and course
  const filteredCATs = cats.filter(
    (cat) =>
      cat.week === selectedWeek &&
      (selectedCourse === '' || cat.course === selectedCourse)
  );
    // const hasContent = cat.length > 0;
    const showNotification = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  // Event handlers
  const handleEdit = (cat: CAT) => {
    setEditingCat(cat);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    const catToDelete = cats.find(c => c.id === id);
    if (window.confirm(`Are you sure you want to delete "${catToDelete?.title}"?`)) {
      setCats(prev => prev.filter(c => c.id !== id));
      showNotification('Cat deleted successfully', 'success');
    }
  };

  const handleView = (cat: CAT) => {
    showNotification(`Viewing cat: ${cat.title}`, 'info');
  };

  const handleCreateNew = () => {
    setEditingCat(null);
    setIsModalOpen(true);
  };

  const handleSaveACat = (catData: any) => {
    if (editingCat) {
      // Update existing Cat
      setCats(prev => prev.map(c => 
        c.id === catData.id ? catData : c
      ));
      showNotification('Cat updated successfully');
    } else {
      // Create new Cat
      setCats(prev => [...prev, catData]);
      showNotification('Cat created successfully');
    }
    setIsModalOpen(false);
    setEditingCat(null);
  };


  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
      setHasContent(INITIAL_CATS.length > 0);
    }, 1500);
    
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
          <Header title="CATs" showWeekSelector={false} />
          
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
        <Header title="CATs" showWeekSelector={hasContent} />
        
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
                title="No Cats Created"
                description="Create your first Cats to get started. You can schedule Cats, track submissions, and manage grading all in one place."
                onAction={handleCreateNew}
              />
            </div>
          ) : (
            <div className="max-w-7xl mx-auto">
              <div className="mb-6">
                <h1 className="text-2xl lg:text-3xl font-bold text-gray-800">Cats Dashboard</h1>
                <p className="text-gray-600 mt-2">Manage your course cats for Spring 2025 semester</p>
              </div>

              <WeekAndCourseSelector 
                selectedWeek={selectedWeek}
                selectedCourse={selectedCourse}
                onWeekChange={setSelectedWeek}
                onCourseChange={setSelectedCourse}
              />

              <CATStatsCards cats={filteredCATs} />

              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-800">
                      Cats - Week {selectedWeek}
                      {selectedCourse && ` (${selectedCourse})`}
                    </h2>
                    <p className="text-sm text-gray-600 mt-1">
                      {filteredCATs.length} cat{filteredCATs.length !== 1 ? 's' : ''} found
                    </p>
                  </div>
                  <button 
                    onClick={handleCreateNew}
                    className="bg-rose-500 text-white px-4 py-2 rounded-lg hover:bg-rose-600 transition-colors flex items-center"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    New Cat
                  </button>
                </div>

                {filteredCATs.length === 0 ? (
                  <div className="text-center py-12">
                    <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-600 mb-2">
                      No cats found
                    </h3>
                    <p className="text-gray-500 mb-4">
                      {selectedCourse 
                        ? `No cats for ${selectedCourse} in Week ${selectedWeek}` 
                        : `No cats scheduled for Week ${selectedWeek}`
                      }
                    </p>
                    <button 
                      onClick={handleCreateNew}
                      className="bg-rose-500 text-white px-6 py-3 rounded-lg hover:bg-rose-600 transition-colors inline-flex items-center"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Create Cat
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredCATs.map((cat, index) => (
                      <CATCard
                        key={cat.id}
                        cat={cat}
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


        <CreateCatModal
       
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setEditingCat(null);
          }}
          onSubmit={handleSaveACat}
          selectedWeek={selectedWeek}
          selectedCourse={selectedCourse}
        />
      </motion.div>
    </div>
  );
};

export default page;