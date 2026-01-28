import React, { useMemo } from 'react';
import { CheckCircle, GripVertical } from 'lucide-react';
import { QuestionType, Question } from '../../../types/assessment';
import { useThemeColors } from '@/context/ThemeContext';

interface QuestionRendererProps {
  question: Question;
  questionNumber: number;
}

const QuestionRenderer: React.FC<QuestionRendererProps> = ({ question, questionNumber }) => {
  const colors = useThemeColors();

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

  const getTypeBadgeStyle = () => {
    switch (questionType) {
      case 'open-ended':
        return {
          backgroundColor: colors.backgroundSecondary,
          color: colors.textSecondary,
          borderColor: colors.border
        };
      case 'close-ended-multiple-single':
      case 'close-ended-multiple-multiple':
        return {
          backgroundColor: colors.info + '10',
          color: colors.info,
          borderColor: colors.info + '30'
        };
      case 'close-ended-bool':
        return {
          backgroundColor: colors.secondary + '10',
          color: colors.secondary,
          borderColor: colors.secondary + '30'
        };
      case 'close-ended-matching':
        return {
          backgroundColor: colors.warning + '10',
          color: colors.warning,
          borderColor: colors.warning + '30'
        };
      case 'close-ended-ordering':
        return {
          backgroundColor: colors.success + '10',
          color: colors.success,
          borderColor: colors.success + '30'
        };
      case 'close-ended-drag-drop':
        return {
          backgroundColor: colors.accent + '10',
          color: colors.accent,
          borderColor: colors.accent + '30'
        };
      default:
        return {
          backgroundColor: colors.backgroundSecondary,
          color: colors.textSecondary,
          borderColor: colors.border
        };
    }
  };

  const renderRubric = () => {
    if (!question.rubric) return null;
    return (
      <div 
        className="mt-4 rounded-xl border px-4 py-3"
        style={{
          borderColor: colors.warning + '30',
          backgroundColor: colors.warning + '10'
        }}
      >
        <p 
          className="text-xs font-semibold uppercase tracking-wide"
          style={{ color: colors.warning }}
        >
          Marking rubric
        </p>
        <p 
          className="mt-1 text-sm"
          style={{ color: colors.textPrimary }}
        >
          {question.rubric}
        </p>
      </div>
    );
  };

  const renderOpenEnded = () => (
    <div className="mt-4">
      <div 
        className="rounded-xl border px-4 py-3"
        style={{
          borderColor: colors.border,
          backgroundColor: colors.backgroundSecondary
        }}
      >
        <p 
          className="text-xs font-semibold uppercase tracking-wide"
          style={{ color: colors.textTertiary }}
        >
          Expected answer
        </p>
        <div 
          className="mt-2 min-h-[72px] text-sm"
          style={{ color: colors.textPrimary }}
        >
          {typeof correctAnswer === 'string' && correctAnswer.trim().length > 0 ? (
            correctAnswer
          ) : (
            <span style={{ color: colors.textTertiary }}>No expected answer provided.</span>
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
                    ? 'border-primary bg-primary/10'
                    : 'border-gray-200 bg-white hover:bg-gray-50'
                }`}
                style={{
                  borderColor: isSelected ? colors.primary : colors.border,
                  backgroundColor: isSelected ? colors.primary + '10' : colors.cardBackground
                }}
              >
                <div 
                  className="mt-0.5 flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold"
                  style={{
                    backgroundColor: colors.backgroundSecondary,
                    color: colors.textSecondary
                  }}
                >
                  {letter}
                </div>
                <div 
                  className="flex-1 text-sm"
                  style={{ color: colors.textPrimary }}
                >
                  {String(choice)}
                </div>
                <div
                  className={`flex h-6 w-6 items-center justify-center rounded-full border ${
                    isSelected
                      ? 'border-primary bg-primary'
                      : 'border-gray-300 bg-white'
                  }`}
                  style={{
                    borderColor: isSelected ? colors.primary : colors.borderLight,
                    backgroundColor: isSelected ? colors.primary : colors.cardBackground
                  }}
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
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {options.map((option) => {
            const isSelected = selectedAnswer?.toLowerCase() === option.toLowerCase();
            return (
              <div
                key={option}
                className={`flex items-center justify-between rounded-xl border px-4 py-3 ${
                  isSelected
                    ? 'border-primary bg-primary/10'
                    : 'border-gray-200 bg-white'
                }`}
                style={{
                  borderColor: isSelected ? colors.primary : colors.border,
                  backgroundColor: isSelected ? colors.primary + '10' : colors.cardBackground
                }}
              >
                <span 
                  className="text-sm font-medium"
                  style={{ color: colors.textPrimary }}
                >
                  {option}
                </span>
                <div
                  className={`flex h-6 w-6 items-center justify-center rounded-full border ${
                    isSelected
                      ? 'border-primary bg-primary'
                      : 'border-gray-300 bg-white'
                  }`}
                  style={{
                    borderColor: isSelected ? colors.primary : colors.borderLight,
                    backgroundColor: isSelected ? colors.primary : colors.cardBackground
                  }}
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
        <p 
          className="mt-4 text-sm"
          style={{ color: colors.textSecondary }}
        >
          No matching pairs provided.
        </p>
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
                style={{
                  borderColor: colors.border,
                  backgroundColor: colors.cardBackground
                }}
              >
                <span 
                  className="truncate text-sm font-medium"
                  style={{ color: colors.textPrimary }}
                >
                  {left || '?'}
                </span>
                <span style={{ color: colors.textTertiary }}>→</span>
                <span 
                  className="truncate text-sm"
                  style={{ color: colors.textPrimary }}
                >
                  {right || '?'}
                </span>
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
              <div 
                key={index} 
                className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3"
                style={{
                  borderColor: colors.border,
                  backgroundColor: colors.cardBackground
                }}
              >
                <div 
                  className="flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold"
                  style={{
                    backgroundColor: colors.success + '10',
                    color: colors.success
                  }}
                >
                  {index + 1}
                </div>
                <span 
                  className="text-sm"
                  style={{ color: colors.textPrimary }}
                >
                  {String(item)}
                </span>
              </div>
            ))
          ) : (
            <p 
              className="text-sm"
              style={{ color: colors.textSecondary }}
            >
              No ordered items provided.
            </p>
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
        <p 
          className="mt-4 text-sm"
          style={{ color: colors.textSecondary }}
        >
          No drag and drop items provided.
        </p>
      );
    }

    return (
      <div className="mt-4">
        {(dragItems.length > 0 || dropTargets.length > 0) && (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div 
              className="rounded-xl border border-gray-200 bg-white p-4"
              style={{
                borderColor: colors.border,
                backgroundColor: colors.cardBackground
              }}
            >
              <div 
                className="text-sm font-semibold"
                style={{ color: colors.textPrimary }}
              >
                Drag items
              </div>
              <div className="mt-2 flex flex-wrap gap-2">
                {dragItems.length > 0 ? (
                  dragItems.map((it, idx) => (
                    <span
                      key={`${it}-${idx}`}
                      className="inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ring-1 ring-inset ring-gray-200"
                      style={{
                        backgroundColor: colors.backgroundSecondary,
                        color: colors.textPrimary,
                        borderColor: colors.border
                      }}
                    >
                      {it}
                    </span>
                  ))
                ) : (
                  <span style={{ color: colors.textSecondary }}>No items.</span>
                )}
              </div>
            </div>

            <div 
              className="rounded-xl border border-gray-200 bg-white p-4"
              style={{
                borderColor: colors.border,
                backgroundColor: colors.cardBackground
              }}
            >
              <div 
                className="text-sm font-semibold"
                style={{ color: colors.textPrimary }}
              >
                Drop targets
              </div>
              <div className="mt-2 flex flex-wrap gap-2">
                {dropTargets.length > 0 ? (
                  dropTargets.map((t, idx) => (
                    <span
                      key={`${t}-${idx}`}
                      className="inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ring-1 ring-inset ring-cyan-200"
                      style={{
                        backgroundColor: colors.accent + '10',
                        color: colors.accent,
                        borderColor: colors.accent + '30'
                      }}
                    >
                      {t}
                    </span>
                  ))
                ) : (
                  <span style={{ color: colors.textSecondary }}>No targets.</span>
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
              <div 
                key={index} 
                className="rounded-xl border border-gray-200 bg-white px-4 py-3"
                style={{
                  borderColor: colors.border,
                  backgroundColor: colors.cardBackground
                }}
              >
                <div className="flex items-center gap-2">
                  <GripVertical className="h-4 w-4" style={{ color: colors.textTertiary }} />
                  <span 
                    className="text-sm font-medium"
                    style={{ color: colors.textPrimary }}
                  >
                    {dragItem}
                  </span>
                  <span style={{ color: colors.textTertiary }}>→</span>
                  <span 
                    className="inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ring-1 ring-inset ring-cyan-200"
                    style={{
                      backgroundColor: colors.accent + '10',
                      color: colors.accent,
                      borderColor: colors.accent + '30'
                    }}
                  >
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

  const typeBadgeStyle = getTypeBadgeStyle();

  return (
    <div 
      className="group mb-6 overflow-hidden rounded-2xl border shadow-sm transition-shadow hover:shadow-md"
      style={{
        borderColor: colors.border,
        backgroundColor: colors.cardBackground
      }}
    >
      <div 
        className="flex flex-col gap-3 border-b px-5 py-4 sm:flex-row sm:items-center sm:justify-between"
        style={{
          borderColor: colors.borderLight,
          background: `linear-gradient(to right, ${colors.backgroundSecondary}, ${colors.background})`
        }}
      >
        <div className="flex items-center gap-3">
          <div 
            className="flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold ring-1 ring-inset"
            style={{
              backgroundColor: colors.primary + '10',
              color: colors.primary,
              borderColor: colors.primary + '30'
            }}
          >
            {questionNumber}
          </div>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h3 
                className="text-base font-semibold"
                style={{ color: colors.textPrimary }}
              >
                Question {questionNumber}
              </h3>
              <span 
                className="inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset"
                style={typeBadgeStyle}
              >
                {typeLabel}
              </span>
            </div>
          </div>
        </div>

        <span 
          className="inline-flex items-center rounded-full px-3 py-1 text-sm font-semibold ring-1 ring-inset"
          style={{
            backgroundColor: colors.info + '10',
            color: colors.info,
            borderColor: colors.info + '30'
          }}
        >
          {question.marks} mark{question.marks !== 1 ? 's' : ''}
        </span>
      </div>

      <div className="px-5 py-4">
        <p 
          className="text-sm font-medium"
          style={{ color: colors.textPrimary }}
        >
          {questionText}
        </p>

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