import { 
  Course, 
  Unit, 
  Assessment, 
  Question,
  QuestionType,
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
export function transformCourseToUI(course: Course, index: number = 0): Course {
  return {
    ...course,
    color: courseColors[index % courseColors.length],
  };
}

const allowedQuestionTypes: QuestionType[] = [
  'open-ended',
  'close-ended-multiple-single',
  'close-ended-multiple-multiple',
  'close-ended-bool',
  'close-ended-matching',
  'close-ended-ordering',
  'close-ended-drag-drop',
];

function normalizeQuestionType(type: unknown): QuestionType {
  const raw = String(type ?? '').trim().toLowerCase();
  return allowedQuestionTypes.includes(raw as QuestionType) ? (raw as QuestionType) : 'open-ended';
}

function normalizeQuestionsTypeArray(types: unknown): QuestionType[] {
  if (Array.isArray(types)) {
    const normalized = types
      .map(t => normalizeQuestionType(t))
      .filter((t, idx, arr) => arr.indexOf(t) === idx);
    return normalized.length > 0 ? normalized : ['open-ended'];
  }

  // Backward compatibility: if API ever returns a single string
  if (typeof types === 'string' && types.trim().length > 0) {
    return [normalizeQuestionType(types)];
  }

  return ['open-ended'];
}

function normalizeQuestion(question: Question): Question {
  return {
    ...question,
    text: question.text || question.question || '',
    type: normalizeQuestionType(question.type),
  };
}

// Transform API Assessment to Legacy Assessment format
export function transformAssessmentToLegacy(assessment: Assessment): Assessment {
  return {
    ...assessment,
    questions_type: normalizeQuestionsTypeArray(assessment.questions_type),
    questions: assessment.questions?.map(normalizeQuestion),
  };
}

// Transform Legacy Assessment to API Assessment format for creation
export function transformLegacyToApiAssessment(
  legacyAssessment: Partial<Assessment>
): Partial<import('../services/api').CreateAssessmentRequest> {
  // Map UI difficulty to API difficulty
  const difficultyMap: Record<string, "Easy" | "Intermediate" | "Advance"> = {
    'Easy': 'Easy',
    'Intermediate': 'Intermediate',
    'Advance': 'Advance',
    'Advanced': 'Advance',
  };

  return {
    title: legacyAssessment.title,
    description: legacyAssessment.description,
    week: legacyAssessment.week,
    type: legacyAssessment.type,
    unit_id: legacyAssessment.unit_id,
    questions_type: normalizeQuestionsTypeArray(legacyAssessment.questions_type),
    topic: legacyAssessment.topic,
    total_marks: legacyAssessment.total_marks,
    difficulty: legacyAssessment.difficulty ? difficultyMap[legacyAssessment.difficulty] : 'Intermediate',
    number_of_questions: legacyAssessment.number_of_questions,
    blooms_level: legacyAssessment.blooms_level,
    deadline: legacyAssessment.deadline ?? undefined,
    duration: legacyAssessment.duration ?? undefined,
  };
}

// Group units by course for easier UI handling
export function groupUnitsByCourse(courses: Course[], units: Unit[]): Course[] {
  return courses.map(course => ({
    ...course,
    units: units.filter(unit => unit.course_id === course.id),
  }));
}
