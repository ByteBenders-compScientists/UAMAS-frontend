"use client"
import { motion } from "framer-motion"
import { useLayout } from "@/components/LayoutController"
import {
  LayoutDashboard,
  Users,
  UserCheck,
  GraduationCap,
  BookOpen,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  Shield,
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

const menuItems = [
  {
    icon: LayoutDashboard,
    label: "Dashboard",
    href: "/admin/dashboard",
    color: "text-gray-600 hover:text-emerald-600",
  },
  {
    icon: Users,
    label: "Students",
    href: "/admin/students",
    color: "text-gray-600 hover:text-blue-600",
  },
  {
    icon: UserCheck,
    label: "Lecturers",
    href: "/admin/lecturers",
    color: "text-gray-600 hover:text-emerald-600",
  },
  {
    icon: GraduationCap,
    label: "Courses",
    href: "/admin/courses",
    color: "text-gray-600 hover:text-violet-600",
  },
  {
    icon: BookOpen,
    label: "Units",
    href: "/admin/units",
    color: "text-gray-600 hover:text-amber-600",
  },
  {
    icon: Settings,
    label: "Settings",
    href: "/admin/settings",
    color: "text-gray-600 hover:text-gray-800",
  },
]

export default function AdminSidebar() {
  const { sidebarCollapsed, setSidebarCollapsed, isMobileView, isTabletView, mobileMenuOpen, setMobileMenuOpen } =
    useLayout()

  const pathname = usePathname()

  const isActive = (href: string) => pathname === href

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-100">
        <motion.div
          initial={false}
          animate={{
            opacity: sidebarCollapsed && !isMobileView ? 0 : 1,
            scale: sidebarCollapsed && !isMobileView ? 0.8 : 1,
          }}
          transition={{ duration: 0.2 }}
          className="flex items-center space-x-3"
        >
          <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center">
            <Shield size={20} className="text-white" />
          </div>
          {(!sidebarCollapsed || isMobileView) && (
            <div>
              <h2 className="font-bold text-gray-800">Admin Panel</h2>
              <p className="text-xs text-gray-500">University Management</p>
            </div>
          )}
        </motion.div>

        {isMobileView ? (
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={20} className="text-gray-600" />
          </button>
        ) : (
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            {sidebarCollapsed ? (
              <ChevronRight size={20} className="text-gray-600" />
            ) : (
              <ChevronLeft size={20} className="text-gray-600" />
            )}
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item, index) => {
          const Icon = item.icon
          const active = isActive(item.href)

          return (
            <Link key={index} href={item.href}>
              <motion.div
                whileHover={{ x: 2 }}
                className={`flex items-center space-x-3 p-3 rounded-lg transition-all duration-200 ${
                  active
                    ? "bg-emerald-50 text-emerald-600 border-r-2 border-emerald-600"
                    : "hover:bg-gray-50 text-gray-600 hover:text-gray-800"
                }`}
              >
                <Icon size={20} className={active ? "text-emerald-600" : item.color} />
                {(!sidebarCollapsed || isMobileView) && (
                  <span className={`font-medium ${active ? "text-emerald-600" : "text-gray-700"}`}>{item.label}</span>
                )}
              </motion.div>
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-100">
        <button className="flex items-center space-x-3 p-3 w-full rounded-lg hover:bg-red-50 text-gray-600 hover:text-red-600 transition-all duration-200">
          <LogOut size={20} />
          {(!sidebarCollapsed || isMobileView) && <span className="font-medium">Logout</span>}
        </button>
      </div>
    </div>
  )

  if (isMobileView) {
    return (
      <>
        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(true)}
          className="fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-md border border-gray-200 lg:hidden"
        >
          <Menu size={20} className="text-gray-600" />
        </button>

        {/* Mobile Sidebar Overlay */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setMobileMenuOpen(false)} />
            <motion.div
              initial={{ x: -240 }}
              animate={{ x: 0 }}
              exit={{ x: -240 }}
              transition={{ duration: 0.3 }}
              className="absolute left-0 top-0 h-full w-64 bg-white shadow-xl"
            >
              <SidebarContent />
            </motion.div>
          </div>
        )}
      </>
    )
  }

  return (
    <motion.div
      initial={false}
      animate={{
        width: sidebarCollapsed ? 80 : 240,
      }}
      transition={{ duration: 0.3 }}
      className="fixed left-0 top-0 h-full bg-white border-r border-gray-200 shadow-sm z-40"
    >
      <SidebarContent />
    </motion.div>
  )
}
