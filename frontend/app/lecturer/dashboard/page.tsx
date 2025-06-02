'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { 
  BookMarked, 
  BarChart3, 
  Clock, 
  Monitor, 
  Loader, 
  Plus, 
  Star, 
  User, 
  Users, 
  Bell, 
  Menu, 
  X, 
  LetterText, 
  ChevronDown, 
  ChevronUp 
} from 'lucide-react'

// ===== TYPES =====
type DropdownItem = {
  label: string
  href: string
}

interface NavigationItem {
  icon: React.ElementType
  label: string
  active?: boolean
  count?: number
  hasDropdown?: boolean
  dropdownItems?: DropdownItem[]
}

interface StatData {
  icon: React.ElementType
  label: string
  value: string
}

interface PendingApproval {
  title: string
  buttonColor: string
}

interface StudentProgress {
  name: string
  assignment: string
  cat: string
  status: string
}

interface MarkedWork {
  title: string
  status: string
}

interface RecentActivity {
  activity: string
  time: string
}

// ===== CONSTANTS =====
const STATS_DATA: StatData[] = [
  { icon: Users, label: 'Total Students', value: '132' },
  { icon: Clock, label: 'Pending Approvals', value: '6' },
  { icon: Monitor, label: 'AI Marked Submissions', value: '45' },
  { icon: BookMarked, label: 'Marking Progress', value: '12' }
]

const PENDING_APPROVALS: PendingApproval[] = [
  { title: 'CAT 3 - Data Structures', buttonColor: 'bg-blue-600' },
  { title: 'Assignment 4 - Algorithms', buttonColor: 'bg-green-600' },
  { title: 'AI Marked CAT 1 - OS', buttonColor: 'bg-purple-600' }
]

const STUDENT_PROGRESS: StudentProgress[] = [
  { name: 'Faith W.', assignment: 'Pending', cat: 'Pending', status: 'Pending' },
  { name: 'David M.', assignment: 'Completed', cat: 'Completed', status: '-' },
  { name: 'Mark O.', assignment: 'Pending', cat: 'Pending', status: '-' }
]

const MARKED_WORK: MarkedWork[] = [
  { title: 'Assignment 2 - DBMS', status: 'Completed' },
  { title: 'CAT 3 - Networks', status: 'In Review' },
  { title: 'Assignment 1 - AI Ethics', status: 'AI Marked' }
]

const RECENT_ACTIVITIES: RecentActivity[] = [
  { activity: 'CAT Created', time: '19 minutes ago' },
  { activity: 'Assignment Submitted', time: '25 minutes ago' },
  { activity: 'Grade Updated', time: '1 hour ago' }
]

// ===== UTILITY FUNCTIONS =====
const getStatusBadgeClass = (status: string): string => {
  const statusClasses: Record<string, string> = {
    'Completed': 'bg-green-100 text-green-700',
    'Pending': 'bg-yellow-100 text-yellow-700',
    'In Review': 'bg-yellow-100 text-yellow-700',
    'AI Marked': 'bg-blue-100 text-blue-700'
  }
  return statusClasses[status] || 'bg-gray-100 text-gray-700'
}

// ===== CUSTOM HOOKS =====
const useDashboardState = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isCreateDropdownOpen, setIsCreateDropdownOpen] = useState(false)

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen)
  const closeSidebar = () => setIsSidebarOpen(false)
  const toggleCreateDropdown = () => setIsCreateDropdownOpen(!isCreateDropdownOpen)

  return {
    isSidebarOpen,
    isCreateDropdownOpen,
    toggleSidebar,
    closeSidebar,
    toggleCreateDropdown
  }
}

const useNavigationItems = (pendingCount: number): NavigationItem[] => [
  { icon: BarChart3, label: 'Dashboard', active: true },
  { icon: Loader, label: 'Pending Approvals', count: pendingCount },
  { 
    icon: Plus, 
    label: 'Create', 
    hasDropdown: true,
    dropdownItems: [
      { label: 'CAT', href: '#create-cat' },
      { label: 'Assignment', href: '#create-assignment' }
    ]
  },
  { icon: Users, label: 'Student Status' },
  { icon: Star, label: 'Graded CATs' },
  { icon: BarChart3, label: 'Analytics' }
]

// ===== COMPONENTS =====
const SidebarHeader: React.FC<{ onClose: () => void }> = ({ onClose }) => (
  <div className="flex items-center justify-between p-6 border-b border-rose-300">
    <div className="flex items-center space-x-2 text-xl font-bold">
      <LetterText className="w-6 h-6" />
      <span>EduPortal</span>
    </div>
    <button 
      className="lg:hidden"
      onClick={onClose}
      aria-label="Close sidebar"
    >
      <X className="w-6 h-6" />
    </button>
  </div>
)

const UserProfile: React.FC = () => (
  <div className="flex p-6 items-center space-x-3 text-sm border-b border-rose-300 font-medium">
    <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center overflow-hidden">
      <div className="w-8 h-8 bg-white-300 rounded-full flex items-center justify-center">
        <User className="w-4 h-4 text-gray-600" />
      </div>
    </div>
    <div>
      <div className="font-semibold">Jane Doe</div>
      <div className="text-xs opacity-80">Lecturer</div>
    </div>
  </div>
)

const NavigationDropdown: React.FC<{ 
  items: DropdownItem[]
  isOpen: boolean
}> = ({ items, isOpen }) => {
  if (!isOpen) return null

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.2 }}
      className="ml-8 mt-2 space-y-1"
    >
      {items.map((item, index) => (
        <a
          key={index}
          href={item.href}
          className="block p-2 text-sm font-medium rounded-lg hover:bg-rose-300 hover:bg-opacity-50 transition-all duration-200"
        >
          {item.label}
        </a>
      ))}
    </motion.div>
  )
}

const NavigationItemComponent: React.FC<{
  item: NavigationItem
  isDropdownOpen: boolean
  onDropdownToggle: () => void
}> = ({ item, isDropdownOpen, onDropdownToggle }) => {
  if (item.hasDropdown) {
    return (
      <div>
        <button
          onClick={onDropdownToggle}
          className={`w-full flex items-center justify-between space-x-3 p-3 rounded-lg transition-all duration-200 ${
            item.active 
              ? 'bg-white text-rose-500 shadow-sm' 
              : 'hover:bg-rose-300 hover:bg-opacity-50'
          }`}
          aria-expanded={isDropdownOpen}
        >
          <div className="flex items-center space-x-3">
            <item.icon className="w-5 h-5" />
            <span className="text-sm font-medium">{item.label}</span>
          </div>
          {isDropdownOpen ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </button>
        
        <NavigationDropdown 
          items={item.dropdownItems || []} 
          isOpen={isDropdownOpen} 
        />
      </div>
    )
  }

  return (
    <a 
      href="#" 
      className={`flex items-center justify-between space-x-3 p-3 rounded-lg transition-all duration-200 ${
        item.active 
          ? 'bg-white text-rose-500 shadow-sm' 
          : 'hover:bg-rose-300 hover:bg-opacity-50'
      }`}
    >
      <div className="flex items-center space-x-3">
        <item.icon className="w-5 h-5" />
        <span className="text-sm font-medium">{item.label}</span>
      </div>
      {item.count && (
        <span className="bg-white text-rose-500 text-xs font-bold px-2 py-1 rounded-full min-w-[20px] text-center">
          {item.count}
        </span>
      )}
    </a>
  )
}

const Sidebar: React.FC<{
  isOpen: boolean
  onClose: () => void
  navigationItems: NavigationItem[]
  isCreateDropdownOpen: boolean
  onCreateDropdownToggle: () => void
}> = ({ isOpen, onClose, navigationItems, isCreateDropdownOpen, onCreateDropdownToggle }) => (
  <aside className={`w-64 bg-rose-400 text-black fixed top-0 left-0 h-full shadow-lg z-30 transform transition-transform duration-300 ease-in-out ${
    isOpen ? 'translate-x-0' : '-translate-x-full'
  } lg:translate-x-0`}>
    <SidebarHeader onClose={onClose} />
    <UserProfile />
    
    <nav className="flex flex-col gap-1 p-4">
      {navigationItems.map((item, index) => (
        <NavigationItemComponent
          key={index}
          item={item}
          isDropdownOpen={isCreateDropdownOpen}
          onDropdownToggle={onCreateDropdownToggle}
        />
      ))}
    </nav>
  </aside>
)

const TopHeader: React.FC<{ onSidebarToggle: () => void }> = ({ onSidebarToggle }) => (
  <header className="bg-white shadow-sm border-b border-gray-200 p-4 lg:p-6">
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <button 
          className="lg:hidden"
          onClick={onSidebarToggle}
          aria-label="Open sidebar"
        >
          <Menu className="w-6 h-6 text-gray-600" />
        </button>
        <div>
          <h1 className="text-xl lg:text-3xl font-bold text-gray-800">
            Welcome, Dr Alex Kimani
          </h1>
          <p className="text-sm lg:text-base text-gray-600 hidden sm:block">
            Here's what's happening in your courses today.
          </p>
        </div>
      </div>
      
      <div className="flex items-center space-x-4">
        <div className="relative cursor-pointer p-2 hover:bg-gray-100 rounded-full transition-colors">
          <Bell className="w-5 h-5 lg:w-6 lg:h-6 text-gray-600" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
        </div>

        <div className="cursor-pointer">
          <div className="w-8 h-8 lg:w-10 lg:h-10 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
            <div className="w-full h-full bg-gradient-to-br from-rose-400 to-rose-500 rounded-full flex items-center justify-center">
              <Image
                src="/assets/ben.jpg"
                alt="Profile"
                width={36}
                height={36}
                className="rounded-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </header>
)

const StatsCard: React.FC<{ stat: StatData; index: number }> = ({ stat, index }) => (
  <div 
    className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 lg:p-6 hover:shadow-md transition-all duration-200 hover:scale-105 cursor-pointer"
  >
    <div className="flex items-center justify-between">
      <div>
        <p className="text-xs lg:text-sm text-gray-600 mb-1">{stat.label}</p>
        <p className="text-xl lg:text-2xl font-bold text-gray-800">{stat.value}</p>
      </div>
      <div className="w-10 h-10 lg:w-12 lg:h-12 bg-rose-100 rounded-lg flex items-center justify-center">
        <stat.icon className="w-5 h-5 lg:w-6 lg:h-6 text-rose-500" />
      </div>
    </div>
  </div>
)

const StatsCards: React.FC<{ stats: StatData[] }> = ({ stats }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, delay: 0.1 }}
    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-6 lg:mb-8"
  >
    {stats.map((stat, index) => (
      <StatsCard key={index} stat={stat} index={index} />
    ))}
  </motion.div>
)

const PendingApprovalsCard: React.FC<{ approvals: PendingApproval[] }> = ({ approvals }) => (
  <motion.div 
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.6, delay: 0.2 }}
    className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 lg:p-6"
  >
    <h2 className="text-lg lg:text-xl font-semibold text-gray-800 mb-4 lg:mb-6 flex items-center">
      <Clock className="w-4 h-4 lg:w-5 lg:h-5 mr-2 text-rose-500" />
      Pending Approvals
      <span className="ml-2 bg-rose-100 text-rose-600 text-xs font-bold px-2 py-1 rounded-full">
        {approvals.length}
      </span>
    </h2>
    <ul className="space-y-3 lg:space-y-4">
      {approvals.map((item, index) => (
        <li 
          key={index} 
          className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 p-3 lg:p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <span className="text-gray-700 font-medium text-sm lg:text-base">
            {item.title}
          </span>
          <button 
            className={`${item.buttonColor} text-white px-3 lg:px-4 py-1.5 lg:py-2 text-xs lg:text-sm rounded-lg hover:opacity-90 transition-all hover:scale-105 w-fit`}
          >
            Approve
          </button>
        </li>
      ))}
    </ul>
  </motion.div>
)

const StudentProgressCard: React.FC<{ students: StudentProgress[] }> = ({ students }) => (
  <motion.div 
    initial={{ opacity: 0, x: 20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.6, delay: 0.2 }}
    className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 lg:p-6"
  >
    <h2 className="text-lg lg:text-xl font-semibold text-gray-800 mb-4 lg:mb-6 flex items-center">
      <Users className="w-4 h-4 lg:w-5 lg:h-5 mr-2 text-rose-500" />
      Student Progress
    </h2>
    <div className="overflow-x-auto">
      <table className="w-full text-xs lg:text-sm text-left">
        <thead>
          <tr className="text-gray-500 border-b border-gray-200">
            <th className="py-2 lg:py-3 px-1 lg:px-2 font-semibold">Student</th>
            <th className="py-2 lg:py-3 px-1 lg:px-2 font-semibold">Assignment</th>
            <th className="py-2 lg:py-3 px-1 lg:px-2 font-semibold">CAT</th>
            <th className="py-2 lg:py-3 px-1 lg:px-2 font-semibold">Status</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student, index) => (
            <tr key={index} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
              <td className="py-2 lg:py-3 px-1 lg:px-2 font-medium text-gray-800">
                {student.name}
              </td>
              <td className="py-2 lg:py-3 px-1 lg:px-2">
                <span className={`px-2 py-1 text-xs rounded-full ${getStatusBadgeClass(student.assignment)}`}>
                  {student.assignment}
                </span>
              </td>
              <td className="py-2 lg:py-3 px-1 lg:px-2">
                <span className={`px-2 py-1 text-xs rounded-full ${getStatusBadgeClass(student.cat)}`}>
                  {student.cat}
                </span>
              </td>
              <td className="py-2 lg:py-3 px-1 lg:px-2 text-gray-600">
                {student.status}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </motion.div>
)

const MarkedWorkCard: React.FC<{ work: MarkedWork[] }> = ({ work }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, delay: 0.3 }}
    className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 lg:p-6"
  >
    <h2 className="text-lg lg:text-xl font-semibold text-gray-800 mb-4 lg:mb-6 flex items-center">
      <BookMarked className="w-4 h-4 lg:w-5 lg:h-5 mr-2 text-rose-500" />
      Marked Work
    </h2>
    <ul className="space-y-3 lg:space-y-4">
      {work.map((item, index) => (
        <li 
          key={index} 
          className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 p-3 lg:p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <span className="text-gray-700 font-medium text-sm lg:text-base">
            {item.title}
          </span>
          <span className={`text-xs lg:text-sm font-semibold px-3 py-1 rounded-full w-fit ${getStatusBadgeClass(item.status)}`}>
            {item.status}
          </span>
        </li>
      ))}
    </ul>
  </motion.div>
)

const RecentActivitiesCard: React.FC<{ activities: RecentActivity[] }> = ({ activities }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, delay: 0.4 }}
    className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 lg:p-6"
  >
    <h2 className="text-lg lg:text-xl font-semibold text-gray-800 mb-4 lg:mb-6 flex items-center">
      <BarChart3 className="w-4 h-4 lg:w-5 lg:h-5 mr-2 text-rose-500" />
      Recent Activities
    </h2>
    <ul className="space-y-3 lg:space-y-4">
      {activities.map((activity, index) => (
        <li 
          key={index} 
          className="flex justify-between items-center p-3 lg:p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <span className="text-gray-700 font-medium text-sm lg:text-base">
            {activity.activity}
          </span>
          <span className="text-xs lg:text-sm text-gray-500 bg-white px-2 py-1 rounded whitespace-nowrap">
            {activity.time}
          </span>
        </li>
      ))}
    </ul>
  </motion.div>
)

const PerformanceAnalyticsCard: React.FC = () => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, delay: 0.5 }}
    className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 lg:p-6"
  >
    <h2 className="text-lg lg:text-xl font-semibold text-gray-800 mb-4 lg:mb-6 flex items-center">
      <BarChart3 className="w-4 h-4 lg:w-5 lg:h-5 mr-2 text-rose-500" />
      Performance Analytics
    </h2>
    
    <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-4 lg:p-8">
      <div className="w-full h-64 sm:h-80 lg:h-96 bg-white rounded-lg shadow-inner flex items-center justify-center mb-4 lg:mb-6">
        <div className="w-full h-full p-4 lg:p-6">
          <div className="w-full h-full bg-gradient-to-r from-rose-100 to-blue-100 rounded-lg flex items-center justify-center relative overflow-hidden">
            <div className="flex items-end justify-center space-x-2 lg:space-x-4 h-3/4 w-3/4">
              {[40, 65, 35, 80, 55, 90, 45].map((height, index) => (
                <div key={index} className="flex flex-col items-center">
                  <div 
                    className="bg-rose-400 rounded-t-sm w-4 lg:w-8 transition-all duration-1000 ease-out"
                    style={{ height: `${height}%` }}
                  />
                  <Image 
                    src="/assets/graph.jpeg" 
                    alt="Graph 1" 
                    width={1300} 
                    height={600} 
                  />
                  <span className="text-xs text-gray-600 mt-1">W{index + 1}</span>
                </div>
              ))}
            </div>
            <div className="absolute top-4 left-4 text-sm font-medium text-gray-700">
              Student Performance Trends
            </div>
          </div>
        </div>
      </div>
      
      <div className="text-center">
        <h3 className="text-base lg:text-lg font-semibold text-gray-700 mb-2">
          Comprehensive Analytics Dashboard
        </h3>
        <p className="text-sm lg:text-base text-gray-600 mb-4">
          Track student performance, assignment completion rates, and course analytics
        </p>
        <button className="bg-rose-500 text-white px-4 lg:px-6 py-2 rounded-lg hover:bg-rose-600 transition-colors text-sm lg:text-base">
          View Detailed Analytics
        </button>
      </div>
    </div>
  </motion.div>
)

// ===== MAIN COMPONENT =====
const page: React.FC = () => {
  const {
    isSidebarOpen,
    isCreateDropdownOpen,
    toggleSidebar,
    closeSidebar,
    toggleCreateDropdown
  } = useDashboardState()

  const navigationItems = useNavigationItems(PENDING_APPROVALS.length)

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar */}
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={closeSidebar}
        navigationItems={navigationItems}
        isCreateDropdownOpen={isCreateDropdownOpen}
        onCreateDropdownToggle={toggleCreateDropdown}
      />

      {/* Main Content */}
      <main className="flex-1 lg:ml-64 flex flex-col">
        <TopHeader onSidebarToggle={toggleSidebar} />

        {/* Content Area */}
        <div className="flex-1 p-4 lg:p-8">
          <StatsCards stats={STATS_DATA} />

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 mb-6 lg:mb-8">
            <PendingApprovalsCard approvals={PENDING_APPROVALS} />
            <StudentProgressCard students={STUDENT_PROGRESS} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 mb-6 lg:mb-8">
            <MarkedWorkCard work={MARKED_WORK} />
            <RecentActivitiesCard activities={RECENT_ACTIVITIES} />
          </div>

          {/* Performance Analytics - Full Width */}
          <PerformanceAnalyticsCard />
        </div>
      </main>
    </div>
  )
}

export default page