'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useLayout } from '@/components/LayoutController';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import EmptyState from '@/components/EmptyState';
import { 
  GraduationCap, 
  TrendingUp, 
  Award,
  BookOpen,
  BarChart3,
  Target,
  Calendar,
  Download
} from 'lucide-react';

// Mock data
const mockGrades = [
  {
    id: 1,
    course: 'Computer Science 301',
    courseName: 'Database Systems',
    credits: 3,
    assignments: [
      { name: 'Assignment 1', score: 85, maxScore: 100, weight: 20 },
      { name: 'Assignment 2', score: 92, maxScore: 100, weight: 20 },
    ],
    cats: [
      { name: 'CAT 1', score: 87, maxScore: 100, weight: 15 },
      { name: 'CAT 2', score: 90, maxScore: 100, weight: 15 },
    ],
    finalExam: { score: 88, maxScore: 100, weight: 30 },
    currentGrade: 'A-',
    gpa: 3.7,
    percentage: 88.5
  },
  {
    id: 2,
    course: 'Mathematics 202',
    courseName: 'Statistics & Probability',
    credits: 4,
    assignments: [
      { name: 'Problem Set 1', score: 78, maxScore: 100, weight: 25 },
      { name: 'Problem Set 2', score: 82, maxScore: 100, weight: 25 },
    ],
    cats: [
      { name: 'CAT 1', score: 92, maxScore: 100, weight: 20 },
      { name: 'CAT 2', score: 88, maxScore: 100, weight: 20 },
    ],
    finalExam: { score: 85, maxScore: 100, weight: 10 },
    currentGrade: 'B+',
    gpa: 3.3,
    percentage: 84.2
  },
  {
    id: 3,
    course: 'Computer Science 302',
    courseName: 'Algorithms & Data Structures',
    credits: 3,
    assignments: [
      { name: 'Coding Assignment 1', score: 95, maxScore: 100, weight: 30 },
      { name: 'Coding Assignment 2', score: 90, maxScore: 100, weight: 30 },
    ],
    cats: [
      { name: 'CAT 1', score: 94, maxScore: 100, weight: 20 },
    ],
    finalExam: null,
    currentGrade: 'A',
    gpa: 4.0,
    percentage: 92.8
  }
];

export default function GradesPage() {
  const { sidebarCollapsed, isMobileView, isTabletView } = useLayout();
  const [hasContent] = useState(mockGrades.length > 0);
  const [selectedCourse, setSelectedCourse] = useState<number | null>(null);

  const overallGPA = mockGrades.reduce((acc, grade) => acc + grade.gpa, 0) / mockGrades.length;
  const totalCredits = mockGrades.reduce((acc, grade) => acc + grade.credits, 0);

  const getGradeColor = (grade: string) => {
    if (grade.startsWith('A')) return 'text-green-600 bg-green-50';
    if (grade.startsWith('B')) return 'text-blue-600 bg-blue-50';
    if (grade.startsWith('C')) return 'text-yellow-600 bg-yellow-50';
    if (grade.startsWith('D')) return 'text-orange-600 bg-orange-50';
    return 'text-red-600 bg-red-50';
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
        <Header title="Grades" showWeekSelector={hasContent} />
        
        <main className="p-4 md:p-6">
          {!hasContent ? (
            <div className="max-w-4xl mx-auto">
              <EmptyState
                title="No Grades Available"
                description="Your grades and academic performance will be displayed here once your lecturers input them. Check back after assessments are graded."
                icon={<GraduationCap size={48} />}
              />
            </div>
          ) : (
            <div className="max-w-6xl mx-auto">
              {/* Academic Overview */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Overall GPA</p>
                      <p className="text-2xl font-bold text-blue-600">{overallGPA.toFixed(2)}</p>
                    </div>
                    <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                      <Award size={24} className="text-blue-600" />
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
                      <p className="text-sm font-medium text-gray-600">Total Credits</p>
                      <p className="text-2xl font-bold text-green-600">{totalCredits}</p>
                    </div>
                    <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
                      <BookOpen size={24} className="text-green-600" />
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
                      <p className="text-2xl font-bold text-purple-600">{mockGrades.length}</p>
                    </div>
                    <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center">
                      <Target size={24} className="text-purple-600" />
                    </div>
                  </div>
                </motion.div>

                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Average</p>
                      <p className="text-2xl font-bold text-indigo-600">
                        {(mockGrades.reduce((acc, grade) => acc + grade.percentage, 0) / mockGrades.length).toFixed(1)}%
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-indigo-50 rounded-lg flex items-center justify-center">
                      <TrendingUp size={24} className="text-indigo-600" />
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Course Grades */}
              <div className="space-y-4">
                {mockGrades.map((course, index) => (
                  <motion.div
                    key={course.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
                  >
                    <div 
                      className="p-6 cursor-pointer hover:bg-gray-50 transition-colors"
                      onClick={() => setSelectedCourse(selectedCourse === course.id ? null : course.id)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center mb-2">
                            <h3 className="text-lg font-semibold text-gray-900 mr-3">{course.courseName}</h3>
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getGradeColor(course.currentGrade)}`}>
                              {course.currentGrade}
                            </span>
                          </div>
                          
                          <p className="text-sm text-gray-600 mb-2">{course.course} • {course.credits} Credits</p>
                          
                          <div className="flex items-center space-x-6 text-sm text-gray-500">
                            <div className="flex items-center">
                              <BarChart3 size={16} className="mr-1" />
                              <span>GPA: {course.gpa}</span>
                            </div>
                            <div className="flex items-center">
                              <Target size={16} className="mr-1" />
                              <span>{course.percentage}%</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center space-x-4">
                          <div className="text-right">
                            <div className="text-2xl font-bold text-blue-600">{course.percentage}%</div>
                            <div className="text-xs text-gray-500">Overall</div>
                          </div>
                          <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                            <Download size={18} />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Expanded Details */}
                    {selectedCourse === course.id && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="border-t border-gray-200 p-6 bg-gray-50"
                      >
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          {/* Assignments */}
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-3">Assignments</h4>
                            <div className="space-y-2">
                              {course.assignments.map((assignment, idx) => (
                                <div key={idx} className="flex justify-between items-center p-3 bg-white rounded-lg">
                                  <div>
                                    <p className="text-sm font-medium text-gray-900">{assignment.name}</p>
                                    <p className="text-xs text-gray-500">{assignment.weight}% weight</p>
                                  </div>
                                  <div className="text-right">
                                    <p className="text-sm font-semibold text-blue-600">
                                      {assignment.score}/{assignment.maxScore}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                      {Math.round((assignment.score / assignment.maxScore) * 100)}%
                                    </p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* CATs */}
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-3">CATs</h4>
                            <div className="space-y-2">
                              {course.cats.map((cat, idx) => (
                                <div key={idx} className="flex justify-between items-center p-3 bg-white rounded-lg">
                                  <div>
                                    <p className="text-sm font-medium text-gray-900">{cat.name}</p>
                                    <p className="text-xs text-gray-500">{cat.weight}% weight</p>
                                  </div>
                                  <div className="text-right">
                                    <p className="text-sm font-semibold text-green-600">
                                      {cat.score}/{cat.maxScore}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                      {Math.round((cat.score / cat.maxScore) * 100)}%
                                    </p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Final Exam */}
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-3">Final Exam</h4>
                            {course.finalExam ? (
                              <div className="p-3 bg-white rounded-lg">
                                <div className="flex justify-between items-center">
                                  <div>
                                    <p className="text-sm font-medium text-gray-900">Final Exam</p>
                                    <p className="text-xs text-gray-500">{course.finalExam.weight}% weight</p>
                                  </div>
                                  <div className="text-right">
                                    <p className="text-sm font-semibold text-purple-600">
                                      {course.finalExam.score}/{course.finalExam.maxScore}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                      {Math.round((course.finalExam.score / course.finalExam.maxScore) * 100)}%
                                    </p>
                                  </div>
                                </div>
                              </div>
                            ) : (
                              <div className="p-3 bg-white rounded-lg text-center">
                                <p className="text-sm text-gray-500">Not yet taken</p>
                              </div>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </main>
      </motion.div>
    </div>
  );
}