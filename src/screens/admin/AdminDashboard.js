// src/screens/admin/AdminDashboard.js - Refactored version
import React, { useState, useEffect } from 'react';
import { ScrollView, RefreshControl, TouchableOpacity, View, Text, Alert } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { useTheme, useGlobalStyles } from '../../context/ThemeContext';
import { 
  withScreenWrapper,
  WelcomeHeader,
  SectionContainer,
  QuickActionsGrid,
  MetricsGrid,
  EmptyState
} from '../../hoc/withScreenLayout';
import ServiceCard from '../../components/cards/ServiceCard';
import Button from '../../components/common/Button';

const AdminDashboard = ({ navigation }) => {
  const { user } = useAuth();
  const { serviceRequests, users, isLoading, setLoading, addNotification } = useApp();
  const { theme } = useTheme();
  const globalStyles = useGlobalStyles();
  
  const [refreshing, setRefreshing] = useState(false);
  const [dashboardData, setDashboardData] = useState({
    totalUsers: 0,
    totalMechanics: 0,
    activeServices: 0,
    totalRevenue: 0,
    pendingQuotes: 0,
    completedServices: 0,
    todayServices: 0,
    weeklyGrowth: 0,
  });

  useEffect(() => {
    loadDashboardData();
  }, []);

  useEffect(() => {
    calculateMetrics();
  }, [serviceRequests, users]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      await Promise.all([
        loadUsers(),
        loadServiceRequests(),
        loadSystemMetrics(),
      ]);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      Alert.alert('Error', 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const loadUsers = async () => {
    // Mock data - replace with actual API call
  };

  const loadServiceRequests = async () => {
    // Mock data - replace with actual API call
  };

  const loadSystemMetrics = async () => {
    // Mock data - replace with actual API call
  };

  const calculateMetrics = () => {
    const totalUsers = users.filter(u => u.role === 'CLIENT').length;
    const totalMechanics = users.filter(u => u.role === 'MECHANIC').length;
    const activeServices = serviceRequests.filter(req => 
      ['CONFIRMED', 'IN_PROGRESS'].includes(req.status)
    ).length;
    const pendingQuotes = serviceRequests.filter(req => 
      req.status === 'QUOTE_SENT'
    ).length;
    const completedServices = serviceRequests.filter(req => 
      req.status === 'COMPLETED'
    ).length;
    
    const today = new Date().toDateString();
    const todayServices = serviceRequests.filter(req => 
      new Date(req.preferredDate).toDateString() === today
    ).length;
    
    const totalRevenue = serviceRequests
      .filter(req => req.status === 'COMPLETED' && req.quote?.totalAmount)
      .reduce((sum, req) => sum + req.quote.totalAmount, 0);

    const weeklyGrowth = Math.round(Math.random() * 20 + 5);

    setDashboardData({
      totalUsers,
      totalMechanics,
      activeServices,
      totalRevenue,
      pendingQuotes,
      completedServices,
      todayServices,
      weeklyGrowth,
    });
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadDashboardData();
    setRefreshing(false);
  };

  const handleServicePress = (service) => {
    navigation.navigate('ServiceDetails', { serviceId: service.id });
  };

  const handleApproveService = (service) => {
    Alert.alert(
      'Approve Service',
      `Approve the service request for ${service.serviceType}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Approve', 
          onPress: async () => {
            try {
              addNotification({
                title: 'Service Approved',
                message: `Service request for ${service.serviceType} has been approved.`,
                type: 'success',
              });
            } catch (error) {
              Alert.alert('Error', 'Failed to approve service');
            }
          }
        },
      ]
    );
  };

  // Get recent service requests that need admin attention
  const pendingServices = serviceRequests
    .filter(req => ['PENDING', 'QUOTE_SENT'].includes(req.status))
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  // Get urgent services
  const urgentServices = serviceRequests
    .filter(req => req.priority === 'URGENT' && req.status !== 'COMPLETED')
    .slice(0, 3);

  // Quick actions configuration
  const quickActions = [
    {
      title: 'System Overview',
      subtitle: 'View detailed metrics',
      icon: '📊',
      color: theme.colors.primary,
      onPress: () => navigation.navigate('SystemOverview')
    },
    {
      title: 'Manage Users',
      subtitle: 'Add, edit, or remove users',
      icon: '👥',
      color: theme.colors.secondary,
      onPress: () => navigation.navigate('UserManagement')
    },
    {
      title: 'Reports',
      subtitle: 'Generate insights',
      icon: '📈',
      color: theme.colors.success,
      onPress: () => navigation.navigate('Reports')
    },
    {
      title: 'Settings',
      subtitle: 'Configure platform',
      icon: '⚙️',
      color: theme.colors.warning,
      onPress: () => navigation.navigate('AdminSettings')
    }
  ];

  // Key metrics configuration
  const keyMetrics = [
    {
      title: 'Total Users',
      value: dashboardData.totalUsers.toString(),
      icon: '👥',
      color: theme.colors.primary,
      trend: `+${dashboardData.weeklyGrowth}% this week`,
      size: 'medium',
      onPress: () => navigation.navigate('UserManagement')
    },
    {
      title: 'Active Mechanics',
      value: dashboardData.totalMechanics.toString(),
      icon: '🔧',
      color: theme.colors.secondary,
      trend: 'All available',
      size: 'medium'
    },
    {
      title: 'Active Services',
      value: dashboardData.activeServices.toString(),
      icon: '⚙️',
      color: theme.colors.warning,
      trend: dashboardData.activeServices > 0 ? "In progress" : "All caught up",
      size: 'medium'
    },
    {
      title: 'Total Revenue',
      value: `R ${dashboardData.totalRevenue.toFixed(0)}`,
      icon: '💰',
      color: theme.colors.success,
      trend: `+${Math.round(dashboardData.weeklyGrowth * 0.8)}% this month`,
      size: 'medium'
    }
  ];

  // Service overview metrics
  const serviceMetrics = [
    {
      title: 'Pending Quotes',
      value: dashboardData.pendingQuotes.toString(),
      icon: '📋',
      color: theme.colors.warning,
      trend: dashboardData.pendingQuotes > 0 ? "Needs attention" : "All processed",
      size: 'small'
    },
    {
      title: 'Completed Today',
      value: dashboardData.todayServices.toString(),
      icon: '✅',
      color: theme.colors.success,
      trend: "Today's progress",
      size: 'small'
    },
    {
      title: 'Total Completed',
      value: dashboardData.completedServices.toString(),
      icon: '🎯',
      color: theme.colors.info,
      trend: "All time",
      size: 'small'
    }
  ];

  const renderSystemHealth = () => (
    <SectionContainer title="System Health" background>
      <View style={{ gap: 16 }}>
        {[
          { title: 'Database', status: 'Operational (99.9%)', color: theme.colors.success },
          { title: 'API Response', status: '120ms (Excellent)', color: theme.colors.success },
          { title: 'Storage', status: '78% used (Good)', color: theme.colors.warning },
          { title: 'Active Users', status: `${dashboardData.totalUsers + dashboardData.totalMechanics} online`, color: theme.colors.info }
        ].map((item, index) => (
          <View key={index} style={[globalStyles.cardHeader, { alignItems: 'center' }]}>
            <View 
              style={{
                width: 12, 
                height: 12, 
                borderRadius: 6, 
                backgroundColor: item.color, 
                marginRight: 16 
              }} 
            />
            <Text style={[{ flex: 1, fontWeight: '600' }]}>{item.title}</Text>
            <Text style={[globalStyles.opacity70, { fontSize: 12 }]}>{item.status}</Text>
          </View>
        ))}
      </View>
    </SectionContainer>
  );

  const renderUrgentServices = () => (
    urgentServices.length > 0 ? (
      <SectionContainer title={`🚨 Urgent Services (${urgentServices.length})`} background>
        {urgentServices.map((service) => (
          <View key={service.id} style={{ marginBottom: 12 }}>
            <ServiceCard
              service={service}
              onPress={handleServicePress}
              onApprove={handleApproveService}
              userRole="ADMIN"
              showAdminActions={true}
            />
          </View>
        ))}
      </SectionContainer>
    ) : null
  );

  const renderPendingServices = () => (
    <SectionContainer 
      title={`Pending Services (${pendingServices.length})`}
    >
      {serviceRequests.length > 5 && (
        <TouchableOpacity 
          onPress={() => navigation.navigate('ServiceRequests')} 
          style={{ alignSelf: 'flex-end', marginBottom: 16 }}
        >
          <Text style={[{ color: theme.colors.primary, fontWeight: '600', fontSize: 14 }]}>
            View All ({serviceRequests.length})
          </Text>
        </TouchableOpacity>
      )}
      
      {pendingServices.length > 0 ? (
        pendingServices.map((service, index) => (
          <View key={service.id} style={index < pendingServices.length - 1 ? { marginBottom: 16 } : {}}>
            <ServiceCard
              service={service}
              onPress={handleServicePress}
              onApprove={handleApproveService}
              userRole="ADMIN"
              showAdminActions={true}
            />
          </View>
        ))
      ) : (
        <EmptyState
          icon="✅"
          title="All caught up!"
          subtitle="No pending services require your attention"
        />
      )}
    </SectionContainer>
  );

  return (
    <ScrollView
      style={globalStyles.scrollView}
      contentContainerStyle={globalStyles.scrollContent}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
      showsVerticalScrollIndicator={false}
    >
      {/* Welcome Header */}
      <WelcomeHeader
        user={user}
        subtitle="Here's what's happening with your platform"
        rightWidget={
          <View style={{ alignItems: 'center' }}>
            <Text style={[globalStyles.greeting, { color: '#fff', fontSize: 28, marginBottom: 4 }]}>
              {dashboardData.todayServices}
            </Text>
            <Text style={[globalStyles.subGreeting, { fontSize: 12 }]}>
              Today's Services
            </Text>
          </View>
        }
      />

      {/* Quick Actions */}
      <QuickActionsGrid 
        actions={quickActions}
        style={{ paddingTop: 32 }}
      />

      {/* Key Metrics */}
      <SectionContainer title="Key Metrics">
        <MetricsGrid metrics={keyMetrics} />
      </SectionContainer>

      {/* Service Overview */}
      <SectionContainer title="Service Overview">
        <MetricsGrid metrics={serviceMetrics} />
      </SectionContainer>

      {/* Urgent Services Alert */}
      {renderUrgentServices()}

      {/* Pending Services */}
      {renderPendingServices()}

      {/* System Health */}
      {renderSystemHealth()}
    </ScrollView>
  );
};

// Export with screen wrapper
export default withScreenWrapper(AdminDashboard, {
  layout: 'dashboard',
  loading: true,
  refresh: false // We handle refresh manually
});