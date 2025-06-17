"use client"

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLayout } from '@/components/LayoutController';
import Sidebar from '@/components/lecturerSidebar';
import Header from '@/components/Header';
import EmptyState from '@/components/EmptyState';
import { 
  BookMarked, Plus, CheckCircle, Wand2, User, Eye, Trash2,
  ClipboardList, FileCheck, AlertCircle, Loader2, CalendarDays, Timer
} from 'lucide-react';

// ===== TYPES =====
interface Assessment {
  id: string;
  title: string;
  description: string;
  type: 'CAT' | 'assignment';
  unit: string;
  course_id: string;
  questions_type: 'open-ended' | 'close-ended';
  topic: string;
  total_marks: number;
  difficulty: 'easy' | 'intermediate' | 'hard';
  number_of_questions: number;
  verified: boolean;
  created_at: string;
  creator_id: string;
  status?: string;
}

interface Question {
  id: string;
  text: string;
  marks: number;
  type: 'open-ended' | 'close-ended';
  rubric: string;
  correct_answer: string;
  assessment_id: string;
  created_at: string;
}

interface Course {
  id: string;
  name: string;
  code: string;
  color: string;
}

// ===== SAMPLE DATA =====
const SAMPLE_COURSES: Course[] = [
  { id: 'f2c62aba-b9fd-466b-afe4-a360c4be4bb4', name: 'Computer Science 201', code: 'CS201', color: 'bg-rose-500' },
  { id: '2', name: 'Computer Science 301', code: 'CS301', color: 'bg-blue-500' },
  { id: '3', name: 'Database Management', code: 'CS202', color: 'bg-purple-500' },
  { id: '4', name: 'Operating Systems', code: 'CS203', color: 'bg-green-500' },
  { id: '5', name: 'Software Engineering', code: 'CS302', color: 'bg-yellow-500' }
];

const INITIAL_ASSESSMENTS: Assessment[] = [
  {
    id: 'fa253cf4-77fa-46e7-9634-ce922cbe47b4',
    title: 'Data Structures',
    description: 'This assessment covers stacks, queues, and trees.',
    type: 'assignment',
    unit: 'CSC2201',
    course_id: 'f2c62aba-b9fd-466b-afe4-a360c4be4bb4',
    questions_type: 'open-ended',
    topic: 'Trees and Graphs',
    total_marks: 30,
    difficulty: 'intermediate',
    number_of_questions: 15,
    verified: true,
    created_at: '2025-05-26T16:24:08.075025',
    creator_id: 'eb93908e-8a2f-4c3a-9eb2-4cd429d90c6b'
  },
  {
    id: 'f2335e03-ec05-4742-b98b-ecc5d562b2c9',
    title: 'Introduction to AI Quiz',
    description: 'Quiz on basic AI concepts',
    type: 'CAT',
    unit: 'AI101',
    course_id: 'f2c62aba-b9fd-466b-afe4-a360c4be4bb4',
    questions_type: 'close-ended',
    topic: 'History and Applications of AI',
    total_marks: 20,
    difficulty: 'easy',
    number_of_questions: 5,
    verified: true,
    created_at: '2025-05-25T10:30:00.000000',
    creator_id: 'eb93908e-8a2f-4c3a-9eb2-4cd429d90c6b'
  }
];

// ===== UTILITY FUNCTIONS =====
const formatDate = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

const getCourseByCode = (courseId: string) => {
  return SAMPLE_COURSES.find(course => course.id === courseId) || SAMPLE_COURSES[0];
};

const getDifficultyColor = (difficulty: string) => {
  switch (difficulty) {
    case 'easy': return 'bg-green-100 text-green-700';
    case 'intermediate': return 'bg-yellow-100 text-yellow-700';
    case 'hard': return 'bg-red-100 text-red-700';
    default: return 'bg-gray-100 text-gray-700';
  }
};

// ===== COMPONENTS =====
const CreateAssessmentModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any, isAI: boolean) => void;
  loading: boolean;
}> = ({ isOpen, onClose, onSubmit, loading }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'CAT',
    unit: '',
    course_id: '',
    questions_type: 'close-ended',
    topic: '',
    total_marks: 20,
    difficulty: 'intermediate',
    number_of_questions: 5
  });

  const handleSubmit = (isAI: boolean) => {
    onSubmit(formData, isAI);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-xl max-w-2xl w-full max-h-screen overflow-y-auto"
      >
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">Create New Assessment</h2>
          <p className="text-gray-600 mt-1">Generate with AI or create manually</p>
        </div>

        <div className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                placeholder="Assessment title"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
              <select
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                value={formData.type}
                onChange={(e) => setFormData({...formData, type: e.target.value})}
              >
                <option value="CAT">CAT</option>
                <option value="assignment">Assignment</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-rose-500 focus:border-transparent"
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              placeholder="Assessment description"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Unit Code</label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                value={formData.unit}
                onChange={(e) => setFormData({...formData, unit: e.target.value})}
                placeholder="e.g., CSC2201"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Course</label>
              <select
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                value={formData.course_id}
                onChange={(e) => setFormData({...formData, course_id: e.target.value})}
              >
                <option value="">Select Course</option>
                {SAMPLE_COURSES.map(course => (
                  <option key={course.id} value={course.id}>{course.name} ({course.code})</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Question Type</label>
              <select
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                value={formData.questions_type}
                onChange={(e) => setFormData({...formData, questions_type: e.target.value})}
              >
                <option value="close-ended">Close-ended</option>
                <option value="open-ended">Open-ended</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Difficulty</label>
              <select
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                value={formData.difficulty}
                onChange={(e) => setFormData({...formData, difficulty: e.target.value})}
              >
                <option value="easy">Easy</option>
                <option value="intermediate">Intermediate</option>
                <option value="hard">Hard</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Topic</label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-rose-500 focus:border-transparent"
              value={formData.topic}
              onChange={(e) => setFormData({...formData, topic: e.target.value})}
              placeholder="Main topic or subject area"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Total Marks</label>
              <input
                type="number"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                value={formData.total_marks}
                onChange={(e) => setFormData({...formData, total_marks: parseInt(e.target.value)})}
                min="1"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Number of Questions</label>
              <input
                type="number"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                value={formData.number_of_questions}
                onChange={(e) => setFormData({...formData, number_of_questions: parseInt(e.target.value)})}
                min="1"
              />
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-gray-200 flex justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium"
            disabled={loading}
          >
            Cancel
          </button>
          <div className="flex space-x-3">
            <button
              onClick={() => handleSubmit(false)}
              disabled={loading}
              className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <User className="w-4 h-4 mr-2" />}
              Create Manually
            </button>
            <button
              onClick={() => handleSubmit(true)}
              disabled={loading}
              className="flex items-center px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Wand2 className="w-4 h-4 mr-2" />}
              Generate with AI
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

const AddQuestionModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (questionData: any) => void;
  assessmentId: string;
  loading: boolean;
}> = ({ isOpen, onClose, onSubmit, assessmentId, loading }) => {
  const [questionData, setQuestionData] = useState({
    text: '',
    marks: 4,
    type: 'close-ended',
    rubric: '',
    correct_answer: ''
  });

  const handleSubmit = () => {
    onSubmit(questionData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-xl max-w-lg w-full"
      >
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">Add Question</h2>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Question Text</label>
            <textarea
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-rose-500 focus:border-transparent"
              rows={3}
              value={questionData.text}
              onChange={(e) => setQuestionData({...questionData, text: e.target.value})}
              placeholder="Enter your question"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Marks</label>
              <input
                type="number"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                value={questionData.marks}
                onChange={(e) => setQuestionData({...questionData, marks: parseInt(e.target.value)})}
                min="1"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
              <select
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                value={questionData.type}
                onChange={(e) => setQuestionData({...questionData, type: e.target.value})}
              >
                <option value="close-ended">Close-ended</option>
                <option value="open-ended">Open-ended</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Rubric</label>
            <textarea
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-rose-500 focus:border-transparent"
              rows={2}
              value={questionData.rubric}
              onChange={(e) => setQuestionData({...questionData, rubric: e.target.value})}
              placeholder="Marking criteria and rubric"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Correct Answer</label>
            <textarea
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-rose-500 focus:border-transparent"
              rows={2}
              value={questionData.correct_answer}
              onChange={(e) => setQuestionData({...questionData, correct_answer: e.target.value})}
              placeholder="Expected answer or answer key"
            />
          </div>
        </div>

        <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="flex items-center px-4 py-2 bg-rose-500 text-white rounded-lg hover:bg-rose-600 disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Plus className="w-4 h-4 mr-2" />}
            Add Question
          </button>
        </div>
      </motion.div>
    </div>
  );
};

const AssessmentStatsCards: React.FC<{ assessments: Assessment[] }> = ({ assessments }) => {
  const totalAssessments = assessments.length;
  const catAssessments = assessments.filter(a => a.type === 'CAT').length;
  const assignmentAssessments = assessments.filter(a => a.type === 'assignment').length;
  const verifiedAssessments = assessments.filter(a => a.verified).length;

  const statsData = [
    { icon: BookMarked, label: 'Total Assessments', value: totalAssessments.toString(), color: 'bg-blue-100 text-blue-600' },
    { icon: ClipboardList, label: 'CATs', value: catAssessments.toString(), color: 'bg-green-100 text-green-600' },
    { icon: FileCheck, label: 'Assignments', value: assignmentAssessments.toString(), color: 'bg-purple-100 text-purple-600' },
    { icon: CheckCircle, label: 'Verified', value: verifiedAssessments.toString(), color: 'bg-yellow-100 text-yellow-600' }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-6">
      {statsData.map((stat, index) => (
        <motion.div 
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex items-center space-x-4"
        >
          <div className={`p-2 rounded-full ${stat.color}`}>
            <stat.icon className="w-6 h-6" />
          </div>
          <div>
            <div className="text-lg font-bold">{stat.value}</div>
            <div className="text-sm text-gray-500">{stat.label}</div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

const TypeAndCourseSelector: React.FC<{
  selectedType: string;
  selectedCourse: string;
  onTypeChange: (type: string) => void;
  onCourseChange: (courseId: string) => void;
}> = ({ selectedType, selectedCourse, onTypeChange, onCourseChange }) => (
  <div className="flex flex-col md:flex-row md:space-x-4 mb-6 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
    <div className="flex-1 mb-3 md:mb-0">
      <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Type</label>
      <select
        className="border border-gray-300 p-3 w-full rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent bg-white"
        value={selectedType}
        onChange={e => onTypeChange(e.target.value)}
      >
        <option value="">All Types</option>
        <option value="CAT">CATs</option>
        <option value="assignment">Assignments</option>
      </select>
    </div>
    <div className="flex-1">
      <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Course</label>
      <select
        className="border border-gray-300 p-3 w-full rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent bg-white"
        value={selectedCourse}
        onChange={e => onCourseChange(e.target.value)}
      >
        <option value="">All Courses</option>
        {SAMPLE_COURSES.map(course => (
          <option key={course.id} value={course.id}>{course.name} ({course.code})</option>
        ))}
      </select>
    </div>
  </div>
);

const AssessmentCard: React.FC<{
  assessment: Assessment;
  onView: (assessment: Assessment) => void;
  onEdit: (assessment: Assessment) => void;
  onDelete: (id: string) => void;
  onAddQuestion: (assessment: Assessment) => void;
  onVerify: (id: string) => void;
  index: number;
}> = ({ assessment, onView, onEdit, onDelete, onAddQuestion, onVerify, index }) => {
  const course = getCourseByCode(assessment.course_id);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow"
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-800 mb-1">{assessment.title}</h3>
          <div className="flex items-center space-x-2 mb-2">
            <span className={`inline-block w-3 h-3 rounded-full ${course.color}`}></span>
            <span className="text-sm text-gray-600">{assessment.unit}</span>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getDifficultyColor(assessment.difficulty)}`}>
            {assessment.difficulty}
          </span>
          {assessment.verified ? (
            <CheckCircle className="w-5 h-5 text-green-500" />
          ) : (
            <AlertCircle className="w-5 h-5 text-yellow-500" />
          )}
        </div>
      </div>

      <p className="text-sm text-gray-600 mb-4 line-clamp-2">{assessment.description}</p>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="text-sm">
          <span className="text-gray-500">Questions:</span>
          <span className="ml-2 font-medium">{assessment.number_of_questions}</span>
        </div>
        <div className="text-sm">
          <span className="text-gray-500">Marks:</span>
          <span className="ml-2 font-medium">{assessment.total_marks}</span>
        </div>
        <div className="text-sm">
          <span className="text-gray-500">Type:</span>
          <span className="ml-2 font-medium capitalize">{assessment.questions_type}</span>
        </div>
        <div className="text-sm">
          <span className="text-gray-500">Topic:</span>
          <span className="ml-2 font-medium">{assessment.topic}</span>
        </div>
      </div>

      <div className="flex justify-between items-center pt-4 border-t border-gray-100">
        <span className="text-xs text-gray-500">
          Created {formatDate(assessment.created_at)}
        </span>
        <div className="flex space-x-2">
          <button
            onClick={() => onView(assessment)}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium px-3 py-1 rounded border border-blue-200 hover:bg-blue-50 transition-colors"
          >
            View
          </button>
          <button
            onClick={() => onAddQuestion(assessment)}
            className="text-green-600 hover:text-green-800 text-sm font-medium px-3 py-1 rounded border border-green-200 hover:bg-green-50 transition-colors"
          >
            Add Q
          </button>
          {!assessment.verified && (
            <button
              onClick={() => onVerify(assessment.id)}
              className="text-purple-600 hover:text-purple-800 text-sm font-medium px-3 py-1 rounded border border-purple-200 hover:bg-purple-50 transition-colors"
            >
              Verify
            </button>
          )}
          <button
            onClick={() => onDelete(assessment.id)}
            className="text-red-600 hover:text-red-800 text-sm font-medium px-3 py-1 rounded border border-red-200 hover:bg-red-50 transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </motion.div>
  );
};

// ===== MAIN COMPONENT =====
const AssessmentsDashboard: React.FC = () => { 
  const { sidebarCollapsed, isMobileView, isTabletView } = useLayout();
  const [loading, setLoading] = useState(true);
  const [hasContent, setHasContent] = useState(false);
  const [assessments, setAssessments] = useState<Assessment[]>(INITIAL_ASSESSMENTS);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isQuestionModalOpen, setIsQuestionModalOpen] = useState(false);
  const [selectedAssessment, setSelectedAssessment] = useState<Assessment | null>(null);
  const [selectedType, setSelectedType] = useState<string>('');
  const [selectedCourse, setSelectedCourse] = useState<string>('');
  const [createLoading, setCreateLoading] = useState(false);
  const [questionLoading, setQuestionLoading] = useState(false);

  // Filter assessments by type and course
  const filteredAssessments = assessments.filter(assessment => 
    (selectedType === '' || assessment.type === selectedType) &&
    (selectedCourse === '' || assessment.course_id === selectedCourse)
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
      setHasContent(INITIAL_ASSESSMENTS.length > 0);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const handleCreateAssessment = async (formData: any, isAI: boolean) => {
    setCreateLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      const newAssessment: Assessment = {
        ...formData,
        id: Math.random().toString(36).substr(2, 9),
        verified: !isAI, // Manual assessments are verified by default
        created_at: new Date().toISOString(),
        creator_id: 'current-lecturer-id'
      };
      
      setAssessments(prev => [...prev, newAssessment]);
      setIsCreateModalOpen(false);
      setCreateLoading(false);
      
      if (isAI) {
        alert(`Assessment "${formData.title}" generated successfully with AI!`);
      } else {
        alert(`Assessment "${formData.title}" created successfully!`);
      }
    }, 2000);
  };

  const handleAddQuestion = async (questionData: any) => {
    setQuestionLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsQuestionModalOpen(false);
      setQuestionLoading(false);
      alert('Question added successfully!');
    }, 1000);
  };

  const handleVerifyAssessment = async (assessmentId: string) => {
    setAssessments(prev => prev.map(assessment => 
      assessment.id === assessmentId 
        ? { ...assessment, verified: true }
        : assessment
    ));
    alert('Assessment verified successfully!');
  };

  const handleDeleteAssessment = (assessmentId: string) => {
    if (confirm('Are you sure you want to delete this assessment?')) {
      setAssessments(prev => prev.filter(assessment => assessment.id !== assessmentId));
    }
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
          <Header title="Assessments" showWeekSelector={false} />
          
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
        <Header title="Assessments" showWeekSelector={hasContent} />
        
        <main className="p-4 md:p-6">
          {!hasContent ? (
            <div className="max-w-4xl mx-auto">
              <EmptyState
                title="No Assessments Created"
                description="Create your first assessment to get started. You can generate assessments with AI or create them manually with custom questions."
                icon={<BookMarked size={48} />}
                onAction={() => setIsCreateModalOpen(true)}
              />
            </div>
          ) : (
            <div className="max-w-7xl mx-auto">
              <div className="mb-6">
                <h1 className="text-2xl lg:text-3xl font-bold text-gray-800">Assessment Management</h1>
                <p className="text-gray-600 mt-2">Create, manage, and organize your assessments</p>
              </div>

              <TypeAndCourseSelector 
                selectedType={selectedType}
                selectedCourse={selectedCourse}
                onTypeChange={setSelectedType}
                onCourseChange={setSelectedCourse}
              />

              <AssessmentStatsCards assessments={filteredAssessments} />

              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-800">
                      Assessments
                      {selectedType && ` - ${selectedType === 'CAT' ? 'CATs' : 'Assignments'}`}
                      {selectedCourse && ` (${getCourseByCode(selectedCourse).code})`}
                    </h2>
                    <p className="text-sm text-gray-600 mt-1">
                      {filteredAssessments.length} assessment{filteredAssessments.length !== 1 ? 's' : ''} found
                    </p>
                  </div>
                  <button 
                    onClick={() => setIsCreateModalOpen(true)}
                    className="bg-rose-500 text-white px-4 py-2 rounded-lg hover:bg-rose-600 transition-colors flex items-center"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    New Assessment
                  </button>
                </div>

                {filteredAssessments.length === 0 ? (
                  <div className="text-center py-12">
                    <BookMarked className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-600 mb-2">
                      No assessments found
                    </h3>
                    <p className="text-gray-500 mb-4">
                      {selectedType || selectedCourse 
                        ? `No assessments match your current filters` 
                        : `Create your first assessment to get started`
                      }
                    </p>
                    <button 
                      onClick={() => setIsCreateModalOpen(true)}
                      className="bg-rose-500 text-white px-6 py-3 rounded-lg hover:bg-rose-600 transition-colors inline-flex items-center"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Create Assessment
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredAssessments.map((assessment, index) => (
                      <AssessmentCard
                        key={assessment.id}
                        assessment={assessment}
                        index={index}
                        onView={(assessment) => console.log('View:', assessment)}
                        onEdit={(assessment) => console.log('Edit:', assessment)}
                        onDelete={handleDeleteAssessment}
                        onAddQuestion={(assessment) => {
                          setSelectedAssessment(assessment);
                          setIsQuestionModalOpen(true);
                        }}
                        onVerify={handleVerifyAssessment}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </main>
      </motion.div>

      {/* Create Assessment Modal */}
      <CreateAssessmentModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateAssessment}
        loading={createLoading}
      />

      {/* Add Question Modal */}
      <AddQuestionModal
        isOpen={isQuestionModalOpen}
        onClose={() => setIsQuestionModalOpen(false)}
        onSubmit={handleAddQuestion}
        assessmentId={selectedAssessment?.id || ''}
        loading={questionLoading}
      />
    </div>
  );
};

export default AssessmentsDashboard;