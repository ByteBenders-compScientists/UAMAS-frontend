import React, { useState } from 'react';
import { Save, Loader2, FileText } from 'lucide-react';
import { Assessment, Course, Question } from '../../types/assessment';
import QuestionEditor from './QuestionsEditor';

interface EditAssessmentModalProps {
  assessment: Assessment;
  courses: Course[];
  onUpdate: (data: any) => void;
  onCancel: () => void;
  loading: boolean;
}

const EditAssessmentModal: React.FC<EditAssessmentModalProps> = ({ 
  assessment, 
  courses, 
  onUpdate, 
  onCancel, 
  loading 
}) => {
  const [formData, setFormData] = useState({
    title: assessment.title,
    description: assessment.description,
    type: assessment.type,
    questions_type: assessment.questions_type,
    close_ended_type: assessment.close_ended_type || "multiple choice with one answer",
    topic: assessment.topic,
    total_marks: assessment.total_marks,
    difficulty: assessment.difficulty,
    number_of_questions: assessment.number_of_questions,
    blooms_level: assessment.blooms_level,
    deadline: assessment.deadline || "",
    duration: assessment.duration || 60
  });

  const [questions, setQuestions] = useState<Question[]>(assessment.questions || []);
  const [activeTab, setActiveTab] = useState<'details' | 'questions'>('details');

  const course = courses.find(c => c.id === assessment.course_id);
  const unit = course?.units.find(u => u.id === assessment.unit_id);

  const handleQuestionUpdate = (index: number, updatedQuestion: Question) => {
    const newQuestions = [...questions];
    newQuestions[index] = updatedQuestion;
    setQuestions(newQuestions);
  };

  const handleQuestionDelete = (index: number) => {
    const newQuestions = questions.filter((_, i) => i !== index);
    setQuestions(newQuestions);
  };

  const handleSubmit = () => {
    const submissionData = {
      ...formData,
      questions: questions
    };
    onUpdate(submissionData);
  };

  return (
    <div className="p-6">
      {/* Tab Navigation */}
      <div className="flex space-x-4 mb-6 border-b border-gray-200">
        <button
          onClick={() => setActiveTab('details')}
          className={`pb-3 px-1 font-medium text-sm border-b-2 transition-colors ${
            activeTab === 'details'
              ? 'border-emerald-500 text-emerald-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          Assessment Details
        </button>
        <button
          onClick={() => setActiveTab('questions')}
          className={`pb-3 px-1 font-medium text-sm border-b-2 transition-colors ${
            activeTab === 'questions'
              ? 'border-emerald-500 text-emerald-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          Questions ({questions.length})
        </button>
      </div>

      {/* Assessment Details Tab */}
      {activeTab === 'details' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-3">Assessment Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-3">Assessment Type</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({...formData, type: e.target.value as "CAT" | "Assignment" | "Case Study"})}
                className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
              >
                <option value="CAT">CAT</option>
                <option value="Assignment">Assignment</option>
                <option value="Case Study">Case Study</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-3">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              rows={4}
              className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-3">Total Marks</label>
              <input
                type="number"
                value={formData.total_marks}
                onChange={(e) => setFormData({...formData, total_marks: parseInt(e.target.value)})}
                className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                min="1"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-3">Difficulty</label>
              <select
                value={formData.difficulty}
                onChange={(e) => setFormData({...formData, difficulty: e.target.value as "Easy" | "Intermediate" | "Advanced"})}
                className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
              >
                <option value="Easy">Easy</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-3">Duration (min)</label>
              <input
                type="number"
                value={formData.duration}
                onChange={(e) => setFormData({...formData, duration: parseInt(e.target.value)})}
                className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                min="1"
              />
            </div>
          </div>
        </div>
      )}

      {/* Questions Tab */}
      {activeTab === 'questions' && (
        <div className="space-y-6">
          {questions.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">No Questions Yet</h3>
              <p className="text-gray-500">Questions will appear here after generation</p>
            </div>
          ) : (
            questions.map((question, index) => (
              <QuestionEditor
                key={question.id}
                question={question}
                onUpdate={(updatedQuestion) => handleQuestionUpdate(index, updatedQuestion)}
                onDelete={() => handleQuestionDelete(index)}
                index={index}
              />
            ))
          )}
        </div>
      )}

      {/* Footer */}
      <div className="mt-8 pt-6 border-t border-gray-200 flex justify-between items-center">
        <button
          onClick={onCancel}
          className="px-6 py-3 text-gray-600 hover:text-gray-800 font-semibold transition-colors rounded-xl hover:bg-gray-100"
          disabled={loading}
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="flex items-center px-6 py-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors font-semibold shadow-lg"
        >
          {loading ? (
            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
          ) : (
            <Save className="w-5 h-5 mr-2" />
          )}
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default EditAssessmentModal;