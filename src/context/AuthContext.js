// src/context/AuthContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import { storageService } from '../services/storage';
import { STORAGE_KEYS } from '../utils/constants';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Generate a properly formatted JWT demo token
  const createDemoJWT = () => {
    // Demo JWT header (base64 encoded)
    const header = btoa(JSON.stringify({
      "alg": "HS256",
      "typ": "JWT"
    }));

    // Demo JWT payload (base64 encoded)
    const payload = btoa(JSON.stringify({
      "sub": "demo@example.com",
      "email": "demo@example.com",
      "role": "USER",
      "iat": Math.floor(Date.now() / 1000),
      "exp": Math.floor(Date.now() / 1000) + (24 * 60 * 60) // 24 hours
    }));

    // Demo signature (this won't be validated by backend in demo mode)
    const signature = btoa("demo-signature-not-validated");

    return `${header}.${payload}.${signature}`;
  };

  useEffect(() => {
    checkAuthState();
  }, []);

  const checkAuthState = async () => {
    try {
      console.log('🔍 Checking authentication state...');
      
      const storedToken = await storageService.get(STORAGE_KEYS.USER_TOKEN);
      const storedUser = await storageService.get(STORAGE_KEYS.USER_DATA);
      
      console.log('📦 Storage check:', {
        hasToken: !!storedToken,
        hasUser: !!storedUser,
        tokenType: storedToken ? 'stored' : 'none'
      });

      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(storedUser);
        console.log('✅ Restored authentication from storage');
      } else {
        console.log('❌ No valid authentication found');
      }
    } catch (error) {
      console.error('💥 Error checking auth state:', error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      console.log('🔐 Attempting login for:', email);
      
      // Demo mode - accept any credentials
      if (email && password) {
        const demoToken = createDemoJWT();
        const demoUser = {
          id: 1,
          email: email,
          name: 'Demo User',
          role: 'USER'
        };

        console.log('🎭 Demo login successful:', {
          email: demoUser.email,
          tokenLength: demoToken.length,
          tokenPreview: demoToken.substring(0, 50) + '...'
        });

        // Store in state
        setUser(demoUser);
        setToken(demoToken);

        // Store in AsyncStorage
        await storageService.set(STORAGE_KEYS.USER_TOKEN, demoToken);
        await storageService.set(STORAGE_KEYS.USER_DATA, demoUser);

        console.log('✅ Demo authentication stored');
        return { success: true, user: demoUser };
      } else {
        throw new Error('Email and password are required');
      }
    } catch (error) {
      console.error('💥 Login error:', error);
      return { success: false, error: error.message };
    }
  };

  const logout = async () => {
    try {
      console.log('🚪 Logging out...');
      
      // Clear state
      setUser(null);
      setToken(null);

      // Clear storage
      await storageService.remove(STORAGE_KEYS.USER_TOKEN);
      await storageService.remove(STORAGE_KEYS.USER_DATA);

      console.log('✅ Logout successful');
    } catch (error) {
      console.error('💥 Logout error:', error);
    }
  };

  const isAuthenticated = () => {
    return !!(user && token);
  };

  const value = {
    user,
    token,
    loading,
    login,
    logout,
    isAuthenticated: isAuthenticated(),
    checkAuthState
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};