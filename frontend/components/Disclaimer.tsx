"use client";

import { motion } from "framer-motion";
import { AlertTriangle } from "lucide-react";

interface DisclaimerProps {
  onAgree: () => void;
  onCancel: () => void;
  title: string;
  duration?: number;
  numberOfQuestions: number;
}

export default function Disclaimer({
  onAgree,
  onCancel,
  title,
  duration,
  numberOfQuestions,
}: DisclaimerProps) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-xl shadow-lg max-w-lg w-full p-6"
      >
        <div className="text-center">
          <AlertTriangle
            size={48}
            className="mx-auto text-yellow-500 mb-4"
          />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Disclaimer for {title}
          </h3>
          <p className="text-gray-600 mb-4">
            Please read the following rules carefully before starting:
          </p>
          <ul className="text-left text-gray-600 list-disc list-inside mb-6 space-y-2">
            <li>This assessment consists of {numberOfQuestions} questions.</li>
            {duration && (
              <li>
                You will have {duration} minutes to complete this assessment.
              </li>
            )}
            <li>
              The timer will start as soon as you click &ldquo;I Agree&rdquo; and will not be
              paused.
            </li>
            <li>Ensure you have a stable internet connection.</li>
            <li>
              Do not navigate away from this page, or your progress may be lost.
            </li>
            <li>Any form of malpractice will result in disciplinary action.</li>
            <li>
              Once you proceed to the next question, your answer is submitted
              and you cannot go back.
            </li>
          </ul>
          <div className="flex justify-center space-x-4">
            <button
              onClick={onCancel}
              className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={onAgree}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              I Agree, Start Assessment
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
} 