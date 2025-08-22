// Add this to your vehicles screen or create a debug component
// src/components/debug/AuthDebugger.js

import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { apiService } from '../../services/api';
import { storageService } from '../../services/storage';
import { STORAGE_KEYS } from '../../utils/constants';

const AuthDebugger = () => {
  const { user, token } = useAuth();
  const [debugResult, setDebugResult] = useState('');

  const runFullDebug = async () => {
    setDebugResult('Running authentication debug...\n\n');
    
    try {
      // 1. Check context state
      setDebugResult(prev => prev + '1️⃣ CONTEXT STATE:\n');
      setDebugResult(prev => prev + `User: ${user ? user.email : 'None'}\n`);
      setDebugResult(prev => prev + `Token: ${token ? 'Present' : 'None'}\n\n`);

      // 2. Check storage directly
      setDebugResult(prev => prev + '2️⃣ STORAGE CHECK:\n');
      const storedToken = await storageService.get(STORAGE_KEYS.USER_TOKEN);
      const storedUser = await storageService.get(STORAGE_KEYS.USER_DATA);
      
      setDebugResult(prev => prev + `Stored Token: ${storedToken ? 'Present' : 'None'}\n`);
      setDebugResult(prev => prev + `Stored User: ${storedUser ? 'Present' : 'None'}\n\n`);

      // 3. Test API service token retrieval
      setDebugResult(prev => prev + '3️⃣ API SERVICE TOKEN:\n');
      const apiToken = await apiService.getAuthToken();
      setDebugResult(prev => prev + `API Token: ${apiToken ? 'Retrieved' : 'None'}\n\n`);

      // 4. Test health endpoint
      setDebugResult(prev => prev + '4️⃣ HEALTH CHECK:\n');
      try {
        const healthResult = await apiService.healthCheck();
        setDebugResult(prev => prev + `Health: ${healthResult ? 'OK' : 'Failed'}\n\n`);
      } catch (healthError) {
        setDebugResult(prev => prev + `Health Error: ${healthError.message}\n\n`);
      }

      // 5. Test authenticated endpoint
      setDebugResult(prev => prev + '5️⃣ VEHICLES ENDPOINT:\n');
      try {
        const vehicles = await apiService.get('/vehicles');
        setDebugResult(prev => prev + `✅ Vehicles Success: ${vehicles ? 'Data received' : 'No data'}\n`);
        setDebugResult(prev => prev + `Count: ${Array.isArray(vehicles) ? vehicles.length : 'Not array'}\n\n`);
      } catch (vehicleError) {
        setDebugResult(prev => prev + `❌ Vehicles Error: ${vehicleError.message}\n`);
        setDebugResult(prev => prev + `Status: ${vehicleError.status || 'Unknown'}\n\n`);
      }

      setDebugResult(prev => prev + '🎯 DEBUG COMPLETE!\n');

    } catch (error) {
      setDebugResult(prev => prev + `💥 Debug failed: ${error.message}\n`);
    }
  };

  const testSpecificEndpoint = async (endpoint) => {
    setDebugResult(prev => prev + `\n🧪 Testing ${endpoint}...\n`);
    try {
      const result = await apiService.get(endpoint);
      setDebugResult(prev => prev + `✅ ${endpoint} Success\n`);
      setDebugResult(prev => prev + `Data: ${JSON.stringify(result).substring(0, 100)}...\n`);
    } catch (error) {
      setDebugResult(prev => prev + `❌ ${endpoint} Failed: ${error.message}\n`);
      setDebugResult(prev => prev + `Status: ${error.status || 'Unknown'}\n`);
    }
  };

  const clearStorage = async () => {
    try {
      await storageService.remove(STORAGE_KEYS.USER_TOKEN);
      await storageService.remove(STORAGE_KEYS.USER_DATA);
      setDebugResult(prev => prev + '\n🗑️ Storage cleared\n');
    } catch (error) {
      setDebugResult(prev => prev + `\n💥 Clear failed: ${error.message}\n`);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🔍 Auth Debugger</Text>
      
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={runFullDebug}>
          <Text style={styles.buttonText}>Run Full Debug</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.button} 
          onPress={() => testSpecificEndpoint('/vehicles')}
        >
          <Text style={styles.buttonText}>Test Vehicles</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.button} 
          onPress={() => testSpecificEndpoint('/actuator/health')}
        >
          <Text style={styles.buttonText}>Test Health</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.button, styles.dangerButton]} 
          onPress={clearStorage}
        >
          <Text style={styles.buttonText}>Clear Storage</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.resultContainer}>
        <Text style={styles.resultText}>{debugResult}</Text>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    margin: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 15,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 10,
    borderRadius: 6,
    flex: 1,
    minWidth: '45%',
  },
  dangerButton: {
    backgroundColor: '#FF3B30',
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 12,
    fontWeight: '600',
  },
  resultContainer: {
    backgroundColor: '#2c2c2c',
    padding: 10,
    borderRadius: 6,
    maxHeight: 300,
  },
  resultText: {
    color: '#fff',
    fontSize: 12,
    fontFamily: 'monospace',
  },
});

export default AuthDebugger;