import { Course, Assessment, Question } from '../types/assessment';

// Fallback dummy data for development/offline mode
export const dummyCourses: Course[] = [
  {
    id: "1",
    name: "Computer Science 4.1",
    code: "CS401",
    color: "bg-emerald-500",
    units: [
      { id: "1", unit_name: "Machine Learning", unit_code: "ML101", course_id: "1", level: 4, semester: 1 },
      { id: "2", unit_name: "Data Structures", unit_code: "DS201", course_id: "1", level: 4, semester: 1 },
      { id: "3", unit_name: "Algorithms", unit_code: "ALG301", course_id: "1", level: 4, semester: 1 },
    ]
  },
  {
    id: "2", 
    name: "Software Engineering",
    code: "SE301",
    color: "bg-blue-500",
    units: [
      { id: "4", unit_name: "Requirements Engineering", unit_code: "RE101", course_id: "2", level: 3, semester: 1 },
      { id: "5", unit_name: "System Design", unit_code: "SD201", course_id: "2", level: 3, semester: 1 },
      { id: "6", unit_name: "Testing & QA", unit_code: "TQA301", course_id: "2", level: 3, semester: 1 },
    ]
  },
  {
    id: "3",
    name: "Database Systems", 
    code: "DB401",
    color: "bg-purple-500",
    units: [
      { id: "7", unit_name: "Database Design", unit_code: "DD101", course_id: "3", level: 4, semester: 2 },
      { id: "8", unit_name: "SQL & NoSQL", unit_code: "SQL201", course_id: "3", level: 4, semester: 2 },
      { id: "9", unit_name: "Database Security", unit_code: "DBS301", course_id: "3", level: 4, semester: 2 },
    ]
  },
  {
    id: "4",
    name: "Web Development",
    code: "WD301", 
    color: "bg-orange-500",
    units: [
      { id: "10", unit_name: "Frontend Development", unit_code: "FE101", course_id: "4", level: 3, semester: 2 },
      { id: "11", unit_name: "Backend Systems", unit_code: "BE201", course_id: "4", level: 3, semester: 2 },
      { id: "12", unit_name: "Full Stack Integration", unit_code: "FS301", course_id: "4", level: 3, semester: 2 },
    ]
  }
];

export const dummyQuestions: Question[] = [
  {
    id: "q1",
    assessment_id: "1",
    text: "What is the primary purpose of supervised learning in machine learning?",
    type: "close-ended-multiple-single",
    choices: [
      "To learn patterns without labeled data",
      "To learn from input-output pairs",
      "To optimize reward functions",
      "To reduce dimensionality",
    ],
    correct_answer: "To learn from input-output pairs",
    marks: 2,
    rubric: "Supervised learning uses labeled training data to learn a mapping function from inputs to outputs.",
    created_at: "2024-01-15T10:00:00Z",
  },
  {
    id: "q2",
    assessment_id: "1",
    text: "Explain the difference between classification and regression in supervised learning.",
    type: "open-ended",
    marks: 5,
    correct_answer: "Classification predicts discrete categories while regression predicts continuous values.",
    rubric: "Mention discrete vs continuous prediction and give at least one example.",
    created_at: "2024-01-15T10:00:00Z",
  },
  {
    id: "q3",
    assessment_id: "2",
    text: "Implement a simple linear regression model and explain its components.",
    type: "open-ended",
    marks: 8,
    rubric: "Students should implement the model and explain slope, intercept, and loss function.",
    created_at: "2024-01-20T14:30:00Z",
  }
];

export const dummyAssessments: Assessment[] = [
  {
    id: "1",
    title: "Machine Learning Fundamentals",
    description: "Introduction to supervised and unsupervised learning algorithms",
    type: "CAT",
    unit_id: "1",
    course_id: "1", 
    questions_type: ["open-ended", "close-ended-multiple-single"],
    topic: "ML Basics",
    total_marks: 30,
    difficulty: "Intermediate",
    number_of_questions: 15,
    blooms_level: "Understand",
    semester: 1,
    verified: true,
    created_at: "2024-01-15T10:00:00Z",
    creator_id: "lecturer1",
    week: 3,
    questions: dummyQuestions.filter(q => q.assessment_id === "1")
  },
  {
    id: "2", 
    title: "Data Structure Implementation",
    description: "Implementing various data structures and analyzing their performance",
    type: "Assignment",
    unit_id: "2",
    course_id: "1",
    questions_type: ["open-ended"],
    topic: "Data Structures",
    total_marks: 50,
    difficulty: "Advance", 
    number_of_questions: 8,
    blooms_level: "Apply",
    semester: 1,
    verified: false,
    created_at: "2024-01-20T14:30:00Z",
    creator_id: "lecturer1",
    week: 5,
    questions: dummyQuestions.filter(q => q.assessment_id === "2")
  },
  {
    id: "3",
    title: "Database Query Optimization",
    description: "Advanced SQL queries and performance optimization techniques",
    type: "Case Study",
    unit_id: "7",
    course_id: "3",
    questions_type: ["open-ended"],
    topic: "Query Optimization",
    total_marks: 40,
    difficulty: "Advance",
    number_of_questions: 6,
    blooms_level: "Analyze",
    semester: 2,
    verified: true,
    created_at: "2024-01-25T09:15:00Z", 
    creator_id: "lecturer1",
    week: 7,
    questions: []
  }
];