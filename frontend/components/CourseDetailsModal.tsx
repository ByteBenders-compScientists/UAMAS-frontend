"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  X,
  GraduationCap,
  Building,
  BookOpen,
  Plus,
  Edit,
  Trash2,
  Calendar,
  Users,
  Save,
  AlertCircle,
  ChevronLeft,
  ChevronRight
} from "lucide-react"

type Unit = {
  id?: string
  unit_code: string
  unit_name: string
  level: number
  semester: number
}

type Course = {
  id: string
  code: string
  name: string
  department: string
  school: string
  units: Unit[]
}

type TabType = 'overview' | 'units'

interface CourseDetailsModalProps {
  course: Course
  onClose: () => void
  onUpdate: () => void
}

const UnitForm = ({
  unit,
  onSubmit,
  onCancel,
}: {
  unit?: Unit
  onSubmit: (unit: Unit) => void
  onCancel: () => void
}) => {
  const [formData, setFormData] = useState<Unit>({
    unit_code: unit?.unit_code || '',
    unit_name: unit?.unit_name || '',
    level: unit?.level || 1,
    semester: unit?.semester || 1,
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const validate = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.unit_code.trim()) {
      newErrors.unit_code = 'Unit code is required'
    }

    if (!formData.unit_name.trim()) {
      newErrors.unit_name = 'Unit name is required'
    }

    if (formData.level < 1 || formData.level > 8) {
      newErrors.level = 'Level must be between 1 and 8'
    }

    if (formData.semester < 1 || formData.semester > 3) {
      newErrors.semester = 'Semester must be between 1 and 3'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = () => {
    if (validate()) {
      onSubmit({ ...formData, id: unit?.id })
    }
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Unit Code *
          </label>
          <input
            type="text"
            value={formData.unit_code}
            onChange={(e) => setFormData({ ...formData, unit_code: e.target.value })}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent ${
              errors.unit_code ? 'border-red-300' : 'border-gray-300'
            }`}
            placeholder="e.g., CSC101"
          />
          {errors.unit_code && (
            <p className="text-red-500 text-xs mt-1">{errors.unit_code}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Unit Name *
          </label>
          <input
            type="text"
            value={formData.unit_name}
            onChange={(e) => setFormData({ ...formData, unit_name: e.target.value })}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent ${
              errors.unit_name ? 'border-red-300' : 'border-gray-300'
            }`}
            placeholder="e.g., Introduction to Computer Science"
          />
          {errors.unit_name && (
            <p className="text-red-500 text-xs mt-1">{errors.unit_name}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Level *
          </label>
          <select
            value={formData.level}
            onChange={(e) => setFormData({ ...formData, level: parseInt(e.target.value) })}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent ${
              errors.level ? 'border-red-300' : 'border-gray-300'
            }`}
          >
            {[1, 2, 3, 4, 5, 6, 7, 8].map((level) => (
              <option key={level} value={level}>
                Level {level}
              </option>
            ))}
          </select>
          {errors.level && (
            <p className="text-red-500 text-xs mt-1">{errors.level}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Semester *
          </label>
          <select
            value={formData.semester}
            onChange={(e) => setFormData({ ...formData, semester: parseInt(e.target.value) })}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent ${
              errors.semester ? 'border-red-300' : 'border-gray-300'
            }`}
          >
            <option value={1}>Semester 1</option>
            <option value={2}>Semester 2</option>
            <option value={3}>Semester 3</option>
          </select>
          {errors.semester && (
            <p className="text-red-500 text-xs mt-1">{errors.semester}</p>
          )}
        </div>
      </div>

      <div className="flex justify-end space-x-3 pt-4 border-t">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors flex items-center space-x-2"
        >
          <Save size={16} />
          <span>{unit ? 'Update Unit' : 'Add Unit'}</span>
        </button>
      </div>
    </div>
  )
}

const UnitCard = ({
  unit,
  onEdit,
  onDelete,
}: {
  unit: Unit
  onEdit: (unit: Unit) => void
  onDelete: (unit: Unit) => void
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    className="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:shadow-sm transition-all duration-200"
  >
    <div className="flex items-start justify-between">
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
          <BookOpen size={16} className="text-amber-600" />
        </div>
        <div>
          <h4 className="font-medium text-gray-800">{unit.unit_name}</h4>
          <p className="text-sm text-gray-500">{unit.unit_code}</p>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <button
          onClick={() => onEdit(unit)}
          className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-white rounded transition-colors"
        >
          <Edit size={14} />
        </button>
        <button
          onClick={() => onDelete(unit)}
          className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-white rounded transition-colors"
        >
          <Trash2 size={14} />
        </button>
      </div>
    </div>

    <div className="mt-3 flex items-center justify-between">
      <div className="flex items-center text-sm text-gray-600">
        <Calendar size={14} className="mr-1" />
        <span>Level {unit.level}</span>
      </div>
      <div className="px-2 py-1 bg-amber-100 text-amber-700 rounded text-xs font-medium">
        Semester {unit.semester}
      </div>
    </div>
  </motion.div>
)

export default function CourseDetailsModal({ course, onClose, onUpdate }: CourseDetailsModalProps) {
  const [activeTab, setActiveTab] = useState<TabType>('overview')
  const [units, setUnits] = useState<Unit[]>(course.units || [])
  const [showUnitForm, setShowUnitForm] = useState(false)
  const [editingUnit, setEditingUnit] = useState<Unit | undefined>(undefined)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string>('')

  useEffect(() => {
    setUnits(course.units || [])
  }, [course.units])

  const handleAddUnit = async (unitData: Unit) => {
    setIsLoading(true)
    setError('')
    try {
      // Simulate API call - replace with actual endpoint
      const response = await fetch(`http://localhost:3000/api/courses/${course.id}/units`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(unitData),
      })

      if (!response.ok) {
        throw new Error('Failed to add unit')
      }

      const newUnit = await response.json()
      setUnits([...units, newUnit])
      setShowUnitForm(false)
      onUpdate()
    } catch (err) {
      setError('Failed to add unit. Please try again.')
      console.error('Error adding unit:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleUpdateUnit = async (unitData: Unit) => {
    if (!unitData.id) return
    
    setIsLoading(true)
    setError('')
    try {
      const response = await fetch(`http://localhost:3000/api/units/${unitData.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(unitData),
      })

      if (!response.ok) {
        throw new Error('Failed to update unit')
      }

      const updatedUnit = await response.json()
      setUnits(units.map(unit => unit.id === unitData.id ? updatedUnit : unit))
      setEditingUnit(undefined)
      setShowUnitForm(false)
      onUpdate()
    } catch (err) {
      setError('Failed to update unit. Please try again.')
      console.error('Error updating unit:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteUnit = async (unit: Unit) => {
    if (!unit.id || !confirm('Are you sure you want to delete this unit?')) return

    setIsLoading(true)
    setError('')
    try {
      const response = await fetch(`http://localhost:3000/api/units/${unit.id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete unit')
      }

      setUnits(units.filter(u => u.id !== unit.id))
      onUpdate()
    } catch (err) {
      setError('Failed to delete unit. Please try again.')
      console.error('Error deleting unit:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleEditUnit = (unit: Unit) => {
    setEditingUnit(unit)
    setShowUnitForm(true)
  }

  const handleFormSubmit = (unitData: Unit) => {
    if (editingUnit) {
      handleUpdateUnit(unitData)
    } else {
      handleAddUnit(unitData)
    }
  }

  const handleFormCancel = () => {
    setShowUnitForm(false)
    setEditingUnit(undefined)
    setError('')
  }

  const groupedUnits = units.reduce((acc, unit) => {
    const key = `Level ${unit.level}`
    if (!acc[key]) acc[key] = []
    acc[key].push(unit)
    return acc
  }, {} as Record<string, Unit[]>)

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 px-6 py-4 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                <GraduationCap size={20} />
              </div>
              <div>
                <h2 className="text-xl font-semibold">{course.name}</h2>
                <p className="text-emerald-100 text-sm">{course.code}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <div className="flex">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'overview'
                  ? 'border-emerald-500 text-emerald-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('units')}
              className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'units'
                  ? 'border-emerald-500 text-emerald-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Units ({units.length})
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2 text-red-700">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Building size={16} className="text-gray-400" />
                    <span className="text-sm text-gray-600">Department</span>
                  </div>
                  <p className="font-medium text-gray-800">{course.department}</p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <GraduationCap size={16} className="text-gray-400" />
                    <span className="text-sm text-gray-600">School</span>
                  </div>
                  <p className="font-medium text-gray-800">{course.school}</p>
                </div>
              </div>

              <div className="border-t pt-6">
                <div className="flex items-center space-x-2 mb-4">
                  <Users size={16} className="text-gray-400" />
                  <span className="text-sm text-gray-600">Course Statistics</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="text-2xl font-bold text-gray-800">{units.length}</div>
                    <div className="text-sm text-gray-600">Total Units</div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="text-2xl font-bold text-gray-800">
                      {Math.max(...units.map(u => u.level), 0)}
                    </div>
                    <div className="text-sm text-gray-600">Max Level</div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="text-2xl font-bold text-gray-800">
                      {new Set(units.map(u => u.semester)).size}
                    </div>
                    <div className="text-sm text-gray-600">Semesters</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'units' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-800">Course Units</h3>
                <button
                  onClick={() => setShowUnitForm(true)}
                  disabled={isLoading}
                  className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors flex items-center space-x-2 disabled:opacity-50"
                >
                  <Plus size={16} />
                  <span>Add Unit</span>
                </button>
              </div>

              {showUnitForm && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-gray-50 rounded-lg p-6 border"
                >
                  <h4 className="text-lg font-medium text-gray-800 mb-4">
                    {editingUnit ? 'Edit Unit' : 'Add New Unit'}
                  </h4>
                  <UnitForm
                    unit={editingUnit}
                    onSubmit={handleFormSubmit}
                    onCancel={handleFormCancel}
                  />
                </motion.div>
              )}

              {Object.keys(groupedUnits).length === 0 ? (
                <div className="text-center py-12">
                  <BookOpen size={48} className="mx-auto text-gray-300 mb-4" />
                  <h3 className="text-lg font-medium text-gray-500 mb-2">No units yet</h3>
                  <p className="text-gray-400">Add your first unit to get started</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {Object.entries(groupedUnits)
                    .sort(([a], [b]) => parseInt(a.split(' ')[1]) - parseInt(b.split(' ')[1]))
                    .map(([level, levelUnits]) => (
                      <div key={level} className="space-y-3">
                        <h4 className="text-md font-medium text-gray-700 flex items-center space-x-2">
                          <Calendar size={16} />
                          <span>{level}</span>
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <AnimatePresence>
                            {levelUnits
                              .sort((a, b) => a.semester - b.semester)
                              .map((unit) => (
                                <UnitCard
                                  key={unit.id || `${unit.unit_code}-${unit.level}-${unit.semester}`}
                                  unit={unit}
                                  onEdit={handleEditUnit}
                                  onDelete={handleDeleteUnit}
                                />
                              ))}
                          </AnimatePresence>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  )
}