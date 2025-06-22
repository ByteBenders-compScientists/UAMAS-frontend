"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useLayout } from "@/components/LayoutController";
import Sidebar from "@/components/lecturerSidebar";
import Header from "@/components/Header";
import EmptyState from "@/components/EmptyState";
import {
  BookMarked,
  Plus,
  CheckCircle,
  Wand2,
  User,
  ClipboardList,
  FileCheck,
  AlertCircle,
  Loader2,
  Eye,
  RefreshCw,
  Calendar,
} from "lucide-react";

// ===== TYPES =====
interface Assessment {
  id: string;
  title: string;
  description: string;
  type: "CAT" | "assignment";
  unit_id: string;
  course_id: string;
  questions_type: "open-ended" | "close-ended";
  topic: string;
  total_marks: number;
  difficulty: "easy" | "intermediate" | "hard";
  number_of_questions: number;
  verified: boolean;
  created_at: string;
  creator_id: string;
  week: number;
  status?: string;
}

interface Question {
  id: string;
  text: string;
  marks: number;
  type: "open-ended" | "close-ended";
  rubric: string;
  correct_answer: string;
  assessment_id: string;
  created_at: string;
}

interface Course {
  id: string;
  name: string;
  code: string;
  color?: string;
}

interface Unit {
  id: string;
  name: string;
  code: string;
  course_id: string;
}

// ===== API CONFIGURATION =====
const API_BASE_URL = "http://localhost:8080/api/v1";

// Get auth token from localStorage or context
const getAuthToken = () => {
  return localStorage.getItem("access_token") || "";
};

// ===== API FUNCTIONS =====
const api = {
  // Get all courses
  getCourses: async (): Promise<Course[]> => {
    const response = await fetch(`${API_BASE_URL}/bd/courses`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });
    if (!response.ok) throw new Error("Failed to fetch courses");
    return response.json();
  },

  // Get all units
  getUnits: async (): Promise<Unit[]> => {
    const response = await fetch(`${API_BASE_URL}/bd/units`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });
    if (!response.ok) throw new Error("Failed to fetch units");
    return response.json();
  },

  // Get all assessments for lecturer
  getAssessments: async (): Promise<Assessment[]> => {
    const response = await fetch(`${API_BASE_URL}/bd/lecturer/assessments`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });
    if (!response.ok) throw new Error("Failed to fetch assessments");
    return response.json();
  },

  // Generate assessment with AI
  generateAssessment: async (
    data: any
  ): Promise<{ assessment_id: string; message: string; title: string }> => {
    const jsonData = JSON.stringify(data);
    console.log("JSON payload:", jsonData);
    console.log("JSON payload length:", jsonData.length);
    const response = await fetch(`${API_BASE_URL}/bd/ai/generate-assessments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(data),
    });

    if (!response.ok) throw new Error("Failed to generate assessment");
    return response.json();
  },

  // Create assessment manually
  createAssessment: async (
    data: any
  ): Promise<{ assessment_id: string; message: string; title: string }> => {
    const jsonData = JSON.stringify(data);
    console.log("JSON payload:", jsonData);
    console.log("JSON payload length:", jsonData.length);
    const response = await fetch(
      `${API_BASE_URL}/bd/lecturer/generate-assessments`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(data),
      }
    );
    console.log(data);
    if (!response.ok) throw new Error("Failed to create assessment");
    return response.json();
  },

  // Verify AI generated assessment
  verifyAssessment: async (
    assessmentId: string
  ): Promise<{ assessment_id: string; message: string; title: string }> => {
    const response = await fetch(
      `${API_BASE_URL}/bd/lecturer/assessments/${assessmentId}/verify`,
      {
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      }
    );
    if (!response.ok) throw new Error("Failed to verify assessment");
    return response.json();
  },

  // Add question to assessment
  addQuestion: async (
    assessmentId: string,
    questionData: any
  ): Promise<{ message: string; question_id: string }> => {
    const response = await fetch(
      `${API_BASE_URL}/bd/lecturer/assessments/${assessmentId}/questions`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(questionData),
      }
    );
    if (!response.ok) throw new Error("Failed to add question");
    return response.json();
  },

  // Get questions for assessment
  getQuestions: async (assessmentId: string): Promise<Question[]> => {
    const response = await fetch(
      `${API_BASE_URL}/bd/assessments/${assessmentId}/questions`,
      {
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      }
    );
    if (!response.ok) throw new Error("Failed to fetch questions");
    return response.json();
  },
};

// ===== UTILITY FUNCTIONS =====
const formatDate = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
  };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

// Course colors for visual distinction
const COURSE_COLORS = [
  "bg-rose-500",
  "bg-blue-500",
  "bg-purple-500",
  "bg-green-500",
  "bg-yellow-500",
  "bg-indigo-500",
  "bg-pink-500",
  "bg-teal-500",
  "bg-orange-500",
  "bg-cyan-500",
];

const getCourseByCode = (courseId: string, courses: Course[]) => {
  const course = courses.find((course) => course.id === courseId);
  if (!course) return null;

  // Add color if not present
  if (!course.color) {
    const colorIndex =
      courses.findIndex((c) => c.id === courseId) % COURSE_COLORS.length;
    course.color = COURSE_COLORS[colorIndex];
  }

  return course;
};

const getDifficultyColor = (difficulty: string) => {
  switch (difficulty) {
    case "easy":
      return "bg-green-100 text-green-700";
    case "intermediate":
      return "bg-yellow-100 text-yellow-700";
    case "hard":
      return "bg-red-100 text-red-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
};

// ===== COMPONENTS =====


const CreateAssessmentModal = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  loading, 
  courses, 
  units 
}) => {
  const { currentWeek } = useLayout();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    type: "CAT",
    unit_id: "",
    course_id: "",
    questions_type: "close-ended",
    topic: "",
    total_marks: 20,
    difficulty: "intermediate",
    number_of_questions: 5,
    week: currentWeek,
  });

  // Track which fields have been touched for validation display
  const [touchedFields, setTouchedFields] = useState(new Set());

  // Define required fields matching backend expectations
  const requiredFields = [
    'title', 'description', 'course_id', 'unit_id', 'topic', 
    'week', 'type', 'questions_type', 'total_marks', 'difficulty', 'number_of_questions'
  ];

  // Update week when currentWeek changes and modal is opened
  useEffect(() => {
    if (isOpen) {
      setFormData((prev) => ({ ...prev, week: currentWeek }));
    }
  }, [isOpen, currentWeek]);

  // Reset unit when course changes
  useEffect(() => {
    setFormData(prev => ({ ...prev, unit_id: "" }));
    // Remove unit_id from touched fields when course changes
    setTouchedFields(prev => {
      const newTouched = new Set(prev);
      newTouched.delete('unit_id');
      return newTouched;
    });
  }, [formData.course_id]);

  // Filter units based on selected course
  const availableUnits = units.filter(unit => unit.course_id === formData.course_id);

  // Get unit name for the selected unit
  const getUnitName = () => {
    const selectedUnit = availableUnits.find(unit => 
      (unit.id || unit.unit_id) === formData.unit_id
    );
    return selectedUnit ? (selectedUnit.name || selectedUnit.unit_name || '') : '';
  };

  // Enhanced form validation
  const isFormValid = () => {
    // Check all required fields
    const basicValidation = requiredFields.every(field => {
      const value = formData[field];
      if (typeof value === 'string') {
        return value && value.trim() !== '';
      }
      if (typeof value === 'number') {
        return value > 0;
      }
      return value !== null && value !== undefined && value !== '';
    });
    
    // Additional validation for unit_name
    const unitName = getUnitName();
    const hasValidUnit = unitName && unitName.trim() !== '';
    
    // Validate numeric fields
    const hasValidNumbers = formData.total_marks > 0 && formData.number_of_questions > 0 && formData.week > 0;
    
    return basicValidation && hasValidUnit && hasValidNumbers;
  };

  // Check if a field is required and invalid
  const isFieldInvalid = (fieldName) => {
    const isRequired = requiredFields.includes(fieldName);
    const isTouched = touchedFields.has(fieldName);
    const value = formData[fieldName];
    
    let isEmpty = false;
    if (typeof value === 'string') {
      isEmpty = !value || value.trim() === '';
    } else if (typeof value === 'number') {
      isEmpty = value <= 0;
    } else {
      isEmpty = !value;
    }
    
    return isRequired && isTouched && isEmpty;
  };

  // Handle field blur to mark as touched
  const handleFieldBlur = (fieldName) => {
    setTouchedFields(prev => new Set([...prev, fieldName]));
  };

  // Enhanced handleSubmit function
  const handleSubmit = (isAI) => {
    // Mark all required fields as touched to show validation errors
    setTouchedFields(new Set(requiredFields));
    
    if (!isFormValid()) {
      console.log('Form validation failed');
      console.log('Current form data:', formData);
      console.log('Unit name:', getUnitName());
      return;
    }

    const unitName = getUnitName();
    if (!unitName) {
      console.error('Unit name is missing');
      return;
    }

    // Ensure proper data types and include all required fields
    const submissionData = {
      title: formData.title.trim(),
      description: formData.description.trim(),
      week: Number(formData.week),
      type: formData.type,
      unit_id: formData.unit_id,
      course_id: formData.course_id,
      questions_type: formData.questions_type,
      topic: formData.topic.trim(),
      total_marks: Number(formData.total_marks),
      unit_name: unitName.trim(),
      difficulty: formData.difficulty,
      number_of_questions: Number(formData.number_of_questions)
    };
    
    console.log('Submitting data:', submissionData);
    onSubmit(submissionData, isAI);
  };

  const handleWeekChange = (e) => {
    const week = parseInt(e.target.value);
    if (week >= 1 && week <= 52) {
      setFormData({ ...formData, week });
    }
  };

  const handleNumberChange = (field, value) => {
    const numValue = parseInt(value) || 0;
    if (numValue >= 0) {
      setFormData({ ...formData, [field]: numValue });
    }
  };

  // Reset touched fields when modal closes
  useEffect(() => {
    if (!isOpen) {
      setTouchedFields(new Set());
      // Reset form data when modal closes
      setFormData({
        title: "",
        description: "",
        type: "CAT",
        unit_id: "",
        course_id: "",
        questions_type: "close-ended",
        topic: "",
        total_marks: 20,
        difficulty: "intermediate",
        number_of_questions: 5,
        week: currentWeek,
      });
    }
  }, [isOpen, currentWeek]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-xl max-w-2xl w-full max-h-screen overflow-y-auto"
      >
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">
            Create New Assessment
          </h2>
          <p className="text-gray-600 mt-1">
            Generate with AI or create manually
          </p>
        </div>

        <div className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-rose-500 focus:border-transparent ${
                  isFieldInvalid('title') 
                    ? 'border-red-300 bg-red-50' 
                    : 'border-gray-300'
                }`}
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                onBlur={() => handleFieldBlur('title')}
                placeholder="Assessment title"
              />
              {isFieldInvalid('title') && (
                <p className="text-red-500 text-xs mt-1">Title is required</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Type <span className="text-red-500">*</span>
              </label>
              <select
                className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-rose-500 focus:border-transparent ${
                  isFieldInvalid('type') 
                    ? 'border-red-300 bg-red-50' 
                    : 'border-gray-300'
                }`}
                value={formData.type}
                onChange={(e) =>
                  setFormData({ ...formData, type: e.target.value })
                }
                onBlur={() => handleFieldBlur('type')}
              >
                <option value="CAT">CAT</option>
                <option value="assignment">Assignment</option>
              </select>
              {isFieldInvalid('type') && (
                <p className="text-red-500 text-xs mt-1">Type is required</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-rose-500 focus:border-transparent ${
                isFieldInvalid('description') 
                  ? 'border-red-300 bg-red-50' 
                  : 'border-gray-300'
              }`}
              rows={3}
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              onBlur={() => handleFieldBlur('description')}
              placeholder="Assessment description"
            />
            {isFieldInvalid('description') && (
              <p className="text-red-500 text-xs mt-1">Description is required</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Course <span className="text-red-500">*</span>
              </label>
              <select
                className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-rose-500 focus:border-transparent ${
                  isFieldInvalid('course_id') 
                    ? 'border-red-300 bg-red-50' 
                    : 'border-gray-300'
                }`}
                value={formData.course_id}
                onChange={(e) =>
                  setFormData({ ...formData, course_id: e.target.value })
                }
                onBlur={() => handleFieldBlur('course_id')}
              >
                <option value="">Select Course</option>
                {courses.map((course) => (
                  <option key={course.id} value={course.id}>
                    {course.name} ({course.code})
                  </option>
                ))}
              </select>
              {isFieldInvalid('course_id') && (
                <p className="text-red-500 text-xs mt-1">Course is required</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Unit <span className="text-red-500">*</span>
              </label>
              <select
                className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-rose-500 focus:border-transparent ${
                  isFieldInvalid('unit_id') 
                    ? 'border-red-300 bg-red-50' 
                    : 'border-gray-300'
                }`}
                value={formData.unit_id}
                onChange={(e) =>
                  setFormData({ ...formData, unit_id: e.target.value })
                }
                onBlur={() => handleFieldBlur('unit_id')}
                disabled={!formData.course_id}
              >
                <option value="">
                  {!formData.course_id ? "Select Course First" : "Select Unit"}
                </option>
                {availableUnits.map((unit) => (
                  <option key={unit.id || unit.unit_id} value={unit.id || unit.unit_id}>
                    {unit.name || unit.unit_name || 'Unnamed Unit'} 
                    {unit.code || unit.unit_code ? ` (${unit.code || unit.unit_code})` : ''}
                  </option>
                ))}
              </select>
              {!formData.course_id && (
                <p className="text-xs text-gray-500 mt-1">
                  Please select a course first to see available units
                </p>
              )}
              {formData.course_id && availableUnits.length === 0 && (
                <p className="text-xs text-yellow-600 mt-1">
                  No units found for selected course
                </p>
              )}
              {isFieldInvalid('unit_id') && formData.course_id && (
                <p className="text-red-500 text-xs mt-1">Unit is required</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <div className="flex items-center space-x-1">
                  <Calendar className="w-4 h-4" />
                  <span>Week <span className="text-red-500">*</span></span>
                </div>
              </label>
              <input
                type="number"
                min="1"
                max="52"
                className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-rose-500 focus:border-transparent ${
                  isFieldInvalid('week') 
                    ? 'border-red-300 bg-red-50' 
                    : 'border-gray-300'
                }`}
                value={formData.week}
                onChange={handleWeekChange}
                onBlur={() => handleFieldBlur('week')}
                placeholder={`Current: ${currentWeek}`}
              />
              {isFieldInvalid('week') && (
                <p className="text-red-500 text-xs mt-1">Valid week is required (1-52)</p>
              )}
              <p className="text-xs text-gray-500 mt-1">
                Current week: {currentWeek}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Question Type <span className="text-red-500">*</span>
              </label>
              <select
                className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-rose-500 focus:border-transparent ${
                  isFieldInvalid('questions_type') 
                    ? 'border-red-300 bg-red-50' 
                    : 'border-gray-300'
                }`}
                value={formData.questions_type}
                onChange={(e) =>
                  setFormData({ ...formData, questions_type: e.target.value })
                }
                onBlur={() => handleFieldBlur('questions_type')}
              >
                <option value="close-ended">Close-ended</option>
                <option value="open-ended">Open-ended</option>
              </select>
              {isFieldInvalid('questions_type') && (
                <p className="text-red-500 text-xs mt-1">Question type is required</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Difficulty <span className="text-red-500">*</span>
              </label>
              <select
                className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-rose-500 focus:border-transparent ${
                  isFieldInvalid('difficulty') 
                    ? 'border-red-300 bg-red-50' 
                    : 'border-gray-300'
                }`}
                value={formData.difficulty}
                onChange={(e) =>
                  setFormData({ ...formData, difficulty: e.target.value })
                }
                onBlur={() => handleFieldBlur('difficulty')}
              >
                <option value="easy">Easy</option>
                <option value="intermediate">Intermediate</option>
                <option value="hard">Hard</option>
              </select>
              {isFieldInvalid('difficulty') && (
                <p className="text-red-500 text-xs mt-1">Difficulty is required</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Topic <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-rose-500 focus:border-transparent ${
                isFieldInvalid('topic') 
                  ? 'border-red-300 bg-red-50' 
                  : 'border-gray-300'
              }`}
              value={formData.topic}
              onChange={(e) =>
                setFormData({ ...formData, topic: e.target.value })
              }
              onBlur={() => handleFieldBlur('topic')}
              placeholder="Main topic or subject area"
            />
            {isFieldInvalid('topic') && (
              <p className="text-red-500 text-xs mt-1">Topic is required</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Total Marks <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-rose-500 focus:border-transparent ${
                  isFieldInvalid('total_marks') 
                    ? 'border-red-300 bg-red-50' 
                    : 'border-gray-300'
                }`}
                value={formData.total_marks}
                onChange={(e) =>
                  handleNumberChange('total_marks', e.target.value)
                }
                onBlur={() => handleFieldBlur('total_marks')}
                min="1"
                placeholder="e.g., 20"
              />
              {isFieldInvalid('total_marks') && (
                <p className="text-red-500 text-xs mt-1">Total marks must be greater than 0</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Number of Questions <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-rose-500 focus:border-transparent ${
                  isFieldInvalid('number_of_questions') 
                    ? 'border-red-300 bg-red-50' 
                    : 'border-gray-300'
                }`}
                value={formData.number_of_questions}
                onChange={(e) =>
                  handleNumberChange('number_of_questions', e.target.value)
                }
                onBlur={() => handleFieldBlur('number_of_questions')}
                min="1"
                placeholder="e.g., 5"
              />
              {isFieldInvalid('number_of_questions') && (
                <p className="text-red-500 text-xs mt-1">Number of questions must be greater than 0</p>
              )}
            </div>
          </div>

          {/* Debug info - remove in production */}
          {/* {process.env.NODE_ENV === 'development' && (
            <div className="bg-gray-50 p-3 rounded-lg text-xs">
              <p><strong>Debug Info:</strong></p>
              <p>Form Valid: {isFormValid() ? 'Yes' : 'No'}</p>
              <p>Unit Name: {getUnitName() || 'None selected'}</p>
              <p>Available Units: {availableUnits.length}</p>
              <p>Units Data: {JSON.stringify(availableUnits, null, 2)}</p>
              <p>Touched Fields: {Array.from(touchedFields).join(', ')}</p>
            </div>
          )} */}
        </div>

        <div className="p-6 border-t border-gray-200 flex justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium"
            disabled={loading}
          >
            Cancel
          </button>
          <div className="flex space-x-3">
            <button
              onClick={() => handleSubmit(false)}
              disabled={loading || !isFormValid()}
              className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <User className="w-4 h-4 mr-2" />
              )}
              Create Manually
            </button>
            <button
              onClick={() => handleSubmit(true)}
              disabled={loading || !isFormValid()}
              className="flex items-center px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              title={!isFormValid() ? 'Please fill all required fields' : 'Generate assessment with AI'}
            >
              {loading ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Wand2 className="w-4 h-4 mr-2" />
              )}
              Generate with AI
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

const AddQuestionModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (questionData: any) => void;
  assessmentId: string;
  loading: boolean;
}> = ({ isOpen, onClose, onSubmit, assessmentId, loading }) => {
  const [questionData, setQuestionData] = useState({
    text: "",
    marks: 4,
    type: "close-ended",
    rubric: "",
    correct_answer: "",
  });

  const handleSubmit = () => {
    onSubmit(questionData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-xl max-w-lg w-full"
      >
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">Add Question</h2>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Question Text
            </label>
            <textarea
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-rose-500 focus:border-transparent"
              rows={3}
              value={questionData.text}
              onChange={(e) =>
                setQuestionData({ ...questionData, text: e.target.value })
              }
              placeholder="Enter your question"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Marks
              </label>
              <input
                type="number"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                value={questionData.marks}
                onChange={(e) =>
                  setQuestionData({
                    ...questionData,
                    marks: parseInt(e.target.value),
                  })
                }
                min="1"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Type
              </label>
              <select
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                value={questionData.type}
                onChange={(e) =>
                  setQuestionData({ ...questionData, type: e.target.value })
                }
              >
                <option value="close-ended">Close-ended</option>
                <option value="open-ended">Open-ended</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Rubric
            </label>
            <textarea
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-rose-500 focus:border-transparent"
              rows={2}
              value={questionData.rubric}
              onChange={(e) =>
                setQuestionData({ ...questionData, rubric: e.target.value })
              }
              placeholder="Marking criteria and rubric"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Correct Answer
            </label>
            <textarea
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-rose-500 focus:border-transparent"
              rows={2}
              value={questionData.correct_answer}
              onChange={(e) =>
                setQuestionData({
                  ...questionData,
                  correct_answer: e.target.value,
                })
              }
              placeholder="Expected answer or answer key"
            />
          </div>
        </div>

        <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="flex items-center px-4 py-2 bg-rose-500 text-white rounded-lg hover:bg-rose-600 disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Plus className="w-4 h-4 mr-2" />
            )}
            Add Question
          </button>
        </div>
      </motion.div>
    </div>
  );
};

const ViewQuestionsModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  assessment: Assessment | null;
  questions: Question[];
  loading: boolean;
}> = ({ isOpen, onClose, assessment, questions, loading }) => {
  if (!isOpen || !assessment) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-xl max-w-4xl w-full max-h-screen overflow-y-auto"
      >
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">
            {assessment.title} - Questions
          </h2>
          <p className="text-gray-600 mt-1">
            {questions.length} question{questions.length !== 1 ? "s" : ""} •
            Total: {assessment.total_marks} marks • Week {assessment.week}
          </p>
        </div>

        <div className="p-6">
          {loading ? (
            <div className="text-center py-8">
              <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-gray-400" />
              <p className="text-gray-600">Loading questions...</p>
            </div>
          ) : questions.length === 0 ? (
            <div className="text-center py-8">
              <ClipboardList className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-600 mb-2">
                No questions yet
              </h3>
              <p className="text-gray-500">
                This assessment doesn't have any questions yet.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {questions.map((question, index) => (
                <div
                  key={question.id}
                  className="border border-gray-200 rounded-lg p-4"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium text-gray-800">
                      Question {index + 1}
                    </h4>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-500">
                        {question.marks} mark{question.marks !== 1 ? "s" : ""}
                      </span>
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          question.type === "open-ended"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-green-100 text-green-700"
                        }`}
                      >
                        {question.type}
                      </span>
                    </div>
                  </div>
                  <p className="text-gray-700 mb-3">{question.text}</p>
                  {question.rubric && (
                    <div className="mb-2">
                      <p className="text-sm font-medium text-gray-600 mb-1">
                        Rubric:
                      </p>
                      <p className="text-sm text-gray-600">{question.rubric}</p>
                    </div>
                  )}
                  {question.correct_answer && (
                    <div>
                      <p className="text-sm font-medium text-gray-600 mb-1">
                        Expected Answer:
                      </p>
                      <p className="text-sm text-gray-600">
                        {question.correct_answer}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="p-6 border-t border-gray-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 font-medium"
          >
            Close
          </button>
        </div>
      </motion.div>
    </div>
  );
};

const AssessmentStatsCards: React.FC<{ assessments: Assessment[] }> = ({
  assessments,
}) => {
  const totalAssessments = assessments.length;
  const catAssessments = assessments.filter((a) => a.type === "CAT").length;
  const assignmentAssessments = assessments.filter(
    (a) => a.type === "assignment"
  ).length;
  const verifiedAssessments = assessments.filter((a) => a.verified).length;

  const statsData = [
    {
      icon: BookMarked,
      label: "Total Assessments",
      value: totalAssessments.toString(),
      color: "bg-blue-100 text-blue-600",
    },
    {
      icon: ClipboardList,
      label: "CATs",
      value: catAssessments.toString(),
      color: "bg-green-100 text-green-600",
    },
    {
      icon: FileCheck,
      label: "Assignments",
      value: assignmentAssessments.toString(),
      color: "bg-purple-100 text-purple-600",
    },
    {
      icon: CheckCircle,
      label: "Verified",
      value: verifiedAssessments.toString(),
      color: "bg-yellow-100 text-yellow-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-6">
      {statsData.map((stat, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex items-center space-x-4"
        >
          <div className={`p-2 rounded-full ${stat.color}`}>
            <stat.icon className="w-6 h-6" />
          </div>
          <div>
            <div className="text-lg font-bold">{stat.value}</div>
            <div className="text-sm text-gray-500">{stat.label}</div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

const TypeAndCourseSelector: React.FC<{
  selectedType: string;
  selectedCourse: string;
  onTypeChange: (type: string) => void;
  onCourseChange: (courseId: string) => void;
  courses: Course[];
}> = ({
  selectedType,
  selectedCourse,
  onTypeChange,
  onCourseChange,
  courses,
}) => (
  <div className="flex flex-col md:flex-row md:space-x-4 mb-6 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
    <div className="flex-1 mb-3 md:mb-0">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Filter by Type
      </label>
      <select
        className="border border-gray-300 p-3 w-full rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent bg-white"
        value={selectedType}
        onChange={(e) => onTypeChange(e.target.value)}
      >
        <option value="">All Types</option>
        <option value="CAT">CATs</option>
        <option value="assignment">Assignments</option>
      </select>
    </div>
    <div className="flex-1">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Filter by Course
      </label>
      <select
        className="border border-gray-300 p-3 w-full rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent bg-white"
        value={selectedCourse}
        onChange={(e) => onCourseChange(e.target.value)}
      >
        <option value="">All Courses</option>
        {courses.map((course) => (
          <option key={course.id} value={course.id}>
            {course.name} ({course.code})
          </option>
        ))}
      </select>
    </div>
  </div>
);

const AssessmentCard: React.FC<{
  assessment: Assessment;
  onView: (assessment: Assessment) => void;
  onEdit: (assessment: Assessment) => void;
  onDelete: (id: string) => void;
  onAddQuestion: (assessment: Assessment) => void;
  onVerify: (id: string) => void;
  index: number;
  courses: Course[];
}> = ({
  assessment,
  onView,
  onEdit,
  onDelete,
  onAddQuestion,
  onVerify,
  index,
  courses,
}) => {
  const course = getCourseByCode(assessment.course_id, courses);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow"
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-800 mb-1">
            {assessment.title}
          </h3>
          <div className="flex items-center space-x-2 mb-2">
            {course && (
              <>
                <span
                  className={`inline-block w-3 h-3 rounded-full ${course.color}`}
                ></span>
                <span className="text-sm text-gray-600">
                  {assessment.unit_id}
                </span>
              </>
            )}
            <span className="text-xs text-gray-500">•</span>
            <span className="text-xs text-gray-500 flex items-center">
              <Calendar className="w-3 h-3 mr-1" />
              Week {assessment.week}
            </span>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium ${getDifficultyColor(
              assessment.difficulty
            )}`}
          >
            {assessment.difficulty}
          </span>
          {assessment.verified ? (
            <CheckCircle className="w-5 h-5 text-green-500" />
          ) : (
            <AlertCircle className="w-5 h-5 text-yellow-500" />
          )}
        </div>
      </div>

      <p className="text-sm text-gray-600 mb-4 line-clamp-2">
        {assessment.description}
      </p>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="text-sm">
          <span className="text-gray-500">Questions:</span>
          <span className="ml-2 font-medium">
            {assessment.number_of_questions}
          </span>
        </div>
        <div className="text-sm">
          <span className="text-gray-500">Marks:</span>
          <span className="ml-2 font-medium">{assessment.total_marks}</span>
        </div>
        <div className="text-sm">
          <span className="text-gray-500">Type:</span>
          <span className="ml-2 font-medium capitalize">
            {assessment.questions_type}
          </span>
        </div>
        <div className="text-sm">
          <span className="text-gray-500">Topic:</span>
          <span className="ml-2 font-medium">{assessment.topic}</span>
        </div>
      </div>

      <div className="flex justify-between items-center pt-4 border-t border-gray-100">
        <span className="text-xs text-gray-500">
          Created {formatDate(assessment.created_at)}
        </span>
        <div className="flex space-x-2">
          <button
            onClick={() => onView(assessment)}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium px-3 py-1 rounded border border-blue-200 hover:bg-blue-50 transition-colors flex items-center"
          >
            <Eye className="w-3 h-3 mr-1" />
            View
          </button>
          <button
            onClick={() => onAddQuestion(assessment)}
            className="text-green-600 hover:text-green-800 text-sm font-medium px-3 py-1 rounded border border-green-200 hover:bg-green-50 transition-colors"
          >
            Add Q
          </button>
          {!assessment.verified && (
            <button
              onClick={() => onVerify(assessment.id)}
              className="text-purple-600 hover:text-purple-800 text-sm font-medium px-3 py-1 rounded border border-purple-200 hover:bg-purple-50 transition-colors"
            >
              Verify
            </button>
          )}
          <button
            onClick={() => onDelete(assessment.id)}
            className="text-red-600 hover:text-red-800 text-sm font-medium px-3 py-1 rounded border border-red-200 hover:bg-red-50 transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </motion.div>
  );
};

// ===== MAIN COMPONENT =====
const AssessmentsDashboard: React.FC = () => {
  const { sidebarCollapsed, isMobileView, isTabletView } = useLayout();
  const [loading, setLoading] = useState(true);
  const [hasContent, setHasContent] = useState(false);
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [units, setUnits] = useState<Unit[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isQuestionModalOpen, setIsQuestionModalOpen] = useState(false);
  const [isViewQuestionsModalOpen, setIsViewQuestionsModalOpen] =
    useState(false);
  const [selectedAssessment, setSelectedAssessment] =
    useState<Assessment | null>(null);
  const [selectedType, setSelectedType] = useState<string>("");
  const [selectedCourse, setSelectedCourse] = useState<string>("");
  const [createLoading, setCreateLoading] = useState(false);
  const [questionLoading, setQuestionLoading] = useState(false);
  const [questionsLoading, setQuestionsLoading] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Filter assessments by type and course
  const filteredAssessments = assessments.filter(
    (assessment) =>
      (selectedType === "" || assessment.type === selectedType) &&
      (selectedCourse === "" || assessment.course_id === selectedCourse)
  );

  // Load data on component mount
  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Load courses, units, and assessments in parallel
      const [coursesData, unitsData, assessmentsData] = await Promise.all([
        api.getCourses(),
        api.getUnits(),
        api.getAssessments(),
      ]);

      setCourses(coursesData);
      setUnits(unitsData);
      setAssessments(assessmentsData);
      setHasContent(assessmentsData.length > 0);
    } catch (error) {
      console.error("Error loading data:", error);
      setError("Failed to load data. Please try again.");
      setHasContent(false);
    } finally {
      setLoading(false);
    }
  };

  const loadAssessments = async () => {
    try {
      setError(null);
      const data = await api.getAssessments();
      setAssessments(data);
      setHasContent(data.length > 0);
    } catch (error) {
      console.error("Error loading assessments:", error);
      setError("Failed to load assessments. Please try again.");
    }
  };

  const handleCreateAssessment = async (formData: any, isAI: boolean) => {
    try {
      setCreateLoading(true);
      setError(null);

      let response;
      if (isAI) {
        response = await api.generateAssessment(formData);
      } else {
        response = await api.createAssessment(formData);
      }

      // Reload assessments to get the updated list
      await loadAssessments();
      setIsCreateModalOpen(false);

      alert(
        `Assessment "${response.title}" ${
          isAI ? "generated" : "created"
        } successfully!`
      );
    } catch (error) {
      console.error("Error creating assessment:", error);
      alert("Failed to create assessment. Please try again.");
    } finally {
      setCreateLoading(false);
    }
  };

  const handleAddQuestion = async (questionData: any) => {
    if (!selectedAssessment) return;

    try {
      setQuestionLoading(true);
      setError(null);

      await api.addQuestion(selectedAssessment.id, questionData);
      setIsQuestionModalOpen(false);
      alert("Question added successfully!");
    } catch (error) {
      console.error("Error adding question:", error);
      alert("Failed to add question. Please try again.");
    } finally {
      setQuestionLoading(false);
    }
  };

  const handleVerifyAssessment = async (assessmentId: string) => {
    try {
      setError(null);
      const response = await api.verifyAssessment(assessmentId);

      // Update local state
      setAssessments((prev) =>
        prev.map((assessment) =>
          assessment.id === assessmentId
            ? { ...assessment, verified: true }
            : assessment
        )
      );

      alert(`Assessment "${response.title}" verified successfully!`);
    } catch (error) {
      console.error("Error verifying assessment:", error);
      alert("Failed to verify assessment. Please try again.");
    }
  };

  const handleDeleteAssessment = (assessmentId: string) => {
    if (confirm("Are you sure you want to delete this assessment?")) {
      // Note: The API doesn't have a delete endpoint for assessments
      // You might need to implement this on the backend
      setAssessments((prev) =>
        prev.filter((assessment) => assessment.id !== assessmentId)
      );
      alert("Assessment deleted successfully!");
    }
  };

  const handleViewQuestions = async (assessment: Assessment) => {
    try {
      setSelectedAssessment(assessment);
      setIsViewQuestionsModalOpen(true);
      setQuestionsLoading(true);
      setError(null);

      const questionsData = await api.getQuestions(assessment.id);
      setQuestions(questionsData);
    } catch (error) {
      console.error("Error loading questions:", error);
      setQuestions([]);
      alert("Failed to load questions. Please try again.");
    } finally {
      setQuestionsLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen bg-gray-50">
        <Sidebar />

        <motion.div
          initial={{
            marginLeft:
              !isMobileView && !isTabletView
                ? sidebarCollapsed
                  ? 80
                  : 240
                : 0,
          }}
          animate={{
            marginLeft:
              !isMobileView && !isTabletView
                ? sidebarCollapsed
                  ? 80
                  : 240
                : 0,
          }}
          transition={{ duration: 0.3 }}
          className="flex-1 overflow-auto"
        >
          <Header title="Assessments" showWeekSelector={false} />

          <main className="p-4 md:p-6">
            <div className="max-w-7xl mx-auto">
              {/* Skeleton Loading */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 animate-pulse"
                  >
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

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 animate-pulse"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-2/3">
                        <div className="h-5 bg-gray-300 rounded mb-2"></div>
                        <div className="h-4 bg-gray-200 rounded mb-3"></div>
                      </div>
                      <div className="w-16 h-6 bg-gray-200 rounded-full"></div>
                    </div>
                    <div className="space-y-2 mb-4">
                      <div className="h-3 bg-gray-200 rounded"></div>
                      <div className="h-3 bg-gray-200 rounded w-4/5"></div>
                    </div>
                    <div className="h-8 bg-gray-200 rounded"></div>
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
          marginLeft:
            !isMobileView && !isTabletView ? (sidebarCollapsed ? 80 : 240) : 0,
        }}
        animate={{
          marginLeft:
            !isMobileView && !isTabletView ? (sidebarCollapsed ? 80 : 240) : 0,
        }}
        transition={{ duration: 0.3 }}
        className="flex-1 overflow-auto"
      >
        <Header title="Assessments" showWeekSelector={hasContent} />

        <main className="p-4 md:p-6">
          {error && (
            <div className="max-w-7xl mx-auto mb-6">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center justify-between">
                <div className="flex items-center">
                  <AlertCircle className="w-5 h-5 text-red-600 mr-3" />
                  <span className="text-red-800">{error}</span>
                </div>
                <button
                  onClick={loadInitialData}
                  className="text-red-600 hover:text-red-800 flex items-center"
                >
                  <RefreshCw className="w-4 h-4 mr-1" />
                  Retry
                </button>
              </div>
            </div>
          )}

          {!hasContent ? (
            <div className="max-w-4xl mx-auto">
              <EmptyState
                title="No Assessments Created"
                description="Create your first assessment to get started. You can generate assessments with AI or create them manually with custom questions."
                icon={<BookMarked size={48} />}
                onAction={() => setIsCreateModalOpen(true)}
                actionLabel="Create Assessment"
              />
            </div>
          ) : (
            <div className="max-w-7xl mx-auto">
              <div className="mb-6">
                <h1 className="text-2xl lg:text-3xl font-bold text-gray-800">
                  Assessment Management
                </h1>
                <p className="text-gray-600 mt-2">
                  Create, manage, and organize your assessments
                </p>
              </div>

              <TypeAndCourseSelector
                selectedType={selectedType}
                selectedCourse={selectedCourse}
                onTypeChange={setSelectedType}
                onCourseChange={setSelectedCourse}
                courses={courses}
              />

              <AssessmentStatsCards assessments={filteredAssessments} />

              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-800">
                      Assessments
                      {selectedType &&
                        ` - ${selectedType === "CAT" ? "CATs" : "Assignments"}`}
                      {selectedCourse &&
                        courses.length > 0 &&
                        ` (${
                          getCourseByCode(selectedCourse, courses)?.code ||
                          "Unknown"
                        })`}
                    </h2>
                    <p className="text-sm text-gray-600 mt-1">
                      {filteredAssessments.length} assessment
                      {filteredAssessments.length !== 1 ? "s" : ""} found
                    </p>
                  </div>
                  <div className="flex space-x-3">
                    <button
                      onClick={loadAssessments}
                      className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors flex items-center"
                    >
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Refresh
                    </button>
                    <button
                      onClick={() => setIsCreateModalOpen(true)}
                      className="bg-rose-500 text-white px-4 py-2 rounded-lg hover:bg-rose-600 transition-colors flex items-center"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      New Assessment
                    </button>
                  </div>
                </div>

                {filteredAssessments.length === 0 ? (
                  <div className="text-center py-12">
                    <BookMarked className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-600 mb-2">
                      No assessments found
                    </h3>
                    <p className="text-gray-500 mb-4">
                      {selectedType || selectedCourse
                        ? `No assessments match your current filters`
                        : `Create your first assessment to get started`}
                    </p>
                    <button
                      onClick={() => setIsCreateModalOpen(true)}
                      className="bg-rose-500 text-white px-6 py-3 rounded-lg hover:bg-rose-600 transition-colors inline-flex items-center"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Create Assessment
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredAssessments.map((assessment, index) => (
                      <AssessmentCard
                        key={assessment.id}
                        assessment={assessment}
                        index={index}
                        onView={handleViewQuestions}
                        onEdit={(assessment) =>
                          console.log("Edit:", assessment)
                        }
                        onDelete={handleDeleteAssessment}
                        onAddQuestion={(assessment) => {
                          setSelectedAssessment(assessment);
                          setIsQuestionModalOpen(true);
                        }}
                        onVerify={handleVerifyAssessment}
                        courses={courses}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </main>
      </motion.div>

      {/* Create Assessment Modal */}
      <CreateAssessmentModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateAssessment}
        loading={createLoading}
        courses={courses}
        units={units}
      />

      {/* Add Question Modal */}
      <AddQuestionModal
        isOpen={isQuestionModalOpen}
        onClose={() => setIsQuestionModalOpen(false)}
        onSubmit={handleAddQuestion}
        assessmentId={selectedAssessment?.id || ""}
        loading={questionLoading}
      />

      {/* View Questions Modal */}
      <ViewQuestionsModal
        isOpen={isViewQuestionsModalOpen}
        onClose={() => setIsViewQuestionsModalOpen(false)}
        assessment={selectedAssessment}
        questions={questions}
        loading={questionsLoading}
      />
    </div>
  );
};

export default AssessmentsDashboard;
