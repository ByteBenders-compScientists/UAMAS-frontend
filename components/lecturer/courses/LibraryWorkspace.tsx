"use client";

import React, { useEffect, useState } from "react";
import {
  AlertCircle,
  BarChart3,
  File,
  FileText,
  Grid,
  Library,
  List,
  Loader,
  PlusCircle,
  Search,
  Trash2,
  Upload,
} from "lucide-react";
import { useThemeColors } from '@/context/ThemeContext';

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "https://68.221.169.119/api/v1";

// ===== TYPES (copied from original library page, trimmed where possible) =====
interface Note {
  id: string;
  lecturer_id: string;
  course_id: string;
  unit_id: string;
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
  week?: number;
}

interface Course {
  id: string;
  name: string;
  code: string;
}

interface Unit {
  id: string;
  unit_name: string;
  unit_code: string;
  course_id: string;
}

type ViewMode = "grid" | "list";

interface LibraryWorkspaceProps {
  selectedCourseId: string | null;
  selectedUnitId: string | null;
  selectedWeek: number;
}

// ===== API helpers (same as original, but local to this workspace) =====
const fetchCourses = async (): Promise<Course[]> => {
  const response = await fetch(`${API_BASE_URL}/auth/lecturer/courses`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
};

const fetchUnits = async (): Promise<Unit[]> => {
  const response = await fetch(`${API_BASE_URL}/auth/lecturer/units`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
};

const fetchNotesForCourseUnit = async (
  courseId: string,
  unitId: string,
  week?: number
): Promise<Note[]> => {
  let endpoint = `${API_BASE_URL}/bd/units/${unitId}/notes`;
  if (week) {
    endpoint += `?week=${week}`;
  }

  const response = await fetch(endpoint, {
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
};

const uploadNote = async (
  unitId: string,
  week: number,
  formData: FormData
): Promise<unknown> => {
  if (week) {
    formData.append("week", week.toString());
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

  return response.json();
};

const downloadNote = async (noteId: string): Promise<void> => {
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
};

const deleteNote = async (noteId: string): Promise<void> => {
  const response = await fetch(
    `${API_BASE_URL}/bd/lecturer/notes/${noteId}`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    }
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(
      errorData.message || `HTTP error! status: ${response.status}`
    );
  }
};

// ===== Small helpers =====
const formatFileSize = (bytes: number) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
};

// ===== Upload form (simplified) =====
interface UploadFormProps {
  unitId: string | null;
  week: number;
  onUploaded: () => void;
}

const UploadForm: React.FC<UploadFormProps> = ({ unitId, week, onUploaded }) => {
  const colors = useThemeColors();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!unitId) {
      setError("Select a unit in the Courses sidebar first.");
      return;
    }
    if (!title || !description || !file || !week) {
      setError("Title, description, file, and week are required.");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("file", file);
      await uploadNote(unitId, week, formData);
      setTitle("");
      setDescription("");
      setFile(null);
      onUploaded();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to upload material."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="rounded-2xl shadow-sm border p-6 mb-6"
      style={{
        backgroundColor: colors.cardBackground,
        borderColor: colors.border,
      }}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <div 
            className="w-9 h-9 rounded-full flex items-center justify-center"
            style={{ backgroundColor: `${colors.primary}20` }}
          >
            <Upload className="w-4 h-4" style={{ color: colors.primary }} />
          </div>
          <div>
            <h2 className="font-semibold" style={{ color: colors.textPrimary }}>Upload material</h2>
            <p className="text-xs" style={{ color: colors.textSecondary }}>
              Attached to the selected course / unit / week.
            </p>
          </div>
        </div>
      </div>

      {error && (
        <div 
          className="mb-4 flex items-start space-x-2 text-sm rounded-lg p-3"
          style={{
            backgroundColor: `${colors.error}15`,
            color: colors.error,
          }}
        >
          <AlertCircle className="w-4 h-4 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: colors.textPrimary }}>
              Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:border-transparent text-sm"
              style={{
                backgroundColor: colors.inputBackground,
                borderColor: colors.inputBorder,
                color: colors.textPrimary,
              }}
              placeholder="e.g. Week 3 Lecture Notes"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: colors.textPrimary }}>
              Week
            </label>
            <div 
              className="px-3 py-2 border rounded-lg text-sm"
              style={{
                backgroundColor: colors.backgroundTertiary,
                borderColor: colors.border,
                color: colors.textSecondary,
              }}
            >
              Week {week || "—"}
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1" style={{ color: colors.textPrimary }}>
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:border-transparent text-sm min-h-[80px]"
            style={{
              backgroundColor: colors.inputBackground,
              borderColor: colors.inputBorder,
              color: colors.textPrimary,
            }}
            placeholder="Short description for students..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1" style={{ color: colors.textPrimary }}>
            File
          </label>
          <div 
            className="border-2 border-dashed rounded-lg p-4 text-center hover:border-opacity-70 transition-colors"
            style={{
              borderColor: colors.border,
              backgroundColor: colors.backgroundTertiary,
            }}
          >
            <input
              id="library-file-input"
              type="file"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="hidden"
            />
            <label
              htmlFor="library-file-input"
              className="cursor-pointer flex flex-col items-center"
            >
              <File className="w-8 h-8 mb-1" style={{ color: colors.textTertiary }} />
              <span className="text-xs font-medium" style={{ color: colors.primary }}>
                Click to choose a file
              </span>
              <span className="text-[11px]" style={{ color: colors.textTertiary }}>
                PDF, DOCX, PPT, etc.
              </span>
              {file && (
                <span className="mt-2 text-xs" style={{ color: colors.textPrimary }}>
                  {file.name} ({formatFileSize(file.size)})
                </span>
              )}
            </label>
          </div>
        </div>

        <div className="flex justify-end space-x-3">
          <button
            type="submit"
            disabled={loading || !unitId || !week}
            className="px-4 py-2 text-white rounded-lg text-sm font-medium hover:opacity-90 disabled:opacity-50 transition-colors"
            style={{ backgroundColor: colors.primary }}
          >
            {loading ? "Uploading..." : "Upload material"}
          </button>
        </div>
      </form>
    </div>
  );
};

// ===== Note card =====
interface NoteCardProps {
  note: Note;
  course: Course | undefined;
  unit: Unit | undefined;
  viewMode: ViewMode;
  onDownload: (id: string) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

const NoteCard: React.FC<NoteCardProps> = ({
  note,
  course,
  unit,
  viewMode,
  onDownload,
  onDelete,
}) => {
  const colors = useThemeColors();
  const [loading, setLoading] = useState(false);
  const fileExt =
    note.original_filename.split(".").pop()?.toLowerCase() || "";

  const getFileIcon = () => {
    switch (fileExt) {
      case "pdf":
        return <FileText className="w-5 h-5" style={{ color: colors.error }} />;
      case "doc":
      case "docx":
        return <FileText className="w-5 h-5" style={{ color: colors.info }} />;
      case "ppt":
      case "pptx":
        return <FileText className="w-5 h-5" style={{ color: colors.warning }} />;
      default:
        return <File className="w-5 h-5" style={{ color: colors.textTertiary }} />;
    }
  };

  const handleDownload = async () => {
    try {
      setLoading(true);
      await onDownload(note.id);
    } finally {
      setLoading(false);
    }
  };

  if (viewMode === "list") {
    return (
      <div 
        className="rounded-xl shadow-sm border p-4 flex items-start justify-between"
        style={{
          backgroundColor: colors.cardBackground,
          borderColor: colors.border,
        }}
      >
        <div className="flex items-start space-x-3">
          <div 
            className="p-2 rounded-lg"
            style={{ backgroundColor: `${colors.primary}15` }}
          >
            {getFileIcon()}
          </div>
          <div>
            <h3 className="font-semibold text-sm" style={{ color: colors.textPrimary }}>
              {note.title}
            </h3>
            <p className="text-xs mb-1" style={{ color: colors.textSecondary }}>
              {course?.code} · {unit?.unit_code} ·{" "}
              {note.week ? `Week ${note.week}` : "All weeks"}
            </p>
            <p className="text-sm line-clamp-2" style={{ color: colors.textSecondary }}>
              {note.description}
            </p>
          </div>
        </div>
        <div className="flex flex-col items-end space-y-2 ml-4">
          <span className="text-[11px]" style={{ color: colors.textTertiary }}>
            {formatDate(note.created_at)}
          </span>
          <span className="text-[11px]" style={{ color: colors.textSecondary }}>
            {formatFileSize(note.file_size)}
          </span>
          <div className="flex space-x-1">
            <button
              onClick={handleDownload}
              disabled={loading}
              className="px-3 py-1 text-white text-xs rounded-lg hover:opacity-90 transition-colors"
              style={{ backgroundColor: colors.primary }}
            >
              {loading ? "..." : "Download"}
            </button>
            <button
              onClick={() => onDelete(note.id)}
              className="p-1 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
              style={{ color: colors.error }}
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // grid
  return (
    <div 
      className="rounded-xl shadow-sm border p-4 flex flex-col justify-between"
      style={{
        backgroundColor: colors.cardBackground,
        borderColor: colors.border,
      }}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-2">
          <div 
            className="p-2 rounded-lg"
            style={{ backgroundColor: `${colors.primary}15` }}
          >
            {getFileIcon()}
          </div>
          <div>
            <p className="text-[11px]" style={{ color: colors.textSecondary }}>
              {course?.code} · {unit?.unit_code}
            </p>
            {note.week && (
              <p className="text-[11px] font-medium" style={{ color: colors.primary }}>
                Week {note.week}
              </p>
            )}
          </div>
        </div>
        <span className="text-[11px]" style={{ color: colors.textTertiary }}>
          {formatDate(note.created_at)}
        </span>
      </div>
      <h3 className="font-semibold text-sm mb-1" style={{ color: colors.textPrimary }}>
        {note.title}
      </h3>
      <p className="text-xs mb-3 line-clamp-3" style={{ color: colors.textSecondary }}>
        {note.description}
      </p>
      <div className="flex items-center justify-between text-[11px] mb-3" style={{ color: colors.textSecondary }}>
        <span>{note.original_filename}</span>
        <span>{formatFileSize(note.file_size)}</span>
      </div>
      <div className="flex justify-between mt-auto pt-2 border-t" style={{ borderColor: colors.borderLight }}>
        <button
          onClick={handleDownload}
          disabled={loading}
          className="px-3 py-1 text-white text-xs rounded-lg hover:opacity-90 transition-colors"
          style={{ backgroundColor: colors.primary }}
        >
          {loading ? "..." : "Download"}
        </button>
        <button
          onClick={() => onDelete(note.id)}
          className="p-1 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
          style={{ color: colors.error }}
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

// ===== MAIN WORKSPACE COMPONENT =====
const LibraryWorkspace: React.FC<LibraryWorkspaceProps> = ({
  selectedCourseId,
  selectedUnitId,
  selectedWeek,
}) => {
  const colors = useThemeColors();
  const [courses, setCourses] = useState<Course[]>([]);
  const [units, setUnits] = useState<Unit[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [showCreateForm, setShowCreateForm] = useState(false);

  // Keep ids as strings (API and parent components use string ids)
  const courseId = selectedCourseId || null;
  const unitId = selectedUnitId || null;

  const contextCourse = courses.find((c) => c.id === courseId);
  const contextUnit = units.find((u) => u.id === unitId);

  // Load base data (courses/units) once
  useEffect(() => {
    const loadMeta = async () => {
      try {
        setError(null);
        const [c, u] = await Promise.all([fetchCourses(), fetchUnits()]);
        setCourses(c);
        setUnits(u);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load library data."
        );
      }
    };
    loadMeta();
  }, []);

  // Load notes whenever course/unit/week context changes
  useEffect(() => {
    const loadNotes = async () => {
      // If there is no valid string id or week, clear and don't fetch
      if (!courseId || !unitId || !selectedWeek) {
        setNotes([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const list = await fetchNotesForCourseUnit(courseId, unitId, selectedWeek);
        setNotes(list);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load materials.");
        setNotes([]);
      } finally {
        setLoading(false);
      }
    };

    loadNotes();
  }, [courseId, unitId, selectedWeek]);

  const handleUpload = async () => {
    // Called after upload completes to refresh list
    if (!courseId || !unitId || !selectedWeek) return;
    try {
      setUploading(true);
      const list = await fetchNotesForCourseUnit(courseId, unitId, selectedWeek);
      setNotes(list);
    } catch {
      // Ignore, error will be shown on next refresh
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (noteId: string) => {
    if (!confirm("Delete this material?")) return;
    try {
      await deleteNote(noteId);
      setNotes((prev) => prev.filter((n) => n.id !== noteId));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to delete the material.");
    }
  };

  const filteredNotes = notes.filter((n) => {
    const q = searchQuery.toLowerCase();
    return (
      n.title.toLowerCase().includes(q) ||
      n.description.toLowerCase().includes(q) ||
      n.original_filename.toLowerCase().includes(q)
    );
  });

  if (!selectedCourseId || !selectedUnitId || !selectedWeek) {
    return (
      <div 
        className="py-12 text-center rounded-2xl border border-dashed"
        style={{
          backgroundColor: colors.cardBackground,
          borderColor: colors.border,
          color: colors.textSecondary,
        }}
      >
        <Library className="w-10 h-10 mx-auto mb-3" style={{ color: colors.primary }} />
        <p className="font-semibold mb-1" style={{ color: colors.textPrimary }}>
          Select a course, unit, and week in the sidebar to work with Library.
        </p>
        <p className="text-sm" style={{ color: colors.textSecondary }}>
          The shared Courses selection controls which materials you see here.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Context summary */}
      <div 
        className="rounded-2xl shadow-sm border p-4 flex flex-wrap items-center justify-between gap-3"
        style={{
          backgroundColor: colors.cardBackground,
          borderColor: colors.border,
        }}
      >
        <div>
          <p className="text-xs font-semibold uppercase" style={{ color: colors.textTertiary }}>
            Library context
          </p>
          <p className="text-sm" style={{ color: colors.textPrimary }}>
            {contextCourse?.name || "Course"} · {contextUnit?.unit_name || "Unit"}{" "}
            · Week {selectedWeek}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <div 
            className="flex items-center space-x-1 border rounded-xl p-1"
            style={{
              backgroundColor: colors.backgroundTertiary,
              borderColor: colors.border,
            }}
          >
            <button
              onClick={() => setViewMode("grid")}
              className={`p-1.5 rounded-lg ${
                viewMode === "grid"
                  ? ""
                  : ""
              }`}
              style={{
                backgroundColor: viewMode === "grid" ? `${colors.primary}20` : 'transparent',
                color: viewMode === "grid" ? colors.primary : colors.textSecondary,
              }}
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-1.5 rounded-lg ${
                viewMode === "list"
                  ? ""
                  : ""
              }`}
              style={{
                backgroundColor: viewMode === "list" ? `${colors.primary}20` : 'transparent',
                color: viewMode === "list" ? colors.primary : colors.textSecondary,
              }}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Search & upload */}
      <div 
        className="rounded-2xl shadow-sm border p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3"
        style={{
          backgroundColor: colors.cardBackground,
          borderColor: colors.border,
        }}
      >
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4" style={{ color: colors.textTertiary }} />
            <input
              type="text"
              placeholder="Search materials..."
              className="w-full pl-9 pr-3 py-2 border rounded-lg focus:ring-2 focus:border-transparent text-sm"
              style={{
                backgroundColor: colors.inputBackground,
                borderColor: colors.inputBorder,
                color: colors.textPrimary,
              }}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleUpload}
            disabled={uploading}
            className="hidden md:inline-flex items-center px-4 py-2 rounded-lg border text-xs hover:opacity-90 transition-colors"
            style={{
              backgroundColor: colors.backgroundTertiary,
              borderColor: colors.border,
              color: colors.textPrimary,
            }}
          >
            <BarChart3 className="w-4 h-4 mr-1.5" />
            Refresh
          </button>
          <button
            onClick={() => setShowCreateForm(true)}
            className="inline-flex items-center px-4 py-2 rounded-lg text-white text-xs font-semibold hover:opacity-90 transition-colors"
            style={{ backgroundColor: colors.primary }}
          >
            <PlusCircle className="w-4 h-4 mr-1.5" />
            Add material
          </button>
        </div>
      </div>

      {showCreateForm && (
        <UploadForm
          unitId={unitId}
          week={selectedWeek}
          onUploaded={() => {
            setShowCreateForm(false);
            handleUpload();
          }}
        />
      )}

      {/* Notes grid/list */}
      {loading ? (
        <div className="py-12 text-center" style={{ color: colors.textSecondary }}>
          <Loader className="w-6 h-6 animate-spin mx-auto mb-2" style={{ color: colors.primary }} />
          Loading materials...
        </div>
      ) : error ? (
        <div 
          className="py-8 px-4 border rounded-2xl text-sm flex items-center space-x-2"
          style={{
            backgroundColor: `${colors.error}15`,
            borderColor: colors.error,
            color: colors.error,
          }}
        >
          <AlertCircle className="w-4 h-4" />
          <span>{error}</span>
        </div>
      ) : filteredNotes.length === 0 ? (
        <div 
          className="py-12 text-center rounded-2xl border"
          style={{
            backgroundColor: colors.cardBackground,
            borderColor: colors.border,
          }}
        >
          <Library className="w-10 h-10 mx-auto mb-3" style={{ color: colors.textTertiary }} />
          <p className="font-semibold mb-1" style={{ color: colors.textPrimary }}>
            No materials for this context
          </p>
          <p className="text-sm mb-4" style={{ color: colors.textSecondary }}>
            Upload your first file for this course / unit / week.
          </p>
          <button
            onClick={() => setShowCreateForm(true)}
            className="inline-flex items-center px-4 py-2 text-white text-xs rounded-lg hover:opacity-90 transition-colors"
            style={{ backgroundColor: colors.primary }}
          >
            <PlusCircle className="w-4 h-4 mr-1.5" />
            Add material
          </button>
        </div>
      ) : (
        <div
          className={
            viewMode === "grid"
              ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
              : "space-y-3"
          }
        >
          {filteredNotes.map((note) => (
            <NoteCard
              key={note.id}
              note={note}
              course={courses.find((c) => c.id === note.course_id)}
              unit={units.find((u) => u.id === note.unit_id)}
              viewMode={viewMode}
              onDownload={downloadNote}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default LibraryWorkspace;