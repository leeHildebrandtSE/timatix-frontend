// Add this temporarily to your App.js or create a debug component
// src/components/debug/ForceLogout.js

import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Alert } from 'react-native';
import { useAuth } from '../../context/AuthContext';

const ForceLogout = () => {
  const { logout, token } = useAuth();

  const handleForceLogout = async () => {
    Alert.alert(
      'Clear Authentication',
      'This will clear all stored authentication data and force a fresh login with the new JWT format.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Clear & Logout', 
          style: 'destructive',
          onPress: async () => {
            await logout();
            console.log('🗑️ Forced logout completed - old token cleared');
          }
        }
      ]
    );
  };

  const checkCurrentToken = () => {
    console.log('🔍 Current token info:', {
      hasToken: !!token,
      tokenLength: token?.length || 0,
      isOldFormat: token && token.length < 100, // Old demo token was 25 chars
      tokenPreview: token ? token.substring(0, 50) + '...' : 'None'
    });
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={checkCurrentToken}>
        <Text style={styles.buttonText}>Check Current Token</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={[styles.button, styles.logoutButton]} onPress={handleForceLogout}>
        <Text style={styles.buttonText}>Force Logout & Clear</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f0f0f0',
    margin: 10,
    borderRadius: 8,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 6,
    marginVertical: 5,
  },
  logoutButton: {
    backgroundColor: '#FF3B30',
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: '600',
  },
});

export default ForceLogout;