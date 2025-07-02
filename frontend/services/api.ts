const API_BASE_URL = 'http://localhost:8080/api/v1';

// API Configuration
const apiConfig = {
  credentials: 'include' as RequestCredentials,
  headers: {
    'Content-Type': 'application/json',
  },
};

// Generic API request function
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const config: RequestInit = {
    ...apiConfig,
    ...options,
    headers: {
      ...apiConfig.headers,
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, config);
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('API Request failed:', error);
    throw error;
  }
}

// Course API
export const courseApi = {
  // Get all courses created by lecturer
  getCourses: () => 
    apiRequest<Course[]>('/auth/lecturer/courses'),

  // Get specific course by ID
  getCourse: (courseId: string) =>
    apiRequest<Course>(`/auth/lecturer/courses/${courseId}`),

  // Create new course
  createCourse: (courseData: CreateCourseRequest) =>
    apiRequest<CreateCourseResponse>('/auth/lecturer/courses', {
      method: 'POST',
      body: JSON.stringify(courseData),
    }),

  // Update course
  updateCourse: (courseId: string, courseData: UpdateCourseRequest) =>
    apiRequest<Course>(`/auth/lecturer/courses/${courseId}`, {
      method: 'PUT',
      body: JSON.stringify(courseData),
    }),

  // Delete course
  deleteCourse: (courseId: string) =>
    apiRequest<{ message: string }>(`/auth/lecturer/courses/${courseId}`, {
      method: 'DELETE',
    }),
};

// Unit API
export const unitApi = {
  // Get all units created by lecturer
  getUnits: () =>
    apiRequest<Unit[]>('/auth/lecturer/units'),

  // Get specific unit by ID
  getUnit: (unitId: string) =>
    apiRequest<Unit>(`/auth/lecturer/units/${unitId}`),

  // Create new unit
  createUnit: (unitData: CreateUnitRequest) =>
    apiRequest<CreateUnitResponse>('/auth/lecturer/units', {
      method: 'POST',
      body: JSON.stringify(unitData),
    }),

  // Update unit
  updateUnit: (unitId: string, unitData: UpdateUnitRequest) =>
    apiRequest<Unit>(`/auth/lecturer/units/${unitId}`, {
      method: 'PUT',
      body: JSON.stringify(unitData),
    }),

  // Delete unit
  deleteUnit: (unitId: string) =>
    apiRequest<{ message: string }>(`/auth/lecturer/units/${unitId}`, {
      method: 'DELETE',
    }),
};

// Assessment API
export const assessmentApi = {
  // Get all assessments created by lecturer
  getAssessments: () =>
    apiRequest<Assessment[]>('/bd/lecturer/assessments'),

  // Generate assessment with AI
  generateAssessmentWithAI: (assessmentData: CreateAssessmentRequest) =>
    apiRequest<CreateAssessmentResponse>('/bd/lecturer/ai/generate-assessments', {
      method: 'POST',
      body: JSON.stringify(assessmentData),
    }),

  // Create assessment manually
  createAssessment: (assessmentData: CreateAssessmentRequest) =>
    apiRequest<CreateAssessmentResponse>('/bd/lecturer/generate-assessments', {
      method: 'POST',
      body: JSON.stringify(assessmentData),
    }),

  // Verify AI generated assessment
  verifyAssessment: (assessmentId: string) =>
    apiRequest<VerifyAssessmentResponse>(`/bd/lecturer/assessments/${assessmentId}/verify`),

  // Delete assessment
  deleteAssessment: (assessmentId: string) =>
    apiRequest<{ message: string }>(`/bd/lecturer/assessments/${assessmentId}`, {
      method: 'DELETE',
    }),

  // Add question to assessment
  addQuestion: (assessmentId: string, questionData: CreateQuestionRequest) =>
    apiRequest<CreateQuestionResponse>(`/bd/lecturer/assessments/${assessmentId}/questions`, {
      method: 'POST',
      body: JSON.stringify(questionData),
    }),
};

// Student API
export const studentApi = {
  // Get all students
  getStudents: () =>
    apiRequest<Student[]>('/auth/lecturer/students'),

  // Get specific student
  getStudent: (studentId: string) =>
    apiRequest<Student>(`/auth/lecturer/students/${studentId}`),

  // Add student to course
  addStudent: (studentData: CreateStudentRequest) =>
    apiRequest<CreateStudentResponse>('/auth/lecturer/students', {
      method: 'POST',
      body: JSON.stringify(studentData),
    }),

  // Update student
  updateStudent: (studentId: string, studentData: UpdateStudentRequest) =>
    apiRequest<Student>(`/auth/lecturer/students/${studentId}`, {
      method: 'PUT',
      body: JSON.stringify(studentData),
    }),

  // Delete student
  deleteStudent: (studentId: string) =>
    apiRequest<{ message: string }>(`/auth/lecturer/students/${studentId}`, {
      method: 'DELETE',
    }),
};

// Submission API
export const submissionApi = {
  // Get submissions for specific assessment
  getAssessmentSubmissions: (assessmentId: string) =>
    apiRequest<Submission[]>(`/bd/lecturer/submissions/assessments/${assessmentId}`),

  // Get submissions for specific student
  getStudentSubmissions: (studentId: string) =>
    apiRequest<Submission[]>(`/bd/lecturer/submissions/student/${studentId}`),

  // Update submission score and feedback
  updateSubmission: (submissionId: string, updateData: UpdateSubmissionRequest) =>
    apiRequest<UpdateSubmissionResponse>(`/bd/lecturer/submissions/${submissionId}`, {
      method: 'PUT',
      body: JSON.stringify(updateData),
    }),
};

// Notes API
export const notesApi = {
  // Get all notes uploaded by lecturer
  getNotes: () =>
    apiRequest<GetNotesResponse>('/bd/lecturer/notes'),

  // Upload notes to unit
  uploadNotes: (unitId: string, formData: FormData) =>
    fetch(`${API_BASE_URL}/bd/lecturer/units/${unitId}/notes`, {
      method: 'POST',
      credentials: 'include',
      body: formData, // Don't set Content-Type for FormData
    }).then(response => {
      if (!response.ok) {
        throw new Error(`Upload failed: ${response.status} ${response.statusText}`);
      }
      return response.json();
    }),

  // Delete note
  deleteNote: (noteId: string) =>
    apiRequest<{ message: string; note_id: string }>(`/bd/lecturer/notes/${noteId}`, {
      method: 'DELETE',
    }),
};

// Type definitions based on API documentation
export interface Course {
  id: string;
  name: string;
  code: string;
  department: string;
  school: string;
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

export interface Assessment {
  id: string;
  title: string;
  description: string;
  week: number;
  type: 'CAT' | 'Assignment' | 'Case Study';
  unit_id: string;
  course_id: string;
  questions_type: 'close-ended' | 'open-ended';
  close_ended_type?: string;
  topic: string;
  total_marks: number;
  difficulty: 'Easy' | 'Intermediate' | 'Advance';
  number_of_questions: number;
  blooms_level: 'Remember' | 'Understand' | 'Apply' | 'Analyze' | 'Evaluate' | 'Create';
  deadline?: string;
  duration?: number;
  verified: boolean;
  created_at: string;
  creator_id: string;
  status: string;
  level: number;
  semester: number;
  questions: Question[];
}

export interface Question {
  id: string;
  text: string;
  marks: number;
  type: 'close-ended' | 'open-ended';
  rubric: string;
  correct_answer?: string[] | null;
  choices?: string[] | null;
  assessment_id: string;
  created_at: string;
}

export interface Student {
  id: string;
  firstname: string;
  surname: string;
  othernames: string;
  reg_number: string;
  year_of_study: number;
  semester: number;
  user_id: string;
  course: {
    id: string;
    name: string;
  };
  units: Unit[];
}

export interface Submission {
  submission_id: string;
  assessment_id: string;
  student_id: string;
  graded: boolean;
  total_marks: number;
  results: SubmissionResult[];
}

export interface SubmissionResult {
  id: string;
  question_id: string;
  question_text: string;
  assessment_id: string;
  student_id: string;
  marks: number;
  score: number;
  feedback: string;
  graded_at: string;
}

// Request/Response types
export interface CreateCourseRequest {
  name: string;
  code: string;
  department: string;
  school: string;
}

export interface CreateCourseResponse {
  course_id: string;
  message: string;
}

export interface UpdateCourseRequest {
  name: string;
  code: string;
  department: string;
  school: string;
}

export interface CreateUnitRequest {
  unit_code: string;
  unit_name: string;
  level: number;
  semester: number;
  course_id: string;
}

export interface CreateUnitResponse {
  unit_id: string;
  message: string;
}

export interface UpdateUnitRequest {
  unit_code: string;
  unit_name: string;
  level: number;
  semester: number;
  course_id: string;
}

export interface CreateAssessmentRequest {
  title: string;
  description: string;
  week: number;
  type: 'CAT' | 'Assignment' | 'Case Study';
  unit_id: string;
  questions_type: 'close-ended' | 'open-ended';
  close_ended_type?: string;
  topic: string;
  total_marks: number;
  difficulty: 'Easy' | 'Intermediate' | 'Advance';
  number_of_questions: number;
  blooms_level: 'Remember' | 'Understand' | 'Apply' | 'Analyze' | 'Evaluate' | 'Create';
  deadline?: string;
  duration?: number;
}

export interface CreateAssessmentResponse {
  assessment_id: string;
  message: string;
  title: string;
}

export interface VerifyAssessmentResponse {
  assessment_id: string;
  message: string;
  title: string;
}

export interface CreateQuestionRequest {
  text: string;
  marks: number;
  type: 'close-ended' | 'open-ended';
  rubric: string;
  correct_answer?: string;
  choices?: string;
}

export interface CreateQuestionResponse {
  question_id: string;
  message: string;
}

export interface CreateStudentRequest {
  email: string;
  reg_number: string;
  year_of_study: number;
  semester: number;
  firstname: string;
  surname: string;
  othernames: string;
  course_id: string;
}

export interface CreateStudentResponse {
  student_id: string;
  message: string;
}

export interface UpdateStudentRequest {
  email: string;
  reg_number: string;
  year_of_study: number;
  semester: number;
  firstname: string;
  surname: string;
  othernames: string;
  course_id: string;
}

export interface UpdateSubmissionRequest {
  score: number;
  question_id: string;
  feedback: string;
}

export interface UpdateSubmissionResponse {
  submission_id: string;
  message: string;
  graded: boolean;
  total_marks: number;
}

export interface GetNotesResponse {
  message: string;
  notes: Note[];
}

export interface Note {
  id: string;
  title: string;
  description: string;
  original_filename: string;
  file_size: number;
  file_type: string;
  mime_type: string;
  unit_id: string;
  course_id: string;
  lecturer_id: string;
  created_at: string;
  updated_at: string;
}