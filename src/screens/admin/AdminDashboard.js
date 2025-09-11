// src/screens/admin/AdminDashboard.js - Fully Refactored with Global Styles
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Image,
  Dimensions,
} from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { useTheme, useGlobalStyles } from '../../context/ThemeContext';
import { getStatusColor, getPriorityColor } from '../../styles/globalStyles';

const { width } = Dimensions.get('window');

const AdminDashboard = ({ navigation }) => {
  const { user } = useAuth();
  const { users, serviceRequests, vehicles, isLoading } = useApp();
  const { theme } = useTheme();
  const globalStyles = useGlobalStyles();

  const [refreshing, setRefreshing] = useState(false);
  const [systemStats, setSystemStats] = useState({
    totalUsers: 0,
    totalClients: 0,
    totalMechanics: 0,
    totalVehicles: 0,
    activeServices: 0,
    pendingQuotes: 0,
    completedServices: 0,
    systemHealth: 98,
    monthlyRevenue: 0,
    dailyActiveUsers: 0,
  });

  // Quick actions for admin
  const quickActions = [
    {
      title: 'User Management',
      subtitle: 'Manage all users',
      icon: '👥',
      color: '#6C5CE7',
      onPress: () => navigation.navigate('UserManagement'),
    },
    {
      title: 'System Overview',
      subtitle: 'Monitor system health',
      icon: '📊',
      color: '#00B894',
      onPress: () => navigation.navigate('SystemOverview'),
    },
    {
      title: 'Service Analytics',
      subtitle: 'View detailed reports',
      icon: '📈',
      color: '#E17055',
      onPress: () => navigation.navigate('ServiceAnalytics'),
    },
    {
      title: 'Settings',
      subtitle: 'System configuration',
      icon: '⚙️',
      color: '#636E72',
      onPress: () => navigation.navigate('SystemSettings'),
    },
  ];

  // System metrics
  const systemMetrics = [
    {
      title: 'Total Users',
      value: systemStats.totalUsers,
      icon: '👤',
      color: theme.colors.primary,
      trend: `+${Math.floor(systemStats.totalUsers * 0.12)} this month`,
      trendColor: theme.colors.success,
      onPress: () => navigation.navigate('UserManagement'),
    },
    {
      title: 'Active Services',
      value: systemStats.activeServices,
      icon: '🔧',
      color: theme.colors.warning,
      trend: 'In progress',
      trendColor: theme.colors.warning,
      onPress: () => navigation.navigate('ServiceOverview'),
    },
    {
      title: 'System Health',
      value: `${systemStats.systemHealth}%`,
      icon: '💚',
      color: theme.colors.success,
      trend: 'All systems operational',
      trendColor: theme.colors.success,
      onPress: () => navigation.navigate('SystemHealth'),
    },
    {
      title: 'Monthly Revenue',
      value: `$${(systemStats.monthlyRevenue / 1000).toFixed(1)}k`,
      icon: '💰',
      color: '#6C5CE7',
      trend: '+15% vs last month',
      trendColor: theme.colors.success,
      onPress: () => navigation.navigate('Revenue'),
    },
    {
      title: 'Pending Quotes',
      value: systemStats.pendingQuotes,
      icon: '📋',
      color: theme.colors.info,
      trend: 'Awaiting approval',
      trendColor: theme.colors.info,
      onPress: () => navigation.navigate('QuoteManagement'),
    },
    {
      title: 'Daily Active',
      value: systemStats.dailyActiveUsers,
      icon: '🎯',
      color: '#E17055',
      trend: '+8% vs yesterday',
      trendColor: theme.colors.success,
      onPress: () => navigation.navigate('UserActivity'),
    },
  ];

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      // Calculate system statistics
      const totalUsers = users?.length || 0;
      const totalClients = users?.filter(u => u.role === 'client').length || 0;
      const totalMechanics = users?.filter(u => u.role === 'mechanic').length || 0;
      const activeServices = serviceRequests?.filter(s => s.status === 'in-progress').length || 0;
      const pendingQuotes = serviceRequests?.filter(s => s.status === 'pending-quote').length || 0;
      const completedServices = serviceRequests?.filter(s => s.status === 'completed').length || 0;

      setSystemStats({
        totalUsers,
        totalClients,
        totalMechanics,
        totalVehicles: vehicles?.length || 0,
        activeServices,
        pendingQuotes,
        completedServices,
        systemHealth: 98,
        monthlyRevenue: 45600,
        dailyActiveUsers: Math.floor(totalUsers * 0.3),
      });
    } catch (error) {
      console.error('Error loading admin dashboard data:', error);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadDashboardData();
    setRefreshing(false);
  };

  // Recent user activity
  const recentUsers = users?.slice(0, 5) || [];

  return (
    <ScrollView
      style={globalStyles.dashboardContainer}
      contentContainerStyle={globalStyles.screenScrollContent}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={handleRefresh}
          colors={[theme.colors.primary]}
          tintColor={theme.colors.primary}
        />
      }
    >
      {/* Awesome Header Section */}
      <View style={[
        globalStyles.dashboardGradientHeader,
        {
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          backgroundColor: '#667eea',
          paddingTop: 60,
          paddingBottom: 40,
          position: 'relative',
          overflow: 'hidden',
        }
      ]}>
        {/* Background Pattern */}
        <View style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          opacity: 0.1,
        }}>
          <Text style={{
            fontSize: 120,
            color: '#fff',
            position: 'absolute',
            top: -20,
            right: -30,
            transform: [{ rotate: '15deg' }],
          }}>
            👑
          </Text>
          <Text style={{
            fontSize: 80,
            color: '#fff',
            position: 'absolute',
            bottom: -10,
            left: -20,
            transform: [{ rotate: '-15deg' }],
          }}>
            📊
          </Text>
        </View>

        <View style={globalStyles.dashboardHeaderContent}>
          <View style={globalStyles.dashboardGreeting}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
              <Text style={{
                fontSize: 32,
                marginRight: 12,
              }}>👑</Text>
              <Text style={[globalStyles.dashboardGreetingText, { fontSize: 28 }]}>
                Admin Dashboard
              </Text>
            </View>
            <Text style={globalStyles.dashboardGreetingSubtext}>
              Welcome back, {user?.name}! Monitor and manage your auto service platform
            </Text>
            <View style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginTop: 12,
              backgroundColor: 'rgba(255,255,255,0.2)',
              paddingHorizontal: 12,
              paddingVertical: 6,
              borderRadius: 20,
              alignSelf: 'flex-start',
            }}>
              <Text style={{ color: '#fff', fontSize: 12, marginRight: 6 }}>🟢</Text>
              <Text style={{ color: '#fff', fontSize: 12, fontWeight: '600' }}>
                System Status: Operational
              </Text>
            </View>
          </View>

          <TouchableOpacity
            style={[globalStyles.dashboardProfileButton, {
              backgroundColor: 'rgba(255,255,255,0.25)',
              borderWidth: 2,
              borderColor: 'rgba(255,255,255,0.3)',
            }]}
            onPress={() => navigation.navigate('Profile')}
          >
            <Text style={[globalStyles.dashboardProfileIcon, { fontSize: 28 }]}>👤</Text>
          </TouchableOpacity>
        </View>

        {/* Header Stats Row */}
        <View style={{
          flexDirection: 'row',
          justifyContent: 'space-around',
          marginTop: 24,
          paddingHorizontal: 20,
        }}>
          <View style={{ alignItems: 'center' }}>
            <Text style={{ color: '#fff', fontSize: 24, fontWeight: 'bold' }}>
              {systemStats.totalUsers}
            </Text>
            <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 12 }}>
              Total Users
            </Text>
          </View>
          <View style={{ alignItems: 'center' }}>
            <Text style={{ color: '#fff', fontSize: 24, fontWeight: 'bold' }}>
              {systemStats.activeServices}
            </Text>
            <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 12 }}>
              Active Services
            </Text>
          </View>
          <View style={{ alignItems: 'center' }}>
            <Text style={{ color: '#fff', fontSize: 24, fontWeight: 'bold' }}>
              {systemStats.systemHealth}%
            </Text>
            <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 12 }}>
              System Health
            </Text>
          </View>
        </View>
      </View>

      {/* Quick Actions */}
      <View style={globalStyles.quickActionsContainer}>
        <Text style={globalStyles.sectionTitle}>Administrative Tools</Text>
        <View style={globalStyles.quickActions}>
          {quickActions.map((action, index) => (
            <TouchableOpacity
              key={index}
              style={[
                globalStyles.quickActionCard,
                {
                  backgroundColor: action.color,
                  minHeight: 120,
                  shadowColor: action.color,
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.3,
                  shadowRadius: 8,
                  elevation: 8,
                }
              ]}
              onPress={action.onPress}
            >
              <View style={[globalStyles.quickActionIcon, {
                backgroundColor: 'rgba(255,255,255,0.25)',
                borderWidth: 2,
                borderColor: 'rgba(255,255,255,0.3)',
              }]}>
                <Text style={[globalStyles.quickActionIconText, { fontSize: 28 }]}>
                  {action.icon}
                </Text>
              </View>
              <Text style={[globalStyles.quickActionTitle, { color: '#fff', fontSize: 15 }]}>
                {action.title}
              </Text>
              <Text style={[globalStyles.quickActionSubtitle, { color: 'rgba(255,255,255,0.9)' }]}>
                {action.subtitle}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* System Metrics Grid */}
      <View style={globalStyles.metricsContainer}>
        <Text style={globalStyles.sectionTitle}>System Overview</Text>
        <View style={globalStyles.metricsGrid}>
          {systemMetrics.map((metric, index) => (
            <TouchableOpacity
              key={index}
              style={[
                globalStyles.metricCard,
                globalStyles.metricMediumContainer,
                {
                  flex: index < 2 ? 1 : index < 4 ? 1 : 1,
                  marginRight: (index % 2 === 0) ? 8 : 0,
                  marginLeft: (index % 2 === 1) ? 8 : 0,
                  marginBottom: 16,
                }
              ]}
              onPress={metric.onPress}
            >
              {/* Interactive Indicator */}
              <View style={[
                globalStyles.metricInteractiveIndicator,
                { backgroundColor: metric.color }
              ]}>
                <Text style={globalStyles.metricArrowIcon}>→</Text>
              </View>

              {/* Header */}
              <View style={globalStyles.metricCardHeader}>
                <View style={[
                  globalStyles.metricIconContainer,
                  globalStyles.metricMediumIcon,
                  { backgroundColor: metric.color + '20' }
                ]}>
                  <Text style={[
                    globalStyles.metricIconText,
                    globalStyles.metricMediumIconText,
                    { color: metric.color }
                  ]}>
                    {metric.icon}
                  </Text>
                </View>
                <View style={globalStyles.metricValueContainer}>
                  {isLoading ? (
                    <View style={[
                      globalStyles.metricLoadingSkeleton,
                      { backgroundColor: theme.colors.border }
                    ]} />
                  ) : (
                    <Text style={[
                      globalStyles.metricValue,
                      globalStyles.metricMediumValue,
                      { color: theme.colors.text }
                    ]}>
                      {metric.value}
                    </Text>
                  )}
                </View>
              </View>

              {/* Title */}
              <Text style={[
                globalStyles.metricTitle,
                globalStyles.metricMediumTitle,
                { color: theme.colors.text }
              ]}>
                {metric.title}
              </Text>

              {/* Trend */}
              {metric.trend && (
                <View style={globalStyles.metricTrendContainer}>
                  <Text style={[
                    globalStyles.metricTrend,
                    globalStyles.metricMediumTrend,
                    { color: metric.trendColor }
                  ]}>
                    {metric.trend}
                  </Text>
                </View>
              )}

              {/* Accent Line */}
              <View style={[
                globalStyles.metricAccentLine,
                { backgroundColor: metric.color }
              ]} />
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Recent Users Section */}
      <View style={globalStyles.section}>
        <View style={globalStyles.sectionHeader}>
          <Text style={globalStyles.sectionTitle}>Recent User Activity</Text>
          <TouchableOpacity onPress={() => navigation.navigate('UserManagement')}>
            <Text style={[globalStyles.authFooterLink, { color: theme.colors.primary }]}>
              View All Users
            </Text>
          </TouchableOpacity>
        </View>

        {recentUsers.length > 0 ? (
          recentUsers.map((user, index) => (
            <TouchableOpacity
              key={user.id}
              style={globalStyles.adminUserCard}
              onPress={() => navigation.navigate('UserDetails', { userId: user.id })}
            >
              <View style={globalStyles.adminUserHeader}>
                <View style={[
                  globalStyles.adminUserAvatar,
                  { 
                    backgroundColor: user.role === 'client' ? theme.colors.primary :
                                   user.role === 'mechanic' ? theme.colors.success :
                                   theme.colors.warning
                  }
                ]}>
                  <Text style={globalStyles.adminUserAvatarText}>
                    {user.name?.charAt(0).toUpperCase()}
                  </Text>
                </View>
                <View style={globalStyles.adminUserInfo}>
                  <Text style={[globalStyles.adminUserName, { color: theme.colors.text }]}>
                    {user.name}
                  </Text>
                  <Text style={[globalStyles.adminUserEmail, { color: theme.colors.textSecondary }]}>
                    {user.email}
                  </Text>
                </View>
                <View style={[
                  globalStyles.adminUserRole,
                  { 
                    backgroundColor: user.role === 'client' ? theme.colors.primary :
                                   user.role === 'mechanic' ? theme.colors.success :
                                   theme.colors.warning
                  }
                ]}>
                  <Text style={globalStyles.adminUserRoleText}>{user.role}</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))
        ) : (
          <View style={globalStyles.emptyState}>
            <Text style={globalStyles.emptyStateIcon}>👥</Text>
            <Text style={globalStyles.emptyStateTitle}>No Users Yet</Text>
            <Text style={globalStyles.emptyStateText}>
              Users will appear here as they register on the platform.
            </Text>
          </View>
        )}
      </View>

      {/* System Alerts */}
      <View style={globalStyles.section}>
        <Text style={globalStyles.sectionTitle}>System Alerts</Text>
        
        <View style={[
          globalStyles.card,
          { backgroundColor: theme.colors.success + '10', borderColor: theme.colors.success }
        ]}>
          <View style={globalStyles.cardHeader}>
            <Text style={[globalStyles.cardTitle, { color: theme.colors.success }]}>
              ✅ All Systems Operational
            </Text>
          </View>
          <Text style={[globalStyles.cardSubtitle, { color: theme.colors.text }]}>
            All services are running normally. System health is at {systemStats.systemHealth}%.
            Last maintenance: 2 days ago.
          </Text>
        </View>

        <View style={[
          globalStyles.card,
          { backgroundColor: theme.colors.info + '10', borderColor: theme.colors.info }
        ]}>
          <View style={globalStyles.cardHeader}>
            <Text style={[globalStyles.cardTitle, { color: theme.colors.info }]}>
              📊 Daily Report Ready
            </Text>
          </View>
          <Text style={[globalStyles.cardSubtitle, { color: theme.colors.text }]}>
            Your daily system report is ready for review. 
            {systemStats.dailyActiveUsers} active users today with {systemStats.activeServices} services in progress.
          </Text>
          <View style={globalStyles.cardActions}>
            <TouchableOpacity style={[
              globalStyles.buttonBase,
              globalStyles.buttonSmall,
              { backgroundColor: theme.colors.info }
            ]}>
              <Text style={globalStyles.buttonText}>View Report</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default AdminDashboard;