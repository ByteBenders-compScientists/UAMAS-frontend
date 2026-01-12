import { Book, BookOpen, PenTool, Brain, Star, Sparkles, HelpCircle } from "lucide-react";

export const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short', 
    day: 'numeric'
  });
};

export const formatDateTime = (dateString: string) => {
  return new Date(dateString).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const getDifficultyColor = (difficulty: string) => {
  switch (difficulty) {
    case "Easy":
      return "bg-green-50 text-green-700 border-green-200";
    case "Intermediate": 
      return "bg-yellow-50 text-yellow-700 border-yellow-200";
    case "Advance":
    case "Advanced":
      return "bg-red-50 text-red-700 border-red-200";
    default:
      return "bg-gray-50 text-gray-700 border-gray-200";
  }
};

export const getTypeColor = (type: string) => {
  switch (type) {
    case "CAT":
      return "bg-blue-50 text-blue-700 border-blue-200";
    case "Assignment":
      return "bg-purple-50 text-purple-700 border-purple-200";
    case "Case Study":
      return "bg-orange-50 text-orange-700 border-orange-200";
    default:
      return "bg-gray-50 text-gray-700 border-gray-200";
  }
};

export const getBlooms = (level: string) => {
  switch (level) {
    case "Remember":
      return { icon: Book, color: "text-blue-500", bg: "bg-blue-50" };
    case "Understand":
      return { icon: BookOpen, color: "text-cyan-600", bg: "bg-cyan-50" };
    case "Apply":
      return { icon: PenTool, color: "text-green-600", bg: "bg-green-50" };
    case "Analyze":
      return { icon: Brain, color: "text-yellow-600", bg: "bg-yellow-50" };
    case "Evaluate":
      return { icon: Star, color: "text-orange-500", bg: "bg-orange-50" };
    case "Create":
      return { icon: Sparkles, color: "text-purple-600", bg: "bg-purple-50" };
    default:
      return { icon: HelpCircle, color: "text-gray-500", bg: "bg-gray-50" };
  }
};