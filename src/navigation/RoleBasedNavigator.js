// src/navigation/RoleBasedNavigator.js - Fixed version with all missing screens
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

// Auth Screens
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';

// Client Screens
import ClientDashboard from '../screens/client/Dashboard';
import Vehicles from '../screens/client/Vehicles';
import VehicleDetails from '../screens/client/VehicleDetails';
import ServiceRequests from '../screens/client/ServiceRequests';
import CreateServiceRequest from '../screens/client/CreateServiceRequest';
import Profile from '../screens/client/Profile';

// Mechanic Screens
import MechanicDashboard from '../screens/mechanic/MechanicDashboard';
import JobList from '../screens/mechanic/JobList';
import QuoteManagement from '../screens/mechanic/QuoteManagement';

// Admin Screens
import AdminDashboard from '../screens/admin/AdminDashboard';
import SystemOverview from '../screens/admin/SystemOverview';
import UserManagement from '../screens/admin/UserManagement';

// Shared/Common Screens (create these placeholders)
import ServiceDetails from '../screens/shared/ServiceDetails';
import QuoteDetails from '../screens/shared/QuoteDetails';
import JobDetails from '../screens/shared/JobDetails';
import CreateQuote from '../screens/shared/CreateQuote';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Tab Icons (using emoji for simplicity)
const getTabIcon = (routeName, focused) => {
  const icons = {
    Dashboard: '🏠',
    Vehicles: '🚗',
    ServiceRequests: '🔧',
    Jobs: '🔧',
    Quotes: '💰',
    Users: '👥',
    System: '⚙️',
    Profile: '👤',
  };
  return icons[routeName] || '•';
};

// Client Tab Navigator
const ClientTabs = () => {
  const { theme } = useTheme();
  
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused }) => (
          <Text style={{ fontSize: 24 }}>
            {getTabIcon(route.name, focused)}
          </Text>
        ),
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textSecondary,
        tabBarStyle: {
          backgroundColor: theme.colors.surface,
          borderTopColor: theme.colors.border,
        },
      })}
    >
      <Tab.Screen name="Dashboard" component={ClientDashboard} />
      <Tab.Screen name="Vehicles" component={Vehicles} />
      <Tab.Screen 
        name="ServiceRequests" 
        component={ServiceRequests} 
        options={{ title: 'Services' }} 
      />
      <Tab.Screen name="Profile" component={Profile} />
    </Tab.Navigator>
  );
};

// Mechanic Tab Navigator
const MechanicTabs = () => {
  const { theme } = useTheme();
  
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused }) => (
          <Text style={{ fontSize: 24 }}>
            {getTabIcon(route.name, focused)}
          </Text>
        ),
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textSecondary,
        tabBarStyle: {
          backgroundColor: theme.colors.surface,
          borderTopColor: theme.colors.border,
        },
      })}
    >
      <Tab.Screen name="Dashboard" component={MechanicDashboard} />
      <Tab.Screen name="Jobs" component={JobList} />
      <Tab.Screen name="Quotes" component={QuoteManagement} />
      <Tab.Screen name="Profile" component={Profile} />
    </Tab.Navigator>
  );
};

// Admin Tab Navigator
const AdminTabs = () => {
  const { theme } = useTheme();
  
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused }) => (
          <Text style={{ fontSize: 24 }}>
            {getTabIcon(route.name, focused)}
          </Text>
        ),
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textSecondary,
        tabBarStyle: {
          backgroundColor: theme.colors.surface,
          borderTopColor: theme.colors.border,
        },
      })}
    >
      <Tab.Screen name="Dashboard" component={AdminDashboard} />
      <Tab.Screen name="System" component={SystemOverview} />
      <Tab.Screen name="Users" component={UserManagement} />
      <Tab.Screen name="Profile" component={Profile} />
    </Tab.Navigator>
  );
};

// Client Stack Navigator
const ClientStack = () => {
  const { theme } = useTheme();
  
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.colors.surface,
          borderBottomColor: theme.colors.border,
        },
        headerTintColor: theme.colors.text,
        headerTitleStyle: {
          fontWeight: '600',
        },
      }}
    >
      <Stack.Screen 
        name="ClientTabs" 
        component={ClientTabs} 
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="VehicleDetails" 
        component={VehicleDetails}
        options={{ 
          title: 'Vehicle Details',
          headerBackTitle: 'Back'
        }}
      />
      <Stack.Screen 
        name="CreateServiceRequest" 
        component={CreateServiceRequest}
        options={{ 
          title: 'Book Service',
          headerBackTitle: 'Back'
        }}
      />
      <Stack.Screen 
        name="ServiceDetails" 
        component={ServiceDetails}
        options={{ 
          title: 'Service Details',
          headerBackTitle: 'Back'
        }}
      />
      <Stack.Screen 
        name="QuoteDetails" 
        component={QuoteDetails}
        options={{ 
          title: 'Quote Details',
          headerBackTitle: 'Back'
        }}
      />
    </Stack.Navigator>
  );
};

// Mechanic Stack Navigator
const MechanicStack = () => {
  const { theme } = useTheme();
  
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.colors.surface,
          borderBottomColor: theme.colors.border,
        },
        headerTintColor: theme.colors.text,
        headerTitleStyle: {
          fontWeight: '600',
        },
      }}
    >
      <Stack.Screen 
        name="MechanicTabs" 
        component={MechanicTabs} 
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="JobDetails" 
        component={JobDetails}
        options={{ 
          title: 'Job Details',
          headerBackTitle: 'Back'
        }}
      />
      <Stack.Screen 
        name="CreateQuote" 
        component={CreateQuote}
        options={{ 
          title: 'Create Quote',
          headerBackTitle: 'Back'
        }}
      />
      <Stack.Screen 
        name="ServiceDetails" 
        component={ServiceDetails}
        options={{ 
          title: 'Service Details',
          headerBackTitle: 'Back'
        }}
      />
      <Stack.Screen 
        name="QuoteDetails" 
        component={QuoteDetails}
        options={{ 
          title: 'Quote Details',
          headerBackTitle: 'Back'
        }}
      />
    </Stack.Navigator>
  );
};

// Admin Stack Navigator
const AdminStack = () => {
  const { theme } = useTheme();
  
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.colors.surface,
          borderBottomColor: theme.colors.border,
        },
        headerTintColor: theme.colors.text,
        headerTitleStyle: {
          fontWeight: '600',
        },
      }}
    >
      <Stack.Screen 
        name="AdminTabs" 
        component={AdminTabs} 
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="SystemOverview" 
        component={SystemOverview}
        options={{ 
          title: 'System Overview',
          headerBackTitle: 'Back'
        }}
      />
      <Stack.Screen 
        name="UserManagement" 
        component={UserManagement}
        options={{ 
          title: 'User Management',
          headerBackTitle: 'Back'
        }}
      />
      <Stack.Screen 
        name="ServiceDetails" 
        component={ServiceDetails}
        options={{ 
          title: 'Service Details',
          headerBackTitle: 'Back'
        }}
      />
      <Stack.Screen 
        name="QuoteDetails" 
        component={QuoteDetails}
        options={{ 
          title: 'Quote Details',
          headerBackTitle: 'Back'
        }}
      />
    </Stack.Navigator>
  );
};

// Auth Stack Navigator
const AuthStack = () => {
  const { theme } = useTheme();
  
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: theme.colors.background },
      }}
    >
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
    </Stack.Navigator>
  );
};

// Main Role-Based Navigator
const RoleBasedNavigator = () => {
  const { user, isAuthenticated, isLoading } = useAuth();

  // Show loading state while checking authentication
  if (isLoading) {
    return null; // Or a loading screen component
  }

  // If not authenticated, show auth stack
  if (!isAuthenticated || !user) {
    return <AuthStack />;
  }

  // Route based on user role
  switch (user.role) {
    case 'CLIENT':
      return <ClientStack />;
    
    case 'MECHANIC':
      return <MechanicStack />;
    
    case 'ADMIN':
      return <AdminStack />;
    
    default:
      // Fallback to auth if role is not recognized
      return <AuthStack />;
  }
};

export default RoleBasedNavigator;