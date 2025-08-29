// src/context/AuthContext.js - Updated with clearError function
import React, { createContext, useContext, useState, useEffect } from 'react';
import { storageService } from '../services/storage';
import { STORAGE_KEYS } from '../utils/constants';
import { API_CONFIG } from '../utils/constants';

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
  const [isLoading, setIsLoading] = useState(false); // For login/logout operations
  const [error, setError] = useState(null); // Add error state

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
      setLoading(true);
      
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
      setError('Failed to check authentication state');
    } finally {
      setLoading(false);
    }
  };

  const register = async (formData) => {
  try {
    setIsLoading(true);
    setError(null);

    const response = await fetch(`${API_CONFIG.BASE_URL}/users/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Registration failed");
    }

    const data = await response.json();
    console.log("✅ Registration success:", data);

    return data;
  } catch (error) {
    console.error("💥 Registration error:", error);
    setError(error.message);
    throw error;
  } finally {
    setIsLoading(false);
  }
};


  const clearError = () => {
    console.log('🧹 Clearing auth error');
    setError(null);
  };

  const setAuthError = (errorMessage) => {
    console.log('🚨 Setting auth error:', errorMessage);
    setError(errorMessage);
  };

  const login = async (credentials) => {
  try {
    console.log('🔐 Attempting login for:', credentials.email);
    setIsLoading(true);
    setError(null);

    const { email, password } = credentials;

    if (!email || !password) {
      throw new Error('Email and password are required');
    }

    // Call your backend login API
    const response = await fetch(`${API_CONFIG.BASE_URL}/users/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("❌ Login failed:", errorData);
      throw new Error(errorData.message || "Invalid credentials");
    }

    const data = await response.json();
    console.log("✅ Login response:", data);

    // Your backend should return { token, user } or similar
    const { token, user } = data;

    if (!token) {
      throw new Error("No token received from server");
    }

    // Save to state
    setUser(user);
    setToken(token);

    // Save to AsyncStorage
    await storageService.set(STORAGE_KEYS.USER_TOKEN, token);
    await storageService.set(STORAGE_KEYS.USER_DATA, user);

    console.log("✅ Authentication stored");
    return { success: true, user };
  } catch (error) {
    console.error("💥 Login error:", error);
    setError(error.message);
    throw error;
  } finally {
    setIsLoading(false);
  }
};


  // const login = async (credentials) => {
  //   try {
  //     console.log('🔐 Attempting login for:', credentials.email);
  //     setIsLoading(true);
  //     setError(null);
      
  //     const { email, password } = credentials;
      
  //     // Demo mode - accept any credentials
  //     if (email && password) {
  //       const demoToken = createDemoJWT();
  //       const demoUser = {
  //         id: 1,
  //         email: email,
  //         name: 'Demo User',
  //         role: 'USER'
  //       };

  //       console.log('🎭 Demo login successful:', {
  //         email: demoUser.email,
  //         tokenLength: demoToken.length,
  //         tokenPreview: demoToken.substring(0, 50) + '...'
  //       });

  //       // Store in state
  //       setUser(demoUser);
  //       setToken(demoToken);

  //       // Store in AsyncStorage
  //       await storageService.set(STORAGE_KEYS.USER_TOKEN, demoToken);
  //       await storageService.set(STORAGE_KEYS.USER_DATA, demoUser);

  //       console.log('✅ Demo authentication stored');
  //       return { success: true, user: demoUser };
  //     } else {
  //       throw new Error('Email and password are required');
  //     }
  //   } catch (error) {
  //     console.error('💥 Login error:', error);
  //     setError(error.message);
  //     throw error; // Re-throw so calling component can handle it
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  const logout = async () => {
    try {
      console.log('🚪 Logging out...');
      setIsLoading(true);
      setError(null);
      
      // Clear state
      setUser(null);
      setToken(null);

      // Clear storage
      await storageService.remove(STORAGE_KEYS.USER_TOKEN);
      await storageService.remove(STORAGE_KEYS.USER_DATA);

      console.log('✅ Logout successful');
    } catch (error) {
      console.error('💥 Logout error:', error);
      setError('Failed to logout');
    } finally {
      setIsLoading(false);
    }
  };

  const isAuthenticated = () => {
    return !!(user && token);
  };

  const value = {
  user,
  token,
  loading,
  isLoading,
  error,
  login,
  register,   // 👈 make it available
  logout,
  clearError,
  setError: setAuthError,
  isAuthenticated: isAuthenticated(),
  checkAuthState
};


  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};