import { LegacyCourse, LegacyAssessment, LegacyQuestion } from '../types/assessment';

// Fallback dummy data for development/offline mode
export const dummyCourses: LegacyCourse[] = [
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

export const dummyQuestions: LegacyQuestion[] = [
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

export const dummyAssessments: LegacyAssessment[] = [
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