// src/components/common/ErrorBoundary.js
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('🚨 ErrorBoundary caught an error:', error, errorInfo);
    this.setState({ errorInfo });
    
    // You could send this error to a logging service here
    // logErrorToService(error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <ErrorFallback 
          error={this.state.error}
          errorInfo={this.state.errorInfo}
          onRetry={this.handleRetry}
        />
      );
    }

    return this.props.children;
  }
}

const ErrorFallback = ({ error, errorInfo, onRetry }) => {
  const isDevelopment = __DEV__;
  
  return (
    <View style={styles.container}>
      <View style={styles.errorCard}>
        <Text style={styles.errorIcon}>⚠️</Text>
        <Text style={styles.errorTitle}>
          Oops! Something went wrong
        </Text>
        <Text style={styles.errorMessage}>
          {error?.message || 'An unexpected error occurred'}
        </Text>
        
        {isDevelopment && (
          <View style={styles.debugInfo}>
            <Text style={styles.debugTitle}>Debug Information:</Text>
            <Text style={styles.debugText}>
              {error?.stack || 'No stack trace available'}
            </Text>
          </View>
        )}
        
        <TouchableOpacity style={styles.retryButton} onPress={onRetry}>
          <Text style={styles.retryButtonText}>Try Again</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.reloadButton} 
          onPress={() => {
            // Force app reload in development
            if (isDevelopment && typeof global?.HermesInternal === 'undefined') {
              // This will only work in debug mode
              require('react-native').DevSettings?.reload?.();
            }
          }}
        >
          <Text style={styles.reloadButtonText}>Reload App</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#F5F5F5',
  },
  errorCard: {
    backgroundColor: '#FFFFFF',
    padding: 24,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    maxWidth: 350,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  errorIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 12,
    textAlign: 'center',
  },
  errorMessage: {
    fontSize: 16,
    color: '#666666',
    marginBottom: 24,
    textAlign: 'center',
    lineHeight: 22,
  },
  debugInfo: {
    width: '100%',
    marginBottom: 20,
    padding: 12,
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E9ECEF',
  },
  debugTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#495057',
    marginBottom: 8,
  },
  debugText: {
    fontSize: 12,
    color: '#6C757D',
    fontFamily: 'monospace',
    maxHeight: 100,
  },
  retryButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 12,
    minWidth: 120,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  reloadButton: {
    backgroundColor: 'transparent',
    paddingHorizontal: 24,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#007AFF',
    minWidth: 120,
  },
  reloadButtonText: {
    color: '#007AFF',
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
});

export default ErrorBoundary;