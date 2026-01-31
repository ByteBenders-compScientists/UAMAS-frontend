'use client';

import { useState } from 'react';
import { Calendar, ChevronDown } from 'lucide-react';
import { useThemeColors } from '@/context/ThemeContext';

interface WeekSelectorProps {
  currentWeek: number;
  totalWeeks: number;
  onWeekChange: (week: number) => void;
}

const WeekSelector = ({ currentWeek, totalWeeks, onWeekChange }: WeekSelectorProps) => {
  const colors = useThemeColors();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center px-4 py-2 border rounded-lg hover:bg-gray-50 transition-colors"
        style={{
          backgroundColor: colors.cardBackground,
          borderColor: colors.border,
          color: colors.textPrimary
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = colors.backgroundSecondary;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = colors.cardBackground;
        }}
      >
        <Calendar size={16} className="mr-2" style={{ color: colors.textTertiary }} />
        <span className="text-sm font-medium">Week {currentWeek}</span>
        <ChevronDown size={16} className="ml-2" style={{ color: colors.textTertiary }} />
      </button>
      
      {isOpen && (
        <div 
          className="absolute top-full mt-2 left-0 border rounded-lg shadow-lg z-10 min-w-[160px]"
          style={{
            backgroundColor: colors.cardBackground,
            borderColor: colors.border
          }}
        >
          <div className="py-2">
            {Array.from({ length: totalWeeks }, (_, i) => i + 1).map((week) => (
              <button
                key={week}
                onClick={() => {
                  onWeekChange(week);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-4 py-2 text-sm transition-colors ${
                  currentWeek === week ? 'font-medium' : ''
                }`}
                style={{
                  backgroundColor: currentWeek === week ? colors.primary + '10' : 'transparent',
                  color: currentWeek === week ? colors.primary : colors.textPrimary
                }}
                onMouseEnter={(e) => {
                  if (currentWeek !== week) {
                    e.currentTarget.style.backgroundColor = colors.backgroundSecondary;
                  }
                }}
                onMouseLeave={(e) => {
                  if (currentWeek !== week) {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }
                }}
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