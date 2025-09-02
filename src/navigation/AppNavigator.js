// src/navigation/AppNavigator.js - Enhanced with Splash Screen Integration
import React, { useState, useEffect } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { Text, View, Animated, Dimensions } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

// Splash Screen
import SplashScreen from '../screens/auth/SplashScreen';

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
const { width } = Dimensions.get('window');

// Enhanced Tab Bar Icon Component with animations
const TabBarIcon = ({ name, focused, theme }) => {
  const [scaleAnim] = useState(new Animated.Value(1));

  useEffect(() => {
    Animated.spring(scaleAnim, {
      toValue: focused ? 1.2 : 1,
      tension: 100,
      friction: 8,
      useNativeDriver: true,
    }).start();
  }, [focused]);

  return (
    <Animated.View 
      style={{ 
        alignItems: 'center', 
        justifyContent: 'center',
        transform: [{ scale: scaleAnim }],
      }}
    >
      <View style={{
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: focused ? theme.colors.primary + '20' : 'transparent',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 2,
      }}>
        <Text style={{ 
          fontSize: 20, 
          color: focused ? theme.colors.primary : theme.colors.textSecondary 
        }}>
          {getTabIcon(name)}
        </Text>
      </View>
    </Animated.View>
  );
};

// Enhanced Icon mapping with better icons
const getTabIcon = (routeName) => {
  const icons = {
    Dashboard: '🏠',
    Vehicles: '🚗',
    ServiceRequests: '🛠️',
    Services: '🛠️',
    Jobs: '📋',
    Quotes: '💰',
    Users: '👥',
    System: '⚙️',
    Profile: '👤',
  };
  return icons[routeName] || '•';
};

// Enhanced Client Tab Navigator
const ClientTabs = () => {
  const { theme } = useTheme();
  
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused }) => (
          <TabBarIcon name={route.name} focused={focused} theme={theme} />
        ),
        tabBarLabel: ({ focused, color }) => {
          const getLabel = (routeName) => {
            const labels = {
              Dashboard: 'Home',
              Vehicles: 'Vehicles',
              ServiceRequests: 'Services',
              Profile: 'Profile',
            };
            return labels[routeName] || routeName;
          };

          return (
            <Text style={{ 
              color, 
              fontSize: 11, 
              fontWeight: '600', 
              marginTop: 4 
            }}>
              {getLabel(route.name)}
            </Text>
          );
        },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textSecondary,
        tabBarStyle: {
          backgroundColor: theme.colors.surface,
          borderTopColor: theme.colors.border,
          borderTopWidth: 1,
          height: 85,
          paddingBottom: 20,
          paddingTop: 10,
          borderRadius: 20,
          marginHorizontal: 16,
          marginBottom: 16,
          position: 'absolute',
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 8,
          },
          shadowOpacity: 0.15,
          shadowRadius: 20,
          elevation: 10,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
          marginTop: 4,
        },
        tabBarItemStyle: {
          paddingVertical: 5,
        },
      })}
    >
      <Tab.Screen name="Dashboard" component={ClientDashboard} />
      <Tab.Screen name="Vehicles" component={Vehicles} />
      <Tab.Screen name="ServiceRequests" component={ServiceRequests} />
      <Tab.Screen name="Profile" component={Profile} />
    </Tab.Navigator>
  );
};

// Enhanced Mechanic Tab Navigator
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
          borderTopWidth: 1,
          height: 85,
          paddingBottom: 20,
          paddingTop: 10,
          borderRadius: 20,
          marginHorizontal: 16,
          marginBottom: 16,
          position: 'absolute',
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 8,
          },
          shadowOpacity: 0.15,
          shadowRadius: 20,
          elevation: 10,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
          marginTop: 4,
        },
        tabBarItemStyle: {
          paddingVertical: 5,
        },
      })}
    >
      <Tab.Screen 
        name="Dashboard" 
        component={MechanicDashboard}
        options={{ title: 'Workshop' }}
      />
      <Tab.Screen 
        name="Jobs" 
        component={JobList}
        options={{ title: 'Jobs' }}
      />
      <Tab.Screen 
        name="Quotes" 
        component={QuoteManagement}
        options={{ title: 'Quotes' }}
      />
      <Tab.Screen 
        name="Profile" 
        component={Profile}
        options={{ title: 'Profile' }}
      />
    </Tab.Navigator>
  );
};

// Enhanced Admin Tab Navigator
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
          borderTopWidth: 1,
          height: 85,
          paddingBottom: 20,
          paddingTop: 10,
          borderRadius: 20,
          marginHorizontal: 16,
          marginBottom: 16,
          position: 'absolute',
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 8,
          },
          shadowOpacity: 0.15,
          shadowRadius: 20,
          elevation: 10,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
          marginTop: 4,
        },
        tabBarItemStyle: {
          paddingVertical: 5,
        },
      })}
    >
      <Tab.Screen 
        name="Dashboard" 
        component={AdminDashboard}
        options={{ title: 'Admin' }}
      />
      <Tab.Screen 
        name="System" 
        component={SystemOverview}
        options={{ title: 'System' }}
      />
      <Tab.Screen 
        name="Users" 
        component={UserManagement}
        options={{ title: 'Users' }}
      />
      <Tab.Screen 
        name="Profile" 
        component={Profile}
        options={{ title: 'Profile' }}
      />
    </Tab.Navigator>
  );
};

// Enhanced Stack Navigator for each user type
const ClientStack = () => {
  const { theme } = useTheme();
  
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.colors.surface,
          borderBottomColor: theme.colors.border,
          borderBottomWidth: 1,
          elevation: 8,
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 4,
          },
          shadowOpacity: 0.1,
          shadowRadius: 8,
        },
        headerTintColor: theme.colors.text,
        headerTitleStyle: {
          fontWeight: '700',
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
              opacity: current.progress.interpolate({
                inputRange: [0, 0.5, 1],
                outputRange: [0, 0.5, 1],
              }),
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
        options={{ 
          title: 'Vehicle Details',
          headerStyle: {
            backgroundColor: theme.colors.primary,
          },
          headerTintColor: '#fff',
        }}
      />
      <Stack.Screen 
        name="CreateServiceRequest" 
        component={CreateServiceRequest}
        options={{ 
          title: 'Book Service',
          headerStyle: {
            backgroundColor: theme.colors.primary,
          },
          headerTintColor: '#fff',
        }}
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
          borderBottomWidth: 1,
          elevation: 8,
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 4,
          },
          shadowOpacity: 0.1,
          shadowRadius: 8,
        },
        headerTintColor: theme.colors.text,
        headerTitleStyle: {
          fontWeight: '700',
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
              opacity: current.progress.interpolate({
                inputRange: [0, 0.5, 1],
                outputRange: [0, 0.5, 1],
              }),
            },
          };
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
          headerStyle: {
            backgroundColor: theme.colors.secondary,
          },
          headerTintColor: '#fff',
        }}
      />
      <Stack.Screen 
        name="CreateQuote" 
        component={CreateQuote}
        options={{ 
          title: 'Create Quote',
          headerStyle: {
            backgroundColor: theme.colors.secondary,
          },
          headerTintColor: '#fff',
        }}
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
          borderBottomWidth: 1,
          elevation: 8,
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 4,
          },
          shadowOpacity: 0.1,
          shadowRadius: 8,
        },
        headerTintColor: theme.colors.text,
        headerTitleStyle: {
          fontWeight: '700',
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
              opacity: current.progress.interpolate({
                inputRange: [0, 0.5, 1],
                outputRange: [0, 0.5, 1],
              }),
            },
          };
        },
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

// Enhanced Auth Stack with splash integration
const AuthStack = () => {
  const { theme } = useTheme();
  
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: theme.colors.background },
        gestureEnabled: true,
        cardStyleInterpolator: ({ current }) => ({
          cardStyle: {
            opacity: current.progress,
          },
        }),
      }}
    >
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
    </Stack.Navigator>
  );
};

// Root Navigator with Splash Screen
const RootNavigator = () => {
  const { user, isLoading, isInitialized } = useAuth();
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    // Hide splash when auth is initialized and minimum time has passed
    if (isInitialized && !isLoading) {
      const timer = setTimeout(() => {
        setShowSplash(false);
      }, 500); // Small delay for smooth transition

      return () => clearTimeout(timer);
    }
  }, [isInitialized, isLoading]);

  const handleSplashComplete = () => {
    if (isInitialized) {
      setShowSplash(false);
    }
  };

  // Show splash screen during initialization
  if (showSplash || !isInitialized) {
    return <SplashScreen onAnimationEnd={handleSplashComplete} />;
  }

  // Route based on authentication status and user role
  if (!user) {
    return <AuthStack />;
  }

  switch (user.role) {
    case 'CLIENT':
      return <ClientStack />;
    case 'MECHANIC':
      return <MechanicStack />;
    case 'ADMIN':
      return <AdminStack />;
    default:
      return <AuthStack />;
  }
};

// Main App Navigator with Navigation Container
const AppNavigator = () => {
  const { theme } = useTheme();

  return (
    <NavigationContainer
      theme={{
        dark: theme.isDark,
        colors: {
          primary: theme.colors.primary,
          background: theme.colors.background,
          card: theme.colors.surface,
          text: theme.colors.text,
          border: theme.colors.border,
          notification: theme.colors.error,
        },
      }}
    >
      <RootNavigator />
    </NavigationContainer>
  );
};

export default AppNavigator;