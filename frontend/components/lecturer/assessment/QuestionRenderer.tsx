import React, { useMemo } from 'react';
import { CheckCircle, GripVertical } from 'lucide-react';
import { QuestionType, Question } from '../../../types/assessment';

interface QuestionRendererProps {
  question: Question;
  questionNumber: number;
}

const QuestionRenderer: React.FC<QuestionRendererProps> = ({ question, questionNumber }) => {
  const questionType = useMemo(() => {
    const rawType = String(question.type || '').trim().toLowerCase();
    const allowedTypes: QuestionType[] = [
      'open-ended',
      'close-ended-multiple-single',
      'close-ended-multiple-multiple',
      'close-ended-bool',
      'close-ended-matching',
      'close-ended-ordering',
      'close-ended-drag-drop',
    ];
    return allowedTypes.includes(rawType as QuestionType) 
      ? rawType as QuestionType 
      : 'open-ended';
  }, [question.type]);

  const questionText = question.text || question.question || '';
  const choices = Array.isArray(question.choices) ? question.choices : [];
  const correctAnswer = question.correct_answer;

  const typeLabel = useMemo(() => {
    const map: Record<QuestionType, string> = {
      'open-ended': 'Open Ended',
      'close-ended-multiple-single': 'Multiple Choice (Single)',
      'close-ended-multiple-multiple': 'Multiple Choice (Multiple)',
      'close-ended-bool': 'True / False',
      'close-ended-matching': 'Matching',
      'close-ended-ordering': 'Ordering',
      'close-ended-drag-drop': 'Drag & Drop',
    };
    return map[questionType];
  }, [questionType]);

  const typeBadgeClass = useMemo(() => {
    switch (questionType) {
      case 'open-ended':
        return 'bg-slate-50 text-slate-700 ring-slate-200';
      case 'close-ended-multiple-single':
      case 'close-ended-multiple-multiple':
        return 'bg-blue-50 text-blue-700 ring-blue-200';
      case 'close-ended-bool':
        return 'bg-violet-50 text-violet-700 ring-violet-200';
      case 'close-ended-matching':
        return 'bg-amber-50 text-amber-800 ring-amber-200';
      case 'close-ended-ordering':
        return 'bg-emerald-50 text-emerald-700 ring-emerald-200';
      case 'close-ended-drag-drop':
        return 'bg-cyan-50 text-cyan-700 ring-cyan-200';
      default:
        return 'bg-gray-50 text-gray-700 ring-gray-200';
    }
  }, [questionType]);

  const renderRubric = () => {
    if (!question.rubric) return null;
    return (
      <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-amber-800">Marking rubric</p>
        <p className="mt-1 text-sm text-amber-900">{question.rubric}</p>
      </div>
    );
  };

  const renderOpenEnded = () => (
    <div className="mt-4">
      <div className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-gray-600">Expected answer</p>
        <div className="mt-2 min-h-[72px] text-sm text-gray-800">
          {typeof correctAnswer === 'string' && correctAnswer.trim().length > 0 ? (
            correctAnswer
          ) : (
            <span className="text-gray-500">No expected answer provided.</span>
          )}
        </div>
      </div>
      {renderRubric()}
    </div>
  );

  const renderMultipleChoice = (multiple = false) => {
    const selectedAnswers = Array.isArray(correctAnswer)
      ? correctAnswer.map(String)
      : typeof correctAnswer === 'string'
        ? [correctAnswer]
        : [];
    
    return (
      <div className="mt-4">
        <div className="space-y-2">
          {choices.map((choice, index) => {
            const isSelected = selectedAnswers.includes(String(choice));
            const letter = String.fromCharCode(65 + index);
            return (
              <div
                key={index}
                className={`flex items-start gap-3 rounded-xl border px-4 py-3 transition ${
                  isSelected
                    ? 'border-emerald-200 bg-emerald-50'
                    : 'border-gray-200 bg-white hover:bg-gray-50'
                }`}
              >
                <div className="mt-0.5 flex h-6 w-6 items-center justify-center rounded-full bg-gray-100 text-xs font-semibold text-gray-700">
                  {letter}
                </div>
                <div className="flex-1 text-sm text-gray-900">{String(choice)}</div>
                <div
                  className={`flex h-6 w-6 items-center justify-center rounded-full border ${
                    isSelected
                      ? 'border-emerald-500 bg-emerald-600'
                      : 'border-gray-300 bg-white'
                  }`}
                  aria-label={
                    isSelected
                      ? 'Correct option'
                      : multiple
                        ? 'Option'
                        : 'Option'
                  }
                >
                  {isSelected && <CheckCircle className="h-4 w-4 text-white" />}
                </div>
              </div>
            );
          })}
        </div>
        {renderRubric()}
      </div>
    );
  };

  const renderTrueFalse = () => {
    const selectedAnswer = Array.isArray(correctAnswer)
      ? String(correctAnswer[0] ?? '')
      : typeof correctAnswer === 'string'
        ? correctAnswer
        : '';
    const options = ['True', 'False'];
    
    return (
      <div className="mt-4">
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {options.map((option) => {
            const isSelected = selectedAnswer?.toLowerCase() === option.toLowerCase();
            return (
              <div
                key={option}
                className={`flex items-center justify-between rounded-xl border px-4 py-3 ${
                  isSelected
                    ? 'border-emerald-200 bg-emerald-50'
                    : 'border-gray-200 bg-white'
                }`}
              >
                <span className="text-sm font-medium text-gray-900">{option}</span>
                <div
                  className={`flex h-6 w-6 items-center justify-center rounded-full border ${
                    isSelected
                      ? 'border-emerald-500 bg-emerald-600'
                      : 'border-gray-300 bg-white'
                  }`}
                >
                  {isSelected && <CheckCircle className="h-4 w-4 text-white" />}
                </div>
              </div>
            );
          })}
        </div>
        {renderRubric()}
      </div>
    );
  };

  const renderMatching = () => {
    if (!Array.isArray(correctAnswer) || correctAnswer.length === 0) {
      return (
        <p className="mt-4 text-sm text-gray-600">No matching pairs provided.</p>
      );
    }

    return (
      <div className="mt-4">
        <div className="space-y-2">
          {correctAnswer.map((pair, index) => {
            const [left, right] = Array.isArray(pair) ? pair : [];
            return (
              <div
                key={index}
                className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3"
              >
                <span className="truncate text-sm font-medium text-gray-900">{left || '?'}</span>
                <span className="text-gray-400">→</span>
                <span className="truncate text-sm text-gray-800">{right || '?'}</span>
              </div>
            );
          })}
        </div>
        {renderRubric()}
      </div>
    );
  };

  const renderOrdering = () => {
    const orderedItems = Array.isArray(correctAnswer) ? correctAnswer : [];
    
    return (
      <div className="mt-4">
        <div className="space-y-2">
          {orderedItems.length > 0 ? (
            orderedItems.map((item, index) => (
              <div key={index} className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-50 text-xs font-bold text-emerald-700">
                  {index + 1}
                </div>
                <span className="text-sm text-gray-900">{String(item)}</span>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-600">No ordered items provided.</p>
          )}
        </div>
        {renderRubric()}
      </div>
    );
  };

  const renderDragDrop = () => {
    const rawChoices = question.choices;
    const asParallelArrays =
      Array.isArray(rawChoices) &&
      rawChoices.length === 2 &&
      Array.isArray(rawChoices[0]) &&
      Array.isArray(rawChoices[1]);

    const dragItems: string[] = asParallelArrays ? (rawChoices[0] as unknown[]).map(String) : [];
    const dropTargets: string[] = asParallelArrays ? (rawChoices[1] as unknown[]).map(String) : [];

    const placements = Array.isArray(correctAnswer) ? correctAnswer : [];

    if ((dragItems.length === 0 && dropTargets.length === 0) && placements.length === 0) {
      return (
        <p className="mt-4 text-sm text-gray-600">No drag and drop items provided.</p>
      );
    }

    return (
      <div className="mt-4">
        {(dragItems.length > 0 || dropTargets.length > 0) && (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-gray-200 bg-white p-4">
              <div className="text-sm font-semibold text-gray-800">Drag items</div>
              <div className="mt-2 flex flex-wrap gap-2">
                {dragItems.length > 0 ? (
                  dragItems.map((it, idx) => (
                    <span
                      key={`${it}-${idx}`}
                      className="inline-flex items-center rounded-full bg-gray-50 px-3 py-1 text-xs font-semibold text-gray-800 ring-1 ring-inset ring-gray-200"
                    >
                      {it}
                    </span>
                  ))
                ) : (
                  <span className="text-sm text-gray-600">No items.</span>
                )}
              </div>
            </div>

            <div className="rounded-xl border border-gray-200 bg-white p-4">
              <div className="text-sm font-semibold text-gray-800">Drop targets</div>
              <div className="mt-2 flex flex-wrap gap-2">
                {dropTargets.length > 0 ? (
                  dropTargets.map((t, idx) => (
                    <span
                      key={`${t}-${idx}`}
                      className="inline-flex items-center rounded-full bg-cyan-50 px-3 py-1 text-xs font-semibold text-cyan-800 ring-1 ring-inset ring-cyan-200"
                    >
                      {t}
                    </span>
                  ))
                ) : (
                  <span className="text-sm text-gray-600">No targets.</span>
                )}
              </div>
            </div>
          </div>
        )}

        <div className="space-y-2">
          {placements.map((item, index) => {
            if (typeof item !== 'object' || item === null) return null;
            const { item: dragItem, target } = item as { item: string; target: string };
            return (
              <div key={index} className="rounded-xl border border-gray-200 bg-white px-4 py-3">
                <div className="flex items-center gap-2">
                  <GripVertical className="h-4 w-4 text-gray-400" />
                  <span className="text-sm font-medium text-gray-900">{dragItem}</span>
                  <span className="text-gray-400">→</span>
                  <span className="inline-flex items-center rounded-full bg-cyan-50 px-3 py-1 text-xs font-semibold text-cyan-800 ring-1 ring-inset ring-cyan-200">
                    {target}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
        {renderRubric()}
      </div>
    );
  };

  return (
    <div className="group mb-6 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md">
      <div className="flex flex-col gap-3 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-50 text-sm font-bold text-emerald-700 ring-1 ring-inset ring-emerald-200">
            {questionNumber}
          </div>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-base font-semibold text-gray-900">Question {questionNumber}</h3>
              <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${typeBadgeClass}`}>
                {typeLabel}
              </span>
            </div>
          </div>
        </div>

        <span className="inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-sm font-semibold text-blue-700 ring-1 ring-inset ring-blue-200">
          {question.marks} mark{question.marks !== 1 ? 's' : ''}
        </span>
      </div>

      <div className="px-5 py-4">
        <p className="text-sm font-medium text-gray-900">{questionText}</p>

        {questionType === 'open-ended' && renderOpenEnded()}
        {questionType === 'close-ended-multiple-single' && renderMultipleChoice()}
        {questionType === 'close-ended-multiple-multiple' && renderMultipleChoice(true)}
        {questionType === 'close-ended-bool' && renderTrueFalse()}
        {questionType === 'close-ended-matching' && renderMatching()}
        {questionType === 'close-ended-ordering' && renderOrdering()}
        {questionType === 'close-ended-drag-drop' && renderDragDrop()}
      </div>
    </div>
  );
};

export default React.memo(QuestionRenderer);
