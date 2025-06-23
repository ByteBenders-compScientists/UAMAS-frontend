
'use client'
import React, { useState} from 'react';
import { useLayout } from '@/components/LayoutController';
import Sidebar from '@/components/lecturerSidebar';
import { 
  BookMarked, Monitor, Plus, User, 
  Users, Bell, Menu, X, LetterText, ChevronDown, ChevronUp, GraduationCap,
  FileText, BookOpen, Edit, Trash2, Eye
} from 'lucide-react';

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

interface Course {
  id: string;
  name: string;
  code: string;
  color: string;
  description: string;
  enrolledStudents: number;
  totalStudents: number;
  semester: string;
  year: string;
  status: 'Active' | 'Inactive' | 'Completed';
  assignments: number;
  cats: number;
  createdDate: string;
}

// ===== CONSTANTS =====
const SAMPLE_COURSES: Course[] = [
  {
    id: '1',
    name: 'Computer Science 201',
    code: 'CS201',
    color: 'bg-rose-500',
    description: 'Advanced programming concepts and data structures',
    enrolledStudents: 45,
    totalStudents: 50,
    semester: 'Spring',
    year: '2025',
    status: 'Active',
    assignments: 8,
    cats: 3,
    createdDate: '2025-01-15'
  },
  {
    id: '2',
    name: 'Computer Science 301',
    code: 'CS301',
    color: 'bg-blue-500',
    description: 'Software engineering principles and methodologies',
    enrolledStudents: 38,
    totalStudents: 45,
    semester: 'Spring',
    year: '2025',
    status: 'Active',
    assignments: 6,
    cats: 2,
    createdDate: '2025-01-15'
  },
  {
    id: '3',
    name: 'Database Management',
    code: 'CS202',
    color: 'bg-purple-500',
    description: 'Database design, implementation, and management',
    enrolledStudents: 52,
    totalStudents: 60,
    semester: 'Spring',
    year: '2025',
    status: 'Active',
    assignments: 5,
    cats: 4,
    createdDate: '2025-01-15'
  },
  {
    id: '4',
    name: 'Operating Systems',
    code: 'CS203',
    color: 'bg-green-500',
    description: 'Operating system concepts and implementation',
    enrolledStudents: 42,
    totalStudents: 50,
    semester: 'Fall',
    year: '2024',
    status: 'Completed',
    assignments: 12,
    cats: 5,
    createdDate: '2024-08-15'
  },
  {
    id: '5',
    name: 'Software Engineering',
    code: 'CS302',
    color: 'bg-yellow-500',
    description: 'Advanced software development practices',
    enrolledStudents: 0,
    totalStudents: 40,
    semester: 'Summer',
    year: '2025',
    status: 'Inactive',
    assignments: 0,
    cats: 0,
    createdDate: '2025-02-01'
  }
];

// ===== UTILITY FUNCTIONS =====
const getStatusBadgeClass = (status: string): string => {
  const statusClasses: Record<string, string> = {
    'Active': 'bg-green-100 text-green-700 border border-green-200',
    'Inactive': 'bg-gray-100 text-gray-700 border border-gray-200',
    'Completed': 'bg-blue-100 text-blue-700 border border-blue-200'
  };
  return statusClasses[status] || 'bg-gray-100 text-gray-700 border border-gray-200';
};

const formatDate = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

// ===== COMPONENTS =====
const SidebarHeader: React.FC<{ onClose: () => void }> = ({ onClose }) => (
  <div className="flex items-center justify-between p-6 border-b border-rose-200/30">
    <div className="flex items-center space-x-3">
      <div className="w-8 h-8 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
        <LetterText className="w-5 h-5 text-white" />
      </div>
      <span className="text-xl font-bold text-white">EduPortal</span>
    </div>
    <button 
      className="lg:hidden text-white hover:text-rose-100 transition-colors p-1"
      onClick={onClose}
      aria-label="Close sidebar"
    >
      <X className="w-5 h-5" />
    </button>
  </div>
);

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

const UserProfile: React.FC = () => (
  <div className="p-4 border-b border-rose-200/30">
    <div className="flex items-center space-x-3">
      <div className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
        <User className="w-5 h-5 text-white" />
      </div>
      <div className="text-white">
        <div className="font-semibold text-sm">Dr. Alex Kimani</div>
        <div className="text-xs opacity-80">Senior Lecturer</div>
      </div>
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
    <div className="ml-6 mt-1 space-y-1">
      {items.map((item, index) => (
        <button
          key={index}
          onClick={() => onItemClick(item.path)}
          className="w-full text-left flex items-center space-x-2 p-2 text-sm text-white hover:bg-rose-400 hover:bg-opacity-30 transition-all duration-200 rounded-md"
        >
          {item.icon && <item.icon className="w-4 h-4" />}
          <span>{item.label}</span>
        </button>
      ))}
    </div>
  );
};

const NavigationItemComponent: React.FC<{
  item: NavigationItem;
  isDropdownOpen: boolean;
  onDropdownToggle: () => void;
  onDropdownItemClick: (path: string) => void;
  onClick?: () => void;
}> = ({ item, isDropdownOpen, onDropdownToggle, onDropdownItemClick, onClick }) => {
  if (item.hasDropdown) {
    return (
      <div className="mb-1">
        <button
          onClick={onDropdownToggle}
          className={`w-full flex items-center justify-between p-3 rounded-lg transition-all duration-200 ${
            item.active 
              ? 'bg-white text-rose-600 shadow-sm font-medium' 
              : 'hover:bg-rose-400 hover:bg-opacity-30 text-white'
          }`}
          aria-expanded={isDropdownOpen}
        >
          <div className="flex items-center space-x-3">
            <item.icon className="w-5 h-5" />
            <span className="text-sm">{item.label}</span>
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
    <button 
      onClick={onClick}
      className={`w-full flex items-center justify-between p-3 rounded-lg transition-all duration-200 mb-1 ${
        item.active 
          ? 'bg-white text-rose-600 shadow-sm font-medium' 
          : 'hover:bg-rose-400 hover:bg-opacity-30 text-white'
      }`}
    >
      <div className="flex items-center space-x-3">
        <item.icon className="w-5 h-5" />
        <span className="text-sm">{item.label}</span>
      </div>
      {item.count && (
        <span className="bg-white bg-opacity-20 text-white text-xs font-semibold px-2 py-1 rounded-full min-w-[20px] text-center">
          {item.count}
        </span>
      )}
    </button>
  );
};

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  navigationItems: NavigationItem[];
  isCreateDropdownOpen: boolean;
  onCreateDropdownToggle: () => void;
  onDropdownItemClick: (path: string) => void;
  onNavigationClick: (path: string) => void;
}



  



interface CourseCardProps {
  course: Course;
  onEdit: (course: Course) => void;
  onDelete: (courseId: string) => void;
  onView: (course: Course) => void;
}

const CourseCard: React.FC<CourseCardProps> = ({ course, onEdit, onDelete, onView }) => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 overflow-hidden group">
    <div className="p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className={`w-12 h-12 ${course.color} rounded-xl flex items-center justify-center shadow-sm`}>
            <BookOpen className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-lg text-gray-900">{course.name}</h3>
            <p className="text-sm text-gray-500 font-medium">{course.code}</p>
          </div>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadgeClass(course.status)}`}>
          {course.status}
        </span>
      </div>
      
      <p className="text-gray-600 text-sm mb-6 line-clamp-2 leading-relaxed">{course.description}</p>
      
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="text-center bg-gray-50 rounded-lg p-3">
          <div className="text-2xl font-bold text-gray-900">{course.enrolledStudents}</div>
          <div className="text-xs text-gray-500 font-medium">Enrolled</div>
        </div>
        <div className="text-center bg-gray-50 rounded-lg p-3">
          <div className="text-2xl font-bold text-gray-900">{course.assignments}</div>
          <div className="text-xs text-gray-500 font-medium">Assignments</div>
        </div>
      </div>
      
      <div className="flex items-center justify-between text-xs text-gray-500 mb-6 bg-gray-50 rounded-lg p-3">
        <span className="font-medium">{course.semester} {course.year}</span>
        <span className="font-medium">{course.cats} CATs</span>
      </div>
      
      <div className="flex space-x-2">
        <button
          onClick={() => onView(course)}
          className="flex-1 bg-emerald-500 text-white py-2.5 px-4 rounded-lg hover:bg-rose-600 transition-colors flex items-center justify-center text-sm font-medium shadow-sm"
        >
          <Eye className="w-4 h-4 mr-2" />
          View Course
        </button>
        <button
          onClick={() => onEdit(course)}
          className="bg-gray-100 text-gray-600 py-2.5 px-3 rounded-lg hover:bg-gray-200 transition-colors"
          title="Edit Course"
        >
          <Edit className="w-4 h-4" />
        </button>
        <button
          onClick={() => onDelete(course.id)}
          className="bg-red-50 text-red-600 py-2.5 px-3 rounded-lg hover:bg-red-100 transition-colors"
          title="Delete Course"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  </div>
);

interface CourseFormProps {
  course?: Course;
  onSubmit: (courseData: Partial<Course>) => void;
  onCancel: () => void;
}

const CourseForm: React.FC<CourseFormProps> = ({ course, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: course?.name || '',
    code: course?.code || '',
    description: course?.description || '',
    totalStudents: course?.totalStudents || 50,
    semester: course?.semester || 'Spring',
    year: course?.year || '2025',
    color: course?.color || 'bg-rose-500'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const colorOptions = [
    { value: 'bg-rose-500', label: 'Rose', class: 'bg-rose-500' },
    { value: 'bg-blue-500', label: 'Blue', class: 'bg-blue-500' },
    { value: 'bg-purple-500', label: 'Purple', class: 'bg-purple-500' },
    { value: 'bg-green-500', label: 'Green', class: 'bg-green-500' },
    { value: 'bg-yellow-500', label: 'Yellow', class: 'bg-yellow-500' },
    { value: 'bg-orange-500', label: 'Orange', class: 'bg-orange-500' },
    { value: 'bg-pink-500', label: 'Pink', class: 'bg-pink-500' },
    { value: 'bg-indigo-500', label: 'Indigo', class: 'bg-indigo-500' }
  ];

  return (
   <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-900">{course ? 'Edit Course' : 'Create New Course'}</h3>
        <button
          onClick={onCancel}
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6"> 
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Course Name</label>
            <input
              type="text"
              required
              className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              placeholder="e.g., Computer Science 101"
            />
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Course Code</label>
            <input
              type="text"
              required
              className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all"
              value={formData.code}
              onChange={(e) => setFormData({...formData, code: e.target.value})}
              placeholder="e.g., CS101"
            />
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
          <textarea
            required
            rows={4}
            className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all resize-none"
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            placeholder="Brief description of the course content and objectives"
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Max Students</label>
            <input
              type="number"
              min="1"
              required
              className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all"
              value={formData.totalStudents}
              onChange={(e) => setFormData({...formData, totalStudents: parseInt(e.target.value)})}
            />
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Semester</label>
            <select
              className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all"
              value={formData.semester}
              onChange={(e) => setFormData({...formData, semester: e.target.value})}
            >
              <option value="Spring">Spring</option>
              <option value="Summer">Summer</option>
              <option value="Fall">Fall</option>
              <option value="Winter">Winter</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Year</label>
            <input
              type="number"
              min="2024"
              required
              className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all"
              value={formData.year}
              onChange={(e) => setFormData({...formData, year: e.target.value})}
            />
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">Course Color</label>
          <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
            {colorOptions.map((color) => (
              <button
                key={color.value}
                type="button"
                className={`w-12 h-12 rounded-xl ${color.class} border-2 ${
                  formData.color === color.value ? 'border-gray-800 ring-2 ring-gray-300' : 'border-gray-300'
                } hover:border-gray-600 transition-all shadow-sm hover:shadow-md`}
                onClick={() => setFormData({...formData, color: color.value})}
                title={color.label}
              />
            ))}
          </div>
        </div>
        
        <div className="flex space-x-3 pt-6 border-t border-gray-200">
          <button
            type="submit"
            className="bg-emerald-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition-colors font-medium shadow-sm"
          >
            {course ? 'Update Course' : 'Create Course'}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="bg-gray-100 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-200 transition-colors font-medium"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

const page: React.FC = () => {
  const { sidebarCollapsed, isMobileView, isTabletView } = useLayout(); 
  const [createDropdownOpen, setCreateDropdownOpen] = useState(false);
  const [courses, setCourses] = useState<Course[]>(SAMPLE_COURSES);
  const [showForm, setShowForm] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const navigationItems: NavigationItem[] = [
    { icon: Monitor, label: 'Dashboard', path: '/lecturer/dashboard' },
    { icon: GraduationCap, label: 'Courses', active: true, path: '/lecturer/courses' },
    { 
      icon: Plus, 
      label: 'Create', 
      hasDropdown: true,
      dropdownItems: [
        { label: 'New Assignment', path: '/lecturer/assignment/create', icon: FileText },
        { label: 'New Task', path: '/lecturer/task/create', icon: BookOpen },
        { label: 'New CAT', path: '/lecturer/cat/create', icon: BookMarked }
      ] 
    },
  ];

 
  const toggleCreateDropdown = () => setCreateDropdownOpen(!createDropdownOpen);

  const handleCreateCourse = () => {
    setEditingCourse(null);
    setShowForm(true);
  };

  const handleEditCourse = (course: Course) => {
    setEditingCourse(course);
    setShowForm(true);
  };

  const handleDeleteCourse = (courseId: string) => {
    if (window.confirm('Are you sure you want to delete this course? This action cannot be undone.')) {
      setCourses(courses.filter(course => course.id !== courseId));
    }
  };

  const handleViewCourse = (course: Course) => {
    alert(`Viewing course: ${course.name}`);
  };

  const handleFormSubmit = (courseData: Partial<Course>) => {
    if (editingCourse) {
      setCourses(courses.map(course => 
        course.id === editingCourse.id 
          ? { ...course, ...courseData }
          : course
      ));
    } else {
      const newCourse: Course = {
        id: Date.now().toString(),
        name: courseData.name!,
        code: courseData.code!,
        color: courseData.color!,
        description: courseData.description!,
        enrolledStudents: 0,
        totalStudents: courseData.totalStudents!,
        semester: courseData.semester!,
        year: courseData.year!,
        status: 'Inactive',
        assignments: 0,
        cats: 0,
        createdDate: new Date().toISOString()
      };
      setCourses([...courses, newCourse]);
    }
    setShowForm(false);
    setEditingCourse(null);
  };

  const handleDropdownItemClick = (path: string) => {
    console.log('Navigating to:', path);
    setCreateDropdownOpen(false);
  };

  const handleNavigationClick = (path: string) => {
    console.log('Navigating to:', path);
    // Close mobile sidebar on navigation
  };

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || course.status.toLowerCase() === filterStatus.toLowerCase();
    return matchesSearch && matchesFilter;
  });

  const activeCourses = courses.filter(c => c.status === 'Active').length;
  const totalStudents = courses.reduce((sum, c) => sum + c.enrolledStudents, 0);
  const totalAssignments = courses.reduce((sum, c) => sum + c.assignments, 0);


  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar 
     
      />
      
      <div className="flex-1 flex flex-col lg:ml-64">
        <TopHeader onSidebarToggle={toggleCreateDropdown} /> 
        
        <main className="flex-1 p-6 max-w-7xl mx-auto w-ful">
          <div className="mb-6">
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-800">Courses Management</h1>
            <p className="text-gray-600 mt-2">Manage your courses, track enrollments, and monitor progress.</p>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6 mb-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex items-center space-x-4">
              <div className="p-2 rounded-full bg-green-100 text-green-600">
                <GraduationCap className="w-6 h-6" />
              </div>
              <div>
                <div className="text-lg font-bold">{activeCourses}</div>
                <div className="text-sm text-gray-500">Active Courses</div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex items-center space-x-4">
              <div className="p-2 rounded-full bg-blue-100 text-blue-600">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <div className="text-lg font-bold">{totalStudents}</div>
                <div className="text-sm text-gray-500">Total Enrolled</div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex items-center space-x-4">
                <div className="p-2 rounded-full bg-yellow-100 text-yellow-600">
                    <FileText className="w-6 h-6" />
                </div>
                <div>
                    <div className="text-lg font-bold">{totalAssignments}</div>
                    <div className="text-sm text-gray-500">Total Assignments</div>
                </div>
                </div>
            </div>

          {/* Search and Filter */}
          <div className="flex items-center justify-between mb-6">
            <div className="relative w-full max-w-md">
              <input
                type="text"
                className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                placeholder="Search courses by name or code..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex items-center space-x-3">
              <select
                className="border p-2 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="all">All Statuses</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
                <option value="Completed">Completed</option>
              </select>
              
              <button
                onClick={handleCreateCourse}
                className="bg-emerald-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors flex items-center"
              >
                <Plus className="w-4 h-4 mr-1" />
                Create Course
              </button>
            </div>
          </div>
          {/* Course List */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCourses.map(course => (
                  <CourseCard 
                  key={course.id} 
                  course={course} 
                  onEdit={handleEditCourse} 
                  onDelete={handleDeleteCourse} 
                  onView={handleViewCourse} 
                  />
              ))}
          </div>
          
          {/* Course Form */}
      {showForm && (
  <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
    <div className="bg-white rounded-xl shadow-lg w-full max-w-2xl my-8 mx-auto">
      <CourseForm 
        course={editingCourse ?? undefined} 
        onSubmit={handleFormSubmit} 
        onCancel={() => setShowForm(false)} 
      />
    </div>
  </div>
)}
        </main>
      </div>
    </div>
    );
};
export default page;