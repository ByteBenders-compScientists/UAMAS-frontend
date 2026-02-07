/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
// attempt/page.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
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
  CheckCircle,
  RefreshCw,
  Mic,
  MicOff,
  Volume2,
} from "lucide-react";
import type { QuestionType } from "@/types/assessment";
import { extractTextFromImage, validateImageForOCR } from "@/services/groqOCRService";
import { extractTextFromAudio, validateAudioForTranscription } from "@/services/Groqvoice";
import { useTheme } from "@/context/ThemeContext";

const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.taya-dev.tech/api/v1";

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
  // OCR related
  isExtractingText: boolean;
  extractedText: string;
  ocrError: string | null;
  ocrCompleted: boolean;
}

interface VoiceRecordingState {
  isRecording: boolean;
  audioFile: File | null;
  audioUrl: string | null;
  isTranscribing: boolean;
  transcribedText: string;
  transcriptionError: string | null;
  transcriptionCompleted: boolean;
  recordingDuration: number;
}

export default function AttemptPage() {
  const router = useRouter();
  const [assessmentId, setAssessmentId] = useState<string | null>(null);

  // Get theme from context
  const { colors, config } = useTheme();
  
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
  const [openEndedInputModes, setOpenEndedInputModes] = useState<("text" | "image" | "voice" | null)[]>([]);
  
  // State for image upload handling
  const [imageUploadStates, setImageUploadStates] = useState<ImageUploadState[]>([]);
  
  // State for voice recording handling
  const [voiceRecordingStates, setVoiceRecordingStates] = useState<VoiceRecordingState[]>([]);
  
  // Camera access state
  const [showCamera, setShowCamera] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Voice recording refs
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recordingTimerRef = useRef<NodeJS.Timeout | null>(null);

  const [isNextLoading, setIsNextLoading] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState<number>(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // FIXED: Combined the two useEffect hooks and check URL directly
  useEffect(() => {
    // Get assessmentId from URL immediately
    const params = new URLSearchParams(window.location.search);
    const urlAssessmentId = params.get("assessmentId");
    
    // If no assessmentId in URL, redirect immediately
    if (!urlAssessmentId) {
      router.replace("/student/unitworkspace");
      return;
    }
    
    // Set the state
    setAssessmentId(urlAssessmentId);
    
    let isMounted = true;
    setLoading(true);

    fetch(`${apiBaseUrl}/bd/student/assessments`, { credentials: "include" })
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => {
        if (!isMounted) return;
        const list = Array.isArray(data) ? data : [];
        const found = list.find((a: any) => String(a.id) === String(urlAssessmentId)) || null;
        setAssessment(found);

        const qs = (found?.questions || []) as AttemptQuestion[];
        setQuestions(qs);

        setCurrentQuestion(0);
        setSelectedAnswers(Array(qs.length).fill(-1));
        setMultipleAnswers(Array(qs.length).fill([]));
        setOpenEndedAnswers(Array(qs.length).fill(""));
        setOpenEndedInputModes(Array(qs.length).fill(null));

        // Initialize image upload states with OCR fields
        setImageUploadStates(
          Array(qs.length).fill(null).map(() => ({
            file: null,
            previewUrl: null,
            isUploading: false,
            error: null,
            imageId: undefined,
            isExtractingText: false,
            extractedText: "",
            ocrError: null,
            ocrCompleted: false,
          }))
        );

        // Initialize voice recording states
        setVoiceRecordingStates(
          Array(qs.length).fill(null).map(() => ({
            isRecording: false,
            audioFile: null,
            audioUrl: null,
            isTranscribing: false,
            transcribedText: "",
            transcriptionError: null,
            transcriptionCompleted: false,
            recordingDuration: 0,
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
      stopVoiceRecording(currentQuestion);
    };
  }, [router]); // Removed assessmentId dependency since we get it from URL directly

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

  // Voice recording functions
  const startVoiceRecording = async (questionIndex: number) => {
    try {
      // Request audio with specific constraints for external devices
      const constraints = {
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          sampleRate: 48000,
        }
      };

      console.log('Requesting microphone access...');
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      console.log('Microphone access granted, stream:', stream);
      console.log('Audio tracks:', stream.getAudioTracks());

      // Check if we got audio tracks
      if (stream.getAudioTracks().length === 0) {
        throw new Error('No audio tracks available');
      }

      // Try to determine supported MIME types
      let mimeType = 'audio/webm';
      const supportedTypes = [
        'audio/webm;codecs=opus',
        'audio/webm',
        'audio/ogg;codecs=opus',
        'audio/mp4',
        'audio/mpeg',
      ];

      for (const type of supportedTypes) {
        if (MediaRecorder.isTypeSupported(type)) {
          mimeType = type;
          console.log('Using MIME type:', mimeType);
          break;
        }
      }

      const mediaRecorder = new MediaRecorder(stream, { mimeType });
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      console.log('MediaRecorder created with state:', mediaRecorder.state);

      mediaRecorder.ondataavailable = (event) => {
        console.log('Data available:', event.data.size, 'bytes');
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onerror = (event) => {
        console.error('MediaRecorder error:', event);
        alert('Recording error occurred. Please try again.');
      };

      mediaRecorder.onstop = async () => {
        console.log('Recording stopped, chunks:', audioChunksRef.current.length);
        
        if (audioChunksRef.current.length === 0) {
          alert('No audio data was recorded. Please check your microphone and try again.');
          stream.getTracks().forEach(track => track.stop());
          
          setVoiceRecordingStates(prevStates => {
            const updatedStates = [...prevStates];
            updatedStates[questionIndex] = {
              ...updatedStates[questionIndex],
              isRecording: false,
            };
            return updatedStates;
          });
          return;
        }

        const audioBlob = new Blob(audioChunksRef.current, { type: mimeType });
        console.log('Audio blob created:', audioBlob.size, 'bytes');
        
        const audioFile = new File([audioBlob], `recording_${Date.now()}.webm`, {
          type: mimeType,
        });
        const audioUrl = URL.createObjectURL(audioBlob);

        // Stop recording timer
        if (recordingTimerRef.current) {
          clearInterval(recordingTimerRef.current);
          recordingTimerRef.current = null;
        }

        // Update state with recorded audio
        setVoiceRecordingStates(prevStates => {
          const updatedStates = [...prevStates];
          updatedStates[questionIndex] = {
            ...updatedStates[questionIndex],
            isRecording: false,
            audioFile,
            audioUrl,
            isTranscribing: true,
          };
          return updatedStates;
        });

        // Stop all tracks to release microphone
        stream.getTracks().forEach(track => track.stop());

        // Start transcription
        await handleVoiceTranscription(questionIndex, audioFile);
      };

      // Start recording with timeslice for regular data events
      mediaRecorder.start(1000); // Collect data every second
      console.log('Recording started');

      // Update state to show recording
      setVoiceRecordingStates(prevStates => {
        const updatedStates = [...prevStates];
        updatedStates[questionIndex] = {
          ...updatedStates[questionIndex],
          isRecording: true,
          recordingDuration: 0,
        };
        return updatedStates;
      });

      // Start recording duration timer
      recordingTimerRef.current = setInterval(() => {
        setVoiceRecordingStates(prevStates => {
          const updatedStates = [...prevStates];
          updatedStates[questionIndex] = {
            ...updatedStates[questionIndex],
            recordingDuration: updatedStates[questionIndex].recordingDuration + 1,
          };
          return updatedStates;
        });
      }, 1000);

    } catch (error) {
      console.error('Error accessing microphone:', error);
      
      let errorMessage = 'Unable to access microphone. ';
      if (error instanceof Error) {
        if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
          errorMessage += 'Please grant microphone permissions in your browser settings and try again.';
        } else if (error.name === 'NotFoundError' || error.name === 'DevicesNotFoundError') {
          errorMessage += 'No microphone found. Please connect a microphone or headset and try again.';
        } else if (error.name === 'NotReadableError' || error.name === 'TrackStartError') {
          errorMessage += 'Microphone is already in use by another application. Please close other apps and try again.';
        } else {
          errorMessage += error.message;
        }
      }
      
      alert(errorMessage);
    }
  };

  const stopVoiceRecording = (questionIndex: number) => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
    }
  };

  const handleVoiceTranscription = async (questionIndex: number, audioFile: File) => {
    const validation = validateAudioForTranscription(audioFile);
    if (!validation.valid) {
      setVoiceRecordingStates(prevStates => {
        const updatedStates = [...prevStates];
        updatedStates[questionIndex] = {
          ...updatedStates[questionIndex],
          isTranscribing: false,
          transcriptionError: validation.error || "Invalid audio file",
        };
        return updatedStates;
      });
      return;
    }

    const transcriptionResult = await extractTextFromAudio(audioFile);

    setVoiceRecordingStates(prevStates => {
      const updatedStates = [...prevStates];
      updatedStates[questionIndex] = {
        ...updatedStates[questionIndex],
        isTranscribing: false,
        transcribedText: transcriptionResult.extractedText,
        transcriptionError: transcriptionResult.error || null,
        transcriptionCompleted: transcriptionResult.success,
      };
      return updatedStates;
    });

    // Set the transcribed text as the answer
    if (transcriptionResult.success) {
      const newAnswers = [...openEndedAnswers];
      newAnswers[questionIndex] = transcriptionResult.extractedText;
      setOpenEndedAnswers(newAnswers);
    }
  };

  const handleRetryTranscription = async (questionIndex: number) => {
    const currentState = voiceRecordingStates[questionIndex];
    if (!currentState.audioFile) return;

    setVoiceRecordingStates(prevStates => {
      const updatedStates = [...prevStates];
      updatedStates[questionIndex] = {
        ...updatedStates[questionIndex],
        isTranscribing: true,
        transcriptionError: null,
      };
      return updatedStates;
    });

    await handleVoiceTranscription(questionIndex, currentState.audioFile);
  };

  const handleRemoveVoiceRecording = (questionIndex: number) => {
    const state = voiceRecordingStates[questionIndex];
    if (state.audioUrl) {
      URL.revokeObjectURL(state.audioUrl);
    }

    const newStates = [...voiceRecordingStates];
    newStates[questionIndex] = {
      isRecording: false,
      audioFile: null,
      audioUrl: null,
      isTranscribing: false,
      transcribedText: "",
      transcriptionError: null,
      transcriptionCompleted: false,
      recordingDuration: 0,
    };
    setVoiceRecordingStates(newStates);

    // Clear the answer
    const newAnswers = [...openEndedAnswers];
    newAnswers[questionIndex] = "";
    setOpenEndedAnswers(newAnswers);
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const formatRecordingDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
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
    const validation = validateImageForOCR(file);
    if (!validation.valid) {
      alert(validation.error);
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
      isExtractingText: false,
      extractedText: "",
      ocrError: null,
      ocrCompleted: false,
    };
    setImageUploadStates(newStates);

    try {
      // Simulate upload delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const imageId = `img-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      
      setImageUploadStates(prevStates => {
        const updatedStates = [...prevStates];
        updatedStates[questionIndex] = {
          ...updatedStates[questionIndex],
          isUploading: false,
          imageId,
          isExtractingText: true, // Start OCR extraction
        };
        return updatedStates;
      });

      // Start OCR text extraction
      const ocrResult = await extractTextFromImage(file);

      setImageUploadStates(prevStates => {
        const updatedStates = [...prevStates];
        updatedStates[questionIndex] = {
          ...updatedStates[questionIndex],
          isExtractingText: false,
          extractedText: ocrResult.extractedText,
          ocrError: ocrResult.error || null,
          ocrCompleted: ocrResult.success,
        };
        return updatedStates;
      });

      // Set the extracted text as the answer
      if (ocrResult.success) {
        const newAnswers = [...openEndedAnswers];
        newAnswers[questionIndex] = ocrResult.extractedText;
        setOpenEndedAnswers(newAnswers);
      }

    } catch (error) {
      setImageUploadStates(prevStates => {
        const updatedStates = [...prevStates];
        updatedStates[questionIndex] = {
          ...prevStates[questionIndex],
          isUploading: false,
          isExtractingText: false,
          error: error instanceof Error ? error.message : "Failed to upload image",
        };
        return updatedStates;
      });
    }
  };

  const handleRetryOCR = async (questionIndex: number) => {
    const currentState = imageUploadStates[questionIndex];
    if (!currentState.file) return;

    setImageUploadStates(prevStates => {
      const updatedStates = [...prevStates];
      updatedStates[questionIndex] = {
        ...updatedStates[questionIndex],
        isExtractingText: true,
        ocrError: null,
      };
      return updatedStates;
    });

    const ocrResult = await extractTextFromImage(currentState.file);

    setImageUploadStates(prevStates => {
      const updatedStates = [...prevStates];
      updatedStates[questionIndex] = {
        ...updatedStates[questionIndex],
        isExtractingText: false,
        extractedText: ocrResult.extractedText,
        ocrError: ocrResult.error || null,
        ocrCompleted: ocrResult.success,
      };
      return updatedStates;
    });

    if (ocrResult.success) {
      const newAnswers = [...openEndedAnswers];
      newAnswers[questionIndex] = ocrResult.extractedText;
      setOpenEndedAnswers(newAnswers);
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
      isExtractingText: false,
      extractedText: "",
      ocrError: null,
      ocrCompleted: false,
    };
    setImageUploadStates(newStates);

    // Clear the answer
    const newAnswers = [...openEndedAnswers];
    newAnswers[questionIndex] = "";
    setOpenEndedAnswers(newAnswers);
  };

  const isQuestionAnsweredByStatus = (question?: AttemptQuestion) =>
    String(question?.status || "").toLowerCase() === "answered";

  const isCurrentQuestionAnswered = () => {
    if (questions.length === 0) return false;
    const q = questions[currentQuestion];

    if (isQuestionAnsweredByStatus(q)) {
      return true;
    }

    switch (q.type) {
      case "open-ended": {
        const inputMode = openEndedInputModes[currentQuestion];
        if (inputMode === "text") {
          return !!openEndedAnswers[currentQuestion]?.trim();
        } else if (inputMode === "image") {
          // Question is answered if text has been extracted from the image
          const uploadState = imageUploadStates[currentQuestion];
          return uploadState.ocrCompleted && !!openEndedAnswers[currentQuestion]?.trim();
        } else if (inputMode === "voice") {
          // Question is answered if voice has been transcribed
          const voiceState = voiceRecordingStates[currentQuestion];
          return voiceState.transcriptionCompleted && !!openEndedAnswers[currentQuestion]?.trim();
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
      const handleInputModeChange = (mode: "text" | "image" | "voice") => {
        const newModes = [...openEndedInputModes];
        newModes[index] = mode;
        setOpenEndedInputModes(newModes);
      };

      const inputMode = openEndedInputModes[index];

      if (!inputMode) {
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold" style={{ color: colors.textPrimary }}>
              Question {index + 1}: {question.text}
            </h3>
            <div 
              className="rounded-xl p-4"
              style={{ 
                backgroundColor: config.mode === 'dark' ? colors.backgroundSecondary : colors.primaryLight,
                borderColor: config.mode === 'dark' ? colors.borderLight : colors.primaryLight,
                border: `1px solid ${config.mode === 'dark' ? colors.borderLight : colors.primary}`
              }}
            >
              <p 
                className="text-sm mb-4"
                style={{ color: config.mode === 'dark' ? colors.textPrimary : colors.primaryDark }}
              >
                Please choose how you would like to answer this question. This choice cannot be changed.
              </p>
              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => handleInputModeChange("text")}
                  className="flex items-center gap-2 px-5 py-3 rounded-lg hover:opacity-90 transition-colors font-medium"
                  style={{
                    backgroundColor: config.mode === 'dark' ? colors.backgroundTertiary : 'white',
                    color: colors.info,
                    border: `2px solid ${colors.info}`
                  }}
                >
                  <FileText className="w-5 h-5" />
                  Answer with Text
                </button>
                <button
                  type="button"
                  onClick={() => handleInputModeChange("image")}
                  className="flex items-center gap-2 px-5 py-3 rounded-lg hover:opacity-90 transition-colors font-medium"
                  style={{
                    backgroundColor: config.mode === 'dark' ? colors.backgroundTertiary : 'white',
                    color: colors.accent,
                    border: `2px solid ${colors.accent}`
                  }}
                >
                  <ImageIcon className="w-5 h-5" />
                  Upload an Image (AI Text Extraction)
                </button>
                <button
                  type="button"
                  onClick={() => handleInputModeChange("voice")}
                  className="flex items-center gap-2 px-5 py-3 rounded-lg hover:opacity-90 transition-colors font-medium"
                  style={{
                    backgroundColor: config.mode === 'dark' ? colors.backgroundTertiary : 'white',
                    color: colors.success,
                    border: `2px solid ${colors.success}`
                  }}
                >
                  <Mic className="w-5 h-5" />
                  Answer with Voice (AI Transcription)
                </button>
              </div>
            </div>
          </div>
        );
      }

      return (
        <div className="space-y-4">
          <div className="flex items-start justify-between gap-4">
            <h3 className="text-lg font-semibold" style={{ color: colors.textPrimary }}>
              Question {index + 1}: {question.text}
            </h3>
            <div 
              className="text-sm font-medium"
              style={{ color: colors.textSecondary }}
            >
              {question.marks} marks
            </div>
          </div>

          {inputMode === "text" && (
            <div>
              <label 
                className="block text-sm font-medium mb-2"
                style={{ color: colors.textSecondary }}
              >
                Your Answer
              </label>
              <textarea
                rows={6}
                value={openEndedAnswers[index] || ""}
                onChange={(e) => {
                  const next = [...openEndedAnswers];
                  next[index] = e.target.value;
                  setOpenEndedAnswers(next);
                }}
                className="w-full p-3 rounded-lg focus:ring-2 focus:outline-none"
                placeholder="Type your answer here..."
                style={{
                  backgroundColor: colors.inputBackground,
                  borderColor: colors.inputBorder,
                  border: `1px solid ${colors.inputBorder}`,
                  color: colors.textPrimary,
                }}
              />
            </div>
          )}

          {inputMode === "voice" && (
            <div className="space-y-4">
              {!voiceRecordingStates[index].audioFile ? (
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: colors.textSecondary }}>
                    Record Voice Answer
                  </label>
                  <p className="text-sm mb-4" style={{ color: colors.textSecondary }}>
                    Record your answer using your microphone. Our AI will automatically transcribe what you say for you to review and edit.
                  </p>
                  
                  {!voiceRecordingStates[index].isRecording ? (
                    <div 
                      className="border-2 border-dashed rounded-xl p-8 text-center transition-colors"
                      style={{
                        borderColor: config.mode === 'dark' ? colors.borderLight : colors.success,
                      }}
                    >
                      <Mic className="w-16 h-16 mx-auto mb-4" style={{ color: colors.textTertiary }} />
                      <p className="text-sm mb-4" style={{ color: colors.textSecondary }}>
                        Click below to start recording your answer
                      </p>
                      <button
                        onClick={() => startVoiceRecording(index)}
                        className="inline-flex items-center gap-2 px-6 py-3 text-white rounded-lg transition-colors font-medium"
                        style={{ backgroundColor: colors.success }}
                      >
                        <Mic className="w-5 h-5" />
                        Start Recording
                      </button>
                    </div>
                  ) : (
                    <div 
                      className="border-2 rounded-xl p-8 text-center animate-pulse"
                      style={{
                        backgroundColor: config.mode === 'dark' ? `${colors.error}20` : `${colors.error}10`,
                        borderColor: colors.error
                      }}
                    >
                      <div className="flex justify-center mb-4">
                        <div className="relative">
                          <Mic className="w-16 h-16" style={{ color: colors.error }} />
                          <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full animate-ping" style={{ backgroundColor: colors.error }}></div>
                        </div>
                      </div>
                      <p 
                        className="text-lg font-semibold mb-2"
                        style={{ color: config.mode === 'dark' ? colors.textPrimary : colors.error }}
                      >
                        Recording in progress...
                      </p>
                      <p 
                        className="text-2xl font-bold mb-4"
                        style={{ color: colors.error }}
                      >
                        {formatRecordingDuration(voiceRecordingStates[index].recordingDuration)}
                      </p>
                      <button
                        onClick={() => stopVoiceRecording(index)}
                        className="inline-flex items-center gap-2 px-6 py-3 text-white rounded-lg transition-colors font-medium"
                        style={{ backgroundColor: colors.error }}
                      >
                        <MicOff className="w-5 h-5" />
                        Stop Recording
                      </button>
                    </div>
                  )}
                  
                  <div 
                    className="rounded-lg p-4 mt-4"
                    style={{
                      backgroundColor: config.mode === 'dark' ? `${colors.warning}20` : `${colors.warning}10`, 
                      borderColor: colors.warning,
                      border: `1px solid ${colors.warning}`
                    }}
                  >
                    <div className="flex items-start gap-3">
                      <Volume2 className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: colors.warning }} />
                      <div>
                        <p 
                          className="text-sm font-medium mb-1"
                          style={{ color: config.mode === 'dark' ? colors.textPrimary : colors.warning }}
                        >
                          Voice Recording Tips
                        </p>
                        <ul 
                          className="text-xs space-y-1 list-disc ml-4"
                          style={{ color: config.mode === 'dark' ? colors.textSecondary : colors.warning }}
                        >
                          <li>Speak clearly and at a moderate pace</li>
                          <li>Find a quiet environment to minimize background noise</li>
                          <li>Hold your device close to your mouth (but not too close)</li>
                          <li>AI will transcribe your speech - you can review and edit it after</li>
                          <li>Supports multiple languages automatically</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Audio Player */}
                  <div 
                    className="rounded-xl overflow-hidden"
                    style={{ 
                      border: `1px solid ${colors.border}`
                    }}
                  >
                    <div 
                      className="px-4 py-2 flex items-center justify-between"
                      style={{ 
                        backgroundColor: colors.backgroundSecondary,
                        borderBottom: `1px solid ${colors.border}` 
                      }}
                    >
                      <span 
                        className="text-sm font-medium"
                        style={{ color: colors.textSecondary }}
                      >
                        Recorded Audio
                      </span>
                      <div className="flex items-center gap-3">
                        {voiceRecordingStates[index].transcriptionCompleted && !voiceRecordingStates[index].isTranscribing && (
                          <span 
                            className="text-xs px-2 py-1 rounded flex items-center gap-1"
                            style={{ 
                              backgroundColor: config.mode === 'dark' ? `${colors.success}20` : `${colors.success}10`,
                              color: colors.success 
                            }}
                          >
                            <CheckCircle className="w-3 h-3" />
                            Transcribed
                          </span>
                        )}
                        <button
                          type="button"
                          onClick={() => handleRemoveVoiceRecording(index)}
                          className="text-sm flex items-center gap-1"
                          style={{ color: colors.error }}
                        >
                          <XCircle className="w-4 h-4" />
                          Remove
                        </button>
                      </div>
                    </div>
                    <div 
                      className="p-4"
                      style={{ backgroundColor: colors.cardBackground }}
                    >
                      {voiceRecordingStates[index].audioUrl && (
                        <div className="flex flex-col items-center">
                          <audio
                            controls
                            src={voiceRecordingStates[index].audioUrl!}
                            className="w-full max-w-md"
                          />
                          <p 
                            className="text-xs mt-2"
                            style={{ color: colors.textTertiary }}
                          >
                            Duration: {formatRecordingDuration(voiceRecordingStates[index].recordingDuration)}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Transcription Status */}
                  {voiceRecordingStates[index].isTranscribing && (
                    <div 
                      className="rounded-xl p-4"
                      style={{ 
                        backgroundColor: config.mode === 'dark' ? `${colors.accent}20` : `${colors.accent}10`,
                        border: `1px solid ${colors.accent}` 
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <Loader2 className="w-5 h-5 animate-spin" style={{ color: colors.accent }} />
                        <div>
                          <div 
                            className="text-sm font-medium"
                            style={{ color: config.mode === 'dark' ? colors.textPrimary : colors.accent }}
                          >
                            Transcribing audio...
                          </div>
                          <div 
                            className="text-xs"
                            style={{ color: config.mode === 'dark' ? colors.textSecondary : colors.accent }}
                          >
                            AI is converting your speech to text. This may take a few seconds.
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Transcription Success */}
                  {voiceRecordingStates[index].transcriptionCompleted && !voiceRecordingStates[index].isTranscribing && (
                    <div 
                      className="rounded-xl p-4"
                      style={{ 
                        backgroundColor: config.mode === 'dark' ? `${colors.success}20` : `${colors.success}10`,
                        border: `1px solid ${colors.success}` 
                      }}
                    >
                      <div className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: colors.success }} />
                        <div className="flex-1">
                          <div 
                            className="text-sm font-medium mb-1"
                            style={{ color: config.mode === 'dark' ? colors.textPrimary : colors.success }}
                          >
                            Audio transcribed successfully!
                          </div>
                          <div 
                            className="text-xs"
                            style={{ color: config.mode === 'dark' ? colors.textSecondary : colors.success }}
                          >
                            Please review the transcribed text below and make any necessary corrections.
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Transcription Error */}
                  {voiceRecordingStates[index].transcriptionError && !voiceRecordingStates[index].isTranscribing && (
                    <div 
                      className="rounded-xl p-4"
                      style={{ 
                        backgroundColor: config.mode === 'dark' ? `${colors.error}20` : `${colors.error}10`,
                        border: `1px solid ${colors.error}` 
                      }}
                    >
                      <div className="flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: colors.error }} />
                        <div className="flex-1">
                          <div 
                            className="text-sm font-medium mb-1"
                            style={{ color: config.mode === 'dark' ? colors.textPrimary : colors.error }}
                          >
                            Transcription failed
                          </div>
                          <div 
                            className="text-xs mb-2"
                            style={{ color: config.mode === 'dark' ? colors.textSecondary : colors.error }}
                          >
                            {voiceRecordingStates[index].transcriptionError}
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRetryTranscription(index)}
                            className="inline-flex items-center gap-1 text-sm font-medium"
                            style={{ color: config.mode === 'dark' ? colors.textSecondary : colors.error }}
                          >
                            <RefreshCw className="w-3 h-3" />
                            Retry Transcription
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Transcribed Text Field (Editable) */}
                  <div className="space-y-2">
                    <label 
                      className="block text-sm font-medium"
                      style={{ color: colors.textSecondary }}
                    >
                      <Edit3 className="w-4 h-4 inline mr-1" />
                      Transcribed Text (You can edit this)
                    </label>
                    <p 
                      className="text-xs mb-2"
                      style={{ color: colors.textTertiary }}
                    >
                      Review the AI-transcribed text below. Make any corrections needed before submitting your answer.
                    </p>
                    <textarea
                      rows={8}
                      value={openEndedAnswers[index] || ""}
                      onChange={(e) => {
                        const next = [...openEndedAnswers];
                        next[index] = e.target.value;
                        setOpenEndedAnswers(next);
                      }}
                      className="w-full p-3 rounded-lg focus:ring-2 focus:outline-none font-mono text-sm"
                      placeholder={voiceRecordingStates[index].isTranscribing ? "Transcribing audio..." : "Transcribed text will appear here..."}
                      disabled={voiceRecordingStates[index].isTranscribing}
                      style={{
                        backgroundColor: colors.inputBackground,
                        border: `1px solid ${colors.inputBorder}`,
                        color: colors.textPrimary,
                      }}
                    />
                    <p 
                      className="text-xs italic"
                      style={{ color: colors.textTertiary }}
                    >
                      💡 Tip: The AI does its best to transcribe accurately, but please double-check for any errors, especially with technical terms or names.
                    </p>
                  </div>

                  {/* Record Another Audio Option */}
                  <div 
                    className="pt-4"
                    style={{ borderTop: `1px solid ${colors.border}` }}
                  >
                    <p 
                      className="text-sm mb-3"
                      style={{ color: colors.textSecondary }}
                    >
                      Need to record a different answer?
                    </p>
                    <button
                      onClick={() => {
                        handleRemoveVoiceRecording(index);
                      }}
                      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm"
                      style={{ 
                        backgroundColor: config.mode === 'dark' ? colors.backgroundTertiary : colors.backgroundTertiary,
                        color: colors.textSecondary
                      }}
                    >
                      <Mic className="w-3 h-3" />
                      Record New Answer
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {inputMode === "image" && (
            <div className="space-y-4">
              {/* Camera Modal */}
              {showCamera && (
                <div className="fixed inset-0 z-50 bg-opacity-90 flex flex-col items-center justify-center p-4" style={{ backgroundColor: 'rgba(0,0,0,0.9)' }}>
                  <div className="w-full max-w-2xl">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-semibold" style={{ color: '#ffffff' }}>Take a Photo</h3>
                      <button
                        onClick={stopCamera}
                        style={{ color: '#ffffff' }}
                      >
                        <XCircle className="w-6 h-6" />
                      </button>
                    </div>
                    
                    <div className="relative rounded-lg overflow-hidden" style={{ backgroundColor: '#000000' }}>
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
                        className="px-6 py-3 text-white rounded-full flex items-center gap-2"
                        style={{ backgroundColor: colors.error }}
                      >
                        <Camera className="w-5 h-5" />
                        Capture Photo
                      </button>
                      <button
                        onClick={stopCamera}
                        className="px-6 py-3 text-white rounded-full"
                        style={{ backgroundColor: '#4a4a4a' }}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {!imageUploadStates[index].file ? (
                <div>
                  <label 
                    className="block text-sm font-medium mb-2"
                    style={{ color: colors.textSecondary }}
                  >
                    Upload Image Answer
                  </label>
                  <p 
                    className="text-sm mb-4"
                    style={{ color: colors.textSecondary }}
                  >
                    Upload an image of your handwritten answer. Our AI will automatically extract the text for you to review and edit.
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div 
                      className="border-2 border-dashed rounded-xl p-6 text-center transition-colors"
                      style={{ borderColor: config.mode === 'dark' ? colors.borderLight : colors.info }}
                    >
                      <ImageIcon className="w-12 h-12 mx-auto mb-3" style={{ color: colors.textTertiary }} />
                      <p 
                        className="text-sm mb-4"
                        style={{ color: colors.textSecondary }}
                      >
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
                        className="inline-flex items-center gap-2 px-4 py-2 text-white rounded-lg cursor-pointer transition-colors"
                        style={{ backgroundColor: colors.info }}
                      >
                        <ImageIcon className="w-4 h-4" />
                        Choose Image
                      </label>
                    </div>
                    
                    <div 
                      className="border-2 border-dashed rounded-xl p-6 text-center transition-colors"
                      style={{ borderColor: config.mode === 'dark' ? colors.borderLight : colors.accent }}
                    >
                      <Camera className="w-12 h-12 mx-auto mb-3" style={{ color: colors.textTertiary }} />
                      <p 
                        className="text-sm mb-4"
                        style={{ color: colors.textSecondary }}
                      >
                        Use camera (mobile)
                      </p>
                      <button
                        onClick={startCamera}
                        className="inline-flex items-center gap-2 px-4 py-2 text-white rounded-lg transition-colors"
                        style={{ backgroundColor: colors.accent }}
                      >
                        <Camera className="w-4 h-4" />
                        Open Camera
                      </button>
                    </div>
                  </div>
                  
                  <div 
                    className="rounded-lg p-4"
                    style={{
                      backgroundColor: config.mode === 'dark' ? `${colors.warning}20` : `${colors.warning}10`,
                      border: `1px solid ${colors.warning}`
                    }}
                  >
                    <div className="flex items-start gap-3">
                      <Edit3 className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: colors.warning }} />
                      <div>
                        <p 
                          className="text-sm font-medium mb-1"
                          style={{ color: config.mode === 'dark' ? colors.textPrimary : colors.warning }}
                        >
                          AI Text Extraction Tips
                        </p>
                        <ul 
                          className="text-xs space-y-1 list-disc ml-4"
                          style={{ color: config.mode === 'dark' ? colors.textSecondary : colors.warning }}
                        >
                          <li>Ensure your handwriting is clear and legible</li>
                          <li>Use good lighting when taking photos</li>
                          <li>Make sure the entire answer is visible in the frame</li>
                          <li>AI will extract the text - you can review and edit it after</li>
                          <li>Works with both handwritten and printed text</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Image Preview */}
                  <div 
                    className="rounded-xl overflow-hidden"
                    style={{ border: `1px solid ${colors.border}` }}
                  >
                    <div 
                      className="px-4 py-2 flex items-center justify-between"
                      style={{ 
                        backgroundColor: colors.backgroundSecondary,
                        borderBottom: `1px solid ${colors.border}` 
                      }}
                    >
                      <span 
                        className="text-sm font-medium"
                        style={{ color: colors.textSecondary }}
                      >
                        Uploaded Image
                      </span>
                      <div className="flex items-center gap-3">
                        {imageUploadStates[index].imageId && !imageUploadStates[index].isExtractingText && (
                          <span 
                            className="text-xs px-2 py-1 rounded flex items-center gap-1"
                            style={{ 
                              backgroundColor: config.mode === 'dark' ? `${colors.success}20` : `${colors.success}10`,
                              color: colors.success 
                            }}
                          >
                            <CheckCircle className="w-3 h-3" />
                            Uploaded
                          </span>
                        )}
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(index)}
                          className="text-sm flex items-center gap-1"
                          style={{ color: colors.error }}
                        >
                          <XCircle className="w-4 h-4" />
                          Remove
                        </button>
                      </div>
                    </div>
                    <div 
                      className="p-4"
                      style={{ backgroundColor: colors.cardBackground }}
                    >
                      {imageUploadStates[index].previewUrl ? (
                        <div className="flex flex-col items-center">
                          <img
                            src={imageUploadStates[index].previewUrl!}
                            alt="Uploaded answer"
                            className="max-w-full max-h-96 mx-auto rounded-lg shadow-sm object-contain"
                            style={{ 
                              borderColor: colors.borderLight,
                              border: `1px solid ${colors.borderLight}`
                            }}
                            onError={(e) => {
                              console.error('Image preview failed to load');
                              e.currentTarget.src = '';
                              e.currentTarget.alt = 'Preview unavailable';
                            }}
                          />
                          <p 
                            className="text-xs mt-2"
                            style={{ color: colors.textTertiary }}
                          >
                            {imageUploadStates[index].file?.name} • 
                            {(imageUploadStates[index].file?.size || 0) > 1024 * 1024 
                              ? `${(imageUploadStates[index].file!.size / (1024 * 1024)).toFixed(2)} MB`
                              : `${Math.round(imageUploadStates[index].file!.size / 1024)} KB`
                            }
                          </p>
                        </div>
                      ) : (
                        <div 
                          className="flex items-center justify-center h-48 rounded-lg"
                          style={{ backgroundColor: colors.backgroundTertiary }}
                        >
                          <p style={{ color: colors.textTertiary }}>Loading preview...</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Uploading Status */}
                  {imageUploadStates[index].isUploading && (
                    <div 
                      className="rounded-xl p-4"
                      style={{ 
                        backgroundColor: config.mode === 'dark' ? `${colors.info}20` : `${colors.info}10`,
                        border: `1px solid ${colors.info}` 
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <Loader2 className="w-5 h-5 animate-spin" style={{ color: colors.info }} />
                        <div>
                          <div 
                            className="text-sm font-medium"
                            style={{ color: config.mode === 'dark' ? colors.textPrimary : colors.info }}
                          >
                            Uploading image...
                          </div>
                          <div 
                            className="text-xs"
                            style={{ color: config.mode === 'dark' ? colors.textSecondary : colors.info }}
                          >
                            Preparing image for processing
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* OCR Extraction Status */}
                  {imageUploadStates[index].isExtractingText && (
                    <div 
                      className="rounded-xl p-4"
                      style={{ 
                        backgroundColor: config.mode === 'dark' ? `${colors.accent}20` : `${colors.accent}10`,
                        border: `1px solid ${colors.accent}` 
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <Loader2 className="w-5 h-5 animate-spin" style={{ color: colors.accent }} />
                        <div>
                          <div 
                            className="text-sm font-medium"
                            style={{ color: config.mode === 'dark' ? colors.textPrimary : colors.accent }}
                          >
                            Extracting text from image...
                          </div>
                          <div 
                            className="text-xs"
                            style={{ color: config.mode === 'dark' ? colors.textSecondary : colors.accent }}
                          >
                            AI is reading your handwriting. This may take a few seconds.
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* OCR Success */}
                  {imageUploadStates[index].ocrCompleted && !imageUploadStates[index].isExtractingText && (
                    <div 
                      className="rounded-xl p-4"
                      style={{ 
                        backgroundColor: config.mode === 'dark' ? `${colors.success}20` : `${colors.success}10`,
                        border: `1px solid ${colors.success}` 
                      }}
                    >
                      <div className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: colors.success }} />
                        <div className="flex-1">
                          <div 
                            className="text-sm font-medium mb-1"
                            style={{ color: config.mode === 'dark' ? colors.textPrimary : colors.success }}
                          >
                            Text extracted successfully!
                          </div>
                          <div 
                            className="text-xs"
                            style={{ color: config.mode === 'dark' ? colors.textSecondary : colors.success }}
                          >
                            Please review the extracted text below and make any necessary corrections.
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* OCR Error */}
                  {imageUploadStates[index].ocrError && !imageUploadStates[index].isExtractingText && (
                    <div 
                      className="rounded-xl p-4"
                      style={{ 
                        backgroundColor: config.mode === 'dark' ? `${colors.error}20` : `${colors.error}10`,
                        border: `1px solid ${colors.error}` 
                      }}
                    >
                      <div className="flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: colors.error }} />
                        <div className="flex-1">
                          <div 
                            className="text-sm font-medium mb-1"
                            style={{ color: config.mode === 'dark' ? colors.textPrimary : colors.error }}
                          >
                            Text extraction failed
                          </div>
                          <div 
                            className="text-xs mb-2"
                            style={{ color: config.mode === 'dark' ? colors.textSecondary : colors.error }}
                          >
                            {imageUploadStates[index].ocrError}
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRetryOCR(index)}
                            className="inline-flex items-center gap-1 text-sm font-medium"
                            style={{ color: config.mode === 'dark' ? colors.textSecondary : colors.error }}
                          >
                            <RefreshCw className="w-3 h-3" />
                            Retry Extraction
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Upload Error */}
                  {imageUploadStates[index].error && (
                    <div 
                      className="rounded-xl p-4"
                      style={{ 
                        backgroundColor: config.mode === 'dark' ? `${colors.error}20` : `${colors.error}10`,
                        border: `1px solid ${colors.error}` 
                      }}
                    >
                      <div className="flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: colors.error }} />
                        <div>
                          <div 
                            className="text-sm font-medium mb-1"
                            style={{ color: config.mode === 'dark' ? colors.textPrimary : colors.error }}
                          >
                            Upload failed
                          </div>
                          <div 
                            className="text-xs"
                            style={{ color: config.mode === 'dark' ? colors.textSecondary : colors.error }}
                          >
                            {imageUploadStates[index].error}
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              if (imageUploadStates[index].file) {
                                handleImageUpload(index, imageUploadStates[index].file!);
                              }
                            }}
                            className="mt-2 text-sm font-medium"
                            style={{ color: config.mode === 'dark' ? colors.textSecondary : colors.error }}
                          >
                            Try Again
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Extracted Text Field (Editable) */}
                  <div className="space-y-2">
                    <label 
                      className="block text-sm font-medium"
                      style={{ color: colors.textSecondary }}
                    >
                      <Edit3 className="w-4 h-4 inline mr-1" />
                      Extracted Text (You can edit this)
                    </label>
                    <p 
                      className="text-xs mb-2"
                      style={{ color: colors.textTertiary }}
                    >
                      Review the AI-extracted text below. Make any corrections needed before submitting your answer.
                    </p>
                    <textarea
                      rows={8}
                      value={openEndedAnswers[index] || ""}
                      onChange={(e) => {
                        const next = [...openEndedAnswers];
                        next[index] = e.target.value;
                        setOpenEndedAnswers(next);
                      }}
                      className="w-full p-3 rounded-lg focus:outline-none font-mono text-sm"
                      placeholder={imageUploadStates[index].isExtractingText ? "Extracting text..." : "Extracted text will appear here..."}
                      disabled={imageUploadStates[index].isExtractingText}
                      style={{ 
                        backgroundColor: colors.inputBackground,
                        border: `1px solid ${colors.inputBorder}`,
                        color: colors.textPrimary,
                      }}
                    />
                    <p 
                      className="text-xs italic"
                      style={{ color: colors.textTertiary }}
                    >
                      💡 Tip: The AI does its best to extract text accurately, but please double-check for any errors, especially with mathematical formulas or special characters.
                    </p>
                  </div>

                  {/* Upload Another Image Option */}
                  <div 
                    className="pt-4"
                    style={{ borderTop: `1px solid ${colors.border}` }}
                  >
                    <p 
                      className="text-sm mb-3"
                      style={{ color: colors.textSecondary }}
                    >
                      Need to upload a different image?
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
                        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg cursor-pointer transition-colors text-sm"
                        style={{ 
                          backgroundColor: config.mode === 'dark' ? colors.backgroundTertiary : colors.backgroundTertiary,
                          color: colors.textSecondary
                        }}
                      >
                        <ImageIcon className="w-3 h-3" />
                        Replace Image
                      </label>
                      <button
                        onClick={startCamera}
                        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors text-sm"
                        style={{ 
                          backgroundColor: config.mode === 'dark' ? colors.backgroundTertiary : colors.backgroundTertiary,
                          color: colors.textSecondary
                        }}
                      >
                        <Camera className="w-3 h-3" />
                        Take New Photo
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
            <h3 className="text-lg font-semibold" style={{ color: colors.textPrimary }}>
              Question {index + 1}: {question.text}
            </h3>
            <div 
              className="text-sm font-medium"
              style={{ color: colors.textSecondary }}
            >
              {question.marks} marks
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {boolOptions.map((label, choiceIndex) => {
              const active = selected === choiceIndex;
              return (
                <button
                  key={label}
                  type="button"
                  onClick={() => handleSingleAnswerSelect(index, choiceIndex)}
                  className="p-4 rounded-xl text-left transition-colors"
                  style={{
                    backgroundColor: active 
                      ? config.mode === 'dark' 
                        ? `${colors.primary}20` 
                        : colors.primaryLight
                      : colors.cardBackground,
                    borderColor: active 
                      ? colors.primary 
                      : colors.border,
                    border: `1px solid ${active ? colors.primary : colors.border}`,
                    color: colors.textPrimary
                  }}
                >
                  <div className="font-medium">{label}</div>
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
            <h3 className="text-lg font-semibold" style={{ color: colors.textPrimary }}>
              Question {index + 1}: {question.text}
            </h3>
            <div 
              className="text-sm font-medium"
              style={{ color: colors.textSecondary }}
            >
              {question.marks} marks
            </div>
          </div>
          <div className="space-y-2">
            {choices.map((choice: string, choiceIndex: number) => {
              const checked = isMultiple
                ? multipleAnswers[index]?.includes(choiceIndex) || false
                : selectedAnswers[index] === choiceIndex;
              return (
                <label
                  key={choiceIndex}
                  className="flex items-center p-4 rounded-xl cursor-pointer transition-colors"
                  style={{
                    backgroundColor: checked 
                      ? config.mode === 'dark' 
                        ? `${colors.primary}20` 
                        : colors.primaryLight
                      : colors.cardBackground,
                    borderColor: checked 
                      ? colors.primary 
                      : colors.border,
                    border: `1px solid ${checked ? colors.primary : colors.border}`,
                  }}
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
                    style={{ accentColor: colors.primary }}
                  />
                  <span style={{ color: colors.textPrimary }}>{choice}</span>
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
            <h3 className="text-lg font-semibold" style={{ color: colors.textPrimary }}>
              Question {index + 1}: {question.text}
            </h3>
            <div 
              className="text-sm font-medium"
              style={{ color: colors.textSecondary }}
            >
              {question.marks} marks
            </div>
          </div>
          <div className="space-y-2">
            {currentOrder.map((item, itemIndex) => (
              <div
                key={`${item}-${itemIndex}`}
                className="flex items-center justify-between gap-3 p-3 rounded-xl"
                style={{ 
                  backgroundColor: colors.cardBackground,
                  borderColor: colors.border,
                  border: `1px solid ${colors.border}`
                }}
              >
                <div className="flex items-center gap-3">
                  <div 
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-sm font-semibold"
                    style={{
                      backgroundColor: colors.backgroundTertiary,
                      color: colors.textSecondary
                    }}
                  >
                    {itemIndex + 1}
                  </div>
                  <div style={{ color: colors.textPrimary }}>{item}</div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => move(itemIndex, Math.max(0, itemIndex - 1))}
                    disabled={itemIndex === 0}
                    className="px-3 py-1.5 text-sm rounded-lg disabled:opacity-50"
                    style={{ 
                      backgroundColor: colors.backgroundTertiary,
                      color: colors.textSecondary,
                      borderColor: colors.border,
                      border: `1px solid ${colors.border}`
                    }}
                  >
                    Up
                  </button>
                  <button
                    type="button"
                    onClick={() => move(itemIndex, Math.min(currentOrder.length - 1, itemIndex + 1))}
                    disabled={itemIndex === currentOrder.length - 1}
                    className="px-3 py-1.5 text-sm rounded-lg disabled:opacity-50"
                    style={{ 
                      backgroundColor: colors.backgroundTertiary,
                      color: colors.textSecondary,
                      borderColor: colors.border,
                      border: `1px solid ${colors.border}`
                    }}
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
            <h3 className="text-lg font-semibold" style={{ color: colors.textPrimary }}>
              Question {index + 1}: {question.text}
            </h3>
            <div 
              className="text-sm font-medium"
              style={{ color: colors.textSecondary }}
            >
              {question.marks} marks
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div 
                className="text-sm font-semibold"
                style={{ color: colors.textSecondary }}
              >
                Items
              </div>
              {leftItems.map((item) => (
                <div 
                  key={item} 
                  className="p-3 rounded-xl"
                  style={{ 
                    backgroundColor: colors.cardBackground,
                    borderColor: colors.border,
                    border: `1px solid ${colors.border}`
                  }}
                >
                  <div 
                    className="font-medium mb-2"
                    style={{ color: colors.textPrimary }}
                  >
                    {item}
                  </div>
                  <select
                    value={mapping[item] || ""}
                    onChange={(e) => update(item, e.target.value)}
                    className="w-full p-2 rounded-lg focus:outline-none focus:ring-2"
                    style={{ 
                      backgroundColor: colors.inputBackground,
                      borderColor: colors.inputBorder,
                      border: `1px solid ${colors.inputBorder}`,
                      color: colors.textPrimary
                    }}
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
              <div 
                className="text-sm font-semibold"
                style={{ color: colors.textSecondary }}
              >
                Matches
              </div>
              <div 
                className="p-3 rounded-xl"
                style={{ 
                  backgroundColor: colors.backgroundTertiary,
                  borderColor: colors.border,
                  border: `1px solid ${colors.border}`
                }}
              >
                {leftItems.length === 0 ? (
                  <div 
                    className="text-sm"
                    style={{ color: colors.textSecondary }}
                  >
                    No matching data provided.
                  </div>
                ) : (
                  <div className="space-y-2">
                    {leftItems.map((item) => (
                      <div key={item} className="flex items-center justify-between text-sm">
                        <div style={{ color: colors.textSecondary }}>{item}</div>
                        <div 
                          className="font-medium"
                          style={{ color: colors.textSecondary }}
                        >
                          {mapping[item] || "—"}
                        </div>
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
            <h3 className="text-lg font-semibold" style={{ color: colors.textPrimary }}>
              Question {index + 1}: {question.text}
            </h3>
            <div 
              className="text-sm font-medium"
              style={{ color: colors.textSecondary }}
            >
              {question.marks} marks
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div 
              className="p-4 rounded-xl"
              style={{ 
                backgroundColor: colors.cardBackground,
                borderColor: colors.border,
                border: `1px solid ${colors.border}`
              }}
            >
              <div 
                className="text-sm font-semibold mb-3"
                style={{ color: colors.textSecondary }}
              >
                Drag items
              </div>
              <div className="flex flex-wrap gap-2">
                {availableItems.map((item) => (
                  <div
                    key={item}
                    draggable
                    onDragStart={(e) => e.dataTransfer.setData("text/plain", item)}
                    className="px-3 py-2 rounded-lg cursor-grab active:cursor-grabbing"
                    style={{ 
                      backgroundColor: colors.backgroundTertiary,
                      borderColor: colors.border,
                      border: `1px solid ${colors.border}`
                    }}
                  >
                    <span 
                      className="text-sm"
                      style={{ color: colors.textPrimary }}
                    >
                      {item}
                    </span>
                  </div>
                ))}
                {availableItems.length === 0 && (
                  <div 
                    className="text-sm"
                    style={{ color: colors.textSecondary }}
                  >
                    All items placed.
                  </div>
                )}
              </div>
            </div>

            <div 
              className="p-4 rounded-xl"
              style={{ 
                backgroundColor: colors.cardBackground,
                borderColor: colors.border,
                border: `1px solid ${colors.border}`
              }}
            >
              <div 
                className="text-sm font-semibold mb-3"
                style={{ color: colors.textSecondary }}
              >
                Drop targets
              </div>
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
                      className="p-3 rounded-xl transition-colors"
                      style={{
                        backgroundColor: placed 
                          ? config.mode === 'dark' 
                            ? `${colors.primary}20` 
                            : colors.primaryLight
                          : colors.backgroundTertiary,
                        borderColor: placed 
                          ? colors.primary 
                          : colors.border,
                        borderStyle: placed ? 'solid' : 'dashed',
                        border: `1px ${placed ? 'solid' : 'dashed'} ${placed ? colors.primary : colors.border}`,
                      }}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <div 
                            className="text-sm font-medium"
                            style={{ color: colors.textPrimary }}
                          >
                            {target}
                          </div>
                          <div 
                            className="text-sm"
                            style={{ color: colors.textSecondary }}
                          >
                            {placed || "Drop an item here"}
                          </div>
                        </div>
                        {placed && (
                          <button
                            type="button"
                            onClick={() => clearTarget(target)}
                            className="px-3 py-1.5 text-sm rounded-lg"
                            style={{
                              backgroundColor: colors.backgroundTertiary,
                              borderColor: colors.border,
                              border: `1px solid ${colors.border}`,
                              color: colors.textSecondary
                            }}
                          >
                            Remove
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
                {targets.length === 0 && (
                  <div 
                    className="text-sm"
                    style={{ color: colors.textSecondary }}
                  >
                    No drag-drop data provided.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-3">
        <h3 className="text-lg font-semibold" style={{ color: colors.textPrimary }}>
          Question {index + 1}: {question.text}
        </h3>
        <div 
          className="text-sm"
          style={{ color: colors.textSecondary }}
        >
          Unsupported question type.
        </div>
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
        
        // Send the image for marking
        if (imageFile) {
          formData.append("answer_type", "image");
          formData.append("image", imageFile);
        }
      } else if (inputMode === "voice") {
        const transcribedText = openEndedAnswers[questionIndex] || "";
        
        // Submit voice response same as text response
        formData.append("answer_type", "text");
        formData.append("text_answer", transcribedText);
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
      <div 
        className="min-h-screen flex items-center justify-center p-6"
        style={{ backgroundColor: colors.background }}
      >
        <div 
          className="flex items-center gap-3"
          style={{ color: colors.textSecondary }}
        >
          <Loader2 className="h-5 w-5 animate-spin" />
          Loading assessment...
        </div>
      </div>
    );
  }

  if (!assessment || questions.length === 0) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center p-6"
        style={{ backgroundColor: colors.background }}
      >
        <div 
          className="max-w-md w-full rounded-2xl p-6"
          style={{ 
            backgroundColor: colors.cardBackground,
            borderColor: colors.border,
            border: `1px solid ${colors.border}`
          }}
        >
          <div 
            className="flex items-center gap-2 font-semibold"
            style={{ color: colors.error }}
          >
            <AlertCircle className="h-5 w-5" />
            Unable to load assessment.
          </div>
          <button
            type="button"
            onClick={() => router.replace("/student/unitworkspace")}
            className="mt-4 w-full px-4 py-2 text-white rounded-lg"
            style={{ backgroundColor: config.mode === 'dark' ? colors.sidebarActive : colors.primary }}
          >
            Back to Workspace
          </button>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen"
      style={{ backgroundColor: colors.background }}
    >
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 
              className="text-xl font-bold"
              style={{ color: colors.textPrimary }}
            >
              {assessment.title || "Assessment"}
            </h1>
            <p 
              className="text-sm"
              style={{ color: colors.textSecondary }}
            >
              {assessment.topic || ""}
            </p>
          </div>
          <div 
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-white font-medium"
            style={{
              backgroundColor: timeRemaining < 300 ? colors.error : colors.primary
            }}
          >
            <Clock className="h-4 w-4" />
            {formatTime(timeRemaining)}
          </div>
        </div>

        <div 
          className="rounded-2xl p-6"
          style={{ 
            backgroundColor: colors.cardBackground,
            borderColor: colors.border,
            border: `1px solid ${colors.border}`,
            boxShadow: config.mode === 'dark' ? 'none' : '0 1px 3px rgba(0,0,0,0.1)'
          }}
        >
          {renderQuestion(questions[currentQuestion], currentQuestion)}

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-6">
            <div 
              className="text-sm"
              style={{ color: colors.textSecondary }}
            >
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
                className="px-4 py-2 text-white rounded-lg transition-colors disabled:opacity-50 inline-flex items-center justify-center"
                style={{ backgroundColor: colors.primary }}
              >
                {isNextLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                {isQuestionAnsweredByStatus(questions[currentQuestion]) ? "Answered & Next" : "Next"}
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
                className="px-4 py-2 text-white rounded-lg transition-colors disabled:opacity-50 inline-flex items-center justify-center"
                style={{ backgroundColor: colors.success }}
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