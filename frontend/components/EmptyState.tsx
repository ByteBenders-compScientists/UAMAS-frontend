'use client';

import { motion } from 'framer-motion';
import { BookOpen, Plus } from 'lucide-react';
import { useThemeColors } from '@/context/ThemeContext';

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  actionText?: string;
  onAction?: () => void;
}

const EmptyState = ({ 
  title, 
  description, 
  icon = <BookOpen size={32} />, 
  actionText,
  onAction 
}: EmptyStateProps) => {
  const colors = useThemeColors();

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col items-center justify-center min-h-[200px] p-6 text-center"
    >
      <div 
        className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
        style={{
          backgroundColor: colors.primary + '10',
          color: colors.primary
        }}
      >
        {icon}
      </div>
      
      <h3 
        className="text-lg font-semibold mb-2"
        style={{ color: colors.textPrimary }}
      >
        {title}
      </h3>
      <p 
        className="mb-6 max-w-md"
        style={{ color: colors.textSecondary }}
      >
        {description}
      </p>
      
      {actionText && onAction && (
        <button
          onClick={onAction}
          className="inline-flex items-center px-4 py-2 rounded-lg transition-colors"
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
          <Plus size={16} className="mr-2" />
          {actionText}
        </button>
      )}
    </motion.div>
  );
};

export default EmptyState;