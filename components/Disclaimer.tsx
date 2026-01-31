"use client";

import { motion } from "framer-motion";
import { AlertTriangle } from "lucide-react";
import { useThemeColors } from '@/context/ThemeContext';

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
  const colors = useThemeColors();

  return (
    <div 
      className="fixed inset-0 flex items-center justify-center z-50 p-4"
      style={{ backgroundColor: colors.textPrimary + '80' }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="rounded-xl shadow-lg max-w-lg w-full p-6"
        style={{ backgroundColor: colors.cardBackground }}
      >
        <div className="text-center">
          <AlertTriangle
            size={48}
            className="mx-auto mb-4"
            style={{ color: colors.warning }}
          />
          <h3 
            className="text-lg font-semibold mb-2"
            style={{ color: colors.textPrimary }}
          >
            Disclaimer for {title}
          </h3>
          <p 
            className="mb-4"
            style={{ color: colors.textSecondary }}
          >
            Please read the following rules carefully before starting:
          </p>
          <ul 
            className="text-left list-disc list-inside mb-6 space-y-2"
            style={{ color: colors.textSecondary }}
          >
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
              className="px-6 py-2 rounded-lg transition-colors"
              style={{
                backgroundColor: colors.backgroundSecondary,
                color: colors.textSecondary
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = colors.backgroundTertiary;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = colors.backgroundSecondary;
              }}
            >
              Cancel
            </button>
            <button
              onClick={onAgree}
              className="px-6 py-2 text-white rounded-lg transition-colors"
              style={{
                backgroundColor: colors.primary,
                color: colors.background
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = colors.primaryHover;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = colors.primary;
              }}
            >
              I Agree, Start Assessment
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}