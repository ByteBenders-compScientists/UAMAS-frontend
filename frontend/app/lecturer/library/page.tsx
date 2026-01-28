/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import {
  BarChart3,
  Loader,
  User,
  Bell,
  Menu,
  X,
  ChevronDown,
  FileText,
  Library,
  Upload,
  Calendar,
  File,
  AlertCircle,
  Download,
  Search,
  Filter,
  Grid,
  List,
  Trash2,
  PlusCircle,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  GraduationCap
} from "lucide-react";
import LecturerSidebar from "@/components/lecturerSidebar"; 

// ===== CONSTANTS =====
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "https://68.221.169.119/api/v1";

// ===== INTERFACES =====
interface Note {
  id: number;
  lecturer_id: number;
  course_id: number;
  unit_id: number;
  title: string;
  description: string;
  original_filename: string;
  stored_filename: string;
  file_path: string;
  file_size: number;
  file_type: string;
  mime_type: string;
  created_at: string;
  updated_at?: string;
  week?: number; // Added for week filtering
}

interface Course {
  id: number;
  name: string;
  code: string;
  description?: string;
  created_at?: string;
  updated_at?: string;
}

interface Unit {
  id: number;
  unit_name: string;
  unit_code: string;
  course_id: number;
  description?: string;
  created_at?: string;
  updated_at?: string;
}

interface BreadcrumbItem {
  label: string;
  icon: React.ElementType;
  href: string;
}

// ===== API FUNCTIONS =====
const fetchCourses = async (): Promise<Course[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/lecturer/courses`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const courses = await response.json();
    return courses;
  } catch (error) {
    console.error("Error fetching courses:", error);
    throw error;
  }
};

const fetchUnits = async (): Promise<Unit[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/lecturer/units`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const units = await response.json();
    return units;
  } catch (error) {
    console.error("Error fetching units:", error);
    throw error;
  }
};

const fetchNotesForCourseUnit = async (
  courseId: number,
  unitId: number,
  week?: number
): Promise<Note[]> => {
  try {
    let endpoint = `${API_BASE_URL}/bd/units/${unitId}/notes`;
    if (week) {
      endpoint += `?week=${week}`;
    }
    
    const response = await fetch(
      endpoint,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.notes || [];
  } catch (error) {
    console.error("Error fetching notes:", error);
    throw error;
  }
};

const fetchAllLecturerNotes = async (): Promise<Note[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/bd/lecturer/notes`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.notes || [];
  } catch (error) {
    console.error("Error fetching lecturer notes:", error);
    throw error;
  }
};

const uploadNote = async (
  courseId: number,
  unitId: number,
  week: number,
  formData: FormData
): Promise<unknown> => {
  try {
    // Add week to the formData if needed
    if (week) {
      formData.append('week', week.toString());
    }
    
    const response = await fetch(
      `${API_BASE_URL}/bd/lecturer/units/${unitId}/notes`,
      {
        method: "POST",
        credentials: "include",
        body: formData,
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message || `HTTP error! status: ${response.status}`
      );
    }

    return await response.json();
  } catch (error) {
    console.error("Error uploading note:", error);
    throw error;
  }
};

const downloadNote = async (noteId: number): Promise<void> => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/bd/notes/${noteId}/download`,
      {
        method: "GET",
        credentials: "include",
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.style.display = "none";
    a.href = url;
    a.download = "";
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  } catch (error) {
    console.error("Error downloading note:", error);
    throw error;
  }
};

const deleteNote = async (noteId: number): Promise<void> => {
  try {
    const response = await fetch(`${API_BASE_URL}/bd/lecturer/notes/${noteId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message || `HTTP error! status: ${response.status}`
      );
    }
  } catch (error) {
    console.error("Error deleting note:", error);
    throw error;
  }
};

// ===== COMPONENTS =====
// Top Header Component
const TopHeader: React.FC<{ 
  onSidebarToggle: () => void, 
  onRefresh: () => void,
  onCourseToggle: () => void,
  coursesPanelOpen: boolean
}> = ({ onSidebarToggle, onRefresh, onCourseToggle, coursesPanelOpen }) => {
  return (
    <header className="sticky top-0 z-30 bg-white border-b border-gray-200 shadow-sm">
      <div className="px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        <div className="flex items-center">
          <button 
            onClick={onSidebarToggle}
            className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 lg:hidden"
          >
            <Menu className="w-6 h-6" />
          </button>
          
          <div className="ml-4 lg:ml-0">
            <h1 className="text-xl font-bold text-gray-900">Library Management</h1>
            <p className="text-sm text-gray-500 hidden sm:block">Upload and manage course materials</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <button 
            onClick={onRefresh}
            className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors relative"
            title="Refresh"
          >
            <RefreshCw className="w-5 h-5" />
          </button>
          
          <button 
            onClick={onCourseToggle}
            className={`p-2 rounded-lg transition-colors relative md:hidden ${
              coursesPanelOpen 
                ? 'bg-emerald-100 text-emerald-600' 
                : 'text-gray-600 hover:bg-gray-100'
            }`}
            title="Course Filter"
          >
            <Filter className="w-5 h-5" />
          </button>
          
          <button className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors relative">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
          
          <div className="h-8 w-8 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-700 font-semibold">
            <User className="w-5 h-5" />
          </div>
        </div>
      </div>
    </header>
  );
};

// Breadcrumb Component
const Breadcrumb: React.FC<{ items: BreadcrumbItem[] }> = ({ items }) => {
  return (
    <div className="mb-6 flex items-center overflow-x-auto pb-1 no-scrollbar">
      <div className="flex items-center space-x-2">
        {items.map((item, index) => (
          <React.Fragment key={index}>
            {index > 0 && (
              <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
            )}
            
            <a
              href={item.href}
              className={`flex items-center space-x-2 whitespace-nowrap px-3 py-2 rounded-lg text-sm font-medium ${
                index === items.length - 1
                  ? 'bg-emerald-100 text-emerald-700'
                  : 'hover:bg-gray-100 text-gray-600'
              }`}
            >
              <item.icon className="w-4 h-4" />
              <span>{item.label}</span>
            </a>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

// Side Access Panel Component
const SideAccessPanel: React.FC<{
  selectedCourse: number | null;
  selectedUnit: number | null;
  selectedWeek: number;
  onCourseSelect: (courseId: number | null) => void;
  onUnitSelect: (unitId: number | null) => void;
  onWeekSelect: (week: number) => void;
  courses: Course[];
  units: Unit[];
  isMinimized: boolean;
  onToggleMinimize: () => void;
}> = ({
  selectedCourse,
  selectedUnit,
  selectedWeek,
  onCourseSelect,
  onUnitSelect,
  onWeekSelect,
  courses,
  units,
  isMinimized,
  onToggleMinimize,
}) => {
  const [expandedCourses, setExpandedCourses] = useState<Set<number>>(new Set());

  const toggleCourseExpanded = (courseId: number) => {
    const newExpanded = new Set(expandedCourses);
    if (newExpanded.has(courseId)) {
      newExpanded.delete(courseId);
    } else {
      newExpanded.add(courseId);
    }
    setExpandedCourses(newExpanded);
  };

  // Auto-expand selected course
  useEffect(() => {
    if (selectedCourse && !expandedCourses.has(selectedCourse)) {
      setExpandedCourses(prev => new Set([...prev, selectedCourse]));
    }
  }, [selectedCourse, expandedCourses]);

  // Get course units
  const getCourseUnits = (courseId: number) => {
    return units.filter(unit => unit.course_id === courseId);
  };

  // Get course color based on index
  const getCourseColor = (index: number) => {
    const colors = [
      { bg: "bg-green-50", text: "text-green-700", border: "border-green-200", dot: "bg-green-500" },
      { bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200", dot: "bg-blue-500" },
      { bg: "bg-purple-50", text: "text-purple-700", border: "border-purple-200", dot: "bg-purple-500" },
      { bg: "bg-orange-50", text: "text-orange-700", border: "border-orange-200", dot: "bg-orange-500" },
      { bg: "bg-pink-50", text: "text-pink-700", border: "border-pink-200", dot: "bg-pink-500" },
    ];
    return colors[index % colors.length];
  };

  return (
    <div className={`
      bg-gradient-to-b from-emerald-50 to-green-50 border-r border-emerald-100 
      transition-all duration-300 ease-in-out shadow-lg relative
      ${isMinimized ? 'w-16' : 'w-80'}
      h-full flex flex-col fixed top-0 left-0 z-30 lg:relative
      ${isMinimized ? 'transform -translate-x-full lg:translate-x-0' : ''}
    `}>
      {/* Header */}
      <div className="p-4 border-b border-emerald-200 bg-white/50 backdrop-blur-sm flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className={`flex items-center space-x-3 ${isMinimized ? 'justify-center' : ''}`}>
            <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-green-600 rounded-lg flex items-center justify-center">
              <Filter className="w-4 h-4 text-white" />
            </div>
            {!isMinimized && (
              <div>
                <h2 className="font-bold text-lg text-gray-900">Filters</h2>
                <p className="text-sm text-gray-600">Navigate content</p>
              </div>
            )}
          </div>
          {!isMinimized && (
            <button
              onClick={onToggleMinimize}
              className="p-2 hover:bg-emerald-100 rounded-lg transition-colors"
            >
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {isMinimized ? (
          <div className="space-y-4">
            <button
              onClick={onToggleMinimize}
              className="w-full p-2 text-emerald-600 hover:bg-emerald-100 rounded-lg transition-colors"
              title="Expand panel"
            >
              <ChevronRight className="w-6 h-6 mx-auto" />
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {/* All Notes Option */}
            <div 
              onClick={() => {
                onCourseSelect(null);
                onUnitSelect(null);
                onWeekSelect(0);
              }}
              className={`
                p-4 rounded-xl cursor-pointer transition-all duration-200 border-2
                ${!selectedCourse 
                  ? 'bg-emerald-100 border-emerald-300 shadow-md' 
                  : 'bg-white border-gray-200 hover:bg-gray-50 hover:border-emerald-200'
                }
              `}
            >
              <div className="flex items-center space-x-3">
                <div className={`w-3 h-3 rounded-full ${!selectedCourse ? 'bg-emerald-500' : 'bg-gray-300'}`} />
                <div>
                  <div className="font-semibold text-gray-900">All Materials</div>
                  <div className="text-sm text-gray-600">View all notes</div>
                </div>
              </div>
            </div>
            
            {/* Course Selection */}
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <GraduationCap className="w-4 h-4 text-emerald-600" />
                <h3 className="font-semibold text-gray-900 text-sm uppercase tracking-wide">Courses</h3>
              </div>
              
              <div className="space-y-2">
                {courses.map((course, index) => {
                  const courseUnits = getCourseUnits(course.id);
                  const isExpanded = expandedCourses.has(course.id);
                  const isSelected = selectedCourse === course.id;
                  const colors = getCourseColor(index);
                  
                  return (
                    <div key={course.id} className="space-y-1">
                      {/* Course Item */}
                      <div className={`
                        rounded-xl border-2 transition-all duration-200 cursor-pointer
                        ${isSelected 
                          ? `${colors.bg} ${colors.border} shadow-md` 
                          : 'bg-white border-gray-200 hover:bg-gray-50 hover:border-emerald-200'
                        }
                      `}>
                        <div 
                          onClick={() => {
                            onCourseSelect(course.id);
                            onUnitSelect(null);
                            onWeekSelect(0);
                            toggleCourseExpanded(course.id);
                          }}
                          className="p-4"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3 flex-1 min-w-0">
                              <div className={`w-3 h-3 rounded-full ${isSelected ? colors.dot : 'bg-gray-300'}`} />
                              <div className="flex-1 min-w-0">
                                <div className="font-semibold text-gray-900 truncate">{course.name}</div>
                                <div className="text-sm text-gray-600">{course.code}</div>
                              </div>
                            </div>
                            <ChevronDown className={`
                              w-4 h-4 text-gray-400 transform transition-transform duration-200
                              ${isExpanded ? 'rotate-180' : ''}
                            `} />
                          </div>
                        </div>

                        {/* Units Dropdown */}
                        {isExpanded && courseUnits.length > 0 && (
                          <div className="border-t border-gray-200 px-4 pb-2">
                            <div className="space-y-1 pt-2">
                              {courseUnits.map((unit) => (
                                <div
                                  key={unit.id}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    onUnitSelect(unit.id);
                                    onWeekSelect(0);
                                  }}
                                  className={`
                                    p-3 rounded-lg cursor-pointer transition-all duration-200 ml-4
                                    ${selectedUnit === unit.id
                                      ? `${colors.bg} ${colors.text} shadow-sm border ${colors.border}`
                                      : 'hover:bg-gray-100 text-gray-700'
                                    }
                                  `}
                                >
                                  <div className="flex items-center space-x-2">
                                    <div className={`w-2 h-2 rounded-full ${
                                      selectedUnit === unit.id ? colors.dot : 'bg-gray-300'
                                    }`} />
                                    <div>
                                      <div className="font-medium text-sm">{unit.unit_name}</div>
                                      <div className="text-xs opacity-75">{unit.unit_code}</div>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Week Selection */}
            {selectedUnit && (
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-emerald-600" />
                  <h3 className="font-semibold text-gray-900 text-sm uppercase tracking-wide">Weeks</h3>
                </div>
                
                <div className="grid grid-cols-3 gap-2">
                  {Array.from({ length: 14 }, (_, i) => i + 1).map((week) => (
                    <button
                      key={week}
                      onClick={() => onWeekSelect(week)}
                      className={`
                        p-3 rounded-lg text-sm font-medium transition-all duration-200 border-2
                        ${selectedWeek === week
                          ? 'bg-emerald-600 text-white border-emerald-600 shadow-lg'
                          : 'bg-white text-gray-700 border-gray-200 hover:border-emerald-300 hover:bg-emerald-50'
                        }
                      `}
                    >
                      Week {week}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Toggle Button */}
      {isMinimized && (
        <div className="absolute -right-4 top-1/2 transform -translate-y-1/2">
          <button
            onClick={onToggleMinimize}
            className="w-8 h-8 bg-white border border-emerald-200 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center hover:bg-emerald-50"
          >
            <ChevronRight className="w-4 h-4 text-emerald-600" />
          </button>
        </div>
      )}
    </div>
  );
};

// Course and Unit Filter Component
const CourseUnitFilter: React.FC<{
  courses: Course[];
  units: Unit[];
  selectedCourse: number | null;
  selectedUnit: number | null;
  onCourseChange: (courseId: number | null) => void;
  onUnitChange: (unitId: number | null) => void;
  loading?: boolean;
}> = ({
  courses,
  units,
  selectedCourse,
  selectedUnit,
  onCourseChange,
  onUnitChange,
  loading = false,
}) => {
  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6 flex items-center justify-center">
        <Loader className="w-5 h-5 animate-spin text-emerald-600 mr-3" />
        <span className="text-gray-600">Loading filters...</span>
      </div>
    );
  }

  // Get filtered units based on selected course
  const filteredUnits = selectedCourse
    ? units.filter((unit) => unit.course_id === selectedCourse)
    : [];

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
      <div className="flex flex-wrap gap-6">
        <div className="flex-1 min-w-[200px]">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Course
          </label>
          <select
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            value={selectedCourse || ""}
            onChange={(e) => {
              const value = e.target.value ? Number(e.target.value) : null;
              onCourseChange(value);
              onUnitChange(null);
            }}
          >
            <option value="">All Courses</option>
            {courses.map((course) => (
              <option key={course.id} value={course.id}>
                {course.name} ({course.code})
              </option>
            ))}
          </select>
        </div>

        <div className="flex-1 min-w-[200px]">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Unit
          </label>
          <select
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            value={selectedUnit || ""}
            onChange={(e) => {
              const value = e.target.value ? Number(e.target.value) : null;
              onUnitChange(value);
            }}
            disabled={!selectedCourse}
          >
            <option value="">
              {selectedCourse ? "All Units" : "Select a course first"}
            </option>
            {filteredUnits.map((unit) => (
              <option key={unit.id} value={unit.id}>
                {unit.unit_name} ({unit.unit_code})
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-end">
          <button
            onClick={() => {
              onCourseChange(null);
              onUnitChange(null);
            }}
            className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Clear Filters
          </button>
        </div>
      </div>
    </div>
  );
};

// Upload Form Component
const UploadForm: React.FC<{
  courses: Course[];
  units: Unit[];
  selectedCourse?: number | null;
  selectedUnit?: number | null;
  selectedWeek?: number;
  onUpload: (courseId: number, unitId: number, week: number, formData: FormData) => Promise<void>;
  onCancel: () => void;
  loading: boolean;
}> = ({
  courses,
  units,
  selectedCourse: initialCourse = null,
  selectedUnit: initialUnit = null,
  selectedWeek: initialWeek = 0,
  onUpload,
  onCancel,
  loading,
}) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [courseId, setCourseId] = useState<number | null>(initialCourse);
  const [unitId, setUnitId] = useState<number | null>(initialUnit);
  const [week, setWeek] = useState<number>(initialWeek);
  const [error, setError] = useState<string | null>(null);

  // Get filtered units based on selected course
  const filteredUnits = courseId
    ? units.filter((unit) => unit.course_id === courseId)
    : [];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!title.trim()) {
      setError("Title is required");
      return;
    }

    if (!description.trim()) {
      setError("Description is required");
      return;
    }

    if (!file) {
      setError("File is required");
      return;
    }

    if (!courseId) {
      setError("Course is required");
      return;
    }

    if (!unitId) {
      setError("Unit is required");
      return;
    }

    if (!week || week <= 0) {
      setError("Week is required");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("file", file);
      formData.append("courseId", courseId.toString());
      formData.append("unitId", unitId.toString());
      formData.append("week", week.toString());

      await onUpload(courseId, unitId, week, formData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to upload note");
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-6 mb-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
            <Upload className="w-5 h-5 text-emerald-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Upload Course Material</h2>
            <p className="text-sm text-gray-600">Share notes, slides, or resources with your students</p>
          </div>
        </div>
        <button
          onClick={onCancel}
          className="p-2 text-gray-400 hover:text-gray-500"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-start">
            <AlertCircle className="w-5 h-5 text-red-500 mr-3 mt-0.5" />
            <div className="text-red-700 text-sm">{error}</div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              placeholder="e.g., Week 3 Lecture Notes"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Course *
            </label>
            <select
              value={courseId || ""}
              onChange={(e) => {
                const value = e.target.value ? Number(e.target.value) : null;
                setCourseId(value);
                setUnitId(null);
              }}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              required
            >
              <option value="">Select a course</option>
              {courses.map((course) => (
                <option key={course.id} value={course.id}>
                  {course.name} ({course.code})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Unit *
            </label>
            <select
              value={unitId || ""}
              onChange={(e) => {
                const value = e.target.value ? Number(e.target.value) : null;
                setUnitId(value);
              }}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              disabled={!courseId}
              required
            >
              <option value="">
                {courseId ? "Select a unit" : "Select a course first"}
              </option>
              {filteredUnits.map((unit) => (
                <option key={unit.id} value={unit.id}>
                  {unit.unit_name} ({unit.unit_code})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Week *
            </label>
            <select
              value={week}
              onChange={(e) => setWeek(Number(e.target.value))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              required
            >
              <option value="0">Select week</option>
              {Array.from({ length: 14 }, (_, i) => i + 1).map((w) => (
                <option key={w} value={w}>
                  Week {w}
                </option>
              ))}
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent min-h-[100px]"
              placeholder="Provide a brief description of the material..."
              required
            ></textarea>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              File *
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-emerald-500 transition-colors">
              <input
                type="file"
                id="file-upload"
                className="hidden"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                required
              />
              <label
                htmlFor="file-upload"
                className="cursor-pointer flex flex-col items-center justify-center"
              >
                <File className="w-12 h-12 text-gray-400 mb-3" />
                <span className="text-sm font-medium text-emerald-600 mb-1">
                  Click to upload a file
                </span>
                <span className="text-xs text-gray-500">
                  PDF, DOCX, PPT, or other documents (max 10MB)
                </span>
                {file && (
                  <div className="mt-4 p-3 bg-emerald-50 rounded-lg text-emerald-700 text-sm">
                    {file.name} ({(file.size / (1024 * 1024)).toFixed(2)} MB)
                  </div>
                )}
              </label>
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors flex items-center"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader className="w-5 h-5 animate-spin mr-2" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="w-5 h-5 mr-2" />
                Upload Material
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

// Note Card Component
const NoteCard: React.FC<{
  note: Note;
  course: Course;
  unit: Unit;
  viewMode: "grid" | "list";
  onDownload: (noteId: number) => Promise<void>;
  onDelete: (noteId: number) => Promise<void>;
}> = ({ note, course, unit, viewMode, onDownload, onDelete }) => {
  const [loading, setLoading] = useState(false);

  // Get file extension
  const fileExt = note.original_filename.split('.').pop()?.toLowerCase() || '';
  
  // Get file icon based on extension
  const getFileIcon = () => {
    switch (fileExt) {
      case 'pdf':
        return <FileText className="w-6 h-6 text-red-500" />;
      case 'doc':
      case 'docx':
        return <FileText className="w-6 h-6 text-blue-500" />;
      case 'ppt':
      case 'pptx':
        return <FileText className="w-6 h-6 text-orange-500" />;
      case 'xls':
      case 'xlsx':
        return <FileText className="w-6 h-6 text-green-500" />;
      default:
        return <File className="w-6 h-6 text-gray-500" />;
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }).format(date);
  };

  // Format file size
  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const handleDownload = async () => {
    try {
      setLoading(true);
      await onDownload(note.id);
    } catch (error) {
      console.error("Download error:", error);
    } finally {
      setLoading(false);
    }
  };

  if (viewMode === "grid") {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col transition-all duration-200 hover:shadow-md">
        <div className="p-5 flex-1">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-emerald-50 rounded-lg">
                {getFileIcon()}
              </div>
              <div className="font-semibold text-gray-600 uppercase text-xs">{fileExt}</div>
            </div>
            <div className="text-xs text-gray-500">{formatDate(note.created_at)}</div>
          </div>
          
          <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">{note.title}</h3>
          
          <div className="mb-3 flex items-center space-x-2">
            <div className="px-2 py-1 bg-emerald-50 text-emerald-700 rounded-lg text-xs font-medium">{course.code}</div>
            <div className="px-2 py-1 bg-blue-50 text-blue-700 rounded-lg text-xs font-medium">{unit.unit_code}</div>
            {note.week && (
              <div className="px-2 py-1 bg-purple-50 text-purple-700 rounded-lg text-xs font-medium">Week {note.week}</div>
            )}
          </div>
          
          <p className="text-sm text-gray-600 mb-4 line-clamp-3">{note.description}</p>
          
          <div className="text-xs text-gray-500 mb-3">
            <div>File: {note.original_filename}</div>
            <div>Size: {formatFileSize(note.file_size)}</div>
          </div>
        </div>
        
        <div className="border-t border-gray-100 p-4 bg-gray-50 flex justify-between">
          <button
            onClick={handleDownload}
            disabled={loading}
            className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-sm font-medium flex items-center"
          >
            {loading ? (
              <Loader className="w-4 h-4 animate-spin mr-2" />
            ) : (
              <Download className="w-4 h-4 mr-2" />
            )}
            Download
          </button>
          
          <button
            onClick={() => onDelete(note.id)}
            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </div>
    );
  }

  // List view
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200 p-4 mb-2">
      <div className="flex items-start md:items-center flex-col md:flex-row gap-4 md:gap-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-emerald-50 rounded-lg">
            {getFileIcon()}
          </div>
          <div className="flex flex-col">
            <h3 className="font-bold text-gray-900">{note.title}</h3>
            <div className="text-xs text-gray-500">{formatDate(note.created_at)}</div>
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap gap-2 mb-2">
            <div className="px-2 py-1 bg-emerald-50 text-emerald-700 rounded-lg text-xs font-medium">{course.code}</div>
            <div className="px-2 py-1 bg-blue-50 text-blue-700 rounded-lg text-xs font-medium">{unit.unit_code}</div>
            {note.week && (
              <div className="px-2 py-1 bg-purple-50 text-purple-700 rounded-lg text-xs font-medium">Week {note.week}</div>
            )}
          </div>
          <p className="text-sm text-gray-600 line-clamp-1">{note.description}</p>
        </div>

        <div className="flex items-center space-x-2 w-full md:w-auto">
          <div className="text-xs text-gray-500 mr-4 hidden md:block">
            {formatFileSize(note.file_size)}
          </div>
          <button
            onClick={handleDownload}
            disabled={loading}
            className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-sm font-medium flex items-center"
          >
            {loading ? (
              <Loader className="w-4 h-4 animate-spin mr-2" />
            ) : (
              <Download className="w-4 h-4 mr-2" />
            )}
            Download
          </button>
          
          <button
            onClick={() => onDelete(note.id)}
            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

// Main Page Component
const LibraryPage: React.FC = () => {
  const searchParams = useSearchParams();
  const initialCourseParam = searchParams.get("courseId");
  const initialUnitParam = searchParams.get("unitId");
  const initialWeekParam = searchParams.get("week");

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sideAccessOpen, setSideAccessOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCourse, setSelectedCourse] = useState<number | null>(
    initialCourseParam ? Number(initialCourseParam) : null
  );
  const [selectedUnit, setSelectedUnit] = useState<number | null>(
    initialUnitParam ? Number(initialUnitParam) : null
  );
  const [selectedWeek, setSelectedWeek] = useState<number>(
    initialWeekParam ? Number(initialWeekParam) : 0
  );
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showUploadForm, setShowUploadForm] = useState(false);

  // Data states
  const [notes, setNotes] = useState<Note[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [units, setUnits] = useState<Unit[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch initial data
  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [coursesData, unitsData, notesData] = await Promise.all([
        fetchCourses(),
        fetchUnits(),
        fetchAllLecturerNotes(),
      ]);

      setCourses(coursesData);
      setUnits(unitsData);
      setNotes(notesData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load data");
      console.error("Error loading data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Fetch notes when course/unit filter changes
  useEffect(() => {
    const loadFilteredNotes = async () => {
      if (!loading) {
        try {
          let filteredNotes;
          
          if (selectedCourse && selectedUnit && selectedWeek) {
            // Get notes for specific course, unit and week
            filteredNotes = await fetchNotesForCourseUnit(
              selectedCourse,
              selectedUnit,
              selectedWeek
            );
          } else if (selectedCourse && selectedUnit) {
            // Get notes for specific course and unit
            filteredNotes = await fetchNotesForCourseUnit(
              selectedCourse,
              selectedUnit
            );
          } else if (selectedCourse) {
            // Get all notes for the course (filtered client-side)
            const allNotes = await fetchAllLecturerNotes();
            filteredNotes = allNotes.filter(note => note.course_id === selectedCourse);
          } else {
            // Get all notes
            filteredNotes = await fetchAllLecturerNotes();
          }
          
          setNotes(filteredNotes);
        } catch (err) {
          console.error("Error loading filtered notes:", err);
          const allNotes = await fetchAllLecturerNotes();
          setNotes(allNotes);
        }
      }
    };

    loadFilteredNotes();
  }, [selectedCourse, selectedUnit, selectedWeek, loading]);

  const handleUpload = async (courseId: number, unitId: number, week: number, formData: FormData) => {
    try {
      setUploading(true);
      await uploadNote(courseId, unitId, week, formData);

      // Refresh notes based on current selection
      if (selectedCourse && selectedUnit && selectedWeek) {
        const updatedNotes = await fetchNotesForCourseUnit(selectedCourse, selectedUnit, selectedWeek);
        setNotes(updatedNotes);
      } else {
        const allNotes = await fetchAllLecturerNotes();
        setNotes(allNotes);
      }

      setShowUploadForm(false);
      // Show success message
      alert("Material uploaded successfully!");
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to upload material");
    } finally {
      setUploading(false);
    }
  };

  const handleDownload = async (noteId: number) => {
    try {
      await downloadNote(noteId);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to download material");
    }
  };

  const handleDelete = async (noteId: number) => {
    if (!confirm("Are you sure you want to delete this material?")) {
      return;
    }

    try {
      await deleteNote(noteId);

      // Refresh notes
      if (selectedCourse && selectedUnit && selectedWeek) {
        const updatedNotes = await fetchNotesForCourseUnit(selectedCourse, selectedUnit, selectedWeek);
        setNotes(updatedNotes);
      } else {
        const allNotes = await fetchAllLecturerNotes();
        setNotes(allNotes);
      }

      alert("Material deleted successfully!");
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to delete material");
    }
  };

  const filteredNotes = notes.filter((note) => {
    const matchesSearch =
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.original_filename.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesSearch;
  });

  // Get breadcrumb items
  const getBreadcrumbItems = (): BreadcrumbItem[] => {
    const items: BreadcrumbItem[] = [
      { label: "Library", icon: Library, href: "/lecturer/library" }
    ];

    if (selectedCourse) {
      const course = courses.find(c => c.id === selectedCourse);
      if (course) {
        items.push({ label: course.name, icon: GraduationCap, href: "#" });
        
        if (selectedUnit) {
          const unit = units.find(u => u.id === selectedUnit);
          if (unit) {
            items.push({ label: unit.unit_name, icon: BookOpen, href: "#" });
            
            if (selectedWeek > 0) {
              items.push({ label: `Week ${selectedWeek}`, icon: Calendar, href: "#" });
            }
          }
        }
      }
    }

    return items;
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-green-50 flex items-center justify-center">
        <div className="text-center bg-white rounded-2xl shadow-lg p-8 max-w-md mx-4">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Error Loading Data
          </h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-gradient-to-r from-emerald-600 to-green-600 text-white px-6 py-3 rounded-xl hover:from-emerald-700 hover:to-green-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-green-50 flex">
      {/* Mobile Sidebar for small screens */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="fixed inset-0 bg-black/50" onClick={() => setSidebarOpen(false)}></div>
          <div className="fixed inset-y-0 left-0 w-64 bg-white shadow-xl z-50">
            <LecturerSidebar />
          </div>
        </div>
      )}

      {/* Desktop Sidebar - hidden on mobile, visible on larger screens */}
      <div className="hidden lg:block lg:w-64 flex-shrink-0">
        <LecturerSidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex -ml-4 lg:-ml-4 ">
        {/* Side Access Panel */}
        <SideAccessPanel
          selectedCourse={selectedCourse}
          selectedUnit={selectedUnit}
          selectedWeek={selectedWeek}
          onCourseSelect={setSelectedCourse}
          onUnitSelect={setSelectedUnit}
          onWeekSelect={setSelectedWeek}
          courses={courses}
          units={units}
          isMinimized={!sideAccessOpen}
          onToggleMinimize={() => setSideAccessOpen(!sideAccessOpen)}
        />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col">
          <TopHeader 
            onSidebarToggle={() => setSidebarOpen(true)} 
            onRefresh={loadData}
            onCourseToggle={() => setSideAccessOpen(!sideAccessOpen)}
            coursesPanelOpen={sideAccessOpen}
          />

          <main className="flex-1 p-6 max-w-8xl mx-auto w-full">
            {/* Breadcrumb */}
            <Breadcrumb items={getBreadcrumbItems()} />

            {/* Search and Actions Bar */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                <div className="flex-1 max-w-md">
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="Search materials, filenames, or descriptions..."
                      className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 shadow-sm"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-1 border border-gray-200 rounded-xl p-1 bg-gray-50">
                    <button
                      onClick={() => setViewMode("grid")}
                      className={`p-2 rounded-lg transition-all duration-200 ${
                        viewMode === "grid"
                          ? "bg-emerald-100 text-emerald-600 shadow-sm"
                          : "text-gray-600 hover:bg-gray-100"
                      }`}
                    >
                      <Grid className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setViewMode("list")}
                      className={`p-2 rounded-lg transition-all duration-200 ${
                        viewMode === "list"
                          ? "bg-emerald-100 text-emerald-600 shadow-sm"
                          : "text-gray-600 hover:bg-gray-100"
                      }`}
                    >
                      <List className="w-4 h-4" />
                    </button>
                  </div>

                  <button
                    onClick={() => setShowUploadForm(!showUploadForm)}
                    className="bg-gradient-to-r from-emerald-600 to-green-600 text-white px-6 py-3 rounded-xl hover:from-emerald-700 hover:to-green-700 transition-all duration-200 flex items-center font-semibold shadow-lg hover:shadow-xl"
                  >
                    <PlusCircle className="w-5 h-5 mr-2" />
                    Add Material
                  </button>
                </div>
              </div>
            </div>

            {/* Upload Form */}
            {showUploadForm && (
              <UploadForm
                courses={courses}
                units={units}
                selectedCourse={selectedCourse}
                selectedUnit={selectedUnit}
                selectedWeek={selectedWeek}
                onUpload={handleUpload}
                onCancel={() => setShowUploadForm(false)}
                loading={uploading}
              />
            )}

            {/* Notes Grid/List */}
            <div
              className={`grid ${
                viewMode === "grid"
                  ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                  : "grid-cols-1 gap-4"
              }`}
            >
              {loading ? (
                <div className="col-span-full flex items-center justify-center py-16">
                  <div className="text-center">
                    <Loader className="w-8 h-8 animate-spin text-emerald-600 mx-auto mb-4" />
                    <p className="text-gray-600 font-medium">Loading your materials...</p>
                  </div>
                </div>
              ) : filteredNotes.length > 0 ? (
                filteredNotes.map((note) => {
                  const course = courses.find((c) => c.id === note.course_id);
                  const unit = units.find((u) => u.id === note.unit_id);

                  if (!course || !unit) return null;

                  return (
                    <NoteCard
                      key={note.id}
                      note={note}
                      course={course}
                      unit={unit}
                      viewMode={viewMode}
                      onDownload={handleDownload}
                      onDelete={handleDelete}
                    />
                  );
                })
              ) : (
                <div className="col-span-full text-center py-16">
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12">
                    <Library className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                    <h3 className="text-xl font-bold text-gray-900 mb-2">No materials found</h3>
                    <p className="text-gray-600 mb-6">
                      {searchQuery || selectedCourse || selectedUnit || selectedWeek
                        ? "No materials match your current search or filter criteria."
                        : "Upload your first material to get started with your digital library!"}
                    </p>
                    {!searchQuery && !selectedCourse && !selectedUnit && (
                      <button
                        onClick={() => setShowUploadForm(true)}
                        className="bg-gradient-to-r from-emerald-600 to-green-600 text-white px-6 py-3 rounded-xl hover:from-emerald-700 hover:to-green-700 transition-all duration-200 flex items-center mx-auto font-semibold shadow-lg hover:shadow-xl"
                      >
                        <PlusCircle className="w-5 h-5 mr-2" />
                        Upload First Material
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Summary Stats */}
            {!loading && notes.length > 0 && (
              <div className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-6">
                <h4 className="font-bold text-blue-900 mb-4 flex items-center">
                  <BarChart3 className="w-5 h-5 mr-2" />
                  Library Statistics
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-800">{notes.length}</div>
                    <div className="text-blue-600">Total Materials</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-800">{filteredNotes.length}</div>
                    <div className="text-blue-600">Filtered Materials</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-800">{courses.length}</div>
                    <div className="text-blue-600">Courses</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-800">{units.length}</div>
                    <div className="text-blue-600">Units</div>
                  </div>
                </div>
                {(selectedCourse || selectedUnit || selectedWeek > 0) && (
                  <div className="mt-4 pt-4 border-t border-blue-200">
                    <div className="text-sm text-blue-700 space-y-1">
                      {selectedCourse && (
                        <p>
                          <span className="font-semibold">Selected Course:</span>{" "}
                          {courses.find((c) => c.id === selectedCourse)?.name}
                        </p>
                      )}
                      {selectedUnit && (
                        <p>
                          <span className="font-semibold">Selected Unit:</span>{" "}
                          {units.find((u) => u.id === selectedUnit)?.unit_name}
                        </p>
                      )}
                      {selectedWeek > 0 && (
                        <p>
                          <span className="font-semibold">Selected Week:</span> Week {selectedWeek}
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default LibraryPage;