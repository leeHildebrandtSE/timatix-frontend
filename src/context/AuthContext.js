// src/context/AuthContext.js - Enhanced with Splash Screen Support
import React, { createContext, useContext, useReducer, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AuthContext = createContext();

const initialState = {
  user: null,
  isLoading: false,
  isInitialized: false, // Track if initial auth check is complete
  error: null,
};

const authReducer = (state, action) => {
  switch (action.type) {
    case 'INIT_START':
      return {
        ...state,
        isLoading: true,
        isInitialized: false,
      };
    case 'INIT_SUCCESS':
      return {
        ...state,
        user: action.payload,
        isLoading: false,
        isInitialized: true,
        error: null,
      };
    case 'LOGIN_START':
      return {
        ...state,
        isLoading: true,
        error: null,
      };
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        user: action.payload,
        isLoading: false,
        error: null,
      };
    case 'REGISTER_START':
      return {
        ...state,
        isLoading: true,
        error: null,
      };
    case 'REGISTER_SUCCESS':
      return {
        ...state,
        isLoading: false,
        error: null,
      };
    case 'LOGIN_FAILURE':
    case 'REGISTER_FAILURE':
      return {
        ...state,
        isLoading: false,
        error: action.payload,
      };
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        isLoading: false,
        error: null,
      };
    case 'UPDATE_USER':
      return {
        ...state,
        user: { ...state.user, ...action.payload },
      };
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null,
      };
    default:
      return state;
  }
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Initialize auth state on app start
  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    try {
      dispatch({ type: 'INIT_START' });
      
      // Add minimum delay for splash screen experience
      const [userData] = await Promise.all([
        getStoredUser(),
        new Promise(resolve => setTimeout(resolve, 2000)) // Minimum 2 seconds for splash
      ]);
      
      dispatch({ type: 'INIT_SUCCESS', payload: userData });
    } catch (error) {
      console.error('Auth initialization error:', error);
      dispatch({ type: 'INIT_SUCCESS', payload: null });
    }
  };

  const getStoredUser = async () => {
    try {
      const userData = await AsyncStorage.getItem('timatix_user');
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('Error getting stored user:', error);
      return null;
    }
  };

  const login = async (credentials) => {
    try {
      dispatch({ type: 'LOGIN_START' });
      
      // Simulate API call with realistic delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const response = await simulateLogin(credentials);
      
      // Store user data securely
      await AsyncStorage.setItem('timatix_user', JSON.stringify(response.user));
      await AsyncStorage.setItem('timatix_token', response.token);
      
      dispatch({ type: 'LOGIN_SUCCESS', payload: response.user });
      return response;
    } catch (error) {
      dispatch({ type: 'LOGIN_FAILURE', payload: error.message });
      throw error;
    }
  };

  const register = async (userData) => {
    try {
      dispatch({ type: 'REGISTER_START' });
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const response = await simulateRegister(userData);
      
      dispatch({ type: 'REGISTER_SUCCESS' });
      return response;
    } catch (error) {
      dispatch({ type: 'REGISTER_FAILURE', payload: error.message });
      throw error;
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.multiRemove(['timatix_user', 'timatix_token']);
      dispatch({ type: 'LOGOUT' });
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const updateUser = async (userData) => {
    try {
      const updatedUser = { ...state.user, ...userData };
      dispatch({ type: 'UPDATE_USER', payload: userData });
      
      // Update stored data
      await AsyncStorage.setItem('timatix_user', JSON.stringify(updatedUser));
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  // Enhanced mock login with demo accounts
  const simulateLogin = async (credentials) => {
    const mockUsers = {
      'client@demo.com': {
        id: 'client_1',
        email: 'client@demo.com',
        role: 'CLIENT',
        firstName: 'John',
        lastName: 'Doe',
        phoneNumber: '+27 11 123 4567',
        profileImage: null,
        createdAt: '2024-01-15T10:00:00Z',
      },
      'mechanic@demo.com': {
        id: 'mechanic_1',
        email: 'mechanic@demo.com',
        role: 'MECHANIC',
        firstName: 'Mike',
        lastName: 'Smith',
        phoneNumber: '+27 11 234 5678',
        profileImage: null,
        createdAt: '2023-08-20T14:30:00Z',
      },
      'admin@demo.com': {
        id: 'admin_1',
        email: 'admin@demo.com',
        role: 'ADMIN',
        firstName: 'Sarah',
        lastName: 'Johnson',
        phoneNumber: '+27 11 345 6789',
        profileImage: null,
        createdAt: '2023-01-10T09:00:00Z',
      },
    };
    
    const user = mockUsers[credentials.email];
    
    if (!user) {
      throw new Error('No account found with this email address');
    }
    
    if (credentials.password !== 'demo123' && credentials.password !== 'admin123') {
      throw new Error('Incorrect password');
    }
    
    return { 
      user, 
      token: 'mock_jwt_token_' + user.id,
      message: 'Login successful'
    };
  };

  const simulateRegister = async (userData) => {
    // Check if email already exists
    const existingEmails = ['client@demo.com', 'mechanic@demo.com', 'admin@demo.com'];
    
    if (existingEmails.includes(userData.email)) {
      throw new Error('An account with this email already exists');
    }
    
    // Simulate successful registration
    return {
      message: 'Account created successfully',
      userId: 'new_user_' + Date.now(),
    };
  };

  const value = {
    user: state.user,
    isLoading: state.isLoading,
    isInitialized: state.isInitialized,
    error: state.error,
    login,
    register,
    logout,
    updateUser,
    clearError,
    
    // Computed values
    isAuthenticated: !!state.user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};