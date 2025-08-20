import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { useTheme } from '../../context/ThemeContext';
import MetricCard from '../../components/cards/MetricCard';
import ServiceCard from '../../components/cards/ServiceCard';
import Button from '../../components/common/Button';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const AdminDashboard = ({ navigation }) => {
  const { user } = useAuth();
  const { 
    serviceRequests, 
    users, 
    isLoading,
    setLoading,
    addNotification 
  } = useApp();
  const { theme } = useTheme();
  
  const [refreshing, setRefreshing] = useState(false);
  const [dashboardData, setDashboardData] = useState({
    totalUsers: 0,
    totalMechanics: 0,
    activeServices: 0,
    totalRevenue: 0,
    pendingQuotes: 0,
    completedServices: 0,
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
      // Simulate API calls - replace with actual API calls
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
    // const users = await userService.getAllUsers();
    // setUsers(users);
  };

  const loadServiceRequests = async () => {
    // Mock data - replace with actual API call
    // const requests = await serviceRequestsService.getAllRequests();
    // setServiceRequests(requests);
  };

  const loadSystemMetrics = async () => {
    // Mock data - replace with actual API call
    // const metrics = await analyticsService.getSystemMetrics();
    // setDashboardData(metrics);
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
    
    const totalRevenue = serviceRequests
      .filter(req => req.status === 'COMPLETED' && req.quote?.totalAmount)
      .reduce((sum, req) => sum + req.quote.totalAmount, 0);

    setDashboardData({
      totalUsers,
      totalMechanics,
      activeServices,
      totalRevenue,
      pendingQuotes,
      completedServices,
    });
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadDashboardData();
    setRefreshing(false);
  };

  const handleViewSystemOverview = () => {
    navigation.navigate('SystemOverview');
  };

  const handleViewUserManagement = () => {
    navigation.navigate('UserManagement');
  };

  const handleViewAllServices = () => {
    navigation.navigate('ServiceRequests');
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
              // API call to approve service
              // await serviceRequestsService.approveService(service.id);
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

  if (isLoading && !refreshing) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <LoadingSpinner message="Loading admin dashboard..." />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.greeting, theme.typography.h3]}>
            Admin Dashboard
          </Text>
          <Text style={[styles.subGreeting, theme.typography.body2]}>
            System overview and management
          </Text>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <Button
            title="System Overview"
            onPress={handleViewSystemOverview}
            style={styles.primaryAction}
          />
          <Button
            title="Manage Users"
            variant="outline"
            onPress={handleViewUserManagement}
            style={styles.secondaryAction}
          />
        </View>

        {/* Key Metrics */}
        <View style={styles.metricsContainer}>
          <Text style={[styles.sectionTitle, theme.typography.h5]}>
            System Metrics
          </Text>
          
          <View style={styles.metricsGrid}>
            <MetricCard
              title="Total Users"
              value={dashboardData.totalUsers.toString()}
              icon="👥"
              color={theme.colors.primary}
              size="small"
              style={styles.metricCard}
              onPress={handleViewUserManagement}
            />
            
            <MetricCard
              title="Mechanics"
              value={dashboardData.totalMechanics.toString()}
              icon="🔧"
              color={theme.colors.secondary}
              size="small"
              style={styles.metricCard}
            />
            
            <MetricCard
              title="Active Services"
              value={dashboardData.activeServices.toString()}
              icon="⚙️"
              color={theme.colors.warning}
              size="small"
              style={styles.metricCard}
            />
            
            <MetricCard
              title="Revenue"
              value={`R ${dashboardData.totalRevenue.toFixed(0)}`}
              icon="💰"
              color={theme.colors.success}
              size="small"
              style={styles.metricCard}
            />
          </View>
        </View>

        {/* Service Overview */}
        <View style={styles.metricsContainer}>
          <Text style={[styles.sectionTitle, theme.typography.h5]}>
            Service Overview
          </Text>
          
          <View style={styles.metricsGrid}>
            <MetricCard
              title="Pending Quotes"
              value={dashboardData.pendingQuotes.toString()}
              icon="📋"
              color={theme.colors.warning}
              size="small"
              style={styles.metricCard}
            />
            
            <MetricCard
              title="Completed"
              value={dashboardData.completedServices.toString()}
              icon="✅"
              color={theme.colors.success}
              size="small"
              style={styles.metricCard}
            />
          </View>
        </View>

        {/* Pending Services Requiring Attention */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, theme.typography.h5]}>
              Pending Services
            </Text>
            {serviceRequests.length > 5 && (
              <TouchableOpacity onPress={handleViewAllServices}>
                <Text style={[styles.viewAllText, { color: theme.colors.primary }]}>
                  View All
                </Text>
              </TouchableOpacity>
            )}
          </View>
          
          {pendingServices.length > 0 ? (
            pendingServices.map((service) => (
              <ServiceCard
                key={service.id}
                service={service}
                onPress={handleServicePress}
                onApprove={handleApproveService}
                userRole="ADMIN"
                showAdminActions={true}
              />
            ))
          ) : (
            <View style={[styles.emptyState, { backgroundColor: theme.colors.surface }]}>
              <Text style={[styles.emptyStateText, theme.typography.body2]}>
                No pending services requiring attention
              </Text>
            </View>
          )}
        </View>

        {/* System Health */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, theme.typography.h5]}>
            System Health
          </Text>
          
          <View style={[styles.healthCard, { backgroundColor: theme.colors.surface }]}>
            <View style={styles.healthItem}>
              <View style={[styles.healthIndicator, { backgroundColor: theme.colors.success }]} />
              <Text style={[styles.healthText, theme.typography.body2]}>
                Database Connection: Healthy
              </Text>
            </View>
            
            <View style={styles.healthItem}>
              <View style={[styles.healthIndicator, { backgroundColor: theme.colors.success }]} />
              <Text style={[styles.healthText, theme.typography.body2]}>
                API Response Time: 120ms
              </Text>
            </View>
            
            <View style={styles.healthItem}>
              <View style={[styles.healthIndicator, { backgroundColor: theme.colors.warning }]} />
              <Text style={[styles.healthText, theme.typography.body2]}>
                Storage Usage: 78%
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 24,
  },
  greeting: {
    marginBottom: 4,
  },
  subGreeting: {
    opacity: 0.7,
  },
  quickActions: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 32,
    gap: 12,
  },
  primaryAction: {
    flex: 1,
  },
  secondaryAction: {
    flex: 1,
  },
  metricsContainer: {
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 16,
    gap: 12,
  },
  metricCard: {
    flex: 1,
    minWidth: '47%',
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    flex: 1,
  },
  viewAllText: {
    fontSize: 14,
    fontWeight: '600',
  },
  emptyState: {
    padding: 24,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderStyle: 'dashed',
  },
  emptyStateText: {
    textAlign: 'center',
    opacity: 0.6,
  },
  healthCard: {
    marginTop: 16,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  healthItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  healthIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 12,
  },
  healthText: {
    flex: 1,
  },
});

export default AdminDashboard;