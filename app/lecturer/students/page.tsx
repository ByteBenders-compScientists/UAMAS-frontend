/* eslint-disable @typescript-eslint/no-unused-vars */
// lecturer/students/page.tsx
"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { useLayout } from "@/components/LayoutController"
import AdminSidebar from "@/components/lecturerSidebar"
import Header from "@/components/Header"
import EmptyState from "@/components/EmptyState"
import { Users, Search, Filter } from "lucide-react"

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
  courses: Array<{
    id: string
    name: string
    code?: string
  }>
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


const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "https://68.221.169.119/api/v1";

export default function StudentsPage() {
  const { sidebarCollapsed, isMobileView, isTabletView } = useLayout()
  const [initialCourseIdFromQuery, setInitialCourseIdFromQuery] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [students, setStudents] = useState<Student[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [courses, setCourses] = useState<Course[]>([])
  const [selectedCourse, setSelectedCourse] = useState(initialCourseIdFromQuery)
  const [selectedYear, setSelectedYear] = useState("")
  const [selectedSemester, setSelectedSemester] = useState("")
  const [selectedUnitId, setSelectedUnitId] = useState("")

  // Get URL parameters on client side
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const courseId = params.get("courseId")
    if (courseId) {
      setInitialCourseIdFromQuery(courseId)
      setSelectedCourse(courseId)
    }
  }, [])

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

  // Get unique units from students for unit-based filtering
  const unitsForFilter = Array.from(
    new Map(
      students
        .flatMap((s) => s.units || [])
        .map((u) => [u.id, u])
    ).values()
  )

  // Filter students based on search term, filters, and selected unit
  const filteredStudents = students.filter(
    (student) =>
      (selectedCourse === "" || (student.courses && student.courses.some(c => c.id === selectedCourse))) &&
      (selectedYear === "" || String(student.year_of_study) === selectedYear) &&
      (selectedSemester === "" || String(student.semester) === selectedSemester) &&
      (selectedUnitId === "" || (student.units && student.units.some(u => u.id === selectedUnitId))) &&
      (
        student.firstname.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.surname.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.reg_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (student.courses && student.courses.some(c => c.name.toLowerCase().includes(searchTerm.toLowerCase()))) ||
        (student.othernames && student.othernames.toLowerCase().includes(searchTerm.toLowerCase()))
      )
  )


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
                <p className="text-gray-600">View students who have joined your units via join codes</p>
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
                  value={selectedUnitId}
                  onChange={(e) => setSelectedUnitId(e.target.value)}
                  className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm"
                >
                  <option value="">Select Unit</option>
                  {unitsForFilter.map((unit) => (
                    <option key={unit.id} value={unit.id}>
                      {unit.unit_code} - {unit.unit_name}
                    </option>
                  ))}
                </select>
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
            ) : !selectedUnitId ? (
              <EmptyState
                icon={<Users size={48} className="text-gray-400" />}
                title="Select a Unit"
                description="Choose a unit from the filters above to view the students enrolled in it."
              />
            ) : filteredStudents.length === 0 ? (
              <EmptyState
                icon={<Users size={48} className="text-gray-400" />}
                title="No Students Found"
                description={
                  searchTerm
                    ? "No students match your search criteria for this unit."
                    : "No students have joined this unit yet."
                }
              />
            ) : (
              <div className="overflow-x-auto rounded-xl border border-gray-100 bg-white shadow-sm">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Student</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Registration Number</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Units</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Year</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Semester</th>
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
                        <td className="px-6 py-4 whitespace-nowrap">
                          {student.units && student.units.length > 0
                            ? student.units.map(unit => unit.unit_code).join(', ')
                            : <span className="text-gray-400 text-xs">No units</span>}
                        </td>
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
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </main>
      </motion.div>


    </div>
  )
}