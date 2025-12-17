import React, { useState, useEffect } from 'react';
import { Trash2, Save } from 'lucide-react';
import { Question, QuestionType } from '../../types/assessment';

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

  const questionText = editedQuestion.text || editedQuestion.question || '';

  const setQuestionText = (text: string) => {
    setEditedQuestion({
      ...editedQuestion,
      text,
      question: text,
    });
  };

  const normalizeChoiceList = (choices: unknown): string[] => {
    if (!Array.isArray(choices)) return [];
    return choices.map(c => String(c));
  };

  const choices = normalizeChoiceList(editedQuestion.choices);
  const type: QuestionType = editedQuestion.type;

  const setChoiceAt = (idx: number, value: string) => {
    const next = [...choices];
    next[idx] = value;
    setEditedQuestion({ ...editedQuestion, choices: next });
  };

  const addChoice = () => {
    const next = [...choices, `Option ${choices.length + 1}`];
    setEditedQuestion({ ...editedQuestion, choices: next });
  };

  const removeChoice = (idx: number) => {
    const next = choices.filter((_, i) => i !== idx);
    const currentAnswer = editedQuestion.correct_answer;
    const removedValue = choices[idx];
    let nextAnswer: typeof currentAnswer = currentAnswer;

    if (typeof currentAnswer === 'string' && currentAnswer === removedValue) {
      nextAnswer = '';
    }
    if (Array.isArray(currentAnswer)) {
      // Choices UI applies to multiple-choice answers; normalize to string[]
      nextAnswer = currentAnswer
        .map(a => String(a))
        .filter(a => a !== removedValue);
    }

    setEditedQuestion({ ...editedQuestion, choices: next, correct_answer: nextAnswer });
  };

  const renderRubric = () => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">Rubric (Optional)</label>
      <textarea
        value={editedQuestion.rubric || ''}
        onChange={(e) => setEditedQuestion({ ...editedQuestion, rubric: e.target.value })}
        rows={2}
        className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
        placeholder="Marking guide / explanation"
      />
    </div>
  );

  const renderOpenEnded = () => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">Model Answer (Optional)</label>
      <textarea
        value={typeof editedQuestion.correct_answer === 'string' ? editedQuestion.correct_answer : ''}
        onChange={(e) => setEditedQuestion({ ...editedQuestion, correct_answer: e.target.value })}
        rows={3}
        className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
        placeholder="Expected answer"
      />
    </div>
  );

  const renderMultipleSingle = () => (
    <div className="space-y-3">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Choices</label>
        <div className="space-y-2">
          {choices.map((option, optionIndex) => {
            const selected = typeof editedQuestion.correct_answer === 'string'
              ? editedQuestion.correct_answer
              : '';
            return (
              <div key={optionIndex} className="flex items-center space-x-3">
                <input
                  type="radio"
                  name={`correct-${question.id}`}
                  checked={selected === option}
                  onChange={() => setEditedQuestion({ ...editedQuestion, correct_answer: option })}
                  className="text-emerald-600 focus:ring-emerald-500"
                />
                <input
                  type="text"
                  value={option}
                  onChange={(e) => setChoiceAt(optionIndex, e.target.value)}
                  className="flex-1 p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder={`Option ${optionIndex + 1}`}
                />
                <button
                  type="button"
                  onClick={() => removeChoice(optionIndex)}
                  className="px-2 py-1 text-xs text-red-600 hover:bg-red-50 rounded"
                >
                  Remove
                </button>
              </div>
            );
          })}
        </div>
        <button
          type="button"
          onClick={addChoice}
          className="mt-2 text-sm text-emerald-700 hover:text-emerald-800"
        >
          Add choice
        </button>
      </div>
    </div>
  );

  const renderMultipleMultiple = () => (
    <div className="space-y-3">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Choices (select all correct)</label>
        <div className="space-y-2">
          {choices.map((option, optionIndex) => {
            const selectedAnswers = Array.isArray(editedQuestion.correct_answer)
              ? editedQuestion.correct_answer.map(String)
              : [];
            const checked = selectedAnswers.includes(option);
            return (
              <div key={optionIndex} className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => {
                    const next = checked
                      ? selectedAnswers.filter(a => a !== option)
                      : [...selectedAnswers, option];
                    setEditedQuestion({ ...editedQuestion, correct_answer: next });
                  }}
                  className="text-emerald-600 focus:ring-emerald-500"
                />
                <input
                  type="text"
                  value={option}
                  onChange={(e) => setChoiceAt(optionIndex, e.target.value)}
                  className="flex-1 p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder={`Option ${optionIndex + 1}`}
                />
                <button
                  type="button"
                  onClick={() => removeChoice(optionIndex)}
                  className="px-2 py-1 text-xs text-red-600 hover:bg-red-50 rounded"
                >
                  Remove
                </button>
              </div>
            );
          })}
        </div>
        <button
          type="button"
          onClick={addChoice}
          className="mt-2 text-sm text-emerald-700 hover:text-emerald-800"
        >
          Add choice
        </button>
      </div>
    </div>
  );

  const renderBool = () => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">Correct Answer</label>
      <div className="flex items-center space-x-6">
        {['True', 'False'].map(v => (
          <label key={v} className="flex items-center space-x-2">
            <input
              type="radio"
              name={`bool-${question.id}`}
              checked={String(editedQuestion.correct_answer || '').toLowerCase() === v.toLowerCase()}
              onChange={() => setEditedQuestion({ ...editedQuestion, correct_answer: v })}
              className="text-emerald-600 focus:ring-emerald-500"
            />
            <span className="text-sm text-gray-700">{v}</span>
          </label>
        ))}
      </div>
    </div>
  );

  const renderMatching = () => {
    const pairs: string[][] = Array.isArray(editedQuestion.correct_answer)
      ? (editedQuestion.correct_answer as unknown[]).map(p => Array.isArray(p) ? [String(p[0] ?? ''), String(p[1] ?? '')] : ['', ''])
      : [];

    const setPairAt = (idx: number, left: string, right: string) => {
      const next = [...pairs];
      next[idx] = [left, right];
      setEditedQuestion({ ...editedQuestion, correct_answer: next });
    };

    const addPair = () => {
      setEditedQuestion({ ...editedQuestion, correct_answer: [...pairs, ['', '']] });
    };

    const removePair = (idx: number) => {
      setEditedQuestion({ ...editedQuestion, correct_answer: pairs.filter((_, i) => i !== idx) });
    };

    return (
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Matching Pairs</label>
        <div className="space-y-2">
          {pairs.map((pair, i) => (
            <div key={i} className="grid grid-cols-1 md:grid-cols-5 gap-2 items-center">
              <input
                type="text"
                value={pair[0]}
                onChange={(e) => setPairAt(i, e.target.value, pair[1])}
                className="md:col-span-2 p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="Left item"
              />
              <div className="hidden md:block text-center text-gray-400">→</div>
              <input
                type="text"
                value={pair[1]}
                onChange={(e) => setPairAt(i, pair[0], e.target.value)}
                className="md:col-span-2 p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="Right item"
              />
              <button
                type="button"
                onClick={() => removePair(i)}
                className="text-xs text-red-600 hover:bg-red-50 rounded px-2 py-1"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={addPair}
          className="mt-2 text-sm text-emerald-700 hover:text-emerald-800"
        >
          Add pair
        </button>
      </div>
    );
  };

  const renderOrdering = () => {
    const items: string[] = Array.isArray(editedQuestion.correct_answer)
      ? editedQuestion.correct_answer.map(String)
      : [];

    const setItemAt = (idx: number, value: string) => {
      const next = [...items];
      next[idx] = value;
      setEditedQuestion({ ...editedQuestion, correct_answer: next });
    };

    const addItem = () => {
      setEditedQuestion({ ...editedQuestion, correct_answer: [...items, ''] });
    };

    const removeItem = (idx: number) => {
      setEditedQuestion({ ...editedQuestion, correct_answer: items.filter((_, i) => i !== idx) });
    };

    return (
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Correct Order</label>
        <div className="space-y-2">
          {items.map((it, i) => (
            <div key={i} className="flex items-center space-x-3">
              <span className="text-xs font-semibold text-gray-500 w-10">#{i + 1}</span>
              <input
                type="text"
                value={it}
                onChange={(e) => setItemAt(i, e.target.value)}
                className="flex-1 p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="Item"
              />
              <button
                type="button"
                onClick={() => removeItem(i)}
                className="px-2 py-1 text-xs text-red-600 hover:bg-red-50 rounded"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={addItem}
          className="mt-2 text-sm text-emerald-700 hover:text-emerald-800"
        >
          Add item
        </button>
      </div>
    );
  };

  const renderDragDrop = () => {
    const rawChoices = editedQuestion.choices;
    const asParallelArrays =
      Array.isArray(rawChoices) &&
      rawChoices.length === 2 &&
      Array.isArray(rawChoices[0]) &&
      Array.isArray(rawChoices[1]);

    const flatChoices = Array.isArray(rawChoices)
      ? rawChoices.filter((c): c is string => typeof c === 'string').map(String)
      : [];
    const splitIndex = flatChoices.length > 1 ? Math.floor(flatChoices.length / 2) : 0;

    const dragItems = asParallelArrays
      ? (rawChoices[0] as unknown[]).map(String)
      : flatChoices.length > 0
        ? flatChoices.slice(0, splitIndex)
        : [];
    const dropTargets = asParallelArrays
      ? (rawChoices[1] as unknown[]).map(String)
      : flatChoices.length > 0
        ? flatChoices.slice(splitIndex)
        : [];

    const setDragItems = (nextItems: string[]) => {
      setEditedQuestion({ ...editedQuestion, choices: [nextItems, dropTargets] });
    };

    const setDropTargets = (nextTargets: string[]) => {
      setEditedQuestion({ ...editedQuestion, choices: [dragItems, nextTargets] });
    };

    const placements: { item: string; target: string }[] = Array.isArray(editedQuestion.correct_answer)
      ? (editedQuestion.correct_answer as unknown[]).map(v => {
          if (typeof v !== 'object' || v === null) return { item: '', target: '' };
          const obj = v as { item?: unknown; target?: unknown };
          return { item: String(obj.item ?? ''), target: String(obj.target ?? '') };
        })
      : [];

    const setAt = (idx: number, nextPlacement: { item: string; target: string }) => {
      const next = [...placements];
      next[idx] = nextPlacement;
      setEditedQuestion({ ...editedQuestion, correct_answer: next });
    };

    const add = () => {
      setEditedQuestion({ ...editedQuestion, correct_answer: [...placements, { item: '', target: '' }] });
    };

    const remove = (idx: number) => {
      setEditedQuestion({ ...editedQuestion, correct_answer: placements.filter((_, i) => i !== idx) });
    };

    return (
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Drag & Drop</label>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm font-semibold text-gray-700">Drag items</div>
              <button
                type="button"
                onClick={() => setDragItems([...dragItems, ''])}
                className="text-sm text-emerald-700 hover:text-emerald-800"
              >
                Add item
              </button>
            </div>
            <div className="space-y-2">
              {dragItems.map((it, i) => (
                <div key={i} className="flex items-center space-x-3">
                  <input
                    type="text"
                    value={it}
                    onChange={(e) => {
                      const next = [...dragItems];
                      next[i] = e.target.value;
                      setDragItems(next);
                    }}
                    className="flex-1 p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="Item"
                  />
                  <button
                    type="button"
                    onClick={() => setDragItems(dragItems.filter((_, idx) => idx !== i))}
                    className="px-2 py-1 text-xs text-red-600 hover:bg-red-50 rounded"
                  >
                    Remove
                  </button>
                </div>
              ))}
              {dragItems.length === 0 && (
                <div className="text-sm text-gray-600">No drag items.</div>
              )}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm font-semibold text-gray-700">Drop targets</div>
              <button
                type="button"
                onClick={() => setDropTargets([...dropTargets, ''])}
                className="text-sm text-emerald-700 hover:text-emerald-800"
              >
                Add target
              </button>
            </div>
            <div className="space-y-2">
              {dropTargets.map((t, i) => (
                <div key={i} className="flex items-center space-x-3">
                  <input
                    type="text"
                    value={t}
                    onChange={(e) => {
                      const next = [...dropTargets];
                      next[i] = e.target.value;
                      setDropTargets(next);
                    }}
                    className="flex-1 p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="Target"
                  />
                  <button
                    type="button"
                    onClick={() => setDropTargets(dropTargets.filter((_, idx) => idx !== i))}
                    className="px-2 py-1 text-xs text-red-600 hover:bg-red-50 rounded"
                  >
                    Remove
                  </button>
                </div>
              ))}
              {dropTargets.length === 0 && (
                <div className="text-sm text-gray-600">No drop targets.</div>
              )}
            </div>
          </div>
        </div>

        <div className="text-sm font-semibold text-gray-700 mb-2">Correct placements</div>
        <div className="space-y-2">
          {placements.map((it, i) => (
            <div key={i} className="grid grid-cols-1 md:grid-cols-5 gap-2 items-center">
              <input
                type="text"
                value={it.item}
                onChange={(e) => setAt(i, { ...it, item: e.target.value })}
                className="md:col-span-2 p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="Item"
              />
              <div className="hidden md:block text-center text-gray-400">→</div>
              <input
                type="text"
                value={it.target}
                onChange={(e) => setAt(i, { ...it, target: e.target.value })}
                className="md:col-span-2 p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="Target"
              />
              <button
                type="button"
                onClick={() => remove(i)}
                className="text-xs text-red-600 hover:bg-red-50 rounded px-2 py-1"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={add}
          className="mt-2 text-sm text-emerald-700 hover:text-emerald-800"
        >
          Add item
        </button>
      </div>
    );
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
            value={questionText}
            onChange={(e) => setQuestionText(e.target.value)}
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

        {type === 'open-ended' && renderOpenEnded()}
        {type === 'close-ended-multiple-single' && renderMultipleSingle()}
        {type === 'close-ended-multiple-multiple' && renderMultipleMultiple()}
        {type === 'close-ended-bool' && renderBool()}
        {type === 'close-ended-matching' && renderMatching()}
        {type === 'close-ended-ordering' && renderOrdering()}
        {type === 'close-ended-drag-drop' && renderDragDrop()}

        {renderRubric()}

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
