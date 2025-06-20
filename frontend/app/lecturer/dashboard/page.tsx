'use client'
import React, { useState} from 'react';
import Sidebar from '@/components/lecturerSidebar';
import {useLayout} from '@/components/LayoutController';
import { 
  BookMarked, Clock,  User, 
  Users, Bell, Menu,
  FileText, Image,
  File
} from 'lucide-react';

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




// ... (keep all other components the same as before)

interface StatsCardProps {
  stat: StatData;
}

const StatsCard: React.FC<StatsCardProps> = ({ stat }) => (
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

interface AssignmentsCardProps {
  assignments: Assignment[];
}

const AssignmentsCard: React.FC<AssignmentsCardProps> = ({ assignments }) => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 lg:p-6">
    <h2 className="text-lg font-bold mb-4">Assignments This Week</h2>
    {assignments.length === 0 ? (
      <div className="text-gray-500">No assignments for this week.</div>
    ) : (
      <ul className="space-y-3">
        {assignments.map(assignment => (
          <li key={assignment.id} className="p-3 bg-gray-50 rounded-lg border border-gray-200 flex flex-col space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-semibold">{assignment.title}</span>
              <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusBadgeClass(assignment.status)}`}>
                {assignment.status}
              </span>
            </div>
            <div className="text-xs text-gray-500">
              {assignment.course} &middot; Due: {formatDate(assignment.dueDate)} &middot; {assignment.submissions}/{assignment.totalStudents} submitted
            </div>
            {assignment.files && assignment.files.length > 0 && (
              <div className="flex items-center space-x-2 mt-1">
                {assignment.files.map((file, idx) => {
                  const Icon = getFileIcon(file.name);
                  return (
                    <span key={idx} className="flex items-center text-xs text-gray-600">
                      <Icon className="w-4 h-4 mr-1" />
                      {file.name}
                    </span>
                  );
                })}
              </div>
            )}
          </li>
        ))}
      </ul>
    )}
  </div>
);

interface CATsCardProps {
  cats: CAT[];
}

const CATsCard: React.FC<CATsCardProps> = ({ cats }) => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 lg:p-6">
    <h2 className="text-lg font-bold mb-4">CATs This Week</h2>
    {cats.length === 0 ? (
      <div className="text-gray-500">No CATs scheduled for this week.</div>
    ) : (
      <ul className="space-y-3">
        {cats.map(cat => (
          <li key={cat.id} className="p-3 bg-gray-50 rounded-lg border border-gray-200 flex flex-col space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-semibold">{cat.title}</span>
              <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusBadgeClass(cat.status)}`}>
                {cat.status}
              </span>
            </div>
            <div className="text-xs text-gray-500">
              {cat.course} &middot; {formatDate(cat.date)} &middot; Duration: {cat.duration} hr(s)
            </div>
            {cat.files && cat.files.length > 0 && (
              <div className="flex items-center space-x-2 mt-1">
                {cat.files.map((file, idx) => {
                  const Icon = getFileIcon(file.name);
                  return (
                    <span key={idx} className="flex items-center text-xs text-gray-600">
                      <Icon className="w-4 h-4 mr-1" />
                      {file.name}
                    </span>
                  );
                })}
              </div>
            )}
          </li>
        ))}
      </ul>
    )}
  </div>
);

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


// Add CreateFormButtons component
interface CreateFormButtonsProps {
  activeForm: 'assignment' | 'task' | 'cat' | null;
  onFormSelect: (form: 'assignment' | 'task' | 'cat') => void;
}

const CreateFormButtons: React.FC<CreateFormButtonsProps> = ({ onFormSelect }) => (
  <div className="flex flex-wrap gap-4 mb-6">
    <button
      className="bg-rose-500 text-white px-4 py-2 rounded-lg hover:bg-rose-600 transition-colors"
      onClick={() => onFormSelect('assignment')}
    >
      Create Assignment
    </button>
    <button
      className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition-colors"
      onClick={() => onFormSelect('task')}
    >
      Create Task
    </button>
    <button
      className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
      onClick={() => onFormSelect('cat')}
    >
      Create CAT
    </button>
  </div>
);

const Page: React.FC = () => {
  useLayout();
  const [createDropdownOpen, setCreateDropdownOpen] = useState(false);
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

  // State for assignments and CATs from the second code snippet
  const [assignmentsList, setAssignmentsList] = useState<string[]>(['Math Assignment 1', 'Science Assignment 2']);
  const [catsList, setCatsList] = useState<string[]>(['Math CAT 1', 'Science CAT 2']);
  const [assignmentDetails, setAssignmentDetails] = useState('');
  const [catDetails, setCATDetails] = useState('');




  const toggleCreateDropdown = () => setCreateDropdownOpen(!createDropdownOpen);

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
    
    // Here you would typically send the data to your backend
    console.log('Form submitted:', {
      type: activeForm,
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
  };

  // Functions from the second code snippet
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


  // Filter assignments and CATs for the selected week
  const filteredAssignments = SAMPLE_ASSIGNMENTS.filter(a => a.week === selectedWeek);
  const filteredCATs = SAMPLE_CATS.filter(c => c.week === selectedWeek);

  return (
    <div className="min-h-screen bg-gray-50 flex border-red-500">
      <Sidebar 
    
      />
      
      {/* <Sidebar isOpen={sidebarOpen} onClose={()=>setSidebarOpen(false) navigationItemsna}/> */}
      <div className="flex-1 flex flex-col lg:ml-64">
        <TopHeader onSidebarToggle={toggleCreateDropdown} />
        
        <main className="flex-1 p-4 lg:p-6 max-w-7xl mx-auto w-full">
          <div className="mb-6">
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-800">Welcome back, Dr. Alex Kimani</h1>
            <p className="text-gray-600 mt-2">Spring 2025 Semester - Here&#39;s your course overview today.</p>
          </div>

          <WeekAndCourseSelector 
            selectedWeek={selectedWeek}
            selectedCourse={selectedCourse}
            onWeekChange={setSelectedWeek}
            onCourseChange={setSelectedCourse}
          />
          
          {activeForm ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 lg:p-6 mb-6">
              <h3 className="font-bold text-lg mb-3">
                {activeForm === 'assignment' && 'Create Assignment'}
                {activeForm === 'task' && 'Create Task'}
                {activeForm === 'cat' && 'Create CAT'}
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
                          Remove
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

export default Page;