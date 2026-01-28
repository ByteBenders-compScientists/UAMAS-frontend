"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { X, GraduationCap, Building, Hash } from "lucide-react"
import { useThemeColors } from '@/context/ThemeContext'

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

type CourseFormData = {
  code: string
  name: string
  department: string
  school: string
}

type AddCourseModalProps = {
  course?: Course | null
  onClose: () => void
  onSubmit: (data: CourseFormData) => void
  isLoading?: boolean
  error?: string | null
}

export default function AddCourseModal({ course, onClose, onSubmit, isLoading = false, error }: AddCourseModalProps) {
  const colors = useThemeColors();
  const [formData, setFormData] = useState<CourseFormData>({
    code: "",
    name: "",
    department: "",
    school: "",
  })
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (course) {
      setFormData({
        code: course.code,
        name: course.name,
        department: course.department,
        school: course.school,
      })
    }
  }, [course])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.code.trim()) {
      newErrors.code = "Course code is required"
    }
    if (!formData.name.trim()) {
      newErrors.name = "Course name is required"
    }
    if (!formData.department.trim()) {
      newErrors.department = "Department is required"
    }
    if (!formData.school.trim()) {
      newErrors.school = "School is required"
    }

    setFormErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }
    
    onSubmit(formData)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 backdrop-blur-sm bg-black/30">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.2 }}
        className="w-full max-w-md rounded-xl shadow-xl"
        style={{ backgroundColor: colors.cardBackground }}
      >
        <div 
          className="flex items-center justify-between p-6 border-b"
          style={{ borderColor: colors.border }}
        >
          <h2 className="text-xl font-semibold" style={{ color: colors.textPrimary }}>{course ? "Edit Course" : "Add New Course"}</h2>
          <button 
            onClick={onClose} 
            className="p-2 hover:opacity-90 rounded-lg transition-colors"
            style={{ backgroundColor: colors.backgroundSecondary }}
          >
            <X size={20} style={{ color: colors.textSecondary }} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Display API error */}
          {error && (
            <div 
              className="p-3 border rounded-lg"
              style={{
                backgroundColor: `${colors.error}15`,
                borderColor: colors.error,
              }}
            >
              <p className="text-sm" style={{ color: colors.error }}>{error}</p>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: colors.textPrimary }}>Course Code *</label>
            <div className="relative">
              <Hash size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2" style={{ color: colors.textTertiary }} />
              <input
                type="text"
                name="code"
                value={formData.code}
                onChange={handleChange}
                placeholder="e.g., CS, IT, SE"
                className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:border-transparent ${
                  formErrors.code ? "border-red-300" : ""
                }`}
                style={{
                  backgroundColor: colors.inputBackground,
                  borderColor: formErrors.code ? colors.error : colors.inputBorder,
                  color: colors.textPrimary,
                }}
              />
            </div>
            {formErrors.code && <p className="mt-1 text-sm" style={{ color: colors.error }}>{formErrors.code}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: colors.textPrimary }}>Course Name *</label>
            <div className="relative">
              <GraduationCap size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2" style={{ color: colors.textTertiary }} />
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g., BSc. Computer Science"
                className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:border-transparent ${
                  formErrors.name ? "border-red-300" : ""
                }`}
                style={{
                  backgroundColor: colors.inputBackground,
                  borderColor: formErrors.name ? colors.error : colors.inputBorder,
                  color: colors.textPrimary,
                }}
              />
            </div>
            {formErrors.name && <p className="mt-1 text-sm" style={{ color: colors.error }}>{formErrors.name}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: colors.textPrimary }}>Department *</label>
            <div className="relative">
              <Building size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2" style={{ color: colors.textTertiary }} />
              <input
                type="text"
                name="department"
                value={formData.department}
                onChange={handleChange}
                placeholder="e.g., Computer Science"
                className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:border-transparent ${
                  formErrors.department ? "border-red-300" : ""
                }`}
                style={{
                  backgroundColor: colors.inputBackground,
                  borderColor: formErrors.department ? colors.error : colors.inputBorder,
                  color: colors.textPrimary,
                }}
              />
            </div>
            {formErrors.department && <p className="mt-1 text-sm" style={{ color: colors.error }}>{formErrors.department}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: colors.textPrimary }}>School *</label>
            <div className="relative">
              <Building size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2" style={{ color: colors.textTertiary }} />
              <input
                type="text"
                name="school"
                value={formData.school}
                onChange={handleChange}
                placeholder="e.g., CS & IT"
                className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:border-transparent ${
                  formErrors.school ? "border-red-300" : ""
                }`}
                style={{
                  backgroundColor: colors.inputBackground,
                  borderColor: formErrors.school ? colors.error : colors.inputBorder,
                  color: colors.textPrimary,
                }}
              />
            </div>
            {formErrors.school && <p className="mt-1 text-sm" style={{ color: colors.error }}>{formErrors.school}</p>}
          </div>

          <div className="flex items-center justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg hover:opacity-90 transition-colors"
              style={{
                backgroundColor: colors.backgroundSecondary,
                color: colors.textPrimary,
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 text-white rounded-lg hover:opacity-90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ backgroundColor: colors.primary }}
            >
              {isLoading ? "Saving..." : course ? "Update Course" : "Add Course"}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}