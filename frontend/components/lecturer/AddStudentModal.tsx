"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { X, User, GraduationCap, Hash, Mail } from "lucide-react"

type Student = {
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

type AddStudentModalProps = {
  student?: Student | null
  onClose: () => void
  onSubmit: (data: any) => void
}

export default function AddStudentModal({ student, onClose, onSubmit }: AddStudentModalProps) {
  const [formData, setFormData] = useState({
    reg_number: student?.reg_number || "",
    firstname: student?.firstname || "",
    surname: student?.surname || "",
    othernames: student?.othernames || "",
    year_of_study: student?.year_of_study || 1,
    semester: student?.semester || 1,
    course_id: student?.course?.id || "",
    email: student?.email || "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [courses, setCourses] = useState<Course[]>([])
  const [isLoadingCourses, setIsLoadingCourses] = useState(true)

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/v1/auth/lecturer/courses", {
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
    if (student) {
      setFormData({
        reg_number: student.reg_number || "",
        firstname: student.firstname || "",
        surname: student.surname || "",
        othernames: student.othernames || "",
        year_of_study: student.year_of_study || 1,
        semester: student.semester || 1,
        course_id: student.course?.id || "",
        email: student.email || "",
      })
    } else {
      setFormData({
        reg_number: "",
        firstname: "",
        surname: "",
        othernames: "",
        year_of_study: 1,
        semester: 1,
        course_id: "",
        email: "",
      })
    }
  }, [student])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.reg_number?.trim()) {
      newErrors.reg_number = "Registration number is required"
    }
    if (!formData.firstname?.trim()) {
      newErrors.firstname = "First name is required"
    }
    if (!formData.surname?.trim()) {
      newErrors.surname = "Surname is required"
    }
    if (!formData.course_id) {
      newErrors.course_id = "Course selection is required"
    }
    if (formData.year_of_study < 1 || formData.year_of_study > 6) {
      newErrors.year_of_study = "Year of study must be between 1 and 6"
    }
    if (formData.semester < 1 || formData.semester > 2) {
      newErrors.semester = "Semester must be 1 or 2"
    }
    if (!formData.email?.trim()) {
      newErrors.email = "Email is required"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsLoading(true)
    try {
      await onSubmit(formData)
    } catch (error) {
      console.error("Error submitting form:", error)
      setErrors((prev) => ({
        ...prev,
        submit: error instanceof Error ? error.message : "Failed to save student",
      }))
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === "year_of_study" || name === "semester" ? Number.parseInt(value) : value,
    }))

    // Clear error when user starts typing
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
        className="w-full max-w-md bg-white rounded-xl shadow-xl max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-xl font-semibold text-gray-800">{student ? "Edit Student" : "Add New Student"}</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Registration Number */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Registration Number *</label>
            <div className="relative">
              <Hash size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                name="reg_number"
                value={formData.reg_number}
                onChange={handleChange}
                placeholder="e.g., C027-01-0910/2025"
                className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent ${
                  errors.reg_number ? "border-red-300" : "border-gray-200"
                }`}
              />
            </div>
            {errors.reg_number && <p className="mt-1 text-sm text-red-600">{errors.reg_number}</p>}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
            <div className="relative">
              <Mail size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter email address"
                className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent ${
                  errors.email ? "border-red-300" : "border-gray-200"
                }`}
              />
            </div>
            {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
          </div>

          {/* First Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">First Name *</label>
            <div className="relative">
              <User size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                name="firstname"
                value={formData.firstname}
                onChange={handleChange}
                placeholder="Enter first name"
                className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent ${
                  errors.firstname ? "border-red-300" : "border-gray-200"
                }`}
              />
            </div>
            {errors.firstname && <p className="mt-1 text-sm text-red-600">{errors.firstname}</p>}
          </div>

          {/* Surname */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Surname *</label>
            <input
              type="text"
              name="surname"
              value={formData.surname}
              onChange={handleChange}
              placeholder="Enter surname"
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent ${
                errors.surname ? "border-red-300" : "border-gray-200"
              }`}
            />
            {errors.surname && <p className="mt-1 text-sm text-red-600">{errors.surname}</p>}
          </div>

          {/* Other Names */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Other Names</label>
            <input
              type="text"
              name="othernames"
              value={formData.othernames}
              onChange={handleChange}
              placeholder="Enter other names (optional)"
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
          </div>

          {/* Course */}
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
                    {course.name} {course.code ? `(${course.code})` : ''}
                  </option>
                ))}
              </select>
            </div>
            {errors.course_id && <p className="mt-1 text-sm text-red-600">{errors.course_id}</p>}
            {errors.courses && <p className="mt-1 text-sm text-red-600">{errors.courses}</p>}
          </div>

          {/* Year of Study and Semester */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Year of Study *</label>
              <select
                name="year_of_study"
                value={formData.year_of_study}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent ${
                  errors.year_of_study ? "border-red-300" : "border-gray-200"
                }`}
              >
                {[1, 2, 3, 4, 5, 6].map((year) => (
                  <option key={year} value={year}>
                    Year {year}
                  </option>
                ))}
              </select>
              {errors.year_of_study && <p className="mt-1 text-sm text-red-600">{errors.year_of_study}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Semester *</label>
              <select
                name="semester"
                value={formData.semester}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent ${
                  errors.semester ? "border-red-300" : "border-gray-200"
                }`}
              >
                <option value={1}>Semester 1</option>
                <option value={2}>Semester 2</option>
              </select>
              {errors.semester && <p className="mt-1 text-sm text-red-600">{errors.semester}</p>}
            </div>
          </div>

          {/* Submit Error */}
          {errors.submit && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{errors.submit}</p>
            </div>
          )}

          {/* Actions */}
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
              disabled={isLoading}
              className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Saving..." : student ? "Update Student" : "Add Student"}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}