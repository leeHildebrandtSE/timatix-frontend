// src/context/ErrorContext.js - Create this file if it doesn't exist
import React, { createContext, useContext, useState } from 'react';

const ErrorContext = createContext();

export const useError = () => {
  const context = useContext(ErrorContext);
  if (!context) {
    throw new Error('useError must be used within an ErrorProvider');
  }
  return context;
};

export const ErrorProvider = ({ children }) => {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const clearError = () => {
    console.log('🧹 Clearing error');
    setError(null);
  };

  const showError = (errorMessage, details = null) => {
    console.log('🚨 Showing error:', errorMessage);
    setError({
      message: errorMessage,
      details: details,
      timestamp: new Date().toISOString()
    });
  };

  const setLoadingState = (isLoading) => {
    setLoading(isLoading);
  };

  const value = {
    error,
    loading,
    clearError,        // This function was missing!
    showError,
    setLoadingState,
    hasError: !!error
  };

  return (
    <ErrorContext.Provider value={value}>
      {children}
    </ErrorContext.Provider>
  );
};