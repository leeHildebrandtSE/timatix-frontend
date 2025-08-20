import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { authService } from '../services/auth';
import { storageService } from '../services/storage';
import { STORAGE_KEYS } from '../utils/constants';

// Initial state
const initialState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
};

// Action types
const AUTH_ACTIONS = {
  LOGIN_START: 'LOGIN_START',
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  LOGIN_FAILURE: 'LOGIN_FAILURE',
  LOGOUT: 'LOGOUT',
  REGISTER_START: 'REGISTER_START',
  REGISTER_SUCCESS: 'REGISTER_SUCCESS',
  REGISTER_FAILURE: 'REGISTER_FAILURE',
  RESTORE_SESSION: 'RESTORE_SESSION',
  SET_LOADING: 'SET_LOADING',
  CLEAR_ERROR: 'CLEAR_ERROR',
  UPDATE_USER: 'UPDATE_USER',
};

// Reducer
const authReducer = (state, action) => {
  switch (action.type) {
    case AUTH_ACTIONS.LOGIN_START:
    case AUTH_ACTIONS.REGISTER_START:
      return {
        ...state,
        isLoading: true,
        error: null,
      };

    case AUTH_ACTIONS.LOGIN_SUCCESS:
    case AUTH_ACTIONS.REGISTER_SUCCESS:
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      };

    case AUTH_ACTIONS.LOGIN_FAILURE:
    case AUTH_ACTIONS.REGISTER_FAILURE:
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: action.payload,
      };

    case AUTH_ACTIONS.LOGOUT:
      return {
        ...initialState,
        isLoading: false,
      };

    case AUTH_ACTIONS.RESTORE_SESSION:
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        isLoading: false,
      };

    case AUTH_ACTIONS.SET_LOADING:
      return {
        ...state,
        isLoading: action.payload,
      };

    case AUTH_ACTIONS.CLEAR_ERROR:
      return {
        ...state,
        error: null,
      };

    case AUTH_ACTIONS.UPDATE_USER:
      return {
        ...state,
        user: { ...state.user, ...action.payload },
      };

    default:
      return state;
  }
};

// Create context
const AuthContext = createContext();

// Auth provider component
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Restore session on app start
  useEffect(() => {
    restoreSession();
  }, []);

  const restoreSession = async () => {
    try {
      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: true });
      
      const token = await storageService.get(STORAGE_KEYS.USER_TOKEN);
      const userData = await storageService.get(STORAGE_KEYS.USER_DATA);
      
      if (token && userData) {
        // Validate token with server
        const isValid = await authService.validateToken(token);
        
        if (isValid) {
          dispatch({
            type: AUTH_ACTIONS.RESTORE_SESSION,
            payload: {
              user: userData,
              token: token,
            },
          });
        } else {
          // Clear invalid session
          await storageService.remove(STORAGE_KEYS.USER_TOKEN);
          await storageService.remove(STORAGE_KEYS.USER_DATA);
          dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
        }
      } else {
        dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
      }
    } catch (error) {
      console.error('Error restoring session:', error);
      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
    }
  };

  const login = async (credentials) => {
    try {
      dispatch({ type: AUTH_ACTIONS.LOGIN_START });
      
      const response = await authService.login(credentials);
      
      // Store token and user data
      await storageService.set(STORAGE_KEYS.USER_TOKEN, response.token);
      await storageService.set(STORAGE_KEYS.USER_DATA, response.user);
      
      dispatch({
        type: AUTH_ACTIONS.LOGIN_SUCCESS,
        payload: {
          user: response.user,
          token: response.token,
        },
      });
      
      return response;
    } catch (error) {
      dispatch({
        type: AUTH_ACTIONS.LOGIN_FAILURE,
        payload: error.message || 'Login failed',
      });
      throw error;
    }
  };

  const register = async (userData) => {
    try {
      dispatch({ type: AUTH_ACTIONS.REGISTER_START });
      
      const response = await authService.register(userData);
      
      // Store token and user data
      await storageService.set(STORAGE_KEYS.USER_TOKEN, response.token);
      await storageService.set(STORAGE_KEYS.USER_DATA, response.user);
      
      dispatch({
        type: AUTH_ACTIONS.REGISTER_SUCCESS,
        payload: {
          user: response.user,
          token: response.token,
        },
      });
      
      return response;
    } catch (error) {
      dispatch({
        type: AUTH_ACTIONS.REGISTER_FAILURE,
        payload: error.message || 'Registration failed',
      });
      throw error;
    }
  };

  const logout = async () => {
    try {
      // Call logout API if needed
      await authService.logout(state.token);
    } catch (error) {
      console.error('Logout API error:', error);
    } finally {
      // Always clear local storage and state
      await storageService.remove(STORAGE_KEYS.USER_TOKEN);
      await storageService.remove(STORAGE_KEYS.USER_DATA);
      dispatch({ type: AUTH_ACTIONS.LOGOUT });
    }
  };

  const updateUser = (userData) => {
    dispatch({
      type: AUTH_ACTIONS.UPDATE_USER,
      payload: userData,
    });
    
    // Update stored user data
    const updatedUser = { ...state.user, ...userData };
    storageService.set(STORAGE_KEYS.USER_DATA, updatedUser);
  };

  const clearError = () => {
    dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR });
  };

  const value = {
    // State
    ...state,
    
    // Actions
    login,
    register,
    logout,
    updateUser,
    clearError,
    restoreSession,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};

export default AuthContext;