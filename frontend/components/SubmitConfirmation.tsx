import { AlertTriangle, CheckCircle, X } from "lucide-react";

interface SubmitConfirmationProps {
  assessmentTitle: string;
  assessmentType: "Assignment" | "CAT";
  totalQuestions: number;
  answeredQuestions: number;
  onConfirm: () => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export default function SubmitConfirmation({
  assessmentTitle,
  assessmentType,
  totalQuestions,
  answeredQuestions,
  onConfirm,
  onCancel,
  isSubmitting = false,
}: SubmitConfirmationProps) {
  const unansweredCount = totalQuestions - answeredQuestions;
  const allAnswered = unansweredCount === 0;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                allAnswered ? "bg-blue-100" : "bg-amber-100"
              }`}>
                {allAnswered ? (
                  <CheckCircle className="w-6 h-6 text-blue-600" />
                ) : (
                  <AlertTriangle className="w-6 h-6 text-amber-600" />
                )}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Submit {assessmentType}?
                </h2>
                <p className="text-sm text-gray-600 mt-1">{assessmentTitle}</p>
              </div>
            </div>
            <button
              onClick={onCancel}
              disabled={isSubmitting}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
              aria-label="Close"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Progress Summary */}
          <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">
                Progress Summary
              </span>
              <span className={`text-sm font-semibold ${
                allAnswered ? "text-green-600" : "text-amber-600"
              }`}>
                {answeredQuestions} / {totalQuestions} answered
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className={`h-3 rounded-full transition-all duration-300 ${
                  allAnswered ? "bg-green-500" : "bg-amber-500"
                }`}
                style={{ width: `${(answeredQuestions / totalQuestions) * 100}%` }}
              />
            </div>
            {!allAnswered && (
              <p className="text-sm text-amber-700 mt-2 flex items-center gap-1">
                <AlertTriangle className="w-4 h-4" />
                You have {unansweredCount} unanswered question{unansweredCount !== 1 ? "s" : ""}
              </p>
            )}
          </div>

          {/* Important Notice */}
          <div className="space-y-3">
            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-500" />
              Important Notice
            </h3>
            <div className="space-y-2 text-sm text-gray-700">
              <p className="flex items-start gap-2">
                <span className="text-amber-500 font-bold mt-0.5">•</span>
                <span>
                  Once you submit, you <strong>cannot</strong> make any changes to your answers.
                </span>
              </p>
              <p className="flex items-start gap-2">
                <span className="text-amber-500 font-bold mt-0.5">•</span>
                <span>
                  Your {assessmentType.toLowerCase()} will be automatically submitted to your lecturer for grading.
                </span>
              </p>
              <p className="flex items-start gap-2">
                <span className="text-amber-500 font-bold mt-0.5">•</span>
                <span>
                  Please ensure all your answers are correct before proceeding.
                </span>
              </p>
              {!allAnswered && (
                <p className="flex items-start gap-2">
                  <span className="text-red-500 font-bold mt-0.5">•</span>
                  <span className="text-red-700 font-medium">
                    Unanswered questions will be marked as incorrect. Consider going back to complete them.
                  </span>
                </p>
              )}
            </div>
          </div>

         
        </div>

        {/* Footer Actions */}
        <div className="p-6 bg-gray-50 border-t border-gray-200 flex flex-col-reverse sm:flex-row gap-3 sm:justify-end">
          <button
            onClick={onCancel}
            disabled={isSubmitting}
            className="px-6 py-3 bg-white border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Go Back & Review
          </button>
          <button
            onClick={onConfirm}
            disabled={isSubmitting}
            className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                <CheckCircle className="w-5 h-5" />
                Yes, Submit {assessmentType}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}