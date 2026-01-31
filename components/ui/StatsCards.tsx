import React from 'react';
import { motion } from 'framer-motion';
import { BookMarked, ClipboardList, FileCheck, CheckCircle } from 'lucide-react';
import { Assessment } from '../../types/assessment';
import { useThemeColors } from '@/context/ThemeContext';

interface StatsCardsProps {
  assessments: Assessment[];
}

const StatsCards: React.FC<StatsCardsProps> = ({ assessments }) => {
  const colors = useThemeColors();

  const stats = [
    {
      icon: BookMarked,
      label: "Total Assessments",
      value: assessments.length,
      color: colors.info,
      bg: colors.info + '10',
      border: colors.info + '30'
    },
    {
      icon: ClipboardList,
      label: "CATs",
      value: assessments.filter(a => a.type === "CAT").length,
      color: colors.primary,
      bg: colors.primary + '10',
      border: colors.primary + '30'
    },
    {
      icon: FileCheck,
      label: "Assignments",
      value: assessments.filter(a => a.type === "Assignment").length,
      color: colors.secondary,
      bg: colors.secondary + '10',
      border: colors.secondary + '30'
    },
    {
      icon: CheckCircle,
      label: "Verified",
      value: assessments.filter(a => a.verified).length,
      color: colors.success,
      bg: colors.success + '10',
      border: colors.success + '30'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {stats.map((stat, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="rounded-xl shadow border p-4 hover:shadow-md transition-all"
          style={{
            backgroundColor: colors.cardBackground,
            borderColor: stat.border
          }}
        >
          <div className="flex items-center justify-between">
            <div>
              <div 
                className="text-2xl font-bold mb-1"
                style={{ color: colors.textPrimary }}
              >
                {stat.value}
              </div>
              <div 
                className="text-sm font-semibold"
                style={{ color: colors.textSecondary }}
              >
                {stat.label}
              </div>
            </div>
            <div 
              className="p-3 rounded-xl shadow-sm"
              style={{ backgroundColor: stat.bg }}
            >
              <stat.icon 
                className="w-6 h-6" 
                style={{ color: stat.color }}
              />
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default StatsCards;