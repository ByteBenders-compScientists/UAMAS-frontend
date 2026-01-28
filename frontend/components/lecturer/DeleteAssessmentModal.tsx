import React from 'react';
import { Trash2 } from 'lucide-react';
import { Assessment } from '../../types/assessment';
import { useThemeColors } from '@/context/ThemeContext';

interface DeleteAssessmentModalProps {
  assessment: Assessment;
  onConfirm: () => void;
  onCancel: () => void;
}

const DeleteAssessmentModal: React.FC<DeleteAssessmentModalProps> = ({ 
  assessment, 
  onConfirm, 
  onCancel 
}) => {
  const colors = useThemeColors();

  return (
    <div className="p-6">
      <div className="flex items-center justify-center mb-6">
        <div 
          className="w-16 h-16 rounded-full flex items-center justify-center"
          style={{ backgroundColor: `${colors.error}20` }}
        >
          <Trash2 className="w-8 h-8" style={{ color: colors.error }} />
        </div>
      </div>
      
      <h3 className="text-xl font-bold text-center mb-2" style={{ color: colors.textPrimary }}>
        Delete Assessment
      </h3>
      
      <p className="text-center mb-6" style={{ color: colors.textSecondary }}>
        Are you sure you want to delete <span className="font-semibold" style={{ color: colors.textPrimary }}>&quot;{assessment.title}&quot;</span>? 
        This action cannot be undone.
      </p>
      
      <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
        <button
          onClick={onCancel}
          className="px-6 py-3 border rounded-xl hover:opacity-90 transition-colors font-medium"
          style={{
            backgroundColor: colors.cardBackground,
            borderColor: colors.border,
            color: colors.textPrimary,
          }}
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          className="px-6 py-3 text-white rounded-xl hover:opacity-90 transition-colors font-medium"
          style={{ backgroundColor: colors.error }}
        >
          Delete Assessment
        </button>
      </div>
    </div>
  );
};

export default DeleteAssessmentModal;