import React from 'react';
import { motion } from 'framer-motion';
import {
  Calendar, 
  ClipboardList, 
  Award, 
  Eye, 
  Edit, 
  CheckCircle, 
  Trash, 
  Clock,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { Assessment, Course, QuestionType } from '../../../types/assessment';

import { formatDate, formatDateTime, getDifficultyColor, getTypeColor, getBlooms } from '../../../utils/assessmentUtils';

interface AssessmentCardProps {
  assessment: Assessment;
  courses: Course[];
  onEdit: (assessment: Assessment) => void;
  onDelete: (assessment: Assessment) => void;
  onView: (assessment: Assessment) => void;
  onVerify: (id: string) => void;
  index: number;
}

const AssessmentCard: React.FC<AssessmentCardProps> = ({
  assessment,
  courses,
  onEdit,
  onDelete,
  onView,
  onVerify,
  index
}) => {
  const course = courses.find(c => c.id === assessment.course_id);
  const unit = course?.units.find(u => u.id === assessment.unit_id);
  const bloomsInfo = getBlooms(assessment.blooms_level);
  const BloomsIcon = bloomsInfo.icon;

  const questionTypeOptions = [
    { value: 'open-ended' as const, label: 'Open Ended' },
    { value: 'close-ended-multiple-single' as const, label: 'MCQ (Single)' },
    { value: 'close-ended-multiple-multiple' as const, label: 'MCQ (Multiple)' },
    { value: 'close-ended-bool' as const, label: 'True/False' },
    { value: 'close-ended-matching' as const, label: 'Matching' },
    { value: 'close-ended-ordering' as const, label: 'Ordering' },
    { value: 'close-ended-drag-drop' as const, label: 'Drag & Drop' },
  ] as const;

  const getQuestionTypeLabel = (type: QuestionType) => {
    return questionTypeOptions.find(opt => opt.value === type)?.label || type;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="bg-white rounded-2xl shadow border border-gray-100 hover:shadow-lg transition-all duration-300 overflow-hidden group"
    >
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-emerald-700 transition-colors">
              {assessment.title}
            </h3>
            <div className="flex flex-wrap items-center gap-2 mb-3">
              {course && (
                <div className="flex items-center">
                  <span className={`w-2.5 h-2.5 rounded-full mr-1.5 ${course.color}`}></span>
                  <span className="text-xs font-medium text-gray-600">{course.name}</span>
                </div>
              )}
              <span className="text-gray-300 text-xs">•</span>
                <span className="text-xs font-medium text-gray-600">{unit?.unit_name}</span>
              <span className="text-gray-300 text-xs">•</span>
              <span className="text-xs font-medium text-gray-600 flex items-center">
                <Calendar className="w-3 h-3 mr-1" />
                Week {assessment.week}
              </span>
            </div>
          </div>
          <div className="flex items-center">
            {assessment.verified ? (
              <div className="flex items-center text-green-600 bg-green-50 px-2 py-1 rounded-full">
                <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                <span className="text-xs font-bold">Verified</span>
              </div>
            ) : (
              <div className="flex items-center text-yellow-600 bg-yellow-50 px-2 py-1 rounded-full">
                <AlertCircle className="w-3.5 h-3.5 mr-1" />
                <span className="text-xs font-bold">Pending</span>
              </div>
            )}
          </div>
        </div>

        {/* Description */}
        <p className="text-gray-600 mb-4 line-clamp-2 leading-relaxed text-sm">{assessment.description}</p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${getTypeColor(assessment.type)}`}>
            {assessment.type}
          </span>
          <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${getDifficultyColor(assessment.difficulty)}`}>
            {assessment.difficulty}
          </span>
          {(assessment.questions_type || []).slice(0, 2).map(t => (
            <span
              key={t}
              className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200"
            >
              {getQuestionTypeLabel(t)}
            </span>
          ))}
          {(assessment.questions_type || []).length > 2 && (
            <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
              +{(assessment.questions_type || []).length - 2}
            </span>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-4 p-3 bg-gradient-to-r from-gray-50 to-white rounded-xl border border-gray-100">
          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <ClipboardList className="w-4 h-4 text-gray-500" />
            </div>
            <div className="text-base font-bold text-gray-900">{assessment.number_of_questions}</div>
            <div className="text-xs font-medium text-gray-500">Questions</div>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <Award className="w-4 h-4 text-gray-500" />
            </div>
            <div className="text-base font-bold text-gray-900">{assessment.total_marks}</div>
            <div className="text-xs font-medium text-gray-500">Marks</div>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <div className={`p-1 rounded-md ${bloomsInfo.bg}`}>
                <BloomsIcon className={`w-3 h-3 ${bloomsInfo.color}`} />
              </div>
            </div>
            <div className="text-base font-bold text-gray-900">{assessment.blooms_level.slice(0, 3)}</div>
            <div className="text-xs font-medium text-gray-500">Bloom&#39;s</div>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-gray-500 flex items-center">
              <Clock className="w-3.5 h-3.5 mr-1" />
              {formatDate(assessment.created_at)}
            </span>
            <div className="flex space-x-1">
            <button
              onClick={() => onView(assessment)}
              className="flex items-center p-1.5 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
            >
              <Eye className="w-4 h-4" />
            </button>
            <button
              onClick={() => onEdit(assessment)}
              className="flex items-center p-1.5 text-sm font-medium text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors"
            >
              <Edit className="w-4 h-4" />
            </button>
            {!assessment.verified && (
              <button
                onClick={() => onVerify(assessment.id)}
                className="flex items-center p-1.5 text-sm font-medium text-green-600 hover:text-green-700 hover:bg-green-50 rounded-lg transition-colors"
              >
                <CheckCircle className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={() => onDelete(assessment)}
              className="flex items-center p-1.5 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
            >
              <Trash className="w-4 h-4" />
            </button>
          </div>
          </div>
          {(assessment).schedule_date && (
            <div className="flex items-center text-xs font-medium text-emerald-600 mt-2">
              <Calendar className="w-3.5 h-3.5 mr-1" />
              Scheduled: {formatDateTime((assessment).schedule_date)}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default AssessmentCard;