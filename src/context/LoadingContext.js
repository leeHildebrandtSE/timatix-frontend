// src/context/LoadingContext.js - Global loading state management
import React, { createContext, useContext, useState, useCallback } from 'react';
import LoadingSpinner from '../components/LoadingSpinner';

const LoadingContext = createContext();

export const useLoading = () => {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error('useLoading must be used within a LoadingProvider');
  }
  return context;
};

export const LoadingProvider = ({ children }) => {
  const [loadingStates, setLoadingStates] = useState({});
  const [globalLoading, setGlobalLoading] = useState(false);

  const setLoading = useCallback((key, isLoading) => {
    setLoadingStates(prev => ({
      ...prev,
      [key]: isLoading
    }));
  }, []);

  const isLoading = useCallback((key) => {
    return loadingStates[key] || false;
  }, [loadingStates]);

  const setGlobalLoadingState = useCallback((isLoading) => {
    setGlobalLoading(isLoading);
  }, []);

  const value = {
    setLoading,
    isLoading,
    setGlobalLoading: setGlobalLoadingState,
    globalLoading
  };

  return (
    <LoadingContext.Provider value={value}>
      {children}
      {globalLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <LoadingSpinner size="lg" />
        </div>
      )}
    </LoadingContext.Provider>
  );
};