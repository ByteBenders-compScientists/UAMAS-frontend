'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLayout } from '@/components/LayoutController';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import EmptyState from '@/components/EmptyState';
import { 
  BookOpen, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  Calendar,
  FileText,
  Download,
  Eye,
  TrendingUp,
  Award,
  Flag,
  ChevronRight,
  ChevronLeft,
  Loader2,
  X
} from 'lucide-react';

// Mock data
const mockCats = [
  {
    id: 1,
    title: 'Discrete Mathematics CAT 1',
    course: 'Mathematics 201',
    dueDate: '2025-02-15',
    status: 'completed',
    score: 92,
    totalMarks: 100,
    submittedAt: '2025-02-14',
    feedback: 'Excellent work on problem-solving techniques. Your approach to set theory problems was particularly impressive.',
    duration: 60, // minutes
    type: 'multiple_choice'
  },
  {
    id: 2,
    title: 'Database Systems CAT 1',
    course: 'Computer Science 301',
    dueDate: '2025-02-20',
    status: 'completed',
    score: 87,
    totalMarks: 100,
    submittedAt: '2025-02-19',
    feedback: 'Good understanding of normalization concepts. Work on improving your query optimization strategies.',
    duration: 45,
    type: 'multiple_choice'
  },
  {
    id: 3,
    title: 'Algorithms CAT 2',
    course: 'Computer Science 302',
    dueDate: '2025-02-25',
    status: 'pending',
    score: null,
    totalMarks: 100,
    submittedAt: null,
    feedback: null,
    duration: 90,
    type: 'multiple_choice'
  },
  {
    id: 4,
    title: 'Software Engineering Case Study',
    course: 'Computer Science 303',
    dueDate: '2025-03-05',
    status: 'pending',
    score: null,
    totalMarks: 100,
    submittedAt: null,
    feedback: null,
    duration: 120,
    type: 'case_study'
  }
];

// Mock questions for the CAT
const mockQuestions = [
  {
    id: 1,
    question: 'Which of the following is NOT a valid time complexity?',
    options: ['O(1)', 'O(n log n)', 'O(n²)', 'O(2ⁿ)'],
    correctAnswer: 3,
    explanation: 'All of these are valid time complexities. O(1) is constant time, O(n log n) is linearithmic time, O(n²) is quadratic time, and O(2ⁿ) is exponential time.'
  },
  {
    id: 2,
    question: 'What data structure would be most appropriate for implementing a priority queue?',
    options: ['Array', 'Linked List', 'Heap', 'Hash Table'],
    correctAnswer: 2,
    explanation: 'A heap is the most efficient data structure for implementing a priority queue, as it allows for O(log n) insertion and removal of the highest-priority element.'
  },
  {
    id: 3,
    question: 'Which sorting algorithm has the best average-case time complexity?',
    options: ['Bubble Sort', 'Insertion Sort', 'Quick Sort', 'Selection Sort'],
    correctAnswer: 2,
    explanation: 'Quick Sort has an average-case time complexity of O(n log n), which is better than Bubble Sort, Insertion Sort, and Selection Sort, which all have O(n²) average-case time complexity.'
  },
  {
    id: 4,
    question: 'What is the time complexity of searching in a balanced binary search tree?',
    options: ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)'],
    correctAnswer: 1,
    explanation: 'Searching in a balanced binary search tree has a time complexity of O(log n) because the tree structure allows for efficiently narrowing down the search space by half at each step.'
  },
  {
    id: 5,
    question: 'Which of the following algorithms is used to find the shortest path in a weighted graph?',
    options: ['Depth-First Search', 'Breadth-First Search', "Dijkstra's Algorithm", 'Binary Search'],
    correctAnswer: 2,
    explanation: "Dijkstra's Algorithm is specifically designed to find the shortest path in a weighted graph, provided there are no negative weights."
  }
];

// Mock case study
const mockCaseStudy = {
  title: 'Software Development Process Analysis',
  description: `
    The ABC Corporation is developing a new e-commerce platform. They have a team of 10 developers, 2 UX designers, and 3 QA testers. The project has been in development for 8 months, but they've faced several challenges:
    
    1. Frequent requirement changes from stakeholders
    2. Integration issues with third-party payment processors
    3. Performance bottlenecks during load testing
    4. Communication gaps between development and design teams
    
    The project is currently 3 months behind schedule, and the company is considering switching from their current Waterfall methodology to an Agile approach.
  `,
  questions: [
    {
      id: 1,
      question: 'Analyze the main issues in ABC Corporation\'s development process and explain how transitioning to Agile might address them.',
      wordLimit: 300
    },
    {
      id: 2,
      question: 'Propose a specific Agile framework (e.g., Scrum, Kanban) that would be most appropriate for this project, and outline an implementation plan.',
      wordLimit: 350
    },
    {
      id: 3,
      question: 'How should the team handle the existing partially completed work when transitioning to the new methodology?',
      wordLimit: 250
    }
  ]
};

export default function CatsPage() {
  const { sidebarCollapsed, isMobileView, isTabletView } = useLayout();
  const [hasContent] = useState(mockCats.length > 0);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [activeCat, setActiveCat] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isTakingCat, setIsTakingCat] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>(Array(mockQuestions.length).fill(-1));
  const [flaggedQuestions, setFlaggedQuestions] = useState<number[]>([]);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmSubmit, setShowConfirmSubmit] = useState(false);
  const [caseStudyAnswers, setCaseStudyAnswers] = useState<string[]>(Array(mockCaseStudy.questions.length).fill(''));

  // Simulate loading state for skeleton UI
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);

  // Timer for CAT
  useEffect(() => {
    if (!isTakingCat || timeLeft <= 0) return;
    
    const timer = setInterval(() => {
      setTimeLeft(prevTime => {
        if (prevTime <= 1) {
          clearInterval(timer);
          handleSubmitCat();
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [isTakingCat, timeLeft]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-50 border-green-200';
      case 'pending': return 'text-amber-600 bg-amber-50 border-amber-200';
      case 'overdue': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle size={16} />;
      case 'pending': return <Clock size={16} />;
      case 'overdue': return <AlertCircle size={16} />;
      default: return <FileText size={16} />;
    }
  };

  const filteredCats = mockCats.filter(cat => {
    if (selectedFilter === 'all') return true;
    return cat.status === selectedFilter;
  });

  const averageScore = mockCats
    .filter(cat => cat.score !== null)
    .reduce((acc, cat) => acc + (cat.score || 0), 0) / mockCats.filter(cat => cat.score !== null).length;

  const handleStartCat = (catId: number) => {
    const cat = mockCats.find(c => c.id === catId);
    if (!cat) return;
    
    setActiveCat(catId);
    setIsTakingCat(true);
    setCurrentQuestion(0);
    setSelectedAnswers(Array(mockQuestions.length).fill(-1));
    setFlaggedQuestions([]);
    setTimeLeft(cat.duration * 60); // convert minutes to seconds
    
    if (cat.type === 'case_study') {
      setCaseStudyAnswers(Array(mockCaseStudy.questions.length).fill(''));
    }
  };

  const handleAnswerSelect = (questionIndex: number, optionIndex: number) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[questionIndex] = optionIndex;
    setSelectedAnswers(newAnswers);
  };

  const handleCaseStudyAnswer = (questionIndex: number, text: string) => {
    const newAnswers = [...caseStudyAnswers];
    newAnswers[questionIndex] = text;
    setCaseStudyAnswers(newAnswers);
  };

  const toggleFlagQuestion = (index: number) => {
    if (flaggedQuestions.includes(index)) {
      setFlaggedQuestions(flaggedQuestions.filter(q => q !== index));
    } else {
      setFlaggedQuestions([...flaggedQuestions, index]);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSubmitCat = () => {
    setIsSubmitting(true);
    // Simulate submission delay
    setTimeout(() => {
      setIsTakingCat(false);
      setIsSubmitting(false);
      setShowConfirmSubmit(false);
      // In a real app, you would send the answers to the server
    }, 1500);
  };

  const currentCat = mockCats.find(cat => cat.id === activeCat);

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
        <Header title="My CATs" showWeekSelector={hasContent} />
        
        <main className="p-4 md:p-6">
          {!hasContent ? (
            <div className="max-w-4xl mx-auto">
              <EmptyState
                title="No CATs Available"
                description="Your Continuous Assessment Tests will appear here once your lecturers create them. Check back regularly for updates."
                icon={<BookOpen size={48} />}
              />
            </div>
          ) : isTakingCat ? (
            <div className="max-w-5xl mx-auto">
              {/* Taking CAT UI */}
              <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
                <div className="p-4 md:p-6 border-b border-gray-200">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900">{currentCat?.title}</h2>
                      <p className="text-sm text-gray-600">{currentCat?.course}</p>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <div className={`px-4 py-2 rounded-lg text-white font-medium ${
                        timeLeft < 300 ? 'bg-red-500' : 'bg-blue-600'
                      }`}>
                        <div className="flex items-center">
                          <Clock size={16} className="mr-2" />
                          <span>{formatTime(timeLeft)}</span>
                        </div>
                      </div>
                      
                      <button
                        onClick={() => setShowConfirmSubmit(true)}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                      >
                        Submit
                      </button>
                    </div>
                  </div>
                </div>
                
                {currentCat?.type === 'multiple_choice' ? (
                  <div className="flex flex-col md:flex-row">
                    {/* Question Area */}
                    <div className="flex-1 p-4 md:p-6">
                      <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-medium text-gray-900">
                          Question {currentQuestion + 1} of {mockQuestions.length}
                        </h3>
                        
                        <button
                          onClick={() => toggleFlagQuestion(currentQuestion)}
                          className={`flex items-center px-3 py-1 rounded-full text-sm ${
                            flaggedQuestions.includes(currentQuestion)
                              ? 'bg-amber-100 text-amber-700'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          <Flag size={14} className="mr-1" />
                          {flaggedQuestions.includes(currentQuestion) ? 'Flagged' : 'Flag for Review'}
                        </button>
                      </div>
                      
                      <div className="mb-8">
                        <p className="text-gray-900 text-lg mb-6">{mockQuestions[currentQuestion].question}</p>
                        
                        <div className="space-y-3">
                          {mockQuestions[currentQuestion].options.map((option, index) => (
                            <div
                              key={index}
                              onClick={() => handleAnswerSelect(currentQuestion, index)}
                              className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                                selectedAnswers[currentQuestion] === index
                                  ? 'border-blue-500 bg-blue-50'
                                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                              }`}
                            >
                              <div className="flex items-center">
                                <div className={`w-5 h-5 rounded-full border flex items-center justify-center mr-3 ${
                                  selectedAnswers[currentQuestion] === index
                                    ? 'border-blue-500 bg-blue-500'
                                    : 'border-gray-300'
                                }`}>
                                  {selectedAnswers[currentQuestion] === index && (
                                    <div className="w-2 h-2 rounded-full bg-white"></div>
                                  )}
                                </div>
                                <span className="text-gray-800">{option}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <button
                          onClick={() => setCurrentQuestion(prev => Math.max(0, prev - 1))}
                          disabled={currentQuestion === 0}
                          className={`flex items-center px-4 py-2 rounded-lg ${
                            currentQuestion === 0
                              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          <ChevronLeft size={16} className="mr-1" />
                          Previous
                        </button>
                        
                        <button
                          onClick={() => setCurrentQuestion(prev => Math.min(mockQuestions.length - 1, prev + 1))}
                          disabled={currentQuestion === mockQuestions.length - 1}
                          className={`flex items-center px-4 py-2 rounded-lg ${
                            currentQuestion === mockQuestions.length - 1
                              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                              : 'bg-blue-600 text-white hover:bg-blue-700'
                          }`}
                        >
                          Next
                          <ChevronRight size={16} className="ml-1" />
                        </button>
                      </div>
                    </div>
                    
                    {/* Question Navigator */}
                    <div className="w-full md:w-64 p-4 md:p-6 bg-gray-50 border-t md:border-t-0 md:border-l border-gray-200">
                      <h3 className="text-sm font-medium text-gray-700 mb-4">Question Navigator</h3>
                      
                      <div className="grid grid-cols-5 gap-2">
                        {mockQuestions.map((_, index) => (
                          <button
                            key={index}
                            onClick={() => setCurrentQuestion(index)}
                            className={`w-10 h-10 rounded-md flex items-center justify-center text-sm font-medium ${
                              currentQuestion === index
                                ? 'bg-blue-600 text-white'
                                : selectedAnswers[index] !== -1
                                  ? 'bg-green-100 text-green-700'
                                  : flaggedQuestions.includes(index)
                                    ? 'bg-amber-100 text-amber-700'
                                    : 'bg-white text-gray-700 border border-gray-200'
                            }`}
                          >
                            {index + 1}
                          </button>
                        ))}
                      </div>
                      
                      <div className="mt-6 space-y-2">
                        <div className="flex items-center text-sm">
                          <div className="w-4 h-4 bg-green-100 rounded mr-2"></div>
                          <span>Answered</span>
                        </div>
                        <div className="flex items-center text-sm">
                          <div className="w-4 h-4 bg-amber-100 rounded mr-2"></div>
                          <span>Flagged</span>
                        </div>
                        <div className="flex items-center text-sm">
                          <div className="w-4 h-4 bg-white border border-gray-200 rounded mr-2"></div>
                          <span>Unanswered</span>
                        </div>
                      </div>
                      
                      <div className="mt-6">
                        <div className="text-sm font-medium text-gray-700 mb-2">Progress</div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div 
                            className="h-2.5 rounded-full bg-blue-600"
                            style={{ width: `${(selectedAnswers.filter(a => a !== -1).length / mockQuestions.length) * 100}%` }}
                          ></div>
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {selectedAnswers.filter(a => a !== -1).length} of {mockQuestions.length} answered
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  // Case Study UI
                  <div className="p-4 md:p-6">
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
                      <h3 className="text-lg font-medium text-gray-900 mb-2">{mockCaseStudy.title}</h3>
                      <div className="text-gray-700 whitespace-pre-line">{mockCaseStudy.description}</div>
                    </div>
                    
                    <div className="space-y-8">
                      {mockCaseStudy.questions.map((question, index) => (
                        <div key={index} className="border border-gray-200 rounded-lg p-4">
                          <h4 className="text-md font-medium text-gray-900 mb-2">
                            Question {index + 1}: {question.question}
                          </h4>
                          <p className="text-sm text-gray-500 mb-3">Word limit: {question.wordLimit}</p>
                          
                          <textarea
                            value={caseStudyAnswers[index]}
                            onChange={(e) => handleCaseStudyAnswer(index, e.target.value)}
                            placeholder="Type your answer here..."
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                            rows={8}
                          />
                          
                          <div className="flex justify-end mt-2">
                            <span className="text-xs text-gray-500">
                              {caseStudyAnswers[index].split(/\s+/).filter(Boolean).length} / {question.wordLimit} words
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              {/* Confirmation Modal */}
              {showConfirmSubmit && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-white rounded-xl shadow-lg max-w-md w-full p-6"
                  >
                    <div className="text-center">
                      <AlertCircle size={48} className="mx-auto text-amber-500 mb-4" />
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Submit CAT?</h3>
                      
                      {currentCat?.type === 'multiple_choice' && (
                        <p className="text-gray-600 mb-6">
                          You have answered {selectedAnswers.filter(a => a !== -1).length} out of {mockQuestions.length} questions.
                          {selectedAnswers.filter(a => a === -1).length > 0 && ' Unanswered questions will be marked as incorrect.'}
                        </p>
                      )}
                      
                      {currentCat?.type === 'case_study' && (
                        <p className="text-gray-600 mb-6">
                          Please ensure you've completed all questions to the best of your ability.
                          Once submitted, you won't be able to make changes.
                        </p>
                      )}
                      
                      <div className="flex justify-center space-x-4">
                        <button
                          onClick={() => setShowConfirmSubmit(false)}
                          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                        >
                          Cancel
                        </button>
                        
                        <button
                          onClick={handleSubmitCat}
                          disabled={isSubmitting}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          {isSubmitting ? (
                            <div className="flex items-center">
                              <Loader2 size={16} className="animate-spin mr-2" />
                              Submitting...
                            </div>
                          ) : (
                            'Confirm Submission'
                          )}
                        </button>
                      </div>
                    </div>
                  </motion.div>
                </div>
              )}
            </div>
          ) : (
            <div className="max-w-6xl mx-auto">
              {/* Stats Overview */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: isLoading ? 0 : 1, y: isLoading ? 20 : 0 }}
                  transition={{ delay: 0.1 }}
                  className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
                >
                  {isLoading ? (
                    <div className="animate-pulse space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                      <div className="h-8 bg-gray-300 rounded w-1/3"></div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Total CATs</p>
                        <p className="text-2xl font-bold text-gray-900">{mockCats.length}</p>
                      </div>
                      <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                        <BookOpen size={24} className="text-blue-600" />
                      </div>
                    </div>
                  )}
                </motion.div>

                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: isLoading ? 0 : 1, y: isLoading ? 20 : 0 }}
                  transition={{ delay: 0.2 }}
                  className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
                >
                  {isLoading ? (
                    <div className="animate-pulse space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                      <div className="h-8 bg-gray-300 rounded w-1/3"></div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Completed</p>
                        <p className="text-2xl font-bold text-green-600">
                          {mockCats.filter(cat => cat.status === 'completed').length}
                        </p>
                      </div>
                      <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
                        <CheckCircle size={24} className="text-green-600" />
                      </div>
                    </div>
                  )}
                </motion.div>

                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: isLoading ? 0 : 1, y: isLoading ? 20 : 0 }}
                  transition={{ delay: 0.3 }}
                  className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
                >
                  {isLoading ? (
                    <div className="animate-pulse space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                      <div className="h-8 bg-gray-300 rounded w-1/3"></div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Average Score</p>
                        <p className="text-2xl font-bold text-blue-600">{averageScore ? averageScore.toFixed(1) : '0'}%</p>
                      </div>
                      <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                        <TrendingUp size={24} className="text-blue-600" />
                      </div>
                    </div>
                  )}
                </motion.div>

                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: isLoading ? 0 : 1, y: isLoading ? 20 : 0 }}
                  transition={{ delay: 0.4 }}
                  className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
                >
                  {isLoading ? (
                    <div className="animate-pulse space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                      <div className="h-8 bg-gray-300 rounded w-1/3"></div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Pending</p>
                        <p className="text-2xl font-bold text-amber-600">
                          {mockCats.filter(cat => cat.status === 'pending').length}
                        </p>
                      </div>
                      <div className="w-12 h-12 bg-amber-50 rounded-lg flex items-center justify-center">
                        <Clock size={24} className="text-amber-600" />
                      </div>
                    </div>
                  )}
                </motion.div>
              </div>

              {/* Filter Tabs */}
              <div className="mb-6">
                <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-fit">
                  {['all', 'completed', 'pending'].map((filter) => (
                    <button
                      key={filter}
                      onClick={() => setSelectedFilter(filter)}
                      className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                        selectedFilter === filter
                          ? 'bg-white text-blue-600 shadow-sm'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      {filter.charAt(0).toUpperCase() + filter.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* CATs List */}
              <div className="space-y-4">
                {isLoading ? (
                  // Skeleton loading for CATs
                  Array.from({ length: 3 }).map((_, index) => (
                    <div 
                      key={index}
                      className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 animate-pulse"
                    >
                      <div className="flex justify-between">
                        <div className="space-y-3 w-full">
                          <div className="h-5 bg-gray-300 rounded w-1/3"></div>
                          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                          <div className="flex items-center space-x-4">
                            <div className="h-4 bg-gray-200 rounded w-24"></div>
                            <div className="h-4 bg-gray-200 rounded w-20"></div>
                          </div>
                          <div className="h-24 bg-gray-100 rounded w-full"></div>
                        </div>
                        <div className="h-16 w-16 bg-gray-300 rounded-full ml-4"></div>
                      </div>
                    </div>
                  ))
                ) : (
                  filteredCats.map((cat, index) => (
                    <motion.div
                      key={cat.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center mb-2">
                            <h3 className="text-lg font-semibold text-gray-900 mr-3">{cat.title}</h3>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(cat.status)}`}>
                              {getStatusIcon(cat.status)}
                              <span className="ml-1">{cat.status.charAt(0).toUpperCase() + cat.status.slice(1)}</span>
                            </span>
                          </div>
                          
                          <p className="text-sm text-gray-600 mb-3">{cat.course}</p>
                          
                          <div className="flex items-center space-x-6 text-sm text-gray-500 mb-4">
                            <div className="flex items-center">
                              <Calendar size={16} className="mr-1" />
                              <span>Due: {new Date(cat.dueDate).toLocaleDateString()}</span>
                            </div>
                            
                            <div className="flex items-center">
                              <Clock size={16} className="mr-1" />
                              <span>Duration: {cat.duration} mins</span>
                            </div>
                            
                            {cat.score !== null && (
                              <div className="flex items-center">
                                <Award size={16} className="mr-1" />
                                <span>Score: {cat.score}/{cat.totalMarks}</span>
                              </div>
                            )}
                          </div>

                          {cat.feedback && (
                            <div className="mt-2 p-3 bg-blue-50 rounded-lg">
                              <p className="text-sm text-blue-800">
                                <strong>Feedback:</strong> {cat.feedback}
                              </p>
                            </div>
                          )}
                          
                          {cat.status === 'pending' && (
                            <button
                              onClick={() => handleStartCat(cat.id)}
                              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            >
                              {cat.type === 'multiple_choice' ? 'Start CAT' : 'Open Case Study'}
                            </button>
                          )}
                        </div>

                        <div className="flex items-center space-x-2 ml-4">
                          {cat.status === 'completed' && (
                            <>
                              <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                                <Eye size={18} />
                              </button>
                              <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                                <Download size={18} />
                              </button>
                            </>
                          )}
                          
                          {cat.score !== null && (
                            <div className="text-right">
                              <div className="text-2xl font-bold text-blue-600">{cat.score}%</div>
                              <div className="text-xs text-gray-500">Grade</div>
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
                
                {!isLoading && filteredCats.length === 0 && (
                  <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-200">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <BookOpen size={24} className="text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No {selectedFilter !== 'all' ? selectedFilter : ''} CATs found</h3>
                    <p className="text-gray-600">Check back later or select a different filter.</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </main>
      </motion.div>
    </div>
  );
}