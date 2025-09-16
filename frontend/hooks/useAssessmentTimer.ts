import { useState, useEffect, useRef, useCallback } from 'react';

interface TimerState {
  timeRemaining: number; // in seconds
  isActive: boolean;
  isLoading: boolean;
  error: string | null;
  hasStarted: boolean;
}

interface UseAssessmentTimerProps {
  assessmentId: string | null;
  initialDuration?: number; // in minutes
  onTimeUp?: () => void;
  onAutoSubmit?: () => void;
}

export const useAssessmentTimer = ({
  assessmentId,
  initialDuration = 60,
  onTimeUp,
  onAutoSubmit,
}: UseAssessmentTimerProps) => {
  const [state, setState] = useState<TimerState>({
    timeRemaining: initialDuration * 60,
    isActive: false,
    isLoading: false,
    error: null,
    hasStarted: false,
  });

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080/api/v1";

  // Start assessment on backend
  const startAssessment = useCallback(async (): Promise<boolean> => {
    if (!assessmentId || state.hasStarted) return false;

    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const response = await fetch(`${apiBaseUrl}/bd/student/start_assessment/${assessmentId}`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to start assessment: ${response.statusText}`);
      }

      const data = await response.json();
      console.log(data);
      setState(prev => ({ 
        ...prev, 
        hasStarted: true, 
        isActive: true, 
        isLoading: false,
        timeRemaining: initialDuration * 60 // Reset to initial duration
      }));

      return true;
    } catch (error) {
      console.error('Error starting assessment:', error);
      setState(prev => ({ 
        ...prev, 
        isLoading: false, 
        error: error instanceof Error ? error.message : 'Failed to start assessment'
      }));
      return false;
    }
  }, [assessmentId, state.hasStarted, initialDuration, apiBaseUrl]);

  // Fetch time remaining from backend
  const fetchTimeRemaining = useCallback(async (): Promise<number | null> => {
    if (!assessmentId) return null;

    try {
      const response = await fetch(`${apiBaseUrl}/bd/student/time_remaining/${assessmentId}`, {
        method: 'GET',
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch time remaining: ${response.statusText}`);
      }

      const data = await response.json();
      
      // Check if time is up and auto-submitted
      if (data.message === 'Time is up. Assessment has been auto-submitted.') {
        setState(prev => ({ ...prev, isActive: false, timeRemaining: 0 }));
        onAutoSubmit?.();
        return 0;
      }

      const timeRemaining = Math.max(0, data.time_remaining * 60); // Convert minutes to seconds
      return timeRemaining;
    } catch (error) {
      console.error('Error fetching time remaining:', error);
      return null;
    }
  }, [assessmentId, apiBaseUrl, onAutoSubmit]);

  // Start the timer
  const startTimer = useCallback(async () => {
    if (!assessmentId || state.isActive) return;

    const started = await startAssessment();
    if (!started) return;

    // Start the local timer
    intervalRef.current = setInterval(() => {
      setState(prev => {
        const newTime = Math.max(0, prev.timeRemaining - 1);
        
        if (newTime === 0) {
          onTimeUp?.();
          return { ...prev, isActive: false, timeRemaining: 0 };
        }
        
        return { ...prev, timeRemaining: newTime };
      });
    }, 1000);

    // Fetch from backend every 10 seconds for synchronization
    const syncInterval = setInterval(async () => {
      const backendTime = await fetchTimeRemaining();
      if (backendTime !== null) {
        setState(prev => ({
          ...prev,
          timeRemaining: backendTime,
          error: null,
        }));
      }
    }, 10000);

    // Store sync interval reference for cleanup
    (intervalRef.current as any).syncInterval = syncInterval;
  }, [assessmentId, state.isActive, startAssessment, fetchTimeRemaining, onTimeUp]);

  // Stop the timer
  const stopTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      if ((intervalRef.current as any).syncInterval) {
        clearInterval((intervalRef.current as any).syncInterval);
      }
      intervalRef.current = null;
    }
    setState(prev => ({ ...prev, isActive: false }));
  }, []);

  // Pause the timer
  const pauseTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      if ((intervalRef.current as any).syncInterval) {
        clearInterval((intervalRef.current as any).syncInterval);
      }
      intervalRef.current = null;
    }
    setState(prev => ({ ...prev, isActive: false }));
  }, []);

  // Resume the timer
  const resumeTimer = useCallback(async () => {
    if (!assessmentId || state.timeRemaining <= 0) return;

    // Resume local timer
    intervalRef.current = setInterval(() => {
      setState(prev => {
        const newTime = Math.max(0, prev.timeRemaining - 1);
        
        if (newTime === 0) {
          onTimeUp?.();
          return { ...prev, isActive: false, timeRemaining: 0 };
        }
        
        return { ...prev, timeRemaining: newTime };
      });
    }, 1000);

    // Resume backend sync
    const syncInterval = setInterval(async () => {
      const backendTime = await fetchTimeRemaining();
      if (backendTime !== null) {
        setState(prev => ({
          ...prev,
          timeRemaining: backendTime,
          error: null,
        }));
      }
    }, 10000);

    (intervalRef.current as any).syncInterval = syncInterval;
    setState(prev => ({ ...prev, isActive: true }));
  }, [assessmentId, state.timeRemaining, fetchTimeRemaining, onTimeUp]);

  // Manual sync with backend
  const syncWithBackend = useCallback(async () => {
    const backendTime = await fetchTimeRemaining();
    if (backendTime !== null) {
      setState(prev => ({
        ...prev,
        timeRemaining: backendTime,
        error: null,
      }));
      return backendTime;
    }
    return null;
  }, [fetchTimeRemaining]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        if ((intervalRef.current as any).syncInterval) {
          clearInterval((intervalRef.current as any).syncInterval);
        }
      }
    };
  }, []);

  // Format time for display
  const formatTime = useCallback((seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  }, []);

  return {
    ...state,
    startTimer,
    stopTimer,
    pauseTimer,
    resumeTimer,
    syncWithBackend,
    formatTime,
  };
};
