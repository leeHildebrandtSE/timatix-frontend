// src/navigation/AuthNavigator.js
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { useTheme } from '../context/ThemeContext';

// Auth Screens
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';

const Stack = createStackNavigator();

const AuthNavigator = () => {
  const { theme } = useTheme();

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: theme.colors.background },
        gestureEnabled: true,
        gestureDirection: 'horizontal',
        transitionSpec: {
          open: {
            animation: 'timing',
            config: { duration: 300 },
          },
          close: {
            animation: 'timing',
            config: { duration: 300 },
          },
        },
      }}
    >
      <Stack.Screen 
        name="Login" 
        component={LoginScreen}
        options={{
          title: 'Sign In',
          headerBackTitle: 'Back',
        }}
      />
      <Stack.Screen 
        name="Register" 
        component={RegisterScreen}
        options={{
          title: 'Create Account',
          headerBackTitle: 'Back',
        }}
      />
    </Stack.Navigator>
  );
};

export default AuthNavigator;

// src/navigation/TabNavigation.js - Complete Implementation
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '../context/ThemeContext';

const TabNavigation = ({ tabs, activeTab, onTabChange }) => {
  const { theme } = useTheme();

  return (
    <View style={[styles.tabContainer, { backgroundColor: theme.colors.surface }]}>
      {tabs.map((tab) => (
        <TouchableOpacity
          key={tab.key}
          style={[
            styles.tabItem,
            activeTab === tab.key && { backgroundColor: theme.colors.primary + '20' }
          ]}
          onPress={() => onTabChange(tab.key)}
        >
          <Text style={styles.tabIcon}>{tab.icon}</Text>
          <Text 
            style={[
              styles.tabTitle,
              { color: activeTab === tab.key ? theme.colors.primary : theme.colors.textSecondary }
            ]}
          >
            {tab.title}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  tabContainer: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    paddingVertical: 8,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 4,
    borderRadius: 8,
    marginHorizontal: 4,
  },
  tabIcon: {
    fontSize: 20,
    marginBottom: 4,
  },
  tabTitle: {
    fontSize: 11,
    fontWeight: '500',
    textAlign: 'center',
  },
});

export default TabNavigation;