// src/context/AppContext.js - Enhanced version with better error handling
import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { SERVICE_STATUS } from '../utils/constants';

// Your existing initialState and mock data generators remain the same...
const initialState = {
  vehicles: [],
  serviceRequests: [],
  users: [],
  quotes: [],
  notifications: [],
  isLoading: false,
  error: null,
  lastUpdated: null,
  initialized: false,
};

// All your existing mock data generators (keeping them as-is)
const generateMockVehicles = (userId) => [
  {
    id: '1',
    make: 'Toyota',
    model: 'Corolla',
    year: 2020,
    color: 'White',
    licensePlate: 'CA 123 GP',
    vin: '1HGBH41JXMN109186',
    mileage: 45000,
    lastServiceDate: '2024-01-15',
    userId: userId,
    createdAt: '2023-01-15T10:00:00Z',
  },
  {
    id: '2',
    make: 'BMW',
    model: 'X3',
    year: 2019,
    color: 'Black',
    licensePlate: 'CA 456 GP',
    vin: '5UXWX9C54F0C26583',
    mileage: 32000,
    lastServiceDate: '2023-12-10',
    userId: userId,
    createdAt: '2023-01-10T14:00:00Z',
  },
];

const generateMockServiceRequests = (userId, userRole) => {
  const baseRequests = [
    {
      id: '1',
      serviceType: 'Oil Change',
      selectedService: 'Oil Change',
      status: SERVICE_STATUS.PENDING_QUOTE,
      preferredDate: '2025-01-25',
      preferredTime: '10:00',
      urgency: 'NORMAL',
      description: 'Regular maintenance due - oil change needed',
      notes: 'Please use synthetic oil',
      location: 'WORKSHOP',
      contactPhone: '+27 11 123 4567',
      vehicle: {
        id: '1',
        make: 'Toyota',
        model: 'Corolla',
        year: 2020,
        licensePlate: 'CA 123 GP',
      },
      client: {
        id: userId,
        name: 'John Doe',
        phone: '+27 11 123 4567',
        email: 'john.doe@email.com',
      },
      createdAt: '2025-01-20T10:00:00Z',
      userId: userRole === 'CLIENT' ? userId : 'demo_client',
    },
    {
      id: '2',
      serviceType: 'Brake Service',
      selectedService: 'Brake Service',
      status: SERVICE_STATUS.QUOTE_SENT,
      preferredDate: '2025-01-28',
      preferredTime: '14:00',
      urgency: 'HIGH',
      description: 'Brake pads feel worn and making noise',
      notes: 'Customer reports squeaking sounds',
      location: 'WORKSHOP',
      contactPhone: '+27 11 234 5678',
      vehicle: {
        id: '2',
        make: 'BMW',
        model: 'X3',
        year: 2019,
        licensePlate: 'CA 456 GP',
      },
      client: {
        id: userRole === 'CLIENT' ? userId : 'demo_client_2',
        name: 'Jane Smith',
        phone: '+27 11 234 5678',
        email: 'jane.smith@email.com',
      },
      quote: {
        id: 'q1',
        laborHours: 2,
        laborRate: 450,
        laborTotal: 900,
        parts: [
          { description: 'Brake Pads (Front)', quantity: 1, unitPrice: 350, total: 350 },
          { description: 'Brake Fluid', quantity: 1, unitPrice: 80, total: 80 },
        ],
        partsTotal: 430,
        miscCharges: 50,
        subtotal: 1380,
        discount: 30,
        vatAmount: 202.5,
        totalAmount: 1552.5,
        notes: 'Premium brake pads recommended for this vehicle',
        createdAt: '2025-01-22T10:00:00Z',
        expiresAt: '2025-02-05T10:00:00Z',
        status: 'SENT',
      },
      assignedMechanic: {
        id: userRole === 'MECHANIC' ? userId : 'demo_mechanic',
        name: 'Mike Smith',
        phone: '+27 11 345 6789',
      },
      createdAt: '2025-01-18T14:30:00Z',
      userId: userRole === 'CLIENT' ? userId : 'demo_client_2',
    },
  ];

  if (userRole === 'CLIENT') {
    return baseRequests.filter(req => req.userId === userId);
  } else if (userRole === 'MECHANIC') {
    return baseRequests.filter(req => req.assignedMechanic?.id === userId);
  }
  
  return baseRequests;
};

const generateMockUsers = () => [
  {
    id: 'demo_client',
    email: 'john.doe@email.com',
    firstName: 'John',
    lastName: 'Doe',
    role: 'CLIENT',
    phoneNumber: '+27 11 123 4567',
    createdAt: '2023-01-15T10:00:00Z',
    isActive: true,
  },
  {
    id: 'demo_mechanic',
    email: 'mike@timatix.com',
    firstName: 'Mike',
    lastName: 'Smith',
    role: 'MECHANIC',
    phoneNumber: '+27 11 345 6789',
    createdAt: '2023-01-10T08:00:00Z',
    isActive: true,
  },
  {
    id: 'demo_admin',
    email: 'admin@timatix.com',
    firstName: 'Admin',
    lastName: 'User',
    role: 'ADMIN',
    phoneNumber: '+27 11 456 7890',
    createdAt: '2023-01-01T12:00:00Z',
    isActive: true,
  },
];

const generateMockNotifications = (userId) => [
  {
    id: '1',
    title: 'Quote Available',
    message: 'Your brake service quote is ready for review',
    type: 'quote',
    read: false,
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    userId: userId,
  },
];

// Your existing action types remain the same...
const APP_ACTIONS = {
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  CLEAR_ERROR: 'CLEAR_ERROR',
  INITIALIZE_MOCK_DATA: 'INITIALIZE_MOCK_DATA',
  RESET_STATE: 'RESET_STATE',
  
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
  
  // Users
  SET_USERS: 'SET_USERS',
  ADD_USER: 'ADD_USER',
  UPDATE_USER: 'UPDATE_USER',
  DELETE_USER: 'DELETE_USER',
  
  // Notifications
  SET_NOTIFICATIONS: 'SET_NOTIFICATIONS',
  ADD_NOTIFICATION: 'ADD_NOTIFICATION',
  MARK_NOTIFICATION_READ: 'MARK_NOTIFICATION_READ',
  CLEAR_NOTIFICATIONS: 'CLEAR_NOTIFICATIONS',
};

// Your existing reducer remains the same...
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

    case APP_ACTIONS.INITIALIZE_MOCK_DATA:
      console.log('🎭 Initializing mock data:', {
        vehicles: action.payload.vehicles?.length || 0,
        serviceRequests: action.payload.serviceRequests?.length || 0,
        users: action.payload.users?.length || 0,
        notifications: action.payload.notifications?.length || 0,
      });
      return {
        ...state,
        vehicles: action.payload.vehicles || [],
        serviceRequests: action.payload.serviceRequests || [],
        users: action.payload.users || [],
        notifications: action.payload.notifications || [],
        initialized: true,
        lastUpdated: new Date().toISOString(),
      };

    case APP_ACTIONS.RESET_STATE:
      console.log('🔄 Resetting app state');
      return initialState;

    // All your existing cases remain the same...
    case APP_ACTIONS.SET_VEHICLES:
      return {
        ...state,
        vehicles: action.payload || [],
      };

    case APP_ACTIONS.ADD_VEHICLE:
      return {
        ...state,
        vehicles: [...(state.vehicles || []), action.payload],
      };

    case APP_ACTIONS.UPDATE_VEHICLE:
      return {
        ...state,
        vehicles: (state.vehicles || []).map(vehicle =>
          vehicle.id === action.payload.id ? { ...vehicle, ...action.payload } : vehicle
        ),
      };

    case APP_ACTIONS.DELETE_VEHICLE:
      return {
        ...state,
        vehicles: (state.vehicles || []).filter(vehicle => vehicle.id !== action.payload),
      };

    case APP_ACTIONS.SET_SERVICE_REQUESTS:
      return {
        ...state,
        serviceRequests: action.payload || [],
      };

    case APP_ACTIONS.ADD_SERVICE_REQUEST:
      return {
        ...state,
        serviceRequests: [...(state.serviceRequests || []), action.payload],
      };

    case APP_ACTIONS.UPDATE_SERVICE_REQUEST:
      return {
        ...state,
        serviceRequests: (state.serviceRequests || []).map(request =>
          request.id === action.payload.id ? { ...request, ...action.payload } : request
        ),
      };

    case APP_ACTIONS.DELETE_SERVICE_REQUEST:
      return {
        ...state,
        serviceRequests: (state.serviceRequests || []).filter(request => request.id !== action.payload),
      };

    case APP_ACTIONS.SET_USERS:
      return {
        ...state,
        users: action.payload || [],
      };

    case APP_ACTIONS.ADD_USER:
      return {
        ...state,
        users: [...(state.users || []), action.payload],
      };

    case APP_ACTIONS.UPDATE_USER:
      return {
        ...state,
        users: (state.users || []).map(user =>
          user.id === action.payload.id ? { ...user, ...action.payload } : user
        ),
      };

    case APP_ACTIONS.DELETE_USER:
      return {
        ...state,
        users: (state.users || []).filter(user => user.id !== action.payload),
      };

    case APP_ACTIONS.SET_NOTIFICATIONS:
      return {
        ...state,
        notifications: action.payload || [],
      };

    case APP_ACTIONS.ADD_NOTIFICATION:
      return {
        ...state,
        notifications: [action.payload, ...(state.notifications || [])],
      };

    case APP_ACTIONS.MARK_NOTIFICATION_READ:
      return {
        ...state,
        notifications: (state.notifications || []).map(notification =>
          notification.id === action.payload ? { ...notification, read: true } : notification
        ),
      };

    case APP_ACTIONS.CLEAR_NOTIFICATIONS:
      return {
        ...state,
        notifications: [],
      };

    default:
      return state;
  }
};

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);
  const { isAuthenticated, user } = useAuth();

  // Initialize mock data - enhanced with better logging
  const initializeMockData = useCallback((userData) => {
    if (!userData) {
      console.log('⚠️ No user data provided for mock initialization');
      return;
    }

    console.log('🎭 Initializing mock data for user:', {
      id: userData.id,
      email: userData.email,
      role: userData.role
    });

    try {
      const mockVehicles = userData.role === 'CLIENT' ? generateMockVehicles(userData.id) : [];
      const mockServiceRequests = generateMockServiceRequests(userData.id, userData.role);
      const mockUsers = generateMockUsers();
      const mockNotifications = generateMockNotifications(userData.id);

      dispatch({
        type: APP_ACTIONS.INITIALIZE_MOCK_DATA,
        payload: {
          vehicles: mockVehicles,
          serviceRequests: mockServiceRequests,
          users: mockUsers,
          notifications: mockNotifications,
        },
      });

      console.log('✅ Mock data initialized successfully');
    } catch (error) {
      console.error('💥 Error initializing mock data:', error);
      dispatch({
        type: APP_ACTIONS.SET_ERROR,
        payload: `Failed to initialize data: ${error.message}`
      });
    }
  }, []);

  // Initialize data when user changes
  useEffect(() => {
    console.log('🔍 AppContext useEffect triggered:', {
      isAuthenticated,
      hasUser: !!user,
      initialized: state.initialized,
      userRole: user?.role
    });

    if (isAuthenticated && user && !state.initialized) {
      console.log('🚀 Triggering mock data initialization...');
      initializeMockData(user);
    }
  }, [isAuthenticated, user, state.initialized, initializeMockData]);

  // Reset state when user logs out
  useEffect(() => {
    if (!isAuthenticated && state.initialized) {
      console.log('👋 User logged out, resetting app state');
      dispatch({ type: APP_ACTIONS.RESET_STATE });
    }
  }, [isAuthenticated, state.initialized]);

  // Enhanced error handling with logging
  const setError = useCallback((error) => {
    console.error('🚨 AppContext Error:', error);
    dispatch({ type: APP_ACTIONS.SET_ERROR, payload: error });
  }, []);

  const clearError = useCallback(() => {
    console.log('🧹 Clearing AppContext error');
    dispatch({ type: APP_ACTIONS.CLEAR_ERROR });
  }, []);

  // All your existing action creators remain the same...
  const setLoading = useCallback((loading) => {
    dispatch({ type: APP_ACTIONS.SET_LOADING, payload: loading });
  }, []);

  const addVehicle = useCallback((vehicle) => {
    const newVehicle = {
      ...vehicle,
      id: Date.now().toString(),
      userId: user?.id,
      createdAt: new Date().toISOString(),
    };
    dispatch({ type: APP_ACTIONS.ADD_VEHICLE, payload: newVehicle });
  }, [user?.id]);

  const updateVehicle = useCallback((vehicle) => {
    dispatch({ type: APP_ACTIONS.UPDATE_VEHICLE, payload: vehicle });
  }, []);

  const deleteVehicle = useCallback((vehicleId) => {
    dispatch({ type: APP_ACTIONS.DELETE_VEHICLE, payload: vehicleId });
  }, []);

  const addServiceRequest = useCallback((request) => {
    const newRequest = {
      ...request,
      id: Date.now().toString(),
      userId: user?.id,
      createdAt: new Date().toISOString(),
    };
    dispatch({ type: APP_ACTIONS.ADD_SERVICE_REQUEST, payload: newRequest });
  }, [user?.id]);

  const updateServiceRequest = useCallback((request) => {
    dispatch({ type: APP_ACTIONS.UPDATE_SERVICE_REQUEST, payload: request });
  }, []);

  const deleteServiceRequest = useCallback((requestId) => {
    dispatch({ type: APP_ACTIONS.DELETE_SERVICE_REQUEST, payload: requestId });
  }, []);

  const addNotification = useCallback((notification) => {
    const notificationWithId = {
      ...notification,
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      read: false,
      userId: user?.id,
    };
    dispatch({ type: APP_ACTIONS.ADD_NOTIFICATION, payload: notificationWithId });
  }, [user?.id]);

  const markNotificationRead = useCallback((notificationId) => {
    dispatch({ type: APP_ACTIONS.MARK_NOTIFICATION_READ, payload: notificationId });
  }, []);

  const clearNotifications = useCallback(() => {
    dispatch({ type: APP_ACTIONS.CLEAR_NOTIFICATIONS });
  }, []);

  // Helper functions remain the same...
  const getVehicleById = useCallback((vehicleId) => {
    return (state.vehicles || []).find(vehicle => vehicle.id === vehicleId);
  }, [state.vehicles]);

  const getServiceRequestById = useCallback((requestId) => {
    return (state.serviceRequests || []).find(request => request.id === requestId);
  }, [state.serviceRequests]);

  const getUnreadNotificationCount = useCallback(() => {
    return (state.notifications || []).filter(notification => !notification.read).length;
  }, [state.notifications]);

  const value = {
    // State
    ...state,
    
    // Generic actions
    setLoading,
    setError,
    clearError,
    
    // Vehicle actions
    setVehicles: useCallback((vehicles) => dispatch({ type: APP_ACTIONS.SET_VEHICLES, payload: vehicles }), []),
    addVehicle,
    updateVehicle,
    deleteVehicle,
    
    // Service request actions
    setServiceRequests: useCallback((requests) => dispatch({ type: APP_ACTIONS.SET_SERVICE_REQUESTS, payload: requests }), []),
    addServiceRequest,
    updateServiceRequest,
    deleteServiceRequest,
    
    // User actions  
    setUsers: useCallback((users) => dispatch({ type: APP_ACTIONS.SET_USERS, payload: users }), []),
    addUser: useCallback((user) => dispatch({ type: APP_ACTIONS.ADD_USER, payload: user }), []),
    updateUser: useCallback((user) => dispatch({ type: APP_ACTIONS.UPDATE_USER, payload: user }), []),
    deleteUser: useCallback((userId) => dispatch({ type: APP_ACTIONS.DELETE_USER, payload: userId }), []),
    
    // Notification actions
    setNotifications: useCallback((notifications) => dispatch({ type: APP_ACTIONS.SET_NOTIFICATIONS, payload: notifications }), []),
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

export const useApp = () => {
  const context = useContext(AppContext);
  
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  
  return context;
};

export default AppContext;