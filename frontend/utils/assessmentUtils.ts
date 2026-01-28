/* eslint-disable react-hooks/rules-of-hooks */
import { Book, BookOpen, PenTool, Brain, Star, Sparkles, HelpCircle } from "lucide-react";
import { useThemeColors } from '@/context/ThemeContext';

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

// Format date for datetime-local input (YYYY-MM-DDTHH:mm)
export const formatDateForInput = (dateString: string | null | undefined): string => {
  if (!dateString) return "";
  
  try {
    const date = new Date(dateString);
    // Check if date is valid
    if (isNaN(date.getTime())) return "";
    
    // Format to YYYY-MM-DDTHH:mm (required format for datetime-local)
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  } catch (error) {
    console.error('Error formatting date:', error);
    return "";
  }
};

export const getDifficultyColor = (difficulty: string) => {
  const colors = useThemeColors();
  
  switch (difficulty) {
    case "Easy":
      return {
        backgroundColor: `${colors.success}20`,
        color: colors.success,
        borderColor: colors.success
      };
    case "Intermediate": 
      return {
        backgroundColor: `${colors.warning}20`,
        color: colors.warning,
        borderColor: colors.warning
      };
    case "Advance":
    case "Advanced":
      return {
        backgroundColor: `${colors.error}20`,
        color: colors.error,
        borderColor: colors.error
      };
    default:
      return {
        backgroundColor: colors.backgroundSecondary,
        color: colors.textPrimary,
        borderColor: colors.border
      };
  }
};

export const getTypeColor = (type: string) => {
  const colors = useThemeColors();
  
  switch (type) {
    case "CAT":
      return {
        backgroundColor: `${colors.info}20`,
        color: colors.info,
        borderColor: colors.info
      };
    case "Assignment":
      return {
        backgroundColor: `${colors.primary}20`,
        color: colors.primary,
        borderColor: colors.primary
      };
    case "Case Study":
      return {
        backgroundColor: `${colors.warning}20`,
        color: colors.warning,
        borderColor: colors.warning
      };
    default:
      return {
        backgroundColor: colors.backgroundSecondary,
        color: colors.textPrimary,
        borderColor: colors.border
      };
  }
};

export const getBlooms = (level: string) => {
  const colors = useThemeColors();
  switch (level) {
    case "Remember":
      return { icon: Book, color: colors.info, bg: `${colors.info}20` };
    case "Understand":
      return { icon: BookOpen, color: colors.info, bg: `${colors.info}20` };
    case "Apply":
      return { icon: PenTool, color: colors.success, bg: `${colors.success}20` };
    case "Analyze":
      return { icon: Brain, color: colors.warning, bg: `${colors.warning}20` };
    case "Evaluate":
      return { icon: Star, color: colors.warning, bg: `${colors.warning}20` };
    case "Create":
      return { icon: Sparkles, color: colors.primary, bg: `${colors.primary}20` };
    default:
      return { icon: HelpCircle, color: colors.textTertiary, bg: colors.backgroundSecondary };
  }
};