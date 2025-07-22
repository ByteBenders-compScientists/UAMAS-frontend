"use client";
import React, { useState, useEffect } from "react";
import Sidebar from '@/components/lecturerSidebar';
import { LegacyAssessment, LegacyCourse, Message } from "../../../types/assessment";
import { dummyCourses, dummyAssessments } from "../../../data/assessmentData";

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

// ===== CONSTANTS =====
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080/api/v1";

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
}
interface CourseUnitFilterProps {
  courses: Course[];
  units: Unit[];
  selectedCourse: number | null;
  selectedUnit: number | null;
  onCourseChange: (courseId: number | null) => void;
  onUnitChange: (unitId: number | null) => void;
  loading?: boolean;
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

// Side Access Panel Component (from second code)
interface SideAccessPanelProps {
  selectedCourse: string;
  selectedUnit: string;
  selectedWeek: number;
  onCourseSelect: (courseId: string) => void;
  onUnitSelect: (unitId: string) => void;
  onWeekSelect: (week: number) => void;
  courses: LegacyCourse[];
  isMinimized: boolean;
  onToggleMinimize: () => void;
}
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
  unitId: number
): Promise<Note[]> => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/bd/units/${unitId}/notes`,
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
  formData: FormData
): Promise<unknown> => {
  try {
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

const SideAccessPanel: React.FC<SideAccessPanelProps> = ({
  selectedCourse,
  selectedUnit,
  selectedWeek,
  onCourseSelect,
  onUnitSelect,
  onWeekSelect,
  courses,
  isMinimized,
  onToggleMinimize,
}) => {
  const [expandedCourses, setExpandedCourses] = useState<Set<string>>(new Set());

  const toggleCourseExpanded = (courseId: string) => {
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

  const selectedCourseData = courses.find(c => c.id === selectedCourse);
  const selectedUnitData = selectedCourseData?.units.find(u => u.id === selectedUnit);

  return (
    <div className={`
      bg-gradient-to-b from-emerald-50 to-green-50 border-r border-emerald-100 
      transition-all duration-300 ease-in-out shadow-lg relative
      ${isMinimized ? 'w-16' : 'w-80'}
      h-full flex flex-col
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
            {/* Course Selection */}
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <GraduationCap className="w-4 h-4 text-emerald-600" />
                <h3 className="font-semibold text-gray-900 text-sm uppercase tracking-wide">Courses</h3>
              </div>
              
              <div className="space-y-2">
                {courses.map((course, index) => {
                  const isExpanded = expandedCourses.has(course.id);
                  const isSelected = selectedCourse === course.id;
                  
                  return (
                    <div key={course.id} className="space-y-1">
                      {/* Course Item */}
                      <div className={`
                        rounded-xl border-2 transition-all duration-200 cursor-pointer
                        ${isSelected 
                          ? `bg-emerald-100 border-emerald-300 shadow-md` 
                          : 'bg-white border-gray-200 hover:bg-gray-50 hover:border-emerald-200'
                        }
                      `}>
                        <div 
                          onClick={() => {
                            onCourseSelect(course.id);
                            onUnitSelect('');
                            onWeekSelect(0);
                            toggleCourseExpanded(course.id);
                          }}
                          className="p-4"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3 flex-1 min-w-0">
                              <div className={`w-3 h-3 rounded-full ${isSelected ? 'bg-emerald-500' : 'bg-gray-300'}`} />
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
                        {isExpanded && course.units.length > 0 && (
                          <div className="border-t border-gray-200 px-4 pb-2">
                            <div className="space-y-1 pt-2">
                              {course.units.map((unit) => (
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
                                      ? 'bg-emerald-100 text-emerald-700 shadow-sm border border-emerald-200'
                                      : 'hover:bg-gray-100 text-gray-700'
                                    }
                                  `}
                                >
                                  <div className="flex items-center space-x-2">
                                    <div className={`w-2 h-2 rounded-full ${
                                      selectedUnit === unit.id ? 'bg-emerald-500' : 'bg-gray-300'
                                    }`} />
                                    <div>
                                      <div className="font-medium text-sm">{unit.name}</div>
                                      <div className="text-xs opacity-75">{unit.code}</div>
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
            {selectedUnit && selectedUnitData && (
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-emerald-600" />
                  <h3 className="font-semibold text-gray-900 text-sm uppercase tracking-wide">Weeks</h3>
                </div>
                
                <div className="grid grid-cols-3 gap-2">
                  {Array.isArray((selectedUnitData as any)?.weeks)
                    ? (selectedUnitData as any).weeks.map((week: number) => (
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
                      ))
                    : null}
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

// Enhanced Course Selection Panel (from first code with improvements)
interface CourseSelectionPanelProps {
  courses: Course[];
  units: Unit[];
  selectedCourse: number | null;
  selectedUnit: number | null;
  onCourseSelect: (courseId: number | null) => void;
  onUnitSelect: (unitId: number | null) => void;
  isOpen: boolean;
  onToggle: () => void;
  loading?: boolean;
}

const CourseSelectionPanel: React.FC<CourseSelectionPanelProps> = ({
  courses,
  units,
  selectedCourse,
  selectedUnit,
  onCourseSelect,
  onUnitSelect,
  isOpen,
  onToggle,
  loading = false,
}) => {
  const [expandedCourses, setExpandedCourses] = useState<Set<number>>(new Set());

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

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-30 lg:hidden"
          onClick={onToggle}
        />
      )}
      
      {/* Panel */}
      <div className={`
        fixed top-0 left-0 h-full bg-gradient-to-b from-emerald-50 to-green-50 border-r border-emerald-100 z-40
        transform transition-transform duration-300 ease-in-out shadow-xl
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        w-80 lg:w-72
      `}>
        {/* Header */}
        <div className="p-6 border-b border-emerald-200 bg-white/50 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-green-600 rounded-lg flex items-center justify-center">
                <Filter className="w-4 h-4 text-white" />
              </div>
              <div>
                <h2 className="font-bold text-lg text-gray-900">Course Selection</h2>
                <p className="text-sm text-gray-600">Choose your context</p>
              </div>
            </div>
            <button
              onClick={onToggle}
              className="lg:hidden p-2 hover:bg-emerald-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-center">
                <Loader className="w-6 h-6 animate-spin text-emerald-600 mx-auto mb-2" />
                <p className="text-sm text-gray-600">Loading courses...</p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {/* All Courses Option */}
              <div 
                onClick={() => {
                  onCourseSelect(null);
                  onUnitSelect(null);
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
                    <div className="font-semibold text-gray-900">All Courses</div>
                    <div className="text-sm text-gray-600">View all notes</div>
                  </div>
                </div>
              </div>

              {/* Courses Header */}
              <div className="flex items-center space-x-2 pt-2">
                <BookOpen className="w-4 h-4 text-emerald-600" />
                <h3 className="font-semibold text-gray-900 text-sm uppercase tracking-wide">Courses</h3>
              </div>

              {/* Course List */}
              <div className="space-y-2">
                {courses.map((course, index) => {
                  const courseUnits = units.filter(unit => unit.course_id === course.id);
                  const isExpanded = expandedCourses.has(course.id);
                  const colors = getCourseColor(index);
                  const isSelected = selectedCourse === course.id;

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
          )}
        </div>

        {/* Toggle Button for Desktop */}
        <div className="hidden lg:block absolute -right-4 top-1/2 transform -translate-y-1/2">
          <button
            onClick={onToggle}
            className="w-8 h-8 bg-white border border-emerald-200 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center hover:bg-emerald-50"
          >
            {isOpen ? (
              <ChevronLeft className="w-4 h-4 text-emerald-600" />
            ) : (
              <ChevronRight className="w-4 h-4 text-emerald-600" />
            )}
          </button>
        </div>
      </div>
    </>
  );
};
  

const Page: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [coursesPanelOpen, setCoursesPanelOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCourse, setSelectedCourse] = useState<number | null>(null);
  const [selectedUnit, setSelectedUnit] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showUploadForm, setShowUploadForm] = useState(false);

  // Data states
  const [notes, setNotes] = useState<Note[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [units, setUnits] = useState<Unit[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

const handleCourseToggle = () => {
  setCoursesPanelOpen(!coursesPanelOpen);
};
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
      if (selectedCourse && selectedUnit) {
        try {
          const filteredNotes = await fetchNotesForCourseUnit(
            selectedCourse,
            selectedUnit
          );
          setNotes(filteredNotes);
        } catch (err) {
          console.error("Error loading filtered notes:", err);
          const allNotes = await fetchAllLecturerNotes();
          setNotes(allNotes);
        }
      } else if (!selectedCourse && !selectedUnit) {
        try {
          const allNotes = await fetchAllLecturerNotes();
          setNotes(allNotes);
        } catch (err) {
          console.error("Error loading all notes:", err);
        }
      }
    };

    if (!loading) {
      loadFilteredNotes();
    }
  }, [selectedCourse, selectedUnit, loading]);

  const handleUpload = async (courseId: number, unitId: number, formData: FormData) => {
    try {
      setUploading(true);
      await uploadNote(courseId, unitId, formData);

      const updatedNotes =
        selectedCourse && selectedUnit
          ? await fetchNotesForCourseUnit(selectedCourse, selectedUnit)
          : await fetchAllLecturerNotes();
      setNotes(updatedNotes);

      setShowUploadForm(false);
      alert("Note uploaded successfully!");
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to upload note");
    } finally {
      setUploading(false);
    }
  };

  const handleDownload = async (noteId: number) => {
    try {
      await downloadNote(noteId);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to download note");
    }
  };

  const handleDelete = async (noteId: number) => {
    if (!confirm("Are you sure you want to delete this note?")) {
      return;
    }

    try {
      await deleteNote(noteId);

      const updatedNotes =
        selectedCourse && selectedUnit
          ? await fetchNotesForCourseUnit(selectedCourse, selectedUnit)
          : await fetchAllLecturerNotes();
      setNotes(updatedNotes);

      alert("Note deleted successfully!");
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to delete note");
    }
  };

  const filteredNotes = notes.filter((note) => {
    const matchesSearch =
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.original_filename.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCourse = !selectedCourse || note.course_id === selectedCourse;
    const matchesUnit = !selectedUnit || note.unit_id === selectedUnit;

    return matchesSearch && matchesCourse && matchesUnit;
  });

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
      {/* Mock Sidebar for spacing */}
      <Sidebar />
      
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:ml-64">
        <TopHeader onSidebarToggle={() => setSidebarOpen(true)} onRefresh={loadData} onCourseToggle={handleCourseToggle}     // Add this
  coursesPanelOpen={coursesPanelOpen} />

        <main className="flex-1 p-6 max-w-8xl mx-auto w-full">
          {/* Search and Actions Bar */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
              <div className="flex-1 max-w-md">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search notes, filenames, or descriptions..."
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
                  Add Note
                </button>
              </div>
            </div>
          </div>
   

          {/* Upload Form */}
          {showUploadForm && (
            <UploadForm
              courses={courses}
              units={units}
              onUpload={handleUpload}
              onCancel={() => setShowUploadForm(false)}
              loading={uploading}
            />
          )}

          {/* Course and Unit Filter */}
          <CourseUnitFilter
            courses={courses}
            units={units}
            selectedCourse={selectedCourse}
            selectedUnit={selectedUnit}
            onCourseChange={setSelectedCourse}
            onUnitChange={setSelectedUnit}
            loading={loading}
          />

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
                  <p className="text-gray-600 font-medium">Loading your notes...</p>
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
                  <h3 className="text-xl font-bold text-gray-900 mb-2">No notes found</h3>
                  <p className="text-gray-600 mb-6">
                    {searchQuery || selectedCourse || selectedUnit
                      ? "No notes match your current search or filter criteria."
                      : "Upload your first note to get started with your digital library!"}
                  </p>
                  {!searchQuery && !selectedCourse && !selectedUnit && (
                    <button
                      onClick={() => setShowUploadForm(true)}
                      className="bg-gradient-to-r from-emerald-600 to-green-600 text-white px-6 py-3 rounded-xl hover:from-emerald-700 hover:to-green-700 transition-all duration-200 flex items-center mx-auto font-semibold shadow-lg hover:shadow-xl"
                    >
                      <PlusCircle className="w-5 h-5 mr-2" />
                      Upload First Note
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
                  <div className="text-blue-600">Total Notes</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-800">{filteredNotes.length}</div>
                  <div className="text-blue-600">Filtered Notes</div>
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
              {(selectedCourse || selectedUnit) && (
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
                  </div>
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Page;