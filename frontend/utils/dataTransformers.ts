import { 
  Course, 
  Unit, 
  Assessment, 
  Question,
  LegacyAssessment,
  LegacyQuestion,
  LegacyCourse,
  LegacyUnit,
  CourseWithColor
} from '../types/assessment';

// Color palette for courses
const courseColors = [
  'bg-emerald-500',
  'bg-blue-500', 
  'bg-purple-500',
  'bg-orange-500',
  'bg-pink-500',
  'bg-indigo-500',
  'bg-teal-500',
  'bg-red-500',
];

// Transform API Course to UI Course with color
export function transformCourseToUI(course: Course, index: number = 0): CourseWithColor {
  return {
    ...course,
    color: courseColors[index % courseColors.length],
  };
}

// Transform API Unit to Legacy Unit format
export function transformUnitToLegacy(unit: Unit): LegacyUnit {
  return {
    id: unit.id,
    name: unit.unit_name,
    code: unit.unit_code,
    course_id: unit.course_id,
  };
}

// Transform API Course to Legacy Course format
export function transformCourseToLegacy(course: CourseWithColor): LegacyCourse {
  return {
    id: course.id,
    name: course.name,
    code: course.code,
    color: course.color,
    units: course.units.map(transformUnitToLegacy),
  };
}

// Transform API Question to Legacy Question format
export function transformQuestionToLegacy(question: Question): LegacyQuestion {
  // Determine question type based on API data
  let questionType: "multiple-choice" | "true-false" | "open-ended" | "application" = "open-ended";
  
  if (question.type === "close-ended" && question.choices && question.choices.length > 0) {
    if (question.choices.length === 2 && 
        question.choices.some(choice => choice.toLowerCase().includes('true') || choice.toLowerCase().includes('false'))) {
      questionType = "true-false";
    } else {
      questionType = "multiple-choice";
    }
  } else if (question.type === "open-ended") {
    questionType = "open-ended";
  }

  return {
    id: question.id,
    question: question.text,
    type: questionType,
    options: question.choices || undefined,
    correct_answer: question.correct_answer ? 
      (Array.isArray(question.correct_answer) ? question.correct_answer : [question.correct_answer]) : 
      undefined,
    marks: question.marks,
    explanation: question.rubric,
  };
}

// Transform API Assessment to Legacy Assessment format
export function transformAssessmentToLegacy(assessment: Assessment): LegacyAssessment {
  // Map API difficulty to UI difficulty
  const difficultyMap: Record<string, "Easy" | "Intermediate" | "Advanced"> = {
    'Easy': 'Easy',
    'Intermediate': 'Intermediate', 
    'Advance': 'Advanced', // API uses 'Advance', UI expects 'Advanced'
  };

  // Determine questions_type for UI
  let questionsType: "open-ended" | "close-ended" | "application" = "close-ended";
  if (assessment.questions_type === "open-ended") {
    questionsType = "open-ended";
  } else if (assessment.questions_type === "close-ended") {
    questionsType = "close-ended";
  }

  return {
    id: assessment.id,
    title: assessment.title,
    description: assessment.description,
    type: assessment.type,
    unit_id: assessment.unit_id,
    course_id: assessment.course_id,
    questions_type: questionsType,
    close_ended_type: assessment.close_ended_type,
    topic: assessment.topic,
    total_marks: assessment.total_marks,
    difficulty: difficultyMap[assessment.difficulty] || 'Intermediate',
    number_of_questions: assessment.number_of_questions,
    blooms_level: assessment.blooms_level,
    deadline: assessment.deadline,
    duration: assessment.duration,
    verified: assessment.verified,
    created_at: assessment.created_at,
    creator_id: assessment.creator_id,
    week: assessment.week,
    status: assessment.status,
    questions: assessment.questions?.map(transformQuestionToLegacy),
  };
}

// Transform Legacy Assessment to API Assessment format for creation
export function transformLegacyToApiAssessment(
  legacyAssessment: Partial<LegacyAssessment>
): Partial<import('../services/api').CreateAssessmentRequest> {
  // Map UI difficulty to API difficulty
  const difficultyMap: Record<string, "Easy" | "Intermediate" | "Advance"> = {
    'Easy': 'Easy',
    'Intermediate': 'Intermediate',
    'Advanced': 'Advance', // UI uses 'Advanced', API expects 'Advance'
  };

  return {
    title: legacyAssessment.title,
    description: legacyAssessment.description,
    week: legacyAssessment.week,
    type: legacyAssessment.type,
    unit_id: legacyAssessment.unit_id,
    questions_type: legacyAssessment.questions_type === "application" ? "open-ended" : legacyAssessment.questions_type,
    close_ended_type: legacyAssessment.close_ended_type,
    topic: legacyAssessment.topic,
    total_marks: legacyAssessment.total_marks,
    difficulty: legacyAssessment.difficulty ? difficultyMap[legacyAssessment.difficulty] : 'Intermediate',
    number_of_questions: legacyAssessment.number_of_questions,
    blooms_level: legacyAssessment.blooms_level,
    deadline: legacyAssessment.deadline,
    duration: legacyAssessment.duration,
  };
}

// Group units by course for easier UI handling
export function groupUnitsByCourse(courses: CourseWithColor[], units: Unit[]): CourseWithColor[] {
  return courses.map(course => ({
    ...course,
    units: units.filter(unit => unit.course_id === course.id),
  }));
}