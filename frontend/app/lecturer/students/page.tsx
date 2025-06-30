"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { useLayout } from "@/components/LayoutController"
import AdminSidebar from "@/components/lecturerSidebar"
import Header from "@/components/Header"
import EmptyState from "@/components/EmptyState"
import AddStudentModal from "@/components/lecturer/AddStudentModal"
import { Users, Plus, Search, Filter, Edit, Trash2, Eye, Download, Upload, MoreVertical } from "lucide-react"

type Student = {
  id: string
  reg_number: string
  firstname: string
  surname: string
  othernames: string
  year_of_study: number
  semester: number
  email?: string
  user_id?: string
  course: {
    id: string
    name: string
    code?: string
  }
  units?: Array<{
    id: string
    unit_code: string
    unit_name: string
    level: number
    semester: number
    course_id: string
  }>
}

type Course = {
  id: string
  name: string
  code?: string
}

const StudentCard = ({
  student,
  onEdit,
  onDelete,
  onView,
}: {
  student: Student
  onEdit: (student: Student) => void
  onDelete: (id: string) => void
  onView: (student: Student) => void
}) => (
  <motion.div
    whileHover={{ y: -2 }}
    className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300"
  >
    <div className="flex items-start justify-between mb-4">
      <div className="flex items-center space-x-3">
        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
          <Users size={20} className="text-blue-600" />
        </div>
        <div>
          <h3 className="font-semibold text-gray-800">
            {student.firstname} {student.surname}
          </h3>
          <p className="text-sm text-gray-500">{student.reg_number}</p>
        </div>
      </div>

      <div className="relative group">
        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <MoreVertical size={16} className="text-gray-400" />
        </button>
        <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
          <button
            onClick={() => onView(student)}
            className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
          >
            <Eye size={16} />
            <span>View Details</span>
          </button>
          <button
            onClick={() => onEdit(student)}
            className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
          >
            <Edit size={16} />
            <span>Edit</span>
          </button>
          <button
            onClick={() => onDelete(student.id)}
            className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
          >
            <Trash2 size={16} />
            <span>Delete</span>
          </button>
        </div>
      </div>
    </div>

    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span className="text-gray-500">Course:</span>
        <span className="font-medium text-gray-800">{student.course.name}</span>
      </div>
      <div className="flex justify-between text-sm">
        <span className="text-gray-500">Year:</span>
        <span className="font-medium text-gray-800">Year {student.year_of_study}</span>
      </div>
      <div className="flex justify-between text-sm">
        <span className="text-gray-500">Semester:</span>
        <span className="font-medium text-gray-800">Semester {student.semester}</span>
      </div>
      {student.othernames && (
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Other Names:</span>
          <span className="font-medium text-gray-800">{student.othernames}</span>
        </div>
      )}
    </div>
  </motion.div>
)

export default function StudentsPage() {
  const { sidebarCollapsed, isMobileView, isTabletView } = useLayout()
  const [isLoading, setIsLoading] = useState(true)
  const [students, setStudents] = useState<Student[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [showAddModal, setShowAddModal] = useState(false)
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null)
  const [courses, setCourses] = useState<Course[]>([])
  const [selectedCourse, setSelectedCourse] = useState("")
  const [selectedYear, setSelectedYear] = useState("")
  const [selectedSemester, setSelectedSemester] = useState("")

  // Fetch students from API
  const fetchStudents = async () => {
    setIsLoading(true)
    try {
      const res = await fetch("http://localhost:8080/api/v1/auth/lecturer/students", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      })
      if (!res.ok) {
        throw new Error("Failed to fetch students")
      }
      const data = await res.json()
      setStudents(data)
    } catch (error) {
      setStudents([])
      console.error("Failed to fetch students:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchStudents()
  }, [])

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await fetch("http://localhost:8080/api/v1/auth/lecturer/courses", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        })
        if (!res.ok) throw new Error("Failed to fetch courses")
        const data = await res.json()
        setCourses(data)
      } catch (error) {
        setCourses([])
        console.error("Failed to fetch courses:", error)
      }
    }
    fetchCourses()
  }, [])

  // Get unique years of study and semesters from students
  const yearsOfStudy = Array.from(new Set(students.map(s => s.year_of_study))).sort((a, b) => a - b)
  const semesters = Array.from(new Set(students.map(s => s.semester))).sort((a, b) => a - b)

  // Filter students based on search term and filters
  const filteredStudents = students.filter(
    (student) =>
      (selectedCourse === "" || student.course.id === selectedCourse) &&
      (selectedYear === "" || String(student.year_of_study) === selectedYear) &&
      (selectedSemester === "" || String(student.semester) === selectedSemester) &&
      (
        student.firstname.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.surname.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.reg_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (student.othernames && student.othernames.toLowerCase().includes(searchTerm.toLowerCase()))
      )
  )

  const handleAddStudent = async (studentData: any) => {
    try {
      if (selectedStudent) {
        // Update existing student
        const response = await fetch(`http://localhost:8080/api/v1/auth/lecturer/students/${selectedStudent.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(studentData),
        })

        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.message || "Failed to update student")
        }
      } else {
        // Add new student
        const response = await fetch("http://localhost:8080/api/v1/auth/lecturer/students", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(studentData),
        })

        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.message || "Failed to add student")
        }
      }

      // Reload the students list
      await fetchStudents()
      setShowAddModal(false)
      setSelectedStudent(null)
    } catch (error) {
      console.error("Error saving student:", error)
      throw error // Re-throw to be handled by the modal
    }
  }

  const handleEditStudent = (student: Student) => {
    setSelectedStudent(student)
    setShowAddModal(true)
  }

  const handleDeleteStudent = async (id: string) => {
    if (!confirm("Are you sure you want to delete this student? This will also remove their user account and unit assignments.")) {
      return
    }

    try {
      const response = await fetch(`http://localhost:8080/api/v1/auth/lecturer/students/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.message || "Failed to delete student")
      }

      // Reload the students list
      await fetchStudents()
    } catch (error) {
      console.error("Error deleting student:", error)
      alert("Failed to delete student. Please try again.")
    }
  }

  const handleViewStudent = async (student: Student) => {
    try {
      const response = await fetch(`http://localhost:8080/api/v1/auth/lecturer/students/${student.id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      })

      if (!response.ok) {
        throw new Error("Failed to fetch student details")
      }

      const studentDetails = await response.json()
      console.log("Student details:", studentDetails)
      // Here you could open a detailed view modal or navigate to a student details page
      alert(`Student Details:\nName: ${studentDetails.firstname} ${studentDetails.surname}\nUnits: ${studentDetails.units?.length || 0}`)
    } catch (error) {
      console.error("Error fetching student details:", error)
      alert("Failed to fetch student details. Please try again.")
    }
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <AdminSidebar />

      <motion.div
        initial={{
          marginLeft: !isMobileView && !isTabletView ? (sidebarCollapsed ? 80 : 240) : 0,
        }}
        animate={{
          marginLeft: !isMobileView && !isTabletView ? (sidebarCollapsed ? 80 : 240) : 0,
        }}
        transition={{ duration: 0.3 }}
        className="flex-1 overflow-auto"
      >
        <Header title="Students Management" />

        <main className="p-4 md:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {/* Header Actions */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-800 mb-2">Students</h1>
                <p className="text-gray-600">Manage student records and information</p>
              </div>

              <div className="flex items-center space-x-3 mt-4 md:mt-0">
                <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium text-sm flex items-center space-x-2">
                  <Upload size={16} />
                  <span>Import</span>
                </button>
                <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium text-sm flex items-center space-x-2">
                  <Download size={16} />
                  <span>Export</span>
                </button>
                <button
                  onClick={() => setShowAddModal(true)}
                  className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium text-sm flex items-center space-x-2"
                >
                  <Plus size={16} />
                  <span>Add Student</span>
                </button>
              </div>
            </div>

            {/* Search and Filters */}
            <div className="flex flex-col md:flex-row md:items-center space-y-3 md:space-y-0 md:space-x-4 mb-6">
              <div className="relative flex-1 max-w-md">
                <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search students..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>
              <div className="flex items-center space-x-2">
                <Filter size={16} className="text-gray-400" />
                <select
                  value={selectedCourse}
                  onChange={(e) => setSelectedCourse(e.target.value)}
                  className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm"
                >
                  <option value="">All Courses</option>
                  {courses.map((course) => (
                    <option key={course.id} value={course.id}>
                      {course.code ? `${course.code} - ${course.name}` : course.name}
                    </option>
                  ))}
                </select>
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                  className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm"
                >
                  <option value="">All Years</option>
                  {yearsOfStudy.map((year) => (
                    <option key={year} value={String(year)}>
                      Year {year}
                    </option>
                  ))}
                </select>
                <select
                  value={selectedSemester}
                  onChange={(e) => setSelectedSemester(e.target.value)}
                  className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm"
                >
                  <option value="">All Semesters</option>
                  {semesters.map((semester) => (
                    <option key={semester} value={String(semester)}>
                      Semester {semester}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Content */}
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="bg-gray-200 rounded-xl h-48"></div>
                  </div>
                ))}
              </div>
            ) : filteredStudents.length === 0 ? (
              <EmptyState
                icon={<Users size={48} className="text-gray-400" />}
                title="No Students Found"
                description={
                  searchTerm
                    ? "No students match your search criteria."
                    : "Start by adding your first student to the system."
                }
                actionText="Add Student"
                onAction={() => setShowAddModal(true)}
              />
            ) : (
              <div className="overflow-x-auto rounded-xl border border-gray-100 bg-white shadow-sm">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Student</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Registration Number</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Course</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Year</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Semester</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-100">
                    {filteredStudents.map((student) => (
                      <tr key={student.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="font-medium text-gray-800">{student.firstname} {student.surname}</div>
                          {student.othernames && <div className="text-xs text-gray-500">{student.othernames}</div>}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">{student.reg_number}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{student.course.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-semibold">
                            Year {student.year_of_study}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-semibold">
                            Sem {student.semester}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex space-x-2">
                            <button 
                              onClick={() => handleViewStudent(student)} 
                              className="hover:bg-gray-100 p-1 rounded"
                              title="View Details"
                            >
                              <Eye size={16} className="text-gray-600" />
                            </button>
                            <button 
                              onClick={() => handleEditStudent(student)} 
                              className="hover:bg-gray-100 p-1 rounded"
                              title="Edit Student"
                            >
                              <Edit size={16} className="text-blue-600" />
                            </button>
                            <button 
                              onClick={() => handleDeleteStudent(student.id)} 
                              className="hover:bg-gray-100 p-1 rounded"
                              title="Delete Student"
                            >
                              <Trash2 size={16} className="text-red-600" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </main>
      </motion.div>

      {/* Add/Edit Student Modal */}
      {showAddModal && (
        <AddStudentModal
          student={selectedStudent}
          onClose={() => {
            setShowAddModal(false)
            setSelectedStudent(null)
          }}
          onSubmit={handleAddStudent}
        />
      )}
    </div>
  )
}