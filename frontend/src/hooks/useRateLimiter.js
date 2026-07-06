
import { useState, useCallback, useRef, useEffect } from 'react';

/**
 * Custom hook for client-side rate limiting with server synchronization
 */
const useRateLimiter = (options = {}) => {
  const {
    maxAttempts = 5,
    windowMs = 60000,
    onRateLimited = null,
  } = options;

  const [attempts, setAttempts] = useState(0);
  const [isRateLimited, setIsRateLimited] = useState(false);
  const [remainingAttempts, setRemainingAttempts] = useState(maxAttempts);
  const [resetTime, setResetTime] = useState(null);
  const [timeRemaining, setTimeRemaining] = useState(0);
  
  const attemptsRef = useRef([]);
  const timerRef = useRef(null);

  useEffect(() => {
    const stored = localStorage.getItem('rateLimiter_data');
    if (stored) {
      try {
        const data = JSON.parse(stored);
        const now = Date.now();
        const elapsed = now - data.timestamp;
        
        if (elapsed < data.windowMs) {
          setAttempts(data.attempts);
          setIsRateLimited(data.attempts >= maxAttempts);
          setRemainingAttempts(Math.max(0, maxAttempts - data.attempts));
          setResetTime(new Date(data.timestamp + data.windowMs));
          
          if (data.attempts >= maxAttempts) {
            const remaining = data.windowMs - elapsed;
            setTimeRemaining(Math.ceil(remaining / 1000));
            startCountdown(Math.ceil(remaining / 1000));
          }
        } else {
          resetLimiter();
        }
      } catch (e) {
        resetLimiter();
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  // =============================================
  // FIX: Sync with server rate limit headers
  // =============================================
  const syncWithServer = useCallback((response) => {
    const remaining = response.headers?.['x-ratelimit-remaining'];
    const reset = response.headers?.['retry-after'];
    const limit = response.headers?.['x-ratelimit-limit'];

    if (remaining !== undefined) {
      const remainingInt = parseInt(remaining, 10);
      setRemainingAttempts(Math.max(0, remainingInt));
      
      if (remainingInt === 0) {
        setIsRateLimited(true);
        if (reset) {
          const resetSeconds = parseInt(reset, 10);
          setTimeRemaining(resetSeconds);
          startCountdown(resetSeconds);
        }
      }
    }

    if (limit !== undefined) {
      const limitInt = parseInt(limit, 10);
    }
  }, []);

  const startCountdown = (seconds) => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    let remaining = seconds;
    setTimeRemaining(remaining);
    
    timerRef.current = setInterval(() => {
      remaining -= 1;
      setTimeRemaining(remaining);
      
      if (remaining <= 0) {
        clearInterval(timerRef.current);
        timerRef.current = null;
        resetLimiter();
      }
    }, 1000);
  };

  const resetLimiter = useCallback(() => {
    setAttempts(0);
    setIsRateLimited(false);
    setRemainingAttempts(maxAttempts);
    setResetTime(null);
    setTimeRemaining(0);
    
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    
    localStorage.removeItem('rateLimiter_data');
  }, [maxAttempts]);

  const recordAttempt = useCallback(() => {
    const now = Date.now();
    
    attemptsRef.current = attemptsRef.current.filter(
      time => now - time < windowMs
    );
    
    attemptsRef.current.push(now);
    const currentAttempts = attemptsRef.current.length;
    setAttempts(currentAttempts);
    
    const remaining = Math.max(0, maxAttempts - currentAttempts);
    setRemainingAttempts(remaining);
    
    if (currentAttempts >= maxAttempts) {
      setIsRateLimited(true);
      setResetTime(new Date(now + windowMs));
      setTimeRemaining(Math.ceil(windowMs / 1000));
      startCountdown(Math.ceil(windowMs / 1000));
      
      if (onRateLimited) {
        onRateLimited({
          message: `Rate limited. Please wait ${Math.ceil(windowMs / 1000)} seconds.`,
          retryAfter: Math.ceil(windowMs / 1000),
        });
      }
      
      return false;
    }
    
    return true;
  }, [maxAttempts, windowMs, onRateLimited]);

  const canMakeRequest = useCallback(() => {
    if (isRateLimited) {
      return false;
    }
    return attempts < maxAttempts;
  }, [isRateLimited, attempts, maxAttempts]);

  const getStatus = useCallback(() => {
    return {
      attempts,
      maxAttempts,
      remainingAttempts: Math.max(0, maxAttempts - attempts),
      isRateLimited,
      resetTime,
      timeRemaining,
    };
  }, [attempts, maxAttempts, isRateLimited, resetTime, timeRemaining]);

  const getFormattedTimeRemaining = useCallback(() => {
    if (timeRemaining <= 0) return '0s';
    
    const mins = Math.floor(timeRemaining / 60);
    const secs = timeRemaining % 60;
    
    if (mins > 0) {
      return `${mins}m ${secs}s`;
    }
    return `${secs}s`;
  }, [timeRemaining]);

  return {
    recordAttempt,
    canMakeRequest,
    resetLimiter,
    getStatus,
    getFormattedTimeRemaining,
    syncWithServer,
    attempts,
    remainingAttempts,
    isRateLimited,
    timeRemaining,
    resetTime,
  };
};

export default useRateLimiter;