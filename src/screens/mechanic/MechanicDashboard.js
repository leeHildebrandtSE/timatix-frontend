// src/screens/mechanic/MechanicDashboard.js - Fully Refactored with Global Styles
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Alert,
} from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { useTheme, useGlobalStyles } from '../../context/ThemeContext';
import { getStatusColor, getPriorityColor } from '../../styles/globalStyles';

const MechanicDashboard = ({ navigation }) => {
  const { user } = useAuth();
  const { serviceRequests, quotes, isLoading, addNotification } = useApp();
  const { theme } = useTheme();
  const globalStyles = useGlobalStyles();

  const [refreshing, setRefreshing] = useState(false);
  const [mechanicStats, setMechanicStats] = useState({
    totalJobs: 0,
    activeJobs: 0,
    pendingJobs: 0,
    completedJobs: 0,
    urgentJobs: 0,
    todayEarnings: 0,
    weeklyEarnings: 0,
    monthlyEarnings: 0,
    pendingQuotes: 0,
    acceptedQuotes: 0,
    efficiency: 95,
  });

  // Quick actions for mechanics
  const quickActions = [
    {
      title: 'Active Jobs',
      subtitle: 'View current work',
      icon: '🔧',
      color: '#FF6B6B',
      count: mechanicStats.activeJobs,
      onPress: () => navigation.navigate('JobList', { filter: 'active' }),
    },
    {
      title: 'Create Quote',
      subtitle: 'New estimate',
      icon: '💰',
      color: '#4ECDC4',
      onPress: () => navigation.navigate('CreateQuote'),
    },
    {
      title: 'Pending Jobs',
      subtitle: 'Awaiting start',
      icon: '⏳',
      color: '#FFE66D',
      count: mechanicStats.pendingJobs,
      onPress: () => navigation.navigate('JobList', { filter: 'pending' }),
    },
    {
      title: 'Job History',
      subtitle: 'Completed work',
      icon: '📋',
      color: '#A8E6CF',
      count: mechanicStats.completedJobs,
      onPress: () => navigation.navigate('JobHistory'),
    },
  ];

  // Performance metrics
  const performanceMetrics = [
    {
      title: 'Active Jobs',
      value: mechanicStats.activeJobs,
      icon: '🔧',
      color: theme.colors.primary,
      trend: `${mechanicStats.pendingJobs} pending`,
      trendColor: theme.colors.warning,
      onPress: () => navigation.navigate('JobList'),
    },
    {
      title: 'Today\'s Earnings',
      value: `$${mechanicStats.todayEarnings}`,
      icon: '💵',
      color: theme.colors.success,
      trend: `$${mechanicStats.weeklyEarnings} this week`,
      trendColor: theme.colors.success,
      onPress: () => navigation.navigate('Earnings'),
    },
    {
      title: 'Efficiency',
      value: `${mechanicStats.efficiency}%`,
      icon: '⚡',
      color: '#FF6B6B',
      trend: '+2% this week',
      trendColor: theme.colors.success,
      onPress: () => navigation.navigate('Performance'),
    },
    {
      title: 'Pending Quotes',
      value: mechanicStats.pendingQuotes,
      icon: '📊',
      color: theme.colors.info,
      trend: 'Awaiting approval',
      trendColor: theme.colors.info,
      onPress: () => navigation.navigate('QuoteManagement'),
    },
    {
      title: 'Urgent Jobs',
      value: mechanicStats.urgentJobs,
      icon: '🚨',
      color: theme.colors.error,
      trend: 'High priority',
      trendColor: theme.colors.error,
      onPress: () => navigation.navigate('JobList', { filter: 'urgent' }),
    },
    {
      title: 'Monthly Total',
      value: `$${(mechanicStats.monthlyEarnings / 1000).toFixed(1)}k`,
      icon: '📈',
      color: '#6C5CE7',
      trend: '+18% vs last month',
      trendColor: theme.colors.success,
      onPress: () => navigation.navigate('MonthlyReport'),
    },
  ];

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      // Filter jobs assigned to this mechanic
      const mechanicJobs = serviceRequests?.filter(job => 
        job.assignedMechanicId === user?.id
      ) || [];

      const activeJobs = mechanicJobs.filter(job => job.status === 'in-progress').length;
      const pendingJobs = mechanicJobs.filter(job => job.status === 'assigned').length;
      const completedJobs = mechanicJobs.filter(job => job.status === 'completed').length;
      const urgentJobs = mechanicJobs.filter(job => job.priority === 'urgent').length;

      // Filter quotes created by this mechanic
      const mechanicQuotes = quotes?.filter(quote => 
        quote.mechanicId === user?.id
      ) || [];

      const pendingQuotes = mechanicQuotes.filter(quote => quote.status === 'pending').length;
      const acceptedQuotes = mechanicQuotes.filter(quote => quote.status === 'accepted').length;

      // Calculate earnings (mock data for demonstration)
      const todayEarnings = 285;
      const weeklyEarnings = 1240;
      const monthlyEarnings = 4650;

      setMechanicStats({
        totalJobs: mechanicJobs.length,
        activeJobs,
        pendingJobs,
        completedJobs,
        urgentJobs,
        todayEarnings,
        weeklyEarnings,
        monthlyEarnings,
        pendingQuotes,
        acceptedQuotes,
        efficiency: 95,
      });
    } catch (error) {
      console.error('Error loading mechanic dashboard data:', error);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadDashboardData();
    setRefreshing(false);
  };

  const handleQuickAction = (action) => {
    if (action.onPress) {
      action.onPress();
    }
  };

  // Recent jobs for this mechanic
  const recentJobs = serviceRequests?.filter(job => 
    job.assignedMechanicId === user?.id
  ).slice(0, 4) || [];

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
          background: 'linear-gradient(135deg, #FF6B6B 0%, #FF8E53 100%)',
          backgroundColor: '#FF6B6B',
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
          opacity: 0.15,
        }}>
          <Text style={{
            fontSize: 100,
            color: '#fff',
            position: 'absolute',
            top: -10,
            right: -20,
            transform: [{ rotate: '25deg' }],
          }}>
            🔧
          </Text>
          <Text style={{
            fontSize: 70,
            color: '#fff',
            position: 'absolute',
            bottom: -5,
            left: -15,
            transform: [{ rotate: '-20deg' }],
          }}>
            ⚙️
          </Text>
          <Text style={{
            fontSize: 50,
            color: '#fff',
            position: 'absolute',
            top: 20,
            left: '40%',
            transform: [{ rotate: '45deg' }],
          }}>
            🛠️
          </Text>
        </View>

        <View style={globalStyles.dashboardHeaderContent}>
          <View style={globalStyles.dashboardGreeting}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
              <Text style={{
                fontSize: 32,
                marginRight: 12,
              }}>🔧</Text>
              <Text style={[globalStyles.dashboardGreetingText, { fontSize: 28 }]}>
                Workshop
              </Text>
            </View>
            <Text style={globalStyles.dashboardGreetingSubtext}>
              Hey {user?.name}! Ready to get your hands dirty today?
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
              <Text style={{ color: '#fff', fontSize: 12, marginRight: 6 }}>⚡</Text>
              <Text style={{ color: '#fff', fontSize: 12, fontWeight: '600' }}>
                Efficiency: {mechanicStats.efficiency}%
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
            <Text style={{ color: '#fff', fontSize: 12, fontWeight: '600' }}>
              View Profile
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

export default MechanicDashboard;