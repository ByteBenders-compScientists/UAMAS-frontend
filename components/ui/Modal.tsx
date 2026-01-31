import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useThemeColors } from '@/context/ThemeContext';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  maxWidth?: string;
}

const Modal: React.FC<ModalProps> = ({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  maxWidth = "max-w-4xl" 
}) => {
  const colors = useThemeColors();

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 overflow-auto flex items-center justify-center p-4 backdrop-blur-sm"
        style={{ backgroundColor: colors.textPrimary + '30' }}
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ type: "spring", damping: 20 }}
          className={`${maxWidth} w-full rounded-2xl shadow-2xl overflow-hidden`}
          style={{ backgroundColor: colors.cardBackground }}
          onClick={(e) => e.stopPropagation()}
        >
          <div 
            className="px-6 py-4 border-b flex justify-between items-center"
            style={{ 
              borderColor: colors.border,
              background: `linear-gradient(to right, ${colors.primary}10, ${colors.background})`
            }}
          >
            <h3 
              className="text-xl font-bold"
              style={{ color: colors.textPrimary }}
            >
              {title}
            </h3>
            <button 
              onClick={onClose} 
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              style={{ color: colors.textTertiary }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = colors.backgroundSecondary;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="max-h-[calc(90vh-10rem)] overflow-y-auto">
            {children}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default Modal;