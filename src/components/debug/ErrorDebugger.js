// src/components/debug/ErrorDebugger.js - CREATE THIS FILE
import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';

// Test all your contexts
import { useError } from '../../context/ErrorContext';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';

const ErrorDebugger = () => {
  // Test each context
  const errorContext = useError();
  const authContext = useAuth();
  const appContext = useApp();

  useEffect(() => {
    console.log('🔍 Context Debug Results:');
    console.log('ErrorContext:', {
      exists: !!errorContext,
      hasClearError: typeof errorContext?.clearError === 'function',
      methods: Object.keys(errorContext || {})
    });
    console.log('AuthContext:', {
      exists: !!authContext,
      hasUser: !!authContext?.user,
      hasToken: !!authContext?.token
    });
    console.log('AppContext:', {
      exists: !!appContext,
      hasClearError: typeof appContext?.clearError === 'function',
      methods: Object.keys(appContext || {}).slice(0, 10) // First 10 methods
    });

    // Test calling clearError from different contexts
    try {
      if (errorContext?.clearError) {
        console.log('✅ ErrorContext clearError available');
      } else {
        console.log('❌ ErrorContext clearError NOT available');
      }

      if (appContext?.clearError) {
        console.log('✅ AppContext clearError available');
      } else {
        console.log('❌ AppContext clearError NOT available');
      }
    } catch (error) {
      console.log('💥 Error testing clearError:', error.message);
    }
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🔍 Context Debugger</Text>
      <Text style={styles.text}>
        ErrorContext: {errorContext ? '✅' : '❌'}
      </Text>
      <Text style={styles.text}>
        AuthContext: {authContext ? '✅' : '❌'}
      </Text>
      <Text style={styles.text}>
        AppContext: {appContext ? '✅' : '❌'}
      </Text>
      <Text style={styles.text}>
        clearError (Error): {typeof errorContext?.clearError === 'function' ? '✅' : '❌'}
      </Text>
      <Text style={styles.text}>
        clearError (App): {typeof appContext?.clearError === 'function' ? '✅' : '❌'}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#e8f4fd',
    margin: 10,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#007AFF',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    color: '#007AFF',
  },
  text: {
    fontSize: 14,
    marginVertical: 2,
    color: '#333',
  },
});

export default ErrorDebugger;