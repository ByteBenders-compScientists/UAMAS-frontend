'use client';
import React, { useState } from 'react';
import { 
  Menu, 
  X, 
  FileText, 
  Monitor, 
  GraduationCap, 
  Plus, 
  BookOpen, 
  BookMarked, 
  MessageCircle, 
  BarChart3, 
  Book, 
  User, 
  Settings,
  ChevronDown,
  ChevronRight,
  Type,
  Bell
} from 'lucide-react';

// Sample assignments data with week information
const SAMPLE_ASSIGNMENTS = [
  { id: '1', title: 'Data Structures Project', course: 'CS201', dueDate: '2025-02-15', status: 'Active', submissions: 45, totalStudents: 132, week: 2 },
  { id: '2', title: 'Database Design Task', course: 'CS202', dueDate: '2025-02-18', status: 'Pending Review', submissions: 120, totalStudents: 132, week: 2 },
  { id: '3', title: 'Algorithm Analysis', course: 'CS301', dueDate: '2025-02-22', status: 'Active', submissions: 23, totalStudents: 85, week: 3 },
  { id: '4', title: 'System Design Project', course: 'CS302', dueDate: '2025-02-25', status: 'Draft', submissions: 0, totalStudents: 95, week: 3 },
  { id: '5', title: 'Network Security Lab', course: 'CS203', dueDate: '2025-03-01', status: 'Active', submissions: 67, totalStudents: 110, week: 4 },
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

// Navigation types
interface DropdownItem {
  label: string;
  path: string;
  icon: React.ComponentType<any>;
}

interface NavigationItem {
  icon: React.ComponentType<any>;
  label: string;
  active?: boolean;
  path?: string;
  count?: number;
  hasDropdown?: boolean;
  dropdownItems?: DropdownItem[];
}

const navigationItems: NavigationItem[] = [
  { icon: Monitor, label: 'Dashboard', path: '/lecturer/dashboard' },
  { icon: GraduationCap, label: 'Courses', path: '/lecturer/courses' },
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
  { icon: FileText, label: 'Assignment', count: 8, active: true, path: '/lecturer/assignment' },
  { icon: BookMarked, label: 'CATs', path: '/lecturer/cats' },
  { icon: MessageCircle, label: 'Forums', path: '/lecturer/forums' },
  { icon: BarChart3, label: 'Grades', path: '/lecturer/grades' },
  { icon: Book, label: 'Library', path: '/lecturer/library' },
  { icon: User, label: 'Profile', path: '/lecturer/profile' },
  { icon: Settings, label: 'Settings', path: '/lecturer/settings' }
];

// Sidebar Header Component
const SidebarHeader: React.FC<{ onClose: () => void }> = ({ onClose }) => (
  <div className="flex items-center justify-between p-6 border-b border-rose-200">
    <div className="flex items-center space-x-2 text-xl font-bold">
      <Type className="w-6 h-6 text-rose-600" />
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

// User Profile Component
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

// Navigation Dropdown Component
const NavigationDropdown: React.FC<{
  items: DropdownItem[];
  isOpen: boolean;
}> = ({ items, isOpen }) => {
  if (!isOpen) return null;

  return (
    <div className="ml-8 mt-2 space-y-1">
      {items.map((item, index) => (
        <a
          key={index}
          href={item.path}
          className="w-full text-left block p-2 text-sm font-medium rounded-lg hover:bg-rose-300 hover:bg-opacity-50 transition-all duration-200 text-white flex items-center"
        >
          {item.icon && <item.icon className="w-4 h-4 mr-2" />}
          {item.label}
        </a>
      ))}
    </div>
  );
};

// Week and Course Selector Component
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

// Navigation Item Component
const NavigationItemComponent: React.FC<{
  item: NavigationItem;
  isDropdownOpen: boolean;
  onDropdownToggle: () => void;
}> = ({ item, isDropdownOpen, onDropdownToggle }) => {
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
            <ChevronDown className="w-4 h-4" />
          ) : (
            <ChevronRight className="w-4 h-4" />
          )}
        </button>
        
        <NavigationDropdown 
          items={item.dropdownItems || []} 
          isOpen={isDropdownOpen}
        />
      </div>
    );
  }

  return (
    <a 
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
    </a>
  );
};

// Sidebar Component
const Sidebar: React.FC<{ 
  isOpen: boolean; 
  onClose: () => void;
  isMobile: boolean;
}> = ({ isOpen, onClose, isMobile }) => {
  const [expandedDropdown, setExpandedDropdown] = useState<string | null>(null);

  const handleDropdownToggle = (label: string) => {
    setExpandedDropdown(expandedDropdown === label ? null : label);
  };

  return (
    <>
      {/* Overlay for mobile */}
      {isMobile && isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-50"
          onClick={onClose}
        />
      )}
      
      <aside 
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-rose-600 shadow-lg transform transition-transform duration-300 ease-in-out ${
          isMobile 
            ? (isOpen ? 'translate-x-0' : '-translate-x-full')
            : 'translate-x-0'
        }`}
        aria-label="Sidebar"
      >
        <SidebarHeader onClose={onClose} />
        <UserProfile />
        
        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          {navigationItems.map((item, index) => (
            <NavigationItemComponent
              key={index}
              item={item}
              isDropdownOpen={expandedDropdown === item.label}
              onDropdownToggle={() => handleDropdownToggle(item.label)}
            />
          ))}
        </nav>
      </aside>
    </>
  );
};

// Top Header Component
const TopHeader: React.FC<{ 
  onSidebarToggle: () => void;
  isMobile: boolean;
}> = ({ onSidebarToggle, isMobile }) => (
  <header className="flex items-center justify-between px-4 py-4 lg:px-6 lg:py-6 bg-white border-b border-gray-200 shadow-sm">
    <div className="flex items-center space-x-3">
      {isMobile && (
        <button
          className="lg:hidden text-rose-600 hover:text-rose-800 transition-colors"
          onClick={onSidebarToggle}
          aria-label="Open sidebar"
        >
          <Menu className="w-6 h-6" />
        </button>
      )}
      <h1 className="text-xl lg:text-2xl font-bold text-gray-800">Assignments</h1>
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

// Main Page Component
const page:React.FC = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Assignment filter state
  const [selectedWeek, setSelectedWeek] = useState<number>(1);
  const [selectedCourse, setSelectedCourse] = useState<string>('');

  // Filter assignments based on selected week and course
  const filteredAssignments = SAMPLE_ASSIGNMENTS.filter(
    (assignment) =>
      assignment.week === selectedWeek &&
      (selectedCourse === '' || assignment.course === selectedCourse)
  );

  // Check if mobile on component mount
  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setSidebarOpen(false)}
        isMobile={isMobile}
      />
      
      {/* Main content area */}
      <div className={`min-h-screen transition-all duration-300 ${
        isMobile ? 'ml-0' : 'ml-64'
      }`}>
        <TopHeader 
          onSidebarToggle={() => setSidebarOpen(!isSidebarOpen)}
          isMobile={isMobile}
        />
        
        <main className="p-4 lg:p-6 max-w-7xl mx-auto w-full">
          {/* Page Header */}
          <div className="mb-6">
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-800">Assignments Dashboard</h1>
            <p className="text-gray-600 mt-2">Manage your course assignments for Spring 2025 semester</p>
          </div>

          {/* Week and Course Selector */}
          <WeekAndCourseSelector 
            selectedWeek={selectedWeek}
            selectedCourse={selectedCourse}
            onWeekChange={setSelectedWeek}
            onCourseChange={setSelectedCourse}
          />

          {/* Assignments List */}
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
              <a 
                href="/lecturer/assignment/create"
                className="bg-rose-500 text-white px-4 py-2 rounded-lg hover:bg-rose-600 transition-colors flex items-center"
              >
                <Plus className="w-4 h-4 mr-2" />
                New Assignment
              </a>
            </div>
            
            <div className="space-y-4">
              {filteredAssignments.map((assignment) => (
                <div 
                  key={assignment.id} 
                  className="flex flex-col lg:flex-row lg:items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start lg:items-center space-x-3 mb-3 lg:mb-0">
                    <FileText className="w-5 h-5 mt-1 lg:mt-0 text-rose-500 flex-shrink-0" />
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-800">{assignment.title}</h3>
                      <div className="text-sm text-gray-600 space-y-1 lg:space-y-0 lg:flex lg:items-center lg:space-x-4">
                        <span className="block lg:inline">{assignment.course}</span>
                        <span className="block lg:inline">Due: {new Date(assignment.dueDate).toLocaleDateString()}</span>
                        <span className="block lg:inline">
                          Submissions: {assignment.submissions}/{assignment.totalStudents}
                        </span>
                        <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                          assignment.status === 'Active' ? 'bg-green-100 text-green-700' :
                          assignment.status === 'Pending Review' ? 'bg-orange-100 text-orange-700' :
                          assignment.status === 'Draft' ? 'bg-gray-100 text-gray-700' :
                          'bg-blue-100 text-blue-700'
                        }`}>
                          {assignment.status}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 lg:flex-nowrap lg:space-x-2">
                    <button className="text-blue-600 hover:text-blue-800 text-sm font-medium px-3 py-1 rounded border border-blue-200 hover:bg-blue-50 transition-colors">
                      Edit
                    </button>
                    <button className="text-green-600 hover:text-green-800 text-sm font-medium px-3 py-1 rounded border border-green-200 hover:bg-green-50 transition-colors">
                      View Submissions
                    </button>
                    <button className="text-purple-600 hover:text-purple-800 text-sm font-medium px-3 py-1 rounded border border-purple-200 hover:bg-purple-50 transition-colors">
                      Grade
                    </button>
                  </div>
                </div>
              ))}
            </div>
            
            {filteredAssignments.length === 0 && (
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
                <a 
                  href="/lecturer/assignment/create"
                  className="bg-rose-500 text-white px-6 py-3 rounded-lg hover:bg-rose-600 transition-colors inline-flex items-center"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create Assignment
                </a>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default page;