
import React from 'react';
import { motion } from 'framer-motion';
import { BookMarked, ClipboardList, FileCheck, CheckCircle } from 'lucide-react';
import { Assessment } from '../../types/assessment';

interface StatsCardsProps {
  assessments: Assessment[];
}

const StatsCards: React.FC<StatsCardsProps> = ({ assessments }) => {
  const stats = [
    {
      icon: BookMarked,
      label: "Total Assessments",
      value: assessments.length,
      color: "text-blue-600",
      bg: "bg-blue-50",
      border: "border-blue-200",
      gradient: "from-blue-50 to-blue-100"
    },
    {
      icon: ClipboardList,
      label: "CATs",
      value: assessments.filter(a => a.type === "CAT").length,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
      border: "border-emerald-200",
      gradient: "from-emerald-50 to-emerald-100"
    },
    {
      icon: FileCheck,
      label: "Assignments", 
      value: assessments.filter(a => a.type === "Assignment").length,
      color: "text-purple-600",
      bg: "bg-purple-50",
      border: "border-purple-200",
      gradient: "from-purple-50 to-purple-100"
    },
    {
      icon: CheckCircle,
      label: "Verified",
      value: assessments.filter(a => a.verified).length,
      color: "text-green-600",
      bg: "bg-green-50",
      border: "border-green-200",
      gradient: "from-green-50 to-green-100"
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
          className={`bg-gradient-to-br ${stat.gradient} rounded-xl shadow border ${stat.border} p-4 hover:shadow-md transition-all`}
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</div>
              <div className="text-sm font-semibold text-gray-600">{stat.label}</div>
            </div>
            <div className={`p-3 rounded-xl ${stat.bg} shadow-sm`}>
              <stat.icon className={`w-6 h-6 ${stat.color}`} />
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default StatsCards;