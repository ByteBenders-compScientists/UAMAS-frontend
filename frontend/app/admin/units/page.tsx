"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { useLayout } from "@/components/LayoutController"
import AdminSidebar from "@/components/AdminSidebar"
import Header from "@/components/Header"
import EmptyState from "@/components/EmptyState"
import AddUnitModal from "@/components/admin/AddUnitModal"
import { BookOpen, Plus, Search, Filter, Edit, Trash2, Eye, GraduationCap, Calendar, MoreVertical } from "lucide-react"

// Mock data
const mockUnits = [
  {
    id: "1",
    unit_code: "CS 4102",
    unit_name: "Machine Learning",
    level: 4,
    semester: 1,
    course: {
      name: "BSc. Computer Science",
      code: "CS",
    },
  },
  {
    id: "2",
    unit_code: "CS 3208",
    unit_name: "Multimedia Systems",
    level: 3,
    semester: 2,
    course: {
      name: "BSc. Computer Science",
      code: "CS",
    },
  },
  {
    id: "3",
    unit_code: "IT 2101",
    unit_name: "Database Systems",
    level: 2,
    semester: 1,
    course: {
      name: "BSc. Information Technology",
      code: "IT",
    },
  },
]

type Unit = {
  id: string
  unit_code: string
  unit_name: string
  level: number
  semester: number
  course: {
    name: string
    code: string
  }
}

const UnitCard = ({
  unit,
  onEdit,
  onDelete,
  onView,
}: {
  unit: Unit
  onEdit: (unit: Unit) => void
  onDelete: (id: string) => void
  onView: (unit: Unit) => void
}) => (
  <motion.div
    whileHover={{ y: -2 }}
    className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300"
  >
    <div className="flex items-start justify-between mb-4">
      <div className="flex items-center space-x-3">
        <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center">
          <BookOpen size={20} className="text-amber-600" />
        </div>
        <div>
          <h3 className="font-semibold text-gray-800">{unit.unit_name}</h3>
          <p className="text-sm text-gray-500">{unit.unit_code}</p>
        </div>
      </div>

      <div className="relative group">
        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <MoreVertical size={16} className="text-gray-400" />
        </button>
        <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
          <button
            onClick={() => onView(unit)}
            className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
          >
            <Eye size={16} />
            <span>View Details</span>
          </button>
          <button
            onClick={() => onEdit(unit)}
            className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
          >
            <Edit size={16} />
            <span>Edit</span>
          </button>
          <button
            onClick={() => onDelete(unit.id)}
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
        <GraduationCap size={14} className="mr-2" />
        <span>
          {unit.course.name} ({unit.course.code})
        </span>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center text-sm text-gray-600">
          <Calendar size={14} className="mr-2" />
          <span>Level {unit.level}</span>
        </div>
        <div className="px-2 py-1 bg-amber-100 text-amber-700 rounded text-xs font-medium">
          Semester {unit.semester}
        </div>
      </div>
    </div>
  </motion.div>
)

export default function UnitsPage() {
  const { sidebarCollapsed, isMobileView, isTabletView } = useLayout()
  const [isLoading, setIsLoading] = useState(true)
  const [units, setUnits] = useState<Unit[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [showAddModal, setShowAddModal] = useState(false)
  const [selectedUnit, setSelectedUnit] = useState<Unit | null>(null)

  useEffect(() => {
    const timer = setTimeout(() => {
      setUnits(mockUnits)
      setIsLoading(false)
    }, 800)
    return () => clearTimeout(timer)
  }, [])

  const filteredUnits = units.filter(
    (unit) =>
      unit.unit_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      unit.unit_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      unit.course.name.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleAddUnit = (unitData: any) => {
    console.log("Adding unit:", unitData)
    setShowAddModal(false)
  }

  const handleEditUnit = (unit: Unit) => {
    setSelectedUnit(unit)
    setShowAddModal(true)
  }

  const handleDeleteUnit = (id: string) => {
    console.log("Deleting unit:", id)
  }

  const handleViewUnit = (unit: Unit) => {
    console.log("Viewing unit:", unit)
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
        <Header title="Units Management" />

        <main className="p-4 md:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {/* Header Actions */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-800 mb-2">Units</h1>
                <p className="text-gray-600">Manage course units and academic modules</p>
              </div>

              <div className="flex items-center space-x-3 mt-4 md:mt-0">
                <button
                  onClick={() => setShowAddModal(true)}
                  className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium text-sm flex items-center space-x-2"
                >
                  <Plus size={16} />
                  <span>Add Unit</span>
                </button>
              </div>
            </div>

            {/* Search and Filters */}
            <div className="flex flex-col md:flex-row md:items-center space-y-3 md:space-y-0 md:space-x-4 mb-6">
              <div className="relative flex-1 max-w-md">
                <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search units..."
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
            ) : filteredUnits.length === 0 ? (
              <EmptyState
                icon={<BookOpen size={48} className="text-gray-400" />}
                title="No Units Found"
                description={
                  searchTerm ? "No units match your search criteria." : "Start by adding your first unit to the system."
                }
                actionLabel="Add Unit"
                onAction={() => setShowAddModal(true)}
              />
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {filteredUnits.map((unit, index) => (
                  <motion.div
                    key={unit.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.1 * index }}
                  >
                    <UnitCard unit={unit} onEdit={handleEditUnit} onDelete={handleDeleteUnit} onView={handleViewUnit} />
                  </motion.div>
                ))}
              </motion.div>
            )}
          </div>
        </main>
      </motion.div>

      {/* Add/Edit Unit Modal */}
      {showAddModal && (
        <AddUnitModal
          unit={selectedUnit}
          onClose={() => {
            setShowAddModal(false)
            setSelectedUnit(null)
          }}
          onSubmit={handleAddUnit}
        />
      )}
    </div>
  )
}
