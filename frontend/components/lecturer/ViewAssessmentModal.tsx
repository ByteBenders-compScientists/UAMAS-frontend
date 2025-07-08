import React from 'react';
import { 
  Calendar, 
  BookOpen, 
  ClipboardList, 
  Info, 
  CheckCircle2, 
  AlertCircle, 
  ShieldCheck,
  BookMarked,
  FileText
} from 'lucide-react';
import { LegacyAssessment as Assessment, LegacyCourse as Course, LegacyQuestion as Question } from '../../types/assessment';
import { formatDate, getTypeColor, getDifficultyColor, getBlooms } from '../../utils/assessmentUtils';

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

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row md:items-start gap-6 mb-8">
        <div className="flex-1">
          {/* Header Info */}
          <div className="mb-6">
            <div className="flex flex-wrap items-center gap-3 mb-4 text-sm">
              <span className={`inline-flex items-center px-3 py-1 rounded-full font-medium ${getTypeColor(assessment.type)}`}>
                {assessment.type}
              </span>
              <span className={`inline-flex items-center px-3 py-1 rounded-full font-medium ${getDifficultyColor(assessment.difficulty)}`}>
                {assessment.difficulty}
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                {assessment.questions_type === 'application' ? 'Application' : 
                assessment.questions_type === 'open-ended' ? 'Open-ended' : 'Close-ended'}
              </span>
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{assessment.title}</h2>
            
            <div className="flex flex-wrap items-center gap-4 text-gray-600 mb-4">
              {course && (
                <div className="flex items-center">
                  <span className={`w-3 h-3 rounded-full mr-2 ${course.color}`}></span>
                  <span className="text-sm font-medium">{course.name}</span>
                </div>
              )}
              <span className="text-gray-300">•</span>
              <span className="text-sm font-medium">{unit?.name}</span>
              <span className="text-gray-300">•</span>
              <span className="text-sm font-medium flex items-center">
                <Calendar className="w-4 h-4 mr-1" />
                Week {assessment.week}
              </span>
            </div>
            
            <p className="text-gray-700 leading-relaxed">{assessment.description}</p>
          </div>
          
          {/* Topic Information */}
          <div className="bg-gray-50 rounded-xl p-5 mb-6 border border-gray-200">
            <h3 className="font-bold text-gray-900 mb-3 flex items-center">
              <BookOpen className="w-5 h-5 mr-2 text-emerald-600" />
              Topic Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-gray-500 font-medium">Main Topic</div>
                <div className="font-semibold text-gray-900">{assessment.topic}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500 font-medium">Bloom&#39;s Taxonomy Level</div>
                <div className="font-semibold text-gray-900 flex items-center">
                  <div className={`p-1.5 rounded-md ${bloomsInfo.bg} mr-2`}>
                    <BloomsIcon className={`w-4 h-4 ${bloomsInfo.color}`} />
                  </div>
                  {assessment.blooms_level}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Stats & Meta Info */}
        <div className="md:w-72 space-y-5">
          <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl p-5 border border-emerald-200">
            <h3 className="font-bold text-emerald-900 mb-4 flex items-center text-sm">
              <ClipboardList className="w-4 h-4 mr-2" />
              Assessment Details
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-emerald-800">Questions</span>
                <span className="font-bold text-emerald-900">{assessment.number_of_questions}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-emerald-800">Total Marks</span>
                <span className="font-bold text-emerald-900">{assessment.total_marks}</span>
              </div>
              {assessment.duration && (
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-emerald-800">Duration</span>
                  <span className="font-bold text-emerald-900">{assessment.duration} min</span>
                </div>
              )}
              {assessment.deadline && (
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-emerald-800">Deadline</span>
                  <span className="font-bold text-emerald-900">{formatDate(assessment.deadline)}</span>
                </div>
              )}
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-5 border border-gray-200">
            <h3 className="font-bold text-gray-900 mb-4 flex items-center text-sm">
              <Info className="w-4 h-4 mr-2" />
              Status Information
            </h3>
            <div className="space-y-3">
              <div className="flex items-center">
                {assessment.verified ? (
                  <div className="flex items-center text-green-600 bg-green-50 px-3 py-2 rounded-lg w-full">
                    <CheckCircle2 className="w-5 h-5 mr-2" />
                    <span className="font-semibold">Verified</span>
                  </div>
                ) : (
                  <div className="flex items-center text-yellow-600 bg-yellow-50 px-3 py-2 rounded-lg w-full">
                    <AlertCircle className="w-5 h-5 mr-2" />
                    <span className="font-semibold">Pending Verification</span>
                  </div>
                )}
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-600">Created</span>
                <span className="text-sm text-gray-900">{formatDate(assessment.created_at)}</span>
              </div>
            </div>
          </div>
          
          {/* Verify Button */}
          {!assessment.verified && (
            <button
              onClick={() => onVerify(assessment.id)}
              className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl shadow-lg flex items-center justify-center transition-colors"
            >
              <ShieldCheck className="w-5 h-5 mr-2" />
              Verify Assessment
            </button>
          )}
        </div>
      </div>
      
      {/* Questions Section */}
      <div className="border-t border-gray-200 pt-6">
        <h3 className="text-xl font-bold text-gray-900 mb-5 flex items-center">
          <BookMarked className="w-5 h-5 mr-2 text-emerald-600" />
          Assessment Questions
        </h3>
        
        <div className="space-y-6">
          {assessment.questions && assessment.questions.length > 0 ? (
            assessment.questions.map((question: Question, index: number) => (
              <div key={question.id} className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
                <div className="flex justify-between items-start mb-4">
                  <h4 className="font-semibold text-gray-900">Question {index + 1}</h4>
                  <span className="bg-emerald-50 text-emerald-700 text-xs font-medium px-2 py-1 rounded">
                    {question.marks} marks
                  </span>
                </div>
                <p className="text-gray-700 mb-4">{question.question}</p>
                
                {question.type === "multiple-choice" && question.options && (
                  <div className="space-y-3 ml-4">
                    {question.options.map((option, optionIndex) => (
                      <div key={optionIndex} className="flex items-center">
                        <div className={`w-5 h-5 rounded-full border-2 mr-3 ${
                          question.correct_answer === option 
                            ? 'border-emerald-500 bg-emerald-500' 
                            : 'border-gray-300'
                        }`}></div>
                        <span className={`${
                          question.correct_answer === option 
                            ? 'text-emerald-700 font-medium' 
                            : 'text-gray-700'
                        }`}>
                          {option}
                          {question.correct_answer === option && ' (Correct)'}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
                
                {question.type === "true-false" && (
                  <div className="space-y-3 ml-4">
                    {['True', 'False'].map((option) => (
                      <div key={option} className="flex items-center">
                        <div className={`w-5 h-5 rounded-full border-2 mr-3 ${
                          question.correct_answer === option 
                            ? 'border-emerald-500 bg-emerald-500' 
                            : 'border-gray-300'
                        }`}></div>
                        <span className={`${
                          question.correct_answer === option 
                            ? 'text-emerald-700 font-medium' 
                            : 'text-gray-700'
                        }`}>
                          {option}
                          {question.correct_answer === option && ' (Correct)'}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
                
                {question.type === "open-ended" && (
                  <div className="border-2 border-dashed border-gray-200 rounded-lg p-4 bg-gray-50">
                    <p className="text-gray-500 italic">Open-ended question - Answer area for students</p>
                  </div>
                )}
                
                {question.type === "application" && (
                  <div className="space-y-3">
                    <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                      <p className="text-gray-700 font-medium">Instructions:</p>
                      <p className="text-gray-600">Students should provide practical implementation or solution.</p>
                    </div>
                  </div>
                )}

                {question.explanation && (
                  <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <p className="text-sm font-medium text-blue-800 mb-1">Explanation:</p>
                    <p className="text-sm text-blue-700">{question.explanation}</p>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="text-center py-8">
              <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No questions available</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewAssessmentModal;