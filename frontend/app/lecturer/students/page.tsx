"use client"

import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { useLayout } from "@/components/LayoutController"
import AdminSidebar from "@/components/lecturerSidebar"
import Header from "@/components/Header"
import EmptyState from "@/components/EmptyState"
import AddStudentModal from "@/components/lecturer/AddStudentModal"
import { Users, Plus, Search, Filter, Edit, Trash2, Eye, Download, Upload, X, CheckCircle, AlertCircle } from "lucide-react"

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

interface ModalStudent {
  id: string
  reg_number: string
  firstname: string
  surname: string
  othernames: string
  year_of_study: number
  semester: number
  email: string
  course: {
    id: string
    name: string
    code?: string
  }
}

type Course = {
  id: string
  name: string
  code?: string
}

interface BulkUploadResult {
  message: string
  success_count: number
  error_count: number
  total_processed: number
  errors?: string[]
  note?: string
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080/api/v1";

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
  
  // Import/Export states
  const [showImportModal, setShowImportModal] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadResult, setUploadResult] = useState<BulkUploadResult | null>(null)
  const [isExporting, setIsExporting] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Fetch students from API
  const fetchStudents = async () => {
    setIsLoading(true)
    try {
      const res = await fetch(`${API_BASE_URL}/auth/lecturer/students`, {
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
        const res = await fetch(`${API_BASE_URL}/auth/lecturer/courses`, {
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

  // Handle bulk import
  const handleImport = async (file: File) => {
    setIsUploading(true)
    setUploadResult(null)

    const formData = new FormData()
    formData.append('file', file)

    try {
      const response = await fetch(`${API_BASE_URL}/auth/lecturer/students/bulk-upload`, {
        method: 'POST',
        credentials: 'include',
        body: formData,
      })

      const result = await response.json()
      setUploadResult(result)

      if (response.ok && result.success_count > 0) {
        // Refresh students list
        await fetchStudents()
      }
    } catch (error) {
      console.error('Import error:', error)
      setUploadResult({
        message: 'Failed to import students',
        success_count: 0,
        error_count: 0,
        total_processed: 0,
        errors: ['Network error occurred. Please try again.']
      })
    } finally {
      setIsUploading(false)
    }
  }

  // Handle export
  const handleExport = async (format: 'csv' | 'excel' = 'csv') => {
    setIsExporting(true)
    
    try {
      // Create CSV content
      const headers = [
        'Registration Number',
        'First Name',
        'Surname', 
        'Other Names',
        'Email',
        'Course Code',
        'Course Name',
        'Year of Study',
        'Semester',
        'Units Count'
      ]

      const csvRows = [
        headers.join(','),
        ...filteredStudents.map(student => [
          `"${student.reg_number}"`,
          `"${student.firstname}"`,
          `"${student.surname}"`,
          `"${student.othernames || ''}"`,
          `"${student.email || ''}"`,
          `"${student.course.code || ''}"`,
          `"${student.course.name}"`,
          student.year_of_study,
          student.semester,
          student.units?.length || 0
        ].join(','))
      ]

      const csvContent = csvRows.join('\n')
      
      // Create and download file
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
      const link = document.createElement('a')
      
      if (link.download !== undefined) {
        const url = URL.createObjectURL(blob)
        link.setAttribute('href', url)
        link.setAttribute('download', `students_export_${new Date().toISOString().split('T')[0]}.csv`)
        link.style.visibility = 'hidden'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      }
    } catch (error) {
      console.error('Export error:', error)
      alert('Failed to export students. Please try again.')
    } finally {
      setIsExporting(false)
    }
  }

  // Download template
  const downloadTemplate = () => {
    const headers = [
      'reg_number',
      'firstname', 
      'surname',
      'othernames',
      'email',
      'year_of_study',
      'semester',
      'course_id'
    ]

    const templateRows = [
      headers.join(','),
      // Sample row
      '"STU001","John","Doe","Michael","john.doe@email.com",1,1,"course-id-here"'
    ]

    const csvContent = templateRows.join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob)
      link.setAttribute('href', url)
      link.setAttribute('download', 'students_import_template.csv')
      link.style.visibility = 'hidden'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  const handleAddStudent = async (studentData: unknown) => {
    try {
      if (selectedStudent) {
        // Update existing student
        const response = await fetch(`${API_BASE_URL}/auth/lecturer/students/${selectedStudent.id}`, {
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
        const response = await fetch(`${API_BASE_URL}/auth/lecturer/students`, {
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
      const response = await fetch(`${API_BASE_URL}/auth/lecturer/students/${id}`, {
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
      const response = await fetch(`${API_BASE_URL}/auth/lecturer/students/${student.id}`, {
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
          <div className="max-w-8xl mx-auto">
            {/* Header Actions */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-800 mb-2">Students</h1>
                <p className="text-gray-600">Manage student records and information</p>
              </div>

              <div className="flex items-center space-x-3 mt-4 md:mt-0">
                <button 
                  onClick={() => setShowImportModal(true)}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium text-sm flex items-center space-x-2"
                >
                  <Upload size={16} />
                  <span>Import</span>
                </button>
                <button 
                  onClick={() => handleExport('csv')}
                  disabled={isExporting}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium text-sm flex items-center space-x-2 disabled:opacity-50"
                >
                  <Download size={16} />
                  <span>{isExporting ? 'Exporting...' : 'Export'}</span>
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

      {/* Import Modal */}
      {showImportModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => setShowImportModal(false)} />
            
            <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
              <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900">Import Students</h3>
                  <button
                    onClick={() => setShowImportModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X size={20} />
                  </button>
                </div>

                {!uploadResult && (
                  <div className="space-y-4">
                    <div className="text-sm text-gray-600">
                      Upload an Excel file (.xlsx, .xls) with student data. The file should contain columns:
                      reg_number, firstname, surname, email, year_of_study, semester, course_name, othernames (optional)
                    </div>
                    
                    <button
                      onClick={downloadTemplate}
                      className="text-emerald-600 hover:text-emerald-700 text-sm font-medium"
                    >
                      Download Template File
                    </button>

                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept=".xlsx,.xls"
                        onChange={(e) => {
                          const file = e.target.files?.[0]
                          if (file) {
                            handleImport(file)
                          }
                        }}
                        className="hidden"
                      />
                      
                      <Upload size={40} className="mx-auto text-gray-400 mb-2" />
                      <p className="text-sm text-gray-600 mb-2">
                        Click to select or drag and drop your Excel file
                      </p>
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isUploading}
                        className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50"
                      >
                        {isUploading ? 'Uploading...' : 'Select File'}
                      </button>
                    </div>
                  </div>
                )}

                {uploadResult && (
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      {uploadResult.success_count > 0 ? (
                        <CheckCircle size={20} className="text-green-500" />
                      ) : (
                        <AlertCircle size={20} className="text-red-500" />
                      )}
                      <h4 className="font-medium">Import Results</h4>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                      <div className="text-sm">
                        <span className="font-medium">Total Processed:</span> {uploadResult.total_processed}
                      </div>
                      <div className="text-sm text-green-600">
                        <span className="font-medium">Successful:</span> {uploadResult.success_count}
                      </div>
                      <div className="text-sm text-red-600">
                        <span className="font-medium">Errors:</span> {uploadResult.error_count}
                      </div>
                    </div>

                    {uploadResult.errors && uploadResult.errors.length > 0 && (
                      <div className="space-y-2">
                        <h5 className="font-medium text-red-600">Errors:</h5>
                        <div className="max-h-40 overflow-y-auto bg-red-50 p-3 rounded text-sm">
                          {uploadResult.errors.map((error, index) => (
                            <div key={index} className="text-red-700 mb-1">{error}</div>
                          ))}
                        </div>
                        {uploadResult.note && (
                          <div className="text-xs text-gray-500">{uploadResult.note}</div>
                        )}
                      </div>
                    )}

                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => {
                          setShowImportModal(false)
                          setUploadResult(null)
                        }}
                        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                      >
                        Close
                      </button>
                      {uploadResult.error_count > 0 && (
                        <button
                          onClick={() => setUploadResult(null)}
                          className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                        >
                          Try Again
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Student Modal */}
      {showAddModal && (
        <AddStudentModal
          student={selectedStudent as ModalStudent | null}
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