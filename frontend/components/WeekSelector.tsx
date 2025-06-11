'use client';

import { useState, useEffect } from 'react';
import { Calendar, ChevronDown } from 'lucide-react';

interface WeekSelectorProps {
  currentWeek: number;
  totalWeeks: number;
  onWeekChange: (week: number) => void;
}

const WeekSelector = ({ currentWeek, totalWeeks, onWeekChange }: WeekSelectorProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
      >
        <Calendar size={16} className="mr-2 text-gray-500" />
        <span className="text-sm font-medium text-gray-700">Week {currentWeek}</span>
        <ChevronDown size={16} className="ml-2 text-gray-500" />
      </button>
      
      {isOpen && (
        <div className="absolute top-full mt-2 left-0 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-[160px]">
          <div className="py-2">
            {Array.from({ length: totalWeeks }, (_, i) => i + 1).map((week) => (
              <button
                key={week}
                onClick={() => {
                  onWeekChange(week);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors ${
                  currentWeek === week ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-700'
                }`}
              >
                Week {week}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default WeekSelector;