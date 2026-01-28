/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useMemo, useState } from 'react';
import { Save, Loader2, FileText, Plus, AlertCircle, X } from 'lucide-react';
import { Course, Assessment, Question, QuestionType } from '../../types/assessment';
import { assessmentApi } from '../../services/api';
import QuestionEditor from './QuestionsEditor';
import { formatDateForInput } from '../../utils/assessmentUtils';
import { useThemeColors } from '@/context/ThemeContext';

interface EditAssessmentModalProps {
  assessment: Assessment;
  courses: Course[];
  onUpdate: (data: any) => void;
  onCancel: () => void;
  loading: boolean;
  onQuestionCountUpdate?: (assessmentId: string, nextCount: number) => void;
}



const EditAssessmentModal: React.FC<EditAssessmentModalProps> = ({ 
  assessment, 
  onUpdate, 
  onCancel, 
  loading,
  onQuestionCountUpdate,
}) => {
  const colors = useThemeColors();
  const [formData, setFormData] = useState({
  title: assessment.title,
  description: assessment.description,
  type: assessment.type,
  questions_type: assessment.questions_type,
  topic: assessment.topic,
  total_marks: assessment.total_marks,
  difficulty: assessment.difficulty,
  number_of_questions: assessment.number_of_questions,
  blooms_level: assessment.blooms_level,
  duration: assessment.duration || 60,
  schedule_date: formatDateForInput((assessment as any).schedule_date),
  deadline_date: formatDateForInput((assessment as any).deadline_date)
});




  const [questions, setQuestions] = useState<Question[]>(assessment.questions || []);
  const [activeTab, setActiveTab] = useState<'details' | 'questions'>('details');

  const allowedQuestionTypes = useMemo(() => {
    const types = Array.isArray(formData.questions_type) ? formData.questions_type : [];
    return types;
  }, [formData.questions_type]);

  const questionTypeOptions = useMemo(
    () =>
      [
        { value: 'open-ended' as const, label: 'Open Ended' },
        { value: 'close-ended-multiple-single' as const, label: 'Multiple Choice (Single Answer)' },
        { value: 'close-ended-multiple-multiple' as const, label: 'Multiple Choice (Multiple Answers)' },
        { value: 'close-ended-bool' as const, label: 'True/False' },
        { value: 'close-ended-matching' as const, label: 'Matching' },
        { value: 'close-ended-ordering' as const, label: 'Ordering' },
        { value: 'close-ended-drag-drop' as const, label: 'Drag and Drop' },
      ] as const,
    []
  );

  const [showAddQuestion, setShowAddQuestion] = useState(false);
  const [addingQuestion, setAddingQuestion] = useState(false);
  const [addQuestionError, setAddQuestionError] = useState<string | null>(null);

  const [newQuestionType, setNewQuestionType] = useState<QuestionType>(
    (assessment.questions_type?.[0] as QuestionType) || 'open-ended'
  );
  const [newQuestionText, setNewQuestionText] = useState('');
  const [newQuestionMarks, setNewQuestionMarks] = useState<number>(1);
  const [newQuestionRubric, setNewQuestionRubric] = useState('');

  const [newChoices, setNewChoices] = useState<string[]>(['']);
  const [newCorrectSingle, setNewCorrectSingle] = useState<string>('');
  const [newCorrectMultiple, setNewCorrectMultiple] = useState<string[]>([]);
  const [newCorrectBool, setNewCorrectBool] = useState<'True' | 'False'>('True');
  const [newMatchingPairs, setNewMatchingPairs] = useState<string[][]>([['', '']]);
  const [newOrderingItems, setNewOrderingItems] = useState<string[]>(['']);
  const [newDragDropPairs, setNewDragDropPairs] = useState<{ item: string; target: string }[]>([
    { item: '', target: '' },
  ]);
  const [newOpenEndedModelAnswer, setNewOpenEndedModelAnswer] = useState('');

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

  const resetAddQuestionForm = (nextType?: QuestionType) => {
    const t = nextType || newQuestionType;
    setNewQuestionType(t);
    setNewQuestionText('');
    setNewQuestionMarks(1);
    setNewQuestionRubric('');
    setNewOpenEndedModelAnswer('');
    setNewChoices(['']);
    setNewCorrectSingle('');
    setNewCorrectMultiple([]);
    setNewCorrectBool('True');
    setNewMatchingPairs([['', '']]);
    setNewOrderingItems(['']);
    setNewDragDropPairs([{ item: '', target: '' }]);
  };

  const buildCreatePayload = (): { text: string; marks: number; type: QuestionType; rubric: string; correct_answer?: string; choices?: string } => {
    const text = newQuestionText;
    const marks = Number(newQuestionMarks) || 1;
    const type = newQuestionType;
    const rubric = newQuestionRubric;

    if (type === 'open-ended') {
      return {
        text,
        marks,
        type,
        rubric,
        correct_answer: newOpenEndedModelAnswer || '',
        choices: '',
      };
    }

    if (type === 'close-ended-bool') {
      return {
        text,
        marks,
        type,
        rubric,
        correct_answer: newCorrectBool,
        choices: JSON.stringify(['True', 'False']),
      };
    }

    if (type === 'close-ended-multiple-single') {
      const choices = newChoices.map((c) => c.trim()).filter(Boolean);
      return {
        text,
        marks,
        type,
        rubric,
        correct_answer: newCorrectSingle || '',
        choices: JSON.stringify(choices),
      };
    }

    if (type === 'close-ended-multiple-multiple') {
      const choices = newChoices.map((c) => c.trim()).filter(Boolean);
      return {
        text,
        marks,
        type,
        rubric,
        correct_answer: JSON.stringify(newCorrectMultiple),
        choices: JSON.stringify(choices),
      };
    }

    if (type === 'close-ended-matching') {
      const pairs = newMatchingPairs
        .map((p) => [String(p?.[0] || '').trim(), String(p?.[1] || '').trim()])
        .filter((p) => p[0] || p[1]);
      return {
        text,
        marks,
        type,
        rubric,
        correct_answer: JSON.stringify(pairs),
        choices: JSON.stringify(pairs),
      };
    }

    if (type === 'close-ended-ordering') {
      const items = newOrderingItems.map((it) => it.trim()).filter(Boolean);
      return {
        text,
        marks,
        type,
        rubric,
        correct_answer: JSON.stringify(items),
        choices: JSON.stringify(items),
      };
    }

    if (type === 'close-ended-drag-drop') {
      const pairs = newDragDropPairs
        .map((p) => ({ item: String(p.item || '').trim(), target: String(p.target || '').trim() }))
        .filter((p) => p.item || p.target);

      const items = Array.from(new Set(pairs.map((p) => p.item).filter(Boolean)));
      const targets = Array.from(new Set(pairs.map((p) => p.target).filter(Boolean)));
      return {
        text,
        marks,
        type,
        rubric,
        correct_answer: JSON.stringify(pairs),
        choices: JSON.stringify([items, targets]),
      };
    }

    return {
      text,
      marks,
      type,
      rubric,
      correct_answer: '',
      choices: '',
    };
  };

  const createLocalQuestion = (questionId: string): Question => {
    const now = new Date().toISOString();
    const base: Question = {
      id: questionId,
      assessment_id: assessment.id,
      text: newQuestionText,
      question: newQuestionText,
      type: newQuestionType,
      marks: Number(newQuestionMarks) || 1,
      rubric: newQuestionRubric,
      created_at: now,
    };

    if (newQuestionType === 'open-ended') {
      return { ...base, correct_answer: newOpenEndedModelAnswer };
    }

    if (newQuestionType === 'close-ended-bool') {
      return { ...base, choices: ['True', 'False'], correct_answer: newCorrectBool };
    }

    if (newQuestionType === 'close-ended-multiple-single') {
      const choices = newChoices.map((c) => c.trim()).filter(Boolean);
      return { ...base, choices, correct_answer: newCorrectSingle };
    }

    if (newQuestionType === 'close-ended-multiple-multiple') {
      const choices = newChoices.map((c) => c.trim()).filter(Boolean);
      return { ...base, choices, correct_answer: newCorrectMultiple };
    }

    if (newQuestionType === 'close-ended-matching') {
      const pairs = newMatchingPairs
        .map((p) => [String(p?.[0] || '').trim(), String(p?.[1] || '').trim()])
        .filter((p) => p[0] || p[1]);
      return { ...base, correct_answer: pairs };
    }

    if (newQuestionType === 'close-ended-ordering') {
      const items = newOrderingItems.map((it) => it.trim()).filter(Boolean);
      return { ...base, choices: items, correct_answer: items };
    }

    if (newQuestionType === 'close-ended-drag-drop') {
      const pairs = newDragDropPairs
        .map((p) => ({ item: String(p.item || '').trim(), target: String(p.target || '').trim() }))
        .filter((p) => p.item || p.target);
      const items = Array.from(new Set(pairs.map((p) => p.item).filter(Boolean)));
      const targets = Array.from(new Set(pairs.map((p) => p.target).filter(Boolean)));
      return { ...base, choices: [items, targets], correct_answer: pairs };
    }

    return base;
  };

  const handleCreateQuestion = async () => {
    setAddQuestionError(null);

    if (!newQuestionText.trim()) {
      setAddQuestionError('Question text is required.');
      return;
    }

    if (allowedQuestionTypes.length > 0 && !allowedQuestionTypes.includes(newQuestionType)) {
      setAddQuestionError('Selected question type is not allowed for this assessment.');
      return;
    }

    setAddingQuestion(true);
    try {
      const payload = buildCreatePayload();
      const res = await assessmentApi.addQuestion(assessment.id, payload as any);
      const created = createLocalQuestion(res.question_id);

      setQuestions((prev) => {
        const next = [...prev, created];
        const nextCount = next.length;
        setFormData((current) => ({ ...current, number_of_questions: nextCount }));
        onQuestionCountUpdate?.(assessment.id, nextCount);
        return next;
      });

      resetAddQuestionForm(newQuestionType);
      setShowAddQuestion(false);
    } catch (e: any) {
      setAddQuestionError(e?.message || 'Failed to add question.');
    } finally {
      setAddingQuestion(false);
    }
  };

  return (
    <div className="p-6">
      {/* Tab Navigation */}
      <div 
        className="flex space-x-4 mb-6 border-b"
        style={{ borderColor: colors.border }}
      >
        <button
          onClick={() => setActiveTab('details')}
          className={`pb-3 px-1 font-medium text-sm border-b-2 transition-colors ${
            activeTab === 'details'
              ? ''
              : ''
          }`}
          style={{
            borderColor: activeTab === 'details' ? colors.primary : 'transparent',
            color: activeTab === 'details' ? colors.primary : colors.textSecondary,
          }}
        >
          Assessment Details
        </button>
        <button
          onClick={() => setActiveTab('questions')}
          className={`pb-3 px-1 font-medium text-sm border-b-2 transition-colors ${
            activeTab === 'questions'
              ? ''
              : ''
          }`}
          style={{
            borderColor: activeTab === 'questions' ? colors.primary : 'transparent',
            color: activeTab === 'questions' ? colors.primary : colors.textSecondary,
          }}
        >
          Questions ({questions.length})
        </button>
      </div>

      {/* Assessment Details Tab */}
      {activeTab === 'details' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold mb-3" style={{ color: colors.textPrimary }}>Assessment Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                className="w-full p-4 border rounded-xl focus:ring-2 focus:border-transparent transition-colors"
                style={{
                  backgroundColor: colors.inputBackground,
                  borderColor: colors.inputBorder,
                  color: colors.textPrimary,
                }}
              />
            </div>
            <div>
              <label className="block text-sm font-bold mb-3" style={{ color: colors.textPrimary }}>Assessment Type</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({...formData, type: e.target.value as "CAT" | "Assignment" | "Case Study"})}
                className="w-full p-4 border rounded-xl focus:ring-2 focus:border-transparent transition-colors"
                style={{
                  backgroundColor: colors.inputBackground,
                  borderColor: colors.inputBorder,
                  color: colors.textPrimary,
                }}
              >
                <option value="CAT">CAT</option>
                <option value="Assignment">Assignment</option>
                <option value="Case Study">Case Study</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold mb-3" style={{ color: colors.textPrimary }}>Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              rows={4}
              className="w-full p-4 border rounded-xl focus:ring-2 focus:border-transparent transition-colors"
              style={{
                backgroundColor: colors.inputBackground,
                borderColor: colors.inputBorder,
                color: colors.textPrimary,
              }}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-bold mb-3" style={{ color: colors.textPrimary }}>Total Marks</label>
              <input
                type="number"
                value={formData.total_marks}
                onChange={(e) => setFormData({...formData, total_marks: parseInt(e.target.value)})}
                className="w-full p-4 border rounded-xl focus:ring-2 focus:border-transparent transition-colors"
                style={{
                  backgroundColor: colors.inputBackground,
                  borderColor: colors.inputBorder,
                  color: colors.textPrimary,
                }}
                min="1"
              />
            </div>
            <div>
              <label className="block text-sm font-bold mb-3" style={{ color: colors.textPrimary }}>Difficulty</label>
              <select
                value={formData.difficulty}
                onChange={(e) => setFormData({...formData, difficulty: e.target.value as "Easy" | "Intermediate" | "Advance"})}
                className="w-full p-4 border rounded-xl focus:ring-2 focus:border-transparent transition-colors"
                style={{
                  backgroundColor: colors.inputBackground,
                  borderColor: colors.inputBorder,
                  color: colors.textPrimary,
                }}
              >
                <option value="Easy">Easy</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advance">Advanced</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold mb-3" style={{ color: colors.textPrimary }}>Duration (min)</label>
              <input
                type="number"
                value={formData.duration}
                onChange={(e) => setFormData({...formData, duration: parseInt(e.target.value)})}
                className="w-full p-4 border rounded-xl focus:ring-2 focus:border-transparent transition-colors"
                style={{
                  backgroundColor: colors.inputBackground,
                  borderColor: colors.inputBorder,
                  color: colors.textPrimary,
                }}
                min="1"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold mb-3" style={{ color: colors.textPrimary }}>Schedule Date (Optional)</label>
              <input
                type="datetime-local"
                value={formData.schedule_date}
                onChange={(e) => setFormData({...formData, schedule_date: e.target.value})}
                className="w-full p-4 border rounded-xl focus:ring-2 focus:border-transparent transition-colors"
                style={{
                  backgroundColor: colors.inputBackground,
                  borderColor: colors.inputBorder,
                  color: colors.textPrimary,
                }}
              />
            </div>
            <div>
              <label className="block text-sm font-bold mb-3" style={{ color: colors.textPrimary }}>Deadline Date (Optional)</label>
              <input
                type="datetime-local"
                value={formData.deadline_date}
                onChange={(e) => setFormData({...formData, deadline_date: e.target.value})}
                className="w-full p-4 border rounded-xl focus:ring-2 focus:border-transparent transition-colors"
                style={{
                  backgroundColor: colors.inputBackground,
                  borderColor: colors.inputBorder,
                  color: colors.textPrimary,
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Questions Tab */}
      {activeTab === 'questions' && (
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div>
              <div className="text-sm font-semibold" style={{ color: colors.textPrimary }}>Add questions</div>
              <div className="text-sm" style={{ color: colors.textSecondary }}>
                Allowed types: {allowedQuestionTypes.length > 0 ? allowedQuestionTypes.join(', ') : 'None set'}
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                setAddQuestionError(null);
                setShowAddQuestion((v) => !v);
              }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-white font-semibold hover:opacity-90 transition-colors"
              style={{ backgroundColor: colors.primary }}
              disabled={allowedQuestionTypes.length === 0}
            >
              <Plus className="w-4 h-4" />
              Add Question
            </button>
          </div>

          {showAddQuestion && (
            <div 
              className="rounded-2xl border p-6 shadow-sm space-y-5"
              style={{
                backgroundColor: colors.cardBackground,
                borderColor: colors.border,
              }}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="text-base font-semibold" style={{ color: colors.textPrimary }}>New Question</div>
                  <div className="text-sm" style={{ color: colors.textSecondary }}>Create and attach a new question to this assessment.</div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowAddQuestion(false)}
                  className="p-2 rounded-lg hover:opacity-90 transition-colors"
                  style={{ color: colors.textSecondary }}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {addQuestionError && (
                <div 
                  className="rounded-xl border p-4 text-sm flex items-start gap-2"
                  style={{
                    backgroundColor: `${colors.error}15`,
                    borderColor: colors.error,
                    color: colors.error,
                  }}
                >
                  <AlertCircle className="w-4 h-4 mt-0.5" />
                  <div>{addQuestionError}</div>
                </div>
              )}

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-bold mb-2" style={{ color: colors.textPrimary }}>Question Type</label>
                  <select
                    value={newQuestionType}
                    onChange={(e) => {
                      const nextType = e.target.value as QuestionType;
                      setNewQuestionType(nextType);
                      resetAddQuestionForm(nextType);
                    }}
                    className="w-full p-3 border rounded-xl focus:ring-2 focus:border-transparent"
                    style={{
                      backgroundColor: colors.inputBackground,
                      borderColor: colors.inputBorder,
                      color: colors.textPrimary,
                    }}
                  >
                    {questionTypeOptions
                      .filter((opt) => allowedQuestionTypes.includes(opt.value))
                      .map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold mb-2" style={{ color: colors.textPrimary }}>Marks</label>
                  <input
                    type="number"
                    value={newQuestionMarks}
                    onChange={(e) => setNewQuestionMarks(Number(e.target.value))}
                    min={1}
                    className="w-full p-3 border rounded-xl focus:ring-2 focus:border-transparent"
                    style={{
                      backgroundColor: colors.inputBackground,
                      borderColor: colors.inputBorder,
                      color: colors.textPrimary,
                    }}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold mb-2" style={{ color: colors.textPrimary }}>Question Text</label>
                <textarea
                  value={newQuestionText}
                  onChange={(e) => setNewQuestionText(e.target.value)}
                  rows={3}
                  className="w-full p-3 border rounded-xl focus:ring-2 focus:border-transparent"
                  style={{
                    backgroundColor: colors.inputBackground,
                    borderColor: colors.inputBorder,
                    color: colors.textPrimary,
                  }}
                />
              </div>

              <div>
                <label className="block text-sm font-bold mb-2" style={{ color: colors.textPrimary }}>Rubric</label>
                <textarea
                  value={newQuestionRubric}
                  onChange={(e) => setNewQuestionRubric(e.target.value)}
                  rows={2}
                  className="w-full p-3 border rounded-xl focus:ring-2 focus:border-transparent"
                  style={{
                    backgroundColor: colors.inputBackground,
                    borderColor: colors.inputBorder,
                    color: colors.textPrimary,
                  }}
                />
              </div>

              {newQuestionType === 'open-ended' && (
                <div>
                  <label className="block text-sm font-bold mb-2" style={{ color: colors.textPrimary }}>Model Answer (Optional)</label>
                  <textarea
                    value={newOpenEndedModelAnswer}
                    onChange={(e) => setNewOpenEndedModelAnswer(e.target.value)}
                    rows={3}
                    className="w-full p-3 border rounded-xl focus:ring-2 focus:border-transparent"
                    style={{
                      backgroundColor: colors.inputBackground,
                      borderColor: colors.inputBorder,
                      color: colors.textPrimary,
                    }}
                  />
                </div>
              )}

              {newQuestionType === 'close-ended-bool' && (
                <div>
                  <label className="block text-sm font-bold mb-2" style={{ color: colors.textPrimary }}>Correct Answer</label>
                  <select
                    value={newCorrectBool}
                    onChange={(e) => setNewCorrectBool(e.target.value as 'True' | 'False')}
                    className="w-full p-3 border rounded-xl focus:ring-2 focus:border-transparent"
                    style={{
                      backgroundColor: colors.inputBackground,
                      borderColor: colors.inputBorder,
                      color: colors.textPrimary,
                    }}
                  >
                    <option value="True">True</option>
                    <option value="False">False</option>
                  </select>
                </div>
              )}

              {(newQuestionType === 'close-ended-multiple-single' || newQuestionType === 'close-ended-multiple-multiple') && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="block text-sm font-bold" style={{ color: colors.textPrimary }}>Choices</label>
                    <button
                      type="button"
                      onClick={() => setNewChoices((prev) => [...prev, ''])}
                      className="text-sm font-semibold hover:opacity-90 transition-colors"
                      style={{ color: colors.primary }}
                    >
                      Add choice
                    </button>
                  </div>
                  <div className="space-y-2">
                    {newChoices.map((choice, idx) => {
                      const cleanedChoice = choice;
                      const checkedSingle = newQuestionType === 'close-ended-multiple-single' && newCorrectSingle === cleanedChoice;
                      const checkedMulti = newQuestionType === 'close-ended-multiple-multiple' && newCorrectMultiple.includes(cleanedChoice);
                      return (
                        <div key={idx} className="flex items-center gap-3">
                          {newQuestionType === 'close-ended-multiple-single' ? (
                            <input
                              type="radio"
                              name="new-correct-single"
                              checked={checkedSingle}
                              onChange={() => setNewCorrectSingle(cleanedChoice)}
                              style={{ color: colors.primary }}
                            />
                          ) : (
                            <input
                              type="checkbox"
                              checked={checkedMulti}
                              onChange={() => {
                                setNewCorrectMultiple((prev) =>
                                  prev.includes(cleanedChoice)
                                    ? prev.filter((v) => v !== cleanedChoice)
                                    : [...prev, cleanedChoice]
                                );
                              }}
                              style={{ color: colors.primary }}
                            />
                          )}
                          <input
                            type="text"
                            value={choice}
                            onChange={(e) => {
                              const next = [...newChoices];
                              const prevValue = next[idx];
                              next[idx] = e.target.value;
                              setNewChoices(next);
                              if (newQuestionType === 'close-ended-multiple-single') {
                                if (newCorrectSingle === prevValue) setNewCorrectSingle(e.target.value);
                              } else {
                                setNewCorrectMultiple((prev) =>
                                  prev.map((v) => (v === prevValue ? e.target.value : v))
                                );
                              }
                            }}
                            className="flex-1 p-3 border rounded-xl focus:ring-2 focus:border-transparent"
                            style={{
                              backgroundColor: colors.inputBackground,
                              borderColor: colors.inputBorder,
                              color: colors.textPrimary,
                            }}
                            placeholder={`Option ${idx + 1}`}
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const removed = newChoices[idx];
                              setNewChoices((prev) => prev.filter((_, i) => i !== idx));
                              if (newQuestionType === 'close-ended-multiple-single') {
                                if (newCorrectSingle === removed) setNewCorrectSingle('');
                              } else {
                                setNewCorrectMultiple((prev) => prev.filter((v) => v !== removed));
                              }
                            }}
                            className="px-3 py-2 text-sm rounded-xl border hover:opacity-90 transition-colors"
                            style={{
                              borderColor: colors.border,
                              color: colors.textPrimary,
                            }}
                          >
                            Remove
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {newQuestionType === 'close-ended-matching' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="block text-sm font-bold" style={{ color: colors.textPrimary }}>Matching pairs</label>
                    <button
                      type="button"
                      onClick={() => setNewMatchingPairs((prev) => [...prev, ['', '']])}
                      className="text-sm font-semibold hover:opacity-90 transition-colors"
                      style={{ color: colors.primary }}
                    >
                      Add pair
                    </button>
                  </div>
                  <div className="space-y-2">
                    {newMatchingPairs.map((pair, idx) => (
                      <div key={idx} className="grid grid-cols-1 md:grid-cols-5 gap-2 items-center">
                        <input
                          type="text"
                          value={pair[0]}
                          onChange={(e) => {
                            const next = [...newMatchingPairs];
                            next[idx] = [e.target.value, pair[1]];
                            setNewMatchingPairs(next);
                          }}
                          className="md:col-span-2 p-3 border rounded-xl focus:ring-2 focus:border-transparent"
                          style={{
                            backgroundColor: colors.inputBackground,
                            borderColor: colors.inputBorder,
                            color: colors.textPrimary,
                          }}
                          placeholder="Left item"
                        />
                        <div className="hidden md:block text-center" style={{ color: colors.textTertiary }}>→</div>
                        <input
                          type="text"
                          value={pair[1]}
                          onChange={(e) => {
                            const next = [...newMatchingPairs];
                            next[idx] = [pair[0], e.target.value];
                            setNewMatchingPairs(next);
                          }}
                          className="md:col-span-2 p-3 border rounded-xl focus:ring-2 focus:border-transparent"
                          style={{
                            backgroundColor: colors.inputBackground,
                            borderColor: colors.inputBorder,
                            color: colors.textPrimary,
                          }}
                          placeholder="Right item"
                        />
                        <button
                          type="button"
                          onClick={() => setNewMatchingPairs((prev) => prev.filter((_, i) => i !== idx))}
                          className="px-3 py-2 text-sm rounded-xl border hover:opacity-90 transition-colors"
                          style={{
                            borderColor: colors.border,
                            color: colors.textPrimary,
                          }}
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {newQuestionType === 'close-ended-ordering' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="block text-sm font-bold" style={{ color: colors.textPrimary }}>Correct order</label>
                    <button
                      type="button"
                      onClick={() => setNewOrderingItems((prev) => [...prev, ''])}
                      className="text-sm font-semibold hover:opacity-90 transition-colors"
                      style={{ color: colors.primary }}
                    >
                      Add item
                    </button>
                  </div>
                  <div className="space-y-2">
                    {newOrderingItems.map((it, idx) => (
                      <div key={idx} className="flex items-center gap-3">
                        <div className="w-10 text-xs font-semibold" style={{ color: colors.textTertiary }}>#{idx + 1}</div>
                        <input
                          type="text"
                          value={it}
                          onChange={(e) => {
                            const next = [...newOrderingItems];
                            next[idx] = e.target.value;
                            setNewOrderingItems(next);
                          }}
                          className="flex-1 p-3 border rounded-xl focus:ring-2 focus:border-transparent"
                          style={{
                            backgroundColor: colors.inputBackground,
                            borderColor: colors.inputBorder,
                            color: colors.textPrimary,
                          }}
                          placeholder="Item"
                        />
                        <button
                          type="button"
                          onClick={() => setNewOrderingItems((prev) => prev.filter((_, i) => i !== idx))}
                          className="px-3 py-2 text-sm rounded-xl border hover:opacity-90 transition-colors"
                          style={{
                            borderColor: colors.border,
                            color: colors.textPrimary,
                          }}
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {newQuestionType === 'close-ended-drag-drop' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="block text-sm font-bold" style={{ color: colors.textPrimary }}>Drag & Drop pairs</label>
                    <button
                      type="button"
                      onClick={() => setNewDragDropPairs((prev) => [...prev, { item: '', target: '' }])}
                      className="text-sm font-semibold hover:opacity-90 transition-colors"
                      style={{ color: colors.primary }}
                    >
                      Add pair
                    </button>
                  </div>
                  <div className="space-y-2">
                    {newDragDropPairs.map((pair, idx) => (
                      <div key={idx} className="grid grid-cols-1 md:grid-cols-5 gap-2 items-center">
                        <input
                          type="text"
                          value={pair.item}
                          onChange={(e) => {
                            const next = [...newDragDropPairs];
                            next[idx] = { ...pair, item: e.target.value };
                            setNewDragDropPairs(next);
                          }}
                          className="md:col-span-2 p-3 border rounded-xl focus:ring-2 focus:border-transparent"
                          style={{
                            backgroundColor: colors.inputBackground,
                            borderColor: colors.inputBorder,
                            color: colors.textPrimary,
                          }}
                          placeholder="Item"
                        />
                        <div className="hidden md:block text-center" style={{ color: colors.textTertiary }}>→</div>
                        <input
                          type="text"
                          value={pair.target}
                          onChange={(e) => {
                            const next = [...newDragDropPairs];
                            next[idx] = { ...pair, target: e.target.value };
                            setNewDragDropPairs(next);
                          }}
                          className="md:col-span-2 p-3 border rounded-xl focus:ring-2 focus:border-transparent"
                          style={{
                            backgroundColor: colors.inputBackground,
                            borderColor: colors.inputBorder,
                            color: colors.textPrimary,
                          }}
                          placeholder="Target"
                        />
                        <button
                          type="button"
                          onClick={() => setNewDragDropPairs((prev) => prev.filter((_, i) => i !== idx))}
                          className="px-3 py-2 text-sm rounded-xl border hover:opacity-90 transition-colors"
                          style={{
                            borderColor: colors.border,
                            color: colors.textPrimary,
                          }}
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-3 sm:justify-end">
                <button
                  type="button"
                  onClick={() => {
                    setAddQuestionError(null);
                    setShowAddQuestion(false);
                  }}
                  className="px-5 py-3 rounded-xl border font-semibold hover:opacity-90 transition-colors"
                  style={{
                    borderColor: colors.border,
                    color: colors.textPrimary,
                  }}
                  disabled={addingQuestion}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleCreateQuestion}
                  className="px-5 py-3 rounded-xl text-white font-semibold hover:opacity-90 disabled:opacity-50 inline-flex items-center justify-center"
                  style={{ backgroundColor: colors.primary }}
                  disabled={addingQuestion}
                >
                  {addingQuestion ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                  Create Question
                </button>
              </div>
            </div>
          )}

          {questions.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="w-16 h-16 mx-auto mb-4" style={{ color: colors.textTertiary }} />
              <h3 className="text-lg font-semibold mb-2" style={{ color: colors.textSecondary }}>No Questions Yet</h3>
              <p className="" style={{ color: colors.textSecondary }}>Questions will appear here after generation</p>
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
      <div 
        className="mt-8 pt-6 border-t flex justify-between items-center"
        style={{ borderColor: colors.border }}
      >
        <button
          onClick={onCancel}
          className="px-6 py-3 font-semibold transition-colors rounded-xl hover:opacity-90"
          style={{ color: colors.textSecondary }}
          disabled={loading}
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="flex items-center px-6 py-3 text-white rounded-xl hover:opacity-90 transition-colors font-semibold shadow-lg"
          style={{ backgroundColor: colors.primary }}
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