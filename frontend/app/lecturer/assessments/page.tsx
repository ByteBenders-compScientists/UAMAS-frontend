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
  type: "CAT" | "Assignment" | "Case Study";
  unit_id: string;
  course_id: string;
  questions_type: "open-ended" | "close-ended";
  close_ended_type?: string;
  topic: string;
  total_marks: number;
  difficulty: "Easy" | "Intermediate" | "Advance";
  number_of_questions: number;
  blooms_level: "Remember" | "Understand" | "Apply" | "Analyze" | "Evaluate" | "Create";
  deadline?: string;
  duration?: number;
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
  choices?: string[];
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

// ===== API FUNCTIONS =====
const api = {
  getCourses: async (): Promise<Course[]> => {
    const response = await fetch(`${API_BASE_URL}/auth/lecturer/courses`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });
    if (!response.ok) throw new Error("Failed to fetch courses");
    return response.json();
  },

  getUnits: async (): Promise<Unit[]> => {
    const response = await fetch(`${API_BASE_URL}/auth/lecturer/units`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });
    if (!response.ok) throw new Error("Failed to fetch units");
    return response.json();
  },

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

  generateAssessment: async (
    data: any
  ): Promise<{ assessment_id: string; message: string; title: string }> => {
    const response = await fetch(
      `${API_BASE_URL}/bd/lecturer/ai/generate-assessments`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(data),
      }
    );

    if (!response.ok) throw new Error("Failed to generate assessment");
    return response.json();
  },

  createAssessment: async (
    data: any
  ): Promise<{ assessment_id: string; message: string; title: string }> => {
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
    
    if (!response.ok) throw new Error("Failed to create assessment");
    return response.json();
  },

  verifyAssessment: async (
    assessmentId: string
  ): Promise<{ assessment_id: string; message: string; title: string }> => {
    const response = await fetch(
      `${API_BASE_URL}/bd/lecturer/assessments/${assessmentId}/verify`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      }
    );
    if (!response.ok) throw new Error("Failed to verify assessment");
    return response.json();
  },

  deleteAssessment: async (assessmentId: string): Promise<{ message: string }> => {
    const response = await fetch(
      `${API_BASE_URL}/bd/lecturer/assessments/${assessmentId}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      }
    );
    if (!response.ok) throw new Error("Failed to delete assessment");
    return response.json();
  },

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

  if (!course.color) {
    const colorIndex =
      courses.findIndex((c) => c.id === courseId) % COURSE_COLORS.length;
    course.color = COURSE_COLORS[colorIndex];
  }

  return course;
};

const getDifficultyColor = (difficulty: string) => {
  switch (difficulty) {
    case "Easy":
      return "bg-green-100 text-green-700";
    case "Intermediate":
      return "bg-yellow-100 text-yellow-700";
    case "Advance":
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
  units,
}) => {
  const { currentWeek } = useLayout();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    week: currentWeek,
    type: "CAT",
    unit_id: "",
    questions_type: "close-ended",
    close_ended_type: "multiple choice with one answer",
    topic: "",
    total_marks: "20",
    difficulty: "Intermediate",
    number_of_questions: "10",
    blooms_level: "Remember",
    deadline: "",
    duration: "",
  });

  const [touchedFields, setTouchedFields] = useState(new Set());

  const requiredFields = [
    "title",
    "description",
    "week",
    "type",
    "unit_id",
    "questions_type",
    "topic",
    "total_marks",
    "difficulty",
    "number_of_questions",
    "blooms_level",
  ];

  useEffect(() => {
    if (isOpen) {
      setFormData((prev) => ({ ...prev, week: currentWeek }));
    }
  }, [isOpen, currentWeek]);

  useEffect(() => {
    setFormData((prev) => ({ ...prev, unit_id: "" }));
    setTouchedFields((prev) => {
      const newTouched = new Set(prev);
      newTouched.delete("unit_id");
      return newTouched;
    });
  }, [formData.course_id]);

  // Reset close_ended_type when questions_type changes
  useEffect(() => {
    if (formData.questions_type === "open-ended") {
      setFormData((prev) => ({ ...prev, close_ended_type: "" }));
    } else {
      setFormData((prev) => ({ 
        ...prev, 
        close_ended_type: "multiple choice with one answer" 
      }));
    }
  }, [formData.questions_type]);

  const availableUnits = units.filter(
    (unit) => unit.course_id === formData.course_id
  );

   const getUnitName = () => {
    const selectedUnit = availableUnits.find(unit => 
      (unit.id || unit.unit_id) === formData.unit_id
    );
    return selectedUnit ? (selectedUnit.name || selectedUnit.unit_name || '') : '';
  };

  const isFormValid = () => {
    const basicValidation = requiredFields.every((field) => {
      const value = formData[field];
      if (typeof value === "string") {
        return value && value.trim() !== "";
      }
      if (typeof value === "number") {
        return value > 0;
      }
      return value !== null && value !== undefined && value !== "";
    });

     const unitName = getUnitName();
     const hasValidUnit = unitName && unitName.trim() !== '';

    const hasValidNumbers =
      parseInt(formData.total_marks) > 0 &&
      parseInt(formData.number_of_questions) > 0 &&
      formData.week > 0;

    return basicValidation && hasValidNumbers && hasValidUnit;
  };

 

  const isFieldInvalid = (fieldName) => {
    const isRequired = requiredFields.includes(fieldName);
    const isTouched = touchedFields.has(fieldName);
    const value = formData[fieldName];

    let isEmpty = false;
    if (typeof value === "string") {
      isEmpty = !value || value.trim() === "";
    } else if (typeof value === "number") {
      isEmpty = value <= 0;
    } else {
      isEmpty = !value;
    }

    return isRequired && isTouched && isEmpty;
  };

  const handleFieldBlur = (fieldName) => {
    setTouchedFields((prev) => new Set([...prev, fieldName]));
  };

  const handleSubmit = (isAI) => {
    setTouchedFields(new Set(requiredFields));

    if (!isFormValid()) {
      console.log("Form validation failed");
      return;
    }
    const unitName = getUnitName();
    if (!unitName) {
      console.error('Unit name is missing');
      return;
    }

    // Prepare submission data exactly as API expects
    const submissionData = {
      title: formData.title.trim(),
      description: formData.description.trim(),
      week: parseInt(formData.week.toString()),
      type: formData.type,
      unit_id: formData.unit_id,
      questions_type: formData.questions_type,
      close_ended_type: formData.questions_type === "close-ended" ? formData.close_ended_type : "",
      topic: formData.topic.trim(),
      total_marks: formData.total_marks,
      unit_name: unitName.trim(),
      difficulty: formData.difficulty,
      number_of_questions: formData.number_of_questions,
      blooms_level: formData.blooms_level,
      deadline: formData.deadline ? `${formData.deadline}T12:00:00Z` : "",
      duration: formData.duration ? parseInt(formData.duration) : "",
    };

    console.log("Submitting data:", submissionData);
    onSubmit(submissionData, isAI);
  };

  const handleWeekChange = (e) => {
    const week = parseInt(e.target.value);
    if (week >= 1 && week <= 52) {
      setFormData({ ...formData, week });
    }
  };

  useEffect(() => {
    if (!isOpen) {
      setTouchedFields(new Set());
      setFormData({
        title: "",
        description: "",
        week: currentWeek,
        type: "CAT",
        unit_id: "",
        questions_type: "close-ended",
        close_ended_type: "multiple choice with one answer",
        topic: "",
        total_marks: "20",
        difficulty: "Intermediate",
        number_of_questions: "10",
        blooms_level: "Remember",
        deadline: "",
        duration: "",
      });
    }
  }, [isOpen, currentWeek]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-xl max-w-4xl w-full max-h-screen overflow-y-auto"
      >
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">
            Create New Assessment
          </h2>
          <p className="text-gray-600 mt-1">
            Generate with AI or create manually
          </p>
        </div>

        <div className="p-6 space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-rose-500 focus:border-transparent ${
                  isFieldInvalid("title")
                    ? "border-red-300 bg-red-50"
                    : "border-gray-300"
                }`}
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                onBlur={() => handleFieldBlur("title")}
                placeholder="Assessment title"
              />
              {isFieldInvalid("title") && (
                <p className="text-red-500 text-xs mt-1">Title is required</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Type <span className="text-red-500">*</span>
              </label>
              <select
                className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-rose-500 focus:border-transparent ${
                  isFieldInvalid("type")
                    ? "border-red-300 bg-red-50"
                    : "border-gray-300"
                }`}
                value={formData.type}
                onChange={(e) =>
                  setFormData({ ...formData, type: e.target.value })
                }
                onBlur={() => handleFieldBlur("type")}
              >
                <option value="CAT">CAT</option>
                <option value="Assignment">Assignment</option>
                <option value="Case Study">Case Study</option>
              </select>
              {isFieldInvalid("type") && (
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
                isFieldInvalid("description")
                  ? "border-red-300 bg-red-50"
                  : "border-gray-300"
              }`}
              rows={3}
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              onBlur={() => handleFieldBlur("description")}
              placeholder="Assessment description"
            />
            {isFieldInvalid("description") && (
              <p className="text-red-500 text-xs mt-1">
                Description is required
              </p>
            )}
          </div>

          {/* Course and Unit Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Course <span className="text-red-500">*</span>
              </label>
              <select
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                value={formData.course_id || ""}
                onChange={(e) =>
                  setFormData({ ...formData, course_id: e.target.value })
                }
              >
                <option value="">Select Course</option>
                {courses.map((course) => (
                  <option key={course.id} value={course.id}>
                    {course.name} ({course.code})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Unit <span className="text-red-500">*</span>
              </label>
              <select
                className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-rose-500 focus:border-transparent ${
                  isFieldInvalid("unit_id")
                    ? "border-red-300 bg-red-50"
                    : "border-gray-300"
                }`}
                value={formData.unit_id}
                onChange={(e) =>
                  setFormData({ ...formData, unit_id: e.target.value })
                }
                onBlur={() => handleFieldBlur("unit_id")}
                disabled={!formData.course_id}
              >
                <option value="">
                  {!formData.course_id ? "Select Course First" : "Select Unit"}
                </option>
                {availableUnits.map((unit) => (
                  <option key={unit.id} value={unit.id}>
                    {unit.unit_name} ({unit.unit_code})
                  </option>
                ))}
              </select>
              {isFieldInvalid("unit_id") && formData.course_id && (
                <p className="text-red-500 text-xs mt-1">Unit is required</p>
              )}
            </div>
          </div>

          {/* Week and Topic */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <div className="flex items-center space-x-1">
                  <Calendar className="w-4 h-4" />
                  <span>
                    Week <span className="text-red-500">*</span>
                  </span>
                </div>
              </label>
              <input
                type="number"
                min="1"
                max="12"
                className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-rose-500 focus:border-transparent ${
                  isFieldInvalid("week")
                    ? "border-red-300 bg-red-50"
                    : "border-gray-300"
                }`}
                value={formData.week}
                onChange={handleWeekChange}
                onBlur={() => handleFieldBlur("week")}
                placeholder={`Current: ${currentWeek}`}
              />
              {isFieldInvalid("week") && (
                <p className="text-red-500 text-xs mt-1">
                  Valid week is required (1-12)
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Topic <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-rose-500 focus:border-transparent ${
                  isFieldInvalid("topic")
                    ? "border-red-300 bg-red-50"
                    : "border-gray-300"
                }`}
                value={formData.topic}
                onChange={(e) =>
                  setFormData({ ...formData, topic: e.target.value })
                }
                onBlur={() => handleFieldBlur("topic")}
                placeholder="Main topic or subject area"
              />
              {isFieldInvalid("topic") && (
                <p className="text-red-500 text-xs mt-1">Topic is required</p>
              )}
            </div>
          </div>

          {/* Question Configuration */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Question Type <span className="text-red-500">*</span>
              </label>
              <select
                className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-rose-500 focus:border-transparent ${
                  isFieldInvalid("questions_type")
                    ? "border-red-300 bg-red-50"
                    : "border-gray-300"
                }`}
                value={formData.questions_type}
                onChange={(e) =>
                  setFormData({ ...formData, questions_type: e.target.value })
                }
                onBlur={() => handleFieldBlur("questions_type")}
              >
                <option value="close-ended">Close-ended</option>
                <option value="open-ended">Open-ended</option>
              </select>
              {isFieldInvalid("questions_type") && (
                <p className="text-red-500 text-xs mt-1">
                  Question type is required
                </p>
              )}
            </div>

            {formData.questions_type === "close-ended" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Close-ended Type <span className="text-red-500">*</span>
                </label>
                <select
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                  value={formData.close_ended_type}
                  onChange={(e) =>
                    setFormData({ ...formData, close_ended_type: e.target.value })
                  }
                >
                  <option value="matching">Matching</option>
                  <option value="multiple choice with one answer">
                    Multiple Choice (Single Answer)
                  </option>
                  <option value="multiple choice with multiple answers">
                    Multiple Choice (Multiple Answers)
                  </option>
                  <option value="true/false">True/False</option>
                </select>
              </div>
            )}
          </div>

          {/* Assessment Configuration */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Difficulty <span className="text-red-500">*</span>
              </label>
              <select
                className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-rose-500 focus:border-transparent ${
                  isFieldInvalid("difficulty")
                    ? "border-red-300 bg-red-50"
                    : "border-gray-300"
                }`}
                value={formData.difficulty}
                onChange={(e) =>
                  setFormData({ ...formData, difficulty: e.target.value })
                }
                onBlur={() => handleFieldBlur("difficulty")}
              >
                <option value="Easy">Easy</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advance">Advanced</option>
              </select>
              {isFieldInvalid("difficulty") && (
                <p className="text-red-500 text-xs mt-1">
                  Difficulty is required
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bloom's Level <span className="text-red-500">*</span>
              </label>
              <select
                className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-rose-500 focus:border-transparent ${
                  isFieldInvalid("blooms_level")
                    ? "border-red-300 bg-red-50"
                    : "border-gray-300"
                }`}
                value={formData.blooms_level}
                onChange={(e) =>
                  setFormData({ ...formData, blooms_level: e.target.value })
                }
                onBlur={() => handleFieldBlur("blooms_level")}
              >
                <option value="Remember">Remember</option>
                <option value="Understand">Understand</option>
                <option value="Apply">Apply</option>
                <option value="Analyze">Analyze</option>
                <option value="Evaluate">Evaluate</option>
                <option value="Create">Create</option>
              </select>
              {isFieldInvalid("blooms_level") && (
                <p className="text-red-500 text-xs mt-1">
                  Bloom's level is required
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Number of Questions <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-rose-500 focus:border-transparent ${
                  isFieldInvalid("number_of_questions")
                    ? "border-red-300 bg-red-50"
                    : "border-gray-300"
                }`}
                value={formData.number_of_questions}
                onChange={(e) =>
                  setFormData({ ...formData, number_of_questions: e.target.value })
                }
                onBlur={() => handleFieldBlur("number_of_questions")}
                placeholder="e.g., 10"
              />
              {isFieldInvalid("number_of_questions") && (
                <p className="text-red-500 text-xs mt-1">
                  Number of questions is required
                </p>
              )}
            </div>
          </div>

          {/* Marks and Optional Fields */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Total Marks <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-rose-500 focus:border-transparent ${
                  isFieldInvalid("total_marks")
                    ? "border-red-300 bg-red-50"
                    : "border-gray-300"
                }`}
                value={formData.total_marks}
                onChange={(e) =>
                  setFormData({ ...formData, total_marks: e.target.value })
                }
                onBlur={() => handleFieldBlur("total_marks")}
                placeholder="e.g., 20"
              />
              {isFieldInvalid("total_marks") && (
                <p className="text-red-500 text-xs mt-1">
                  Total marks is required
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Deadline (Optional)
              </label>
              <input
                type="date"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                value={formData.deadline}
                onChange={(e) =>
                  setFormData({ ...formData, deadline: e.target.value })
                }
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Duration (minutes, Optional)
              </label>
              <input
                type="number"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                value={formData.duration}
                onChange={(e) =>
                  setFormData({ ...formData, duration: e.target.value })
                }
                placeholder="e.g., 30"
                min="1"
              />
            </div>
          </div>
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
              title={
                !isFormValid()
                  ? "Please fill all required fields"
                  : "Generate assessment with AI"
              }
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
    marks: 3,
    type: "open-ended",
    rubric: "Award full marks for correct answer; partial for close guesses",
    correct_answer: "",
    choices: "",
  });

  const handleSubmit = () => {
    onSubmit(questionData);
  };

  useEffect(() => {
    if (!isOpen) {
      setQuestionData({
        text: "",
        marks: 3,
        type: "open-ended",
        rubric: "Award full marks for correct answer; partial for close guesses",
        correct_answer: "",
        choices: "",
      });
    }
  }, [isOpen]);

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
                    marks: parseFloat(e.target.value),
                  })
                }
                min="0"
                step="0.5"
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

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Choices (for close-ended questions)
            </label>
            <textarea
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-rose-500 focus:border-transparent"
              rows={2}
              value={questionData.choices}
              onChange={(e) =>
                setQuestionData({
                  ...questionData,
                  choices: e.target.value,
                })
              }
              placeholder="Enter choices separated by commas"
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
                  {question.choices && question.choices.length > 0 && (
                    <div className="mb-2">
                      <p className="text-sm font-medium text-gray-600 mb-1">
                        Choices:
                      </p>
                      <ul className="text-sm text-gray-600 list-disc list-inside">
                        {question.choices.map((choice, idx) => (
                          <li key={idx}>{choice}</li>
                        ))}
                      </ul>
                    </div>
                  )}
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
    (a) => a.type === "Assignment"
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
        <option value="Assignment">Assignments</option>
        <option value="Case Study">Case Studies</option>
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
                  {course.name}
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

  const filteredAssessments = assessments.filter(
    (assessment) =>
      (selectedType === "" || assessment.type === selectedType) &&
      (selectedCourse === "" || assessment.course_id === selectedCourse)
  );

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      setError(null);

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

  const handleDeleteAssessment = async (assessmentId: string) => {
    if (!window.confirm("Are you sure you want to delete this assessment?")) {
      return;
    }

    try {
      setError(null);
      await api.deleteAssessment(assessmentId);
      
      setAssessments((prev) =>
        prev.filter((assessment) => assessment.id !== assessmentId)
      );
      
      alert("Assessment deleted successfully!");
    } catch (error) {
      console.error("Error deleting assessment:", error);
      alert("Failed to delete assessment. Please try again.");
    }
  };

  const handleViewQuestions = async (assessment: Assessment) => {
    try {
      setSelectedAssessment(assessment);
      setIsViewQuestionsModalOpen(true);
      setQuestionsLoading(true);
      setError(null);

      // For now, we'll use the questions from the assessment object
      // since there's no separate endpoint provided for fetching questions
      const questionsData = assessment.questions || [];
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
                      ` - ${selectedType === "CAT" ? "CATs" : selectedType + "s"}`}
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
                      onEdit={(assessment) => console.log("Edit:", assessment)}
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
        </main>
      </motion.div>

      <CreateAssessmentModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateAssessment}
        loading={createLoading}
        courses={courses}
        units={units}
      />

      <AddQuestionModal
        isOpen={isQuestionModalOpen}
        onClose={() => setIsQuestionModalOpen(false)}
        onSubmit={handleAddQuestion}
        assessmentId={selectedAssessment?.id || ""}
        loading={questionLoading}
      />

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