import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { useAuth } from './AuthContext';

// Initial state
const initialState = {
  vehicles: [],
  serviceRequests: [],
  quotes: [],
  notifications: [],
  isLoading: false,
  error: null,
  lastUpdated: null,
};

// Action types
const APP_ACTIONS = {
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  CLEAR_ERROR: 'CLEAR_ERROR',
  
  // Vehicles
  SET_VEHICLES: 'SET_VEHICLES',
  ADD_VEHICLE: 'ADD_VEHICLE',
  UPDATE_VEHICLE: 'UPDATE_VEHICLE',
  DELETE_VEHICLE: 'DELETE_VEHICLE',
  
  // Service Requests
  SET_SERVICE_REQUESTS: 'SET_SERVICE_REQUESTS',
  ADD_SERVICE_REQUEST: 'ADD_SERVICE_REQUEST',
  UPDATE_SERVICE_REQUEST: 'UPDATE_SERVICE_REQUEST',
  DELETE_SERVICE_REQUEST: 'DELETE_SERVICE_REQUEST',
  
  // Quotes
  SET_QUOTES: 'SET_QUOTES',
  ADD_QUOTE: 'ADD_QUOTE',
  UPDATE_QUOTE: 'UPDATE_QUOTE',
  
  // Notifications
  SET_NOTIFICATIONS: 'SET_NOTIFICATIONS',
  ADD_NOTIFICATION: 'ADD_NOTIFICATION',
  MARK_NOTIFICATION_READ: 'MARK_NOTIFICATION_READ',
  CLEAR_NOTIFICATIONS: 'CLEAR_NOTIFICATIONS',
  
  // General
  SET_LAST_UPDATED: 'SET_LAST_UPDATED',
  RESET_STATE: 'RESET_STATE',
};

// Reducer
const appReducer = (state, action) => {
  switch (action.type) {
    case APP_ACTIONS.SET_LOADING:
      return {
        ...state,
        isLoading: action.payload,
      };

    case APP_ACTIONS.SET_ERROR:
      return {
        ...state,
        error: action.payload,
        isLoading: false,
      };

    case APP_ACTIONS.CLEAR_ERROR:
      return {
        ...state,
        error: null,
      };

    // Vehicles
    case APP_ACTIONS.SET_VEHICLES:
      return {
        ...state,
        vehicles: action.payload,
        lastUpdated: new Date().toISOString(),
      };

    case APP_ACTIONS.ADD_VEHICLE:
      return {
        ...state,
        vehicles: [...state.vehicles, action.payload],
      };

    case APP_ACTIONS.UPDATE_VEHICLE:
      return {
        ...state,
        vehicles: state.vehicles.map(vehicle =>
          vehicle.id === action.payload.id ? action.payload : vehicle
        ),
      };

    case APP_ACTIONS.DELETE_VEHICLE:
      return {
        ...state,
        vehicles: state.vehicles.filter(vehicle => vehicle.id !== action.payload),
      };

    // Service Requests
    case APP_ACTIONS.SET_SERVICE_REQUESTS:
      return {
        ...state,
        serviceRequests: action.payload,
        lastUpdated: new Date().toISOString(),
      };

    case APP_ACTIONS.ADD_SERVICE_REQUEST:
      return {
        ...state,
        serviceRequests: [...state.serviceRequests, action.payload],
      };

    case APP_ACTIONS.UPDATE_SERVICE_REQUEST:
      return {
        ...state,
        serviceRequests: state.serviceRequests.map(request =>
          request.id === action.payload.id ? action.payload : request
        ),
      };

    case APP_ACTIONS.DELETE_SERVICE_REQUEST:
      return {
        ...state,
        serviceRequests: state.serviceRequests.filter(request => request.id !== action.payload),
      };

    // Quotes
    case APP_ACTIONS.SET_QUOTES:
      return {
        ...state,
        quotes: action.payload,
      };

    case APP_ACTIONS.ADD_QUOTE:
      return {
        ...state,
        quotes: [...state.quotes, action.payload],
      };

    case APP_ACTIONS.UPDATE_QUOTE:
      return {
        ...state,
        quotes: state.quotes.map(quote =>
          quote.id === action.payload.id ? action.payload : quote
        ),
      };

    // Notifications
    case APP_ACTIONS.SET_NOTIFICATIONS:
      return {
        ...state,
        notifications: action.payload,
      };

    case APP_ACTIONS.ADD_NOTIFICATION:
      return {
        ...state,
        notifications: [action.payload, ...state.notifications],
      };

    case APP_ACTIONS.MARK_NOTIFICATION_READ:
      return {
        ...state,
        notifications: state.notifications.map(notification =>
          notification.id === action.payload ? { ...notification, read: true } : notification
        ),
      };

    case APP_ACTIONS.CLEAR_NOTIFICATIONS:
      return {
        ...state,
        notifications: [],
      };

    case APP_ACTIONS.SET_LAST_UPDATED:
      return {
        ...state,
        lastUpdated: action.payload,
      };

    case APP_ACTIONS.RESET_STATE:
      return initialState;

    default:
      return state;
  }
};

// Create context
const AppContext = createContext();

// App provider component
export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);
  const { isAuthenticated, user } = useAuth();

  // Reset state when user logs out
  useEffect(() => {
    if (!isAuthenticated) {
      dispatch({ type: APP_ACTIONS.RESET_STATE });
    }
  }, [isAuthenticated]);

  // Generic action creators
  const setLoading = (loading) => {
    dispatch({ type: APP_ACTIONS.SET_LOADING, payload: loading });
  };

  const setError = (error) => {
    dispatch({ type: APP_ACTIONS.SET_ERROR, payload: error });
  };

  const clearError = () => {
    dispatch({ type: APP_ACTIONS.CLEAR_ERROR });
  };

  // Vehicle actions
  const setVehicles = (vehicles) => {
    dispatch({ type: APP_ACTIONS.SET_VEHICLES, payload: vehicles });
  };

  const addVehicle = (vehicle) => {
    dispatch({ type: APP_ACTIONS.ADD_VEHICLE, payload: vehicle });
  };

  const updateVehicle = (vehicle) => {
    dispatch({ type: APP_ACTIONS.UPDATE_VEHICLE, payload: vehicle });
  };

  const deleteVehicle = (vehicleId) => {
    dispatch({ type: APP_ACTIONS.DELETE_VEHICLE, payload: vehicleId });
  };

  // Service request actions
  const setServiceRequests = (requests) => {
    dispatch({ type: APP_ACTIONS.SET_SERVICE_REQUESTS, payload: requests });
  };

  const addServiceRequest = (request) => {
    dispatch({ type: APP_ACTIONS.ADD_SERVICE_REQUEST, payload: request });
  };

  const updateServiceRequest = (request) => {
    dispatch({ type: APP_ACTIONS.UPDATE_SERVICE_REQUEST, payload: request });
  };

  const deleteServiceRequest = (requestId) => {
    dispatch({ type: APP_ACTIONS.DELETE_SERVICE_REQUEST, payload: requestId });
  };

  // Quote actions
  const setQuotes = (quotes) => {
    dispatch({ type: APP_ACTIONS.SET_QUOTES, payload: quotes });
  };

  const addQuote = (quote) => {
    dispatch({ type: APP_ACTIONS.ADD_QUOTE, payload: quote });
  };

  const updateQuote = (quote) => {
    dispatch({ type: APP_ACTIONS.UPDATE_QUOTE, payload: quote });
  };

  // Notification actions
  const setNotifications = (notifications) => {
    dispatch({ type: APP_ACTIONS.SET_NOTIFICATIONS, payload: notifications });
  };

  const addNotification = (notification) => {
    const notificationWithId = {
      ...notification,
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      read: false,
    };
    dispatch({ type: APP_ACTIONS.ADD_NOTIFICATION, payload: notificationWithId });
  };

  const markNotificationRead = (notificationId) => {
    dispatch({ type: APP_ACTIONS.MARK_NOTIFICATION_READ, payload: notificationId });
  };

  const clearNotifications = () => {
    dispatch({ type: APP_ACTIONS.CLEAR_NOTIFICATIONS });
  };

  // Helper functions
  const getVehicleById = (vehicleId) => {
    return state.vehicles.find(vehicle => vehicle.id === vehicleId);
  };

  const getServiceRequestById = (requestId) => {
    return state.serviceRequests.find(request => request.id === requestId);
  };

  const getUnreadNotificationCount = () => {
    return state.notifications.filter(notification => !notification.read).length;
  };

  const value = {
    // State
    ...state,
    
    // Generic actions
    setLoading,
    setError,
    clearError,
    
    // Vehicle actions
    setVehicles,
    addVehicle,
    updateVehicle,
    deleteVehicle,
    
    // Service request actions
    setServiceRequests,
    addServiceRequest,
    updateServiceRequest,
    deleteServiceRequest,
    
    // Quote actions
    setQuotes,
    addQuote,
    updateQuote,
    
    // Notification actions
    setNotifications,
    addNotification,
    markNotificationRead,
    clearNotifications,
    
    // Helper functions
    getVehicleById,
    getServiceRequestById,
    getUnreadNotificationCount,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

// Custom hook to use app context
export const useApp = () => {
  const context = useContext(AppContext);
  
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  
  return context;
};

export default AppContext;