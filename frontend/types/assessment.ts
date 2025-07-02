export interface Question {
    id: string;
    question: string;
    type: "multiple-choice" | "true-false" | "open-ended" | "application";
    options?: string[];
    correct_answer?: string | string[];
    marks: number;
    explanation?: string;
}

export interface Assessment {
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

export interface Course {
    id: string;
    name: string;
    code: string;
    color: string;
    units: Unit[];
}

export interface Unit {
    id: string;
    name: string;
    code: string;
    course_id: string;
}

export type MessageType = 'success' | 'error' | 'info';

export interface Message {
    type: MessageType;
    text: string;
}