'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useLayout } from '@/components/LayoutController';
import AdminSidebar from '@/components/AdminSidebar';
import { 
  Users,
  UserPlus,
  FolderPlus,
  Calendar,
  User,
  UserCheck,
  Clock,
  CheckCircle,
  BookOpen,
  Edit,
  ChevronRight,
  ArrowUpRight,
  BarChart2,
  Server,
  Cpu,
  Box,
  FileCheck,
  FileText,
  Zap
} from 'lucide-react';

export default function AdminDashboard() {
  const { 
    sidebarCollapsed, 
    isMobileView, 
    isTabletView,
    setMobileMenuOpen
  } = useLayout();

  // Simulate loading data
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Simulate data fetching
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);

  const Header = () => (
    <header className="sticky top-0 z-20 bg-white px-4 py-2 shadow-sm border-b border-gray-200 flex justify-between items-center">
      <div className="flex items-center">
        {(isMobileView || isTabletView) && (
          <button 
            onClick={() => setMobileMenuOpen(true)}
            className="mr-3 p-2 rounded-lg hover:bg-gray-100"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          </button>
        )}
        
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <svg className="w-4 h-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
            </svg>
          </div>
          <input 
            type="search" 
            placeholder="Search users, units, reports..." 
            className="block w-full p-2 pl-10 text-sm text-gray-900 border border-gray-300 rounded-full bg-gray-50 focus:ring-purple-500 focus:border-purple-500" 
          />
        </div>
      </div>
      
      <div className="flex items-center gap-3">
        <button className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-full">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
            <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
          </svg>
          <span className="absolute top-1 right-1 bg-red-500 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">3</span>
        </button>
        
        <div className="flex items-center">
          <div className="mr-2 text-right hidden md:block">
            <div className="text-sm font-medium text-gray-900">Alex Kimani</div>
            <div className="text-xs text-gray-500">System Admin</div>
          </div>
          <div className="h-9 w-9 rounded-full bg-gray-200 flex items-center justify-center text-purple-700 font-medium">
            AK
          </div>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-1 text-gray-500">
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </div>
      </div>
    </header>
  );

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Regular Sidebar */}
      <AdminSidebar />
      
      {/* Main Content */}
      <motion.div 
        initial={{ 
          marginLeft: (!isMobileView && !isTabletView) ? (sidebarCollapsed ? 80 : 240) : 0 
        }}
        animate={{ 
          marginLeft: (!isMobileView && !isTabletView) ? (sidebarCollapsed ? 80 : 240) : 0 
        }}
        transition={{ duration: 0.3 }}
        className="flex-1 overflow-auto"
      >
        <Header />
        
        <main className="p-4 md:p-6">
          {/* Welcome Banner */}
          <div className="mb-6 bg-gradient-to-r from-purple-500 to-purple-700 rounded-xl p-6 md:p-8 text-white shadow-md relative overflow-hidden flex flex-col md:flex-row items-start md:items-center gap-6">
            <div className="z-10 flex-1">
              <h1 className="text-2xl md:text-3xl font-bold mb-2">Welcome back, Admin!</h1>
              <p className="text-purple-100 mb-4 max-w-lg">Manage users, courses, and monitor AI-powered university operations. Your dashboard gives you total control.</p>
              <div className="flex flex-wrap gap-3">
                <button className="bg-white text-purple-600 hover:bg-purple-50 px-4 py-2 rounded-full text-sm font-medium transition-colors flex items-center">
                  <UserPlus size={16} className="mr-2" />
                  Add New User
                </button>
                <button className="bg-white text-purple-600 hover:bg-purple-50 px-4 py-2 rounded-full text-sm font-medium transition-colors flex items-center">
                  <FolderPlus size={16} className="mr-2" />
                  Add Unit
                </button>
              </div>
            </div>
            <div className="hidden lg:block w-64 h-44 relative">
              <div className="absolute inset-0 bg-purple-600 rounded-lg opacity-20"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-full h-32 bg-purple-800/30 rounded-lg transform rotate-3 animate-pulse"></div>
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-full h-32 bg-gradient-to-r from-purple-600 to-purple-800 rounded-lg transform -rotate-3 shadow-lg">
                  <div className="p-4">
                    <div className="h-3 bg-white/20 rounded mb-3 w-2/3"></div>
                    <div className="h-3 bg-white/20 rounded mb-3 w-1/2"></div>
                    <div className="h-3 bg-white/20 rounded mb-3 w-3/4"></div>
                    <div className="flex mt-4">
                      <div className="h-8 w-8 bg-white/20 rounded mr-2"></div>
                      <div className="h-8 w-16 bg-white/20 rounded"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6">
            <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100 flex items-start">
              <div className="rounded-full bg-purple-100 p-3 mr-4">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-800">2,340</h3>
                <p className="text-sm text-gray-500">Total Users</p>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100 flex items-start">
              <div className="rounded-full bg-green-100 p-3 mr-4">
                <UserCheck className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-800">1,800</h3>
                <p className="text-sm text-gray-500">Students</p>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100 flex items-start">
              <div className="rounded-full bg-amber-100 p-3 mr-4">
                <User className="h-6 w-6 text-amber-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-800">120</h3>
                <p className="text-sm text-gray-500">Lecturers</p>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100 flex items-start">
              <div className="rounded-full bg-pink-100 p-3 mr-4">
                <BookOpen className="h-6 w-6 text-pink-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-800">160</h3>
                <p className="text-sm text-gray-500">Units</p>
              </div>
            </div>
          </div>
          
          {/* Analytics & Activity Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            {/* User Growth Analytics - Takes 2/3 width on large screens */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden lg:col-span-2">
              <div className="p-5 border-b border-gray-100 flex items-center justify-between">
                <div className="flex items-center">
                  <Users size={18} className="text-purple-600 mr-2" />
                  <h2 className="text-lg font-semibold text-gray-800">User Growth Analytics</h2>
                </div>
                <div className="flex space-x-2">
                  <button className="bg-purple-100 text-purple-700 text-xs px-3 py-1 rounded-full">
                    7 days
                  </button>
                  <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs px-3 py-1 rounded-full transition-colors">
                    30 days
                  </button>
                  <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs px-3 py-1 rounded-full transition-colors">
                    90 days
                  </button>
                </div>
              </div>
              
              <div className="p-5">
                <div className="mb-4">
                  <div className="text-xs text-gray-500">TOTAL USERS</div>
                  <div className="flex items-baseline">
                    <span className="text-2xl font-bold text-gray-800 mr-2">1,750</span>
                    <span className="text-sm text-green-600 flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                        <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
                        <polyline points="17 6 23 6 23 12"></polyline>
                      </svg>
                      +15.1% vs previous period
                    </span>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Peak Users</div>
                    <div className="text-lg font-bold text-gray-800">1,750</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Lowest Users</div>
                    <div className="text-lg font-bold text-gray-800">1,150</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Growth Rate</div>
                    <div className="text-lg font-bold text-green-600">+15.1%</div>
                  </div>
                </div>
                
                <div className="h-60 mt-6 relative">
                  {/* This would be a chart in a real app - simulating for design */}
                  <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-purple-500/5 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 right-0">
                    <svg viewBox="0 0 400 100" className="w-full h-40">
                      <path 
                        d="M0,90 C20,80 40,70 60,65 C80,60 100,60 120,65 C140,70 160,85 180,90 C200,95 220,90 240,80 C260,70 280,55 300,50 C320,45 340,45 360,50 C380,55 400,65 400,70" 
                        fill="none" 
                        stroke="#8b5cf6" 
                        strokeWidth="3"
                      />
                      <path 
                        d="M0,90 C20,80 40,70 60,65 C80,60 100,60 120,65 C140,70 160,85 180,90 C200,95 220,90 240,80 C260,70 280,55 300,50 C320,45 340,45 360,50 C380,55 400,65 400,70" 
                        fill="url(#gradient)" 
                        fillOpacity="0.2"
                        strokeWidth="0"
                      />
                      <defs>
                        <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                          <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.6" />
                          <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.0" />
                        </linearGradient>
                      </defs>
                    </svg>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 flex justify-between text-xs text-gray-500 px-4">
                    <span>Jan 1</span>
                    <span>Jan 4</span>
                    <span>Jan 7</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Recent Activity - Takes 1/3 width on large screens */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="p-5 border-b border-gray-100 flex items-center">
                <Clock size={18} className="text-purple-600 mr-2" />
                <h2 className="text-lg font-semibold text-gray-800">Recent Activity</h2>
              </div>
              
              <div className="divide-y divide-gray-100">
                <div className="p-4 flex items-start">
                  <div className="rounded-full bg-gray-200 w-8 h-8 flex-shrink-0 mr-3"></div>
                  <div>
                    <div className="flex items-center">
                      <p className="font-medium text-sm text-gray-800">Jane Wambui</p>
                      <span className="ml-2 text-xs text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full">added as lecturer</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">2 min ago</p>
                  </div>
                </div>
                
                <div className="p-4 flex items-start">
                  <div className="rounded-full bg-green-100 w-8 h-8 flex items-center justify-center text-green-600 flex-shrink-0 mr-3">
                    <CheckCircle size={16} />
                  </div>
                  <div>
                    <div className="flex items-center">
                      <p className="font-medium text-sm text-gray-800">Unit "AI Ethics"</p>
                      <span className="ml-2 text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded-full">approved</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">15 min ago</p>
                  </div>
                </div>
                
                <div className="p-4 flex items-start">
                  <div className="rounded-full bg-gray-200 w-8 h-8 flex-shrink-0 mr-3"></div>
                  <div>
                    <div className="flex items-center">
                      <p className="font-medium text-sm text-gray-800">Student profile</p>
                      <span className="ml-2 text-xs text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">updated</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">34 min ago</p>
                  </div>
                </div>
                
                <div className="p-4 flex items-start">
                  <div className="rounded-full bg-purple-100 w-8 h-8 flex items-center justify-center text-purple-600 flex-shrink-0 mr-3">
                    <Zap size={16} />
                  </div>
                  <div>
                    <div className="flex items-center">
                      <p className="font-medium text-sm text-gray-800">AI Assignment</p>
                      <span className="ml-2 text-xs text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">auto-marked</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">50 min ago</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Manage Users */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-6">
            <div className="p-5 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-800">Manage Users</h2>
              <button className="bg-purple-600 hover:bg-purple-700 text-white text-sm px-4 py-1.5 rounded-full transition-colors flex items-center">
                <UserPlus size={16} className="mr-1.5" />
                Add User
              </button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-8 w-8 rounded-full bg-blue-100 mr-3"></div>
                        <div className="text-sm font-medium text-gray-900">Mary Kuria</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">Lecturer</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">mary.kuria@uniai.edu</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        Active
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <button className="bg-purple-100 hover:bg-purple-200 text-purple-700 text-xs px-3 py-1 rounded-full transition-colors">
                        Edit
                      </button>
                    </td>
                  </tr>
                  
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-8 w-8 rounded-full bg-blue-100 mr-3"></div>
                        <div className="text-sm font-medium text-gray-900">John Mwangi</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">Student</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">john.mwangi@uniai.edu</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-amber-100 text-amber-800">
                        Pending
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <button className="bg-purple-100 hover:bg-purple-200 text-purple-700 text-xs px-3 py-1 rounded-full transition-colors">
                        Edit
                      </button>
                    </td>
                  </tr>
                  
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-8 w-8 rounded-full bg-blue-100 mr-3"></div>
                        <div className="text-sm font-medium text-gray-900">Kevin Otieno</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">Lecturer</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">kevin.otieno@uniai.edu</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                        Suspended
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <button className="bg-purple-100 hover:bg-purple-200 text-purple-700 text-xs px-3 py-1 rounded-full transition-colors">
                        Edit
                      </button>
                    </td>
                  </tr>
                  
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-8 w-8 rounded-full bg-blue-100 mr-3"></div>
                        <div className="text-sm font-medium text-gray-900">Grace Njeri</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">Student</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">grace.njeri@uniai.edu</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        Active
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <button className="bg-purple-100 hover:bg-purple-200 text-purple-700 text-xs px-3 py-1 rounded-full transition-colors">
                        Edit
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            <div className="p-4 border-t border-gray-100 text-right">
              <a href="#" className="text-purple-600 hover:text-purple-800 text-sm font-medium inline-flex items-center">
                View All Users
                <ChevronRight size={16} className="ml-1" />
              </a>
            </div>
          </div>
          
          {/* Units Overview */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-6">
            <div className="p-5 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-800">Units Overview</h2>
              <button className="bg-purple-600 hover:bg-purple-700 text-white text-sm px-4 py-1.5 rounded-full transition-colors flex items-center">
                <FolderPlus size={16} className="mr-1.5" />
                Add Unit
              </button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Unit Name</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Code</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lecturer</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Students</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">Artificial Intelligence</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">CS401</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-8 w-8 rounded-full bg-blue-100 mr-2"></div>
                        <div className="text-sm text-gray-900">Mary Kuria</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">320</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <button className="bg-purple-100 hover:bg-purple-200 text-purple-700 text-xs px-3 py-1 rounded-full transition-colors">
                        Edit
                      </button>
                    </td>
                  </tr>
                  
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">AI Ethics</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">CS410</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-8 w-8 rounded-full bg-blue-100 mr-2"></div>
                        <div className="text-sm text-gray-900">Kevin Otieno</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">240</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <button className="bg-purple-100 hover:bg-purple-200 text-purple-700 text-xs px-3 py-1 rounded-full transition-colors">
                        Edit
                      </button>
                    </td>
                  </tr>
                  
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">Machine Learning</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">CS420</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-8 w-8 rounded-full bg-blue-100 mr-2"></div>
                        <div className="text-sm text-gray-900">Grace Njeri</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">210</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <button className="bg-purple-100 hover:bg-purple-200 text-purple-700 text-xs px-3 py-1 rounded-full transition-colors">
                        Edit
                      </button>
                    </td>
                  </tr>
                  
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">Natural Language Processing</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">CS432</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-8 w-8 rounded-full bg-blue-100 mr-2"></div>
                        <div className="text-sm text-gray-900">Mary Kuria</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">185</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <button className="bg-purple-100 hover:bg-purple-200 text-purple-700 text-xs px-3 py-1 rounded-full transition-colors">
                        Edit
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            <div className="p-4 border-t border-gray-100 text-right">
              <a href="#" className="text-purple-600 hover:text-purple-800 text-sm font-medium inline-flex items-center">
                View All Units
                <ChevronRight size={16} className="ml-1" />
              </a>
            </div>
          </div>
          
          {/* AI Tools & System Health */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* AI Tools Usage */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="p-5 border-b border-gray-100 flex items-center">
                <Cpu size={18} className="text-purple-600 mr-2" />
                <h2 className="text-lg font-semibold text-gray-800">AI Tools Usage</h2>
              </div>
              
              <div className="p-5 space-y-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-800 mb-1">4,230</div>
                  <div className="text-sm text-gray-500 flex items-center justify-center">
                    <Box size={14} className="mr-1 text-purple-500" />
                    <span>Assignments Generated</span>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-800 mb-1">2,780</div>
                    <div className="text-sm text-gray-500 flex items-center justify-center">
                      <FileCheck size={14} className="mr-1 text-green-500" />
                      <span>Auto-Marked</span>
                    </div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-800 mb-1">1,150</div>
                    <div className="text-sm text-gray-500 flex items-center justify-center">
                      <FileText size={14} className="mr-1 text-blue-500" />
                      <span>Personalized Tasks</span>
                    </div>
                  </div>
                </div>
                
                <div className="mt-4">
                  <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
                    <div className="bg-purple-600 h-2.5 rounded-full" style={{width: '75%'}}></div>
                  </div>
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Weekly usage: 75%</span>
                    <span>Limit: 5,000</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* System Health */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="p-5 border-b border-gray-100 flex items-center">
                <Server size={18} className="text-purple-600 mr-2" />
                <h2 className="text-lg font-semibold text-gray-800">System Health</h2>
              </div>
              
              <div className="p-5">
                <div className="mb-5 flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                    <span className="text-sm font-medium text-gray-700">Server Status</span>
                  </div>
                  <span className="text-sm text-green-600 font-medium">Online</span>
                </div>
                
                <div className="mb-5 flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-purple-500 mr-2"></div>
                    <span className="text-sm font-medium text-gray-700">AI Engine</span>
                  </div>
                  <span className="text-sm text-green-600 font-medium">Operational</span>
                </div>
                
                <div className="mb-5 flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
                    <span className="text-sm font-medium text-gray-700">Database</span>
                  </div>
                  <span className="text-sm text-green-600 font-medium">Connected</span>
                </div>
                
                <div className="mb-5 flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-amber-500 mr-2"></div>
                    <span className="text-sm font-medium text-gray-700">API Services</span>
                  </div>
                  <span className="text-sm text-amber-600 font-medium">93% Uptime</span>
                </div>
                
                <div className="pt-4 mt-4 border-t border-gray-100">
                  <div className="flex justify-between items-center mb-2">
                    <div className="text-sm font-medium text-gray-700">System Load</div>
                    <div className="text-sm text-gray-600">42%</div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div className="bg-green-500 h-2.5 rounded-full" style={{width: '42%'}}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Help Section */}
          <div className="fixed bottom-4 right-4 z-10">
            <div className="relative group">
              <button className="bg-purple-600 hover:bg-purple-700 text-white w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-all">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                  <line x1="12" y1="17" x2="12.01" y2="17"></line>
                </svg>
              </button>
              <div className="absolute bottom-full right-0 mb-2 w-48 p-2 bg-white rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                <div className="text-sm font-medium text-gray-800 p-2">Need help?</div>
                <div className="text-xs text-gray-500 p-2">Support 24/7</div>
              </div>
            </div>
          </div>
        </main>
      </motion.div>
    </div>
  );
}