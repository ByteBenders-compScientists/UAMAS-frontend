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
import { formatDate, getDifficultyColor, getTypeColor, getBlooms, formatDateForInput } from '../../../utils/assessmentUtils';
import { useThemeColors } from '@/context/ThemeContext';

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
  const colors = useThemeColors();
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
      className="rounded-2xl shadow border hover:shadow-lg transition-all duration-300 overflow-hidden group"
      style={{
        backgroundColor: colors.cardBackground,
        borderColor: colors.border,
      }}
    >
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 
              className="text-xl font-bold mb-2 group-hover:text-primary transition-colors"
              style={{ color: colors.textPrimary }}
            >
              {assessment.title}
            </h3>
            <div className="flex flex-wrap items-center gap-2 mb-3">
              {course && (
                <div className="flex items-center">
                  <span 
                    className={`w-2.5 h-2.5 rounded-full mr-1.5`}
                    style={{ backgroundColor: course.color || colors.primary }}
                  ></span>
                  <span 
                    className="text-xs font-medium"
                    style={{ color: colors.textSecondary }}
                  >
                    {course.name}
                  </span>
                </div>
              )}
              <span 
                className="text-xs"
                style={{ color: colors.border }}
              >•</span>
              <span 
                className="text-xs font-medium"
                style={{ color: colors.textSecondary }}
              >
                {unit?.unit_name}
              </span>
              <span 
                className="text-xs"
                style={{ color: colors.border }}
              >•</span>
              <span 
                className="text-xs font-medium flex items-center"
                style={{ color: colors.textSecondary }}
              >
                <Calendar className="w-3 h-3 mr-1" />
                Week {assessment.week}
              </span>
            </div>
          </div>
          <div className="flex items-center">
            {assessment.verified ? (
              <div 
                className="flex items-center px-2 py-1 rounded-full"
                style={{
                  backgroundColor: colors.success + '10',
                  color: colors.success
                }}
              >
                <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                <span className="text-xs font-bold">Verified</span>
              </div>
            ) : (
              <div 
                className="flex items-center px-2 py-1 rounded-full"
                style={{
                  backgroundColor: colors.warning + '10',
                  color: colors.warning
                }}
              >
                <AlertCircle className="w-3.5 h-3.5 mr-1" />
                <span className="text-xs font-bold">Pending</span>
              </div>
            )}
          </div>
        </div>

        {/* Description */}
        <p 
          className="mb-4 line-clamp-2 leading-relaxed text-sm"
          style={{ color: colors.textSecondary }}
        >
          {assessment.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          <span 
            className={`px-2.5 py-1 rounded-full text-xs font-bold border`}
            style={getTypeColor(assessment.type)}
          >
            {assessment.type}
          </span>
          <span 
            className={`px-2.5 py-1 rounded-full text-xs font-bold border`}
            style={getDifficultyColor(assessment.difficulty)}
          >
            {assessment.difficulty}
          </span>
          {(assessment.questions_type || []).slice(0, 2).map(t => (
            <span
              key={t}
              className="px-2.5 py-1 rounded-full text-xs font-bold border"
              style={{
                backgroundColor: colors.primary + '10',
                color: colors.primary,
                borderColor: colors.primary + '30'
              }}
            >
              {getQuestionTypeLabel(t)}
            </span>
          ))}
          {(assessment.questions_type || []).length > 2 && (
            <span 
              className="px-2.5 py-1 rounded-full text-xs font-bold border"
              style={{
                backgroundColor: colors.primary + '10',
                color: colors.primary,
                borderColor: colors.primary + '30'
              }}
            >
              +{(assessment.questions_type || []).length - 2}
            </span>
          )}
        </div>

        {/* Stats */}
        <div 
          className="grid grid-cols-3 gap-3 mb-4 p-3 rounded-xl border"
          style={{
            backgroundColor: colors.backgroundSecondary,
            borderColor: colors.borderLight
          }}
        >
          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <ClipboardList 
                className="w-4 h-4" 
                style={{ color: colors.textTertiary }}
              />
            </div>
            <div 
              className="text-base font-bold"
              style={{ color: colors.textPrimary }}
            >
              {assessment.number_of_questions}
            </div>
            <div 
              className="text-xs font-medium"
              style={{ color: colors.textTertiary }}
            >
              Questions
            </div>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <Award 
                className="w-4 h-4" 
                style={{ color: colors.textTertiary }}
              />
            </div>
            <div 
              className="text-base font-bold"
              style={{ color: colors.textPrimary }}
            >
              {assessment.total_marks}
            </div>
            <div 
              className="text-xs font-medium"
              style={{ color: colors.textTertiary }}
            >
              Marks
            </div>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <div 
                className="p-1 rounded-md"
                style={{ backgroundColor: bloomsInfo.bg }}
              >
                <BloomsIcon 
                  className="w-3 h-3" 
                  style={{ color: bloomsInfo.color }}
                />
              </div>
            </div>
            <div 
              className="text-base font-bold"
              style={{ color: colors.textPrimary }}
            >
              {assessment.blooms_level.slice(0, 3)}
            </div>
            <div 
              className="text-xs font-medium"
              style={{ color: colors.textTertiary }}
            >
              Bloom&apos;s
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-4 border-t" style={{ borderColor: colors.border }}>
          <div className="flex items-center justify-between mb-2">
            <span 
              className="text-xs font-medium flex items-center"
              style={{ color: colors.textTertiary }}
            >
              <Clock className="w-3.5 h-3.5 mr-1" />
              {formatDate(assessment.created_at)}
            </span>
            <div className="flex space-x-1">
              <button
                onClick={() => onView(assessment)}
                className="flex items-center p-1.5 text-sm font-medium rounded-lg transition-colors"
                style={{
                  color: colors.info,
                  backgroundColor: 'transparent'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = colors.info + '10';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <Eye className="w-4 h-4" />
              </button>
              <button
                onClick={() => onEdit(assessment)}
                className="flex items-center p-1.5 text-sm font-medium rounded-lg transition-colors"
                style={{
                  color: colors.primary,
                  backgroundColor: 'transparent'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = colors.primary + '10';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <Edit className="w-4 h-4" />
              </button>
              {!assessment.verified && (
                <button
                  onClick={() => onVerify(assessment.id)}
                  className="flex items-center p-1.5 text-sm font-medium rounded-lg transition-colors"
                  style={{
                    color: colors.success,
                    backgroundColor: 'transparent'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = colors.success + '10';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  <CheckCircle className="w-4 h-4" />
                </button>
              )}
              <button
                onClick={() => onDelete(assessment)}
                className="flex items-center p-1.5 text-sm font-medium rounded-lg transition-colors"
                style={{
                  color: colors.error,
                  backgroundColor: 'transparent'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = colors.error + '10';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <Trash className="w-4 h-4" />
              </button>
            </div>
          </div>
          {(assessment).schedule_date && (
            <div 
              className="flex items-center text-xs font-medium mt-2"
              style={{ color: colors.primary }}
            >
              <Calendar className="w-3.5 h-3.5 mr-1" />
              Scheduled: {formatDateForInput((assessment).schedule_date)}
            </div>
          )}
          {(assessment).deadline_date && (
            <div 
              className="flex items-center text-xs font-medium mt-2"
              style={{ color: colors.primary }}
            >
              <Calendar className="w-3.5 h-3.5 mr-1" />
              Deadline: {formatDateForInput(assessment.deadline_date)}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default AssessmentCard;