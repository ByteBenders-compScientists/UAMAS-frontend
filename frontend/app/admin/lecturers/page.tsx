"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { useLayout } from "@/components/LayoutController"
import AdminSidebar from "@/components/AdminSidebar"
import Header from "@/components/Header"
import EmptyState from "@/components/EmptyState"
import AddLecturerModal from "@/components/admin/AddLecturerModal"
import { UserCheck, Plus, Search, Filter, Edit, Trash2 } from "lucide-react"

type Lecturer = {
  id: string
  firstname: string
  surname: string
  othernames: string
  email: string
}

const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080/api/v1"

export default function LecturersPage() {
  const { sidebarCollapsed, isMobileView, isTabletView } = useLayout()
  const [isLoading, setIsLoading] = useState(true)
  const [lecturers, setLecturers] = useState<Lecturer[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [showAddModal, setShowAddModal] = useState(false)
  const [selectedLecturer, setSelectedLecturer] = useState<Lecturer | null>(null)

  useEffect(() => {
    const fetchLecturers = async () => {
      setIsLoading(true)
      const res = await fetch(`${apiBaseUrl}/admin/lecturers`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      })
      const data = await res.json()
      setLecturers(data)
      setIsLoading(false)
    }
    fetchLecturers()
  }, [])

  const filteredLecturers = lecturers.filter(
    (lecturer) =>
      lecturer.firstname.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lecturer.surname.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lecturer.email.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleAddLecturer = async (lecturerData: Partial<Lecturer>) => {
    try {
      if (selectedLecturer) {
        // Update existing lecturer
        const response = await fetch(`${apiBaseUrl}/admin/lecturers/${selectedLecturer.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(lecturerData),
        })

        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.message || "Failed to update lecturer")
        }
      } else {
        // Add new lecturer
        console.log("Adding new lecturer:", lecturerData)
        const response = await fetch(`${apiBaseUrl}/admin/lecturers`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(lecturerData),
        })

        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.message || "Failed to add lecturer")
        }
      }

      // Reload the lecturers list
      const lecturersResponse = await fetch(`${apiBaseUrl}/admin/lecturers`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      })

      const lecturersData = await lecturersResponse.json()
      setLecturers(lecturersData)

      setShowAddModal(false)
      setSelectedLecturer(null)
    } catch (error) {
      console.error("Error saving lecturer:", error)
      // Reload the lecturers list even if there was an error
      const lecturersResponse = await fetch(`${apiBaseUrl}/admin/lecturers`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      })

      const lecturersData = await lecturersResponse.json()
      setLecturers(lecturersData)
    }
  }

  const handleEditLecturer = async (lecturer: Lecturer) => {
    setSelectedLecturer(lecturer)
    setShowAddModal(true)
  }

  const handleDeleteLecturer = async (id: string) => {
    if (!confirm("Are you sure you want to delete this lecturer?")) {
      return
    }

    try {
      const response = await fetch(`${apiBaseUrl}/admin/lecturers/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.message || "Failed to delete lecturer")
      }

      // Reload the lecturers list
      const lecturersResponse = await fetch(`${apiBaseUrl}/admin/lecturers`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      })

      const lecturersData = await lecturersResponse.json()
      setLecturers(lecturersData)
    } catch (error) {
      console.error("Error deleting lecturer:", error)
      // Reload the lecturers list even if there was an error
      const lecturersResponse = await fetch(`${apiBaseUrl}/admin/lecturers`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      })

      const lecturersData = await lecturersResponse.json()
      setLecturers(lecturersData)
    }
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
                <p className="text-gray-600">Manage lecturer profiles and information</p>
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
                actionText="Add Lecturer"
                onAction={() => setShowAddModal(true)}
              />
            ) : (
              <div className="overflow-x-auto rounded-xl border border-gray-100 bg-white shadow-sm">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Lecturer</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-100">
                    {filteredLecturers.map((lecturer) => (
                      <tr key={lecturer.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="font-medium text-gray-800">{lecturer.firstname} {lecturer.surname}</div>
                          <div className="text-xs text-gray-500">{lecturer.othernames}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-gray-800">{lecturer.email}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex space-x-2">
                            <button onClick={() => handleEditLecturer(lecturer)} className="hover:bg-gray-100 p-1 rounded" title="Edit">
                              <Edit size={16} className="text-blue-600" />
                            </button>
                            <button onClick={() => handleDeleteLecturer(lecturer.id)} className="hover:bg-gray-100 p-1 rounded" title="Delete">
                              <Trash2 size={16} className="text-red-600" />
                            </button>
                          </div>
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
