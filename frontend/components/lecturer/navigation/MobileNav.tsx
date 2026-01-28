import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Filter, 
  GraduationCap, 
  BookOpen, 
  Calendar, 
  ChevronDown 
} from 'lucide-react';
import { Course } from '../../../types/assessment';
import { useThemeColors } from '@/context/ThemeContext';

interface MobileNavProps {
  open: boolean;
  onClose: () => void;
  selectedCourse: string;
  selectedUnit: string;
  selectedWeek: number;
  onCourseSelect: (courseId: string) => void;
  onUnitSelect: (unitId: string) => void;
  onWeekSelect: (week: number) => void;
  courses: Course[];
}

const MobileNav: React.FC<MobileNavProps> = ({
  open,
  onClose,
  selectedCourse,
  selectedUnit,
  selectedWeek,
  onCourseSelect,
  onUnitSelect,
  onWeekSelect,
  courses
}) => {
  const colors = useThemeColors();
  const [expandedCourse, setExpandedCourse] = useState<string>("");
  const weeks = Array.from({ length: 12 }, (_, i) => ({ value: i + 1, label: `Week ${i + 1}` }));

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black z-40"
          />
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 25 }}
            className="fixed inset-y-0 left-0 max-w-[85%] w-[300px] shadow-xl flex flex-col"
            style={{ backgroundColor: colors.cardBackground }}
          >
            <div 
              className="p-4 border-b flex items-center justify-between"
              style={{
                borderColor: colors.border,
                background: `linear-gradient(to right, ${colors.primary}10, ${colors.background})`
              }}
            >
              <h3 
                className="font-bold flex items-center"
                style={{ color: colors.textPrimary }}
              >
                <Filter className="w-5 h-5 mr-2" style={{ color: colors.primary }} />
                Course Selection
              </h3>
              <button 
                onClick={onClose} 
                className="p-2 rounded-full hover:bg-gray-100"
                style={{ color: colors.textTertiary }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = colors.backgroundSecondary;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-5">
              {/* Course Selection */}
              <div>
                <label 
                  className="block text-xs font-bold mb-3 uppercase tracking-wider flex items-center"
                  style={{ color: colors.textSecondary }}
                >
                  <GraduationCap className="w-4 h-4 mr-2" style={{ color: colors.primary }} />
                  Courses
                </label>
                <div className="space-y-3">
                  {courses.map((course) => (
                    <div key={course.id} className="mb-2">
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
                        className={`w-full p-3 rounded-xl border-2 transition-all flex items-center justify-between ${
                          selectedCourse === course.id
                            ? 'border-primary bg-primary/10'
                            : 'border-gray-200 hover:border-primary/50 hover:bg-primary/5'
                        }`}
                        style={{
                          borderColor: selectedCourse === course.id ? colors.primary : colors.border,
                          backgroundColor: selectedCourse === course.id ? colors.primary + '10' : colors.cardBackground
                        }}
                      >
                        <div className="flex items-center">
                          <span 
                            className={`w-3 h-3 rounded-full mr-2`}
                            style={{ backgroundColor: course.color || colors.primary }}
                          ></span>
                          <div className="text-left">
                            <div 
                              className="font-semibold text-sm"
                              style={{ color: colors.textPrimary }}
                            >
                              {course.name}
                            </div>
                            <div 
                              className="text-xs"
                              style={{ color: colors.textTertiary }}
                            >
                              {course.code}
                            </div>
                          </div>
                        </div>
                        <ChevronDown 
                          className={`w-4 h-4 transition-transform ${
                            expandedCourse === course.id ? 'rotate-180' : ''
                          }`} 
                          style={{ color: colors.textTertiary }}
                        />
                      </button>

                      {/* Units */}
                      <AnimatePresence>
                        {expandedCourse === course.id && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="ml-4 mt-2 space-y-2 overflow-hidden"
                          >
                            {course.units.map((unit) => (
                              <button
                                key={unit.id}
                                onClick={() => onUnitSelect(unit.id)}
                                className={`w-full p-2 rounded-lg text-left transition-all ${
                                  selectedUnit === unit.id
                                    ? 'bg-primary/10 text-primary border border-primary/20'
                                    : 'hover:bg-gray-50 border border-transparent'
                                }`}
                                style={{
                                  backgroundColor: selectedUnit === unit.id ? colors.primary + '10' : 'transparent',
                                  color: selectedUnit === unit.id ? colors.primary : colors.textPrimary,
                                  borderColor: selectedUnit === unit.id ? colors.primary + '30' : 'transparent'
                                }}
                              >
                                <div className="flex items-center">
                                  <BookOpen className="w-4 h-4 mr-2" style={{ color: colors.textTertiary }} />
                                  <div>
                                    <div 
                                      className="font-medium text-sm"
                                      style={{ color: selectedUnit === unit.id ? colors.primary : colors.textPrimary }}
                                    >
                                      {unit.unit_name}
                                    </div>
                                    <div 
                                      className="text-xs"
                                      style={{ color: colors.textTertiary }}
                                    >
                                      {unit.unit_code}
                                    </div>
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
                <div className="space-y-3">
                  <label 
                    className="block text-xs font-bold uppercase tracking-wider flex items-center"
                    style={{ color: colors.textSecondary }}
                  >
                    <Calendar className="w-4 h-4 mr-2" style={{ color: colors.primary }} />
                    Week
                  </label>
                  <select
                    value={selectedWeek}
                    onChange={(e) => onWeekSelect(parseInt(e.target.value))}
                    className="w-full p-3 border-2 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary text-sm"
                    style={{
                      backgroundColor: colors.cardBackground,
                      borderColor: colors.border,
                      color: colors.textPrimary
                    }}
                  >
                    <option value={0}>Select Week</option>
                    {weeks.map((week) => (
                      <option key={week.value} value={week.value}>
                        {week.label}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            {/* SVG Decoration */}
            <div className="p-4 relative -z-10">
              <svg 
                className="absolute bottom-0 left-0 right-0 w-full h-16" 
                viewBox="0 0 1200 120" 
                preserveAspectRatio="none"
                style={{ color: colors.primary + '20' }}
              >
                <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" fill="currentColor"></path>
              </svg>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default MobileNav;