import React from 'react';
import { 
  Calendar, 
  Clock,
  BookOpen, 
  ClipboardList, 
  Info, 
  CheckCircle2, 
  AlertCircle, 
  ShieldCheck,
  BookMarked,
  FileText,
} from 'lucide-react';

import QuestionRenderer from './assessment/QuestionRenderer'
import { Assessment, Course, Question, QuestionType } from '../../types/assessment';
import { formatDate, formatDateTime, getTypeColor, getDifficultyColor, getBlooms } from '../../utils/assessmentUtils';

interface ViewAssessmentModalProps {
  assessment: Assessment;
  courses: Course[];
  onVerify: (id: string) => void;
}

const ViewAssessmentModal: React.FC<ViewAssessmentModalProps> = ({ 
  assessment,
  courses, 
  onVerify 
}) => {
  const course = courses.find(c => c.id === assessment.course_id);
  const unit = course?.units.find(u => u.id === assessment.unit_id);
  const bloomsInfo = getBlooms(assessment.blooms_level);
  const BloomsIcon = bloomsInfo.icon;

  const questionTypeOptions = [
    { value: 'open-ended' as const, label: 'Open Ended' },
    { value: 'close-ended-multiple-single' as const, label: 'Multiple Choice (Single Answer)' },
    { value: 'close-ended-multiple-multiple' as const, label: 'Multiple Choice (Multiple Answers)' },
    { value: 'close-ended-bool' as const, label: 'True/False' },
    { value: 'close-ended-matching' as const, label: 'Matching' },
    { value: 'close-ended-ordering' as const, label: 'Ordering' },
    { value: 'close-ended-drag-drop' as const, label: 'Drag and Drop' },
  ] as const;

  const getQuestionTypeLabel = (type: QuestionType) => {
    return questionTypeOptions.find(opt => opt.value === type)?.label || type;
  };

  return (
    <div className="p-6 sm:p-8">
      <div className="flex flex-col lg:flex-row lg:items-start gap-6 mb-8">
        <div className="flex-1">
          {/* Header Info */}
          <div className="mb-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span
                className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ring-1 ring-inset ${getTypeColor(assessment.type)}`}
              >
                {assessment.type}
              </span>
              <span
                className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ring-1 ring-inset ${getDifficultyColor(assessment.difficulty)}`}
              >
                {assessment.difficulty}
              </span>
              {(assessment.questions_type || []).map((t) => (
                <span
                  key={t}
                  className="inline-flex items-center rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-800 ring-1 ring-inset ring-emerald-200"
                >
                  {getQuestionTypeLabel(t)}
                </span>
              ))}
            </div>

            <h2 className="text-2xl font-bold text-gray-900">{assessment.title}</h2>

            <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-gray-600">
              {course && (
                <div className="flex items-center">
                  <span className={`w-2.5 h-2.5 rounded-full mr-2 ${course.color}`}></span>
                  <span className="font-medium">{course.name}</span>
                </div>
              )}
              {unit?.unit_name && (
                <span className="inline-flex items-center rounded-full bg-gray-50 px-3 py-1 text-xs font-semibold text-gray-700 ring-1 ring-inset ring-gray-200">
                  {unit.unit_name}
                </span>
              )}
              <span className="inline-flex items-center rounded-full bg-gray-50 px-3 py-1 text-xs font-semibold text-gray-700 ring-1 ring-inset ring-gray-200">
                <Calendar className="w-4 h-4 mr-1 text-gray-500" />
                Week {assessment.week}
              </span>
            </div>

            <p className="mt-4 text-sm leading-relaxed text-gray-700">{assessment.description}</p>
          </div>
          
          {/* Topic Information */}
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm mb-6">
            <h3 className="font-bold text-gray-900 mb-4 flex items-center">
              <BookOpen className="w-5 h-5 mr-2 text-emerald-600" />
              Topic Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <div className="text-xs font-semibold uppercase tracking-wide text-gray-500">Main topic</div>
                <div className="mt-1 font-semibold text-gray-900">{assessment.topic}</div>
              </div>
              <div>
                <div className="text-xs font-semibold uppercase tracking-wide text-gray-500">Bloom&#39;s level</div>
                <div className="mt-1 font-semibold text-gray-900 flex items-center">
                  <div className={`p-1.5 rounded-lg ${bloomsInfo.bg} mr-2 ring-1 ring-inset ring-gray-200`}>
                    <BloomsIcon className={`w-4 h-4 ${bloomsInfo.color}`} />
                  </div>
                  {assessment.blooms_level}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Stats & Meta Info */}
        <div className="lg:w-80 space-y-5">
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h3 className="font-bold text-gray-900 mb-4 flex items-center text-sm">
              <ClipboardList className="w-4 h-4 mr-2 text-emerald-600" />
              Key Metrics
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between rounded-xl bg-gray-50 px-4 py-3 ring-1 ring-inset ring-gray-200">
                <span className="text-sm font-medium text-gray-700">Questions</span>
                <span className="text-sm font-bold text-gray-900">{assessment.number_of_questions}</span>
              </div>
              <div className="flex items-center justify-between rounded-xl bg-gray-50 px-4 py-3 ring-1 ring-inset ring-gray-200">
                <span className="text-sm font-medium text-gray-700">Total Marks</span>
                <span className="text-sm font-bold text-gray-900">{assessment.total_marks}</span>
              </div>
              {assessment.duration && (
                <div className="flex items-center justify-between rounded-xl bg-gray-50 px-4 py-3 ring-1 ring-inset ring-gray-200">
                  <span className="flex items-center text-sm font-medium text-gray-700">
                    <Clock className="mr-2 h-4 w-4 text-gray-500" />
                    Duration
                  </span>
                  <span className="text-sm font-bold text-gray-900">{assessment.duration} min</span>
                </div>
              )}
              {assessment.deadline && (
                <div className="flex items-center justify-between rounded-xl bg-gray-50 px-4 py-3 ring-1 ring-inset ring-gray-200">
                  <span className="text-sm font-medium text-gray-700">Deadline</span>
                  <span className="text-sm font-bold text-gray-900">{formatDate(assessment.deadline)}</span>
                </div>
              )}
              {assessment.schedule_date && (
                <div className="flex items-center justify-between rounded-xl bg-gray-50 px-4 py-3 ring-1 ring-inset ring-gray-200">
                  <span className="flex items-center text-sm font-medium text-gray-700">
                    <Calendar className="mr-2 h-4 w-4 text-gray-500" />
                    Schedule Date
                  </span>
                  <span className="text-sm font-bold text-gray-900">{formatDateTime(assessment.schedule_date)}</span>
                </div>
              )}
            </div>
          </div>
          
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h3 className="font-bold text-gray-900 mb-4 flex items-center text-sm">
              <Info className="w-4 h-4 mr-2 text-gray-600" />
              Status
            </h3>
            <div className="space-y-3">
              {assessment.verified ? (
                <div className="flex items-center justify-between rounded-xl bg-green-50 px-4 py-3 ring-1 ring-inset ring-green-200">
                  <div className="flex items-center text-green-700">
                    <CheckCircle2 className="w-5 h-5 mr-2" />
                    <span className="font-semibold">Verified</span>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between rounded-xl bg-yellow-50 px-4 py-3 ring-1 ring-inset ring-yellow-200">
                  <div className="flex items-center text-yellow-800">
                    <AlertCircle className="w-5 h-5 mr-2" />
                    <span className="font-semibold">Pending verification</span>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between rounded-xl bg-gray-50 px-4 py-3 ring-1 ring-inset ring-gray-200">
                <span className="text-sm font-medium text-gray-700">Created</span>
                <span className="text-sm font-semibold text-gray-900">{formatDate(assessment.created_at)}</span>
              </div>
            </div>
          </div>
          
          {/* Verify Button */}
          {!assessment.verified && (
            <button
              onClick={() => onVerify(assessment.id)}
              className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-2xl shadow-lg flex items-center justify-center transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:ring-offset-2"
            >
              <ShieldCheck className="w-5 h-5 mr-2" />
              Verify Assessment
            </button>
          )}
        </div>
      </div>
      
      {/* Questions Section */}
      <div className="border-t border-gray-200 pt-6">
        <div className="flex justify-between items-center mb-5">
          <h3 className="text-xl font-bold text-gray-900 flex items-center">
            <BookMarked className="w-5 h-5 mr-2 text-emerald-600" />
            Assessment Questions
          </h3>
          <div className="flex items-center text-sm text-gray-500">
            <span className="bg-gray-100 px-3 py-1.5 rounded-full font-medium ring-1 ring-inset ring-gray-200">
              {assessment.questions?.length || 0} question{assessment.questions?.length !== 1 ? 's' : ''}
            </span>
          </div>
        </div>
        
        <div className="space-y-6">
          {assessment.questions && assessment.questions.length > 0 ? (
            assessment.questions.map((question: Question, index: number) => (
              <QuestionRenderer 
                key={question.id} 
                question={question}
                questionNumber={index + 1} 
              />
            ))
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
              <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No questions available for this assessment</p>
              <p className="text-sm text-gray-400 mt-1">Add questions to create an assessment</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewAssessmentModal;