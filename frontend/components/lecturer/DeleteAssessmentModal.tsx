import React from 'react';
import { Trash2 } from 'lucide-react';
import { Assessment } from '../../types/assessment';

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
  return (
    <div className="p-6">
      <div className="flex items-center justify-center mb-6">
        <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center">
          <Trash2 className="w-8 h-8 text-red-500" />
        </div>
      </div>
      
      <h3 className="text-xl font-bold text-center text-gray-900 mb-2">
        Delete Assessment
      </h3>
      
      <p className="text-gray-600 text-center mb-6">
        Are you sure you want to delete <span className="font-semibold">&quot;{assessment.title}&quot;</span>? 
        This action cannot be undone.
      </p>
      
      <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
        <button
          onClick={onCancel}
          className="px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          className="px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors font-medium"
        >
          Delete Assessment
        </button>
      </div>
    </div>
  );
};

export default DeleteAssessmentModal;