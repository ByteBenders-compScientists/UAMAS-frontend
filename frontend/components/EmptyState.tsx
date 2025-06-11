'use client';

import { motion } from 'framer-motion';
import { BookOpen, Calendar, Plus, ArrowRight } from 'lucide-react';

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
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col items-center justify-center min-h-[200px] p-6 text-center"
    >
      <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-500 mb-4">
        {icon}
      </div>
      
      <h3 className="text-lg font-semibold text-gray-800 mb-2">{title}</h3>
      <p className="text-gray-600 mb-6 max-w-md">{description}</p>
      
      {actionText && onAction && (
        <button
          onClick={onAction}
          className="inline-flex items-center px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
        >
          <Plus size={16} className="mr-2" />
          {actionText}
        </button>
      )}
    </motion.div>
  );
};

export default EmptyState;