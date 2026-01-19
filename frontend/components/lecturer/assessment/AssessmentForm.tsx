import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Sparkles,
  Edit3,
  Wand2,
  User,
  Check,
  Loader2,
  X,
  ChevronDown,
} from "lucide-react";
import { Assessment, Course } from "../../../types/assessment";

type QuestionType =
  | "open-ended"
  | "close-ended-multiple-single"
  | "close-ended-multiple-multiple"
  | "close-ended-bool"
  | "close-ended-matching"
  | "close-ended-ordering"
  | "close-ended-drag-drop";

interface AssessmentFormProps {
  initialData?: Omit<Assessment, "questions_type"> & {
    questions_type?: string[];
    schedule_date?: string | null;
    deadline_date?: string | null;
  };
  selectedCourse: string;
  selectedUnit: string;
  selectedWeek: number;
  courses: Course[];
  onSubmit: (data: unknown, isAI: boolean, docFile?: File) => void;
  onCancel: () => void;
  loading: boolean;
  isEditing?: boolean;
}

const AssessmentForm: React.FC<AssessmentFormProps> = ({
  initialData,
  selectedCourse,
  selectedUnit,
  selectedWeek,
  courses,
  onSubmit,
  onCancel,
  loading,
  isEditing = false,
}) => {
  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    description: initialData?.description || "",
    type: initialData?.type || "CAT",
    questions_type: (initialData?.questions_type || []) as QuestionType[],
    topic: initialData?.topic || "",
    total_marks: initialData?.total_marks || 30,
    difficulty: initialData?.difficulty || "Advanced",
    number_of_questions: initialData?.number_of_questions || 15,
    blooms_level: initialData?.blooms_level || "Remember",
    deadline_date: initialData?.deadline_date || "",
    duration: initialData?.duration || 60,
    schedule_date: initialData?.schedule_date || "",
  });

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [docFile, setDocFile] = useState<File | null>(null);

  const questionTypeOptions = [
    { value: "open-ended" as const, label: "Open Ended" },
    {
      value: "close-ended-multiple-single" as const,
      label: "Multiple Choice (Single Answer)",
    },
    {
      value: "close-ended-multiple-multiple" as const,
      label: "Multiple Choice (Multiple Answers)",
    },
    { value: "close-ended-bool" as const, label: "True/False" },
    { value: "close-ended-matching" as const, label: "Matching" },
    { value: "close-ended-ordering" as const, label: "Ordering" },
    { value: "close-ended-drag-drop" as const, label: "Drag and Drop" },
  ] as const;

  const toggleQuestionType = (type: QuestionType) => {
    setFormData((prev) => ({
      ...prev,
      questions_type: prev.questions_type.includes(type)
        ? prev.questions_type.filter((t: QuestionType) => t !== type)
        : [...prev.questions_type, type],
    }));
  };

  const removeQuestionType = (type: QuestionType, e: React.MouseEvent) => {
    e.stopPropagation();
    setFormData((prev) => ({
      ...prev,
      questions_type: prev.questions_type.filter(
        (t: QuestionType) => t !== type,
      ),
    }));
  };

  const selectedCourseData = courses.find((c) => c.id === selectedCourse);
  const selectedUnitData = selectedCourseData?.units.find(
    (u) => u.id === selectedUnit,
  );

  const requiredFields = [
    "title",
    "type",
    "description",
    "topic",
    "number_of_questions",
    "total_marks",
    "blooms_level",
    "difficulty",
  ];

  const isFormValid = () => {
    for (const field of requiredFields) {
      if (
        !formData[field as keyof typeof formData] ||
        formData[field as keyof typeof formData] === "" ||
        (field === "questions_type" && formData.questions_type.length === 0)
      ) {
        return false;
      }
    }
    return true;
  };

  const handleSubmit = (isAI: boolean) => {
    if (!isFormValid()) {
      alert("Please fill in all required fields.");
      return;
    }
    const submissionData = {
      ...formData,
      deadline_date: formData.deadline_date|| "",
      duration: formData.duration || "",
      schedule_date: formData.schedule_date || "",
      course_id: selectedCourse,
      unit_id: selectedUnit,
      week: selectedWeek,
      unit_name: selectedUnitData?.unit_name || "",
    };
    if (isAI) {
      onSubmit(submissionData, true, docFile ?? undefined);
    } else {
      onSubmit(submissionData, false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden"
    >
      <div className="bg-gradient-to-r from-emerald-50 via-emerald-100 to-emerald-50 p-6 border-b border-emerald-200">
        <h3 className="text-2xl font-bold text-gray-900 flex items-center">
          {isEditing ? (
            <>
              <Edit3 className="w-6 h-6 mr-3 text-emerald-600" />
              Edit Assessment
            </>
          ) : (
            <>
              <Sparkles className="w-6 h-6 mr-3 text-emerald-600" />
              Create New Assessment
            </>
          )}
        </h3>
        <p className="text-gray-600 mt-2">
          {isEditing
            ? "Modify assessment details"
            : "Generate with AI or create manually"}
        </p>

        {/* Current Context */}
        <div className="mt-6 p-4 bg-white rounded-xl border border-emerald-200 shadow-sm">
          <div className="flex flex-wrap items-center gap-4 text-sm">
            <span className="text-gray-600 font-medium">Context:</span>
            <span className="flex items-center text-emerald-700 font-semibold">
              <span
                className={`w-3 h-3 rounded-full mr-2 ${selectedCourseData?.color}`}
              ></span>
              {selectedCourseData?.name}
            </span>
            <span className="text-gray-400">•</span>
            <span className="text-emerald-700 font-semibold">
              {selectedUnitData?.unit_name}
            </span>
            <span className="text-gray-400">•</span>
            <span className="text-emerald-700 font-semibold">
              Week {selectedWeek}
            </span>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-8">
        {/* Basic Info */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-3">
              Assessment Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
              placeholder="Enter assessment title"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-3">
              Assessment Type <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.type}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  type: e.target.value as "CAT" | "Assignment" | "Case Study",
                })
              }
              className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
            >
              <option value="CAT">CAT</option>
              <option value="Assignment">Assignment</option>
              <option value="Case Study">Case Study</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-3">
            Description <span className="text-red-500">*</span>
          </label>
          <textarea
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            rows={4}
            className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
            placeholder="Describe the assessment purpose and content"
          />
        </div>

        {/* Question Configuration */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Question Types
              <span className="text-red-500 ml-1">*</span>
            </label>

            {/* Selected Tags */}
            {formData.questions_type.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-2">
                {formData.questions_type.map((type) => {
                  const option = questionTypeOptions.find(
                    (opt) => opt.value === type,
                  );
                  return (
                    <span
                      key={type}
                      className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                    >
                      {option?.label || type}
                      <button
                        type="button"
                        onClick={(e) => removeQuestionType(type, e)}
                        className="ml-1.5 text-blue-600 hover:text-blue-800 focus:outline-none"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </span>
                  );
                })}
              </div>
            )}

            {/* Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="w-full p-2.5 text-left bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 flex justify-between items-center"
              >
                <span className="text-gray-700">
                  {formData.questions_type.length > 0
                    ? `Selected: ${formData.questions_type.length}`
                    : "Select question types..."}
                </span>
                <ChevronDown
                  className={`w-4 h-4 text-gray-500 transition-transform ${isDropdownOpen ? "transform rotate-180" : ""}`}
                />
              </button>

              {isDropdownOpen && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg">
                  <div className="py-1">
                    {questionTypeOptions.map((option) => (
                      <div
                        key={option.value}
                        className={`px-4 py-2 text-sm cursor-pointer hover:bg-gray-100 flex items-center ${
                          formData.questions_type.includes(option.value)
                            ? "bg-blue-50"
                            : ""
                        }`}
                        onClick={() => {
                          toggleQuestionType(option.value);
                        }}
                      >
                        <input
                          type="checkbox"
                          className="h-4 w-4 text-emerald-600 rounded border-gray-300 focus:ring-emerald-500"
                          checked={formData.questions_type.includes(
                            option.value,
                          )}
                          onChange={() => {}} // Handled by the parent div
                        />
                        <span className="ml-2">{option.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <p className="mt-1 text-xs text-gray-500">
              Click to select multiple question types
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-3">
              Topic <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.topic}
              onChange={(e) =>
                setFormData({ ...formData, topic: e.target.value })
              }
              className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
              placeholder="Main topic or subject area"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-3">
              Difficulty Level <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.difficulty}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  difficulty: e.target.value as
                    | "Easy"
                    | "Intermediate"
                    | "Advance",
                })
              }
              className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
            >
              <option value="Easy">Easy</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advance">Advanced</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-3">
              Number of Questions <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              value={formData.number_of_questions}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  number_of_questions: parseInt(e.target.value),
                })
              }
              className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
              min="1"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-3">
              Total Marks <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              value={formData.total_marks}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  total_marks: parseInt(e.target.value),
                })
              }
              className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
              min="1"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-3">
              Bloom&apos;s Level <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.blooms_level}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  blooms_level: e.target.value as
                    | "Remember"
                    | "Understand"
                    | "Apply"
                    | "Analyze"
                    | "Evaluate"
                    | "Create",
                })
              }
              className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
            >
              <option value="Remember">Remember</option>
              <option value="Understand">Understand</option>
              <option value="Apply">Apply</option>
              <option value="Analyze">Analyze</option>
              <option value="Evaluate">Evaluate</option>
              <option value="Create">Create</option>
            </select>
          </div>
        </div>

        {/* Optional Fields */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-3">
              Deadline (Optional)
            </label>
            <input
              type="datetime-local"
              value={formData.deadline_date}
              onChange={(e) =>
                setFormData({ ...formData, deadline_date: e.target.value })
              }
              className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-3">
              Schedule Date (Optional)
            </label>
            <input
              type="datetime-local"
              value={formData.schedule_date}
              onChange={(e) =>
                setFormData({ ...formData, schedule_date: e.target.value })
              }
              className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
            />
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-3">
              Duration (minutes)
            </label>
            <input
              type="number"
              value={formData.duration}
              onChange={(e) =>
                setFormData({ ...formData, duration: parseInt(e.target.value) })
              }
              className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
              placeholder="e.g., 60"
              min="1"
            />
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-3">
              Optional Document (PDF only)
            </label>
            <input
              type="file"
              accept=".pdf"
              onChange={(e) => setDocFile(e.target.files?.[0] || null)}
              className="w-full p-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
            />
            {docFile && (
              <div className="text-xs text-gray-500 mt-1">
                Selected: {docFile.name}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="bg-gray-50 px-6 py-6 flex flex-col sm:flex-row justify-between gap-4">
        <button
          onClick={onCancel}
          className="px-6 py-3 text-gray-600 hover:text-gray-800 font-semibold transition-colors rounded-xl hover:bg-gray-100"
          disabled={loading}
        >
          Cancel
        </button>
        <div className="flex flex-col sm:flex-row gap-3">
          {!isEditing && (
            <button
              onClick={() => handleSubmit(true)}
              disabled={loading}
              className="flex items-center justify-center px-6 py-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors font-semibold shadow-lg"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              ) : (
                <Wand2 className="w-5 h-5 mr-2" />
              )}
              Generate with AI
            </button>
          )}
          <button
            onClick={() => handleSubmit(false)}
            disabled={loading}
            className="flex items-center justify-center px-6 py-3 bg-white border border-emerald-200 text-emerald-700 rounded-xl hover:bg-emerald-50 transition-colors font-semibold shadow-sm"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            ) : isEditing ? (
              <Check className="w-5 h-5 mr-2" />
            ) : (
              <User className="w-5 h-5 mr-2" />
            )}
            {isEditing ? "Save Changes" : "Create Manually"}
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default AssessmentForm;
