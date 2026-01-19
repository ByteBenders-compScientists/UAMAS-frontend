export interface Course {
  id: string;
  name: string;
  code: string;
  color: string;
  units: Unit[];
}

export interface Unit {
  id: string;
  unit_code: string;
  unit_name: string;
  level: number;
  semester: number;
  course_id: string;
}

export interface Message {
  type: 'success' | 'error' | 'info' | 'warning';
  text: string;
}
// types/assessment.ts
export type QuestionType = 
  | 'open-ended'
  | 'close-ended-multiple-single'
  | 'close-ended-multiple-multiple'
  | 'close-ended-bool'
  | 'close-ended-matching'
  | 'close-ended-ordering'
  | 'close-ended-drag-drop';

export interface BaseQuestion {
  id: string;
  assessment_id: string;
  text: string;
  type: QuestionType;
  choices?: (string | string[])[];
  correct_answer?: string | string[] | { item: string; target: string }[] | string[][];
  marks: number;
  rubric?: string;
  created_at: string;
  question?: string; // For backward compatibility
}

export interface Assessment {
  id: string;
  title: string;
  description: string;
  type: 'CAT' | 'Assignment' | 'Case Study';
  questions_type: QuestionType[];
  topic: string;
  total_marks: number;
  difficulty: 'Easy' | 'Intermediate' | 'Advance';
  number_of_questions: number;
  blooms_level: 'Remember' | 'Understand' | 'Apply' | 'Analyze' | 'Evaluate' | 'Create';
  deadline?: string | null;
  duration?: number | null;
  schedule_date?: string | null;
  deadline_date?: string | null;
  course_id: string;
  unit_id: string;
  week: number;
  semester: number;
  verified: boolean;
  created_at: string;
  creator_id: string;
  questions?: Question[];
}

export interface Question extends BaseQuestion {
  // Alias for backward compatibility
  question?: string;
  text: string;
  // More specific type for correct_answer based on question type
  correct_answer?: 
    | string // for open-ended
    | string[] // for multiple-single, multiple-multiple, ordering
    | { item: string; target: string }[] // for drag-drop
    | string[][]; // for matching
}
