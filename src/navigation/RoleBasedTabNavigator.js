// src/navigation/RoleBasedTabNavigator.js
import React, { useState, useEffect } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text, View, Animated, Dimensions, TouchableOpacity } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

// Client Screens
import ClientDashboard from '../screens/client/ClientDashboard';
import Vehicles from '../screens/client/Vehicles';
import ServiceRequests from '../screens/client/ServiceRequestsScreen';
import Profile from '../screens/client/Profile';

// Mechanic Screens
import MechanicDashboard from '../screens/mechanic/MechanicDashboard';
import JobList from '../screens/mechanic/JobList';
import QuoteManagement from '../screens/mechanic/QuoteManagement';

// Admin Screens
import AdminDashboard from '../screens/admin/AdminDashboard';
import SystemOverview from '../screens/admin/SystemOverview';
import UserManagement from '../screens/admin/UserManagement';

const Tab = createBottomTabNavigator();
const { width } = Dimensions.get('window');

// Enhanced Tab Bar Icon Component with animations
const TabBarIcon = ({ name, focused, theme, userRole }) => {
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
          {getTabIcon(name, userRole)}
        </Text>
      </View>
    </Animated.View>
  );
};

// Role-specific icon mapping
const getTabIcon = (routeName, userRole) => {
  const roleIcons = {
    CLIENT: {
      Dashboard: '🏠',
      Vehicles: '🚗',
      ServiceRequests: '🛠️',
      Profile: '👤',
    },
    MECHANIC: {
      Dashboard: '🔧',
      Jobs: '📋',
      Quotes: '💰',
      Profile: '👤',
    },
    ADMIN: {
      Dashboard: '📊',
      System: '⚙️',
      Users: '👥',
      Profile: '👤',
    }
  };
  
  return roleIcons[userRole]?.[routeName] || '•';
};

// Role-specific tab labels
const getTabLabel = (routeName, userRole) => {
  const roleLabels = {
    CLIENT: {
      Dashboard: 'Home',
      Vehicles: 'My Cars',
      ServiceRequests: 'Services',
      Profile: 'Profile',
    },
    MECHANIC: {
      Dashboard: 'Workshop',
      Jobs: 'Active Jobs',
      Quotes: 'Quotes',
      Profile: 'Profile',
    },
    ADMIN: {
      Dashboard: 'Overview',
      System: 'System',
      Users: 'Users',
      Profile: 'Profile',
    }
  };
  
  return roleLabels[userRole]?.[routeName] || routeName;
};

// CLIENT Tab Navigator - 4 tabs
const ClientTabNavigator = () => {
  const { theme } = useTheme();
  const { user } = useAuth();
  
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused }) => (
          <TabBarIcon name={route.name} focused={focused} theme={theme} userRole="CLIENT" />
        ),
        tabBarLabel: ({ focused, color }) => (
          <Text style={{ 
            color, 
            fontSize: 11, 
            fontWeight: focused ? '700' : '600', 
            marginTop: 4 
          }}>
            {getTabLabel(route.name, 'CLIENT')}
          </Text>
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
          shadowOffset: { width: 0, height: 8 },
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
        component={ClientDashboard}
        options={{
          tabBarTestID: 'client-dashboard-tab'
        }}
      />
      <Tab.Screen 
        name="Vehicles" 
        component={Vehicles}
        options={{
          tabBarTestID: 'client-vehicles-tab'
        }}
      />
      <Tab.Screen 
        name="ServiceRequests" 
        component={ServiceRequests}
        options={{
          tabBarTestID: 'client-services-tab'
        }}
      />
      <Tab.Screen 
        name="Profile" 
        component={Profile}
        options={{
          tabBarTestID: 'client-profile-tab'
        }}
      />
    </Tab.Navigator>
  );
};

// MECHANIC Tab Navigator - 4 tabs
const MechanicTabNavigator = () => {
  const { theme } = useTheme();
  const { user } = useAuth();
  
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused }) => (
          <TabBarIcon name={route.name} focused={focused} theme={theme} userRole="MECHANIC" />
        ),
        tabBarLabel: ({ focused, color }) => (
          <Text style={{ 
            color, 
            fontSize: 11, 
            fontWeight: focused ? '700' : '600', 
            marginTop: 4 
          }}>
            {getTabLabel(route.name, 'MECHANIC')}
          </Text>
        ),
        tabBarActiveTintColor: theme.colors.secondary || theme.colors.primary,
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
          shadowOffset: { width: 0, height: 8 },
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
        options={{
          tabBarTestID: 'mechanic-dashboard-tab'
        }}
      />
      <Tab.Screen 
        name="Jobs" 
        component={JobList}
        options={{
          tabBarTestID: 'mechanic-jobs-tab'
        }}
      />
      <Tab.Screen 
        name="Quotes" 
        component={QuoteManagement}
        options={{
          tabBarTestID: 'mechanic-quotes-tab'
        }}
      />
      <Tab.Screen 
        name="Profile" 
        component={Profile}
        options={{
          tabBarTestID: 'mechanic-profile-tab'
        }}
      />
    </Tab.Navigator>
  );
};

// ADMIN Tab Navigator - 4 tabs
const AdminTabNavigator = () => {
  const { theme } = useTheme();
  const { user } = useAuth();
  
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused }) => (
          <TabBarIcon name={route.name} focused={focused} theme={theme} userRole="ADMIN" />
        ),
        tabBarLabel: ({ focused, color }) => (
          <Text style={{ 
            color, 
            fontSize: 11, 
            fontWeight: focused ? '700' : '600', 
            marginTop: 4 
          }}>
            {getTabLabel(route.name, 'ADMIN')}
          </Text>
        ),
        tabBarActiveTintColor: theme.colors.accent || theme.colors.primary,
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
          shadowOffset: { width: 0, height: 8 },
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
        options={{
          tabBarTestID: 'admin-dashboard-tab'
        }}
      />
      <Tab.Screen 
        name="System" 
        component={SystemOverview}
        options={{
          tabBarTestID: 'admin-system-tab'
        }}
      />
      <Tab.Screen 
        name="Users" 
        component={UserManagement}
        options={{
          tabBarTestID: 'admin-users-tab'
        }}
      />
      <Tab.Screen 
        name="Profile" 
        component={Profile}
        options={{
          tabBarTestID: 'admin-profile-tab'
        }}
      />
    </Tab.Navigator>
  );
};

// Main Role-Based Tab Navigator
const RoleBasedTabNavigator = () => {
  const { user, isAuthenticated } = useAuth();
  const { theme } = useTheme();

  // Debug logging
  console.log('🔍 RoleBasedTabNavigator Debug:', {
    isAuthenticated,
    userRole: user?.role,
    userName: user?.name,
    userEmail: user?.email
  });

  if (!isAuthenticated || !user) {
    return (
      <View style={{ 
        flex: 1, 
        justifyContent: 'center', 
        alignItems: 'center',
        backgroundColor: theme.colors.background 
      }}>
        <Text style={{ color: theme.colors.text }}>Not authenticated</Text>
      </View>
    );
  }

  // Route to appropriate tab navigator based on user role
  switch (user.role) {
    case ROLES.CLIENT:
      console.log('📱 Rendering CLIENT tabs');
      return <ClientTabNavigator />;
      
    case ROLES.MECHANIC:
      console.log('🔧 Rendering MECHANIC tabs');
      return <MechanicTabNavigator />;
      
    case ROLES.ADMIN:
      console.log('👑 Rendering ADMIN tabs');
      return <AdminTabNavigator />;
      
    default:
      console.warn('⚠️ Unknown user role:', user.role);
      console.log('📋 Available roles:', Object.values(ROLES));
      return (
        <View style={{ 
          flex: 1, 
          justifyContent: 'center', 
          alignItems: 'center',
          backgroundColor: theme.colors.background,
          padding: 20
        }}>
          <Text style={{ 
            color: theme.colors.text,
            fontSize: 18,
            textAlign: 'center',
            marginBottom: 10
          }}>
            Unknown User Role
          </Text>
          <Text style={{ 
            color: theme.colors.textSecondary,
            fontSize: 14,
            textAlign: 'center'
          }}>
            Role: "{user.role}" is not recognized.{'\n'}
            Expected: {Object.values(ROLES).join(', ')}{'\n'}
            Please contact support.
          </Text>
        </View>
      );
  }
};

// Export individual navigators and main component
export {
  ClientTabNavigator,
  MechanicTabNavigator,
  AdminTabNavigator,
  RoleBasedTabNavigator
};

export default RoleBasedTabNavigator;