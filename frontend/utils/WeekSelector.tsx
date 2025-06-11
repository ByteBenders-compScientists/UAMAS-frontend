// Utility functions for week calculation
export const getCurrentWeek = (): number => {
    const semesterStart = new Date('2025-01-15'); // Adjust this date as needed
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - semesterStart.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const currentWeek = Math.ceil(diffDays / 7);
    
    // Ensure we don't go beyond week 15 (typical semester length)
    return Math.min(currentWeek, 15);
  };
  
  export const getWeekDateRange = (week: number): { start: Date; end: Date } => {
    const semesterStart = new Date('2025-01-15'); // Adjust this date as needed
    const startDate = new Date(semesterStart);
    startDate.setDate(startDate.getDate() + (week - 1) * 7);
    
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 6);
    
    return { start: startDate, end: endDate };
  };
  
  export const formatDateRange = (start: Date, end: Date): string => {
    const options: Intl.DateTimeFormatOptions = { 
      month: 'short', 
      day: 'numeric' 
    };
    
    return `${start.toLocaleDateString('en-US', options)} - ${end.toLocaleDateString('en-US', options)}`;
  };
  
  export const isWeekActive = (week: number): boolean => {
    const currentWeek = getCurrentWeek();
    return week <= currentWeek;
  };