// src/navigation/MainNavigator.js - FIXED to prevent infinite loop
import React, { useMemo } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text, View, ActivityIndicator } from 'react-native';
import ErrorBoundary from '../components/common/ErrorBoundary';

// Contexts & Constants
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { ROLES } from '../constants/roles';

// Screens - Auth
import SplashScreen from '../screens/auth/SplashScreen';
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';

// Screens - Client
import ClientDashboard from '../screens/client/ClientDashboard';
import Vehicles from '../screens/client/Vehicles';
import VehicleDetails from '../screens/client/VehicleDetails';
import ServiceRequests from '../screens/client/ServiceRequestsScreen';
import CreateServiceRequest from '../screens/client/CreateServiceRequest';

// Screens - Mechanic
import MechanicDashboard from '../screens/mechanic/MechanicDashboard';
import JobList from '../screens/mechanic/JobList';
import QuoteManagement from '../screens/mechanic/QuoteManagement';

// Screens - Admin
import AdminDashboard from '../screens/admin/AdminDashboard';
import SystemOverview from '../screens/admin/SystemOverview';
import UserManagement from '../screens/admin/UserManagement';

// Screens - Shared
import Profile from '../screens/shared/ProfileScreen';
import ServiceDetails from '../screens/shared/ServiceDetails';
import QuoteDetails from '../screens/shared/QuoteDetails';
import JobDetails from '../screens/shared/JobDetails';
import CreateQuote from '../screens/shared/CreateQuote';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

const getTabIcon = (routeName, userRole) => {
  const roleIcons = {
    [ROLES.CLIENT]: {
      Dashboard: '🏠',
      Vehicles: '🚗', 
      ServiceRequests: '🔧',
      Profile: '👤',
    },
    [ROLES.MECHANIC]: {
      Dashboard: '🔧',
      Jobs: '📋',
      Quotes: '💰',
      Profile: '👤',
    },
    [ROLES.ADMIN]: {
      Dashboard: '📊',
      System: '⚙️',
      Users: '👥', 
      Profile: '👤',
    }
  };
  return roleIcons[userRole]?.[routeName] || '•';
};

const getTabLabel = (routeName, userRole) => {
  const roleLabels = {
    [ROLES.CLIENT]: {
      Dashboard: 'Home',
      Vehicles: 'My Cars',
      ServiceRequests: 'Services', 
      Profile: 'Profile',
    },
    [ROLES.MECHANIC]: {
      Dashboard: 'Workshop',
      Jobs: 'Jobs',
      Quotes: 'Quotes',
      Profile: 'Profile',
    },
    [ROLES.ADMIN]: {
      Dashboard: 'Overview',
      System: 'System',
      Users: 'Users',
      Profile: 'Profile',
    }
  };
  return roleLabels[userRole]?.[routeName] || routeName;
};

// =============================================================================
// LOADING SCREEN - MEMOIZED to prevent re-renders
// =============================================================================

const LoadingScreen = React.memo(() => {
  const { theme } = useTheme();
  return (
    <View style={{
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme.colors.background,
    }}>
      <ActivityIndicator size="large" color={theme.colors.primary} />
      <Text style={{
        marginTop: 16,
        color: theme.colors.text,
        fontSize: 16,
      }}>
        Loading...
      </Text>
    </View>
  );
});

// =============================================================================
// AUTH NAVIGATOR - MEMOIZED
// =============================================================================

const AuthNavigator = React.memo(() => {
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
});

// =============================================================================
// TAB NAVIGATORS - MEMOIZED to prevent re-renders
// =============================================================================

const ClientTabs = React.memo(() => {
  const { theme } = useTheme();
  
  // ✅ FIX: Memoize screen options to prevent re-creation
  const screenOptions = useMemo(() => ({ route }) => ({
    headerShown: false,
    tabBarIcon: ({ focused }) => (
      <Text style={{ 
        fontSize: 24,
        color: focused ? theme.colors.primary : theme.colors.textSecondary 
      }}>
        {getTabIcon(route.name, ROLES.CLIENT)}
      </Text>
    ),
    tabBarLabel: ({ focused, color }) => (
      <Text style={{
        color,
        fontSize: 11,
        fontWeight: focused ? '700' : '500',
      }}>
        {getTabLabel(route.name, ROLES.CLIENT)}
      </Text>
    ),
    tabBarActiveTintColor: theme.colors.primary,
    tabBarInactiveTintColor: theme.colors.textSecondary,
    tabBarStyle: {
      backgroundColor: theme.colors.surface,
      borderTopColor: theme.colors.border,
      height: 70,
      paddingBottom: 10,
      paddingTop: 5,
    },
  }), [theme]); // ✅ Only depend on theme

  return (
    <Tab.Navigator screenOptions={screenOptions}>
      <Tab.Screen name="Dashboard" component={ClientDashboard} />
      <Tab.Screen name="Vehicles" component={Vehicles} />
      <Tab.Screen name="ServiceRequests" component={ServiceRequests} />
      <Tab.Screen name="Profile" component={Profile} />
    </Tab.Navigator>
  );
});

const MechanicTabs = React.memo(() => {
  const { theme } = useTheme();
  
  const screenOptions = useMemo(() => ({ route }) => ({
    headerShown: false,
    tabBarIcon: ({ focused }) => (
      <Text style={{ 
        fontSize: 24,
        color: focused ? theme.colors.primary : theme.colors.textSecondary 
      }}>
        {getTabIcon(route.name, ROLES.MECHANIC)}
      </Text>
    ),
    tabBarLabel: ({ focused, color }) => (
      <Text style={{
        color,
        fontSize: 11,
        fontWeight: focused ? '700' : '500',
      }}>
        {getTabLabel(route.name, ROLES.MECHANIC)}
      </Text>
    ),
    tabBarActiveTintColor: theme.colors.primary,
    tabBarInactiveTintColor: theme.colors.textSecondary,
    tabBarStyle: {
      backgroundColor: theme.colors.surface,
      borderTopColor: theme.colors.border,
      height: 70,
      paddingBottom: 10,
      paddingTop: 5,
    },
  }), [theme]);

  return (
    <Tab.Navigator screenOptions={screenOptions}>
      <Tab.Screen name="Dashboard" component={MechanicDashboard} />
      <Tab.Screen name="Jobs" component={JobList} />
      <Tab.Screen name="Quotes" component={QuoteManagement} />
      <Tab.Screen name="Profile" component={Profile} />
    </Tab.Navigator>
  );
});

const AdminTabs = React.memo(() => {
  const { theme } = useTheme();
  
  const screenOptions = useMemo(() => ({ route }) => ({
    headerShown: false,
    tabBarIcon: ({ focused }) => (
      <Text style={{ 
        fontSize: 24,
        color: focused ? theme.colors.primary : theme.colors.textSecondary 
      }}>
        {getTabIcon(route.name, ROLES.ADMIN)}
      </Text>
    ),
    tabBarLabel: ({ focused, color }) => (
      <Text style={{
        color,
        fontSize: 11,
        fontWeight: focused ? '700' : '500',
      }}>
        {getTabLabel(route.name, ROLES.ADMIN)}
      </Text>
    ),
    tabBarActiveTintColor: theme.colors.primary,
    tabBarInactiveTintColor: theme.colors.textSecondary,
    tabBarStyle: {
      backgroundColor: theme.colors.surface,
      borderTopColor: theme.colors.border,
      height: 70,
      paddingBottom: 10,
      paddingTop: 5,
    },
  }), [theme]);

  return (
    <Tab.Navigator screenOptions={screenOptions}>
      <Tab.Screen name="Dashboard" component={AdminDashboard} />
      <Tab.Screen name="System" component={SystemOverview} />
      <Tab.Screen name="Users" component={UserManagement} />
      <Tab.Screen name="Profile" component={Profile} />
    </Tab.Navigator>
  );
});

// =============================================================================
// STACK NAVIGATORS - MEMOIZED
// =============================================================================

const ClientStack = React.memo(() => {
  const { theme } = useTheme();
  
  const screenOptions = useMemo(() => ({
    headerStyle: {
      backgroundColor: theme.colors.surface,
      borderBottomColor: theme.colors.border,
    },
    headerTintColor: theme.colors.text,
    headerTitleStyle: { fontWeight: '600' },
    headerBackTitleVisible: false,
  }), [theme]);
  
  return (
    <Stack.Navigator screenOptions={screenOptions}>
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
});

const MechanicStack = React.memo(() => {
  const { theme } = useTheme();
  
  const screenOptions = useMemo(() => ({
    headerStyle: {
      backgroundColor: theme.colors.surface,
      borderBottomColor: theme.colors.border,
    },
    headerTintColor: theme.colors.text,
    headerTitleStyle: { fontWeight: '600' },
    headerBackTitleVisible: false,
  }), [theme]);
  
  return (
    <Stack.Navigator screenOptions={screenOptions}>
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
});

const AdminStack = React.memo(() => {
  const { theme } = useTheme();
  
  const screenOptions = useMemo(() => ({
    headerStyle: {
      backgroundColor: theme.colors.surface,
      borderBottomColor: theme.colors.border,
    },
    headerTintColor: theme.colors.text,
    headerTitleStyle: { fontWeight: '600' },
    headerBackTitleVisible: false,
  }), [theme]);
  
  return (
    <Stack.Navigator screenOptions={screenOptions}>
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
});

// =============================================================================
// MAIN NAVIGATOR - OPTIMIZED to prevent infinite re-renders
// =============================================================================

const MainNavigator = () => {
  const { user, isAuthenticated, isLoading, isInitialized } = useAuth();

  // ✅ FIX: Only log once per state change, not on every render
  const debugInfo = useMemo(() => ({
    isAuthenticated,
    userRole: user?.role,
    isInitialized,
    isLoading
  }), [isAuthenticated, user?.role, isInitialized, isLoading]);

  // ✅ Only log when debug info actually changes
  React.useEffect(() => {
    console.log('🔍 MainNavigator state changed:', debugInfo);
  }, [debugInfo]);

  // ✅ FIX: Memoize navigator selection to prevent re-creation
  const navigatorComponent = useMemo(() => {
    // Show splash during initialization
    if (!isInitialized) {
      return <SplashScreen onAnimationEnd={() => {}} />;
    }

    // Show loading after initialization
    if (isLoading) {
      return <LoadingScreen />;
    }

    // Show auth if not authenticated
    if (!isAuthenticated || !user) {
      return <AuthNavigator />;
    }

    // Route by role
    switch (user.role) {
      case ROLES.CLIENT:
        console.log('📱 Rendering CLIENT stack');
        return <ClientStack />;
      
      case ROLES.MECHANIC:
        console.log('🔧 Rendering MECHANIC stack');
        return <MechanicStack />;
      
      case ROLES.ADMIN:
        console.log('👑 Rendering ADMIN stack');
        return <AdminStack />;
      
      default:
        console.warn(`⚠️ Unknown role: ${user.role}`);
        return <AuthNavigator />;
    }
  }, [isInitialized, isLoading, isAuthenticated, user?.role]); // ✅ Minimal dependencies

  return (
    <ErrorBoundary>
      {navigatorComponent}
    </ErrorBoundary>
  );
};

export default MainNavigator;