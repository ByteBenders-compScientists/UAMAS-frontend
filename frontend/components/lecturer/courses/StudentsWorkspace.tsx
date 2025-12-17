"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  Download,
  Edit,
  Eye,
  Search,
  Trash2,
  Upload,
  Users,
} from "lucide-react";
import AddStudentModal from "@/components/lecturer/AddStudentModal";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080/api/v1";

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

interface ModalStudent {
  id: string;
  reg_number: string;
  firstname: string;
  surname: string;
  othernames: string;
  year_of_study: number;
  semester: number;
  email: string;
  course: {
    id: string;
    name: string;
    code?: string;
  };
}

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
  const [students, setStudents] = useState<Student[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  const [isExporting, setIsExporting] = useState(false);
  const [showImportInfo, setShowImportInfo] = useState(false);

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

  const handleAddStudent = async (studentData: unknown) => {
    try {
      if (selectedStudent) {
        const response = await fetch(
          `${API_BASE_URL}/auth/lecturer/students/${selectedStudent.id}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify(studentData),
          }
        );
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message || "Failed to update student");
        }
      } else {
        const response = await fetch(
          `${API_BASE_URL}/auth/lecturer/students`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify(studentData),
          }
        );
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message || "Failed to add student");
        }
      }
      await fetchStudents();
      setShowAddModal(false);
      setSelectedStudent(null);
    } catch (err) {
      throw err;
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
      <div className="py-12 text-center bg-white rounded-2xl border border-dashed border-emerald-200">
        <Users className="w-10 h-10 mx-auto mb-3 text-emerald-500" />
        <p className="font-semibold text-gray-800 mb-1">
          Select a course in the sidebar to see its students.
        </p>
        <p className="text-sm text-gray-500">
          The shared Courses selection controls which students appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase">
            Students context
          </p>
          <p className="text-sm text-gray-700">
            {contextCourse?.name || "Selected course"}
          </p>
        </div>
        <div className="flex items-center space-x-2 text-xs text-gray-500">
          <span>
            {filteredStudents.length} student
            {filteredStudents.length === 1 ? "" : "s"} in this course
          </span>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search students by name or registration number..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm"
          />
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowImportInfo((v) => !v)}
            className="inline-flex items-center px-3 py-2 text-xs rounded-lg bg-gray-50 border border-gray-200 text-gray-700 hover:bg-gray-100"
          >
            <Upload className="w-4 h-4 mr-1" />
            Import info
          </button>
          <button
            onClick={handleExport}
            disabled={isExporting || filteredStudents.length === 0}
            className="inline-flex items-center px-3 py-2 text-xs rounded-lg bg-gray-50 border border-gray-200 text-gray-700 hover:bg-gray-100 disabled:opacity-50"
          >
            <Download className="w-4 h-4 mr-1" />
            {isExporting ? "Exporting..." : "Export CSV"}
          </button>
          <button
            onClick={() => {
              setSelectedStudent(null);
              setShowAddModal(true);
            }}
            className="inline-flex items-center px-3 py-2 text-xs rounded-lg bg-emerald-600 text-white hover:bg-emerald-700"
          >
            Add student
          </button>
        </div>
      </div>

      {showImportInfo && (
        <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-4 text-xs text-emerald-800 flex space-x-2">
          <AlertCircle className="w-4 h-4 mt-0.5" />
          <p>
            Bulk import is available on the full Students page. For the Courses
            workspace, you can quickly add or manage individual students in the
            selected course.
          </p>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-4 text-xs text-red-700 flex space-x-2">
          <AlertCircle className="w-4 h-4 mt-0.5" />
          <p>{error}</p>
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-100 text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-[11px] font-semibold text-gray-500 uppercase">
                  Student
                </th>
                <th className="px-4 py-2 text-left text-[11px] font-semibold text-gray-500 uppercase">
                  Reg No.
                </th>
                <th className="px-4 py-2 text-left text-[11px] font-semibold text-gray-500 uppercase">
                  Year
                </th>
                <th className="px-4 py-2 text-left text-[11px] font-semibold text-gray-500 uppercase">
                  Semester
                </th>
                <th className="px-4 py-2 text-left text-[11px] font-semibold text-gray-500 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {loading && (
                <tr>
                  <td
                    colSpan={5}
                    className="px-4 py-8 text-center text-xs text-gray-500"
                  >
                    Loading students...
                  </td>
                </tr>
              )}
              {!loading && filteredStudents.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="px-4 py-8 text-center text-xs text-gray-500"
                  >
                    No students found for this course.
                  </td>
                </tr>
              )}
              {filteredStudents.map((s) => (
                <tr key={s.id} className="hover:bg-gray-50">
                  <td className="px-4 py-2 whitespace-nowrap">
                    <div className="font-medium text-gray-800">
                      {s.firstname} {s.surname}
                    </div>
                    {s.othernames && (
                      <div className="text-xs text-gray-500">
                        {s.othernames}
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap">
                    {s.reg_number}
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap">
                    <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-[11px] font-semibold">
                      Year {s.year_of_study}
                    </span>
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap">
                    <span className="bg-green-50 text-green-700 px-2 py-1 rounded text-[11px] font-semibold">
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
                        className="p-1.5 text-gray-500 hover:text-gray-700"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          setSelectedStudent(s);
                          setShowAddModal(true);
                        }}
                        className="p-1.5 text-blue-600 hover:text-blue-800"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteStudent(s.id)}
                        className="p-1.5 text-red-600 hover:text-red-800"
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

      {/* Add/Edit Student Modal */}
      {showAddModal && (
        <AddStudentModal
          student={selectedStudent as ModalStudent | null}
          onClose={() => {
            setShowAddModal(false);
            setSelectedStudent(null);
          }}
          onSubmit={handleAddStudent}
        />
      )}
    </div>
  );
};

export default StudentsWorkspace;

