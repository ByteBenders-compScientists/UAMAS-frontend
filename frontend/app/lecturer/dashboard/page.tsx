'use client'
import React, { useState, useEffect } from 'react';
import Sidebar from '@/components/lecturerSidebar';
import {useLayout} from '@/components/LayoutController';
import { 
  BookMarked, BarChart3, Clock, Monitor, Loader, Plus, Star, User, 
  Users, Bell, Menu, X, LetterText, ChevronDown, ChevronUp, GraduationCap,
  FileText, MessageSquare, Library, Settings, Upload, Image, Calendar,
  File, CheckCircle, AlertCircle, BookOpen, ChevronRight, Download,
  MessageCircle, Book
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

// ===== CONSTANTS =====
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

const SAMPLE_ASSIGNMENTS: Assignment[] = [
  {
    id: '1',
    title: 'Data Structures Project',
    course: 'CS201',
    dueDate: '2025-02-15',
    status: 'Active',
    submissions: 45,
    totalStudents: 132,
    week: 2,
    type: 'assignment',
    files: [{ name: 'project_guidelines.pdf', size: 1024 }] as unknown as File[]
  },
  {
    id: '2',
    title: 'Database Design Task',
    course: 'CS202',
    dueDate: '2025-02-18',
    status: 'Pending Review',
    submissions: 120,
    totalStudents: 132,
    week: 2,
    type: 'task'
  }
];

const SAMPLE_CATS: CAT[] = [
  {
    id: '1',
    title: 'Midterm Assessment',
    course: 'CS201',
    date: '2025-03-01',
    status: 'Scheduled',
    duration: '2',
    week: 4,
    files: [{ name: 'sample_questions.pdf', size: 2048 }] as unknown as File[]
  }
];

// ===== UTILITY FUNCTIONS =====
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

// ===== COMPONENTS =====
const SidebarHeader: React.FC<{ onClose: () => void }> = ({ onClose }) => (
  <div className="flex items-center justify-between p-6 border-b border-rose-200">
    <div className="flex items-center space-x-2 text-xl font-bold">
      <LetterText className="w-6 h-6 text-rose-600" />
      <span className="text-white">EduPortal</span>
    </div>
    <button 
      className="lg:hidden text-white hover:text-rose-100 transition-colors"
      onClick={onClose}
      aria-label="Close sidebar"
    >
      <X className="w-6 h-6" />
    </button>
  </div>
);

// ===== TOP HEADER COMPONENT =====
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
      <span className="text-xl font-bold text-emerald-600 hidden lg:inline">EduPortal</span>
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

const UserProfile: React.FC = () => (
  <div className="flex p-6 items-center space-x-3 text-sm border-b border-emerald-300 font-medium">
    <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center overflow-hidden">
      <div className="w-8 h-8 bg-emerald-200 rounded-full flex items-center justify-center">
        <User className="w-4 h-4 text-rose-600" />
      </div>
    </div>
    <div className="text-white">
      <div className="font-semibold">Dr. Alex Kimani</div>
      <div className="text-xs opacity-80">Senior Lecturer</div>
    </div>
  </div>
);

const NavigationDropdown: React.FC<{
  items: DropdownItem[];
  isOpen: boolean;
  onItemClick: (path: string) => void;
}> = ({ items, isOpen, onItemClick }) => {
  if (!isOpen) return null;

  return (
    <div className="ml-8 mt-2 space-y-1">
      {items.map((item, index) => (
        <Link
          key={index}
          href={item.path}
          className="w-full text-left block p-2 text-sm font-medium rounded-lg hover:bg-rose-300 hover:bg-opacity-50 transition-all duration-200 text-white flex items-center"
        >
          {item.icon && <item.icon className="w-4 h-4 mr-2" />}
          {item.label}
        </Link>
      ))}
    </div>
  );
};

const NavigationItemComponent: React.FC<{
  item: NavigationItem;
  isDropdownOpen: boolean;
  onDropdownToggle: () => void;
  onDropdownItemClick: (path: string) => void;
}> = ({ item, isDropdownOpen, onDropdownToggle, onDropdownItemClick }) => {
  if (item.hasDropdown) {
    return (
      <div>
        <button
          onClick={onDropdownToggle}
          className={`w-full flex items-center justify-between space-x-3 p-3 rounded-lg transition-all duration-200 ${
            item.active 
              ? 'bg-white text-rose-500 shadow-sm' 
              : 'hover:bg-rose-300 hover:bg-opacity-50 text-white'
          }`}
          aria-expanded={isDropdownOpen}
        >
          <div className="flex items-center space-x-3">
            <item.icon className="w-5 h-5" />
            <span className="text-sm font-medium">{item.label}</span>
          </div>
          {isDropdownOpen ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </button>
        
        <NavigationDropdown 
          items={item.dropdownItems || []} 
          isOpen={isDropdownOpen}
          onItemClick={onDropdownItemClick}
        />
      </div>
    );
  }

  return (
    <Link 
      href={item.path || "#"} 
      className={`flex items-center justify-between space-x-3 p-3 rounded-lg transition-all duration-200 ${
        item.active 
          ? 'bg-white text-rose-500 shadow-sm' 
          : 'hover:bg-rose-300 hover:bg-opacity-50 text-white'
      }`}
    >
      <div className="flex items-center space-x-3">
        <item.icon className="w-5 h-5" />
        <span className="text-sm font-medium">{item.label}</span>
      </div>
      {item.count && (
        <span className="bg-white text-rose-500 text-xs font-bold px-2 py-1 rounded-full min-w-[20px] text-center">
          {item.count}
        </span>
      )}
    </Link>
  );
};

// ... (keep all other components the same as before)

interface StatsCardProps {
  stat: StatData;
}

const CreateFormButtons: React.FC<CreateFormButtonsProps> = ({ onFormSelect }) => (
  <div className="space-y-4 mb-6">
    <h3 className="text-lg font-semibold text-gray-800">Create New Content</h3>
    
    {/* Assignment Creation Options */}
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
      <h4 className="font-medium text-gray-700 mb-3 flex items-center">
        <FileText className="w-5 h-5 mr-2 text-rose-500" />
        Create Assignment
      </h4>
      <div className="flex flex-wrap gap-3">
        <button
          className="flex items-center bg-rose-500 text-white px-4 py-2 rounded-lg hover:bg-rose-600 transition-colors"
          onClick={() => onFormSelect('assignment', 'manual')}
        >
          <Edit3 className="w-4 h-4 mr-2" />
          Manual Creation
        </button>
        <button
          className="flex items-center bg-gradient-to-r from-purple-500 to-indigo-500 text-white px-4 py-2 rounded-lg hover:from-purple-600 hover:to-indigo-600 transition-colors"
          onClick={() => onFormSelect('assignment', 'ai')}
        >
          <Bot className="w-4 h-4 mr-2" />
          AI-Assisted Creation
        </button>
      </div>
    </div>

    {/* CAT Creation Options */}
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
      <h4 className="font-medium text-gray-700 mb-3 flex items-center">
        <Calendar className="w-5 h-5 mr-2 text-blue-500" />
        Create CAT
      </h4>
      <div className="flex flex-wrap gap-3">
        <button
          className="flex items-center bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
          onClick={() => onFormSelect('cat', 'manual')}
        >
          <Edit3 className="w-4 h-4 mr-2" />
          Manual Creation
        </button>
        <button
          className="flex items-center bg-gradient-to-r from-purple-500 to-indigo-500 text-white px-4 py-2 rounded-lg hover:from-purple-600 hover:to-indigo-600 transition-colors"
          onClick={() => onFormSelect('cat', 'ai')}
        >
          <Bot className="w-4 h-4 mr-2" />
          AI-Assisted Creation
        </button>
      </div>
    </div>

    {/* Task Creation Options */}
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
      <h4 className="font-medium text-gray-700 mb-3 flex items-center">
        <Users className="w-5 h-5 mr-2 text-yellow-500" />
        Create Task
      </h4>
      <div className="flex flex-wrap gap-3">
        <button
          className="flex items-center bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition-colors"
          onClick={() => onFormSelect('task', 'manual')}
        >
          <Edit3 className="w-4 h-4 mr-2" />
          Manual Creation
        </button>
        <button
          className="flex items-center bg-gradient-to-r from-purple-500 to-indigo-500 text-white px-4 py-2 rounded-lg hover:from-purple-600 hover:to-indigo-600 transition-colors"
          onClick={() => onFormSelect('task', 'ai')}
        >
          <Bot className="w-4 h-4 mr-2" />
          AI-Assisted Creation
        </button>
      </div>
    </div>
  </div>
);

// AI Prompt Form Component
interface AIPromptFormProps {
  type: 'assignment' | 'task' | 'cat';
  onGenerate: (prompt: string, preferences: any) => void;
  onCancel: () => void;
}

const AIPromptForm: React.FC<AIPromptFormProps> = ({ type, onGenerate, onCancel }) => {
  const [prompt, setPrompt] = useState('');
  const [difficulty, setDifficulty] = useState('medium');
  const [duration, setDuration] = useState('1');
  const [questionCount, setQuestionCount] = useState('10');
  const [topics, setTopics] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    
    setIsGenerating(true);
    
    // Simulate AI generation delay
    setTimeout(() => {
      onGenerate(prompt, {
        difficulty,
        duration,
        questionCount,
        topics: topics.split(',').map(t => t.trim()).filter(t => t)
      });
      setIsGenerating(false);
    }, 2000);
  };

  const getTypeSpecificFields = () => {
    switch (type) {
      case 'assignment':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Topics to Cover</label>
              <input
                type="text"
                className="border p-3 w-full rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="e.g., Linear equations, Matrix operations (comma-separated)"
                value={topics}
                onChange={e => setTopics(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Question Count</label>
              <select
                className="border p-3 w-full rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                value={questionCount}
                onChange={e => setQuestionCount(e.target.value)}
              >
                <option value="5">5 Questions</option>
                <option value="10">10 Questions</option>
                <option value="15">15 Questions</option>
                <option value="20">20 Questions</option>
              </select>
            </div>
          </div>
        );
      case 'cat':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Exam Duration (hours)</label>
              <select
                className="border p-3 w-full rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                value={duration}
                onChange={e => setDuration(e.target.value)}
              >
                <option value="1">1 Hour</option>
                <option value="2">2 Hours</option>
                <option value="3">3 Hours</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Question Count</label>
              <select
                className="border p-3 w-full rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                value={questionCount}
                onChange={e => setQuestionCount(e.target.value)}
              >
                <option value="10">10 Questions</option>
                <option value="20">20 Questions</option>
                <option value="30">30 Questions</option>
                <option value="50">50 Questions</option>
              </select>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 lg:p-6 mb-6">
      <div className="flex items-center mb-4">
        <Bot className="w-6 h-6 mr-2 text-purple-500" />
        <h3 className="font-bold text-lg">
          AI-Assisted {type === 'assignment' ? 'Assignment' : type === 'cat' ? 'CAT' : 'Task'} Creation
        </h3>
      </div>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Describe what you want to create
          </label>
          <textarea
            className="border p-3 w-full rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            placeholder={`e.g., Create a ${type} about calculus derivatives for intermediate level students...`}
            value={prompt}
            onChange={e => setPrompt(e.target.value)}
            rows={4}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Difficulty Level</label>
          <select
            className="border p-3 w-full rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            value={difficulty}
            onChange={e => setDifficulty(e.target.value)}
          >
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
            <option value="advanced">Advanced</option>
          </select>
        </div>

        {getTypeSpecificFields()}

        <div className="flex space-x-3 pt-4">
          <button
            onClick={handleGenerate}
            disabled={!prompt.trim() || isGenerating}
            className="flex items-center bg-gradient-to-r from-purple-500 to-indigo-500 text-white px-6 py-2 rounded-lg hover:from-purple-600 hover:to-indigo-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isGenerating ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Generating...
              </>
            ) : (
              <>
                <Bot className="w-4 h-4 mr-2" />
                Generate with AI
              </>
            )}
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

// Main Page Component
const Page: React.FC = () => {
  const [selectedWeek, setSelectedWeek] = useState(2);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [activeForm, setActiveForm] = useState<'assignment' | 'task' | 'cat' | null>(null);
  const [creationMode, setCreationMode] = useState<'manual' | 'ai' | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    dueDate: '',
    duration: '1',
    files: [] as FileItem[]
  });

  // State for quick creation lists
  const [assignmentsList, setAssignmentsList] = useState<string[]>(['Math Assignment 1', 'Science Assignment 2']);
  const [catsList, setCatsList] = useState<string[]>(['Math CAT 1', 'Science CAT 2']);
  const [assignmentDetails, setAssignmentDetails] = useState('');
  const [catDetails, setCATDetails] = useState('');

  const handleFormSelect = (form: 'assignment' | 'task' | 'cat', mode: 'manual' | 'ai') => {
    setActiveForm(form);
    setCreationMode(mode);
  };

  const handleAIGenerate = (prompt: string, preferences: any) => {
    // Here you would typically call your AI service
    console.log('AI Generation requested:', { type: activeForm, prompt, preferences });
    
    // For demo, we'll generate a mock result
    const mockTitle = `AI-Generated ${activeForm} based on: ${prompt.substring(0, 50)}...`;
    const mockDescription = `This ${activeForm} was automatically generated using AI based on your requirements. Difficulty: ${preferences.difficulty}`;
    
    setFormData({
      title: mockTitle,
      description: mockDescription,
      dueDate: '',
      duration: preferences.duration || '1',
      files: []
    });
    
    setCreationMode('manual'); // Switch to manual mode to show the populated form
  };

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
    if (!formData.title || !selectedCourse || !formData.dueDate) return;
    
    console.log('Form submitted:', {
      type: activeForm,
      mode: creationMode,
      ...formData,
      courseId: selectedCourse,
      week: selectedWeek
    });
    
    // Reset form
    setFormData({
      title: '',
      description: '',
      dueDate: '',
      duration: '1',
      files: []
    });
    setActiveForm(null);
    setCreationMode(null);
  };

  const handleCreateAssignment = () => {
    if (assignmentDetails) {
      setAssignmentsList([...assignmentsList, assignmentDetails]);
      setAssignmentDetails('');
    }
  };

  const handleCreateCAT = () => {
    if (catDetails) {
      setCatsList([...catsList, catDetails]);
      setCATDetails('');
    }
  };

  const filteredAssignments = SAMPLE_ASSIGNMENTS.filter(a => a.week === selectedWeek);
  const filteredCATs = SAMPLE_CATS.filter(c => c.week === selectedWeek);

  return (
    <div className="min-h-screen bg-gray-50 p-4 lg:p-6">
      <div className="max-w-7xl mx-auto">
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
        
        {activeForm && creationMode === 'ai' ? (
          <AIPromptForm
            type={activeForm}
            onGenerate={handleAIGenerate}
            onCancel={() => {
              setActiveForm(null);
              setCreationMode(null);
            }}
          />
        ) : activeForm && creationMode === 'manual' ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 lg:p-6 mb-6">
            <h3 className="font-bold text-lg mb-3 flex items-center">
              <Edit3 className="w-5 h-5 mr-2 text-gray-600" />
              Create {activeForm === 'assignment' ? 'Assignment' : activeForm === 'cat' ? 'CAT' : 'Task'} - Manual Mode
            </h3>
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
                rows={3}
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
              <select
                className="border p-3 w-full rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                value={selectedCourse}
                onChange={e => setSelectedCourse(e.target.value)}
              >
                <option value="">Select Course</option>
                {SAMPLE_COURSES.map(course => (
                  <option key={course.id} value={course.id}>{course.name}</option>
                ))}
              </select>
              <select
                className="border p-3 w-full rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                value={selectedWeek}
                onChange={e => setSelectedWeek(Number(e.target.value))}
              >
                {WEEK_OPTIONS.map(week => (
                  <option key={week.value} value={week.value}>{week.label} ({week.dateRange})</option>
                ))}
              </select>
              <div>
                <label className="block font-medium mb-1">Attach Files</label>
                <input
                  type="file"
                  multiple
                  onChange={e => e.target.files && handleFileUpload(e.target.files)}
                />
                <ul className="mt-2 space-y-1">
                  {formData.files.map((file, idx) => (
                    <li key={idx} className="flex items-center space-x-2 text-sm">
                      <span>{file.name} ({formatFileSize(file.size)})</span>
                      <button
                        type="button"
                        className="text-rose-500 hover:text-rose-700"
                        onClick={() => handleRemoveFile(idx)}
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={handleFormSubmit}
                  className="bg-rose-500 text-white px-4 py-2 rounded-lg hover:bg-rose-600 transition-colors"
                >
                  Submit
                </button>
                <button
                  onClick={() => {
                    setActiveForm(null);
                    setCreationMode(null);
                  }}
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

          {/* Simple Create Forms from the second code snippet */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 lg:p-6">
              <h3 className="font-bold text-lg mb-3">Quick Create Assignment</h3>
              <textarea 
                value={assignmentDetails} 
                onChange={(e) => setAssignmentDetails(e.target.value)} 
                className="border p-3 w-full rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                placeholder="Enter assignment details"
                rows={3}
              />
              <button 
                onClick={handleCreateAssignment} 
                className="mt-3 bg-rose-500 text-white p-2 rounded-lg hover:bg-rose-600 transition-colors w-full"
              >
                Create Assignment
              </button>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 lg:p-6">
              <h3 className="font-bold text-lg mb-3">Quick Create CAT</h3>
              <textarea 
                value={catDetails} 
                onChange={(e) => setCATDetails(e.target.value)} 
                className="border p-3 w-full rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                placeholder="Enter CAT details"
                rows={3}
              />
              <button 
                onClick={handleCreateCAT} 
                className="mt-3 bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition-colors w-full"
              >
                Create CAT
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-6">
            {STATS_DATA.map((stat, index) => (
              <StatsCard key={index} stat={stat} />
            ))}
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <AssignmentsCard assignments={filteredAssignments} />
            <CATsCard cats={filteredCATs} />
          </div>

          {/* Simple Lists from the second code snippet */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 lg:p-6">
              <h2 className="text-lg font-bold mb-4">Current Assignments List</h2>
              <ul className="space-y-2">
                {assignmentsList.map((assignment, index) => (
                  <li key={index} className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                    {assignment}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 lg:p-6">
              <h2 className="text-lg font-bold mb-4">Current CATs List</h2>
              <ul className="space-y-2">
                {catsList.map((cat, index) => (
                  <li key={index} className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                    {cat}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default page;