'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useLayout } from '@/components/LayoutController';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import EmptyState from '@/components/EmptyState';
import { 
  Calendar, 
  Clock, 
  MapPin,
  Users,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Plus
} from 'lucide-react';

// Mock data
const mockSchedule = [
  {
    id: 1,
    title: 'Database Systems',
    course: 'CS 301',
    type: 'Lecture',
    time: '08:00 - 10:00',
    location: 'Room A101',
    instructor: 'Dr. Smith',
    day: 'Monday',
    color: 'bg-blue-500'
  },
  {
    id: 2,
    title: 'Statistics Lab',
    course: 'MATH 202',
    type: 'Lab',
    time: '10:30 - 12:30',
    location: 'Computer Lab 2',
    instructor: 'Prof. Johnson',
    day: 'Monday',
    color: 'bg-green-500'
  },
  {
    id: 3,
    title: 'Algorithms',
    course: 'CS 302',
    type: 'Lecture',
    time: '14:00 - 16:00',
    location: 'Room B205',
    instructor: 'Dr. Wilson',
    day: 'Tuesday',
    color: 'bg-purple-500'
  },
  {
    id: 4,
    title: 'Database Systems Lab',
    course: 'CS 301',
    type: 'Lab',
    time: '08:00 - 10:00',
    location: 'Computer Lab 1',
    instructor: 'Dr. Smith',
    day: 'Wednesday',
    color: 'bg-blue-500'
  },
  {
    id: 5,
    title: 'Statistics',
    course: 'MATH 202',
    type: 'Lecture',
    time: '10:30 - 12:30',
    location: 'Room C301',
    instructor: 'Prof. Johnson',
    day: 'Thursday',
    color: 'bg-green-500'
  },
  {
    id: 6,
    title: 'Algorithms Lab',
    course: 'CS 302',
    type: 'Lab',
    time: '14:00 - 16:00',
    location: 'Computer Lab 3',
    instructor: 'Dr. Wilson',
    day: 'Friday',
    color: 'bg-purple-500'
  }
];

const timeSlots = [
  '08:00', '09:00', '10:00', '11:00', '12:00', 
  '13:00', '14:00', '15:00', '16:00', '17:00'
];

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

export default function SchedulePage() {
  const { sidebarCollapsed, isMobileView, isTabletView } = useLayout();
  const [hasContent] = useState(mockSchedule.length > 0);
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [viewMode, setViewMode] = useState<'week' | 'list'>('week');

  const getClassesForDay = (day: string) => {
    return mockSchedule.filter(item => item.day === day);
  };

  const getTimeSlotPosition = (time: string) => {
    const hour = parseInt(time.split(':')[0]);
    return ((hour - 8) * 60) + 'px';
  };

  const getClassDuration = (timeRange: string) => {
    const [start, end] = timeRange.split(' - ');
    const startHour = parseInt(start.split(':')[0]);
    const endHour = parseInt(end.split(':')[0]);
    return ((endHour - startHour) * 60) + 'px';
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
        <Header title="Schedule" showWeekSelector={hasContent} />
        
        <main className="p-4 md:p-6">
          {!hasContent ? (
            <div className="max-w-4xl mx-auto">
              <EmptyState
                title="No Schedule Available"
                description="Your class schedule will appear here once your courses are finalized. Contact your academic advisor if you need assistance with course registration."
                icon={<Calendar size={48} />}
              />
            </div>
          ) : (
            <div className="max-w-7xl mx-auto">
              {/* Schedule Controls */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => setCurrentWeek(new Date(currentWeek.getTime() - 7 * 24 * 60 * 60 * 1000))}
                    className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  
                  <div className="text-center">
                    <h2 className="text-lg font-semibold text-gray-900">
                      Week of {currentWeek.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                    </h2>
                  </div>
                  
                  <button
                    onClick={() => setCurrentWeek(new Date(currentWeek.getTime() + 7 * 24 * 60 * 60 * 1000))}
                    className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <ChevronRight size={20} />
                  </button>
                </div>

                <div className="flex items-center space-x-2">
                  <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
                    <button
                      onClick={() => setViewMode('week')}
                      className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                        viewMode === 'week'
                          ? 'bg-white text-blue-600 shadow-sm'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      Week View
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                        viewMode === 'list'
                          ? 'bg-white text-blue-600 shadow-sm'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      List View
                    </button>
                  </div>
                </div>
              </div>

              {viewMode === 'week' ? (
                /* Week View */
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                  <div className="grid grid-cols-6 border-b border-gray-200">
                    <div className="p-4 bg-gray-50 border-r border-gray-200">
                      <span className="text-sm font-medium text-gray-600">Time</span>
                    </div>
                    {days.map((day) => (
                      <div key={day} className="p-4 bg-gray-50 border-r border-gray-200 last:border-r-0">
                        <span className="text-sm font-medium text-gray-900">{day}</span>
                      </div>
                    ))}
                  </div>
                  
                  <div className="grid grid-cols-6 relative" style={{ minHeight: '600px' }}>
                    {/* Time Column */}
                    <div className="border-r border-gray-200">
                      {timeSlots.map((time) => (
                        <div key={time} className="h-16 border-b border-gray-100 p-2 text-xs text-gray-500">
                          {time}
                        </div>
                      ))}
                    </div>
                    
                    {/* Day Columns */}
                    {days.map((day, dayIndex) => (
                      <div key={day} className="relative border-r border-gray-200 last:border-r-0">
                        {timeSlots.map((time) => (
                          <div key={time} className="h-16 border-b border-gray-100"></div>
                        ))}
                        
                        {/* Classes for this day */}
                        {getClassesForDay(day).map((classItem) => (
                          <motion.div
                            key={classItem.id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className={`absolute left-1 right-1 ${classItem.color} text-white rounded-lg p-2 shadow-sm`}
                            style={{
                              top: getTimeSlotPosition(classItem.time.split(' - ')[0]),
                              height: getClassDuration(classItem.time)
                            }}
                          >
                            <div className="text-xs font-medium mb-1">{classItem.title}</div>
                            <div className="text-xs opacity-90">{classItem.course}</div>
                            <div className="text-xs opacity-75 mt-1">{classItem.location}</div>
                          </motion.div>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                /* List View */
                <div className="space-y-4">
                  {days.map((day) => {
                    const dayClasses = getClassesForDay(day);
                    if (dayClasses.length === 0) return null;
                    
                    return (
                      <motion.div
                        key={day}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-xl shadow-sm border border-gray-200"
                      >
                        <div className="p-4 border-b border-gray-200">
                          <h3 className="text-lg font-semibold text-gray-900">{day}</h3>
                        </div>
                        
                        <div className="divide-y divide-gray-100">
                          {dayClasses.map((classItem) => (
                            <div key={classItem.id} className="p-4 hover:bg-gray-50 transition-colors">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-4">
                                  <div className={`w-4 h-4 ${classItem.color} rounded-full`}></div>
                                  <div>
                                    <h4 className="font-medium text-gray-900">{classItem.title}</h4>
                                    <p className="text-sm text-gray-600">{classItem.course} • {classItem.type}</p>
                                  </div>
                                </div>
                                
                                <div className="text-right">
                                  <div className="flex items-center text-sm text-gray-600 mb-1">
                                    <Clock size={14} className="mr-1" />
                                    <span>{classItem.time}</span>
                                  </div>
                                  <div className="flex items-center text-sm text-gray-600 mb-1">
                                    <MapPin size={14} className="mr-1" />
                                    <span>{classItem.location}</span>
                                  </div>
                                  <div className="flex items-center text-sm text-gray-600">
                                    <Users size={14} className="mr-1" />
                                    <span>{classItem.instructor}</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}

              {/* Quick Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Classes</p>
                      <p className="text-2xl font-bold text-blue-600">{mockSchedule.length}</p>
                    </div>
                    <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                      <BookOpen size={24} className="text-blue-600" />
                    </div>
                  </div>
                </motion.div>

                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Weekly Hours</p>
                      <p className="text-2xl font-bold text-green-600">12</p>
                    </div>
                    <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
                      <Clock size={24} className="text-green-600" />
                    </div>
                  </div>
                </motion.div>

                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Courses</p>
                      <p className="text-2xl font-bold text-purple-600">3</p>
                    </div>
                    <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center">
                      <Users size={24} className="text-purple-600" />
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          )}
        </main>
      </motion.div>
    </div>
  );
}