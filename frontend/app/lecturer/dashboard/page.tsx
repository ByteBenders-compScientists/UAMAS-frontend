'use client'
import React, { useState, useEffect } from 'react';
import Sidebar from '@/components/lecturerSidebar';
import {useLayout} from '@/components/LayoutController';
import { 
  BookMarked, BarChart3, Clock, Monitor, Loader, Plus, Star, User, 
  Users, Bell, Menu, X, LetterText, ChevronDown, ChevronUp, GraduationCap,
  FileText, MessageSquare, Library, Settings, Upload, Image, Calendar,
  File, CheckCircle, AlertCircle, BookOpen, ChevronRight, Download,
  MessageCircle, Book, Sparkles, Wand2, RefreshCw, Save
} from 'lucide-react';
import Link from 'next/link';

// ===== TYPES =====
interface NavigationItem {
  icon: React.ElementType;
  label: string;
  active?: boolean;
  count?: number;
  hasDropdown?: boolean;
  dropdownItems?: DropdownItem[];
  path?: string;
}

interface DropdownItem {
  label: string;
  path: string;
  icon?: React.ElementType;
}

interface StatData {
  icon: React.ElementType;
  label: string;
  value: string;
  change?: number;
}

interface Assignment {
  id: string;
  title: string;
  course: string;
  dueDate: string;
  status: 'Active' | 'Completed' | 'Draft' | 'Pending Review';
  submissions: number;
  totalStudents: number;
  week: number;
  type: 'assignment' | 'task';
  files?: File[];
  description?: string;
  isAiGenerated?: boolean;
}

interface CAT {
  id: string;
  title: string;
  course: string;
  date: string;
  status: 'Scheduled' | 'Completed' | 'Draft';
  duration: string;
  week: number;
  files?: File[];
  description?: string;
  isAiGenerated?: boolean;
}

interface WeekOption {
  value: number;
  label: string;
  dateRange: string;
}

interface Course {
  id: string;
  name: string;
  code: string;
  color: string;
}

interface FileItem {
  name: string;
  size: number;
  type: string;
  lastModified: number;
}

// Sample data
const STATS_DATA: StatData[] = [
  { icon: Users, label: 'Total Students', value: '132', change: 5 },
  { icon: FileText, label: 'Active Assignments', value: '8', change: -2 },
  { icon: Clock, label: 'Pending Reviews', value: '15', change: 3 },
  { icon: BookMarked, label: 'Upcoming CATs', value: '3', change: 0 }
];

const WEEK_OPTIONS: WeekOption[] = Array.from({ length: 15 }, (_, i) => ({
  value: i + 1,
  label: `Week ${i + 1}`,
  dateRange: `Jan ${15 + i * 7} - Jan ${21 + i * 7}`
}));

const SAMPLE_COURSES: Course[] = [
  { id: '1', name: 'Computer Science 201', code: 'CS201', color: 'bg-rose-500' },
  { id: '2', name: 'Computer Science 301', code: 'CS301', color: 'bg-blue-500' },
  { id: '3', name: 'Database Management', code: 'CS202', color: 'bg-purple-500' },
  { id: '4', name: 'Operating Systems', code: 'CS203', color: 'bg-green-500' },
  { id: '5', name: 'Software Engineering', code: 'CS302', color: 'bg-yellow-500' }
];

// AI Generation functions (simulated)
const generateAssignmentContent = async (courseCode: string, topic?: string) => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  const assignments: { [key: string]: { title: string; description: string } } = {
    'CS201': {
      title: 'Binary Search Tree Implementation',
      description: 'Implement a complete binary search tree with insertion, deletion, and traversal methods. Include error handling and optimization for balanced trees. Students should demonstrate understanding of tree algorithms and complexity analysis.',
    },
    'CS202': {
      title: 'Database Normalization Project',
      description: 'Design and normalize a database schema for a library management system. Apply 1NF, 2NF, and 3NF rules. Create ER diagrams and implement the schema using SQL. Include sample data and queries.',
    },
    'CS203': {
      title: 'Process Scheduling Simulation',
      description: 'Create a simulation of different CPU scheduling algorithms (FCFS, SJF, Round Robin). Compare performance metrics and analyze the trade-offs. Implement in C or Python with graphical output.',
    },
    'CS301': {
      title: 'Web Application Security Analysis',
      description: 'Conduct a comprehensive security audit of a web application. Identify vulnerabilities using OWASP Top 10 as reference. Provide detailed report with remediation strategies and secure coding practices.',
    },
    'CS302': {
      title: 'Agile Project Management Case Study',
      description: 'Analyze a real-world software project using Agile methodologies. Create user stories, sprint plans, and retrospective reports. Present findings on team productivity and project success metrics.',
    }
  };
  
  return assignments[courseCode] || {
    title: `Advanced ${courseCode} Project`,
    description: 'Complete a comprehensive project that demonstrates mastery of key concepts covered in this course. Include documentation, testing, and presentation of results.'
  };
};

const generateCATContent = async (courseCode: string, topic?: string) => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  const cats: Record<string, { title: string; description: string }> = {
    'CS201': {
      title: 'Data Structures Midterm Assessment',
      description: 'Comprehensive assessment covering arrays, linked lists, stacks, queues, and trees. Includes both theoretical questions and practical coding problems. Focus on algorithm complexity and implementation details.',
    },
    'CS202': {
      title: 'Database Systems CAT',
      description: 'Assessment on database design principles, SQL queries, normalization, and transaction management. Includes practical database design scenarios and query optimization problems.',
    },
    'CS203': {
      title: 'Operating Systems Concepts Test',
      description: 'Evaluation of understanding in process management, memory allocation, file systems, and concurrency. Includes problem-solving scenarios and system design questions.',
    },
    'CS301': {
      title: 'Advanced Programming Assessment',
      description: 'Test advanced programming concepts including design patterns, software architecture, and system integration. Practical coding challenges and system design problems.',
    },
    'CS302': {
      title: 'Software Engineering Principles CAT',
      description: 'Assessment covering SDLC, project management methodologies, testing strategies, and quality assurance. Case study analysis and methodology comparison required.',
    }
  };
  
  return cats[courseCode] || {
    title: `${courseCode} Knowledge Assessment`,
    description: 'Comprehensive test covering key topics and practical applications from recent coursework. Includes both theoretical and applied problem-solving components.'
  };
};

// Utility functions
const formatDate = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

const getStatusBadgeClass = (status: string): string => {
  const statusClasses: Record<string, string> = {
    'Active': 'bg-green-100 text-green-700',
    'Completed': 'bg-blue-100 text-blue-700',
    'Scheduled': 'bg-yellow-100 text-yellow-700',
    'Draft': 'bg-gray-100 text-gray-700',
    'Pending Review': 'bg-orange-100 text-orange-700'
  };
  return statusClasses[status] || 'bg-gray-100 text-gray-700';
};

const getFileIcon = (fileName: string) => {
  const extension = fileName.split('.').pop()?.toLowerCase();
  if (['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'].includes(extension || '')) {
    return Image;
  }
  if (['pdf'].includes(extension || '')) {
    return FileText;
  }
  return File;
};

const formatFileSize = (bytes: number) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

// Components
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

// Enhanced Create Form with AI Generation
interface EnhancedCreateFormProps {
  activeForm: 'assignment' | 'task' | 'cat' | null;
  formData: any;
  selectedCourse: string;
  selectedWeek: number;
  onFormChange: (field: string, value: string) => void;
  onFormSubmit: () => void;
  onCancel: () => void;
  onFileUpload: (files: FileList) => void;
  onRemoveFile: (index: number) => void;
}

const EnhancedCreateForm: React.FC<EnhancedCreateFormProps> = ({
  activeForm,
  formData,
  selectedCourse,
  selectedWeek,
  onFormChange,
  onFormSubmit,
  onCancel,
  onFileUpload,
  onRemoveFile
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationTopic, setGenerationTopic] = useState('');

  const handleAIGenerate = async () => {
    if (!selectedCourse) {
      alert('Please select a course first');
      return;
    }

    setIsGenerating(true);
    try {
      const courseCode = SAMPLE_COURSES.find(c => c.id === selectedCourse)?.code || '';
      
      if (activeForm === 'cat') {
        const generated = await generateCATContent(courseCode, generationTopic);
        onFormChange('title', generated.title);
        onFormChange('description', generated.description);
      } else {
        const generated = await generateAssignmentContent(courseCode, generationTopic);
        onFormChange('title', generated.title);
        onFormChange('description', generated.description);
      }
    } catch (error) {
      console.error('Generation failed:', error);
      alert('Generation failed. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  if (!activeForm) return null;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 lg:p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-lg">
          {activeForm === 'assignment' && 'Create Assignment'}
          {activeForm === 'cat' && 'Create CAT'}
        </h3>
        <div className="flex items-center space-x-2">
          <Sparkles className="w-4 h-4 text-purple-500" />
          <span className="text-sm text-purple-600 font-medium">AI Enhanced</span>
        </div>
      </div>

      {/* AI Generation Section */}
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-4 rounded-lg mb-4 border border-purple-200">
        <h4 className="font-semibold text-purple-800 mb-2 flex items-center">
          <Wand2 className="w-4 h-4 mr-2" />
          AI Content Generation
        </h4>
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            className="flex-1 border border-purple-200 p-2 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            placeholder="Optional: Enter specific topic or requirements"
            value={generationTopic}
            onChange={(e) => setGenerationTopic(e.target.value)}
          />
          <button
            onClick={handleAIGenerate}
            disabled={isGenerating || !selectedCourse}
            className="bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Generating...</span>
              </>
            ) : (
              <>
                <Wand2 className="w-4 h-4" />
                <span>Generate with AI</span>
              </>
            )}
          </button>
        </div>
        <p className="text-xs text-purple-600 mt-2">
          AI will generate content based on the selected course. You can edit the generated content as needed.
        </p>
      </div>

      <div className="space-y-4">
        <input
          type="text"
          className="border p-3 w-full rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
          placeholder="Title"
          value={formData.title}
          onChange={e => onFormChange('title', e.target.value)}
        />
        <textarea
          className="border p-3 w-full rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
          placeholder="Description"
          value={formData.description}
          onChange={e => onFormChange('description', e.target.value)}
          rows={4}
        />
        <div className="flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0">
          <input
            type="date"
            className="border p-3 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent flex-1"
            value={formData.dueDate}
            onChange={e => onFormChange('dueDate', e.target.value)}
          />
          {activeForm === 'cat' && (
            <input
              type="number"
              min={1}
              className="border p-3 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent w-32"
              placeholder="Duration (hrs)"
              value={formData.duration}
              onChange={e => onFormChange('duration', e.target.value)}
            />
          )}
        </div>
        <div>
          <label className="block font-medium mb-1">Attach Files</label>
          <input
            type="file"
            multiple
            onChange={e => e.target.files && onFileUpload(e.target.files)}
            className="w-full"
          />
          {formData.files && formData.files.length > 0 && (
            <ul className="mt-2 space-y-1">
              {formData.files.map((file: FileItem, idx: number) => (
                <li key={idx} className="flex items-center space-x-2 text-sm">
                  <span>{file.name} ({formatFileSize(file.size)})</span>
                  <button
                    type="button"
                    className="text-rose-500 hover:text-rose-700"
                    onClick={() => onRemoveFile(idx)}
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="flex space-x-3">
          <button
            onClick={onFormSubmit}
            className="bg-rose-500 text-white px-4 py-2 rounded-lg hover:bg-rose-600 transition-colors flex items-center space-x-2"
          >
            <Save className="w-4 h-4" />
            <span>Submit</span>
          </button>
          <button
            onClick={onCancel}
            className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

// Stats Card Component
const StatsCard: React.FC<{ stat: StatData }> = ({ stat }) => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex items-center space-x-4">
    <div className="p-2 rounded-full bg-rose-100 text-rose-600">
      <stat.icon className="w-6 h-6" />
    </div>
    <div>
      <div className="text-lg font-bold">{stat.value}</div>
      <div className="text-sm text-gray-500">{stat.label}</div>
      {typeof stat.change === 'number' && (
        <div className={`text-xs font-semibold mt-1 ${stat.change > 0 ? 'text-green-600' : stat.change < 0 ? 'text-red-600' : 'text-gray-400'}`}>
          {stat.change > 0 && '+'}{stat.change}
        </div>
      )}
    </div>
  </div>
);

// Week and Course Selector
const WeekAndCourseSelector: React.FC<{
  selectedWeek: number;
  selectedCourse: string;
  onWeekChange: (week: number) => void;
  onCourseChange: (courseId: string) => void;
}> = ({ selectedWeek, selectedCourse, onWeekChange, onCourseChange }) => (
  <div className="flex flex-col md:flex-row md:space-x-4 mb-6">
    <div className="flex-1 mb-3 md:mb-0">
      <label className="block text-sm font-medium text-gray-700 mb-1">Select Course</label>
      <select
        className="border p-3 w-full rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
        value={selectedCourse}
        onChange={e => onCourseChange(e.target.value)}
      >
        <option value="">All Courses</option>
        {SAMPLE_COURSES.map(course => (
          <option key={course.id} value={course.id}>{course.name}</option>
        ))}
      </select>
    </div>
    <div className="flex-1">
      <label className="block text-sm font-medium text-gray-700 mb-1">Select Week</label>
      <select
        className="border p-3 w-full rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
        value={selectedWeek}
        onChange={e => onWeekChange(Number(e.target.value))}
      >
        {WEEK_OPTIONS.map(week => (
          <option key={week.value} value={week.value}>{week.label} ({week.dateRange})</option>
        ))}
      </select>
    </div>
  </div>
);

// Create Form Buttons
const CreateFormButtons: React.FC<{
  activeForm: 'assignment' | 'task' | 'cat' | null;
  onFormSelect: (form: 'assignment' | 'task' | 'cat') => void;
}> = ({ onFormSelect }) => (
  <div className="flex flex-wrap gap-4 mb-6">
    <button
      className="bg-emerald-500 text-white px-4 py-2 rounded-lg hover:bg-emerald-600 transition-colors flex items-center space-x-2"
      onClick={() => onFormSelect('assignment')}
    >
      <Plus className="w-4 h-4" />
      <span>Create Assignment</span>
    </button>

    <button
      className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center space-x-2"
      onClick={() => onFormSelect('cat')}
    >
      <Plus className="w-4 h-4" />
      <span>Create CAT</span>
    </button>
  </div>
);

// Quick Create Components
interface QuickCreateProps {
  title: string;
  type: 'assignment' | 'cat';
  value: string;
  onChange: (value: string) => void;
  onCreate: () => void;
  onAIGenerate: () => void;
  isGenerating: boolean;
  selectedCourse: string;
}

const QuickCreateCard: React.FC<QuickCreateProps> = ({
  title,
  type,
  value,
  onChange,
  onCreate,
  onAIGenerate,
  isGenerating,
  selectedCourse
}) => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 lg:p-6">
    <div className="flex items-center justify-between mb-3">
      <h3 className="font-bold text-lg">{title}</h3>
      <div className="flex items-center space-x-1">
        <Sparkles className="w-3 h-3 text-purple-500" />
        <span className="text-xs text-purple-600">AI</span>
      </div>
    </div>
    <textarea 
      value={value} 
      onChange={(e) => onChange(e.target.value)} 
      className="border p-3 w-full rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
      placeholder={`Enter ${type} details or use AI to generate`}
      rows={3}
    />
    <div className="flex space-x-2 mt-3">
      <button 
        onClick={onCreate} 
        className={`flex-1 ${type === 'assignment' ? 'bg-emerald-500 hover:bg-green-600' : 'bg-blue-500 hover:bg-blue-600'} text-white p-2 rounded-lg transition-colors flex items-center justify-center space-x-2`}
      >
        <Plus className="w-4 h-4" />
        <span>Create {type === 'assignment' ? 'Assignment' : 'CAT'}</span>
      </button>
      <button 
        onClick={onAIGenerate}
        disabled={isGenerating || !selectedCourse}
        className="bg-purple-500 text-white p-2 rounded-lg hover:bg-purple-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        title={!selectedCourse ? 'Select a course first' : 'Generate with AI'}
      >
        {isGenerating ? (
          <RefreshCw className="w-4 h-4 animate-spin" />
        ) : (
          <Wand2 className="w-4 h-4" />
        )}
      </button>
    </div>
  </div>
);
// Main Component
const EduPortal: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedWeek, setSelectedWeek] = useState(2);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [activeForm, setActiveForm] = useState<'assignment' | 'task' | 'cat' | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    dueDate: '',
    duration: '1',
    files: [] as FileItem[]
  });

  // Lists for quick create
  const [assignmentsList, setAssignmentsList] = useState<string[]>([]);
  const [catsList, setCatsList] = useState<string[]>([]);
  const [assignmentDetails, setAssignmentDetails] = useState('');
  const [catDetails, setCATDetails] = useState('');
  
  // AI generation states
  const [isGeneratingAssignment, setIsGeneratingAssignment] = useState(false);
  const [isGeneratingCAT, setIsGeneratingCAT] = useState(false);
  const [isGeneratingForm, setIsGeneratingForm] = useState(false);

  const handleFormChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = (files: FileList) => {
    const newFiles = Array.from(files).map(file => ({
      name: file.name,
      size: file.size,
      type: file.type,
      lastModified: file.lastModified
    }));
    setFormData(prev => ({ ...prev, files: [...prev.files, ...newFiles] }));
  };

  const handleRemoveFile = (index: number) => {
    setFormData(prev => {
      const newFiles = [...prev.files];
      newFiles.splice(index, 1);
      return { ...prev, files: newFiles };
    });
  };

  const handleFormSubmit = () => {
    if (!formData.title || !selectedCourse || !formData.dueDate) {
      alert('Please fill in all required fields');
      return;
    }
    
    console.log('Form submitted:', {
      type: activeForm,
      ...formData,
      courseId: selectedCourse,
      week: selectedWeek
    });
    
    // Add to appropriate list
    const courseCode = SAMPLE_COURSES.find(c => c.id === selectedCourse)?.code || 'Unknown';
    const itemText = `${formData.title} (${courseCode}) - ${formData.description}`;
    
    if (activeForm === 'assignment') {
      setAssignmentsList(prev => [...prev, itemText]);
    } else if (activeForm === 'cat') {
      setCatsList(prev => [...prev, itemText]);
    }
    
    // Reset form
    setFormData({
      title: '',
      description: '',
      dueDate: '',
      duration: '1',
      files: []
    });
    setActiveForm(null);
  };

  const handleCreateAssignment = () => {
    if (assignmentDetails.trim()) {
      setAssignmentsList(prev => [...prev, assignmentDetails]);
      setAssignmentDetails('');
    }
  };

  const handleCreateCAT = () => {
    if (catDetails.trim()) {
      setCatsList(prev => [...prev, catDetails]);
      setCATDetails('');
    }
  };

  const handleAIGenerateQuickAssignment = async () => {
    if (!selectedCourse) {
      alert('Please select a course first');
      return;
    }

    setIsGeneratingAssignment(true);
    try {
      const courseCode = SAMPLE_COURSES.find(c => c.id === selectedCourse)?.code || '';
      const generated = await generateAssignmentContent(courseCode);
      setAssignmentDetails(`${generated.title}\n\n${generated.description}`);
    } catch (error) {
      console.error('Generation failed:', error);
      alert('Generation failed. Please try again.');
    } finally {
      setIsGeneratingAssignment(false);
    }
  };

  const handleAIGenerateQuickCAT = async () => {
    if (!selectedCourse) {
      alert('Please select a course first');
      return;
    }

    setIsGeneratingCAT(true);
    try {
      const courseCode = SAMPLE_COURSES.find(c => c.id === selectedCourse)?.code || '';
      const generated = await generateCATContent(courseCode);
      setCATDetails(`${generated.title}\n\n${generated.description}`);
    } catch (error) {
      console.error('Generation failed:', error);
      alert('Generation failed. Please try again.');
    } finally {
      setIsGeneratingCAT(false);
    }
  };

  const handleAIGenerateForm = async () => {
    if (!selectedCourse) {
      alert('Please select a course first');
      return;
    }

    setIsGeneratingForm(true);
    try {
      const courseCode = SAMPLE_COURSES.find(c => c.id === selectedCourse)?.code || '';
      
      if (activeForm === 'cat') {
        const generated = await generateCATContent(courseCode);
        handleFormChange('title', generated.title);
        handleFormChange('description', generated.description);
      } else {
        const generated = await generateAssignmentContent(courseCode);
        handleFormChange('title', generated.title);
        handleFormChange('description', generated.description);
      }
    } catch (error) {
      console.error('Generation failed:', error);
      alert('Generation failed. Please try again.');
    } finally {
      setIsGeneratingForm(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />
      
      <div className="flex-1 flex flex-col lg:ml-64">
        <TopHeader onSidebarToggle={() => setSidebarOpen(true)} />
        
        <main className="flex-1 p-4 lg:p-6 max-w-7xl mx-auto w-full">
          <div className="mb-6">
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-800">Welcome back, Dr. Alex Kimani</h1>
            <p className="text-gray-600 mt-2">Spring 2025 Semester - Here's your course overview today.</p>
          </div>

          <WeekAndCourseSelector 
            selectedWeek={selectedWeek}
            selectedCourse={selectedCourse}
            onWeekChange={setSelectedWeek}
            onCourseChange={setSelectedCourse}
          />
          
          {activeForm ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 lg:p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-lg">
                  {activeForm === 'assignment' && 'Create Assignment'}
                  {activeForm === 'cat' && 'Create CAT'}
                </h3>
                <div className="flex items-center space-x-2">
                  <Sparkles className="w-4 h-4 text-purple-500" />
                  <span className="text-sm text-purple-600 font-medium">AI Enhanced</span>
                </div>
              </div>

              {/* AI Generation Section */}
              <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-4 rounded-lg mb-4 border border-purple-200">
                <h4 className="font-semibold text-purple-800 mb-2 flex items-center">
                  <Wand2 className="w-4 h-4 mr-2" />
                  AI Content Generation
                </h4>
                <div className="flex flex-col sm:flex-row gap-2">
                  <button
                    onClick={handleAIGenerateForm}
                    disabled={isGeneratingForm || !selectedCourse}
                    className="bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                  >
                    {isGeneratingForm ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Generating...</span>
                      </>
                    ) : (
                      <>
                        <Wand2 className="w-4 h-4" />
                        <span>Generate with AI</span>
                      </>
                    )}
                  </button>
                </div>
                <p className="text-xs text-purple-600 mt-2">
                  {!selectedCourse ? 'Please select a course first to enable AI generation.' : 'AI will generate content based on the selected course. You can edit the generated content as needed.'}
                </p>
              </div>

              <div className="space-y-4">
                <input
                  type="text"
                  className="border p-3 w-full rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                  placeholder="Title"
                  value={formData.title}
                  onChange={e => handleFormChange('title', e.target.value)}
                />
                <textarea
                  className="border p-3 w-full rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                  placeholder="Description"
                  value={formData.description}
                  onChange={e => handleFormChange('description', e.target.value)}
                  rows={4}
                />
                <div className="flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0">
                  <input
                    type="date"
                    className="border p-3 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent flex-1"
                    value={formData.dueDate}
                    onChange={e => handleFormChange('dueDate', e.target.value)}
                  />
                  {activeForm === 'cat' && (
                    <input
                      type="number"
                      min={1}
                      className="border p-3 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent w-32"
                      placeholder="Duration (hrs)"
                      value={formData.duration}
                      onChange={e => handleFormChange('duration', e.target.value)}
                    />
                  )}
                </div>
                <div>
                  <label className="block font-medium mb-1">Attach Files</label>
                  <input
                    type="file"
                    multiple
                    onChange={e => e.target.files && handleFileUpload(e.target.files)}
                    className="w-full"
                  />
                  {formData.files && formData.files.length > 0 && (
                    <ul className="mt-2 space-y-1">
                      {formData.files.map((file: FileItem, idx: number) => (
                        <li key={idx} className="flex items-center space-x-2 text-sm">
                          <span>{file.name} ({formatFileSize(file.size)})</span>
                          <button
                            type="button"
                            className="text-rose-500 hover:text-rose-700"
                            onClick={() => handleRemoveFile(idx)}
                          >
                            Remove
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                <div className="flex space-x-3">
                  <button
                    onClick={handleFormSubmit}
                    className="bg-rose-500 text-white px-4 py-2 rounded-lg hover:bg-rose-600 transition-colors flex items-center space-x-2"
                  >
                    <Save className="w-4 h-4" />
                    <span>Submit</span>
                  </button>
                  <button
                    onClick={() => setActiveForm(null)}
                    className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <CreateFormButtons 
              activeForm={activeForm}
              onFormSelect={setActiveForm}
            />
          )}

          {/* Quick Create Cards with AI Generation */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <QuickCreateCard
              title="Quick Create Assignment"
              type="assignment"
              value={assignmentDetails}
              onChange={setAssignmentDetails}
              onCreate={handleCreateAssignment}
              onAIGenerate={handleAIGenerateQuickAssignment}
              isGenerating={isGeneratingAssignment}
              selectedCourse={selectedCourse}
            />
            <QuickCreateCard
              title="Quick Create CAT"
              type="cat"
              value={catDetails}
              onChange={setCATDetails}
              onCreate={handleCreateCAT}
              onAIGenerate={handleAIGenerateQuickCAT}
              isGenerating={isGeneratingCAT}
              selectedCourse={selectedCourse}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-6">
            {STATS_DATA.map((stat, index) => (
              <StatsCard key={index} stat={stat} />
            ))}
          </div>
          
          {/* Current Lists */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 lg:p-6">
              <h2 className="text-lg font-bold mb-4">Current Assignments List</h2>
              <ul className="space-y-2">
                {assignmentsList.length > 0 ? (
                  assignmentsList.map((assignment, index) => (
                    <li key={index} className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                      {assignment}
                    </li>
                  ))
                ) : (
                  <li className="p-3 text-gray-500 text-center">
                    No assignments created yet. Use the buttons above to create your first assignment.
                  </li>
                )}
              </ul>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 lg:p-6">
              <h2 className="text-lg font-bold mb-4">Current CATs List</h2>
              <ul className="space-y-2">
                {catsList.length > 0 ? (
                  catsList.map((cat, index) => (
                    <li key={index} className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                      {cat}
                    </li>
                  ))
                ) : (
                  <li className="p-3 text-gray-500 text-center">
                    No CATs created yet. Use the buttons above to create your first CAT.
                  </li>
                )}
              </ul>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default EduPortal;
