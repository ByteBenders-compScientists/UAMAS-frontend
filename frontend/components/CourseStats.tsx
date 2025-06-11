'use client';

import { Bar, Doughnut } from 'react-chartjs-2';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  Title, 
  Tooltip, 
  Legend,
  ArcElement
} from 'chart.js';
import { Users, Clock, FileText, BookOpen } from 'lucide-react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

interface CourseStatsProps {
  courseTitle: string;
  studentCount: number;
  contentCount: number;
  weekCount: number;
  completionRate: number;
}

const CourseStats = ({ 
  courseTitle, 
  studentCount, 
  contentCount, 
  weekCount, 
  completionRate 
}: CourseStatsProps) => {
  
  // Bar chart data
  const barData = {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6'],
    datasets: [
      {
        label: 'Content Items',
        data: [4, 5, 3, 0, 0, 0],
        backgroundColor: 'rgba(59, 130, 246, 0.6)',
        borderRadius: 6,
      },
    ],
  };
  
  const barOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          precision: 0,
        },
      },
    },
    maintainAspectRatio: false,
  };
  
  // Doughnut chart data
  const doughnutData = {
    labels: ['Lectures', 'Assignments', 'Resources'],
    datasets: [
      {
        data: [8, 2, 2],
        backgroundColor: [
          'rgba(59, 130, 246, 0.6)',
          'rgba(245, 158, 11, 0.6)',
          'rgba(16, 185, 129, 0.6)',
        ],
        borderWidth: 0,
      },
    ],
  };
  
  const doughnutOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom' as const,
      },
    },
    cutout: '70%',
    maintainAspectRatio: false,
  };
  
  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="p-5 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-800">{courseTitle} Statistics</h2>
      </div>
      
      <div className="p-5">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600">
                <Users size={20} />
              </div>
              <div>
                <p className="text-sm text-gray-500">Students</p>
                <p className="text-xl font-semibold text-gray-800">{studentCount}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center text-amber-600">
                <FileText size={20} />
              </div>
              <div>
                <p className="text-sm text-gray-500">Content</p>
                <p className="text-xl font-semibold text-gray-800">{contentCount}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-600">
                <Clock size={20} />
              </div>
              <div>
                <p className="text-sm text-gray-500">Weeks</p>
                <p className="text-xl font-semibold text-gray-800">{weekCount}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center text-purple-600">
                <BookOpen size={20} />
              </div>
              <div>
                <p className="text-sm text-gray-500">Completed</p>
                <p className="text-xl font-semibold text-gray-800">{completionRate}%</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-3">Content by Week</h3>
            <div className="h-[200px]">
              <Bar data={barData} options={barOptions} />
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-3">Content Breakdown</h3>
            <div className="h-[200px]">
              <Doughnut data={doughnutData} options={doughnutOptions} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseStats;