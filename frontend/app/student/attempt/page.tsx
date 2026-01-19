/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  AlertCircle,
  ChevronRight,
  Clock,
  Loader2,
  Image as ImageIcon,
  FileText,
  XCircle,
  Edit3,
  Camera,
} from "lucide-react";
import type { QuestionType } from "@/types/assessment";

const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080/api/v1";

interface AttemptAssessment {
  id: string;
  title?: string;
  topic?: string;
  type?: string;
  duration?: number | null;
  number_of_questions?: number;
  total_marks?: number;
  questions?: AttemptQuestion[];
}

interface AttemptQuestion {
  id: string;
  text: string;
  type: QuestionType;
  choices?: (string | string[])[];
  marks: number;
  status?: "answered" | "not answered";
}

interface ImageUploadState {
  file: File | null;
  previewUrl: string | null;
  isUploading: boolean;
  error: string | null;
  imageId?: string;
}

export default function AttemptPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const assessmentId = searchParams.get("assessmentId");

  const [assessment, setAssessment] = useState<AttemptAssessment | null>(null);
  const [loading, setLoading] = useState(true);

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [questions, setQuestions] = useState<AttemptQuestion[]>([]);

  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [multipleAnswers, setMultipleAnswers] = useState<number[][]>([]);
  const [orderingAnswers, setOrderingAnswers] = useState<string[][]>([]);
  const [matchingAnswers, setMatchingAnswers] = useState<Record<string, string>[]>([]);
  const [dragDropAnswers, setDragDropAnswers] = useState<Record<string, string>[]>([]);

  const [openEndedAnswers, setOpenEndedAnswers] = useState<string[]>([]);
  const [openEndedInputModes, setOpenEndedInputModes] = useState<("text" | "image" | null)[]>([]);
  
  // State for image upload handling
  const [imageUploadStates, setImageUploadStates] = useState<ImageUploadState[]>([]);
  
  // Camera access state
  const [showCamera, setShowCamera] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [isNextLoading, setIsNextLoading] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState<number>(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!assessmentId) {
      router.replace("/student/unitworkspace");
      return;
    }

    let isMounted = true;
    setLoading(true);

    fetch(`${apiBaseUrl}/bd/student/assessments`, { credentials: "include" })
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => {
        if (!isMounted) return;
        const list = Array.isArray(data) ? data : [];
        const found = list.find((a: any) => String(a.id) === String(assessmentId)) || null;
        setAssessment(found);

        const qs = (found?.questions || []) as AttemptQuestion[];
        setQuestions(qs);

        setCurrentQuestion(0);
        setSelectedAnswers(Array(qs.length).fill(-1));
        setMultipleAnswers(Array(qs.length).fill([]));
        setOpenEndedAnswers(Array(qs.length).fill(""));
        setOpenEndedInputModes(Array(qs.length).fill(null));

        // Initialize image upload states
        setImageUploadStates(
          Array(qs.length).fill(null).map(() => ({
            file: null,
            previewUrl: null,
            isUploading: false,
            error: null,
            imageId: undefined,
          }))
        );

        setOrderingAnswers(
          qs.map((q) => {
            if (q.type === "close-ended-ordering") {
              const choices = (q.choices || []).filter((c): c is string => typeof c === "string");
              return [...choices];
            }
            return [];
          })
        );
        setMatchingAnswers(qs.map(() => ({})));
        setDragDropAnswers(qs.map(() => ({})));

        const initial = ((found?.duration || 60) as number) * 60;
        setTimeRemaining(initial);

        if (timerRef.current) {
          clearInterval(timerRef.current);
        }
        timerRef.current = setInterval(() => {
          setTimeRemaining((prev) => {
            const next = Math.max(0, prev - 1);
            if (next === 0) {
              if (timerRef.current) {
                clearInterval(timerRef.current);
                timerRef.current = null;
              }
              void submitFinal();
            }
            return next;
          });
        }, 1000);
      })
      .catch(() => {
        if (!isMounted) return;
        setAssessment(null);
        setQuestions([]);
      })
      .finally(() => {
        if (!isMounted) return;
        setLoading(false);
      });

    return () => {
      isMounted = false;
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      stopCamera();
    };
  }, [assessmentId, router]);

  // Camera functions
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'environment',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        } 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setShowCamera(true);
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      alert('Unable to access camera. Please check permissions and try again.');
    }
  };

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setShowCamera(false);
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext('2d');
      if (context) {
        canvasRef.current.width = videoRef.current.videoWidth;
        canvasRef.current.height = videoRef.current.videoHeight;
        context.drawImage(videoRef.current, 0, 0);
        
        canvasRef.current.toBlob((blob) => {
          if (blob) {
            const file = new File([blob], `camera-capture-${Date.now()}.jpg`, { 
              type: 'image/jpeg' 
            });
            handleImageUpload(currentQuestion, file);
            stopCamera();
          }
        }, 'image/jpeg', 0.9);
      }
    }
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
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

  const handleImageUpload = async (questionIndex: number, file: File) => {
    // Validate file
    if (!file.type.startsWith('image/')) {
      alert('Please upload a valid image file (JPEG, PNG, etc.)');
      return;
    }

    // Check file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert('Image file is too large. Please upload an image smaller than 10MB');
      return;
    }

    // Create preview URL
    const previewUrl = URL.createObjectURL(file);
    
    // Update state with new file and preview immediately
    const newStates = [...imageUploadStates];
    newStates[questionIndex] = {
      ...newStates[questionIndex],
      file,
      previewUrl,
      isUploading: true,
      error: null,
    };
    setImageUploadStates(newStates);

    try {
      // In a real implementation, you would upload the image to your server here
      // For now, we'll simulate upload and generate a unique ID
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate upload delay
      
      const imageId = `img-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      
      setImageUploadStates(prevStates => {
        const updatedStates = [...prevStates];
        updatedStates[questionIndex] = {
          ...updatedStates[questionIndex],
          isUploading: false,
          imageId,
        };
        return updatedStates;
      });

      // Set open-ended answer to indicate image upload
      const newAnswers = [...openEndedAnswers];
      newAnswers[questionIndex] = `[Image uploaded: ${file.name}]`;
      setOpenEndedAnswers(newAnswers);
    } catch (error) {
      setImageUploadStates(prevStates => {
        const errorStates = [...prevStates];
        errorStates[questionIndex] = {
          ...errorStates[questionIndex],
          isUploading: false,
          error: error instanceof Error ? error.message : "Failed to upload image",
        };
        return errorStates;
      });
    }
  };

  const handleRemoveImage = (questionIndex: number) => {
    const state = imageUploadStates[questionIndex];
    if (state.previewUrl) {
      URL.revokeObjectURL(state.previewUrl);
    }

    const newStates = [...imageUploadStates];
    newStates[questionIndex] = {
      file: null,
      previewUrl: null,
      isUploading: false,
      error: null,
      imageId: undefined,
    };
    setImageUploadStates(newStates);

    // Clear the answer
    const newAnswers = [...openEndedAnswers];
    newAnswers[questionIndex] = "";
    setOpenEndedAnswers(newAnswers);
  };

  const isCurrentQuestionAnswered = () => {
    if (questions.length === 0) return false;
    const q = questions[currentQuestion];

    switch (q.type) {
      case "open-ended": {
        const inputMode = openEndedInputModes[currentQuestion];
        if (inputMode === "text") {
          return !!openEndedAnswers[currentQuestion]?.trim();
        } else if (inputMode === "image") {
          const uploadState = imageUploadStates[currentQuestion];
          // Question is answered if an image has been uploaded
          return !!uploadState.file;
        }
        return false;
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

  const renderQuestion = (question: AttemptQuestion, index: number) => {
    if (question.type === "open-ended") {
      const handleInputModeChange = (mode: "text" | "image") => {
        const newModes = [...openEndedInputModes];
        newModes[index] = mode;
        setOpenEndedInputModes(newModes);
      };

      const inputMode = openEndedInputModes[index];

      if (!inputMode) {
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">
              Question {index + 1}: {question.text}
            </h3>
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <p className="text-sm text-blue-900 mb-4">
                Please choose how you would like to answer this question. This choice cannot be changed.
              </p>
              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => handleInputModeChange("text")}
                  className="flex items-center gap-2 px-5 py-3 bg-white border-2 border-blue-500 text-blue-700 rounded-lg hover:bg-blue-50 transition-colors font-medium"
                >
                  <FileText className="w-5 h-5" />
                  Answer with Text
                </button>
                <button
                  type="button"
                  onClick={() => handleInputModeChange("image")}
                  className="flex items-center gap-2 px-5 py-3 bg-white border-2 border-purple-500 text-purple-700 rounded-lg hover:bg-purple-50 transition-colors font-medium"
                >
                  <ImageIcon className="w-5 h-5" />
                  Upload an Image
                </button>
              </div>
            </div>
          </div>
        );
      }

      return (
        <div className="space-y-4">
          <div className="flex items-start justify-between gap-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Question {index + 1}: {question.text}
            </h3>
            <div className="text-sm font-medium text-gray-700">{question.marks} marks</div>
          </div>

          {inputMode === "text" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Your Answer</label>
              <textarea
                rows={6}
                value={openEndedAnswers[index] || ""}
                onChange={(e) => {
                  const next = [...openEndedAnswers];
                  next[index] = e.target.value;
                  setOpenEndedAnswers(next);
                }}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Type your answer here..."
              />
            </div>
          )}

          {inputMode === "image" && (
            <div className="space-y-4">
              {/* Camera Modal */}
              {showCamera && (
                <div className="fixed inset-0 z-50 bg-black bg-opacity-90 flex flex-col items-center justify-center p-4">
                  <div className="w-full max-w-2xl">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-white text-lg font-semibold">Take a Photo</h3>
                      <button
                        onClick={stopCamera}
                        className="text-white hover:text-gray-300"
                      >
                        <XCircle className="w-6 h-6" />
                      </button>
                    </div>
                    
                    <div className="relative bg-black rounded-lg overflow-hidden">
                      <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        className="w-full h-auto max-h-[70vh] object-contain"
                      />
                      <canvas ref={canvasRef} className="hidden" />
                    </div>
                    
                    <div className="flex justify-center gap-4 mt-4">
                      <button
                        onClick={capturePhoto}
                        className="px-6 py-3 bg-red-600 text-white rounded-full hover:bg-red-700 flex items-center gap-2"
                      >
                        <Camera className="w-5 h-5" />
                        Capture Photo
                      </button>
                      <button
                        onClick={stopCamera}
                        className="px-6 py-3 bg-gray-700 text-white rounded-full hover:bg-gray-600"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {!imageUploadStates[index].file ? (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Upload Image Answer
                  </label>
                  <p className="text-sm text-gray-600 mb-4">
                    Upload an image of your handwritten answer, diagram, or work. The AI will analyze the image directly.
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-blue-400 transition-colors">
                      <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                      <p className="text-sm text-gray-600 mb-4">
                        Upload from device
                      </p>
                      <input
                        type="file"
                        accept="image/*"
                        capture="environment"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            handleImageUpload(index, file);
                          }
                        }}
                        className="hidden"
                        id={`image-upload-${index}`}
                      />
                      <label
                        htmlFor={`image-upload-${index}`}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer transition-colors"
                      >
                        <ImageIcon className="w-4 h-4" />
                        Choose Image
                      </label>
                    </div>
                    
                    <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-purple-400 transition-colors">
                      <Camera className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                      <p className="text-sm text-gray-600 mb-4">
                        Use camera (mobile)
                      </p>
                      <button
                        onClick={startCamera}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                      >
                        <Camera className="w-4 h-4" />
                        Open Camera
                      </button>
                    </div>
                  </div>
                  
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <Edit3 className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-yellow-900 mb-1">
                          Important Note
                        </p>
                        <ul className="text-xs text-yellow-800 space-y-1 list-disc ml-4">
                          <li>Ensure your handwriting is clear and legible</li>
                          <li>Use good lighting when taking photos</li>
                          <li>Make sure the entire answer is visible in the frame</li>
                          <li>The AI will analyze the image directly - no OCR is used</li>
                          <li>You can upload multiple images if needed (max 10MB each)</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Image Preview */}
                  <div className="border border-gray-200 rounded-xl overflow-hidden">
                    <div className="bg-gray-50 px-4 py-2 border-b border-gray-200 flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">Uploaded Image</span>
                      <div className="flex items-center gap-3">
                        {imageUploadStates[index].imageId && (
                          <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded">
                            ✓ Uploaded
                          </span>
                        )}
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(index)}
                          className="text-sm text-red-600 hover:text-red-700 flex items-center gap-1"
                        >
                          <XCircle className="w-4 h-4" />
                          Remove
                        </button>
                      </div>
                    </div>
                    <div className="p-4 bg-white">
                      {imageUploadStates[index].previewUrl ? (
                        <div className="flex flex-col items-center">
                          <img
                            src={imageUploadStates[index].previewUrl!}
                            alt="Uploaded answer"
                            className="max-w-full max-h-96 mx-auto rounded-lg shadow-sm object-contain"
                            onError={(e) => {
                              console.error('Image preview failed to load');
                              e.currentTarget.src = '';
                              e.currentTarget.alt = 'Preview unavailable';
                            }}
                          />
                          <p className="text-xs text-gray-500 mt-2">
                            {imageUploadStates[index].file?.name} • 
                            {(imageUploadStates[index].file?.size || 0) > 1024 * 1024 
                              ? `${(imageUploadStates[index].file!.size / (1024 * 1024)).toFixed(2)} MB`
                              : `${Math.round(imageUploadStates[index].file!.size / 1024)} KB`
                            }
                          </p>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center h-48 bg-gray-100 rounded-lg">
                          <p className="text-gray-500">Loading preview...</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Uploading Status */}
                  {imageUploadStates[index].isUploading && (
                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                      <div className="flex items-center gap-3">
                        <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
                        <div>
                          <div className="text-sm font-medium text-blue-900">
                            Uploading image...
                          </div>
                          <div className="text-xs text-blue-700">
                            Preparing image for AI analysis
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Upload Error */}
                  {imageUploadStates[index].error && (
                    <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                      <div className="flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <div className="text-sm font-medium text-red-900 mb-1">
                            Upload failed
                          </div>
                          <div className="text-xs text-red-700">
                            {imageUploadStates[index].error}
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              if (imageUploadStates[index].file) {
                                handleImageUpload(index, imageUploadStates[index].file!);
                              }
                            }}
                            className="mt-2 text-sm text-red-700 hover:text-red-800 font-medium"
                          >
                            Try Again
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Additional Notes Field */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      <Edit3 className="w-4 h-4 inline mr-1" />
                      Additional Notes (Optional)
                    </label>
                    <p className="text-xs text-gray-500 mb-2">
                      Add any additional context or explanations that might help the AI understand your image answer better.
                    </p>
                    <textarea
                      rows={3}
                      value={openEndedAnswers[index] || ""}
                      onChange={(e) => {
                        const next = [...openEndedAnswers];
                        next[index] = e.target.value;
                        setOpenEndedAnswers(next);
                      }}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Add notes about your image answer..."
                    />
                  </div>

                  {/* Upload Another Image Option */}
                  <div className="border-t pt-4">
                    <p className="text-sm text-gray-600 mb-3">
                      Need to upload another image for this answer?
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            handleImageUpload(index, file);
                          }
                        }}
                        className="hidden"
                        id={`additional-upload-${index}`}
                      />
                      <label
                        htmlFor={`additional-upload-${index}`}
                        className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 cursor-pointer transition-colors text-sm"
                      >
                        <ImageIcon className="w-3 h-3" />
                        Add Another Image
                      </label>
                      <button
                        onClick={startCamera}
                        className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
                      >
                        <Camera className="w-3 h-3" />
                        Take Another Photo
                      </button>
                    </div>
                  </div>
                </div>
              )}
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
            <h3 className="text-lg font-semibold text-gray-900">
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
            <h3 className="text-lg font-semibold text-gray-900">
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
                    checked ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:bg-gray-50"
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
      const currentOrder = orderingAnswers[index] && orderingAnswers[index].length > 0 ? orderingAnswers[index] : baseChoices;

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
            <h3 className="text-lg font-semibold text-gray-900">
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
                    onClick={() => move(itemIndex, Math.min(currentOrder.length - 1, itemIndex + 1))}
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
            <h3 className="text-lg font-semibold text-gray-900">
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
            <h3 className="text-lg font-semibold text-gray-900">
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
                        placed ? "border-blue-500 bg-blue-50" : "border-dashed border-gray-300 bg-gray-50"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{target}</div>
                          <div className="text-sm text-gray-700">{placed || "Drop an item here"}</div>
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
        <h3 className="text-lg font-semibold text-gray-900">
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

    if (question.type === "open-ended") {
      const inputMode = openEndedInputModes[questionIndex];
      if (inputMode === "text") {
        formData.append("answer_type", "text");
        formData.append("text_answer", openEndedAnswers[questionIndex] || "");
      } else if (inputMode === "image") {
        const imageFile = imageUploadStates[questionIndex].file;
        const notes = openEndedAnswers[questionIndex] || "";
        
        // Send the image directly to AI
        formData.append("answer_type", "image");
        if (imageFile) {
          formData.append("image", imageFile);
        }
        // Optional notes for context
        formData.append("notes", notes);
      }
    } else {
      const rawChoices = question.choices || [];
      const choices = rawChoices.filter((c): c is string => typeof c === "string");

      let textAnswer = "";
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
          textAnswer = JSON.stringify(orderingAnswers[questionIndex] || []);
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
    } catch {
      // ignore
    }
  };

  const submitFinal = async () => {
    if (!assessmentId) return;
    try {
      await fetch(`${apiBaseUrl}/bd/student/assessments/${assessmentId}/submit`, {
        method: "GET",
        credentials: "include",
      });
    } catch {
      // ignore
    } finally {
      router.replace("/student/dashboard");
    }
  };

  if (!assessmentId) return null;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="flex items-center gap-3 text-gray-700">
          <Loader2 className="h-5 w-5 animate-spin" />
          Loading assessment...
        </div>
      </div>
    );
  }

  if (!assessment || questions.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white border border-gray-200 rounded-2xl p-6">
          <div className="flex items-center gap-2 text-red-600 font-semibold">
            <AlertCircle className="h-5 w-5" />
            Unable to load assessment.
          </div>
          <button
            type="button"
            onClick={() => router.replace("/student/unitworkspace")}
            className="mt-4 w-full px-4 py-2 bg-gray-900 text-white rounded-lg"
          >
            Back to Workspace
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-xl font-bold text-gray-900">{assessment.title || "Assessment"}</h1>
            <p className="text-sm text-gray-600">{assessment.topic || ""}</p>
          </div>
          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-white font-medium ${
            timeRemaining < 300 ? "bg-red-500" : "bg-blue-600"
          }`}>
            <Clock className="h-4 w-4" />
            {formatTime(timeRemaining)}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
          {renderQuestion(questions[currentQuestion], currentQuestion)}

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-6">
            <div className="text-sm text-gray-600">
              Question {currentQuestion + 1} of {questions.length}
            </div>

            {currentQuestion < questions.length - 1 ? (
              <button
                type="button"
                onClick={async () => {
                  setIsNextLoading(true);
                  await submitCurrentAnswer(currentQuestion);
                  setCurrentQuestion(currentQuestion + 1);
                  setIsNextLoading(false);
                }}
                disabled={isNextLoading || !isCurrentQuestionAnswered()}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 inline-flex items-center justify-center"
              >
                {isNextLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                Next
                <ChevronRight className="h-4 w-4 ml-1" />
              </button>
            ) : (
              <button
                type="button"
                onClick={async () => {
                  setIsNextLoading(true);
                  await submitCurrentAnswer(currentQuestion);
                  await submitFinal();
                  setIsNextLoading(false);
                }}
                disabled={isNextLoading || !isCurrentQuestionAnswered()}
                className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50 inline-flex items-center justify-center"
              >
                {isNextLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                Finish & Submit
                <ChevronRight className="h-4 w-4 ml-1" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}