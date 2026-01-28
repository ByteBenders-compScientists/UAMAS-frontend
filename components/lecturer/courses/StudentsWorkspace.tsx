"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  Download,
  Eye,
  Search,
  Trash2,
  Users,
} from "lucide-react";
import { useThemeColors } from '@/context/ThemeContext';

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "https://68.221.169.119/api/v1";

type Student = {
  id: string;
  reg_number: string;
  firstname: string;
  surname: string;
  othernames: string;
  year_of_study: number;
  semester: number;
  email?: string;
  user_id?: string;
  courses: Array<{
    id: string;
    name: string;
    code?: string;
  }>;
};

type Course = {
  id: string;
  name: string;
  code?: string;
};

interface StudentsWorkspaceProps {
  selectedCourseId: string;
}

const StudentsWorkspace: React.FC<StudentsWorkspaceProps> = ({
  selectedCourseId,
}) => {
  const colors = useThemeColors();
  const [students, setStudents] = useState<Student[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isExporting, setIsExporting] = useState(false);

  const contextCourse = useMemo(
    () => courses.find((c) => c.id === selectedCourseId),
    [courses, selectedCourseId]
  );

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/auth/lecturer/students`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
      if (!res.ok) {
        throw new Error("Failed to fetch students");
      }
      const data = await res.json();
      setStudents(data);
      setError(null);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch students list"
      );
      setStudents([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  useEffect(() => {
    const loadCourses = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/auth/lecturer/courses`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        });
        if (!res.ok) throw new Error("Failed to fetch courses");
        const data = await res.json();
        setCourses(data);
      } catch {
        setCourses([]);
      }
    };
    loadCourses();
  }, []);

  const filteredStudents = students.filter((s) => {
    if (!selectedCourseId) return false;
    const inCourse =
      s.courses && s.courses.some((c) => c.id === selectedCourseId);
    if (!inCourse) return false;
    const q = searchTerm.toLowerCase();
    return (
      s.firstname.toLowerCase().includes(q) ||
      s.surname.toLowerCase().includes(q) ||
      s.reg_number.toLowerCase().includes(q)
    );
  });

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const headers = [
        "Registration Number",
        "First Name",
        "Surname",
        "Other Names",
        "Email",
        "Course Code",
        "Course Name",
        "Year of Study",
        "Semester",
      ];
      const rows = filteredStudents.map((s) => [
        `"${s.reg_number}"`,
        `"${s.firstname}"`,
        `"${s.surname}"`,
        `"${s.othernames || ""}"`,
        `"${s.email || ""}"`,
        `"${s.courses[0]?.code || ""}"`,
        `"${s.courses.map((c) => c.name).join("; ")}"`,
        s.year_of_study,
        s.semester,
      ]);
      const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join(
        "\n"
      );
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `students_${contextCourse?.code || "course"}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch {
      alert("Failed to export students.");
    } finally {
      setIsExporting(false);
    }
  };


  const handleDeleteStudent = async (id: string) => {
    if (
      !confirm(
        "Are you sure you want to delete this student? This will also remove their user account and unit assignments."
      )
    ) {
      return;
    }
    try {
      const res = await fetch(
        `${API_BASE_URL}/auth/lecturer/students/${id}`,
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        }
      );
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed to delete student");
      }
      await fetchStudents();
    } catch (err) {
      alert(
        err instanceof Error ? err.message : "Failed to delete the student."
      );
    }
  };

  if (!selectedCourseId) {
    return (
      <div 
        className="py-12 text-center rounded-2xl border border-dashed"
        style={{
          backgroundColor: colors.cardBackground,
          borderColor: colors.border,
        }}
      >
        <Users className="w-10 h-10 mx-auto mb-3" style={{ color: colors.primary }} />
        <p className="font-semibold mb-1" style={{ color: colors.textPrimary }}>
          Select a course in the sidebar to see its students.
        </p>
        <p className="text-sm" style={{ color: colors.textSecondary }}>
          The shared Courses selection controls which students appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div 
        className="rounded-2xl border shadow-sm p-4 flex flex-wrap items-center justify-between gap-3"
        style={{
          backgroundColor: colors.cardBackground,
          borderColor: colors.border,
        }}
      >
        <div>
          <p className="text-xs font-semibold uppercase" style={{ color: colors.textTertiary }}>
            Students context
          </p>
          <p className="text-sm" style={{ color: colors.textPrimary }}>
            {contextCourse?.name || "Selected course"}
          </p>
        </div>
        <div className="flex items-center space-x-2 text-xs" style={{ color: colors.textSecondary }}>
          <span>
            {filteredStudents.length} student
            {filteredStudents.length === 1 ? "" : "s"} in this course
          </span>
        </div>
      </div>

      <div 
        className="rounded-2xl shadow-sm border p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3"
        style={{
          backgroundColor: colors.cardBackground,
          borderColor: colors.border,
        }}
      >
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4" style={{ color: colors.textTertiary }} />
          <input
            type="text"
            placeholder="Search students by name or registration number..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 border rounded-lg focus:ring-2 focus:border-transparent text-sm"
            style={{
              backgroundColor: colors.inputBackground,
              borderColor: colors.inputBorder,
              color: colors.textPrimary,
            }}
          />
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleExport}
            disabled={isExporting || filteredStudents.length === 0}
            className="inline-flex items-center px-3 py-2 text-xs rounded-lg border text-gray-700 hover:opacity-90 disabled:opacity-50 transition-colors"
            style={{
              backgroundColor: colors.backgroundTertiary,
              borderColor: colors.border,
              color: colors.textPrimary,
            }}
          >
            <Download className="w-4 h-4 mr-1" />
            {isExporting ? "Exporting..." : "Export CSV"}
          </button>
        </div>
      </div>

      {error && (
        <div 
          className="border rounded-2xl p-4 text-xs flex space-x-2"
          style={{
            backgroundColor: `${colors.error}15`,
            borderColor: colors.error,
            color: colors.error,
          }}
        >
          <AlertCircle className="w-4 h-4 mt-0.5" />
          <p>{error}</p>
        </div>
      )}

      {/* Table */}
      <div 
        className="rounded-2xl shadow-sm border overflow-hidden"
        style={{
          backgroundColor: colors.cardBackground,
          borderColor: colors.border,
        }}
      >
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y text-sm">
            <thead>
              <tr style={{ backgroundColor: colors.backgroundSecondary }}>
                <th className="px-4 py-2 text-left text-[11px] font-semibold uppercase" style={{ color: colors.textTertiary }}>
                  Student
                </th>
                <th className="px-4 py-2 text-left text-[11px] font-semibold uppercase" style={{ color: colors.textTertiary }}>
                  Reg No.
                </th>
                <th className="px-4 py-2 text-left text-[11px] font-semibold uppercase" style={{ color: colors.textTertiary }}>
                  Year
                </th>
                <th className="px-4 py-2 text-left text-[11px] font-semibold uppercase" style={{ color: colors.textTertiary }}>
                  Semester
                </th>
                <th className="px-4 py-2 text-left text-[11px] font-semibold uppercase" style={{ color: colors.textTertiary }}>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y" style={{ borderColor: colors.border }}>
              {loading && (
                <tr>
                  <td
                    colSpan={5}
                    className="px-4 py-8 text-center text-xs"
                    style={{ color: colors.textSecondary }}
                  >
                    Loading students...
                  </td>
                </tr>
              )}
              {!loading && filteredStudents.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="px-4 py-8 text-center text-xs"
                    style={{ color: colors.textSecondary }}
                  >
                    No students found for this course.
                  </td>
                </tr>
              )}
              {filteredStudents.map((s) => (
                <tr key={s.id} className="hover:opacity-90" style={{ backgroundColor: colors.cardHover }}>
                  <td className="px-4 py-2 whitespace-nowrap">
                    <div className="font-medium" style={{ color: colors.textPrimary }}>
                      {s.firstname} {s.surname}
                    </div>
                    {s.othernames && (
                      <div className="text-xs" style={{ color: colors.textSecondary }}>
                        {s.othernames}
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap" style={{ color: colors.textPrimary }}>
                    {s.reg_number}
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap">
                    <span 
                      className="px-2 py-1 rounded text-[11px] font-semibold"
                      style={{
                        backgroundColor: `${colors.info}20`,
                        color: colors.info,
                      }}
                    >
                      Year {s.year_of_study}
                    </span>
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap">
                    <span 
                      className="px-2 py-1 rounded text-[11px] font-semibold"
                      style={{
                        backgroundColor: `${colors.success}20`,
                        color: colors.success,
                      }}
                    >
                      Sem {s.semester}
                    </span>
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap">
                    <div className="flex space-x-1">
                      <button
                        onClick={() =>
                          alert(
                            `Student: ${s.firstname} ${s.surname}\nReg: ${s.reg_number}`
                          )
                        }
                        className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
                        style={{ color: colors.textSecondary }}
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteStudent(s.id)}
                        className="p-1.5 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
                        style={{ color: colors.error }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default StudentsWorkspace;