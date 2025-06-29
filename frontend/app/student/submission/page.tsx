'use client';

import { useState, useEffect } from 'react';
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
  Download,
  ChevronDown,
  ChevronUp,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
  Info,
  FileText
} from 'lucide-react';

// Mock data
const mockSubmissions = [
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
    percentage: 88.5,
    lastSemesterGrade: 'B+',
    trend: 'up',
    feedback: 'Your database design skills have improved significantly. Your SQL queries are well-optimized, and your understanding of normalization principles is excellent. To improve further, focus on advanced indexing strategies and query optimization techniques.'
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
    percentage: 84.2,
    lastSemesterGrade: 'B',
    trend: 'up',
    feedback: 'You have a solid grasp of probability concepts and statistical analysis. Your work with hypothesis testing is particularly strong. To reach an A grade, focus on improving your understanding of multivariate analysis and advanced statistical methods.'
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
    percentage: 92.8,
    lastSemesterGrade: 'A',
    trend: 'stable',
    feedback: 'Excellent work throughout the course. Your algorithm implementations are efficient and well-documented. Your problem-solving approach is methodical and your time complexity analyses are spot on. Continue exploring advanced algorithms to maintain your strong performance.'
  },
  {
    id: 4,
    course: 'Computer Science 305',
    courseName: 'Operating Systems',
    credits: 3,
    assignments: [
      { name: 'OS Concepts Paper', score: 75, maxScore: 100, weight: 25 },
      { name: 'Scheduler Implementation', score: 80, maxScore: 100, weight: 25 },
    ],
    cats: [
      { name: 'CAT 1', score: 78, maxScore: 100, weight: 25 },
    ],
    finalExam: null,
    currentGrade: 'B',
    gpa: 3.0,
    percentage: 77.5,
    lastSemesterGrade: 'A-',
    trend: 'down',
    feedback: 'While you demonstrate good understanding of operating system concepts, there are gaps in your knowledge of memory management and process scheduling. Your implementation assignments could benefit from more thorough testing. Focus on the practical aspects of OS design to improve your grade.'
  }
];

export default function SubmissionPage() {
  const { sidebarCollapsed, isMobileView, isTabletView } = useLayout();
  const [loading, setLoading] = useState(true);
  const [hasContent, setHasContent] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<number | null>(null);
  const [expanded, setExpanded] = useState<number[]>([]);

  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setLoading(false);
      setHasContent(mockSubmissions.length > 0);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);

  const toggleExpanded = (id: number) => {
    setExpanded(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const overallGPA = mockSubmissions.reduce((acc, submission) => acc + submission.gpa, 0) / mockSubmissions.length;
  const totalCredits = mockSubmissions.reduce((acc, submission) => acc + submission.credits, 0);
  
  const getGradeColor = (grade: string) => {
    if (grade.startsWith('A')) return 'text-green-600 bg-green-50';
    if (grade.startsWith('B')) return 'text-blue-600 bg-blue-50';
    if (grade.startsWith('C')) return 'text-yellow-600 bg-yellow-50';
    if (grade.startsWith('D')) return 'text-orange-600 bg-orange-50';
    return 'text-red-600 bg-red-50';
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <ArrowUpRight size={16} className="text-green-600" />;
      case 'down': return <ArrowDownRight size={16} className="text-red-600" />;
      case 'stable': return <TrendingUp size={16} className="text-blue-600" />;
      default: return null;
    }
  };

  if (loading) {
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
          <Header title="Submission" showWeekSelector={false} />
          
          <main className="p-4 md:p-6">
            <div className="max-w-6xl mx-auto">
              {/* Skeleton Loading */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 animate-pulse">
                    <div className="flex items-center justify-between">
                      <div className="w-2/3">
                        <div className="h-4 bg-gray-200 rounded mb-2"></div>
                        <div className="h-6 bg-gray-300 rounded"></div>
                      </div>
                      <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 animate-pulse">
                    <div className="flex items-start justify-between">
                      <div className="w-2/3">
                        <div className="h-5 bg-gray-300 rounded mb-2"></div>
                        <div className="h-4 bg-gray-200 rounded mb-3"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/2 mb-3"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                      </div>
                      <div className="w-1/4">
                        <div className="h-10 bg-gray-200 rounded mb-2"></div>
                        <div className="h-6 bg-gray-300 rounded"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </main>
        </motion.div>
      </div>
    );
  }

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
        <Header title="Submission" showWeekSelector={hasContent} />
        
        <main className="p-4 md:p-6">
          {!hasContent ? (
            <div className="max-w-4xl mx-auto">
              <EmptyState
                title="No Submissions Available"
                description="Your submissions and coursework will be displayed here once your lecturers input them. Check back after assessments are graded."
                icon={<FileText size={48} />}
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
                  
                  <div className="mt-2 text-xs text-gray-500">
                    {overallGPA >= 3.5 ? 'Excellent standing' : overallGPA >= 3.0 ? 'Good standing' : 'Needs improvement'}
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
                  
                  <div className="mt-2 text-xs text-gray-500">
                    {totalCredits >= 12 ? 'Full-time student' : 'Part-time student'}
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
                      <p className="text-2xl font-bold text-purple-600">{mockSubmissions.length}</p>
                    </div>
                    <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center">
                      <Target size={24} className="text-purple-600" />
                    </div>
                  </div>
                  
                  <div className="mt-2 text-xs text-gray-500">
                    {mockSubmissions.filter(s => s.currentGrade.startsWith('A')).length} courses with A grades
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
                        {(mockSubmissions.reduce((acc, submission) => acc + submission.percentage, 0) / mockSubmissions.length).toFixed(1)}%
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-indigo-50 rounded-lg flex items-center justify-center">
                      <TrendingUp size={24} className="text-indigo-600" />
                    </div>
                  </div>
                  
                  <div className="mt-2 text-xs text-gray-500">
                    Top course: {mockSubmissions.reduce((max, submission) => submission.percentage > max.percentage ? submission : max).courseName}
                  </div>
                </motion.div>
              </div>

              {/* Academic Performance Card */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Performance Insights</h3>
                  <div className="flex items-center">
                    <Sparkles size={16} className="text-yellow-500 mr-1" />
                    <span className="text-sm text-gray-600">AI-Generated</span>
                  </div>
                </div>
                
                <div className="p-4 bg-blue-50 rounded-lg text-blue-800 text-sm">
                  <p className="mb-2">
                    <strong>Academic Strengths:</strong> Your performance in Computer Science courses is excellent, particularly in Algorithms & Data Structures where you've maintained an A grade.
                  </p>
                  <p className="mb-2">
                    <strong>Areas for Improvement:</strong> Operating Systems shows a downward trend from A- to B. Consider allocating more study time to this subject.
                  </p>
                  <p>
                    <strong>Recommendation:</strong> To maintain your strong GPA of {overallGPA.toFixed(2)}, focus on improving your performance in Operating Systems while maintaining your excellent work in Algorithms & Data Structures.
                  </p>
                </div>
              </motion.div>

              {/* Course Submissions */}
              <div className="space-y-4">
                {mockSubmissions.map((course, index) => (
                  <motion.div
                    key={course.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
                  >
                    <div 
                      className="p-6 cursor-pointer hover:bg-gray-50 transition-colors"
                      onClick={() => toggleExpanded(course.id)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center mb-2">
                            <h3 className="text-lg font-semibold text-gray-900 mr-3">{course.courseName}</h3>
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getGradeColor(course.currentGrade)}`}>
                              {course.currentGrade}
                            </span>
                            
                            <div className="ml-3 flex items-center">
                              {getTrendIcon(course.trend)}
                              <span className="text-xs ml-1">
                                {course.trend === 'up' ? 'Improved from ' : 
                                 course.trend === 'down' ? 'Decreased from ' : 
                                 'Maintained '}
                                {course.lastSemesterGrade}
                              </span>
                            </div>
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
                          {expanded.includes(course.id) ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                        </div>
                      </div>
                    </div>

                    {/* Expanded Details */}
                    {expanded.includes(course.id) && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="border-t border-gray-200 p-6 bg-gray-50"
                      >
                        {/* AI-Generated Feedback */}
                        {course.feedback && (
                          <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                            <div className="flex items-center mb-2">
                              <Sparkles size={16} className="text-yellow-500 mr-2" />
                              <h4 className="font-semibold text-gray-900">Personalized Feedback</h4>
                            </div>
                            <p className="text-sm text-blue-800">{course.feedback}</p>
                          </div>
                        )}
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          {/* Assignments */}
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-3">
                              Assignments 
                              <span className="text-sm font-normal text-gray-500 ml-2">
                                ({course.assignments.reduce((acc, assignment) => acc + assignment.weight, 0)}%)
                              </span>
                            </h4>
                            <div className="space-y-2">
                              {course.assignments.map((assignment, idx) => (
                                <div key={idx} className="flex justify-between items-center p-3 bg-white rounded-lg border border-gray-100">
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
                            <h4 className="font-semibold text-gray-900 mb-3">
                              CATs
                              <span className="text-sm font-normal text-gray-500 ml-2">
                                ({course.cats.reduce((acc, cat) => acc + cat.weight, 0)}%)
                              </span>
                            </h4>
                            <div className="space-y-2">
                              {course.cats.map((cat, idx) => (
                                <div key={idx} className="flex justify-between items-center p-3 bg-white rounded-lg border border-gray-100">
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
                            <h4 className="font-semibold text-gray-900 mb-3">
                              Final Exam
                              <span className="text-sm font-normal text-gray-500 ml-2">
                                ({course.finalExam?.weight || 0}%)
                              </span>
                            </h4>
                            {course.finalExam ? (
                              <div className="p-3 bg-white rounded-lg border border-gray-100">
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
                              <div className="p-3 bg-white rounded-lg text-center border border-gray-100">
                                <p className="text-sm text-gray-500">Not yet taken</p>
                                <p className="text-xs text-blue-600 mt-1">Scheduled for end of semester</p>
                              </div>
                            )}
                          </div>
                        </div>
                        
                        {/* Grade breakdown visualization */}
                        <div className="mt-6 pt-6 border-t border-gray-200">
                          <h4 className="font-semibold text-gray-900 mb-3">Grade Breakdown</h4>
                          <div className="h-8 w-full bg-gray-100 rounded-full overflow-hidden">
                            {course.assignments.length > 0 && (
                              <div 
                                className="h-full bg-blue-500 float-left" 
                                style={{ 
                                  width: `${course.assignments.reduce((acc, a) => acc + a.weight, 0)}%` 
                                }}
                                title="Assignments"
                              ></div>
                            )}
                            {course.cats.length > 0 && (
                              <div 
                                className="h-full bg-green-500 float-left" 
                                style={{ 
                                  width: `${course.cats.reduce((acc, c) => acc + c.weight, 0)}%` 
                                }}
                                title="CATs"
                              ></div>
                            )}
                            {course.finalExam && (
                              <div 
                                className="h-full bg-purple-500 float-left" 
                                style={{ width: `${course.finalExam.weight}%` }}
                                title="Final Exam"
                              ></div>
                            )}
                          </div>
                          <div className="flex items-center justify-center space-x-6 mt-3 text-xs text-gray-600">
                            <div className="flex items-center">
                              <div className="w-3 h-3 bg-blue-500 rounded-sm mr-1"></div>
                              <span>Assignments</span>
                            </div>
                            <div className="flex items-center">
                              <div className="w-3 h-3 bg-green-500 rounded-sm mr-1"></div>
                              <span>CATs</span>
                            </div>
                            <div className="flex items-center">
                              <div className="w-3 h-3 bg-purple-500 rounded-sm mr-1"></div>
                              <span>Final Exam</span>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </motion.div>
                ))}
              </div>
              
              {/* Grade Scale Reference */}
              <div className="mt-8 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex items-center mb-2">
                  <Info size={16} className="text-gray-500 mr-2" />
                  <h4 className="font-medium text-gray-700">Grade Scale Reference</h4>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-2 text-sm">
                  <div className="flex items-center">
                    <span className="inline-block w-6 h-6 bg-green-50 text-green-600 rounded-full text-center mr-2">A</span>
                    <span className="text-gray-600">90-100% (4.0)</span>
                  </div>
                  <div className="flex items-center">
                    <span className="inline-block w-6 h-6 bg-green-50 text-green-600 rounded-full text-center mr-2">A-</span>
                    <span className="text-gray-600">85-89% (3.7)</span>
                  </div>
                  <div className="flex items-center">
                    <span className="inline-block w-6 h-6 bg-blue-50 text-blue-600 rounded-full text-center mr-2">B+</span>
                    <span className="text-gray-600">80-84% (3.3)</span>
                  </div>
                  <div className="flex items-center">
                    <span className="inline-block w-6 h-6 bg-blue-50 text-blue-600 rounded-full text-center mr-2">B</span>
                    <span className="text-gray-600">75-79% (3.0)</span>
                  </div>
                  <div className="flex items-center">
                    <span className="inline-block w-6 h-6 bg-blue-50 text-blue-600 rounded-full text-center mr-2">B-</span>
                    <span className="text-gray-600">70-74% (2.7)</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </motion.div>
    </div>
  );
}