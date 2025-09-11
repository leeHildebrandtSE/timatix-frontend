// =============================================================================
// src/screens/shared/ProfileScreen.js - Profile Screen
// =============================================================================

import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';

const ProfileScreen = ({ navigation }) => {
  const { user, logout } = useAuth();
  const { theme } = useTheme();
  const globalStyles = useGlobalStyles();

  const [loading, setLoading] = useState(false);

  const menuItems = [
    {
      icon: '👤',
      label: 'Edit Profile',
      color: theme.colors.primary,
      onPress: () => navigation.navigate('EditProfile'),
    },
    {
      icon: '🔔',
      label: 'Notifications',
      color: theme.colors.warning,
      onPress: () => navigation.navigate('NotificationSettings'),
    },
    {
      icon: '💳',
      label: 'Payment Methods',
      color: theme.colors.success,
      onPress: () => navigation.navigate('PaymentMethods'),
    },
    {
      icon: '📊',
      label: 'Activity History',
      color: theme.colors.info,
      onPress: () => navigation.navigate('ActivityHistory'),
    },
    {
      icon: '🛡️',
      label: 'Privacy & Security',
      color: '#6C5CE7',
      onPress: () => navigation.navigate('PrivacySettings'),
    },
    {
      icon: '❓',
      label: 'Help & Support',
      color: '#E17055',
      onPress: () => navigation.navigate('Support'),
    },
    {
      icon: '⚙️',
      label: 'App Settings',
      color: theme.colors.textSecondary,
      onPress: () => navigation.navigate('AppSettings'),
    },
  ];

  const handleLogout = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            setLoading(true);
            await logout();
            setLoading(false);
          },
        },
      ]
    );
  };

  const getRoleDisplayName = (role) => {
    const roleNames = {
      client: 'Vehicle Owner',
      mechanic: 'Mechanic',
      admin: 'Administrator',
    };
    return roleNames[role] || role;
  };

  const getRoleColor = (role) => {
    const roleColors = {
      client: theme.colors.primary,
      mechanic: theme.colors.success,
      admin: theme.colors.error,
    };
    return roleColors[role] || theme.colors.primary;
  };

  return (
    <ScrollView style={globalStyles.profileContainer}>
      {/* Profile Header */}
      <View style={[
        globalStyles.profileHeader,
        {
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          backgroundColor: getRoleColor(user?.role),
        }
      ]}>
        <View style={globalStyles.profileHeaderContent}>
          {user?.avatar ? (
            <Image source={{ uri: user.avatar }} style={globalStyles.profileAvatarImage} />
          ) : (
            <View style={[
              globalStyles.profileAvatar,
              { backgroundColor: 'rgba(255,255,255,0.2)' }
            ]}>
              <Text style={globalStyles.profileAvatarIcon}>
                {user?.name?.charAt(0).toUpperCase() || '👤'}
              </Text>
            </View>
          )}
          
          <Text style={globalStyles.profileName}>{user?.name || 'User'}</Text>
          <Text style={globalStyles.profileEmail}>{user?.email || 'email@example.com'}</Text>
          
          <View style={globalStyles.profileRole}>
            <Text style={globalStyles.profileRoleText}>
              {getRoleDisplayName(user?.role)}
            </Text>
          </View>
          
          {/* Quick Stats */}
          {user?.role === 'client' && (
            <View style={{
              flexDirection: 'row',
              justifyContent: 'space-around',
              marginTop: 20,
              paddingTop: 20,
              borderTopWidth: 1,
              borderTopColor: 'rgba(255,255,255,0.2)',
            }}>
              <View style={{ alignItems: 'center' }}>
                <Text style={{ color: '#fff', fontSize: 18, fontWeight: 'bold' }}>3</Text>
                <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 12 }}>Vehicles</Text>
              </View>
              <View style={{ alignItems: 'center' }}>
                <Text style={{ color: '#fff', fontSize: 18, fontWeight: 'bold' }}>12</Text>
                <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 12 }}>Services</Text>
              </View>
              <View style={{ alignItems: 'center' }}>
                <Text style={{ color: '#fff', fontSize: 18, fontWeight: 'bold' }}>2</Text>
                <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 12 }}>Active</Text>
              </View>
            </View>
          )}
        </View>
      </View>

      {/* Menu Items */}
      <View style={globalStyles.profileMenuSection}>
        {menuItems.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={[
              globalStyles.profileMenuItem,
              index === menuItems.length - 1 && globalStyles.profileMenuItemLast
            ]}
            onPress={item.onPress}
          >
            <View style={[
              globalStyles.profileMenuIcon,
              {
                backgroundColor: item.color + '20',
                borderRadius: 8,
                width: 40,
                height: 40,
                justifyContent: 'center',
                alignItems: 'center',
              }
            ]}>
              <Text style={{ fontSize: 20 }}>{item.icon}</Text>
            </View>
            <Text style={[globalStyles.profileMenuLabel, { color: theme.colors.text }]}>
              {item.label}
            </Text>
            <Text style={[globalStyles.profileMenuChevron, { color: theme.colors.textSecondary }]}>
              ›
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* App Info */}
      <View style={[globalStyles.section, { paddingHorizontal: 20 }]}>
        <View style={[
          globalStyles.card,
          { backgroundColor: theme.colors.surface, padding: 16 }
        ]}>
          <Text style={[theme.typography.body2, { color: theme.colors.textSecondary, textAlign: 'center' }]}>
            AutoCare v1.0.0 {'\n'}
            © 2024 AutoCare. All rights reserved.
          </Text>
        </View>
      </View>

      {/* Logout Button */}
      <TouchableOpacity
        style={[
          globalStyles.buttonBase,
          globalStyles.profileLogoutButton,
          loading && globalStyles.buttonDisabled
        ]}
        onPress={handleLogout}
        disabled={loading}
      >
        <Text style={globalStyles.buttonText}>
          {loading ? 'Signing Out...' : 'Sign Out'}
        </Text>
      </TouchableOpacity>

      {/* Bottom Spacing */}
      <View style={{ height: 40 }} />
    </ScrollView>
  );
};

export default {
  SplashScreen,
  LoginScreen,
  RegisterScreen,
  ProfileScreen,
};