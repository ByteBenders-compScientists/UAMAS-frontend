"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { useLayout } from "@/components/LayoutController"
import AdminSidebar from "@/components/AdminSidebar"
import Header from "@/components/Header"
import EmptyState from "@/components/EmptyState"
import AddCourseModal from "@/components/admin/AddCourseModal"
import { GraduationCap, Plus, Search, Filter, Edit, Trash2, Eye, Building, MoreVertical } from "lucide-react"

type Course = {
  id: string
  code: string
  name: string
  department: string
  school: string
  units: Array<{
    unit_code: string
    unit_name: string
    level: number
    semester: number
  }>
}

const CourseCard = ({
  course,
  onEdit,
  onDelete,
  onView,
}: {
  course: Course
  onEdit: (course: Course) => void
  onDelete: (id: string) => void
  onView: (course: Course) => void
}) => (
  <motion.div
    whileHover={{ y: -2 }}
    className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300"
  >
    <div className="flex items-start justify-between mb-4">
      <div className="flex items-center space-x-3">
        <div className="w-12 h-12 bg-violet-100 rounded-full flex items-center justify-center">
          <GraduationCap size={20} className="text-violet-600" />
        </div>
        <div>
          <h3 className="font-semibold text-gray-800">{course.name}</h3>
          <p className="text-sm text-gray-500">Code: {course.code}</p>
        </div>
      </div>

      <div className="relative group">
        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <MoreVertical size={16} className="text-gray-400" />
        </button>
        <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
          <button
            onClick={() => onView(course)}
            className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
          >
            <Eye size={16} />
            <span>View Details</span>
          </button>
          <button
            onClick={() => onEdit(course)}
            className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
          >
            <Edit size={16} />
            <span>Edit</span>
          </button>
          <button
            onClick={() => onDelete(course.id)}
            className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
          >
            <Trash2 size={16} />
            <span>Delete</span>
          </button>
        </div>
      </div>
    </div>

    <div className="space-y-3">
      <div className="flex items-center text-sm text-gray-600">
        <Building size={14} className="mr-2" />
        <span>
          {course.department} • {course.school}
        </span>
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-500">Units:</span>
          <span className="text-sm font-medium text-gray-800">{course.units.length} units</span>
        </div>

        {course.units.length > 0 ? (
          <div className="space-y-1">
            {course.units.slice(0, 2).map((unit, index) => (
              <div
                key={index}
                className="text-xs bg-violet-50 text-violet-700 px-2 py-1 rounded flex items-center justify-between"
              >
                <span>
                  {unit.unit_code} - {unit.unit_name}
                </span>
                <span className="text-violet-500">
                  L{unit.level}S{unit.semester}
                </span>
              </div>
            ))}
            {course.units.length > 2 && (
              <div className="text-xs text-gray-500">+{course.units.length - 2} more units</div>
            )}
          </div>
        ) : (
          <div className="text-xs text-gray-400 italic">No units assigned</div>
        )}
      </div>
    </div>
  </motion.div>
)

export default function CoursesPage() {
  const { sidebarCollapsed, isMobileView, isTabletView } = useLayout()
  const [isLoading, setIsLoading] = useState(true)
  const [courses, setCourses] = useState<Course[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [showAddModal, setShowAddModal] = useState(false)
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null)

  useEffect(() => {
    const fetchCourses = async () => {
      setIsLoading(true)
      const res = await fetch("http://localhost:8080/api/v1/admin/courses", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      })

      const data = await res.json()
      setCourses(data)
      setIsLoading(false)
    }

    fetchCourses()
  }, [])

  const filteredCourses = courses.filter(
    (course) =>
      course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.school.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleEditCourse = (course: Course) => {
    setSelectedCourse(course)
    setShowAddModal(true)
  }

  const handleDeleteCourse = async (id: string) => {
    if (!confirm("Are you sure you want to delete this course? This will also delete all related units.")) {
      return
    }

    try {
      const response = await fetch(`http://localhost:8080/api/v1/admin/courses/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.message || "Failed to delete course")
      }

      // Reload the courses list
      const coursesResponse = await fetch("http://localhost:8080/api/v1/admin/courses", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      })

      const coursesData = await coursesResponse.json()
      setCourses(coursesData)
    } catch (error) {
      console.error("Error deleting course:", error)
      // Reload the courses list even if there was an error
      const coursesResponse = await fetch("http://localhost:8080/api/v1/admin/courses", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      })

      const coursesData = await coursesResponse.json()
      setCourses(coursesData)
    }
  }

  const handleAddCourse = async (courseData: any) => {
    try {
      if (selectedCourse) {
        // Update existing course
        const response = await fetch(`http://localhost:8080/api/v1/admin/courses/${selectedCourse.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(courseData),
        })

        const data = await response.json()

        // if (!response.ok) {
        //   throw new Error(data.message || "Failed to update course")
        // }
      } else {
        // Add new course
        const response = await fetch("http://localhost:8080/api/v1/admin/courses", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(courseData),
        })

        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.message || "Failed to add course")
        }
      }

      // Reload the courses list
      const coursesResponse = await fetch("http://localhost:8080/api/v1/admin/courses", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      })

      const coursesData = await coursesResponse.json()
      setCourses(coursesData)

      setShowAddModal(false)
      setSelectedCourse(null)
    } catch (error) {
      console.error("Error saving course:", error)
      // Reload the courses list even if there was an error
      const coursesResponse = await fetch("http://localhost:8080/api/v1/admin/courses", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      })

      const coursesData = await coursesResponse.json()
      setCourses(coursesData)
    }
  }

  const handleViewCourse = (course: Course) => {
    console.log("Viewing course:", course)
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
        <Header title="Courses Management" />

        <main className="p-4 md:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {/* Header Actions */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-800 mb-2">Courses</h1>
                <p className="text-gray-600">Manage academic programs and course structures</p>
              </div>

              <div className="flex items-center space-x-3 mt-4 md:mt-0">
                <button
                  onClick={() => setShowAddModal(true)}
                  className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium text-sm flex items-center space-x-2"
                >
                  <Plus size={16} />
                  <span>Add Course</span>
                </button>
              </div>
            </div>

            {/* Search and Filters */}
            <div className="flex flex-col md:flex-row md:items-center space-y-3 md:space-y-0 md:space-x-4 mb-6">
              <div className="relative flex-1 max-w-md">
                <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search courses..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>

              <button className="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium text-sm flex items-center space-x-2">
                <Filter size={16} />
                <span>Filter</span>
              </button>
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
            ) : filteredCourses.length === 0 ? (
              <EmptyState
                icon={<GraduationCap size={48} className="text-gray-400" />}
                title="No Courses Found"
                description={
                  searchTerm
                    ? "No courses match your search criteria."
                    : "Start by adding your first course to the system."
                }
                actionText="Add Course"
                onAction={() => setShowAddModal(true)}
              />
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {filteredCourses.map((course, index) => (
                  <motion.div
                    key={course.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.1 * index }}
                  >
                    <CourseCard
                      course={course}
                      onEdit={handleEditCourse}
                      onDelete={handleDeleteCourse}
                      onView={handleViewCourse}
                    />
                  </motion.div>
                ))}
              </motion.div>
            )}
          </div>
        </main>
      </motion.div>

      {/* Add/Edit Course Modal */}
      {showAddModal && (
        <AddCourseModal
          course={selectedCourse}
          onClose={() => {
            setShowAddModal(false)
            setSelectedCourse(null)
          }}
          onSubmit={handleAddCourse}
        />
      )}
    </div>
  )
}
