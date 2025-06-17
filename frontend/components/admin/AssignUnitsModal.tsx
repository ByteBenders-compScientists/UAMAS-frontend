"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { X, Search, BookOpen, GraduationCap } from "lucide-react"

type Unit = {
  id: string
  unit_code: string
  unit_name: string
  course_id: string
}

type Course = {
  id: string
  name: string
  code: string
}

type AssignUnitsModalProps = {
  lecturerId: string
  onClose: () => void
  onAssign: (unitIds: string[]) => void
}

export default function AssignUnitsModal({ lecturerId, onClose, onAssign }: AssignUnitsModalProps) {
  const [units, setUnits] = useState<Unit[]>([])
  const [courses, setCourses] = useState<Course[]>([])
  const [selectedUnits, setSelectedUnits] = useState<string[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCourse, setSelectedCourse] = useState<string>("")
  const [isLoading, setIsLoading] = useState(true)
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch units
        const unitsResponse = await fetch("http://localhost:8080/api/v1/admin/units", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        })

        if (!unitsResponse.ok) {
          throw new Error("Failed to fetch units")
        }

        const unitsData = await unitsResponse.json()
        setUnits(unitsData)

        // Fetch courses
        const coursesResponse = await fetch("http://localhost:8080/api/v1/admin/courses", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        })

        if (!coursesResponse.ok) {
          throw new Error("Failed to fetch courses")
        }

        const coursesData = await coursesResponse.json()
        setCourses(coursesData)
      } catch (error) {
        console.error("Error fetching data:", error)
        setErrors((prev) => ({
          ...prev,
          fetch: "Failed to load data. Please try again.",
        }))
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  const filteredUnits = units.filter((unit) => {
    const matchesSearch = unit.unit_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      unit.unit_code.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCourse = !selectedCourse || unit.course_id === selectedCourse
    return matchesSearch && matchesCourse
  })

  const getCourseName = (courseId: string) => {
    const course = courses.find(c => c.id === courseId)
    return course ? `${course.name} (${course.code})` : 'Unknown Course'
  }

  const handleUnitToggle = (unitId: string) => {
    setSelectedUnits((prev) =>
      prev.includes(unitId)
        ? prev.filter((id) => id !== unitId)
        : [...prev, unitId]
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (selectedUnits.length === 0) {
      setErrors((prev) => ({ ...prev, submit: "Please select at least one unit" }))
      return
    }

    try {
      const response = await fetch(`http://localhost:8080/api/v1/admin/lecturers/${lecturerId}/units`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ unit_ids: selectedUnits }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.message || "Failed to assign units")
      }

      onAssign(selectedUnits)
      onClose()
    } catch (error) {
      console.error("Error assigning units:", error)
      setErrors((prev) => ({
        ...prev,
        submit: error instanceof Error ? error.message : "Failed to assign units",
      }))
    }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 backdrop-blur-sm bg-black/30">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.2 }}
        className="w-full max-w-2xl bg-white rounded-xl shadow-xl"
      >
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-xl font-semibold text-gray-800">Assign Units</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {errors.submit && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
              {errors.submit}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Course</label>
              <div className="relative">
                <GraduationCap size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <select
                  value={selectedCourse}
                  onChange={(e) => setSelectedCourse(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                >
                  <option value="">All Courses</option>
                  {courses.map((course) => (
                    <option key={course.id} value={course.id}>
                      {course.name} ({course.code})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Search Units</label>
              <div className="relative">
                <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by unit name or code..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          <div className="mt-4 max-h-96 overflow-y-auto border border-gray-200 rounded-lg">
            {isLoading ? (
              <div className="p-4 text-center text-gray-500">Loading units...</div>
            ) : filteredUnits.length === 0 ? (
              <div className="p-4 text-center text-gray-500">No units found</div>
            ) : (
              <div className="divide-y divide-gray-100">
                {filteredUnits.map((unit) => (
                  <label
                    key={unit.id}
                    className="flex items-center space-x-3 p-4 hover:bg-gray-50 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={selectedUnits.includes(unit.id)}
                      onChange={() => handleUnitToggle(unit.id)}
                      className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
                    />
                    <div>
                      <div className="font-medium text-gray-900">{unit.unit_name}</div>
                      <div className="text-sm text-gray-500">
                        {unit.unit_code} • {getCourseName(unit.course_id)}
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading || selectedUnits.length === 0}
              className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Saving..." : "Assign Units"}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  )
} 