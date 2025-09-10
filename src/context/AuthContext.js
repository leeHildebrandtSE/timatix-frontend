// src/context/AuthContext.js
import React, { createContext, useContext, useReducer, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ROLES } from '../constants/roles';

/**
 * @typedef {Object} User
 * @property {string} id - Unique user ID
 * @property {string} email - User's email address
 * @property {keyof typeof ROLES} role - User role (CLIENT | MECHANIC | ADMIN)
 * @property {string} firstName - User's first name
 * @property {string} lastName - User's last name
 * @property {string} phoneNumber - User's phone number
 * @property {string | null} profileImage - URL or base64 of profile picture
 * @property {string} createdAt - ISO timestamp of account creation
 */

/**
 * @typedef {Object} AuthState
 * @property {User | null} user
 * @property {boolean} isLoading
 * @property {boolean} isInitialized
 * @property {string | null} error
 */

/**
 * @typedef {Object} AuthContextType
 * @property {User | null} user
 * @property {boolean} isLoading
 * @property {boolean} isInitialized
 * @property {string | null} error
 * @property {boolean} isAuthenticated
 * @property {(credentials: {email: string, password: string}) => Promise<{user: User, token: string}>} login
 * @property {(userData: any) => Promise<any>} register
 * @property {() => Promise<void>} logout
 * @property {(userData: Partial<User>) => Promise<void>} updateUser
 * @property {() => void} clearError
 */

const AuthContext = createContext(/** @type {AuthContextType | null} */ (null));

const initialState = {
  /** @type {User | null} */
  user: null,
  isLoading: false,
  isInitialized: false,
  error: null,
};

/**
 * @param {AuthState} state
 * @param {{ type: string, payload?: any }} action
 * @returns {AuthState}
 */
const authReducer = (state, action) => {
  switch (action.type) {
    case 'INIT_START':
      return { ...state, isLoading: true, isInitialized: false };
    case 'INIT_SUCCESS':
      return { ...state, user: action.payload, isLoading: false, isInitialized: true, error: null };
    case 'LOGIN_START':
      return { ...state, isLoading: true, error: null };
    case 'LOGIN_SUCCESS':
      return { ...state, user: action.payload, isLoading: false, error: null };
    case 'REGISTER_START':
      return { ...state, isLoading: true, error: null };
    case 'REGISTER_SUCCESS':
      return { ...state, isLoading: false, error: null };
    case 'LOGIN_FAILURE':
    case 'REGISTER_FAILURE':
      return { ...state, isLoading: false, error: action.payload };
    case 'LOGOUT':
      return { ...state, user: null, isLoading: false, error: null };
    case 'UPDATE_USER':
      return { ...state, user: { ...state.user, ...action.payload } };
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    default:
      return state;
  }
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    try {
      dispatch({ type: 'INIT_START' });
      const [userData] = await Promise.all([
        getStoredUser(),
        new Promise(resolve => setTimeout(resolve, 2000)),
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

  /** @type {AuthContextType['login']} */
  const login = async (credentials) => {
    dispatch({ type: 'LOGIN_START' });
    await new Promise(resolve => setTimeout(resolve, 1500));
    const response = await simulateLogin(credentials);
    await AsyncStorage.setItem('timatix_user', JSON.stringify(response.user));
    await AsyncStorage.setItem('timatix_token', response.token);
    dispatch({ type: 'LOGIN_SUCCESS', payload: response.user });
    return response;
  };

  /** @type {AuthContextType['register']} */
  const register = async (userData) => {
    dispatch({ type: 'REGISTER_START' });
    await new Promise(resolve => setTimeout(resolve, 2000));
    const response = await simulateRegister(userData);
    dispatch({ type: 'REGISTER_SUCCESS' });
    return response;
  };

  /** @type {AuthContextType['logout']} */
  const logout = async () => {
    await AsyncStorage.multiRemove(['timatix_user', 'timatix_token']);
    dispatch({ type: 'LOGOUT' });
  };

  /** @type {AuthContextType['updateUser']} */
  const updateUser = async (userData) => {
    const updatedUser = { ...state.user, ...userData };
    dispatch({ type: 'UPDATE_USER', payload: userData });
    await AsyncStorage.setItem('timatix_user', JSON.stringify(updatedUser));
  };

  const clearError = () => dispatch({ type: 'CLEAR_ERROR' });

  // 🔑 Demo login using ROLES
  const simulateLogin = async (credentials) => {
    /** @type {Record<string, User>} */
    const mockUsers = {
      'client@demo.com': {
        id: 'client_1',
        email: 'client@demo.com',
        role: ROLES.CLIENT,
        firstName: 'John',
        lastName: 'Doe',
        phoneNumber: '+27 11 123 4567',
        profileImage: null,
        createdAt: '2024-01-15T10:00:00Z',
      },
      'mechanic@demo.com': {
        id: 'mechanic_1',
        email: 'mechanic@demo.com',
        role: ROLES.MECHANIC,
        firstName: 'Mike',
        lastName: 'Smith',
        phoneNumber: '+27 11 234 5678',
        profileImage: null,
        createdAt: '2023-08-20T14:30:00Z',
      },
      'admin@demo.com': {
        id: 'admin_1',
        email: 'admin@demo.com',
        role: ROLES.ADMIN,
        firstName: 'Admin',
        lastName: 'User',
        phoneNumber: '+27 11 345 6789',
        profileImage: null,
        createdAt: '2023-01-10T09:00:00Z',
      },
    };

    const user = mockUsers[credentials.email];
    if (!user) throw new Error('No account found with this email address');
    if (credentials.password !== 'demo123' && credentials.password !== 'admin123') {
      throw new Error('Incorrect password');
    }

    return { user, token: 'mock_jwt_token_' + user.id, message: 'Login successful' };
  };

  const simulateRegister = async (userData) => {
    const existingEmails = ['client@demo.com', 'mechanic@demo.com', 'admin@demo.com'];
    if (existingEmails.includes(userData.email)) {
      throw new Error('An account with this email already exists');
    }
    return { message: 'Account created successfully', userId: 'new_user_' + Date.now() };
  };

  /** @type {AuthContextType} */
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
    isAuthenticated: !!state.user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

/** @returns {AuthContextType} */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
