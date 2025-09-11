// =============================================================================
// REFACTORED ADMIN SCREENS WITH GLOBAL STYLES
// =============================================================================

// src/screens/admin/SystemOverview.js - System Overview Screen
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Dimensions,
} from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { useTheme, useGlobalStyles } from '../../context/ThemeContext';

const { width } = Dimensions.get('window');

const SystemOverview = ({ navigation }) => {
  const { user } = useAuth();
  const { users, serviceRequests, vehicles, quotes, isLoading } = useApp();
  const { theme } = useTheme();
  const globalStyles = useGlobalStyles();

  const [refreshing, setRefreshing] = useState(false);
  const [systemMetrics, setSystemMetrics] = useState({
    totalUsers: 0,
    activeUsers: 0,
    totalServices: 0,
    completedServices: 0,
    systemHealth: 98,
    serverUptime: '99.9%',
    responseTime: '127ms',
    errorRate: '0.02%',
    dailyActiveUsers: 0,
    weeklyNewUsers: 0,
    monthlyRevenue: 0,
    systemLoad: 23,
  });

  // System performance metrics
  const performanceMetrics = [
    {
      title: 'System Health',
      value: `${systemMetrics.systemHealth}%`,
      icon: '💚',
      color: theme.colors.success,
      trend: 'All systems operational',
      trendColor: theme.colors.success,
      onPress: () => navigation.navigate('SystemHealth'),
    },
    {
      title: 'Server Uptime',
      value: systemMetrics.serverUptime,
      icon: '⚡',
      color: '#00B894',
      trend: 'Last 30 days',
      trendColor: theme.colors.success,
      onPress: () => navigation.navigate('UptimeStats'),
    },
    {
      title: 'Response Time',
      value: systemMetrics.responseTime,
      icon: '🚀',
      color: theme.colors.info,
      trend: 'Average response',
      trendColor: theme.colors.info,
      onPress: () => navigation.navigate('PerformanceMetrics'),
    },
    {
      title: 'Error Rate',
      value: systemMetrics.errorRate,
      icon: '🛡️',
      color: theme.colors.warning,
      trend: 'Within normal range',
      trendColor: theme.colors.success,
      onPress: () => navigation.navigate('ErrorLogs'),
    },
    {
      title: 'Active Users',
      value: systemMetrics.dailyActiveUsers,
      icon: '👥',
      color: theme.colors.primary,
      trend: '+12% vs yesterday',
      trendColor: theme.colors.success,
      onPress: () => navigation.navigate('UserActivity'),
    },
    {
      title: 'System Load',
      value: `${systemMetrics.systemLoad}%`,
      icon: '📊',
      color: '#6C5CE7',
      trend: 'CPU & Memory usage',
      trendColor: theme.colors.info,
      onPress: () => navigation.navigate('ResourceUsage'),
    },
  ];

  // Quick system actions
  const systemActions = [
    {
      title: 'Database Backup',
      subtitle: 'Create system backup',
      icon: '💾',
      color: '#00B894',
      onPress: () => navigation.navigate('DatabaseManagement'),
    },
    {
      title: 'System Logs',
      subtitle: 'View system logs',
      icon: '📋',
      color: theme.colors.info,
      onPress: () => navigation.navigate('SystemLogs'),
    },
    {
      title: 'User Analytics',
      subtitle: 'View user analytics',
      icon: '📈',
      color: '#6C5CE7',
      onPress: () => navigation.navigate('UserAnalytics'),
    },
    {
      title: 'System Settings',
      subtitle: 'Configure system',
      icon: '⚙️',
      color: theme.colors.textSecondary,
      onPress: () => navigation.navigate('SystemSettings'),
    },
  ];

  useEffect(() => {
    loadSystemOverview();
  }, []);

  const loadSystemOverview = async () => {
    try {
      // Calculate system metrics
      const totalUsers = users?.length || 0;
      const activeUsers = users?.filter(u => u.lastActive && 
        new Date(u.lastActive) > new Date(Date.now() - 24 * 60 * 60 * 1000)
      ).length || 0;
      
      const totalServices = serviceRequests?.length || 0;
      const completedServices = serviceRequests?.filter(s => s.status === 'completed').length || 0;
      
      setSystemMetrics({
        totalUsers,
        activeUsers,
        totalServices,
        completedServices,
        systemHealth: 98,
        serverUptime: '99.9%',
        responseTime: '127ms',
        errorRate: '0.02%',
        dailyActiveUsers: Math.floor(totalUsers * 0.3),
        weeklyNewUsers: Math.floor(totalUsers * 0.1),
        monthlyRevenue: 125400,
        systemLoad: 23,
      });
    } catch (error) {
      console.error('Error loading system overview:', error);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadSystemOverview();
    setRefreshing(false);
  };

  const getSystemHealthColor = () => {
    if (systemMetrics.systemHealth >= 95) return theme.colors.success;
    if (systemMetrics.systemHealth >= 85) return theme.colors.warning;
    return theme.colors.error;
  };

  return (
    <View style={globalStyles.systemOverviewContainer}>
      {/* Awesome Header */}
      <View style={[
        globalStyles.dashboardGradientHeader,
        {
          background: 'linear-gradient(135deg, #A770EF 0%, #CF8BF3 50%, #FDB99B 100%)',
          backgroundColor: '#A770EF',
          paddingTop: 60,
          paddingBottom: 30,
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
            📊
          </Text>
          <Text style={{
            fontSize: 80,
            color: '#fff',
            position: 'absolute',
            bottom: -10,
            left: -20,
            transform: [{ rotate: '-15deg' }],
          }}>
            ⚙️
          </Text>
          <Text style={{
            fontSize: 60,
            color: '#fff',
            position: 'absolute',
            top: 30,
            left: '40%',
            transform: [{ rotate: '30deg' }],
          }}>
            💻
          </Text>
        </View>

        <View style={globalStyles.dashboardHeaderContent}>
          <View style={globalStyles.dashboardGreeting}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
              <Text style={{ fontSize: 32, marginRight: 12 }}>📊</Text>
              <Text style={[globalStyles.dashboardGreetingText, { fontSize: 28 }]}>
                System Overview
              </Text>
            </View>
            <Text style={globalStyles.dashboardGreetingSubtext}>
              Monitor system health, performance, and analytics
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
              <Text style={{ color: '#fff', fontSize: 12, marginRight: 6 }}>
                {systemMetrics.systemHealth >= 95 ? '🟢' : systemMetrics.systemHealth >= 85 ? '🟡' : '🔴'}
              </Text>
              <Text style={{ color: '#fff', fontSize: 12, fontWeight: '600' }}>
                System Health: {systemMetrics.systemHealth}%
              </Text>
            </View>
          </View>

          <TouchableOpacity
            style={[globalStyles.dashboardProfileButton, {
              backgroundColor: 'rgba(255,255,255,0.25)',
              borderWidth: 2,
              borderColor: 'rgba(255,255,255,0.3)',
            }]}
            onPress={() => navigation.navigate('SystemAlerts')}
          >
            <Text style={[globalStyles.dashboardProfileIcon, { fontSize: 28 }]}>🔔</Text>
          </TouchableOpacity>
        </View>

        {/* Header Stats */}
        <View style={{
          flexDirection: 'row',
          justifyContent: 'space-around',
          marginTop: 20,
          paddingHorizontal: 20,
        }}>
          <View style={{ alignItems: 'center' }}>
            <Text style={{ color: '#fff', fontSize: 20, fontWeight: 'bold' }}>
              {systemMetrics.totalUsers}
            </Text>
            <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 12 }}>
              Total Users
            </Text>
          </View>
          <View style={{ alignItems: 'center' }}>
            <Text style={{ color: '#fff', fontSize: 20, fontWeight: 'bold' }}>
              {systemMetrics.serverUptime}
            </Text>
            <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 12 }}>
              Uptime
            </Text>
          </View>
          <View style={{ alignItems: 'center' }}>
            <Text style={{ color: '#fff', fontSize: 20, fontWeight: 'bold' }}>
              {systemMetrics.responseTime}
            </Text>
            <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 12 }}>
              Response
            </Text>
          </View>
        </View>
      </View>

      <ScrollView
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
        {/* Quick System Actions */}
        <View style={globalStyles.quickActionsContainer}>
          <Text style={globalStyles.sectionTitle}>System Management</Text>
          <View style={globalStyles.quickActions}>
            {systemActions.map((action, index) => (
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

        {/* System Performance Metrics */}
        <View style={globalStyles.metricsContainer}>
          <Text style={globalStyles.sectionTitle}>Performance Metrics</Text>
          <View style={globalStyles.systemStatsGrid}>
            {performanceMetrics.map((metric, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  globalStyles.systemStatCard,
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

                {/* Icon */}
                <View style={[
                  globalStyles.systemStatIcon,
                  { backgroundColor: metric.color }
                ]}>
                  <Text style={globalStyles.systemStatIconText}>
                    {metric.icon}
                  </Text>
                </View>

                {/* Value */}
                {isLoading ? (
                  <View style={[
                    globalStyles.metricLoadingSkeleton,
                    { backgroundColor: theme.colors.border, marginBottom: 8 }
                  ]} />
                ) : (
                  <Text style={[
                    globalStyles.systemStatValue,
                    { color: theme.colors.text }
                  ]}>
                    {metric.value}
                  </Text>
                )}

                {/* Label */}
                <Text style={[
                  globalStyles.systemStatLabel,
                  { color: theme.colors.textSecondary }
                ]}>
                  {metric.title}
                </Text>

                {/* Trend */}
                {metric.trend && (
                  <Text style={[
                    theme.typography.caption,
                    { color: metric.trendColor, marginTop: 4, textAlign: 'center' }
                  ]}>
                    {metric.trend}
                  </Text>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* System Charts */}
        <View style={globalStyles.systemChartsSection}>
          <Text style={globalStyles.sectionTitle}>System Analytics</Text>
          
          {/* User Growth Chart */}
          <View style={globalStyles.systemChartCard}>
            <Text style={[globalStyles.systemChartTitle, { color: theme.colors.text }]}>
              User Growth (Last 30 Days)
            </Text>
            <View style={{
              height: 200,
              backgroundColor: theme.colors.primary + '10',
              borderRadius: 8,
              justifyContent: 'center',
              alignItems: 'center',
              borderWidth: 1,
              borderColor: theme.colors.primary + '30',
            }}>
              <Text style={{ fontSize: 48, marginBottom: 8 }}>📈</Text>
              <Text style={[theme.typography.body1, { color: theme.colors.primary, fontWeight: 'bold' }]}>
                +{systemMetrics.weeklyNewUsers} New Users
              </Text>
              <Text style={[theme.typography.caption, { color: theme.colors.textSecondary }]}>
                18% increase from last month
              </Text>
            </View>
          </View>

          {/* Service Activity Chart */}
          <View style={globalStyles.systemChartCard}>
            <Text style={[globalStyles.systemChartTitle, { color: theme.colors.text }]}>
              Service Activity
            </Text>
            <View style={{
              height: 200,
              backgroundColor: theme.colors.success + '10',
              borderRadius: 8,
              justifyContent: 'center',
              alignItems: 'center',
              borderWidth: 1,
              borderColor: theme.colors.success + '30',
            }}>
              <Text style={{ fontSize: 48, marginBottom: 8 }}>🔧</Text>
              <Text style={[theme.typography.body1, { color: theme.colors.success, fontWeight: 'bold' }]}>
                {systemMetrics.totalServices} Total Services
              </Text>
              <Text style={[theme.typography.caption, { color: theme.colors.textSecondary }]}>
                {Math.round((systemMetrics.completedServices / systemMetrics.totalServices) * 100)}% completion rate
              </Text>
            </View>
          </View>

          {/* Revenue Chart */}
          <View style={globalStyles.systemChartCard}>
            <Text style={[globalStyles.systemChartTitle, { color: theme.colors.text }]}>
              Monthly Revenue
            </Text>
            <View style={{
              height: 200,
              backgroundColor: '#6C5CE7' + '10',
              borderRadius: 8,
              justifyContent: 'center',
              alignItems: 'center',
              borderWidth: 1,
              borderColor: '#6C5CE7' + '30',
            }}>
              <Text style={{ fontSize: 48, marginBottom: 8 }}>💰</Text>
              <Text style={[theme.typography.body1, { color: '#6C5CE7', fontWeight: 'bold' }]}>
                ${(systemMetrics.monthlyRevenue / 1000).toFixed(1)}k
              </Text>
              <Text style={[theme.typography.caption, { color: theme.colors.textSecondary }]}>
                +15% from last month
              </Text>
            </View>
          </View>
        </View>

        {/* System Alerts */}
        <View style={globalStyles.section}>
          <Text style={globalStyles.sectionTitle}>System Status</Text>
          
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
              All services are running normally. System health is at {systemMetrics.systemHealth}%.
              No critical alerts or maintenance windows scheduled.
            </Text>
          </View>

          <View style={[
            globalStyles.card,
            { backgroundColor: theme.colors.info + '10', borderColor: theme.colors.info }
          ]}>
            <View style={globalStyles.cardHeader}>
              <Text style={[globalStyles.cardTitle, { color: theme.colors.info }]}>
                📊 Performance Summary
              </Text>
            </View>
            <Text style={[globalStyles.cardSubtitle, { color: theme.colors.text }]}>
              Response time: {systemMetrics.responseTime} • Error rate: {systemMetrics.errorRate} • 
              Uptime: {systemMetrics.serverUptime} • Load: {systemMetrics.systemLoad}%
            </Text>
            <View style={globalStyles.cardActions}>
              <TouchableOpacity style={[
                globalStyles.buttonBase,
                globalStyles.buttonSmall,
                { backgroundColor: theme.colors.info }
              ]}>
                <Text style={globalStyles.buttonText}>View Details</Text>
              </TouchableOpacity>
            </View>
          </View>

          {systemMetrics.systemLoad > 80 && (
            <View style={[
              globalStyles.card,
              { backgroundColor: theme.colors.warning + '10', borderColor: theme.colors.warning }
            ]}>
              <View style={globalStyles.cardHeader}>
                <Text style={[globalStyles.cardTitle, { color: theme.colors.warning }]}>
                  ⚠️ High System Load
                </Text>
              </View>
              <Text style={[globalStyles.cardSubtitle, { color: theme.colors.text }]}>
                Current system load is {systemMetrics.systemLoad}%. Consider scaling resources 
                if load remains high.
              </Text>
              <View style={globalStyles.cardActions}>
                <TouchableOpacity style={[
                  globalStyles.buttonBase,
                  globalStyles.buttonSmall,
                  { backgroundColor: theme.colors.warning }
                ]}>
                  <Text style={globalStyles.buttonText}>Scale Resources</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
};