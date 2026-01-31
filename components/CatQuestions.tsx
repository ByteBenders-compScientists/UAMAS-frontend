import React from "react";
import { Flag, ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";

interface CatQuestionsProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  questions: any[];
  currentQuestion: number;
  selectedAnswers: number[];
  flaggedQuestions: number[];
  handleAnswerSelect: (questionIndex: number, optionIndex: number) => void;
  toggleFlagQuestion: (index: number) => void;
  setCurrentQuestion: React.Dispatch<React.SetStateAction<number>>;
  openEndedAnswers: string[];
  setOpenEndedAnswers: React.Dispatch<React.SetStateAction<string[]>>;
  openEndedImages: (File | null)[];
  setOpenEndedImages: React.Dispatch<React.SetStateAction<(File | null)[]>>;
  questionsType: string;
}

const CatQuestions: React.FC<CatQuestionsProps> = ({
  questions,
  currentQuestion,
  selectedAnswers,
  flaggedQuestions,
  handleAnswerSelect,
  toggleFlagQuestion,
  setCurrentQuestion,
  openEndedAnswers,
  setOpenEndedAnswers,
  openEndedImages,
  setOpenEndedImages,
  questionsType,
}) => {
  return (
    <div className="flex flex-col md:flex-row">
      {/* Question Area */}
      <div className="flex-1 p-4 md:p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-medium text-gray-900">
            Question {currentQuestion + 1} of {questions.length}
          </h3>

          <button
            onClick={() => toggleFlagQuestion(currentQuestion)}
            className={`flex items-center px-3 py-1 rounded-full text-sm ${
              flaggedQuestions.includes(currentQuestion)
                ? "bg-amber-100 text-amber-700"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            <Flag size={14} className="mr-1" />
            {flaggedQuestions.includes(currentQuestion)
              ? "Flagged"
              : "Flag for Review"}
          </button>
        </div>

        <div className="mb-8">
          <p className="text-gray-900 text-lg mb-6">
            {questions[currentQuestion]?.question}
          </p>

          <div className="space-y-3">
            {questionsType === "close-ended" && (
              questions[currentQuestion]?.options.map(
                (option: string, index: number) => (
                  <div
                    key={index}
                    onClick={() => handleAnswerSelect(currentQuestion, index)}
                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                      selectedAnswers[currentQuestion] === index
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    <div className="flex items-center">
                      <div
                        className={`w-5 h-5 rounded-full border flex items-center justify-center mr-3 ${
                          selectedAnswers[currentQuestion] === index
                            ? "border-blue-500 bg-blue-500"
                            : "border-gray-300"
                        }`}
                      >
                        {selectedAnswers[currentQuestion] === index && (
                          <div className="w-2 h-2 rounded-full bg-white"></div>
                        )}
                      </div>
                      <span className="text-gray-800">{option}</span>
                    </div>
                  </div>
                )
              )
            )}

            {questionsType === "open-ended" && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Your Answer (Text)
                  </label>
                  <textarea
                    className="w-full border rounded-lg p-2"
                    rows={5}
                    value={openEndedAnswers[currentQuestion] || ""}
                    onChange={e => {
                      const newAnswers = [...openEndedAnswers];
                      newAnswers[currentQuestion] = e.target.value;
                      setOpenEndedAnswers(newAnswers);
                    }}
                    placeholder="Type your answer here..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Upload Image (optional)
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={e => {
                      const file = e.target.files?.[0] || null;
                      const newImages = [...openEndedImages];
                      newImages[currentQuestion] = file;
                      setOpenEndedImages(newImages);
                    }}
                  />
                  {openEndedImages[currentQuestion] && (
                    <div className="mt-2">                      
                      <Image
                        src={URL.createObjectURL(openEndedImages[currentQuestion]!)}
                        alt="Preview"
                        className="max-h-40 rounded"
                        width={160}
                        height={160}
                        objectFit="contain"
                      />
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between">
          <button
            onClick={() => setCurrentQuestion((prev) => Math.max(0, prev - 1))}
            disabled={currentQuestion === 0}
            className={`flex items-center px-4 py-2 rounded-lg ${
              currentQuestion === 0
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            <ChevronLeft size={16} className="mr-1" />
            Previous
          </button>

          <button
            onClick={() =>
              setCurrentQuestion((prev) =>
                Math.min(questions.length - 1, prev + 1)
              )
            }
            disabled={currentQuestion === questions.length - 1}
            className={`flex items-center px-4 py-2 rounded-lg ${
              currentQuestion === questions.length - 1
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
          >
            Next
            <ChevronRight size={16} className="ml-1" />
          </button>
        </div>
      </div>

      {/* Question Navigator */}
      <div className="w-full md:w-64 p-4 md:p-6 bg-gray-50 border-t md:border-t-0 md:border-l border-gray-200">
        <h3 className="text-sm font-medium text-gray-700 mb-4">
          Question Navigator
        </h3>

        <div className="grid grid-cols-5 gap-2">
          {questions.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentQuestion(index)}
              className={`w-10 h-10 rounded-md flex items-center justify-center text-sm font-medium ${
                currentQuestion === index
                  ? "bg-blue-600 text-white"
                  : selectedAnswers[index] !== -1
                  ? "bg-green-100 text-green-700"
                  : flaggedQuestions.includes(index)
                  ? "bg-amber-100 text-amber-700"
                  : "bg-white text-gray-700 border border-gray-200"
              }`}
            >
              {index + 1}
            </button>
          ))}
        </div>

        <div className="mt-6 space-y-2">
          <div className="flex items-center text-sm">
            <div className="w-4 h-4 bg-green-100 rounded mr-2"></div>
            <span>Answered</span>
          </div>
          <div className="flex items-center text-sm">
            <div className="w-4 h-4 bg-amber-100 rounded mr-2"></div>
            <span>Flagged</span>
          </div>
          <div className="flex items-center text-sm">
            <div className="w-4 h-4 bg-white border border-gray-200 rounded mr-2"></div>
            <span>Unanswered</span>
          </div>
        </div>

        <div className="mt-6">
          <div className="text-sm font-medium text-gray-700 mb-2">
            Progress
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="h-2.5 rounded-full bg-blue-600"
              style={{
                width: `${
                  (selectedAnswers.filter((a) => a !== -1).length /
                    questions.length) *
                  100
                }%`,
              }}
            ></div>
          </div>
          <div className="text-xs text-gray-500 mt-1">
            {selectedAnswers.filter((a) => a !== -1).length} of{" "}
            {questions.length} answered
          </div>
        </div>
      </div>
    </div>
  );
};

export default CatQuestions;
