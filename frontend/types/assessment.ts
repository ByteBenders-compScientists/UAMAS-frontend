// Re-export API types and add additional UI-specific types
export * from '../services/api';

// Additional UI-specific types
export type MessageType = 'success' | 'error' | 'info';

export interface Message {
  type: MessageType;
  text: string;
}

// Import Course type for extension
import type { Course } from '../services/api';

// Extended types for UI components
export interface CourseWithColor extends Course {
  color: string;
}

// Legacy compatibility - map API types to existing component props
export interface LegacyAssessment {
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
  questions?: LegacyQuestion[];
}

export interface LegacyQuestion {
  id: string;
  question: string;
  type: "multiple-choice" | "true-false" | "open-ended" | "application";
  options?: string[];
  correct_answer?: string | string[];
  marks: number;
  explanation?: string;
}

export interface LegacyCourse {
  id: string;
  name: string;
  code: string;
  color: string;
  units: LegacyUnit[];
}

export interface LegacyUnit {
  id: string;
  name: string;
  code: string;
  course_id: string;
}