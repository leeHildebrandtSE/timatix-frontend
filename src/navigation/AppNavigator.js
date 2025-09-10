// src/navigation/AppNavigator.js
import React, { useState, useEffect } from 'react';
import { View, Text, ActivityIndicator, Animated, StyleSheet } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

// Roles
import { ROLES } from '../constants/roles';

// Contexts
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

// Screens
import SplashScreen from '../screens/auth/SplashScreen';
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';

import ClientDashboard from '../screens/client/ClientDashboard';
import MechanicDashboard from '../screens/mechanic/MechanicDashboard';
import AdminDashboard from '../screens/admin/AdminDashboard';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const LoadingScreen = () => {
  const { theme } = useTheme();
  return (
    <View style={[styles.center, { backgroundColor: theme.colors.background }]}>
      <ActivityIndicator size="large" color={theme.colors.primary} />
      <Text style={{ marginTop: 16, color: theme.colors.text }}>Loading...</Text>
    </View>
  );
};

// Auth stack
const AuthStack = () => {
  const { theme } = useTheme();
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: theme.colors.surface },
        headerTintColor: theme.colors.text,
      }}
    >
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
    </Stack.Navigator>
  );
};

// Client Tab Navigator with animated icons
const ClientTabs = () => {
  const { theme } = useTheme();

  const TabBarIcon = ({ focused, label }) => {
    const scale = new Animated.Value(focused ? 1.2 : 1);

    useEffect(() => {
      Animated.spring(scale, {
        toValue: focused ? 1.2 : 1,
        useNativeDriver: true,
      }).start();
    }, [focused]);

    return (
      <Animated.View
        style={[
          styles.tabIcon,
          { backgroundColor: focused ? theme.colors.primary : 'transparent', transform: [{ scale }] },
        ]}
      >
        <Text style={{ color: focused ? theme.colors.onPrimary : theme.colors.text }}>
          {label}
        </Text>
      </Animated.View>
    );
  };

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: theme.colors.surface,
          borderTopColor: theme.colors.border,
          height: 64,
        },
      }}
    >
      <Tab.Screen
        name="Dashboard"
        component={ClientDashboard}
        options={{
          tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} label="🏠" />,
        }}
      />
    </Tab.Navigator>
  );
};

// Mechanic stack
const MechanicStack = () => {
  const { theme } = useTheme();
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: theme.colors.surface },
        headerTintColor: theme.colors.text,
      }}
    >
      <Stack.Screen name="MechanicDashboard" component={MechanicDashboard} />
    </Stack.Navigator>
  );
};

// Admin stack
const AdminStack = () => {
  const { theme } = useTheme();
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: theme.colors.surface },
        headerTintColor: theme.colors.text,
      }}
    >
      <Stack.Screen name="AdminDashboard" component={AdminDashboard} />
    </Stack.Navigator>
  );
};

const AppNavigator = () => {
  const { user, isLoading, isInitialized } = useAuth();
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    if (isInitialized && !isLoading) {
      const timer = setTimeout(() => setShowSplash(false), 500);
      return () => clearTimeout(timer);
    }
  }, [isInitialized, isLoading]);

  if (showSplash) return <SplashScreen />;
  if (!isInitialized) return <LoadingScreen />;
  if (isLoading) return <LoadingScreen />;

  if (!user) return <AuthStack />;

  switch (user.role) {
    case ROLES.CLIENT:
      return <ClientTabs />;
    case ROLES.MECHANIC:
      return <MechanicStack />;
    case ROLES.ADMIN:
      return <AdminStack />;
    default:
      console.warn(`🚨 Unknown role detected: ${user.role}`);
      return <AuthStack />;
  }
};

export default AppNavigator;

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabIcon: {
    padding: 6,
    borderRadius: 12,
  },
});
