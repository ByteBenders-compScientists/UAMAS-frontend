'use client'
import React, { useState, useEffect } from 'react';
import {useLayout} from '@/components/LayoutController';
import Sidebar from '@/components/lecturerSidebar';
import { 
  BookMarked, BarChart3, Clock, Monitor, Loader, Plus, Star, User, 
  Users, Bell, Menu, X, LetterText, ChevronDown, ChevronUp, GraduationCap,
  FileText, MessageSquare, Library, Settings, Upload, Image, Calendar,
  File, CheckCircle, AlertCircle, BookOpen, ChevronRight, Download,
  MessageCircle, Book, Search, Filter, Pin, Eye, ThumbsUp, Reply,
  Send, Paperclip, Hash, Clock3, UserCheck, TrendingUp
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

interface Forum {
  id: string;
  title: string;
  description: string;
  course: string;
  courseCode: string;
  week: number;
  posts: number;
  participants: number;
  lastActivity: string;
  isPinned: boolean;
  isActive: boolean;
  category: 'general' | 'assignment' | 'exam' | 'project' | 'discussion';
  moderator: string;
}

interface ForumPost {
  id: string;
  forumId: string;
  title: string;
  content: string;
  author: string;
  authorRole: 'lecturer' | 'student';
  timestamp: string;
  replies: number;
  likes: number;
  isSticky: boolean;
  tags: string[];
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

// ===== CONSTANTS =====
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

const SAMPLE_FORUMS: Forum[] = [
  {
    id: '1',
    title: 'General Discussion - Data Structures',
    description: 'General discussion about data structures concepts and implementations',
    course: 'Computer Science 201',
    courseCode: 'CS201',
    week: 2,
    posts: 24,
    participants: 18,
    lastActivity: '2025-02-10T14:30:00Z',
    isPinned: true,
    isActive: true,
    category: 'general',
    moderator: 'Dr. Alex Kimani'
  },
  {
    id: '2',
    title: 'Assignment Help - Project Phase 1',
    description: 'Get help and discuss Assignment 1 requirements and implementation',
    course: 'Computer Science 201',
    courseCode: 'CS201',
    week: 2,
    posts: 12,
    participants: 25,
    lastActivity: '2025-02-09T16:45:00Z',
    isPinned: false,
    isActive: true,
    category: 'assignment',
    moderator: 'Dr. Alex Kimani'
  },
  {
    id: '3',
    title: 'Database Design Discussion',
    description: 'Discuss normalization concepts and database design patterns',
    course: 'Database Management',
    courseCode: 'CS202',
    week: 2,
    posts: 8,
    participants: 15,
    lastActivity: '2025-02-08T10:20:00Z',
    isPinned: false,
    isActive: true,
    category: 'discussion',
    moderator: 'Dr. Alex Kimani'
  },
  {
    id: '4',
    title: 'Midterm Preparation',
    description: 'Prepare for upcoming midterm exams - study materials and Q&A',
    course: 'Computer Science 301',
    courseCode: 'CS301',
    week: 4,
    posts: 35,
    participants: 42,
    lastActivity: '2025-02-11T09:15:00Z',
    isPinned: true,
    isActive: true,
    category: 'exam',
    moderator: 'Dr. Alex Kimani'
  }
];

const SAMPLE_POSTS: ForumPost[] = [
  {
    id: '1',
    forumId: '1',
    title: 'Welcome to Data Structures Discussion',
    content: 'Welcome everyone! This forum is for discussing data structures concepts, sharing resources, and getting help with your studies.',
    author: 'Dr. Alex Kimani',
    authorRole: 'lecturer',
    timestamp: '2025-02-08T09:00:00Z',
    replies: 8,
    likes: 15,
    isSticky: true,
    tags: ['welcome', 'guidelines']
  },
  {
    id: '2',
    forumId: '1',
    title: 'Question about Binary Trees',
    content: 'Can someone explain the difference between a complete and full binary tree?',
    author: 'Student A',
    authorRole: 'student',
    timestamp: '2025-02-10T14:30:00Z',
    replies: 3,
    likes: 5,
    isSticky: false,
    tags: ['binary-trees', 'question']
  }
];

// ===== UTILITY FUNCTIONS =====
const formatDate = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

const getTimeAgo = (dateString: string) => {
  const now = new Date();
  const date = new Date(dateString);
  const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
  
  if (diffInHours < 1) return 'Just now';
  if (diffInHours < 24) return `${diffInHours}h ago`;
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) return `${diffInDays}d ago`;
  return formatDate(dateString);
};

const getCategoryBadgeClass = (category: string): string => {
  const categoryClasses: Record<string, string> = {
    'general': 'bg-blue-100 text-blue-700',
    'assignment': 'bg-green-100 text-green-700',
    'exam': 'bg-red-100 text-red-700',
    'project': 'bg-purple-100 text-purple-700',
    'discussion': 'bg-yellow-100 text-yellow-700'
  };
  return categoryClasses[category] || 'bg-gray-100 text-gray-700';
};

const getCategoryIcon = (category: string) => {
  const categoryIcons: Record<string, React.ElementType> = {
    'general': MessageSquare,
    'assignment': FileText,
    'exam': BookMarked,
    'project': Settings,
    'discussion': Users
  };
  return categoryIcons[category] || MessageSquare;
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

const TopHeader: React.FC<{ onSidebarToggle: () => void }> = ({ onSidebarToggle }) => (
  <header className="flex items-center justify-between px-4 py-4 lg:py-6 bg-white border-b border-gray-200 shadow-sm lg:shadow-none">
    <div className="flex items-center space-x-3">
      <button
        className="lg:hidden text-rose-600 hover:text-rose-800 transition-colors"
        onClick={onSidebarToggle}
        aria-label="Open sidebar"
      >
        <Menu className="w-6 h-6" />
      </button>
      <span className="text-xl font-bold text-rose-600 hidden lg:inline">EduPortal</span>
    </div>
    <div className="flex items-center space-x-4">
      <button className="relative text-gray-500 hover:text-rose-600 transition-colors">
        <Bell className="w-6 h-6" />
        <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-xs rounded-full px-1.5 py-0.5">3</span>
      </button>
      <div className="flex items-center space-x-2">
        <div className="w-8 h-8 bg-rose-200 rounded-full flex items-center justify-center">
          <User className="w-4 h-4 text-rose-600" />
        </div>
        <span className="text-sm font-semibold text-gray-700 hidden md:inline">Dr. Alex Kimani</span>
      </div>
    </div>
  </header>
);

const UserProfile: React.FC = () => (
  <div className="flex p-6 items-center space-x-3 text-sm border-b border-rose-300 font-medium">
    <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center overflow-hidden">
      <div className="w-8 h-8 bg-rose-200 rounded-full flex items-center justify-center">
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

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  navigationItems: NavigationItem[];
  isCreateDropdownOpen: boolean;
  onCreateDropdownToggle: () => void;
  onDropdownItemClick: (path: string) => void;
}



  

interface WeekAndCourseSelectorProps {
  selectedWeek: number;
  selectedCourse: string;
  onWeekChange: (week: number) => void;
  onCourseChange: (courseId: string) => void;
}

const WeekAndCourseSelector: React.FC<WeekAndCourseSelectorProps> = ({
  selectedWeek,
  selectedCourse,
  onWeekChange,
  onCourseChange
}) => (
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

interface ForumCardProps {
  forum: Forum;
  onForumClick: (forumId: string) => void;
}

const ForumCard: React.FC<ForumCardProps> = ({ forum, onForumClick }) => {
  const CategoryIcon = getCategoryIcon(forum.category);
  
  return (
    <div 
      className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 lg:p-6 hover:shadow-md transition-shadow cursor-pointer"
      onClick={() => onForumClick(forum.id)}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-2">
          {forum.isPinned && <Pin className="w-4 h-4 text-rose-500" />}
          <CategoryIcon className="w-5 h-5 text-gray-600" />
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryBadgeClass(forum.category)}`}>
            {forum.category}
          </span>
        </div>
        <span className="text-xs text-gray-500">{forum.courseCode}</span>
      </div>
      
      <h3 className="font-bold text-lg mb-2 text-gray-800">{forum.title}</h3>
      <p className="text-gray-600 text-sm mb-4">{forum.description}</p>
      
      <div className="flex items-center justify-between text-sm text-gray-500">
        <div className="flex items-center space-x-4">
          <span className="flex items-center space-x-1">
            <MessageSquare className="w-4 h-4" />
            <span>{forum.posts} posts</span>
          </span>
          <span className="flex items-center space-x-1">
            <Users className="w-4 h-4" />
            <span>{forum.participants} participants</span>
          </span>
        </div>
        <span className="flex items-center space-x-1">
          <Clock3 className="w-4 h-4" />
          <span>{getTimeAgo(forum.lastActivity)}</span>
        </span>
      </div>
      
      <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between">
        <span className="text-xs text-gray-500">
          Moderator: {forum.moderator}
        </span>
        <div className="flex items-center space-x-2">
          {forum.isActive && (
            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
          )}
          <span className="text-xs text-gray-500">Week {forum.week}</span>
        </div>
      </div>
    </div>
  );
};

interface CreateForumModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (forumData: Partial<Forum>) => void;
  selectedWeek: number;
  selectedCourse: string;
}

const CreateForumModal: React.FC<CreateForumModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  selectedWeek,
  selectedCourse
}) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'general' as Forum['category']
  });

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (!formData.title || !formData.description) return;
    
    const course = SAMPLE_COURSES.find(c => c.id === selectedCourse);
    
    onSubmit({
      ...formData,
      week: selectedWeek,
      course: course?.name || 'General',
      courseCode: course?.code || 'GEN',
      posts: 0,
      participants: 0,
      lastActivity: new Date().toISOString(),
      isPinned: false,
      isActive: true,
      moderator: 'Dr. Alex Kimani'
    });
    
    setFormData({ title: '', description: '', category: 'general' });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-lg max-w-md w-full p-6">
        <h3 className="text-lg font-bold mb-4">Create New Forum</h3>
        <div className="space-y-4">
          <input
            type="text"
            className="border p-3 w-full rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
            placeholder="Forum Title"
            value={formData.title}
            onChange={e => setFormData(prev => ({ ...prev, title: e.target.value }))}
          />
          <textarea
            className="border p-3 w-full rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
            placeholder="Forum Description"
            value={formData.description}
            onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
            rows={3}
          />
          <select
            className="border p-3 w-full rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
            value={formData.category}
            onChange={e => setFormData(prev => ({ ...prev, category: e.target.value as Forum['category'] }))}
          >
            <option value="general">General Discussion</option>
            <option value="assignment">Assignment Help</option>
            <option value="exam">Exam Preparation</option>
            <option value="project">Project Discussion</option>
            <option value="discussion">Course Discussion</option>
          </select>
          <div className="text-sm text-gray-600">
            <p>Week: {selectedWeek}</p>
            <p>Course: {SAMPLE_COURSES.find(c => c.id === selectedCourse)?.name || 'All Courses'}</p>
          </div>
        </div>
        <div className="flex space-x-3 mt-6">
          <button
            onClick={handleSubmit}
            className="bg-rose-500 text-white px-4 py-2 rounded-lg hover:bg-rose-600 transition-colors flex-1"
          >
            Create Forum
          </button>
          <button
            onClick={onClose}
            className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

interface ForumStatsProps {
  forums: Forum[];
}

const ForumStats: React.FC<ForumStatsProps> = ({ forums }) => {
  const totalPosts = forums.reduce((sum, forum) => sum + forum.posts, 0);
  const totalParticipants = forums.reduce((sum, forum) => sum + forum.participants, 0);
  const activeForums = forums.filter(forum => forum.isActive).length;
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex items-center space-x-4">
        <div className="p-2 rounded-full bg-blue-100 text-blue-600">
          <MessageSquare className="w-6 h-6" />
        </div>
        <div>
          <div className="text-lg font-bold">{activeForums}</div>
          <div className="text-sm text-gray-500">Active Forums</div>
        </div>
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex items-center space-x-4">
        <div className="p-2 rounded-full bg-green-100 text-green-600">
          <MessageCircle className="w-6 h-6" />
        </div>
        <div>
          <div className="text-lg font-bold">{totalPosts}</div>
          <div className="text-sm text-gray-500">Total Posts</div>
        </div>
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex items-center space-x-4">
        <div className="p-2 rounded-full bg-purple-100 text-purple-600">
          <Users className="w-6 h-6" />
        </div>
        <div>
          <div className="text-lg font-bold">{totalParticipants}</div>
          <div className="text-sm text-gray-500">Total Participants</div>
        </div>
      </div>
    </div>
  );
};

// ===== MAIN COMPONENT =====
const page: React.FC = () => {
  const { sidebarCollapsed, isMobileView, isTabletView } = useLayout();
  const [createDropdownOpen, setCreateDropdownOpen] = useState(false);
  const [selectedWeek, setSelectedWeek] = useState(2);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [forums, setForums] = useState<Forum[]>(SAMPLE_FORUMS);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);

  
  
  const toggleCreateDropdown = () => setCreateDropdownOpen(!createDropdownOpen);

  const handleDropdownItemClick = (path: string) => {
    console.log('Navigating to:', path);
    setCreateDropdownOpen(false);
  };

  const handleForumClick = (forumId: string) => {
    console.log('Opening forum:', forumId);
    // Navigate to forum detail page
  };

  const handleCreateForum = (forumData: Partial<Forum>) => {
    // Omit 'id' from forumData to avoid overwriting
    const { id, ...rest } = forumData as Forum;
    const newForum: Forum = {
      id: Date.now().toString(),
      ...rest
    };
    setForums(prev => [newForum, ...prev]);
  };

  // Filter forums based on selected week, course, search term, and category
  const filteredForums = forums.filter(forum => {
    const matchesWeek = forum.week === selectedWeek;
    const matchesCourse = !selectedCourse || 
      SAMPLE_COURSES.find(c => c.id === selectedCourse)?.name === forum.course;
    const matchesSearch = forum.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        forum.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || forum.category === categoryFilter;
    return matchesWeek && matchesCourse && matchesSearch && matchesCategory;
    }
    );

    return (

    <div className="flex h-screen bg-gray-100">
      <Sidebar 
        
      />
      
      <div className="flex-1 flex flex-col lg:ml-64">
         <TopHeader onSidebarToggle={toggleCreateDropdown} />
        
        
        <div className="p-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Forums</h1>
          
          <WeekAndCourseSelector 
            selectedWeek={selectedWeek} 
            selectedCourse={selectedCourse} 
            onWeekChange={setSelectedWeek} 
            onCourseChange={setSelectedCourse} 
          />
          
          <div className="mb-6 flex items-center space-x-4">
            <input
              type="text"
              placeholder="Search forums..."
              className="border p-3 w-full rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
            <select
              className="border p-3 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
              value={categoryFilter}
              onChange={e => setCategoryFilter(e.target.value)}
            >
              <option value="all">All Categories</option>
              <option value="general">General Discussion</option>
              <option value="assignment">Assignment Help</option>
              <option value="exam">Exam Preparation</option>
              <option value="project">Project Discussion</option>
              <option value="discussion">Course Discussion</option>
            </select>
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-rose-500 text-white px-4 py-2 rounded-lg hover:bg-rose-600 transition-colors"
            >
              Create Forum
            </button>
          </div>

          {showCreateModal && (
            <CreateForumModal
              isOpen={showCreateModal}
              onClose={() => setShowCreateModal(false)}
              onSubmit={handleCreateForum}
              selectedWeek={selectedWeek}
              selectedCourse={selectedCourse}
            />
          )}
            <ForumStats forums={filteredForums} />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredForums.map(forum => (
                    <ForumCard 
                    key={forum.id} 
                    forum={forum} 
                    onForumClick={handleForumClick} 
                    />
                ))}                                                                                             
                </
div>
        </div>
      </div>
    </div>
  );
};
export default page;