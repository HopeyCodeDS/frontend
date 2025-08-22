import { useState, useEffect, useRef } from 'react';

interface PollingOptions {
  interval: number;        // Polling interval in milliseconds
  enabled: boolean;        // Whether polling is enabled
  immediate: boolean;      // Whether to fetch immediately on mount
  retryCount?: number;     // Number of retries on failure
  retryDelay?: number;     // Delay between retries
}

interface PollingState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  lastUpdated: Date | null;
  isPolling: boolean;
}

export function usePollingData<T>(
  fetchFunction: () => Promise<T | null>,
  options: PollingOptions
): PollingState<T> & { 
  refetch: () => Promise<void>;
  stopPolling: () => void;
  startPolling: () => void;
} {
  const [state, setState] = useState<PollingState<T>>({
    data: null,
    loading: false,
    error: null,
    lastUpdated: null,
    isPolling: options.enabled
  });

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const retryCountRef = useRef(0);
  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchData = async (isRetry = false) => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();

    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      
      const data = await fetchFunction();
      
      if (data !== null) {
        setState(prev => ({
          ...prev,
          data,
          loading: false,
          lastUpdated: new Date(),
          error: null
        }));
        retryCountRef.current = 0; // Reset retry count on success
      } else {
        // API failed, use fallback data
        throw new Error('API call failed, using fallback data');
      }
    } catch (error) {
      console.error('Data fetching error:', error);
      
      if (isRetry && retryCountRef.current < (options.retryCount || 3)) {
        retryCountRef.current++;
        setTimeout(() => fetchData(true), options.retryDelay || 5000);
        return;
      }

      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }));
    }
  };

  const startPolling = () => {
    if (intervalRef.current) return;
    
    setState(prev => ({ ...prev, isPolling: true }));
    intervalRef.current = setInterval(fetchData, options.interval);
  };

  const stopPolling = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setState(prev => ({ ...prev, isPolling: false }));
  };

  const refetch = async () => {
    await fetchData();
  };

  useEffect(() => {
    if (options.immediate) {
      fetchData();
    }

    if (options.enabled) {
      startPolling();
    }

    return () => {
      stopPolling();
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [options.enabled, options.interval]);

  return {
    ...state,
    refetch,
    stopPolling,
    startPolling
  };
}
