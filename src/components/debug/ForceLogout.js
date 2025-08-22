// src/components/debug/ForceLogout.js - CREATE THIS FILE
import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Alert } from 'react-native';
import { useAuth } from '../../context/AuthContext';

const ForceLogout = () => {
  const { logout, token, user } = useAuth();

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
            console.log('🗑️ Force logout initiated...');
            await logout();
            console.log('✅ Force logout completed - old token cleared');
          }
        }
      ]
    );
  };

  const checkCurrentToken = () => {
    console.log('🔍 Current authentication info:', {
      hasToken: !!token,
      hasUser: !!user,
      tokenLength: token?.length || 0,
      isOldFormat: token && token.length < 100, // Old demo token was 25 chars
      tokenPreview: token ? token.substring(0, 50) + '...' : 'None',
      userEmail: user?.email || 'None',
      userRole: user?.role || 'None'
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🔧 Auth Debug Tool</Text>
      
      <TouchableOpacity style={styles.button} onPress={checkCurrentToken}>
        <Text style={styles.buttonText}>Check Current Token</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={[styles.button, styles.logoutButton]} onPress={handleForceLogout}>
        <Text style={styles.buttonText}>Force Logout & Clear</Text>
      </TouchableOpacity>
      
      <View style={styles.info}>
        <Text style={styles.infoText}>
          Token Length: {token?.length || 0} chars
        </Text>
        <Text style={styles.infoText}>
          Format: {token && token.length > 100 ? 'JWT ✅' : 'Old Demo ❌'}
        </Text>
        <Text style={styles.infoText}>
          User: {user?.email || 'None'}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f0f0f0',
    margin: 10,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#ddd',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 15,
    color: '#333',
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
  info: {
    marginTop: 15,
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 6,
  },
  infoText: {
    fontSize: 12,
    color: '#666',
    marginVertical: 2,
  },
});

export default ForceLogout;