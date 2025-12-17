import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Filter, 
  GraduationCap, 
  BookOpen, 
  Calendar, 
  ChevronDown, 
  ChevronLeft, 
  ChevronRight,
  Target
} from 'lucide-react';
import { Course } from '../../../types/assessment';

interface SideAccessPanelProps {
  selectedCourse: string;
  selectedUnit: string;
  selectedWeek: number;
  onCourseSelect: (courseId: string) => void;
  onUnitSelect: (unitId: string) => void;
  onWeekSelect: (week: number) => void;
  courses: Course[];
  isMinimized: boolean;
  onToggleMinimize: () => void;
}

const SideAccessPanel: React.FC<SideAccessPanelProps> = ({
  selectedCourse,
  selectedUnit,
  selectedWeek,
  onCourseSelect,
  onUnitSelect,
  onWeekSelect,
  courses,
  isMinimized,
  onToggleMinimize
}) => {
  const [expandedCourse, setExpandedCourse] = useState<string>("");

  const weeks = Array.from({ length: 12 }, (_, i) => ({ value: i + 1, label: `Week ${i + 1}` }));

  const selectedCourseData = courses.find(c => c.id === selectedCourse);
  const selectedUnitData = selectedCourseData?.units.find(u => u.id === selectedUnit);

  return (
    <motion.div
      initial={{ width: 320 }}
      animate={{ width: isMinimized ? 60 : 320 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="bg-white border-r border-gray-100 shadow-lg flex flex-col relative z-20 h-full hidden md:flex"
    >
      {/* Header */}
      <div className="p-4 lg:p-6 border-b border-gray-100 bg-gradient-to-r from-emerald-50 to-white">
        <div className="flex items-center justify-between">
          {!isMinimized && (
            <div>
              <h3 className="font-bold text-gray-900 flex items-center text-base">
                <Filter className="w-5 h-5 mr-3 text-emerald-600" />
                Course Selection
              </h3>
              <p className="text-sm text-gray-500 mt-1">Choose your context</p>
            </div>
          )}
          <button
            onClick={onToggleMinimize}
            className="p-2 hover:bg-emerald-100 rounded-xl transition-colors group"
          >
            {isMinimized ? (
              <ChevronRight className="w-5 h-5 text-emerald-600 group-hover:text-emerald-700" />
            ) : (
              <ChevronLeft className="w-5 h-5 text-emerald-600 group-hover:text-emerald-700" />
            )}
          </button>
        </div>
      </div>

      {!isMinimized && (
        <div className="flex-1 overflow-y-auto p-4 lg:p-6 space-y-6">
          {/* Course Selection */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-4 uppercase tracking-wider flex items-center">
              <GraduationCap className="w-4 h-4 mr-2 text-emerald-600" />
              Courses
            </label>
            <div className="space-y-3">
              {courses.map((course) => (
                <div key={course.id}>
                  <button
                    onClick={() => {
                      if (selectedCourse === course.id) {
                        setExpandedCourse(expandedCourse === course.id ? "" : course.id);
                      } else {
                        onCourseSelect(course.id);
                        setExpandedCourse(course.id);
                        onUnitSelect("");
                      }
                    }}
                    className={`w-full p-4 rounded-xl border transition-all flex items-center justify-between group hover:shadow-md ${
                      selectedCourse === course.id
                        ? 'border-emerald-300 bg-emerald-50 shadow-md'
                        : 'border-gray-200 hover:border-emerald-200 hover:bg-emerald-50'
                    }`}
                  >
                    <div className="flex items-center">
                      <span className={`w-3 h-3 rounded-full mr-3 ${course.color} shadow-sm`}></span>
                      <div className="text-left">
                        <div className="font-semibold text-sm text-gray-900">{course.name}</div>
                        <div className="text-xs text-gray-500 font-medium">{course.code}</div>
                      </div>
                    </div>
                    <ChevronDown className={`w-4 h-4 transition-transform text-gray-400 ${
                      expandedCourse === course.id ? 'rotate-180' : ''
                    }`} />
                  </button>

                  {/* Units */}
                  <AnimatePresence>
                    {expandedCourse === course.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="ml-6 mt-3 space-y-2 overflow-hidden"
                      >
                        {course.units.map((unit) => (
                          <button
                            key={unit.id}
                            onClick={() => onUnitSelect(unit.id)}
                            className={`w-full p-3 rounded-lg text-left transition-all hover:shadow-sm ${
                              selectedUnit === unit.id
                                ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                                : 'hover:bg-gray-50 border border-transparent'
                            }`}
                          >
                            <div className="flex items-center">
                              <BookOpen className="w-4 h-4 mr-3 text-gray-400" />
                              <div>
                                <div className="font-medium text-sm">{unit.unit_name}</div>
                                <div className="text-xs text-gray-500">{unit.unit_code}</div>
                              </div>
                            </div>
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </div>

          {/* Week Selection */}
          {selectedCourse && selectedUnit && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center">
                <Calendar className="w-4 h-4 mr-2 text-emerald-600" />
                Week
              </label>
              <select
                value={selectedWeek}
                onChange={(e) => onWeekSelect(parseInt(e.target.value))}
                className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white text-sm font-medium shadow-sm hover:border-emerald-300 transition-colors"
              >
                <option value={0}>Select Week</option>
                {weeks.map((week) => (
                  <option key={week.value} value={week.value}>
                    {week.label}
                  </option>
                ))}
              </select>
            </motion.div>
          )}

          {/* Selection Summary */}
          {selectedCourse && selectedUnit && selectedWeek > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative p-5 bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl border border-emerald-200 shadow-sm z-10 overflow-hidden"
            >
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-10">
                <svg className="w-full h-full" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                      <path d="M 10 0 L 0 0 0 10" fill="none" stroke="currentColor" strokeWidth="0.5"/>
                    </pattern>
                  </defs>
                  <rect width="100" height="100" fill="url(#grid)" />
                </svg>
              </div>

              {/* Floating Elements */}
              <div className="absolute top-2 right-2 w-8 h-8 bg-emerald-200 rounded-full opacity-30"></div>
              <div className="absolute bottom-2 left-2 w-6 h-6 bg-emerald-300 rounded-full opacity-40"></div>
              <div className="absolute top-1/2 right-4 w-4 h-4 bg-emerald-400 rounded-full opacity-50"></div>

              <div className="relative z-10">
                <h4 className="font-bold text-emerald-900 mb-4 flex items-center text-sm">
                  <Target className="w-4 h-4 mr-2" />
                  Current Selection
                </h4>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center text-emerald-800">
                    <span className={`w-2 h-2 rounded-full mr-3 ${selectedCourseData?.color}`}></span>
                    <span className="font-semibold">{selectedCourseData?.name}</span>
                  </div>
                  <div className="flex items-center text-emerald-800">
                    <BookOpen className="w-4 h-4 mr-3" />
                    <span className="font-medium">{selectedUnitData?.unit_name}</span>
                  </div>
                  <div className="flex items-center text-emerald-800">
                    <Calendar className="w-4 h-4 mr-3" />
                    <span className="font-medium">Week {selectedWeek}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      )}

      {isMinimized && (
        <div className="p-4 space-y-4">
          <button
            onClick={onToggleMinimize}
            className="w-full p-4 bg-emerald-50 text-emerald-700 rounded-xl hover:bg-emerald-100 transition-colors shadow-sm"
          >
            <Filter className="w-5 h-5 mx-auto" />
          </button>
          
          {selectedCourse && (
            <div className={`w-10 h-10 ${selectedCourseData?.color} rounded-xl flex items-center justify-center shadow-sm mx-auto`}>
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
          )}
          
          {selectedUnit && (
            <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center shadow-sm mx-auto">
              <BookOpen className="w-5 h-5 text-emerald-700" />
            </div>
          )}
          
          {selectedWeek > 0 && (
            <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center shadow-sm mx-auto border border-emerald-200">
              <span className="text-xs font-bold text-emerald-700">W{selectedWeek}</span>
            </div>
          )}
        </div>
      )}

      {/* Footer Decorative Element */}
      {!isMinimized && (
        <div className="relative overflow-hidden bg-gradient-to-t from-emerald-100 to-transparent p-4">
          <svg className="w-full h-20 text-emerald-200 opacity-60" viewBox="0 0 400 100" preserveAspectRatio="none">
            {/* Flowing circles background */}
            <circle cx="80" cy="30" r="35" fill="currentColor" opacity="0.4"/>
            <circle cx="200" cy="60" r="45" fill="currentColor" opacity="0.5"/>
            <circle cx="320" cy="40" r="40" fill="currentColor" opacity="0.3"/>
            <circle cx="350" cy="70" r="30" fill="currentColor" opacity="0.6"/>
            
            {/* Document/Assessment sheet */}
            <rect x="150" y="25" width="100" height="50" rx="4" fill="white" opacity="0.9"/>
            
            {/* Assessment lines */}
            <line x1="160" y1="35" x2="220" y2="35" stroke="currentColor" strokeWidth="2"/>
            <line x1="160" y1="45" x2="210" y2="45" stroke="currentColor" strokeWidth="1.5"/>
            <line x1="160" y1="55" x2="230" y2="55" stroke="currentColor" strokeWidth="1.5"/>
            <line x1="160" y1="65" x2="200" y2="65" stroke="currentColor" strokeWidth="1.5"/>
            
            {/* Grade/checkmark */}
            <circle cx="235" cy="40" r="8" fill="currentColor" opacity="0.8"/>
            <path d="M230 40 L233 43 L240 36" stroke="white" strokeWidth="2" fill="none" strokeLinecap="round"/>
          </svg>
        </div>
      )}
    </motion.div>
  );
};

export default SideAccessPanel;