// src/navigation/AppNavigator.js - Complete navigation with all screens
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text, View } from 'react-native';
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

// Shared Screens
import ServiceDetails from '../screens/shared/ServiceDetails';
import QuoteDetails from '../screens/shared/QuoteDetails';
import JobDetails from '../screens/shared/JobDetails';
import CreateQuote from '../screens/shared/CreateQuote';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Tab Bar Icon Component
const TabBarIcon = ({ name, focused, theme }) => (
  <View style={{ alignItems: 'center', justifyContent: 'center' }}>
    <Text style={{ 
      fontSize: 24, 
      color: focused ? theme.colors.primary : theme.colors.textSecondary 
    }}>
      {getTabIcon(name)}
    </Text>
  </View>
);

// Icon mapping
const getTabIcon = (routeName) => {
  const icons = {
    Dashboard: '🏠',
    Vehicles: '🚗',
    ServiceRequests: '🔧',
    Services: '🔧',
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
          <TabBarIcon name={route.name} focused={focused} theme={theme} />
        ),
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textSecondary,
        tabBarStyle: {
          backgroundColor: theme.colors.surface,
          borderTopColor: theme.colors.border,
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
      })}
    >
      <Tab.Screen name="Dashboard" component={ClientDashboard} />
      <Tab.Screen name="Vehicles" component={Vehicles} />
      <Tab.Screen 
        name="Services" 
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
          <TabBarIcon name={route.name} focused={focused} theme={theme} />
        ),
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textSecondary,
        tabBarStyle: {
          backgroundColor: theme.colors.surface,
          borderTopColor: theme.colors.border,
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
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
          <TabBarIcon name={route.name} focused={focused} theme={theme} />
        ),
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textSecondary,
        tabBarStyle: {
          backgroundColor: theme.colors.surface,
          borderTopColor: theme.colors.border,
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
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

// Stack Navigator for each user type
const ClientStack = () => {
  const { theme } = useTheme();
  
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.colors.surface,
          borderBottomColor: theme.colors.border,
          elevation: 4,
          shadowOpacity: 0.1,
        },
        headerTintColor: theme.colors.text,
        headerTitleStyle: {
          fontWeight: '600',
          fontSize: 18,
        },
        headerBackTitleVisible: false,
        gestureEnabled: true,
        cardStyleInterpolator: ({ current, layouts }) => {
          return {
            cardStyle: {
              transform: [
                {
                  translateX: current.progress.interpolate({
                    inputRange: [0, 1],
                    outputRange: [layouts.screen.width, 0],
                  }),
                },
              ],
            },
          };
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
        options={{ title: 'Vehicle Details' }}
      />
      <Stack.Screen 
        name="CreateServiceRequest" 
        component={CreateServiceRequest}
        options={{ title: 'Book Service' }}
      />
      <Stack.Screen 
        name="ServiceDetails" 
        component={ServiceDetails}
        options={{ title: 'Service Details' }}
      />
      <Stack.Screen 
        name="QuoteDetails" 
        component={QuoteDetails}
        options={{ title: 'Quote Details' }}
      />
    </Stack.Navigator>
  );
};

const MechanicStack = () => {
  const { theme } = useTheme();
  
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.colors.surface,
          borderBottomColor: theme.colors.border,
          elevation: 4,
          shadowOpacity: 0.1,
        },
        headerTintColor: theme.colors.text,
        headerTitleStyle: {
          fontWeight: '600',
          fontSize: 18,
        },
        headerBackTitleVisible: false,
        gestureEnabled: true,
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
        options={{ title: 'Job Details' }}
      />
      <Stack.Screen 
        name="CreateQuote" 
        component={CreateQuote}
        options={{ title: 'Create Quote' }}
      />
      <Stack.Screen 
        name="ServiceDetails" 
        component={ServiceDetails}
        options={{ title: 'Service Details' }}
      />
      <Stack.Screen 
        name="QuoteDetails" 
        component={QuoteDetails}
        options={{ title: 'Quote Details' }}
      />
    </Stack.Navigator>
  );
};

const AdminStack = () => {
  const { theme } = useTheme();
  
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.colors.surface,
          borderBottomColor: theme.colors.border,
          elevation: 4,
          shadowOpacity: 0.1,
        },
        headerTintColor: theme.colors.text,
        headerTitleStyle: {
          fontWeight: '600',
          fontSize: 18,
        },
        headerBackTitleVisible: false,
        gestureEnabled: true,
      }}
    >
      <Stack.Screen 
        name="AdminTabs" 
        component={AdminTabs} 
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="ServiceDetails" 
        component={ServiceDetails}
        options={{ title: 'Service Details' }}
      />
      <Stack.Screen 
        name="QuoteDetails" 
        component={QuoteDetails}
        options={{ title: 'Quote Details' }}
      />
    </Stack.Navigator>
  );
};

// Auth Stack
const AuthStack = () => {
  const { theme } = useTheme();
  
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: theme.colors.background },
        gestureEnabled: true,
      }}
    >
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
    </Stack.Navigator>
  );
};

// Main App Navigator
const AppNavigator = () => {
  const { user, isAuthenticated, loading } = useAuth();

  // Show loading state while checking authentication
  if (loading) {
    return null; // Could show a splash screen component here
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

export default AppNavigator;