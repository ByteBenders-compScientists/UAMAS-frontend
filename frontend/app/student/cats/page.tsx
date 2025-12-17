/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import { useLayout } from "@/components/LayoutController";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import EmptyState from "@/components/EmptyState";
import {
  BookOpen,
  Clock,
  CheckCircle,
  AlertCircle,
  Calendar,
  FileText,
  Download,
  Eye,
  TrendingUp,
  Award,
  Flag,
  ChevronRight,
  ChevronLeft,
  Loader2,
  X,
  Play,
  Pause,
} from "lucide-react";
import CatQuestions from "@/components/CatQuestions";
import Disclaimer from "@/components/Disclaimer";
import type { QuestionType } from "@/types/assessment";

const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080/api/v1";

interface Question {
  id: string;
  text: string;
  type: QuestionType;
  choices?: (string | string[])[];
  marks: number;
  status?: "answered" | "not answered";
}

export default function CatsPage() {
  const { sidebarCollapsed, isMobileView, isTabletView } = useLayout();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [cats, setCats] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [activeCat, setActiveCat] = useState<string | null>(null);
  const [isTakingCat, setIsTakingCat] = useState(false);
  const [showDisclaimer, setShowDisclaimer] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [flaggedQuestions, setFlaggedQuestions] = useState<number[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmSubmit, setShowConfirmSubmit] = useState(false);
  const hasFetched = useRef(false);
  const [openEndedAnswers, setOpenEndedAnswers] = useState<string[]>([]);
  const [openEndedImages, setOpenEndedImages] = useState<(File | null)[]>([]);
  const [multipleAnswers, setMultipleAnswers] = useState<number[][]>([]);
  const [orderingAnswers, setOrderingAnswers] = useState<string[][]>([]);
  const [matchingAnswers, setMatchingAnswers] = useState<Record<string, string>[]>([]);
  const [dragDropAnswers, setDragDropAnswers] = useState<Record<string, string>[]>([]);
  const [openEndedInputModes, setOpenEndedInputModes] = useState<
    ("text" | "image" | null)[]
  >([]);
  const [isNextLoading, setIsNextLoading] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState<number>(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Workspace mode B: attempt-only route.
  // Attempt flow moved to workspace. Redirect legacy deep links back to workspace.
  useEffect(() => {
    const assessmentId = searchParams.get("assessmentId");
    if (!assessmentId) return;
    router.replace(`/student/courses?action=cats&assessmentId=${encodeURIComponent(assessmentId)}`);
  }, [router, searchParams, activeCat]);

  // Submit current CAT
  const handleSubmitCat = async () => {
    setIsSubmitting(true);
    try {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      // Send final submission request
      if (activeCat) {
        await fetch(`${apiBaseUrl}/bd/student/assessments/${activeCat}/submit`, {
          method: "GET",
          credentials: "include",
        });
      }
      // Simulate submission delay
      setTimeout(() => {
        setIsTakingCat(false);
        setIsSubmitting(false);
        setShowConfirmSubmit(false);
        // Refresh the CATs list to show updated status
        window.location.reload();
      }, 1500);
    } catch (err) {
      setIsSubmitting(false);
      // Optionally handle error
    }
  };

  // Removed backend-linked timer

  // Fetch CATs from unified API
  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;

    const fetchCats = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await fetch(`${apiBaseUrl}/bd/student/assessments`, {
          credentials: "include",
        });
        if (!res.ok) throw new Error("Failed to fetch assessments");
        const data = await res.json();

        // console.log(data);
        // Filter only CATs
        const catsOnly = (Array.isArray(data) ? data : []).filter((assessment: any) => assessment.type === "CAT");
        setCats(catsOnly);
      } catch (err: any) {
        setError(err.message || "Failed to load CATs");
      } finally {
        setIsLoading(false);
      }
    };
    fetchCats();
  }, []);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, []);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const hasContent = cats.length > 0;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "text-green-600 bg-green-50 border-green-200";
      case "start":
        return "text-blue-600 bg-blue-50 border-blue-200";
      case "in-progress":
        return "text-amber-600 bg-amber-50 border-amber-200";
      case "closed":
        return "text-red-600 bg-red-50 border-red-200";
      default:
        return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle size={16} />;
      case "start":
        return <Play size={16} />;
      case "in-progress":
        return <Pause size={16} />;
      case "closed":
        return <AlertCircle size={16} />;
      default:
        return <FileText size={16} />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "completed":
        return "Completed";
      case "start":
        return "Start";
      case "in-progress":
        return "In Progress";
      case "closed":
        return "Closed";
      default:
        return "Unknown";
    }
  };

  const getEffectiveStatus = (cat: any) => {
    const deadlineValue = cat?.deadline ?? cat?.due_date ?? cat?.closing_date ?? cat?.close_at ?? null;
    const parsedDeadline = deadlineValue ? Date.parse(deadlineValue) : NaN;
    const isPastDeadline = !!deadlineValue && !Number.isNaN(parsedDeadline) && Date.now() > parsedDeadline;
    if (cat.status !== "completed" && isPastDeadline) return "closed";
    return cat.status;
  };

  const filteredCats = cats.filter((cat) => {
    if (selectedFilter === "all") return true;
    return getEffectiveStatus(cat) === selectedFilter;
  });

  const averageScore =
    cats
      .filter((cat) => cat.score !== null && cat.score !== undefined)
      .reduce((acc, cat) => acc + (cat.score || 0), 0) /
    (cats.filter((cat) => cat.score !== null && cat.score !== undefined)
      .length || 1);

  const handleStartCat = async (catId: string) => {
    const cat = cats.find((c) => c.id === catId);
    if (!cat) return;

    setActiveCat(catId);
    setShowDisclaimer(true);
  };

  const proceedToCat = async () => {
    const cat = cats.find((c) => c.id === activeCat);
    if (!cat) return;

    setShowDisclaimer(false);
    setIsTakingCat(true);
    setCurrentQuestion(0);

    try {
      // Use the questions from the assessment data
      const questions = cat.questions || [];
      setQuestions(questions);

      setSelectedAnswers(Array(questions.length).fill(-1));
      setMultipleAnswers(Array(questions.length).fill([]));
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      timerRef.current = setInterval(() => {
        setTimeRemaining(prev => {
          const next = Math.max(0, prev - 1);
          if (next === 0) {
            if (timerRef.current) {
              clearInterval(timerRef.current);
              timerRef.current = null;
            }
            handleSubmitCat();
          }
          return next;
        });
      }, 1000);
    } catch (err) {
      setQuestions([]);
    }
  };

  const handleSingleAnswerSelect = (questionIndex: number, optionIndex: number) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[questionIndex] = optionIndex;
    setSelectedAnswers(newAnswers);
  };

  const handleMultipleAnswerToggle = (questionIndex: number, optionIndex: number) => {
    const newAnswers = [...multipleAnswers];
    if (!newAnswers[questionIndex]) {
      newAnswers[questionIndex] = [];
    }
    if (newAnswers[questionIndex].includes(optionIndex)) {
      newAnswers[questionIndex] = newAnswers[questionIndex].filter((idx) => idx !== optionIndex);
    } else {
      newAnswers[questionIndex] = [...newAnswers[questionIndex], optionIndex];
    }
    setMultipleAnswers(newAnswers);
  };

  const toggleFlagQuestion = (index: number) => {
    if (flaggedQuestions.includes(index)) {
      setFlaggedQuestions(flaggedQuestions.filter((q) => q !== index));
    } else {
      setFlaggedQuestions([...flaggedQuestions, index]);
    }
  };

  // formatTime is now provided by the timer hook

  const currentCat = cats.find((cat) => cat.id === activeCat);

  const getAnsweredCount = () => {
    return questions.reduce((count, q, index) => {
      const isAnswered = (() => {
        switch (q.type) {
          case "open-ended": {
            const textAnswer = openEndedAnswers[index]?.trim();
            const imageAnswer = openEndedImages[index];
            return !!textAnswer || !!imageAnswer;
          }
          case "close-ended-multiple-single":
          case "close-ended-bool":
            return selectedAnswers[index] !== -1;
          case "close-ended-multiple-multiple":
            return (multipleAnswers[index] || []).length > 0;
          case "close-ended-ordering":
            return (orderingAnswers[index] || []).length > 0;
          case "close-ended-matching": {
            const mapping = matchingAnswers[index] || {};
            return Object.keys(mapping).length > 0 && Object.values(mapping).every((v) => !!v);
          }
          case "close-ended-drag-drop": {
            const mapping = dragDropAnswers[index] || {};
            return Object.keys(mapping).length > 0 && Object.values(mapping).every((v) => !!v);
          }
          default:
            return false;
        }
      })();

      return count + (isAnswered ? 1 : 0);
    }, 0);
  };

  const isCurrentQuestionAnswered = () => {
    if (questions.length === 0) return false;

    const q = questions[currentQuestion];
    switch (q.type) {
      case "open-ended": {
        const textAnswer = openEndedAnswers[currentQuestion]?.trim();
        const imageAnswer = openEndedImages[currentQuestion];
        return !!textAnswer || !!imageAnswer;
      }
      case "close-ended-multiple-single":
      case "close-ended-bool":
        return selectedAnswers[currentQuestion] !== -1;
      case "close-ended-multiple-multiple":
        return (multipleAnswers[currentQuestion] || []).length > 0;
      case "close-ended-ordering":
        return (orderingAnswers[currentQuestion] || []).length > 0;
      case "close-ended-matching": {
        const mapping = matchingAnswers[currentQuestion] || {};
        return Object.keys(mapping).length > 0 && Object.values(mapping).every((v) => !!v);
      }
      case "close-ended-drag-drop": {
        const mapping = dragDropAnswers[currentQuestion] || {};
        return Object.keys(mapping).length > 0 && Object.values(mapping).every((v) => !!v);
      }
      default:
        return false;
    }
  };

  // Question rendering component
  const renderQuestion = (question: Question, index: number) => {
    if (question.type === "open-ended") {
      const handleInputModeChange = (mode: "text" | "image") => {
        const newModes = [...openEndedInputModes];
        newModes[index] = mode;
        setOpenEndedInputModes(newModes);
      };

      const inputMode = openEndedInputModes[index];

      if (!inputMode) {
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">
              Question {index + 1}: {question.text}
            </h3>
            <p className="text-gray-600">
              Please choose how you would like to answer this question. This
              choice cannot be changed.
            </p>
            <div className="flex space-x-4 pt-2">
              <button
                onClick={() => handleInputModeChange("text")}
                className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
              >
                Answer with Text
              </button>
              <button
                onClick={() => handleInputModeChange("image")}
                className="px-4 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors"
              >
                Upload an Image
              </button>
            </div>
          </div>
        );
      }

      return (
        <div className="space-y-4">
          <div className="flex items-start justify-between gap-4">
            <h3 className="text-lg font-medium text-gray-900">
              Question {index + 1}: {question.text}
            </h3>
            <div className="text-sm font-medium text-gray-700">{question.marks} marks</div>
          </div>
          {inputMode === "text" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Answer
              </label>
              <textarea
                rows={6}
                value={openEndedAnswers[index] || ""}
                onChange={(e) => {
                  const newAnswers = [...openEndedAnswers];
                  newAnswers[index] = e.target.value;
                  setOpenEndedAnswers(newAnswers);
                }}
                placeholder="Type your answer here..."
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          )}
          {inputMode === "image" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload Image
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const newImages = [...openEndedImages];
                  newImages[index] = e.target.files?.[0] || null;
                  setOpenEndedImages(newImages);
                }}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          )}
        </div>
      );
    }

    if (question.type === "close-ended-bool") {
      const boolOptions = ["True", "False"];
      const selected = selectedAnswers[index];
      return (
        <div className="space-y-4">
          <div className="flex items-start justify-between gap-4">
            <h3 className="text-lg font-medium text-gray-900">
              Question {index + 1}: {question.text}
            </h3>
            <div className="text-sm font-medium text-gray-700">{question.marks} marks</div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {boolOptions.map((label, choiceIndex) => {
              const active = selected === choiceIndex;
              return (
                <button
                  key={label}
                  type="button"
                  onClick={() => handleSingleAnswerSelect(index, choiceIndex)}
                  className={`p-4 rounded-xl border text-left transition-colors ${
                    active
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 bg-white hover:bg-gray-50"
                  }`}
                >
                  <div className="font-medium text-gray-900">{label}</div>
                </button>
              );
            })}
          </div>
        </div>
      );
    }

    if (
      question.type === "close-ended-multiple-single" ||
      question.type === "close-ended-multiple-multiple"
    ) {
      const rawChoices = question.choices || [];
      const choices = rawChoices.filter((c): c is string => typeof c === "string");
      const isMultiple = question.type === "close-ended-multiple-multiple";
      return (
        <div className="space-y-4">
          <div className="flex items-start justify-between gap-4">
            <h3 className="text-lg font-medium text-gray-900">
              Question {index + 1}: {question.text}
            </h3>
            <div className="text-sm font-medium text-gray-700">{question.marks} marks</div>
          </div>
          <div className="space-y-2">
            {choices.map((choice: string, choiceIndex: number) => {
              const checked = isMultiple
                ? multipleAnswers[index]?.includes(choiceIndex) || false
                : selectedAnswers[index] === choiceIndex;
              return (
                <label
                  key={choiceIndex}
                  className={`flex items-center p-4 border rounded-xl cursor-pointer transition-colors ${
                    checked
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  <input
                    type={isMultiple ? "checkbox" : "radio"}
                    name={isMultiple ? undefined : `question-${index}`}
                    checked={checked}
                    onChange={() =>
                      isMultiple
                        ? handleMultipleAnswerToggle(index, choiceIndex)
                        : handleSingleAnswerSelect(index, choiceIndex)
                    }
                    className="mr-3"
                  />
                  <span className="text-gray-800">{choice}</span>
                </label>
              );
            })}
          </div>
        </div>
      );
    }

    if (question.type === "close-ended-ordering") {
      const rawChoices = question.choices || [];
      const baseChoices = rawChoices.filter((c): c is string => typeof c === "string");
      const currentOrder =
        orderingAnswers[index] && orderingAnswers[index].length > 0
          ? orderingAnswers[index]
          : baseChoices;

      const move = (from: number, to: number) => {
        const next = [...currentOrder];
        const [item] = next.splice(from, 1);
        next.splice(to, 0, item);
        const nextAll = [...orderingAnswers];
        nextAll[index] = next;
        setOrderingAnswers(nextAll);
      };

      return (
        <div className="space-y-4">
          <div className="flex items-start justify-between gap-4">
            <h3 className="text-lg font-medium text-gray-900">
              Question {index + 1}: {question.text}
            </h3>
            <div className="text-sm font-medium text-gray-700">{question.marks} marks</div>
          </div>
          <div className="space-y-2">
            {currentOrder.map((item, itemIndex) => (
              <div
                key={`${item}-${itemIndex}`}
                className="flex items-center justify-between gap-3 p-3 border border-gray-200 rounded-xl bg-white"
              >
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-lg bg-gray-100 text-gray-700 flex items-center justify-center text-sm font-semibold">
                    {itemIndex + 1}
                  </div>
                  <div className="text-gray-900">{item}</div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => move(itemIndex, Math.max(0, itemIndex - 1))}
                    disabled={itemIndex === 0}
                    className="px-3 py-1.5 text-sm rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50"
                  >
                    Up
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      move(itemIndex, Math.min(currentOrder.length - 1, itemIndex + 1))
                    }
                    disabled={itemIndex === currentOrder.length - 1}
                    className="px-3 py-1.5 text-sm rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50"
                  >
                    Down
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (question.type === "close-ended-matching") {
      const rawChoices = question.choices || [];

      const isPairs =
        Array.isArray(rawChoices) &&
        rawChoices.length > 0 &&
        rawChoices.every((c) => Array.isArray(c) && (c as unknown[]).length === 2);

      const asParallelArrays =
        Array.isArray(rawChoices) &&
        rawChoices.length === 2 &&
        Array.isArray(rawChoices[0]) &&
        Array.isArray(rawChoices[1]);

      const leftItems: string[] = (() => {
        if (asParallelArrays) return (rawChoices[0] as string[]).map(String);
        if (isPairs) return (rawChoices as string[][]).map((p) => String(p[0]));
        return [];
      })();

      const rightItems: string[] = (() => {
        if (asParallelArrays) return (rawChoices[1] as string[]).map(String);
        if (isPairs) {
          const rights = (rawChoices as string[][]).map((p) => String(p[1]));
          return Array.from(new Set(rights));
        }
        return [];
      })();

      const mapping = matchingAnswers[index] || {};
      const update = (item: string, target: string) => {
        const nextAll = [...matchingAnswers];
        nextAll[index] = { ...mapping, [item]: target };
        setMatchingAnswers(nextAll);
      };

      return (
        <div className="space-y-4">
          <div className="flex items-start justify-between gap-4">
            <h3 className="text-lg font-medium text-gray-900">
              Question {index + 1}: {question.text}
            </h3>
            <div className="text-sm font-medium text-gray-700">{question.marks} marks</div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="text-sm font-semibold text-gray-700">Items</div>
              {leftItems.map((item) => (
                <div key={item} className="p-3 rounded-xl border border-gray-200 bg-white">
                  <div className="text-gray-900 font-medium mb-2">{item}</div>
                  <select
                    value={mapping[item] || ""}
                    onChange={(e) => update(item, e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="" disabled>
                      Select a match
                    </option>
                    {rightItems.map((target) => (
                      <option key={target} value={target}>
                        {target}
                      </option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
            <div className="space-y-2">
              <div className="text-sm font-semibold text-gray-700">Matches</div>
              <div className="p-3 rounded-xl border border-gray-200 bg-gray-50">
                {leftItems.length === 0 ? (
                  <div className="text-sm text-gray-600">No matching data provided.</div>
                ) : (
                  <div className="space-y-2">
                    {leftItems.map((item) => (
                      <div key={item} className="flex items-center justify-between text-sm">
                        <div className="text-gray-800">{item}</div>
                        <div className="text-gray-700 font-medium">{mapping[item] || "—"}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (question.type === "close-ended-drag-drop") {
      const rawChoices = question.choices || [];
      const asParallelArrays =
        Array.isArray(rawChoices) &&
        rawChoices.length === 2 &&
        Array.isArray(rawChoices[0]) &&
        Array.isArray(rawChoices[1]);

      const flatChoices = rawChoices.filter((c): c is string => typeof c === "string").map(String);
      const splitIndex = flatChoices.length > 1 ? Math.floor(flatChoices.length / 2) : 0;

      const items = asParallelArrays
        ? (rawChoices[0] as string[]).map(String)
        : flatChoices.length > 0
          ? flatChoices.slice(0, splitIndex)
          : [];
      const targets = asParallelArrays
        ? (rawChoices[1] as string[]).map(String)
        : flatChoices.length > 0
          ? flatChoices.slice(splitIndex)
          : [];

      const mapping = dragDropAnswers[index] || {};
      const usedItems = new Set(Object.values(mapping).filter(Boolean));
      const availableItems = items.filter((it) => !usedItems.has(it));

      const onDropToTarget = (target: string, item: string) => {
        const nextAll = [...dragDropAnswers];
        nextAll[index] = { ...mapping, [target]: item };
        setDragDropAnswers(nextAll);
      };

      const clearTarget = (target: string) => {
        const nextAll = [...dragDropAnswers];
        const next = { ...mapping };
        delete next[target];
        nextAll[index] = next;
        setDragDropAnswers(nextAll);
      };

      return (
        <div className="space-y-4">
          <div className="flex items-start justify-between gap-4">
            <h3 className="text-lg font-medium text-gray-900">
              Question {index + 1}: {question.text}
            </h3>
            <div className="text-sm font-medium text-gray-700">{question.marks} marks</div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl border border-gray-200 bg-white">
              <div className="text-sm font-semibold text-gray-700 mb-3">Drag items</div>
              <div className="flex flex-wrap gap-2">
                {availableItems.map((item) => (
                  <div
                    key={item}
                    draggable
                    onDragStart={(e) => e.dataTransfer.setData("text/plain", item)}
                    className="px-3 py-2 rounded-lg border border-gray-200 bg-gray-50 cursor-grab active:cursor-grabbing"
                  >
                    <span className="text-sm text-gray-900">{item}</span>
                  </div>
                ))}
                {availableItems.length === 0 && (
                  <div className="text-sm text-gray-600">All items placed.</div>
                )}
              </div>
            </div>

            <div className="p-4 rounded-xl border border-gray-200 bg-white">
              <div className="text-sm font-semibold text-gray-700 mb-3">Drop targets</div>
              <div className="space-y-2">
                {targets.map((target) => {
                  const placed = mapping[target];
                  return (
                    <div
                      key={target}
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={(e) => {
                        e.preventDefault();
                        const item = e.dataTransfer.getData("text/plain");
                        if (item) onDropToTarget(target, item);
                      }}
                      className={`p-3 rounded-xl border transition-colors ${
                        placed
                          ? "border-blue-500 bg-blue-50"
                          : "border-dashed border-gray-300 bg-gray-50"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{target}</div>
                          <div className="text-sm text-gray-700">
                            {placed || "Drop an item here"}
                          </div>
                        </div>
                        {placed && (
                          <button
                            type="button"
                            onClick={() => clearTarget(target)}
                            className="px-3 py-1.5 text-sm rounded-lg border border-gray-200 hover:bg-white"
                          >
                            Remove
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
                {targets.length === 0 && (
                  <div className="text-sm text-gray-600">No drag-drop data provided.</div>
                )}
              </div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-3">
        <h3 className="text-lg font-medium text-gray-900">
          Question {index + 1}: {question.text}
        </h3>
        <div className="text-sm text-gray-600">Unsupported question type.</div>
      </div>
    );
  };

  const submitCurrentAnswer = async (questionIndex: number) => {
    const question = questions[questionIndex];
    if (!question) return;
    const formData = new FormData();
    let answerType = "text";
    let textAnswer = "";
    let imageFile = null;

    if (question.type === "open-ended") {
      const inputMode = openEndedInputModes[questionIndex];
      if (inputMode === "text") {
        answerType = "text";
        textAnswer = openEndedAnswers[questionIndex] || "";
        formData.append("answer_type", "text");
        formData.append("text_answer", textAnswer);
      } else if (inputMode === "image") {
        answerType = "image";
        imageFile = openEndedImages[questionIndex];
        if (imageFile) {
          formData.append("answer_type", "image");
          formData.append("image", imageFile);
        }
      }
    } else {
      const rawChoices = question.choices || [];
      const choices = rawChoices.filter((c): c is string => typeof c === "string");

      switch (question.type) {
        case "close-ended-multiple-single": {
          textAnswer = choices[selectedAnswers[questionIndex]] || "";
          break;
        }
        case "close-ended-multiple-multiple": {
          textAnswer = (multipleAnswers[questionIndex] || [])
            .map((idx) => choices[idx] || "")
            .filter(Boolean)
            .join(",");
          break;
        }
        case "close-ended-bool": {
          const selected = selectedAnswers[questionIndex];
          textAnswer = selected === 0 ? "True" : selected === 1 ? "False" : "";
          break;
        }
        case "close-ended-ordering": {
          const order = orderingAnswers[questionIndex] || [];
          textAnswer = JSON.stringify(order);
          break;
        }
        case "close-ended-matching": {
          const mapping = matchingAnswers[questionIndex] || {};
          const pairs = Object.entries(mapping)
            .filter(([, target]) => !!target)
            .map(([item, target]) => ({ item, target }));
          textAnswer = JSON.stringify(pairs);
          break;
        }
        case "close-ended-drag-drop": {
          const mapping = dragDropAnswers[questionIndex] || {};
          const placements = Object.entries(mapping)
            .filter(([, item]) => !!item)
            .map(([target, item]) => ({ item, target }));
          textAnswer = JSON.stringify(placements);
          break;
        }
        default:
          textAnswer = "";
      }

      formData.append("answer_type", "text");
      formData.append("text_answer", textAnswer);
    }

    try {
      await fetch(`${apiBaseUrl}/bd/student/questions/${question.id}/answer`, {
        method: "POST",
        credentials: "include",
        body: formData,
      });
    } catch (err) {
      console.error("Failed to submit answer", err);
    }
  };

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
        <Header title="My CATs" showWeekSelector={hasContent} />

        <main className="p-4 md:p-6">
          {showDisclaimer && currentCat && (
            <Disclaimer
              title={currentCat.title}
              numberOfQuestions={currentCat.number_of_questions}
              duration={currentCat.duration}
              onAgree={proceedToCat}
              onCancel={() => {
                setShowDisclaimer(false);
                setActiveCat(null);
              }}
            />
          )}
          {!hasContent ? (
            <div className="max-w-4xl mx-auto">
              <EmptyState
                title="No CATs Available"
                description="Your Continuous Assessment Tests will appear here once your lecturers create them. Check back regularly for updates."
                icon={<BookOpen size={48} />}
              />
            </div>
          ) : isTakingCat && questions.length > 0 ? (
            <div className="max-w-5xl mx-auto">
              {/* Taking CAT UI */}
              <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
                <div className="p-4 md:p-6 border-b border-gray-200">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900">
                        {currentCat?.title}
                      </h2>
                      <p className="text-sm text-gray-600">
                        {currentCat?.topic}
                      </p>
                    </div>

                    <div className="flex items-center space-x-4">
                      {timeRemaining > 0 && (
                        <div
                          className={`px-4 py-2 rounded-lg text-white font-medium ${
                            timeRemaining < 300 ? "bg-red-500" : "bg-blue-600"
                          }`}
                        >
                          <div className="flex items-center">
                            <Clock size={16} className="mr-2" />
                            <span>{formatTime(timeRemaining)}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  {questions.length > 0 && (
                    <div>
                      {renderQuestion(questions[currentQuestion], currentQuestion)}
                      
                      <div className="flex justify-between items-center mt-6">
                        <div className="text-sm text-gray-600">
                          Question {currentQuestion + 1} of {questions.length}
                        </div>
                        {currentQuestion < questions.length - 1 ? (
                          <button
                            onClick={async () => {
                              setIsNextLoading(true);
                              await submitCurrentAnswer(currentQuestion);
                              setCurrentQuestion(currentQuestion + 1);
                              setIsNextLoading(false);
                            }}
                            disabled={
                              isNextLoading || questions[currentQuestion]?.status !== "answered" && !isCurrentQuestionAnswered()
                            }
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center"
                          >
                            {isNextLoading ? <Loader2 size={16} className="animate-spin mr-2" /> : null}
                            {questions[currentQuestion]?.status === "answered" ? "Answered, Next" : "Next"}
                            <ChevronRight size={16} className="ml-1" />
                          </button>
                        ) : (
                          <button
                            onClick={async () => {
                              setIsNextLoading(true);
                              await submitCurrentAnswer(currentQuestion);
                              if (activeCat) {
                                await fetch(`${apiBaseUrl}/bd/student/assessments/${activeCat}/submit`, {
                                  method: "GET",
                                  credentials: "include",
                                });
                              }
                              setIsNextLoading(false);
                              setIsTakingCat(false); // End the CAT UI
                            }}
                            disabled={isNextLoading || questions[currentQuestion]?.status !== "answered" && !isCurrentQuestionAnswered()}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center"
                          >
                            {isNextLoading ? <Loader2 size={16} className="animate-spin mr-2" /> : null}
                            {questions[currentQuestion]?.status === "answered" ? "Answered, Finish & Submit" : "Finish & Submit"}
                            <ChevronRight size={16} className="ml-1" />
                          </button>
                        )}
                      </div>
                      
                      <div className="mt-4">
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div
                            className="h-2.5 rounded-full bg-blue-600"
                            style={{
                              width: `${(getAnsweredCount() / questions.length) * 100}%`,
                            }}
                          ></div>
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {getAnsweredCount()} of {questions.length} answered
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="max-w-8xl mx-auto">
              {/* Stats Overview */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{
                    opacity: isLoading ? 0 : 1,
                    y: isLoading ? 20 : 0,
                  }}
                  transition={{ delay: 0.1 }}
                  className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
                >
                  {isLoading ? (
                    <div className="animate-pulse space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                      <div className="h-8 bg-gray-300 rounded w-1/3"></div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">
                          Total CATs
                        </p>
                        <p className="text-2xl font-bold text-gray-900">
                          {cats.length}
                        </p>
                      </div>
                      <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                        <BookOpen size={24} className="text-blue-600" />
                      </div>
                    </div>
                  )}
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{
                    opacity: isLoading ? 0 : 1,
                    y: isLoading ? 20 : 0,
                  }}
                  transition={{ delay: 0.2 }}
                  className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
                >
                  {isLoading ? (
                    <div className="animate-pulse space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                      <div className="h-8 bg-gray-300 rounded w-1/3"></div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">
                          Completed
                        </p>
                        <p className="text-2xl font-bold text-green-600">
                          {
                            cats.filter((cat) => cat.status === "completed")
                              .length
                          }
                        </p>
                      </div>
                      <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
                        <CheckCircle size={24} className="text-green-600" />
                      </div>
                    </div>
                  )}
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{
                    opacity: isLoading ? 0 : 1,
                    y: isLoading ? 20 : 0,
                  }}
                  transition={{ delay: 0.3 }}
                  className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
                >
                  {isLoading ? (
                    <div className="animate-pulse space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                      <div className="h-8 bg-gray-300 rounded w-1/3"></div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">
                          Average Score
                        </p>
                        <p className="text-2xl font-bold text-blue-600">
                          {averageScore ? averageScore.toFixed(1) : "0"}%
                        </p>
                      </div>
                      <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                        <TrendingUp size={24} className="text-blue-600" />
                      </div>
                    </div>
                  )}
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{
                    opacity: isLoading ? 0 : 1,
                    y: isLoading ? 20 : 0,
                  }}
                  transition={{ delay: 0.4 }}
                  className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
                >
                  {isLoading ? (
                    <div className="animate-pulse space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                      <div className="h-8 bg-gray-300 rounded w-1/3"></div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">
                          Pending
                        </p>
                        <p className="text-2xl font-bold text-amber-600">
                          {
                            cats.filter((cat) => cat.status === "start")
                              .length
                          }
                        </p>
                      </div>
                      <div className="w-12 h-12 bg-amber-50 rounded-lg flex items-center justify-center">
                        <Clock size={24} className="text-amber-600" />
                      </div>
                    </div>
                  )}
                </motion.div>
              </div>

              {/* Filter Tabs */}
              <div className="mb-6">
                <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-fit">
                  {["all", "start", "in-progress", "completed", "closed"].map((filter) => (
                    <button
                      key={filter}
                      onClick={() => setSelectedFilter(filter)}
                      className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                        selectedFilter === filter
                          ? "bg-white text-blue-600 shadow-sm"
                          : "text-gray-600 hover:text-gray-900"
                      }`}
                    >
                      {filter.charAt(0).toUpperCase() + filter.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* CATs List */}
              <div className="space-y-4">
                {isLoading
                  ? // Skeleton loading for CATs
                    Array.from({ length: 3 }).map((_, index) => (
                      <div
                        key={index}
                        className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 animate-pulse"
                      >
                        <div className="flex justify-between">
                          <div className="space-y-3 w-full">
                            <div className="h-5 bg-gray-300 rounded w-1/3"></div>
                            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                            <div className="flex items-center space-x-4">
                              <div className="h-4 bg-gray-200 rounded w-24"></div>
                              <div className="h-4 bg-gray-200 rounded w-20"></div>
                            </div>
                            <div className="h-24 bg-gray-100 rounded w-full"></div>
                          </div>
                          <div className="h-16 w-16 bg-gray-300 rounded-full ml-4"></div>
                        </div>
                      </div>
                    ))
                  : filteredCats.map((cat, index) => (
                      <motion.div
                        key={cat.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center mb-2">
                              <h3 className="text-lg font-semibold text-gray-900 mr-3">
                                {cat.title}
                              </h3>
                              <span
                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(
                                  getEffectiveStatus(cat)
                                )}`}
                              >
                                {getStatusIcon(getEffectiveStatus(cat))}
                                <span className="ml-1">
                                  {getStatusText(getEffectiveStatus(cat))}
                                </span>
                              </span>
                            </div>

                            <p className="text-sm text-gray-600 mb-3">
                              {cat.topic} • {Array.isArray(cat.questions_type) ? cat.questions_type.join(", ") : cat.questions_type} • {cat.number_of_questions} questions
                            </p>

                            <div className="flex items-center space-x-6 text-sm text-gray-500 mb-4">
                              <div className="flex items-center">
                                <Calendar size={16} className="mr-1" />
                                <span>
                                  Due:{" "}
                                  {cat.deadline ? new Date(cat.deadline).toLocaleDateString() : "No deadline"}
                                </span>
                              </div>

                              {cat.duration && (
                                <div className="flex items-center">
                                  <Clock size={16} className="mr-1" />
                                  <span>Duration: {cat.duration} mins</span>
                                </div>
                              )}

                              <div className="flex items-center">
                                <Award size={16} className="mr-1" />
                                <span>
                                  Total Marks: {cat.total_marks}
                                </span>
                              </div>
                            </div>

                            {getEffectiveStatus(cat) === "start" && (
                              <button
                                className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                onClick={() => handleStartCat(cat.id)}
                              >
                                Start CAT
                              </button>
                            )}
                            {getEffectiveStatus(cat) === "in-progress" && (
                              <button
                                className="mt-2 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
                                onClick={() => handleStartCat(cat.id)}
                              >
                                Continue CAT
                              </button>
                            )}
                            {getEffectiveStatus(cat) === "completed" && (
                              <button
                                type="button"
                                className="mt-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                                onClick={() =>
                                  router.push(
                                    `/student/courses?action=results&assessmentId=${encodeURIComponent(cat.id)}`
                                  )
                                }
                              >
                                Open CAT
                              </button>
                            )}
                            {getEffectiveStatus(cat) === "closed" && (
                              <div className="mt-2 px-4 py-2 bg-red-100 text-red-800 rounded-lg">
                                <AlertCircle size={16} className="inline mr-2" />
                                Closed
                              </div>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))}

                {!isLoading && filteredCats.length === 0 && (
                  <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-200">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <BookOpen size={24} className="text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      No {selectedFilter !== "all" ? selectedFilter : ""} CATs
                      found
                    </h3>
                    <p className="text-gray-600">
                      Check back later or select a different filter.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </main>
      </motion.div>
    </div>
  );
}

