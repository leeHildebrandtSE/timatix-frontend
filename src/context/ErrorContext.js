// src/context/ErrorContext.js - CREATE THIS FILE
import React, { createContext, useContext, useState } from 'react';

const ErrorContext = createContext();

export const useError = () => {
  const context = useContext(ErrorContext);
  if (!context) {
    // Return a safe default if context is not available
    return {
      error: null,
      clearError: () => console.log('clearError called but no ErrorProvider'),
      showError: () => console.log('showError called but no ErrorProvider'),
      hasError: false
    };
  }
  return context;
};

export const ErrorProvider = ({ children }) => {
  const [error, setError] = useState(null);

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

  const value = {
    error,
    clearError,
    showError,
    hasError: !!error
  };

  return (
    <ErrorContext.Provider value={value}>
      {children}
    </ErrorContext.Provider>
  );
};