import React, { useState, useEffect } from 'react';
import { Trash2, Save } from 'lucide-react';
import { LegacyQuestion as Question } from '../../types/assessment';

interface QuestionEditorProps {
  question: Question;
  onUpdate: (question: Question) => void;
  onDelete: () => void;
  index: number;
}

const QuestionEditor: React.FC<QuestionEditorProps> = ({ 
  question, 
  onUpdate, 
  onDelete, 
  index 
}) => {
  const [editedQuestion, setEditedQuestion] = useState(question);

  useEffect(() => {
    setEditedQuestion(question);
  }, [question]);

  const handleSave = () => {
    onUpdate(editedQuestion);
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
      <div className="flex justify-between items-start mb-4">
        <h4 className="font-semibold text-gray-900 text-lg">Question {index + 1}</h4>
        <div className="flex items-center space-x-2">
          <span className="bg-emerald-50 text-emerald-700 text-xs font-medium px-3 py-1 rounded-full">
            {editedQuestion.marks} marks
          </span>
          <button
            onClick={onDelete}
            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {/* Question Text */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Question</label>
          <textarea
            value={editedQuestion.question}
            onChange={(e) => setEditedQuestion({...editedQuestion, question: e.target.value})}
            rows={3}
            className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            placeholder="Enter question text"
          />
        </div>

        {/* Marks */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Marks</label>
          <input
            type="number"
            value={editedQuestion.marks}
            onChange={(e) => setEditedQuestion({...editedQuestion, marks: parseInt(e.target.value)})}
            className="w-24 p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            min="1"
          />
        </div>

        {/* Options for Multiple Choice */}
        {editedQuestion.type === "multiple-choice" && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Options</label>
            <div className="space-y-2">
              {editedQuestion.options?.map((option, optionIndex) => (
                <div key={optionIndex} className="flex items-center space-x-3">
                  <input
                    type="radio"
                    name={`correct-${question.id}`}
                    checked={editedQuestion.correct_answer === option}
                    onChange={() => setEditedQuestion({...editedQuestion, correct_answer: option})}
                    className="text-emerald-600 focus:ring-emerald-500"
                  />
                  <input
                    type="text"
                    value={option}
                    onChange={(e) => {
                      const newOptions = [...(editedQuestion.options || [])];
                      newOptions[optionIndex] = e.target.value;
                      setEditedQuestion({...editedQuestion, options: newOptions});
                    }}
                    className="flex-1 p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder={`Option ${optionIndex + 1}`}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Explanation */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Explanation (Optional)</label>
          <textarea
            value={editedQuestion.explanation || ''}
            onChange={(e) => setEditedQuestion({...editedQuestion, explanation: e.target.value})}
            rows={2}
            className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            placeholder="Provide an explanation for the answer"
          />
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            onClick={handleSave}
            className="flex items-center px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium"
          >
            <Save className="w-4 h-4 mr-2" />
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuestionEditor;