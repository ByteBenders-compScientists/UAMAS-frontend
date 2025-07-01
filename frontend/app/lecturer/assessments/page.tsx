"use client";

import React, { useState, useEffect, Fragment } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLayout } from "@/components/LayoutController";
import Sidebar from "@/components/lecturerSidebar";
import Header from "@/components/Header";
import {
  BookMarked,
  Plus,
  CheckCircle,
  Wand2,
  User,
  ClipboardList,
  FileCheck,
  AlertCircle,
  Loader2,
  Eye,
  Edit3,
  Trash2,
  Calendar,
  GraduationCap,
  BookOpen,
  ChevronDown,
  ChevronRight,
  X,
  Target,
  Award,
  Clock,
  Settings,
  Sparkles,
  Filter,
  Brain,
  Layers,
  Zap,
  TrendingUp,
  BarChart3,
  Users,
  Star,
  CheckCircle2,
  Info,
  Trash,
  Edit,
  Menu,
  ChevronLeft,
  Home,
  ArrowRight,
  Check,
  HelpCircle,
  Book,
  ShieldCheck,
  XCircle,
  PenTool,
  Flag,
  Save,
  RefreshCw,
  MessageSquare,
  FileText,
  Upload,
  Download,
  Copy,
  Move3D
} from "lucide-react";

// ===== TYPES =====
interface Question {
  id: string;
  question: string;
  type: "multiple-choice" | "true-false" | "open-ended" | "application";
  options?: string[];
  correct_answer?: string | string[];
  marks: number;
  explanation?: string;
}

interface Assessment {
  id: string;
  title: string;
  description: string;
  type: "CAT" | "Assignment" | "Case Study";
  unit_id: string;
  course_id: string;
  questions_type: "open-ended" | "close-ended" | "application";
  close_ended_type?: string;
  topic: string;
  total_marks: number;
  difficulty: "Easy" | "Intermediate" | "Advanced";
  number_of_questions: number;
  blooms_level: "Remember" | "Understand" | "Apply" | "Analyze" | "Evaluate" | "Create";
  deadline?: string;
  duration?: number;
  verified: boolean;
  created_at: string;
  creator_id: string;
  week: number;
  status?: string;
  questions?: Question[];
}

interface Course {
  id: string;
  name: string;
  code: string;
  color: string;
  units: Unit[];
}

interface Unit {
  id: string;
  name: string;
  code: string;
  course_id: string;
}

// ===== DUMMY DATA =====
const dummyCourses: Course[] = [
  {
    id: "1",
    name: "Computer Science 4.1",
    code: "CS401",
    color: "bg-emerald-500",
    units: [
      { id: "1", name: "Machine Learning", code: "ML101", course_id: "1" },
      { id: "2", name: "Data Structures", code: "DS201", course_id: "1" },
      { id: "3", name: "Algorithms", code: "ALG301", course_id: "1" },
    ]
  },
  {
    id: "2", 
    name: "Software Engineering",
    code: "SE301",
    color: "bg-blue-500",
    units: [
      { id: "4", name: "Requirements Engineering", code: "RE101", course_id: "2" },
      { id: "5", name: "System Design", code: "SD201", course_id: "2" },
      { id: "6", name: "Testing & QA", code: "TQA301", course_id: "2" },
    ]
  },
  {
    id: "3",
    name: "Database Systems", 
    code: "DB401",
    color: "bg-purple-500",
    units: [
      { id: "7", name: "Database Design", code: "DD101", course_id: "3" },
      { id: "8", name: "SQL & NoSQL", code: "SQL201", course_id: "3" },
      { id: "9", name: "Database Security", code: "DBS301", course_id: "3" },
    ]
  },
  {
    id: "4",
    name: "Web Development",
    code: "WD301", 
    color: "bg-orange-500",
    units: [
      { id: "10", name: "Frontend Development", code: "FE101", course_id: "4" },
      { id: "11", name: "Backend Systems", code: "BE201", course_id: "4" },
      { id: "12", name: "Full Stack Integration", code: "FS301", course_id: "4" },
    ]
  }
];

const dummyQuestions: Question[] = [
  {
    id: "q1",
    question: "What is the primary purpose of supervised learning in machine learning?",
    type: "multiple-choice",
    options: [
      "To learn patterns without labeled data",
      "To learn from input-output pairs",
      "To optimize reward functions",
      "To reduce dimensionality"
    ],
    correct_answer: "To learn from input-output pairs",
    marks: 2,
    explanation: "Supervised learning uses labeled training data to learn a mapping function from inputs to outputs."
  },
  {
    id: "q2",
    question: "Explain the difference between classification and regression in supervised learning.",
    type: "open-ended",
    marks: 5,
    explanation: "Students should explain that classification predicts discrete categories while regression predicts continuous values."
  },
  {
    id: "q3",
    question: "Implement a simple linear regression model and explain its components.",
    type: "application",
    marks: 8,
    explanation: "Students should implement the model and explain slope, intercept, and loss function."
  }
];

const dummyAssessments: Assessment[] = [
  {
    id: "1",
    title: "Machine Learning Fundamentals",
    description: "Introduction to supervised and unsupervised learning algorithms",
    type: "CAT",
    unit_id: "1",
    course_id: "1", 
    questions_type: "close-ended",
    close_ended_type: "multiple choice with one answer",
    topic: "ML Basics",
    total_marks: 30,
    difficulty: "Intermediate",
    number_of_questions: 15,
    blooms_level: "Understand",
    verified: true,
    created_at: "2024-01-15T10:00:00Z",
    creator_id: "lecturer1",
    week: 3,
    questions: dummyQuestions
  },
  {
    id: "2", 
    title: "Data Structure Implementation",
    description: "Implementing various data structures and analyzing their performance",
    type: "Assignment",
    unit_id: "2",
    course_id: "1",
    questions_type: "application",
    topic: "Data Structures",
    total_marks: 50,
    difficulty: "Advanced", 
    number_of_questions: 8,
    blooms_level: "Apply",
    verified: false,
    created_at: "2024-01-20T14:30:00Z",
    creator_id: "lecturer1",
    week: 5,
    questions: dummyQuestions.slice(0, 2)
  },
  {
    id: "3",
    title: "Database Query Optimization",
    description: "Advanced SQL queries and performance optimization techniques",
    type: "Case Study",
    unit_id: "7",
    course_id: "3",
    questions_type: "open-ended",
    topic: "Query Optimization",
    total_marks: 40,
    difficulty: "Advanced",
    number_of_questions: 6,
    blooms_level: "Analyze",
    verified: true,
    created_at: "2024-01-25T09:15:00Z", 
    creator_id: "lecturer1",
    week: 7,
    questions: dummyQuestions.slice(1)
  }
];

// ===== UTILITY FUNCTIONS =====
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short', 
    day: 'numeric'
  });
};

const getDifficultyColor = (difficulty: string) => {
  switch (difficulty) {
    case "Easy":
      return "bg-green-50 text-green-700 border-green-200";
    case "Intermediate": 
      return "bg-yellow-50 text-yellow-700 border-yellow-200";
    case "Advanced":
      return "bg-red-50 text-red-700 border-red-200";
    default:
      return "bg-gray-50 text-gray-700 border-gray-200";
  }
};

const getTypeColor = (type: string) => {
  switch (type) {
    case "CAT":
      return "bg-blue-50 text-blue-700 border-blue-200";
    case "Assignment":
      return "bg-purple-50 text-purple-700 border-purple-200";
    case "Case Study":
      return "bg-orange-50 text-orange-700 border-orange-200";
    default:
      return "bg-gray-50 text-gray-700 border-gray-200";
  }
};

const getBlooms = (level: string) => {
  switch (level) {
    case "Remember":
      return { icon: Book, color: "text-blue-500", bg: "bg-blue-50" };
    case "Understand":
      return { icon: BookOpen, color: "text-cyan-600", bg: "bg-cyan-50" };
    case "Apply":
      return { icon: PenTool, color: "text-green-600", bg: "bg-green-50" };
    case "Analyze":
      return { icon: Brain, color: "text-yellow-600", bg: "bg-yellow-50" };
    case "Evaluate":
      return { icon: Star, color: "text-orange-500", bg: "bg-orange-50" };
    case "Create":
      return { icon: Sparkles, color: "text-purple-600", bg: "bg-purple-50" };
    default:
      return { icon: HelpCircle, color: "text-gray-500", bg: "bg-gray-50" };
  }
};

// ===== COMPONENTS =====

// AI Loading Modal
const AILoadingModal: React.FC<{
  isOpen: boolean;
  title?: string;
  message?: string;
}> = ({ isOpen, title = "Generating with AI", message = "Creating your assessment with artificial intelligence..." }) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          transition={{ type: "spring", damping: 20 }}
          className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4"
        >
          <div className="text-center">
            {/* Animated AI Icon */}
            <div className="relative mb-6">
              <motion.div
                animate={{ 
                  rotate: 360,
                  scale: [1, 1.1, 1]
                }}
                transition={{ 
                  rotate: { duration: 3, repeat: Infinity, ease: "linear" },
                  scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }
                }}
                className="w-20 h-20 mx-auto bg-gradient-to-r from-emerald-400 to-blue-500 rounded-full flex items-center justify-center shadow-lg"
              >
                <motion.div
                  animate={{ rotate: -360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                >
                  <Brain className="w-10 h-10 text-white" />
                </motion.div>
              </motion.div>
              
              {/* Floating particles */}
              {Array.from({ length: 8 }).map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 bg-emerald-400 rounded-full"
                  style={{
                    left: '50%',
                    top: '50%',
                  }}
                  animate={{
                    x: [0, Math.cos(i * 45 * Math.PI / 180) * 60],
                    y: [0, Math.sin(i * 45 * Math.PI / 180) * 60],
                    opacity: [0, 1, 0],
                    scale: [0, 1, 0]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: i * 0.2,
                    ease: "easeInOut"
                  }}
                />
              ))}
            </div>

            <h3 className="text-2xl font-bold text-gray-900 mb-3">{title}</h3>
            <p className="text-gray-600 mb-6 leading-relaxed">{message}</p>
            
            {/* Progress bar */}
            <div className="w-full bg-gray-200 rounded-full h-2 mb-4 overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-emerald-400 to-blue-500 rounded-full"
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              />
            </div>
            
            <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>This may take a few moments...</span>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

// Modern Breadcrumb Component
const Breadcrumb: React.FC<{
  items: Array<{ label: string; icon?: React.ElementType; href?: string }>
}> = ({ items }) => {
  return (
    <nav className="hidden sm:flex items-center text-sm py-2 mb-4">
      {items.map((item, index) => (
        <Fragment key={index}>
          {index > 0 && (
            <ArrowRight className="w-3 h-3 mx-2 text-gray-400" />
          )}
          <div className={`flex items-center ${
            index === items.length - 1 
              ? 'text-emerald-600 font-semibold' 
              : 'text-gray-600 hover:text-emerald-600'
          }`}>
            {item.icon && <item.icon className="w-4 h-4 mr-1.5" />}
            <span>{item.label}</span>
          </div>
        </Fragment>
      ))}
    </nav>
  );
};

// Mobile Navigation Menu
const MobileNav: React.FC<{
  open: boolean;
  onClose: () => void;
  selectedCourse: string;
  selectedUnit: string;
  selectedWeek: number;
  onCourseSelect: (courseId: string) => void;
  onUnitSelect: (unitId: string) => void;
  onWeekSelect: (week: number) => void;
  courses: Course[];
}> = ({
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
            className="fixed inset-y-0 left-0 max-w-[85%] w-[300px] bg-white z-50 shadow-xl flex flex-col"
          >
            <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-emerald-50 to-white">
              <h3 className="font-bold text-gray-900 flex items-center">
                <Filter className="w-5 h-5 mr-2 text-emerald-600" />
                Course Selection
              </h3>
              <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-5">
              {/* Course Selection */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-3 uppercase tracking-wider flex items-center">
                  <GraduationCap className="w-4 h-4 mr-2 text-emerald-600" />
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
                            ? 'border-emerald-300 bg-emerald-50'
                            : 'border-gray-200 hover:border-emerald-200 hover:bg-emerald-50'
                        }`}
                      >
                        <div className="flex items-center">
                          <span className={`w-3 h-3 rounded-full mr-2 ${course.color}`}></span>
                          <div className="text-left">
                            <div className="font-semibold text-sm text-gray-900">{course.name}</div>
                            <div className="text-xs text-gray-500">{course.code}</div>
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
                            className="ml-4 mt-2 space-y-2 overflow-hidden"
                          >
                            {course.units.map((unit) => (
                              <button
                                key={unit.id}
                                onClick={() => onUnitSelect(unit.id)}
                                className={`w-full p-2 rounded-lg text-left transition-all ${
                                  selectedUnit === unit.id
                                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                                    : 'hover:bg-gray-50 border border-transparent'
                                }`}
                              >
                                <div className="flex items-center">
                                  <BookOpen className="w-4 h-4 mr-2 text-gray-400" />
                                  <div>
                                    <div className="font-medium text-sm">{unit.name}</div>
                                    <div className="text-xs text-gray-500">{unit.code}</div>
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
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center">
                    <Calendar className="w-4 h-4 mr-2 text-emerald-600" />
                    Week
                  </label>
                  <select
                    value={selectedWeek}
                    onChange={(e) => onWeekSelect(parseInt(e.target.value))}
                    className="w-full p-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white text-sm"
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
              <svg className="absolute bottom-0 left-0 right-0 w-full h-16 text-emerald-100" viewBox="0 0 1200 120" preserveAspectRatio="none">
                <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" fill="currentColor"></path>
              </svg>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

const SideAccessPanel: React.FC<{
  selectedCourse: string;
  selectedUnit: string;
  selectedWeek: number;
  onCourseSelect: (courseId: string) => void;
  onUnitSelect: (unitId: string) => void;
  onWeekSelect: (week: number) => void;
  courses: Course[];
  isMinimized: boolean;
  onToggleMinimize: () => void;
}> = ({
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
                                <div className="font-medium text-sm">{unit.name}</div>
                                <div className="text-xs text-gray-500">{unit.code}</div>
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

          {/* Selection Summary with Background Image */}
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
                    <span className="font-medium">{selectedUnitData?.name}</span>
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

// Modal Component
const Modal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  maxWidth?: string;
}> = ({ isOpen, onClose, title, children, maxWidth = "max-w-4xl" }) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 overflow-auto bg-black/30 backdrop-blur-sm flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ type: "spring", damping: 20 }}
          className={`${maxWidth} w-full bg-white rounded-2xl shadow-2xl overflow-hidden`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gradient-to-r from-emerald-50 to-white">
            <h3 className="text-xl font-bold text-gray-900">{title}</h3>
            <button 
              onClick={onClose} 
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
          <div className="max-h-[calc(90vh-10rem)] overflow-y-auto">
            {children}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

// Question Editor Component
const QuestionEditor: React.FC<{
  question: Question;
  onUpdate: (question: Question) => void;
  onDelete: () => void;
  index: number;
}> = ({ question, onUpdate, onDelete, index }) => {
  const [editedQuestion, setEditedQuestion] = useState(question);

  useEffect(() => {
    setEditedQuestion(question);
  }, [question]);

  const handleSave = () => {
    onUpdate(editedQuestion);
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
      <div className="flex justify-between items-start mb-4">
        <h4 className="font-semibold text-gray-900 text-lg">Question {index + 1}</h4>
        <div className="flex items-center space-x-2">
          <span className="bg-emerald-50 text-emerald-700 text-xs font-medium px-3 py-1 rounded-full">
            {editedQuestion.marks} marks
          </span>
          <button
            onClick={onDelete}
            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {/* Question Text */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Question</label>
          <textarea
            value={editedQuestion.question}
            onChange={(e) => setEditedQuestion({...editedQuestion, question: e.target.value})}
            rows={3}
            className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            placeholder="Enter question text"
          />
        </div>

        {/* Marks */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Marks</label>
          <input
            type="number"
            value={editedQuestion.marks}
            onChange={(e) => setEditedQuestion({...editedQuestion, marks: parseInt(e.target.value)})}
            className="w-24 p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            min="1"
          />
        </div>

        {/* Options for Multiple Choice */}
        {editedQuestion.type === "multiple-choice" && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Options</label>
            <div className="space-y-2">
              {editedQuestion.options?.map((option, optionIndex) => (
                <div key={optionIndex} className="flex items-center space-x-3">
                  <input
                    type="radio"
                    name={`correct-${question.id}`}
                    checked={editedQuestion.correct_answer === option}
                    onChange={() => setEditedQuestion({...editedQuestion, correct_answer: option})}
                    className="text-emerald-600 focus:ring-emerald-500"
                  />
                  <input
                    type="text"
                    value={option}
                    onChange={(e) => {
                      const newOptions = [...(editedQuestion.options || [])];
                      newOptions[optionIndex] = e.target.value;
                      setEditedQuestion({...editedQuestion, options: newOptions});
                    }}
                    className="flex-1 p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder={`Option ${optionIndex + 1}`}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Explanation */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Explanation (Optional)</label>
          <textarea
            value={editedQuestion.explanation || ''}
            onChange={(e) => setEditedQuestion({...editedQuestion, explanation: e.target.value})}
            rows={2}
            className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            placeholder="Provide an explanation for the answer"
          />
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            onClick={handleSave}
            className="flex items-center px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium"
          >
            <Save className="w-4 h-4 mr-2" />
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

// Edit Assessment Modal with Questions
const EditAssessmentModal: React.FC<{
  assessment: Assessment;
  courses: Course[];
  onUpdate: (data: any) => void;
  onCancel: () => void;
  loading: boolean;
}> = ({ assessment, courses, onUpdate, onCancel, loading }) => {
  const [formData, setFormData] = useState({
    title: assessment.title,
    description: assessment.description,
    type: assessment.type,
    questions_type: assessment.questions_type,
    close_ended_type: assessment.close_ended_type || "multiple choice with one answer",
    topic: assessment.topic,
    total_marks: assessment.total_marks,
    difficulty: assessment.difficulty,
    number_of_questions: assessment.number_of_questions,
    blooms_level: assessment.blooms_level,
    deadline: assessment.deadline || "",
    duration: assessment.duration || 60
  });

  const [questions, setQuestions] = useState<Question[]>(assessment.questions || []);
  const [activeTab, setActiveTab] = useState<'details' | 'questions'>('details');

  const course = courses.find(c => c.id === assessment.course_id);
  const unit = course?.units.find(u => u.id === assessment.unit_id);

  const handleQuestionUpdate = (index: number, updatedQuestion: Question) => {
    const newQuestions = [...questions];
    newQuestions[index] = updatedQuestion;
    setQuestions(newQuestions);
  };

  const handleQuestionDelete = (index: number) => {
    const newQuestions = questions.filter((_, i) => i !== index);
    setQuestions(newQuestions);
  };

  const handleSubmit = () => {
    const submissionData = {
      ...formData,
      questions: questions
    };
    onUpdate(submissionData);
  };

  return (
    <div className="p-6">
      {/* Tab Navigation */}
      <div className="flex space-x-4 mb-6 border-b border-gray-200">
        <button
          onClick={() => setActiveTab('details')}
          className={`pb-3 px-1 font-medium text-sm border-b-2 transition-colors ${
            activeTab === 'details'
              ? 'border-emerald-500 text-emerald-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          Assessment Details
        </button>
        <button
          onClick={() => setActiveTab('questions')}
          className={`pb-3 px-1 font-medium text-sm border-b-2 transition-colors ${
            activeTab === 'questions'
              ? 'border-emerald-500 text-emerald-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          Questions ({questions.length})
        </button>
      </div>

      {/* Assessment Details Tab */}
      {activeTab === 'details' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-3">Assessment Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-3">Assessment Type</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({...formData, type: e.target.value as "CAT" | "Assignment" | "Case Study"})}
                className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
              >
                <option value="CAT">CAT</option>
                <option value="Assignment">Assignment</option>
                <option value="Case Study">Case Study</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-3">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              rows={4}
              className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-3">Total Marks</label>
              <input
                type="number"
                value={formData.total_marks}
                onChange={(e) => setFormData({...formData, total_marks: parseInt(e.target.value)})}
                className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                min="1"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-3">Difficulty</label>
              <select
                value={formData.difficulty}
                onChange={(e) => setFormData({...formData, difficulty: e.target.value as "Easy" | "Intermediate" | "Advanced"})}
                className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
              >
                <option value="Easy">Easy</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-3">Duration (min)</label>
              <input
                type="number"
                value={formData.duration}
                onChange={(e) => setFormData({...formData, duration: parseInt(e.target.value)})}
                className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                min="1"
              />
            </div>
          </div>
        </div>
      )}

      {/* Questions Tab */}
      {activeTab === 'questions' && (
        <div className="space-y-6">
          {questions.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">No Questions Yet</h3>
              <p className="text-gray-500">Questions will appear here after generation</p>
            </div>
          ) : (
            questions.map((question, index) => (
              <QuestionEditor
                key={question.id}
                question={question}
                onUpdate={(updatedQuestion) => handleQuestionUpdate(index, updatedQuestion)}
                onDelete={() => handleQuestionDelete(index)}
                index={index}
              />
            ))
          )}
        </div>
      )}

      {/* Footer */}
      <div className="mt-8 pt-6 border-t border-gray-200 flex justify-between items-center">
        <button
          onClick={onCancel}
          className="px-6 py-3 text-gray-600 hover:text-gray-800 font-semibold transition-colors rounded-xl hover:bg-gray-100"
          disabled={loading}
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="flex items-center px-6 py-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors font-semibold shadow-lg"
        >
          {loading ? (
            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
          ) : (
            <Save className="w-5 h-5 mr-2" />
          )}
          Save Changes
        </button>
      </div>
    </div>
  );
};

// View Assessment Modal Content
const ViewAssessmentModal: React.FC<{
  assessment: Assessment;
  courses: Course[];
  onVerify: (id: string) => void;
}> = ({ assessment, courses, onVerify }) => {
  const course = courses.find(c => c.id === assessment.course_id);
  const unit = course?.units.find(u => u.id === assessment.unit_id);
  const bloomsInfo = getBlooms(assessment.blooms_level);
  const BloomsIcon = bloomsInfo.icon;

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row md:items-start gap-6 mb-8">
        <div className="flex-1">
          {/* Header Info */}
          <div className="mb-6">
            <div className="flex flex-wrap items-center gap-3 mb-4 text-sm">
              <span className={`inline-flex items-center px-3 py-1 rounded-full font-medium ${getTypeColor(assessment.type)}`}>
                {assessment.type}
              </span>
              <span className={`inline-flex items-center px-3 py-1 rounded-full font-medium ${getDifficultyColor(assessment.difficulty)}`}>
                {assessment.difficulty}
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                {assessment.questions_type === 'application' ? 'Application' : 
                assessment.questions_type === 'open-ended' ? 'Open-ended' : 'Close-ended'}
              </span>
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{assessment.title}</h2>
            
            <div className="flex flex-wrap items-center gap-4 text-gray-600 mb-4">
              {course && (
                <div className="flex items-center">
                  <span className={`w-3 h-3 rounded-full mr-2 ${course.color}`}></span>
                  <span className="text-sm font-medium">{course.name}</span>
                </div>
              )}
              <span className="text-gray-300">•</span>
              <span className="text-sm font-medium">{unit?.name}</span>
              <span className="text-gray-300">•</span>
              <span className="text-sm font-medium flex items-center">
                <Calendar className="w-4 h-4 mr-1" />
                Week {assessment.week}
              </span>
            </div>
            
            <p className="text-gray-700 leading-relaxed">{assessment.description}</p>
          </div>
          
          {/* Topic Information */}
          <div className="bg-gray-50 rounded-xl p-5 mb-6 border border-gray-200">
            <h3 className="font-bold text-gray-900 mb-3 flex items-center">
              <BookOpen className="w-5 h-5 mr-2 text-emerald-600" />
              Topic Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-gray-500 font-medium">Main Topic</div>
                <div className="font-semibold text-gray-900">{assessment.topic}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500 font-medium">Bloom's Taxonomy Level</div>
                <div className="font-semibold text-gray-900 flex items-center">
                  <div className={`p-1.5 rounded-md ${bloomsInfo.bg} mr-2`}>
                    <BloomsIcon className={`w-4 h-4 ${bloomsInfo.color}`} />
                  </div>
                  {assessment.blooms_level}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Stats & Meta Info */}
        <div className="md:w-72 space-y-5">
          <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl p-5 border border-emerald-200">
            <h3 className="font-bold text-emerald-900 mb-4 flex items-center text-sm">
              <ClipboardList className="w-4 h-4 mr-2" />
              Assessment Details
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-emerald-800">Questions</span>
                <span className="font-bold text-emerald-900">{assessment.number_of_questions}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-emerald-800">Total Marks</span>
                <span className="font-bold text-emerald-900">{assessment.total_marks}</span>
              </div>
              {assessment.duration && (
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-emerald-800">Duration</span>
                  <span className="font-bold text-emerald-900">{assessment.duration} min</span>
                </div>
              )}
              {assessment.deadline && (
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-emerald-800">Deadline</span>
                  <span className="font-bold text-emerald-900">{formatDate(assessment.deadline)}</span>
                </div>
              )}
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-5 border border-gray-200">
            <h3 className="font-bold text-gray-900 mb-4 flex items-center text-sm">
              <Info className="w-4 h-4 mr-2" />
              Status Information
            </h3>
            <div className="space-y-3">
              <div className="flex items-center">
                {assessment.verified ? (
                  <div className="flex items-center text-green-600 bg-green-50 px-3 py-2 rounded-lg w-full">
                    <CheckCircle2 className="w-5 h-5 mr-2" />
                    <span className="font-semibold">Verified</span>
                  </div>
                ) : (
                  <div className="flex items-center text-yellow-600 bg-yellow-50 px-3 py-2 rounded-lg w-full">
                    <AlertCircle className="w-5 h-5 mr-2" />
                    <span className="font-semibold">Pending Verification</span>
                  </div>
                )}
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-600">Created</span>
                <span className="text-sm text-gray-900">{formatDate(assessment.created_at)}</span>
              </div>
            </div>
          </div>
          
          {/* Verify Button */}
          {!assessment.verified && (
            <button
              onClick={() => onVerify(assessment.id)}
              className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl shadow-lg flex items-center justify-center transition-colors"
            >
              <ShieldCheck className="w-5 h-5 mr-2" />
              Verify Assessment
            </button>
          )}
        </div>
      </div>
      
      {/* Questions Section */}
      <div className="border-t border-gray-200 pt-6">
        <h3 className="text-xl font-bold text-gray-900 mb-5 flex items-center">
          <BookMarked className="w-5 h-5 mr-2 text-emerald-600" />
          Assessment Questions
        </h3>
        
        <div className="space-y-6">
          {assessment.questions?.map((question, index) => (
            <div key={question.id} className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
              <div className="flex justify-between items-start mb-4">
                <h4 className="font-semibold text-gray-900">Question {index + 1}</h4>
                <span className="bg-emerald-50 text-emerald-700 text-xs font-medium px-2 py-1 rounded">
                  {question.marks} marks
                </span>
              </div>
              <p className="text-gray-700 mb-4">{question.question}</p>
              
              {question.type === "multiple-choice" && question.options && (
                <div className="space-y-3 ml-4">
                  {question.options.map((option, optionIndex) => (
                    <div key={optionIndex} className="flex items-center">
                      <div className={`w-5 h-5 rounded-full border-2 mr-3 ${
                        question.correct_answer === option 
                          ? 'border-emerald-500 bg-emerald-500' 
                          : 'border-gray-300'
                      }`}></div>
                      <span className={`${
                        question.correct_answer === option 
                          ? 'text-emerald-700 font-medium' 
                          : 'text-gray-700'
                      }`}>
                        {option}
                        {question.correct_answer === option && ' (Correct)'}
                      </span>
                    </div>
                  ))}
                </div>
              )}
              
              {question.type === "open-ended" && (
                <div className="border-2 border-dashed border-gray-200 rounded-lg p-4 bg-gray-50">
                  <p className="text-gray-500 italic">Open-ended question - Answer area for students</p>
                </div>
              )}
              
              {question.type === "application" && (
                <div className="space-y-3">
                  <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                    <p className="text-gray-700 font-medium">Instructions:</p>
                    <p className="text-gray-600">Students should provide practical implementation or solution.</p>
                  </div>
                </div>
              )}

              {question.explanation && (
                <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-sm font-medium text-blue-800 mb-1">Explanation:</p>
                  <p className="text-sm text-blue-700">{question.explanation}</p>
                </div>
              )}
            </div>
          )) || (
            <div className="text-center py-8">
              <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No questions available</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Delete Assessment Modal Content
const DeleteAssessmentModal: React.FC<{
  assessment: Assessment;
  onConfirm: () => void;
  onCancel: () => void;
}> = ({ assessment, onConfirm, onCancel }) => {
  return (
    <div className="p-6">
      <div className="flex items-center justify-center mb-6">
        <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center">
          <Trash2 className="w-8 h-8 text-red-500" />
        </div>
      </div>
      
      <h3 className="text-xl font-bold text-center text-gray-900 mb-2">
        Delete Assessment
      </h3>
      
      <p className="text-gray-600 text-center mb-6">
        Are you sure you want to delete <span className="font-semibold">"{assessment.title}"</span>? 
        This action cannot be undone.
      </p>
      
      <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
        <button
          onClick={onCancel}
          className="px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          className="px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors font-medium"
        >
          Delete Assessment
        </button>
      </div>
    </div>
  );
};

// Create/Edit Assessment Form
const AssessmentForm: React.FC<{
  initialData?: Assessment;
  selectedCourse: string;
  selectedUnit: string;
  selectedWeek: number;
  courses: Course[];
  onSubmit: (data: any, isAI: boolean) => void;
  onCancel: () => void;
  loading: boolean;
  isEditing?: boolean;
}> = ({ 
  initialData, 
  selectedCourse, 
  selectedUnit, 
  selectedWeek, 
  courses, 
  onSubmit, 
  onCancel, 
  loading,
  isEditing = false
}) => {
  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    description: initialData?.description || "",
    type: initialData?.type || "CAT",
    questions_type: initialData?.questions_type || "close-ended",
    close_ended_type: initialData?.close_ended_type || "multiple choice with one answer",
    topic: initialData?.topic || "",
    total_marks: initialData?.total_marks || 30,
    difficulty: initialData?.difficulty || "Intermediate",
    number_of_questions: initialData?.number_of_questions || 15,
    blooms_level: initialData?.blooms_level || "Remember",
    deadline: initialData?.deadline || "",
    duration: initialData?.duration || 60
  });

  const selectedCourseData = courses.find(c => c.id === selectedCourse);
  const selectedUnitData = selectedCourseData?.units.find(u => u.id === selectedUnit);

  const handleSubmit = (isAI: boolean) => {
    const submissionData = {
      ...formData,
      course_id: selectedCourse,
      unit_id: selectedUnit,
      week: selectedWeek,
      unit_name: selectedUnitData?.name || "",
    };
    onSubmit(submissionData, isAI);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden"
    >
      <div className="bg-gradient-to-r from-emerald-50 via-emerald-100 to-emerald-50 p-6 border-b border-emerald-200">
        <h3 className="text-2xl font-bold text-gray-900 flex items-center">
          {isEditing ? (
            <>
              <Edit3 className="w-6 h-6 mr-3 text-emerald-600" />
              Edit Assessment
            </>
          ) : (
            <>
              <Sparkles className="w-6 h-6 mr-3 text-emerald-600" />
              Create New Assessment
            </>
          )}
        </h3>
        <p className="text-gray-600 mt-2">{isEditing ? "Modify assessment details" : "Generate with AI or create manually"}</p>
        
        {/* Current Context */}
        <div className="mt-6 p-4 bg-white rounded-xl border border-emerald-200 shadow-sm">
          <div className="flex flex-wrap items-center gap-4 text-sm">
            <span className="text-gray-600 font-medium">Context:</span>
            <span className="flex items-center text-emerald-700 font-semibold">
              <span className={`w-3 h-3 rounded-full mr-2 ${selectedCourseData?.color}`}></span>
              {selectedCourseData?.name}
            </span>
            <span className="text-gray-400">•</span>
            <span className="text-emerald-700 font-semibold">{selectedUnitData?.name}</span>
            <span className="text-gray-400">•</span>
            <span className="text-emerald-700 font-semibold">Week {selectedWeek}</span>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-8">
        {/* Basic Info */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-3">
              Assessment Title
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
              placeholder="Enter assessment title"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-3">
              Assessment Type
            </label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({...formData, type: e.target.value as "CAT" | "Assignment" | "Case Study"})}
              className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
            >
              <option value="CAT">CAT</option>
              <option value="Assignment">Assignment</option>
              <option value="Case Study">Case Study</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-3">
            Description
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            rows={4}
            className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
            placeholder="Describe the assessment purpose and content"
          />
        </div>

        {/* Question Configuration */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-3">
              Question Type
            </label>
            <select
              value={formData.questions_type}
              onChange={(e) => setFormData({...formData, questions_type: e.target.value as "open-ended" | "close-ended" | "application"})}
              className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
            >
              <option value="close-ended">Close-ended Questions</option>
              <option value="open-ended">Open-ended Questions</option>
              <option value="application">Application Questions</option>
            </select>
          </div>
          {formData.questions_type === "close-ended" && (
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-3">
                Close-ended Type
              </label>
              <select
                value={formData.close_ended_type}
                onChange={(e) => setFormData({...formData, close_ended_type: e.target.value})}
                className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
              >
                <option value="multiple choice with one answer">Multiple Choice (Single)</option>
                <option value="multiple choice with multiple answers">Multiple Choice (Multiple)</option>
                <option value="true/false">True/False</option>
                <option value="matching">Matching</option>
              </select>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-3">
              Topic
            </label>
            <input
              type="text"
              value={formData.topic}
              onChange={(e) => setFormData({...formData, topic: e.target.value})}
              className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
              placeholder="Main topic or subject area"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-3">
              Difficulty Level
            </label>
            <select
              value={formData.difficulty}
              onChange={(e) => setFormData({...formData, difficulty: e.target.value as "Easy" | "Intermediate" | "Advanced"})}
              className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
            >
              <option value="Easy">Easy</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-3">
              Number of Questions
            </label>
            <input
              type="number"
              value={formData.number_of_questions}
              onChange={(e) => setFormData({...formData, number_of_questions: parseInt(e.target.value)})}
              className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
              min="1"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-3">
              Total Marks
            </label>
            <input
              type="number"
              value={formData.total_marks}
              onChange={(e) => setFormData({...formData, total_marks: parseInt(e.target.value)})}
              className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
              min="1"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-3">
              Bloom's Level
            </label>
            <select
              value={formData.blooms_level}
              onChange={(e) => setFormData({...formData, blooms_level: e.target.value as "Remember" | "Understand" | "Apply" | "Analyze" | "Evaluate" | "Create"})}
              className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
            >
              <option value="Remember">Remember</option>
              <option value="Understand">Understand</option>
              <option value="Apply">Apply</option>
              <option value="Analyze">Analyze</option>
              <option value="Evaluate">Evaluate</option>
              <option value="Create">Create</option>
            </select>
          </div>
        </div>

        {/* Optional Fields */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-3">
              Deadline (Optional)
            </label>
            <input
              type="date"
              value={formData.deadline}
              onChange={(e) => setFormData({...formData, deadline: e.target.value})}
              className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-3">
              Duration (minutes)
            </label>
            <input
              type="number"
              value={formData.duration}
              onChange={(e) => setFormData({...formData, duration: parseInt(e.target.value)})}
              className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
              placeholder="e.g., 60"
              min="1"
            />
          </div>
        </div>
      </div>

      <div className="bg-gray-50 px-6 py-6 flex flex-col sm:flex-row justify-between gap-4">
        <button
          onClick={onCancel}
          className="px-6 py-3 text-gray-600 hover:text-gray-800 font-semibold transition-colors rounded-xl hover:bg-gray-100"
          disabled={loading}
        >
          Cancel
        </button>
        <div className="flex flex-col sm:flex-row gap-3">
          {!isEditing && (
            <button
              onClick={() => handleSubmit(true)}
              disabled={loading}
              className="flex items-center justify-center px-6 py-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors font-semibold shadow-lg"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              ) : (
                <Wand2 className="w-5 h-5 mr-2" />
              )}
              Generate with AI
            </button>
          )}
          <button
            onClick={() => handleSubmit(false)}
            disabled={loading}
            className="flex items-center justify-center px-6 py-3 bg-white border border-emerald-200 text-emerald-700 rounded-xl hover:bg-emerald-50 transition-colors font-semibold shadow-sm"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            ) : isEditing ? (
              <Check className="w-5 h-5 mr-2" />
            ) : (
              <User className="w-5 h-5 mr-2" />
            )}
            {isEditing ? "Save Changes" : "Create Manually"}
          </button>
        </div>
      </div>
    </motion.div>
  );
};

const CreateAssessmentForm: React.FC<{
  selectedCourse: string;
  selectedUnit: string;
  selectedWeek: number;
  courses: Course[];
  onSubmit: (data: any, isAI: boolean) => void;
  onCancel: () => void;
  loading: boolean;
}> = (props) => {
  return <AssessmentForm {...props} />;
};

const AssessmentCard: React.FC<{
  assessment: Assessment;
  courses: Course[];
  onEdit: (assessment: Assessment) => void;
  onDelete: (assessment: Assessment) => void;
  onView: (assessment: Assessment) => void;
  onVerify: (id: string) => void;
  index: number;
}> = ({ assessment, courses, onEdit, onDelete, onView, onVerify, index }) => {
  const course = courses.find(c => c.id === assessment.course_id);
  const unit = course?.units.find(u => u.id === assessment.unit_id);
  const bloomsInfo = getBlooms(assessment.blooms_level);
  const BloomsIcon = bloomsInfo.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="bg-white rounded-2xl shadow border border-gray-100 hover:shadow-lg transition-all duration-300 overflow-hidden group"
    >
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-emerald-700 transition-colors">
              {assessment.title}
            </h3>
            <div className="flex flex-wrap items-center gap-2 mb-3">
              {course && (
                <div className="flex items-center">
                  <span className={`w-2.5 h-2.5 rounded-full mr-1.5 ${course.color}`}></span>
                  <span className="text-xs font-medium text-gray-600">{course.name}</span>
                </div>
              )}
              <span className="text-gray-300 text-xs">•</span>
              <span className="text-xs font-medium text-gray-600">{unit?.name}</span>
              <span className="text-gray-300 text-xs">•</span>
              <span className="text-xs font-medium text-gray-600 flex items-center">
                <Calendar className="w-3 h-3 mr-1" />
                Week {assessment.week}
              </span>
            </div>
          </div>
          <div className="flex items-center">
            {assessment.verified ? (
              <div className="flex items-center text-green-600 bg-green-50 px-2 py-1 rounded-full">
                <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                <span className="text-xs font-bold">Verified</span>
              </div>
            ) : (
              <div className="flex items-center text-yellow-600 bg-yellow-50 px-2 py-1 rounded-full">
                <AlertCircle className="w-3.5 h-3.5 mr-1" />
                <span className="text-xs font-bold">Pending</span>
              </div>
            )}
          </div>
        </div>

        {/* Description */}
        <p className="text-gray-600 mb-4 line-clamp-2 leading-relaxed text-sm">{assessment.description}</p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${getTypeColor(assessment.type)}`}>
            {assessment.type}
          </span>
          <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${getDifficultyColor(assessment.difficulty)}`}>
            {assessment.difficulty}
          </span>
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            {assessment.questions_type === 'application' ? 'Application' : 
             assessment.questions_type === 'open-ended' ? 'Open-ended' : 'Close-ended'}
          </span>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-4 p-3 bg-gradient-to-r from-gray-50 to-white rounded-xl border border-gray-100">
          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <ClipboardList className="w-4 h-4 text-gray-500" />
            </div>
            <div className="text-base font-bold text-gray-900">{assessment.number_of_questions}</div>
            <div className="text-xs font-medium text-gray-500">Questions</div>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <Award className="w-4 h-4 text-gray-500" />
            </div>
            <div className="text-base font-bold text-gray-900">{assessment.total_marks}</div>
            <div className="text-xs font-medium text-gray-500">Marks</div>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <div className={`p-1 rounded-md ${bloomsInfo.bg}`}>
                <BloomsIcon className={`w-3 h-3 ${bloomsInfo.color}`} />
              </div>
            </div>
            <div className="text-base font-bold text-gray-900">{assessment.blooms_level.slice(0, 3)}</div>
            <div className="text-xs font-medium text-gray-500">Bloom's</div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <span className="text-xs font-medium text-gray-500 flex items-center">
            <Clock className="w-3.5 h-3.5 mr-1" />
            {formatDate(assessment.created_at)}
          </span>
          <div className="flex space-x-1">
            <button
              onClick={() => onView(assessment)}
              className="flex items-center p-1.5 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
            >
              <Eye className="w-4 h-4" />
            </button>
            <button
              onClick={() => onEdit(assessment)}
              className="flex items-center p-1.5 text-sm font-medium text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors"
            >
              <Edit className="w-4 h-4" />
            </button>
            {!assessment.verified && (
              <button
                onClick={() => onVerify(assessment.id)}
                className="flex items-center p-1.5 text-sm font-medium text-green-600 hover:text-green-700 hover:bg-green-50 rounded-lg transition-colors"
              >
                <CheckCircle className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={() => onDelete(assessment)}
              className="flex items-center p-1.5 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
            >
              <Trash className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const StatsCards: React.FC<{ assessments: Assessment[] }> = ({ assessments }) => {
  const stats = [
    {
      icon: BookMarked,
      label: "Total Assessments",
      value: assessments.length,
      color: "text-blue-600",
      bg: "bg-blue-50",
      border: "border-blue-200",
      gradient: "from-blue-50 to-blue-100"
    },
    {
      icon: ClipboardList,
      label: "CATs",
      value: assessments.filter(a => a.type === "CAT").length,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
      border: "border-emerald-200",
      gradient: "from-emerald-50 to-emerald-100"
    },
    {
      icon: FileCheck,
      label: "Assignments", 
      value: assessments.filter(a => a.type === "Assignment").length,
      color: "text-purple-600",
      bg: "bg-purple-50",
      border: "border-purple-200",
      gradient: "from-purple-50 to-purple-100"
    },
    {
      icon: CheckCircle,
      label: "Verified",
      value: assessments.filter(a => a.verified).length,
      color: "text-green-600",
      bg: "bg-green-50",
      border: "border-green-200",
      gradient: "from-green-50 to-green-100"
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {stats.map((stat, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className={`bg-gradient-to-br ${stat.gradient} rounded-xl shadow border ${stat.border} p-4 hover:shadow-md transition-all`}
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</div>
              <div className="text-sm font-semibold text-gray-600">{stat.label}</div>
            </div>
            <div className={`p-3 rounded-xl ${stat.bg} shadow-sm`}>
              <stat.icon className={`w-6 h-6 ${stat.color}`} />
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

const MessageNotification: React.FC<{
  message: { type: 'success' | 'error' | 'info', text: string } | null;
}> = ({ message }) => {
  if (!message) return null;

  const getMessageStyles = () => {
    switch (message.type) {
      case 'success':
        return 'bg-green-50 border-green-200 text-green-800';
      case 'error':
        return 'bg-red-50 border-red-200 text-red-800';
      case 'info':
        return 'bg-blue-50 border-blue-200 text-blue-800';
      default:
        return 'bg-gray-50 border-gray-200 text-gray-800';
    }
  };

  const getIcon = () => {
    switch (message.type) {
      case 'success':
        return <CheckCircle2 className="w-5 h-5 mr-3" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 mr-3" />;
      case 'info':
        return <Info className="w-5 h-5 mr-3" />;
      default:
        return <Info className="w-5 h-5 mr-3" />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={`mb-6 p-4 rounded-xl border ${getMessageStyles()} shadow-sm`}
    >
      <div className="flex items-center font-semibold">
        {getIcon()}
        {message.text}
      </div>
    </motion.div>
  );
};

// ===== MAIN COMPONENT =====
const AssessmentsDashboard: React.FC = () => {
  const { sidebarCollapsed, isMobileView, isTabletView } = useLayout();
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedUnit, setSelectedUnit] = useState("");
  const [selectedWeek, setSelectedWeek] = useState(0);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isAccessMinimized, setIsAccessMinimized] = useState(false);
  const [assessments, setAssessments] = useState<Assessment[]>(dummyAssessments);
  const [message, setMessage] = useState<{ type: 'success' | 'error' | 'info', text: string } | null>(null);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  
  // Modal states
  const [viewingAssessment, setViewingAssessment] = useState<Assessment | null>(null);
  const [editingAssessment, setEditingAssessment] = useState<Assessment | null>(null);
  const [deletingAssessment, setDeletingAssessment] = useState<Assessment | null>(null);

  // Auto-minimize side panel on mobile
  useEffect(() => {
    if (isMobileView) {
      setIsAccessMinimized(true);
    }
  }, [isMobileView]);

  // Get filtered assessments based on selections
  const filteredAssessments = assessments.filter(assessment => {
    if (!selectedCourse || !selectedUnit || selectedWeek === 0) return false;
    return assessment.course_id === selectedCourse && 
           assessment.unit_id === selectedUnit && 
           assessment.week === selectedWeek;
  });

  // Get breadcrumb items
  const getBreadcrumbItems = () => {
    const items = [
      { label: "Assessments", icon: BookMarked, href: "#" }
    ];

    if (selectedCourse) {
      const course = dummyCourses.find(c => c.id === selectedCourse);
      if (course) {
        items.push({ label: course.name, icon: GraduationCap, href: "#" });
        
        if (selectedUnit) {
          const unit = course.units.find(u => u.id === selectedUnit);
          if (unit) {
            items.push({ label: unit.name, icon: BookOpen, href: "#" });
            
            if (selectedWeek > 0) {
              items.push({ label: `Week ${selectedWeek}`, icon: Calendar, href: "#" });
            }
          }
        }
      }
    }

    return items;
  };

  const showMessage = (type: 'success' | 'error' | 'info', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 5000);
  };

  const handleCreateAssessment = async (data: any, isAI: boolean) => {
    setLoading(true);
    try {
      // Simulate API call with longer delay for AI generation
      await new Promise(resolve => setTimeout(resolve, isAI ? 4000 : 2000));
      
      const newAssessment: Assessment = {
        ...data,
        id: Date.now().toString(),
        verified: false,
        created_at: new Date().toISOString(),
        creator_id: "lecturer1",
        questions: isAI ? dummyQuestions : [] // Add dummy questions for AI generation
      };
      
      setAssessments(prev => [...prev, newAssessment]);
      setShowCreateForm(false);
      showMessage('success', `Assessment "${data.title}" ${isAI ? 'generated' : 'created'} successfully!`);
    } catch (error) {
      showMessage('error', 'Failed to create assessment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateAssessment = async (data: any) => {
    if (!editingAssessment) return;
    
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const updatedAssessment = {
        ...editingAssessment,
        ...data,
        course_id: selectedCourse,
        unit_id: selectedUnit,
        week: selectedWeek
      };
      
      setAssessments(prev => 
        prev.map(a => a.id === editingAssessment.id ? updatedAssessment : a)
      );
      
      setEditingAssessment(null);
      showMessage('success', `Assessment "${data.title}" updated successfully!`);
    } catch (error) {
      showMessage('error', 'Failed to update assessment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAssessment = async () => {
    if (!deletingAssessment) return;
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setAssessments(prev => prev.filter(a => a.id !== deletingAssessment.id));
      showMessage('success', `Assessment "${deletingAssessment.title}" deleted successfully!`);
      setDeletingAssessment(null);
    } catch (error) {
      showMessage('error', 'Failed to delete assessment. Please try again.');
    }
  };

  const handleVerifyAssessment = async (id: string) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setAssessments(prev => 
        prev.map(a => a.id === id ? { ...a, verified: true } : a)
      );
      
      showMessage('success', 'Assessment verified successfully!');
    } catch (error) {
      showMessage('error', 'Failed to verify assessment. Please try again.');
    }
  };

  const canCreateAssessment = selectedCourse && selectedUnit && selectedWeek > 0;

  // Calculate sidebar width for proper positioning
  const getSidebarWidth = () => {
    if (isMobileView || isTabletView) return 0;
    return sidebarCollapsed ? 80 : 240;
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <Sidebar />
      
      {/* AI Loading Modal */}
      <AILoadingModal isOpen={loading} />
      
      <div 
        className="flex flex-1 transition-all duration-300"
        style={{
          marginLeft: getSidebarWidth()
        }}
      >
        {/* Mobile Nav */}
        <MobileNav
          open={mobileNavOpen}
          onClose={() => setMobileNavOpen(false)}
          selectedCourse={selectedCourse}
          selectedUnit={selectedUnit}
          selectedWeek={selectedWeek}
          onCourseSelect={setSelectedCourse}
          onUnitSelect={setSelectedUnit}
          onWeekSelect={setSelectedWeek}
          courses={dummyCourses}
        />
        
        {/* Desktop Side Panel */}
        <SideAccessPanel
          selectedCourse={selectedCourse}
          selectedUnit={selectedUnit}
          selectedWeek={selectedWeek}
          onCourseSelect={setSelectedCourse}
          onUnitSelect={setSelectedUnit}
          onWeekSelect={setSelectedWeek}
          courses={dummyCourses}
          isMinimized={isAccessMinimized}
          onToggleMinimize={() => setIsAccessMinimized(!isAccessMinimized)}
        />

        <div className="flex-1 overflow-auto">
          <Header title="Assessments" showWeekSelector={false} />

          <main className="p-4 lg:p-6">
            {/* Mobile Filter Button */}
            <div className="flex justify-between items-center mb-4 md:hidden">
              <h1 className="text-xl font-bold text-gray-900">Assessments</h1>
              <button
                onClick={() => setMobileNavOpen(true)}
                className="p-2 bg-white border border-gray-200 rounded-lg shadow-sm text-emerald-600"
              >
                <Filter className="w-5 h-5" />
              </button>
            </div>
            
            {/* Breadcrumb */}
            <Breadcrumb items={getBreadcrumbItems()} />

            {/* Message */}
            <AnimatePresence>
              <MessageNotification message={message} />
            </AnimatePresence>

            <div className="max-w-7xl mx-auto">
              <div className="mb-6 lg:mb-8">
                <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">Assessment Management</h1>
                <p className="text-base lg:text-lg text-gray-600">Create, manage, and organize your assessments with AI assistance</p>
              </div>

              {!canCreateAssessment ? (
                <div className="text-center py-12 lg:py-16">
                  <div className="max-w-md mx-auto">
                    <div className="w-20 h-20 lg:w-24 lg:h-24 bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                      <Settings className="w-10 h-10 lg:w-12 lg:h-12 text-emerald-600" />
                    </div>
                    <h3 className="text-xl lg:text-2xl font-bold text-gray-900 mb-3">Get Started</h3>
                    <p className="text-base lg:text-lg text-gray-600 mb-6">
                      Select a course, unit, and week to view and create assessments
                    </p>
                    <div className="space-y-3 text-sm text-gray-500">
                      <div className="flex items-center justify-center p-3 bg-white rounded-xl shadow-sm border border-gray-200">
                        <span className="mr-3 w-6 h-6 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center font-bold">1</span>
                        <GraduationCap className="w-4 h-4 mr-2 text-emerald-600" />
                        <span className="font-semibold">Choose a course</span>
                      </div>
                      <div className="flex items-center justify-center p-3 bg-white rounded-xl shadow-sm border border-gray-200">
                        <span className="mr-3 w-6 h-6 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center font-bold">2</span>
                        <BookOpen className="w-4 h-4 mr-2 text-emerald-600" />
                        <span className="font-semibold">Select a unit</span>
                      </div>
                      <div className="flex items-center justify-center p-3 bg-white rounded-xl shadow-sm border border-gray-200">
                        <span className="mr-3 w-6 h-6 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center font-bold">3</span>
                        <Calendar className="w-4 h-4 mr-2 text-emerald-600" />
                        <span className="font-semibold">Pick a week</span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  {/* Creation Form State - Hide everything else when creating */}
                  {showCreateForm ? (
                    <div className="mb-6">
                      <CreateAssessmentForm
                        selectedCourse={selectedCourse}
                        selectedUnit={selectedUnit}
                        selectedWeek={selectedWeek}
                        courses={dummyCourses}
                        onSubmit={handleCreateAssessment}
                        onCancel={() => setShowCreateForm(false)}
                        loading={loading}
                      />
                    </div>
                  ) : (
                    <>
                      <StatsCards assessments={filteredAssessments} />

                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
                        <div>
                          <h2 className="text-xl lg:text-2xl font-bold text-gray-900">
                            Assessments for Week {selectedWeek}
                          </h2>
                          <p className="text-base text-gray-600 mt-1">
                            {filteredAssessments.length} assessment{filteredAssessments.length !== 1 ? 's' : ''} found
                          </p>
                        </div>
                        <button
                          onClick={() => setShowCreateForm(true)}
                          className="flex items-center px-5 py-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors font-bold shadow-lg"
                        >
                          <Plus className="w-5 h-5 mr-2" />
                          Create Assessment
                        </button>
                      </div>

                      {filteredAssessments.length === 0 ? (
                        <div className="text-center py-12 lg:py-16 bg-white rounded-xl border border-gray-200 shadow">
                          <BookMarked className="w-16 h-16 lg:w-20 lg:h-20 text-gray-300 mx-auto mb-5" />
                          <h3 className="text-xl font-bold text-gray-600 mb-3">No assessments yet</h3>
                          <p className="text-base text-gray-500 mb-6">
                            Create your first assessment for this week to get started
                          </p>
                          <button
                            onClick={() => setShowCreateForm(true)}
                            className="flex items-center px-6 py-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors font-bold mx-auto shadow"
                          >
                            <Plus className="w-5 h-5 mr-2" />
                            Create First Assessment
                          </button>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                          {filteredAssessments.map((assessment, index) => (
                            <AssessmentCard
                              key={assessment.id}
                              assessment={assessment}
                              courses={dummyCourses}
                              onEdit={setEditingAssessment}
                              onDelete={setDeletingAssessment}
                              onView={setViewingAssessment}
                              onVerify={handleVerifyAssessment}
                              index={index}
                            />
                          ))}
                        </div>
                      )}
                    </>
                  )}
                </>
              )}
            </div>
          </main>
          
          {/* Decorative Footer */}
          <div className="h-24 relative overflow-hidden">
          </div>
        </div>
      </div>
      
      {/* View Assessment Modal */}
      <Modal
        isOpen={viewingAssessment !== null}
        onClose={() => setViewingAssessment(null)}
        title="Assessment Details"
        maxWidth="max-w-5xl"
      >
        {viewingAssessment && (
          <ViewAssessmentModal 
            assessment={viewingAssessment} 
            courses={dummyCourses}
            onVerify={handleVerifyAssessment}
          />
        )}
      </Modal>
      
      {/* Edit Assessment Modal */}
      <Modal
        isOpen={editingAssessment !== null}
        onClose={() => setEditingAssessment(null)}
        title="Edit Assessment"
        maxWidth="max-w-6xl"
      >
        {editingAssessment && (
          <EditAssessmentModal
            assessment={editingAssessment}
            courses={dummyCourses}
            onUpdate={handleUpdateAssessment}
            onCancel={() => setEditingAssessment(null)}
            loading={loading}
          />
        )}
      </Modal>
      
      {/* Delete Assessment Modal */}
      <Modal
        isOpen={deletingAssessment !== null}
        onClose={() => setDeletingAssessment(null)}
        title="Delete Assessment"
        maxWidth="max-w-md"
      >
        {deletingAssessment && (
          <DeleteAssessmentModal
            assessment={deletingAssessment}
            onConfirm={handleDeleteAssessment}
            onCancel={() => setDeletingAssessment(null)}
          />
        )}
      </Modal>
    </div>
  );
};

export default AssessmentsDashboard;