"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { X, BookOpen, Hash, GraduationCap, Calendar } from "lucide-react"

type Course = {
  id: string
  code: string
  name: string
  department: string
  school: string
}

type Unit = {
  id: string
  unit_code: string
  unit_name: string
  level: number
  semester: number
  course_id: string
  course: {
    id: string
    name: string
    code: string
  }
}

type AddUnitModalProps = {
  unit?: Unit | null
  onClose: () => void
  onSubmit: (data: any) => void
}

export default function AddUnitModal({ unit, onClose, onSubmit }: AddUnitModalProps) {
  const [formData, setFormData] = useState({
    unit_code: "",
    unit_name: "",
    level: 1,
    semester: 1,
    course_id: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [courses, setCourses] = useState<Course[]>([])
  const [isLoadingCourses, setIsLoadingCourses] = useState(true)

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/v1/admin/courses", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        })

        if (!response.ok) {
          throw new Error("Failed to fetch courses")
        }

        const data = await response.json()
        setCourses(data)
      } catch (error) {
        console.error("Error fetching courses:", error)
        setErrors((prev) => ({
          ...prev,
          courses: "Failed to load courses. Please try again.",
        }))
      } finally {
        setIsLoadingCourses(false)
      }
    }

    fetchCourses()
  }, [])

  useEffect(() => {
    if (unit) {
      setFormData({
        unit_code: unit.unit_code,
        unit_name: unit.unit_name,
        level: unit.level,
        semester: unit.semester,
        course_id: unit.course_id,
      })
    }
  }, [unit])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.unit_code.trim()) {
      newErrors.unit_code = "Unit code is required"
    }
    if (!formData.unit_name.trim()) {
      newErrors.unit_name = "Unit name is required"
    }
    if (!formData.course_id) {
      newErrors.course_id = "Course selection is required"
    }
    if (formData.level < 1 || formData.level > 6) {
      newErrors.level = "Level must be between 1 and 6"
    }
    if (formData.semester < 1 || formData.semester > 2) {
      newErrors.semester = "Semester must be 1 or 2"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsLoading(true)
    try {
      const url = unit
        ? `http://localhost:8080/api/v1/admin/units/${unit.id}`
        : "http://localhost:8080/api/v1/admin/units"

      const response = await fetch(url, {
        method: unit ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Failed to save unit")
      }

      onSubmit(data)
      onClose()
    } catch (error) {
      console.error("Error submitting form:", error)
      setErrors((prev) => ({
        ...prev,
        submit: error instanceof Error ? error.message : "Failed to save unit",
      }))
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === "level" || name === "semester" ? Number.parseInt(value) : value,
    }))

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 backdrop-blur-sm bg-black/30">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.2 }}
        className="w-full max-w-md bg-white rounded-xl shadow-xl"
      >
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-xl font-semibold text-gray-800">{unit ? "Edit Unit" : "Add New Unit"}</h2>
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

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Unit Code *</label>
            <div className="relative">
              <Hash size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                name="unit_code"
                value={formData.unit_code}
                onChange={handleChange}
                placeholder="e.g., CS 4102"
                className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent ${
                  errors.unit_code ? "border-red-300" : "border-gray-200"
                }`}
              />
            </div>
            {errors.unit_code && <p className="mt-1 text-sm text-red-600">{errors.unit_code}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Unit Name *</label>
            <div className="relative">
              <BookOpen size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                name="unit_name"
                value={formData.unit_name}
                onChange={handleChange}
                placeholder="e.g., Machine Learning"
                className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent ${
                  errors.unit_name ? "border-red-300" : "border-gray-200"
                }`}
              />
            </div>
            {errors.unit_name && <p className="mt-1 text-sm text-red-600">{errors.unit_name}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Course *</label>
            <div className="relative">
              <GraduationCap size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <select
                name="course_id"
                value={formData.course_id}
                onChange={handleChange}
                disabled={isLoadingCourses}
                className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent ${
                  errors.course_id ? "border-red-300" : "border-gray-200"
                } ${isLoadingCourses ? "bg-gray-50 cursor-not-allowed" : ""}`}
              >
                <option value="">Select a course</option>
                {courses.map((course) => (
                  <option key={course.id} value={course.id}>
                    {course.name} ({course.code})
                  </option>
                ))}
              </select>
            </div>
            {errors.course_id && <p className="mt-1 text-sm text-red-600">{errors.course_id}</p>}
            {errors.courses && <p className="mt-1 text-sm text-red-600">{errors.courses}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Level *</label>
              <select
                name="level"
                value={formData.level}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent ${
                  errors.level ? "border-red-300" : "border-gray-200"
                }`}
              >
                {[1, 2, 3, 4, 5, 6].map((level) => (
                  <option key={level} value={level}>
                    Level {level}
                  </option>
                ))}
              </select>
              {errors.level && <p className="mt-1 text-sm text-red-600">{errors.level}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Semester *</label>
              <div className="relative">
                <Calendar size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <select
                  name="semester"
                  value={formData.semester}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent ${
                    errors.semester ? "border-red-300" : "border-gray-200"
                  }`}
                >
                  <option value={1}>Semester 1</option>
                  <option value={2}>Semester 2</option>
                </select>
              </div>
              {errors.semester && <p className="mt-1 text-sm text-red-600">{errors.semester}</p>}
            </div>
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
              disabled={isLoading || isLoadingCourses}
              className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Saving..." : unit ? "Update Unit" : "Add Unit"}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}
