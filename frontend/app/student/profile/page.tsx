'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useLayout } from '@/components/LayoutController';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import { 
  User, 
  Mail, 
  Phone,
  MapPin,
  Calendar,
  Edit,
  Camera,
  Save,
  X,
  Award,
  BookOpen,
  TrendingUp,
  Target
} from 'lucide-react';

// Mock user data
const mockUser = {
  id: '2028061',
  firstName: 'John',
  lastName: 'Opondo',
  email: 'john.opondo@student.university.edu',
  phone: '+254 712 345 678',
  address: 'Nairobi, Kenya',
  dateOfBirth: '2002-03-15',
  enrollmentDate: '2024-09-01',
  program: 'Bachelor of Computer Science',
  year: '2nd Year',
  semester: 'Spring 2025',
  gpa: 3.75,
  totalCredits: 45,
  completedCourses: 15,
  bio: 'Passionate computer science student with interests in software development and data science.'
};

export default function ProfilePage() {
  const { sidebarCollapsed, isMobileView, isTabletView } = useLayout();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(mockUser);

  const handleSave = () => {
    // Save logic here
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData(mockUser);
    setIsEditing(false);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      
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
        <Header title="Profile" />
        
        <main className="p-4 md:p-6">
          <div className="max-w-4xl mx-auto">
            {/* Profile Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6"
            >
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center space-x-6">
                  <div className="relative">
                    <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-2xl font-bold">
                      {formData.firstName[0]}{formData.lastName[0]}
                    </div>
                    <button className="absolute -bottom-2 -right-2 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors">
                      <Camera size={16} />
                    </button>
                  </div>
                  
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                      {formData.firstName} {formData.lastName}
                    </h1>
                    <p className="text-gray-600 mb-2">Student ID: {formData.id}</p>
                    <p className="text-gray-600">{formData.program}</p>
                    <p className="text-sm text-blue-600 font-medium">{formData.year} • {formData.semester}</p>
                  </div>
                </div>
                
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Edit size={16} className="mr-2" />
                  {isEditing ? 'Cancel' : 'Edit Profile'}
                </button>
              </div>

              {/* Academic Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-blue-50 rounded-lg p-4 text-center">
                  <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white mx-auto mb-2">
                    <Award size={16} />
                  </div>
                  <p className="text-2xl font-bold text-blue-600">{formData.gpa}</p>
                  <p className="text-sm text-gray-600">Current GPA</p>
                </div>
                
                <div className="bg-green-50 rounded-lg p-4 text-center">
                  <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center text-white mx-auto mb-2">
                    <BookOpen size={16} />
                  </div>
                  <p className="text-2xl font-bold text-green-600">{formData.totalCredits}</p>
                  <p className="text-sm text-gray-600">Total Credits</p>
                </div>
                
                <div className="bg-purple-50 rounded-lg p-4 text-center">
                  <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center text-white mx-auto mb-2">
                    <Target size={16} />
                  </div>
                  <p className="text-2xl font-bold text-purple-600">{formData.completedCourses}</p>
                  <p className="text-sm text-gray-600">Completed Courses</p>
                </div>
                
                <div className="bg-indigo-50 rounded-lg p-4 text-center">
                  <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white mx-auto mb-2">
                    <TrendingUp size={16} />
                  </div>
                  <p className="text-2xl font-bold text-indigo-600">88%</p>
                  <p className="text-sm text-gray-600">Progress</p>
                </div>
              </div>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Personal Information */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold text-gray-900">Personal Information</h2>
                  {isEditing && (
                    <div className="flex space-x-2">
                      <button
                        onClick={handleSave}
                        className="flex items-center px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                      >
                        <Save size={14} className="mr-1" />
                        Save
                      </button>
                      <button
                        onClick={handleCancel}
                        className="flex items-center px-3 py-1 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm"
                      >
                        <X size={14} className="mr-1" />
                        Cancel
                      </button>
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={formData.firstName}
                        onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    ) : (
                      <p className="text-gray-900">{formData.firstName}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={formData.lastName}
                        onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    ) : (
                      <p className="text-gray-900">{formData.lastName}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <div className="flex items-center">
                      <Mail size={16} className="text-gray-400 mr-2" />
                      {isEditing ? (
                        <input
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({...formData, email: e.target.value})}
                          className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      ) : (
                        <p className="text-gray-900">{formData.email}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                    <div className="flex items-center">
                      <Phone size={16} className="text-gray-400 mr-2" />
                      {isEditing ? (
                        <input
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => setFormData({...formData, phone: e.target.value})}
                          className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      ) : (
                        <p className="text-gray-900">{formData.phone}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                    <div className="flex items-center">
                      <MapPin size={16} className="text-gray-400 mr-2" />
                      {isEditing ? (
                        <input
                          type="text"
                          value={formData.address}
                          onChange={(e) => setFormData({...formData, address: e.target.value})}
                          className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      ) : (
                        <p className="text-gray-900">{formData.address}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                    <div className="flex items-center">
                      <Calendar size={16} className="text-gray-400 mr-2" />
                      {isEditing ? (
                        <input
                          type="date"
                          value={formData.dateOfBirth}
                          onChange={(e) => setFormData({...formData, dateOfBirth: e.target.value})}
                          className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      ) : (
                        <p className="text-gray-900">{new Date(formData.dateOfBirth).toLocaleDateString()}</p>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Academic Information */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
              >
                <h2 className="text-lg font-semibold text-gray-900 mb-6">Academic Information</h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Student ID</label>
                    <p className="text-gray-900 font-mono">{formData.id}</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Program</label>
                    <p className="text-gray-900">{formData.program}</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Academic Year</label>
                    <p className="text-gray-900">{formData.year}</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Current Semester</label>
                    <p className="text-gray-900">{formData.semester}</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Enrollment Date</label>
                    <p className="text-gray-900">{new Date(formData.enrollmentDate).toLocaleDateString()}</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                    {isEditing ? (
                      <textarea
                        value={formData.bio}
                        onChange={(e) => setFormData({...formData, bio: e.target.value})}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    ) : (
                      <p className="text-gray-900">{formData.bio}</p>
                    )}
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Recent Activity */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mt-6"
            >
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Recent Activity</h2>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white">
                    <BookOpen size={16} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Completed Database Systems CAT</p>
                    <p className="text-xs text-gray-600">2 days ago</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                  <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white">
                    <Award size={16} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Achieved 92% in Statistics CAT</p>
                    <p className="text-xs text-gray-600">1 week ago</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg">
                  <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white">
                    <TrendingUp size={16} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">GPA improved to 3.75</p>
                    <p className="text-xs text-gray-600">2 weeks ago</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </main>
      </motion.div>
    </div>
  );
}