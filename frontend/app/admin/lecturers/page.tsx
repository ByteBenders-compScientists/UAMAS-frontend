"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { useLayout } from "@/components/LayoutController"
import AdminSidebar from "@/components/AdminSidebar"
import Header from "@/components/Header"
import EmptyState from "@/components/EmptyState"
import AddLecturerModal from "@/components/admin/AddLecturerModal"
import { UserCheck, Plus, Search, Filter, Edit, Trash2, Eye, Mail, BookOpen, MoreVertical } from "lucide-react"

// Mock data
const mockLecturers = [
  {
    id: "1",
    firstname: "John",
    surname: "Doe",
    othernames: "Kibet",
    email: "john.doe@dekut.edu",
    units: [
      { unit_code: "CS 4102", unit_name: "Machine Learning" },
      { unit_code: "CS 3208", unit_name: "Multimedia Systems" },
    ],
  },
  {
    id: "2",
    firstname: "Jane",
    surname: "Smith",
    othernames: "Wanjiku",
    email: "jane.smith@dekut.edu",
    units: [{ unit_code: "IT 2101", unit_name: "Database Systems" }],
  },
]

type Lecturer = {
  id: string
  firstname: string
  surname: string
  othernames: string
  email: string
  units: Array<{
    unit_code: string
    unit_name: string
  }>
}

const LecturerCard = ({
  lecturer,
  onEdit,
  onDelete,
  onView,
  onAssignUnits,
}: {
  lecturer: Lecturer
  onEdit: (lecturer: Lecturer) => void
  onDelete: (id: string) => void
  onView: (lecturer: Lecturer) => void
  onAssignUnits: (lecturer: Lecturer) => void
}) => (
  <motion.div
    whileHover={{ y: -2 }}
    className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300"
  >
    <div className="flex items-start justify-between mb-4">
      <div className="flex items-center space-x-3">
        <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
          <UserCheck size={20} className="text-emerald-600" />
        </div>
        <div>
          <h3 className="font-semibold text-gray-800">
            {lecturer.firstname} {lecturer.surname}
          </h3>
          <p className="text-sm text-gray-500 flex items-center">
            <Mail size={14} className="mr-1" />
            {lecturer.email}
          </p>
        </div>
      </div>

      <div className="relative group">
        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <MoreVertical size={16} className="text-gray-400" />
        </button>
        <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
          <button
            onClick={() => onView(lecturer)}
            className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
          >
            <Eye size={16} />
            <span>View Details</span>
          </button>
          <button
            onClick={() => onEdit(lecturer)}
            className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
          >
            <Edit size={16} />
            <span>Edit</span>
          </button>
          <button
            onClick={() => onAssignUnits(lecturer)}
            className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
          >
            <BookOpen size={16} />
            <span>Assign Units</span>
          </button>
          <button
            onClick={() => onDelete(lecturer.id)}
            className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
          >
            <Trash2 size={16} />
            <span>Delete</span>
          </button>
        </div>
      </div>
    </div>

    <div className="space-y-3">
      <div className="flex justify-between text-sm">
        <span className="text-gray-500">Other Names:</span>
        <span className="font-medium text-gray-800">{lecturer.othernames}</span>
      </div>

      <div>
        <span className="text-sm text-gray-500 mb-2 block">Assigned Units:</span>
        {lecturer.units.length > 0 ? (
          <div className="space-y-1">
            {lecturer.units.slice(0, 2).map((unit, index) => (
              <div key={index} className="text-xs bg-emerald-50 text-emerald-700 px-2 py-1 rounded">
                {unit.unit_code} - {unit.unit_name}
              </div>
            ))}
            {lecturer.units.length > 2 && (
              <div className="text-xs text-gray-500">+{lecturer.units.length - 2} more units</div>
            )}
          </div>
        ) : (
          <div className="text-xs text-gray-400 italic">No units assigned</div>
        )}
      </div>
    </div>
  </motion.div>
)

export default function LecturersPage() {
  const { sidebarCollapsed, isMobileView, isTabletView } = useLayout()
  const [isLoading, setIsLoading] = useState(true)
  const [lecturers, setLecturers] = useState<Lecturer[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [showAddModal, setShowAddModal] = useState(false)
  const [selectedLecturer, setSelectedLecturer] = useState<Lecturer | null>(null)

  useEffect(() => {
    const timer = setTimeout(() => {
      setLecturers(mockLecturers)
      setIsLoading(false)
    }, 800)
    return () => clearTimeout(timer)
  }, [])

  const filteredLecturers = lecturers.filter(
    (lecturer) =>
      lecturer.firstname.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lecturer.surname.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lecturer.email.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleAddLecturer = (lecturerData: any) => {
    console.log("Adding lecturer:", lecturerData)
    setShowAddModal(false)
  }

  const handleEditLecturer = (lecturer: Lecturer) => {
    setSelectedLecturer(lecturer)
    setShowAddModal(true)
  }

  const handleDeleteLecturer = (id: string) => {
    console.log("Deleting lecturer:", id)
  }

  const handleViewLecturer = (lecturer: Lecturer) => {
    console.log("Viewing lecturer:", lecturer)
  }

  const handleAssignUnits = (lecturer: Lecturer) => {
    console.log("Assigning units to lecturer:", lecturer)
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
        <Header title="Lecturers Management" />

        <main className="p-4 md:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {/* Header Actions */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-800 mb-2">Lecturers</h1>
                <p className="text-gray-600">Manage lecturer profiles and unit assignments</p>
              </div>

              <div className="flex items-center space-x-3 mt-4 md:mt-0">
                <button
                  onClick={() => setShowAddModal(true)}
                  className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium text-sm flex items-center space-x-2"
                >
                  <Plus size={16} />
                  <span>Add Lecturer</span>
                </button>
              </div>
            </div>

            {/* Search and Filters */}
            <div className="flex flex-col md:flex-row md:items-center space-y-3 md:space-y-0 md:space-x-4 mb-6">
              <div className="relative flex-1 max-w-md">
                <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search lecturers..."
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
            ) : filteredLecturers.length === 0 ? (
              <EmptyState
                icon={<UserCheck size={48} className="text-gray-400" />}
                title="No Lecturers Found"
                description={
                  searchTerm
                    ? "No lecturers match your search criteria."
                    : "Start by adding your first lecturer to the system."
                }
                actionLabel="Add Lecturer"
                onAction={() => setShowAddModal(true)}
              />
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {filteredLecturers.map((lecturer, index) => (
                  <motion.div
                    key={lecturer.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.1 * index }}
                  >
                    <LecturerCard
                      lecturer={lecturer}
                      onEdit={handleEditLecturer}
                      onDelete={handleDeleteLecturer}
                      onView={handleViewLecturer}
                      onAssignUnits={handleAssignUnits}
                    />
                  </motion.div>
                ))}
              </motion.div>
            )}
          </div>
        </main>
      </motion.div>

      {/* Add/Edit Lecturer Modal */}
      {showAddModal && (
        <AddLecturerModal
          lecturer={selectedLecturer}
          onClose={() => {
            setShowAddModal(false)
            setSelectedLecturer(null)
          }}
          onSubmit={handleAddLecturer}
        />
      )}
    </div>
  )
}
