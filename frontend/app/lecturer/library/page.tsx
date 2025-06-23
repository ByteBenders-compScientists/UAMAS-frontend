"use client";
import React, { useState, useEffect } from "react";
import Sidebar from '@/components/lecturerSidebar';
import {
  BookMarked,
  BarChart3,
  Clock,
  Monitor,
  Loader,
  Plus,
  Star,
  User,
  Users,
  Bell,
  Menu,
  X,
  Text as LetterText,
  ChevronDown,
  ChevronUp,
  GraduationCap,
  FileText,
  MessageSquare,
  Library,
  Settings,
  Upload,
  Image,
  Calendar,
  File,
  CheckCircle,
  AlertCircle,
  BookOpen,
  ChevronRight,
  Download,
  MessageCircle,
  Book,
  Search,
  Filter,
  Grid,
  List,
  Eye,
  Edit,
  Trash2,
  PlusCircle,
  FolderPlus,
  Share2,
  ExternalLink,
} from "lucide-react";

// ===== CONSTANTS =====
const API_BASE_URL = "http://localhost:8080/api/v1";

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
    const response = await fetch(`${API_BASE_URL}/bd/courses`, {
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
    const response = await fetch(`${API_BASE_URL}/bd/units`, {
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
      `${API_BASE_URL}/bd/courses/${courseId}/units/${unitId}/notes`,
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
): Promise<any> => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/bd/lecturer/courses/${courseId}/units/${unitId}/notes`,
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
    const response = await fetch(`${API_BASE_URL}/bd/notes/${noteId}`, {
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
    pdf: "bg-red-100 text-red-700",
    doc: "bg-blue-100 text-blue-700",
    docx: "bg-blue-100 text-blue-700",
    ppt: "bg-orange-100 text-orange-700",
    pptx: "bg-orange-100 text-orange-700",
  };
  return colors[fileType as keyof typeof colors] || "bg-gray-100 text-gray-700";
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

const TopHeader: React.FC<{ onSidebarToggle: () => void }> = ({
  onSidebarToggle,
}) => (
  <header className="flex items-center justify-between px-4 py-4 lg:py-6 bg-white border-b border-gray-200 shadow-sm lg:shadow-none">
    <div className="flex items-center space-x-3">
      <button
        className="lg:hidden text-rose-600 hover:text-rose-800 transition-colors"
        onClick={onSidebarToggle}
        aria-label="Open sidebar"
      >
        <Menu className="w-6 h-6" />
      </button>
      <span className="text-xl font-bold text-rose-600 hidden lg:inline">
        EduPortal
      </span>
    </div>
    <div className="flex items-center space-x-4">
      <button className="relative text-gray-500 hover:text-rose-600 transition-colors">
        <Bell className="w-6 h-6" />
        <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-xs rounded-full px-1.5 py-0.5">
          3
        </span>
      </button>
      <div className="flex items-center space-x-2">
        <div className="w-8 h-8 bg-rose-200 rounded-full flex items-center justify-center">
          <User className="w-4 h-4 text-rose-600" />
        </div>
        <span className="text-sm font-semibold text-gray-700 hidden md:inline">
          Dr. Alex Kimani
        </span>
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
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 lg:p-6 mb-6">
        <div className="flex items-center justify-center py-8">
          <Loader className="w-6 h-6 animate-spin text-rose-600" />
          <span className="ml-2 text-gray-600">
            Loading courses and units...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 lg:p-6 mb-6">
      <h3 className="font-bold text-lg mb-4 flex items-center">
        <Filter className="w-5 h-5 mr-2 text-rose-600" />
        Filter by Course & Unit
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Course Dropdown */}
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Course
          </label>
          <button
            onClick={() => setCourseDropdownOpen(!courseDropdownOpen)}
            className="w-full text-left p-3 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 transition-colors flex items-center justify-between"
          >
            <span
              className={selectedCourseData ? "text-gray-900" : "text-gray-500"}
            >
              {selectedCourseData
                ? `${selectedCourseData.code} - ${selectedCourseData.name}`
                : "Select a course"}
            </span>
            <ChevronDown
              className={`w-4 h-4 transition-transform ${
                courseDropdownOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {courseDropdownOpen && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto">
              <button
                onClick={() => {
                  onCourseChange(null);
                  onUnitChange(null);
                  setCourseDropdownOpen(false);
                }}
                className="w-full text-left p-3 hover:bg-gray-50 transition-colors border-b border-gray-100"
              >
                <span className="text-gray-600">All Courses</span>
              </button>
              {courses.map((course) => (
                <button
                  key={course.id}
                  onClick={() => {
                    onCourseChange(course.id);
                    setCourseDropdownOpen(false);
                  }}
                  className={`w-full text-left p-3 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0 ${
                    selectedCourse === course.id
                      ? "bg-rose-50 text-rose-700"
                      : ""
                  }`}
                >
                  <div>
                    <div className="font-medium">{course.code}</div>
                    <div className="text-sm text-gray-600">{course.name}</div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Unit Dropdown */}
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Unit
          </label>
          <button
            onClick={() => setUnitDropdownOpen(!unitDropdownOpen)}
            disabled={!selectedCourse}
            className={`w-full text-left p-3 border border-gray-300 rounded-lg transition-colors flex items-center justify-between ${
              !selectedCourse
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-white hover:bg-gray-50"
            }`}
          >
            <span
              className={selectedUnitData ? "text-gray-900" : "text-gray-500"}
            >
              {!selectedCourse
                ? "Select a course first"
                : selectedUnitData
                ? `${selectedUnitData.unit_code} - ${selectedUnitData.unit_name}`
                : "Select a unit"}
            </span>
            <ChevronDown
              className={`w-4 h-4 transition-transform ${
                unitDropdownOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {unitDropdownOpen && selectedCourse && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto">
              <button
                onClick={() => {
                  onUnitChange(null);
                  setUnitDropdownOpen(false);
                }}
                className="w-full text-left p-3 hover:bg-gray-50 transition-colors border-b border-gray-100"
              >
                <span className="text-gray-600">All Units</span>
              </button>
              {filteredUnits.map((unit) => (
                <button
                  key={unit.id}
                  onClick={() => {
                    onUnitChange(unit.id);
                    setUnitDropdownOpen(false);
                  }}
                  className={`w-full text-left p-3 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0 ${
                    selectedUnit === unit.id ? "bg-rose-50 text-rose-700" : ""
                  }`}
                >
                  <div>
                    <div className="font-medium">{unit.unit_code}</div>
                    <div className="text-sm text-gray-600">
                      {unit.unit_name}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Selected filters display */}
      {(selectedCourse || selectedUnit) && (
        <div className="mt-4 flex flex-wrap gap-2">
          {selectedCourse && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-rose-100 text-rose-700">
              Course: {selectedCourseData?.code}
              <button
                onClick={() => {
                  onCourseChange(null);
                  onUnitChange(null);
                }}
                className="ml-2 hover:text-rose-900"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {selectedUnit && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-700">
              Unit: {selectedUnitData?.unit_code}
              <button
                onClick={() => onUnitChange(null)}
                className="ml-2 hover:text-blue-900"
              >
                <X className="w-3 h-3" />
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
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 hover:shadow-md transition-shadow">
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0">
            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
              <Icon className="w-6 h-6 text-gray-600" />
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <h3 className="font-semibold text-gray-900 truncate">
                {note.title}
              </h3>
              <div className="flex items-center space-x-2 ml-4">
                <span
                  className={`px-2 py-1 rounded text-xs font-medium ${getFileTypeColor(
                    note.file_type
                  )}`}
                >
                  {note.file_type.toUpperCase()}
                </span>
              </div>
            </div>
            <p className="text-sm text-gray-600 mt-1">
              {note.original_filename}
            </p>
            {note.description && (
              <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                {note.description}
              </p>
            )}

            {/* Course and Unit info */}
            <div className="flex items-center space-x-4 mt-2">
              <span className="text-xs bg-rose-100 text-rose-700 px-2 py-1 rounded">
                {course.code}
              </span>
              <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                {unit.unit_code}
              </span>
            </div>

            <div className="flex items-center justify-between mt-3">
              <div className="flex items-center space-x-4 text-xs text-gray-500">
                <span>{formatDate(note.created_at)}</span>
                <span>{formatFileSize(note.file_size)}</span>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => onDownload(note.id)}
                  className="text-rose-600 hover:text-rose-800 transition-colors"
                  title="Download"
                >
                  <Download className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onDelete(note.id)}
                  className="text-red-600 hover:text-red-800 transition-colors"
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
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
          <Icon className="w-6 h-6 text-gray-600" />
        </div>
        <span
          className={`px-2 py-1 rounded text-xs font-medium ${getFileTypeColor(
            note.file_type
          )}`}
        >
          {note.file_type.toUpperCase()}
        </span>
      </div>

      <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
        {note.title}
      </h3>
      <p className="text-sm text-gray-600 mb-2">{note.original_filename}</p>
      {note.description && (
        <p className="text-sm text-gray-500 mb-3 line-clamp-3">
          {note.description}
        </p>
      )}

      {/* Course and Unit info */}
      <div className="flex flex-wrap gap-1 mb-3">
        <span className="px-2 py-1 bg-rose-100 text-rose-700 text-xs rounded">
          {course.code}
        </span>
        <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">
          {unit.unit_code}
        </span>
      </div>

      <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
        <span>{formatDate(note.created_at)}</span>
        <span>{formatFileSize(note.file_size)}</span>
      </div>

      <div className="flex items-center justify-between">
        <span className="text-xs text-gray-500">Uploaded by you</span>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => onDownload(note.id)}
            className="text-rose-600 hover:text-rose-800 transition-colors"
            title="Download"
          >
            <Download className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(note.id)}
            className="text-red-600 hover:text-red-800 transition-colors"
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
  onUpload: (formData: FormData) => Promise<void>;
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
    courseId: "",
    unitId: "",
    description: "",
    file: null as File | null,
  });

  const filteredUnits = formData.courseId
    ? units.filter((unit) => unit.course_id === parseInt(formData.courseId))
    : [];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.file || !formData.courseId || !formData.unitId) {
      alert("Please fill in all required fields and select a file.");
      return;
    }

    const uploadFormData = new FormData();
    uploadFormData.append("title", formData.title);
    uploadFormData.append("description", formData.description);
    uploadFormData.append("file", formData.file);

    await onUpload(uploadFormData);

    // Reset form
    setFormData({
      title: "",
      courseId: "",
      unitId: "",
      description: "",
      file: null,
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 lg:p-6 mb-6">
      <h3 className="font-bold text-lg mb-4">Upload New Note</h3>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Note Title *"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            className="border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
            required
            disabled={loading}
          />
          <select
            value={formData.courseId}
            onChange={(e) =>
              setFormData({ ...formData, courseId: e.target.value, unitId: "" })
            }
            className="border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
            required
            disabled={loading}
          >
            <option value="">Select Course *</option>
            {courses.map((course) => (
              <option key={course.id} value={course.id}>
                {course.code} - {course.name}
              </option>
            ))}
          </select>
          <select
            value={formData.unitId}
            onChange={(e) =>
              setFormData({ ...formData, unitId: e.target.value })
            }
            className="border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
            disabled={!formData.courseId || loading}
            required
          >
            <option value="">Select Unit *</option>
            {filteredUnits.map((unit) => (
              <option key={unit.id} value={unit.id}>
                {unit.unit_code} - {unit.unit_name}
              </option>
            ))}
          </select>
          <input
            type="file"
            onChange={(e) =>
              setFormData({ ...formData, file: e.target.files?.[0] || null })
            }
            className="border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
            accept=".pdf,.doc,.docx,.ppt,.pptx"
            required
            disabled={loading}
          />
          <textarea
            placeholder="Description (optional)"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            className="border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent md:col-span-2"
            rows={3}
            disabled={loading}
          />
          <div className="md:col-span-2 flex space-x-3">
            <button
              type="submit"
              disabled={loading}
              className="bg-rose-600 text-white px-4 py-2 rounded-lg hover:bg-rose-700 transition-colors flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <Loader className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Upload className="w-4 h-4 mr-2" />
              )}
              {loading ? "Uploading..." : "Upload Note"}
            </button>
            <button
              type="button"
              onClick={onCancel}
              disabled={loading}
              className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
  const [createDropdownOpen, setCreateDropdownOpen] = useState(false);
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
  useEffect(() => {
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

  const toggleCreateDropdown = () => setCreateDropdownOpen(!createDropdownOpen);

  const handleUpload = async (formData: FormData) => {
    if (!selectedCourse || !selectedUnit) {
      alert("Please select a course and unit first.");
      return;
    }

    try {
      setUploading(true);
      await uploadNote(selectedCourse, selectedUnit, formData);

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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Error Loading Data
          </h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-rose-600 text-white px-4 py-2 rounded-lg hover:bg-rose-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <Sidebar/>
      <div className="flex-1 flex flex-col">
        <TopHeader onSidebarToggle={toggleCreateDropdown} />

        <main className="flex-1 p-4 lg:p-6 max-w-7xl mx-auto w-full">
          <div className="mb-6">
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-800">
              Notes Library
            </h1>
            <p className="text-gray-600 mt-2">
              Manage and access your course notes and materials.
            </p>
          </div>

          {/* Search and Actions Bar */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 lg:p-6 mb-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
              <div className="flex-1 max-w-md">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search notes..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-1 border border-gray-300 rounded-lg p-1">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-2 rounded transition-colors ${
                      viewMode === "grid"
                        ? "bg-rose-100 text-rose-600"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    <Grid className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-2 rounded transition-colors ${
                      viewMode === "list"
                        ? "bg-rose-100 text-rose-600"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>

                <button
                  onClick={() => setShowUploadForm(!showUploadForm)}
                  className="bg-rose-600 text-white px-4 py-2 rounded-lg hover:bg-rose-700 transition-colors flex items-center"
                >
                  <PlusCircle className="w-4 h-4 mr-2" />
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
              <div className="col-span-full flex items-center justify-center py-12">
                <Loader className="w-8 h-8 animate-spin text-rose-600 mr-3" />
                <span className="text-gray-600">Loading notes...</span>
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
              <div className="col-span-full text-center text-gray-500 py-12">
                <Library className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-semibold mb-2">No notes found</h3>
                <p>
                  No notes found matching your criteria. Upload your first note
                  to get started!
                </p>
              </div>
            )}
          </div>

          {/* Summary Stats */}
          {!loading && (
            <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-semibold text-blue-800 mb-2">
                Notes Summary:
              </h4>
              <div className="text-sm text-blue-700 space-y-1">
                <p>Total Notes: {notes.length}</p>
                <p>Filtered Notes: {filteredNotes.length}</p>
                <p>Courses: {courses.length}</p>
                <p>Units: {units.length}</p>
                {selectedCourse && (
                  <p>
                    Selected Course:{" "}
                    {courses.find((c) => c.id === selectedCourse)?.name}
                  </p>
                )}
                {selectedUnit && (
                  <p>
                    Selected Unit:{" "}
                    {units.find((u) => u.id === selectedUnit)?.unit_name}
                  </p>
                )}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Page;
