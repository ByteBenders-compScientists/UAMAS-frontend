"use client";
import React, { useState, useEffect } from "react";
import Sidebar from '@/components/lecturerSidebar';
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
  RefreshCw
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
    a.download = ""; // Filename will be set by the server
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

// ===== UTILITY FUNCTIONS =====
const formatDate = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
  };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

const getFileTypeIcon = (fileType: string) => {
  const icons = {
    pdf: FileText,
    doc: FileText,
    docx: FileText,
    ppt: File,
    pptx: File,
  };
  return icons[fileType as keyof typeof icons] || File;
};

const getFileTypeColor = (fileType: string) => {
  const colors = {
    pdf: "bg-red-100 text-red-700 border-red-200",
    doc: "bg-blue-100 text-blue-700 border-blue-200",
    docx: "bg-blue-100 text-blue-700 border-blue-200",
    ppt: "bg-orange-100 text-orange-700 border-orange-200",
    pptx: "bg-orange-100 text-orange-700 border-orange-200",
  };
  return colors[fileType as keyof typeof colors] || "bg-gray-100 text-gray-700 border-gray-200";
};

// ===== COMPONENTS =====
const TopHeader: React.FC<{ onSidebarToggle: () => void; onRefresh: () => void }> = ({
  onSidebarToggle,
  onRefresh,
}) => (
  <header className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-200 shadow-sm">
    <div className="flex items-center space-x-4">
      <button
        className="lg:hidden text-emerald-600 hover:text-emerald-800 transition-colors p-2 rounded-lg hover:bg-emerald-50"
        onClick={onSidebarToggle}
        aria-label="Open sidebar"
      >
        <Menu className="w-6 h-6" />
      </button>
      <div className="flex items-center space-x-3">
        <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-green-600 rounded-lg flex items-center justify-center">
          <Library className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-gray-900">Notes Library</h1>
          <p className="text-sm text-gray-500 hidden sm:block">Manage your course materials</p>
        </div>
      </div>
    </div>
    
    <div className="flex items-center space-x-3">
      <button 
        onClick={onRefresh}
        className="p-2 text-gray-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
        title="Refresh"
      >
        <RefreshCw className="w-5 h-5" />
      </button>
      <button className="relative text-gray-500 hover:text-emerald-600 transition-colors p-2 rounded-lg hover:bg-emerald-50">
        <Bell className="w-5 h-5" />
        <span className="absolute -top-1 -right-1 bg-emerald-500 text-white text-xs rounded-full px-1.5 py-0.5 min-w-[18px] text-center">
          3
        </span>
      </button>
      <div className="flex items-center space-x-3 pl-3 border-l border-gray-200">
        <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-green-500 rounded-full flex items-center justify-center">
          <User className="w-4 h-4 text-white" />
        </div>
        <div className="hidden md:block">
          <p className="text-sm font-semibold text-gray-900">Dr. Alex Kimani</p>
          <p className="text-xs text-gray-500">Senior Lecturer</p>
        </div>
      </div>
    </div>
  </header>
);

interface CourseUnitFilterProps {
  courses: Course[];
  units: Unit[];
  selectedCourse: number | null;
  selectedUnit: number | null;
  onCourseChange: (courseId: number | null) => void;
  onUnitChange: (unitId: number | null) => void;
  loading?: boolean;
}

const CourseUnitFilter: React.FC<CourseUnitFilterProps> = ({
  courses,
  units,
  selectedCourse,
  selectedUnit,
  onCourseChange,
  onUnitChange,
  loading = false,
}) => {
  const [courseDropdownOpen, setCourseDropdownOpen] = useState(false);
  const [unitDropdownOpen, setUnitDropdownOpen] = useState(false);

  // Filter units based on selected course
  const filteredUnits = selectedCourse
    ? units.filter((unit) => unit.course_id === selectedCourse)
    : [];

  const selectedCourseData = courses.find(
    (course) => course.id === selectedCourse
  );
  const selectedUnitData = units.find((unit) => unit.id === selectedUnit);

  // Reset unit selection when course changes
  useEffect(() => {
    if (selectedCourse && selectedUnit) {
      const unitBelongsToCourse = units.find(
        (unit) => unit.id === selectedUnit && unit.course_id === selectedCourse
      );
      if (!unitBelongsToCourse) {
        onUnitChange(null);
      }
    }
  }, [selectedCourse, selectedUnit, units, onUnitChange]);

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
        <div className="flex items-center justify-center py-8">
          <Loader className="w-6 h-6 animate-spin text-emerald-600" />
          <span className="ml-3 text-gray-600">Loading courses and units...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-bold text-lg flex items-center text-gray-900">
          <Filter className="w-5 h-5 mr-2 text-emerald-600" />
          Filter by Course & Unit
        </h3>
        {(selectedCourse || selectedUnit) && (
          <button
            onClick={() => {
              onCourseChange(null);
              onUnitChange(null);
            }}
            className="text-sm text-emerald-600 hover:text-emerald-800 font-medium"
          >
            Clear Filters
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Course Dropdown */}
        <div className="relative">
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Course
          </label>
          <button
            onClick={() => setCourseDropdownOpen(!courseDropdownOpen)}
            className="w-full text-left p-4 border border-gray-200 rounded-xl bg-white hover:bg-gray-50 transition-all duration-200 flex items-center justify-between shadow-sm hover:shadow-md"
          >
            <span className={selectedCourseData ? "text-gray-900 font-medium" : "text-gray-500"}>
              {selectedCourseData
                ? `${selectedCourseData.code} - ${selectedCourseData.name}`
                : "Select a course"}
            </span>
            <ChevronDown
              className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${
                courseDropdownOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {courseDropdownOpen && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg z-20 max-h-64 overflow-y-auto">
              <button
                onClick={() => {
                  onCourseChange(null);
                  onUnitChange(null);
                  setCourseDropdownOpen(false);
                }}
                className="w-full text-left p-4 hover:bg-gray-50 transition-colors border-b border-gray-100"
              >
                <span className="text-gray-600 font-medium">All Courses</span>
              </button>
              {courses.map((course) => (
                <button
                  key={course.id}
                  onClick={() => {
                    onCourseChange(course.id);
                    setCourseDropdownOpen(false);
                  }}
                  className={`w-full text-left p-4 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0 ${
                    selectedCourse === course.id ? "bg-emerald-50 text-emerald-700" : ""
                  }`}
                >
                  <div>
                    <div className="font-semibold text-gray-900">{course.code}</div>
                    <div className="text-sm text-gray-600 mt-1">{course.name}</div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Unit Dropdown */}
        <div className="relative">
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Unit
          </label>
          <button
            onClick={() => setUnitDropdownOpen(!unitDropdownOpen)}
            disabled={!selectedCourse}
            className={`w-full text-left p-4 border border-gray-200 rounded-xl transition-all duration-200 flex items-center justify-between shadow-sm ${
              !selectedCourse
                ? "bg-gray-50 text-gray-400 cursor-not-allowed"
                : "bg-white hover:bg-gray-50 hover:shadow-md"
            }`}
          >
            <span className={selectedUnitData ? "text-gray-900 font-medium" : "text-gray-500"}>
              {!selectedCourse
                ? "Select a course first"
                : selectedUnitData
                ? `${selectedUnitData.unit_code} - ${selectedUnitData.unit_name}`
                : "Select a unit"}
            </span>
            <ChevronDown
              className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${
                unitDropdownOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {unitDropdownOpen && selectedCourse && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg z-20 max-h-64 overflow-y-auto">
              <button
                onClick={() => {
                  onUnitChange(null);
                  setUnitDropdownOpen(false);
                }}
                className="w-full text-left p-4 hover:bg-gray-50 transition-colors border-b border-gray-100"
              >
                <span className="text-gray-600 font-medium">All Units</span>
              </button>
              {filteredUnits.map((unit) => (
                <button
                  key={unit.id}
                  onClick={() => {
                    onUnitChange(unit.id);
                    setUnitDropdownOpen(false);
                  }}
                  className={`w-full text-left p-4 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0 ${
                    selectedUnit === unit.id ? "bg-emerald-50 text-emerald-700" : ""
                  }`}
                >
                  <div>
                    <div className="font-semibold text-gray-900">{unit.unit_code}</div>
                    <div className="text-sm text-gray-600 mt-1">{unit.unit_name}</div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Selected filters display */}
      {(selectedCourse || selectedUnit) && (
        <div className="mt-6 flex flex-wrap gap-2">
          {selectedCourse && (
            <span className="inline-flex items-center px-3 py-2 rounded-full text-sm bg-emerald-100 text-emerald-700 border border-emerald-200">
              <span className="font-medium">Course: {selectedCourseData?.code}</span>
              <button
                onClick={() => {
                  onCourseChange(null);
                  onUnitChange(null);
                }}
                className="ml-2 hover:text-emerald-900 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </span>
          )}
          {selectedUnit && (
            <span className="inline-flex items-center px-3 py-2 rounded-full text-sm bg-blue-100 text-blue-700 border border-blue-200">
              <span className="font-medium">Unit: {selectedUnitData?.unit_code}</span>
              <button
                onClick={() => onUnitChange(null)}
                className="ml-2 hover:text-blue-900 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </span>
          )}
        </div>
      )}
    </div>
  );
};

interface NoteCardProps {
  note: Note;
  course: Course;
  unit: Unit;
  viewMode: "grid" | "list";
  onDownload: (noteId: number) => void;
  onDelete: (noteId: number) => void;
}

const NoteCard: React.FC<NoteCardProps> = ({
  note,
  course,
  unit,
  viewMode,
  onDownload,
  onDelete,
}) => {
  const Icon = getFileTypeIcon(note.file_type);

  if (viewMode === "list") {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all duration-200">
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0">
            <div className="w-14 h-14 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center">
              <Icon className="w-7 h-7 text-gray-600" />
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <h3 className="font-bold text-gray-900 text-lg mb-1 line-clamp-1">
                {note.title}
              </h3>
              <div className="flex items-center space-x-2 ml-4">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getFileTypeColor(note.file_type)}`}>
                  {note.file_type.toUpperCase()}
                </span>
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-2 font-medium">
              {note.original_filename}
            </p>
            {note.description && (
              <p className="text-sm text-gray-500 mb-3 line-clamp-2">
                {note.description}
              </p>
            )}

            {/* Course and Unit info */}
            <div className="flex items-center space-x-3 mb-4">
              <span className="text-xs bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full font-semibold border border-emerald-200">
                {course.code}
              </span>
              <span className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-semibold border border-blue-200">
                {unit.unit_code}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4 text-xs text-gray-500">
                <span className="flex items-center">
                  <Calendar className="w-3 h-3 mr-1" />
                  {formatDate(note.created_at)}
                </span>
                <span className="flex items-center">
                  <File className="w-3 h-3 mr-1" />
                  {formatFileSize(note.file_size)}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => onDownload(note.id)}
                  className="p-2 text-emerald-600 hover:text-emerald-800 hover:bg-emerald-50 rounded-lg transition-all duration-200"
                  title="Download"
                >
                  <Download className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onDelete(note.id)}
                  className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-all duration-200"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-lg transition-all duration-300 group">
      <div className="flex items-start justify-between mb-4">
        <div className="w-14 h-14 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform duration-200">
          <Icon className="w-7 h-7 text-gray-600" />
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getFileTypeColor(note.file_type)}`}>
          {note.file_type.toUpperCase()}
        </span>
      </div>

      <h3 className="font-bold text-gray-900 text-lg mb-2 line-clamp-2 group-hover:text-emerald-600 transition-colors">
        {note.title}
      </h3>
      <p className="text-sm text-gray-600 mb-2 font-medium">{note.original_filename}</p>
      {note.description && (
        <p className="text-sm text-gray-500 mb-4 line-clamp-3">
          {note.description}
        </p>
      )}

      {/* Course and Unit info */}
      <div className="flex flex-wrap gap-2 mb-4">
        <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-xs rounded-full font-semibold border border-emerald-200">
          {course.code}
        </span>
        <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs rounded-full font-semibold border border-blue-200">
          {unit.unit_code}
        </span>
      </div>

      <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
        <span className="flex items-center">
          <Calendar className="w-3 h-3 mr-1" />
          {formatDate(note.created_at)}
        </span>
        <span className="flex items-center">
          <File className="w-3 h-3 mr-1" />
          {formatFileSize(note.file_size)}
        </span>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <span className="text-xs text-gray-500 font-medium">Uploaded by you</span>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => onDownload(note.id)}
            className="p-2 text-emerald-600 hover:text-emerald-800 hover:bg-emerald-50 rounded-lg transition-all duration-200"
            title="Download"
          >
            <Download className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(note.id)}
            className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-all duration-200"
            title="Delete"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

interface UploadFormProps {
  courses: Course[];
  units: Unit[];
  onUpload: (courseId: number, unitId: number, formData: FormData) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

const UploadForm: React.FC<UploadFormProps> = ({
  courses,
  units,
  onUpload,
  onCancel,
  loading = false,
}) => {
  const [formData, setFormData] = useState({
    title: "",
    courseId: null as number | null,
    unitId: null as number | null,
    description: "",
    file: null as File | null,
  });

  const [courseDropdownOpen, setCourseDropdownOpen] = useState(false);
  const [unitDropdownOpen, setUnitDropdownOpen] = useState(false);

  // Filter units based on selected course
  const filteredUnits = formData.courseId
    ? units.filter((unit) => unit.course_id === formData.courseId)
    : [];

  const selectedCourseData = courses.find(
    (course) => course.id === formData.courseId
  );
  const selectedUnitData = units.find((unit) => unit.id === formData.unitId);

  // Reset unit when course changes
  useEffect(() => {
    if (formData.courseId && formData.unitId) {
      const unitBelongsToCourse = units.find(
        (unit) => unit.id === formData.unitId && unit.course_id === formData.courseId
      );
      if (!unitBelongsToCourse) {
        setFormData(prev => ({ ...prev, unitId: null }));
      }
    }
  }, [formData.courseId, formData.unitId, units]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.file || !formData.courseId || !formData.unitId || !formData.title.trim()) {
      alert("Please fill in all required fields and select a file.");
      return;
    }

    const uploadFormData = new FormData();
    uploadFormData.append("title", formData.title.trim());
    uploadFormData.append("description", formData.description.trim());
    uploadFormData.append("file", formData.file);

    await onUpload(formData.courseId, formData.unitId, uploadFormData);

    // Reset form
    setFormData({
      title: "",
      courseId: null,
      unitId: null,
      description: "",
      file: null,
    });
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-bold text-xl flex items-center text-gray-900">
          <Upload className="w-6 h-6 mr-3 text-emerald-600" />
          Upload New Notes
        </h3>
        <button
          onClick={onCancel}
          disabled={loading}
          className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Note Title *
            </label>
            <input
              type="text"
              placeholder="Enter a descriptive title for your note"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 shadow-sm"
              required
              disabled={loading}
            />
          </div>

          {/* Course Dropdown */}
          <div className="relative">
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Course *
            </label>
            <button
              type="button"
              onClick={() => setCourseDropdownOpen(!courseDropdownOpen)}
              disabled={loading}
              className="w-full text-left p-4 border border-gray-200 rounded-xl bg-white hover:bg-gray-50 transition-all duration-200 flex items-center justify-between shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className={selectedCourseData ? "text-gray-900 font-medium" : "text-gray-500"}>
                {selectedCourseData
                  ? `${selectedCourseData.code} - ${selectedCourseData.name}`
                  : "Select a course"}
              </span>
              <ChevronDown
                className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${
                  courseDropdownOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {courseDropdownOpen && !loading && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg z-20 max-h-64 overflow-y-auto">
                {courses.map((course) => (
                  <button
                    key={course.id}
                    type="button"
                    onClick={() => {
                      setFormData({ ...formData, courseId: course.id, unitId: null });
                      setCourseDropdownOpen(false);
                    }}
                    className={`w-full text-left p-4 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0 ${
                      formData.courseId === course.id ? "bg-emerald-50 text-emerald-700" : ""
                    }`}
                  >
                    <div>
                      <div className="font-semibold text-gray-900">{course.code}</div>
                      <div className="text-sm text-gray-600 mt-1">{course.name}</div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Unit Dropdown */}
          <div className="relative">
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Unit *
            </label>
            <button
              type="button"
              onClick={() => setUnitDropdownOpen(!unitDropdownOpen)}
              disabled={!formData.courseId || loading}
              className={`w-full text-left p-4 border border-gray-200 rounded-xl transition-all duration-200 flex items-center justify-between shadow-sm ${
                !formData.courseId || loading
                  ? "bg-gray-50 text-gray-400 cursor-not-allowed"
                  : "bg-white hover:bg-gray-50 hover:shadow-md"
              }`}
            >
              <span className={selectedUnitData ? "text-gray-900 font-medium" : "text-gray-500"}>
                {!formData.courseId
                  ? "Select a course first"
                  : selectedUnitData
                  ? `${selectedUnitData.unit_code} - ${selectedUnitData.unit_name}`
                  : "Select a unit"}
              </span>
              <ChevronDown
                className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${
                  unitDropdownOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {unitDropdownOpen && formData.courseId && !loading && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg z-20 max-h-64 overflow-y-auto">
                {filteredUnits.length > 0 ? (
                  filteredUnits.map((unit) => (
                    <button
                      key={unit.id}
                      type="button"
                      onClick={() => {
                        setFormData({ ...formData, unitId: unit.id });
                        setUnitDropdownOpen(false);
                      }}
                      className={`w-full text-left p-4 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0 ${
                        formData.unitId === unit.id ? "bg-emerald-50 text-emerald-700" : ""
                      }`}
                    >
                      <div>
                        <div className="font-semibold text-gray-900">{unit.unit_code}</div>
                        <div className="text-sm text-gray-600 mt-1">{unit.unit_name}</div>
                      </div>
                    </button>
                  ))
                ) : (
                  <div className="p-4 text-center text-gray-500">
                    No units found for the selected course
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              File *
            </label>
            <input
              type="file"
              onChange={(e) =>
                setFormData({ ...formData, file: e.target.files?.[0] || null })
              }
              className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 shadow-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100"
              accept=".pdf,.doc,.docx,.ppt,.pptx"
              required
              disabled={loading}
            />
            <p className="text-xs text-gray-500 mt-2">
              Supported formats: PDF, DOC, DOCX, PPT, PPTX (Max 50MB)
            </p>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Description
            </label>
            <textarea
              placeholder="Add a brief description of the note content (optional)"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 shadow-sm resize-none"
              rows={4}
              disabled={loading}
            />
          </div>

          <div className="md:col-span-2 flex space-x-4 pt-4">
            <button
              type="submit"
              disabled={loading || !formData.file || !formData.courseId || !formData.unitId || !formData.title.trim()}
              className="bg-gradient-to-r from-emerald-600 to-green-600 text-white px-6 py-3 rounded-xl hover:from-emerald-700 hover:to-green-700 transition-all duration-200 flex items-center font-semibold shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-lg"
            >
              {loading ? (
                <Loader className="w-5 h-5 mr-2 animate-spin" />
              ) : (
                <Upload className="w-5 h-5 mr-2" />
              )}
              {loading ? "Uploading..." : "Upload Note"}
            </button>
            <button
              type="button"
              onClick={onCancel}
              disabled={loading}
              className="bg-gray-500 text-white px-6 py-3 rounded-xl hover:bg-gray-600 transition-all duration-200 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

const Page: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
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

  // Fetch initial data
  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch courses, units, and lecturer notes in parallel
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
          // Fall back to all lecturer notes
          const allNotes = await fetchAllLecturerNotes();
          setNotes(allNotes);
        }
      } else if (!selectedCourse && !selectedUnit) {
        // Load all lecturer notes when no filters
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

      // Refresh notes
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

      // Refresh notes
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
        <TopHeader onSidebarToggle={() => setSidebarOpen(true)} onRefresh={loadData} />

        <main className="flex-1 p-6 max-w-7xl mx-auto w-full">
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