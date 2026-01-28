import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useThemeColors } from '@/context/ThemeContext';

interface AILoadingModalProps {
  isOpen: boolean;
  title?: string;
  message?: string;
}

const AILoadingModal: React.FC<AILoadingModalProps> = ({ 
  isOpen, 
  title = "Generating Assessment", 
  message = "Please wait while we create your assessment..." 
}) => {
  const colors = useThemeColors();

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        style={{ backgroundColor: colors.background + '99' }}
      >
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ duration: 0.2 }}
          className="rounded-xl shadow-xl p-12 max-w-md w-full"
          style={{ backgroundColor: colors.cardBackground }}
        >
          <div className="flex flex-col items-center text-center">
            {/* Clean circular spinner */}
            <div className="mb-8">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ 
                  duration: 1, 
                  repeat: Infinity, 
                  ease: "linear" 
                }}
                className="w-14 h-14 border-4 rounded-full"
                style={{
                  borderColor: colors.borderLight,
                  borderTopColor: colors.primary
                }}
              />
            </div>

            <h2 
              className="text-xl font-semibold mb-3"
              style={{ color: colors.textPrimary }}
            >
              {title}
            </h2>
            
            <p 
              className="text-base leading-relaxed"
              style={{ color: colors.textSecondary }}
            >
              {message}
            </p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default AILoadingModal;