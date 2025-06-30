"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { useLayout } from "@/components/LayoutController"
import Sidebar from "@/components/lecturerSidebar"
import Header from "@/components/Header"
import EmptyState from "@/components/EmptyState"
import AddCourseModal from "@/components/lecturer/AddCourseModal"
import { GraduationCap, Plus, Search, Filter, Edit, Trash2, Eye, Building, MoreVertical, BookOpen, X } from "lucide-react"

type Course = {
  id: string
  code: string
  name: string
  department: string
  school: string
  units: Array<{
    id: string
    unit_code: string
    unit_name: string
    level: number
    semester: number
    course_id: string
  }>
}

type Unit = {
  id: string
  unit_code: string
  unit_name: string
  level: number
  semester: number
  course_id: string
}

const CourseCard = ({
  course,
  onEdit,
  onDelete,
  onView,
  onAddUnit,
}: {
  course: Course
  onEdit: (course: Course) => void
  onDelete: (id: string) => void
  onView: (course: Course) => void
  onAddUnit: (course: Course) => void
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
            onClick={() => onAddUnit(course)}
            className="w-full px-4 py-2 text-left text-sm text-emerald-600 hover:bg-emerald-50 flex items-center space-x-2"
          >
            <BookOpen size={16} />
            <span>Add Unit</span>
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
            {course.units.slice(0, 2).map((unit) => (
              <div
                key={unit.id}
                className="text-xs bg-violet-50 text-violet-700 px-2 py-1 rounded flex items-center justify-between group"
              >
                <span>
                  {unit.unit_code} - {unit.unit_name}
                </span>
                <div className="flex items-center space-x-1">
                  <span className="text-violet-500">
                    L{unit.level}S{unit.semester}
                  </span>
                  <div className="hidden group-hover:flex items-center space-x-1 ml-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleEditUnit(unit)
                      }}
                      className="p-1 hover:bg-violet-200 rounded text-violet-600"
                      title="Edit unit"
                    >
                      <Edit size={10} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDeleteUnit(unit.id)
                      }}
                      className="p-1 hover:bg-red-200 rounded text-red-600"
                      title="Delete unit"
                    >
                      <Trash2 size={10} />
                    </button>
                  </div>
                </div>
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
  const [error, setError] = useState<string | null>(null)
  const [showUnitModal, setShowUnitModal] = useState(false)
  const [selectedCourseForUnit, setSelectedCourseForUnit] = useState<Course | null>(null)
  const [selectedUnit, setSelectedUnit] = useState<Unit | null>(null)

  // Fetch all courses created by the lecturer
  const fetchCourses = async () => {
    try {
      setIsLoading(true)
      setError(null)
      
      const res = await fetch("http://localhost:8080/api/v1/auth/lecturer/courses", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      })

      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.message || "Failed to fetch courses")
      }

      const data = await res.json()
      setCourses(data)
    } catch (error) {
      console.error("Error fetching courses:", error)
      setError(error instanceof Error ? error.message : "Failed to fetch courses")
      setCourses([])
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
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
      const response = await fetch(`http://localhost:8080/api/v1/auth/lecturer/courses/${id}`, {
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

      // Show success message
      const result = await response.json()
      console.log(result.message)

      // Reload the courses list
      await fetchCourses()
    } catch (error) {
      console.error("Error deleting course:", error)
      setError(error instanceof Error ? error.message : "Failed to delete course")
      // Still try to reload the courses list
      await fetchCourses()
    }
  }

  const handleAddCourse = async (courseData: any) => {
    try {
      setError(null)
      
      if (selectedCourse) {
        // Update existing course
        const response = await fetch(`http://localhost:8080/api/v1/auth/lecturer/courses/${selectedCourse.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            name: courseData.name,
            code: courseData.code,
            department: courseData.department,
            school: courseData.school,
          }),
        })

        if (!response.ok) {
          const data = await response.json()
          throw new Error(data.message || "Failed to update course")
        }

        const result = await response.json()
        console.log("Course updated successfully:", result)
      } else {
        // Add new course
        const response = await fetch("http://localhost:8080/api/v1/auth/lecturer/courses", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            name: courseData.name,
            code: courseData.code,
            department: courseData.department,
            school: courseData.school,
          }),
        })

        if (!response.ok) {
          const data = await response.json()
          throw new Error(data.message || "Failed to add course")
        }

        const result = await response.json()
        console.log("Course created successfully:", result.message, "ID:", result.course_id)
      }

      // Reload the courses list
      await fetchCourses()

      setShowAddModal(false)
      setSelectedCourse(null)
    } catch (error) {
      console.error("Error saving course:", error)
      setError(error instanceof Error ? error.message : "Failed to save course")
    }
  }

  const handleViewCourse = async (course: Course) => {
    try {
      // Fetch detailed course information
      const response = await fetch(`http://localhost:8080/api/v1/auth/lecturer/courses/${course.id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.message || "Failed to fetch course details")
      }

      const courseDetails = await response.json()
      console.log("Course details:", courseDetails)
      
      // You can implement a detailed view modal here
      // For now, just log the details
    } catch (error) {
      console.error("Error fetching course details:", error)
      setError(error instanceof Error ? error.message : "Failed to fetch course details")
    }
  }

  const handleAddUnit = (course: Course) => {
    setSelectedCourseForUnit(course)
    setSelectedUnit(null)
    setShowUnitModal(true)
  }

  const handleEditUnit = (unit: Unit) => {
    const course = courses.find(c => c.id === unit.course_id)
    if (course) {
      setSelectedCourseForUnit(course)
      setSelectedUnit(unit)
      setShowUnitModal(true)
    }
  }

  const handleDeleteUnit = async (unitId: string) => {
    if (!confirm("Are you sure you want to delete this unit?")) {
      return
    }

    try {
      const response = await fetch(`http://localhost:8080/api/v1/auth/lecturer/units/${unitId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.message || "Failed to delete unit")
      }

      const result = await response.json()
      console.log(result.message)

      // Reload the courses list to update units
      await fetchCourses()
    } catch (error) {
      console.error("Error deleting unit:", error)
      setError(error instanceof Error ? error.message : "Failed to delete unit")
    }
  }

  const handleSubmitUnit = async (unitData: {
    unit_code: string
    unit_name: string
    level: number
    semester: number
  }) => {
    if (!selectedCourseForUnit) return

    try {
      setError(null)
      
      if (selectedUnit) {
        // Update existing unit
        const response = await fetch(`http://localhost:8080/api/v1/auth/lecturer/units/${selectedUnit.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            ...unitData,
            course_id: selectedCourseForUnit.id,
          }),
        })

        if (!response.ok) {
          const data = await response.json()
          throw new Error(data.message || "Failed to update unit")
        }

        const result = await response.json()
        console.log("Unit updated successfully:", result)
      } else {
        // Add new unit
        const response = await fetch("http://localhost:8080/api/v1/auth/lecturer/units", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            ...unitData,
            course_id: selectedCourseForUnit.id,
          }),
        })

        if (!response.ok) {
          const data = await response.json()
          throw new Error(data.message || "Failed to add unit")
        }

        const result = await response.json()
        console.log("Unit created successfully:", result.message, "ID:", result.unit_id)
      }

      // Reload the courses list to update units
      await fetchCourses()

      setShowUnitModal(false)
      setSelectedCourseForUnit(null)
      setSelectedUnit(null)
    } catch (error) {
      console.error("Error saving unit:", error)
      setError(error instanceof Error ? error.message : "Failed to save unit")
    }
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />

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
            {/* Error Display */}
            {error && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center">
                  <div className="text-red-800">
                    <strong>Error:</strong> {error}
                  </div>
                  <button 
                    onClick={() => setError(null)}
                    className="ml-auto text-red-600 hover:text-red-800"
                  >
                    ×
                  </button>
                </div>
              </div>
            )}

            {/* Header Actions */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-800 mb-2">My Courses</h1>
                <p className="text-gray-600">Manage your academic programs and course structures</p>
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
                      onAddUnit={handleAddUnit}
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

      {/* Add/Edit Unit Modal */}
      {showUnitModal && selectedCourseForUnit && (
        <UnitModal
          course={selectedCourseForUnit}
          unit={selectedUnit}
          onClose={() => {
            setShowUnitModal(false)
            setSelectedCourseForUnit(null)
            setSelectedUnit(null)
          }}
          onSubmit={handleSubmitUnit}
        />
      )}
    </div>
  )
}

// Unit Modal Component
const UnitModal = ({
  course,
  unit,
  onClose,
  onSubmit,
}: {
  course: Course
  unit: Unit | null
  onClose: () => void
  onSubmit: (unitData: {
    unit_code: string
    unit_name: string
    level: number
    semester: number
  }) => void
}) => {
  const [formData, setFormData] = useState({
    unit_code: unit?.unit_code || "",
    unit_name: unit?.unit_name || "",
    level: unit?.level || 1,
    semester: unit?.semester || 1,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: name === 'level' || name === 'semester' ? parseInt(value) : value
    }))
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-800">
            {unit ? 'Edit Unit' : 'Add Unit'} - {course.name}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Unit Code
            </label>
            <input
              type="text"
              name="unit_code"
              value={formData.unit_code}
              onChange={handleChange}
              required
              placeholder="e.g., CCS 4102"
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Unit Name
            </label>
            <input
              type="text"
              name="unit_name"
              value={formData.unit_name}
              onChange={handleChange}
              required
              placeholder="e.g., Machine Learning"
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Level
              </label>
              <select
                name="level"
                value={formData.level}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              >
                <option value={1}>Level 1</option>
                <option value={2}>Level 2</option>
                <option value={3}>Level 3</option>
                <option value={4}>Level 4</option>
                <option value={5}>Level 5</option>
                <option value={6}>Level 6</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Semester
              </label>
              <select
                name="semester"
                value={formData.semester}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              >
                <option value={1}>Semester 1</option>
                <option value={2}>Semester 2</option>
                <option value={3}>Semester 3</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
            >
              {unit ? 'Update Unit' : 'Add Unit'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}