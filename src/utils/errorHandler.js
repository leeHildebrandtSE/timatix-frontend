// src/utils/errorHandler.js - CREATE THIS FILE
// Safe error handling utility that doesn't depend on context

export const createSafeErrorHandler = () => {
  let currentError = null;

  return {
    clearError: () => {
      console.log('🧹 Safe clearError called');
      currentError = null;
    },
    showError: (error) => {
      console.log('🚨 Safe showError called:', error);
      currentError = error;
    },
    getError: () => currentError,
    hasError: () => !!currentError
  };
};

// Global error handler instance
export const globalErrorHandler = createSafeErrorHandler();

// Make clearError available globally to prevent crashes
if (typeof global !== 'undefined') {
  global.clearError = globalErrorHandler.clearError;
}