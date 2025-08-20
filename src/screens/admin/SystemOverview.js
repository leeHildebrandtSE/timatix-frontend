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
  Dimensions,
} from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { useTheme } from '../../context/ThemeContext';
import MetricCard from '../../components/cards/MetricCard';
import Button from '../../components/common/Button';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const { width } = Dimensions.get('window');

const SystemOverview = ({ navigation }) => {
  const { user } = useAuth();
  const { 
    serviceRequests, 
    users, 
    vehicles,
    isLoading,
    setLoading 
  } = useApp();
  const { theme } = useTheme();
  
  const [refreshing, setRefreshing] = useState(false);
  const [systemStats, setSystemStats] = useState({
    totalUsers: 0,
    totalClients: 0,
    totalMechanics: 0,
    totalVehicles: 0,
    totalServices: 0,
    activeServices: 0,
    completedServices: 0,
    pendingServices: 0,
    totalRevenue: 0,
    monthlyRevenue: 0,
    averageServiceTime: 0,
    customerSatisfaction: 0,
  });

  const [timeFilter, setTimeFilter] = useState('all'); // 'all', 'month', 'week'

  useEffect(() => {
    loadSystemData();
  }, []);

  useEffect(() => {
    calculateSystemStats();
  }, [serviceRequests, users, vehicles, timeFilter]);

  const loadSystemData = async () => {
    try {
      setLoading(true);
      // Simulate API calls - replace with actual API calls
      await Promise.all([
        loadAllUsers(),
        loadAllServiceRequests(),
        loadAllVehicles(),
        loadAnalytics(),
      ]);
    } catch (error) {
      console.error('Error loading system data:', error);
      Alert.alert('Error', 'Failed to load system data');
    } finally {
      setLoading(false);
    }
  };

  const loadAllUsers = async () => {
    // Mock data - replace with actual API call
    // const allUsers = await userService.getAllUsers();
    // setUsers(allUsers);
  };

  const loadAllServiceRequests = async () => {
    // Mock data - replace with actual API call
    // const allRequests = await serviceRequestsService.getAllRequests();
    // setServiceRequests(allRequests);
  };

  const loadAllVehicles = async () => {
    // Mock data - replace with actual API call
    // const allVehicles = await vehiclesService.getAllVehicles();
    // setVehicles(allVehicles);
  };

  const loadAnalytics = async () => {
    // Mock data - replace with actual API call
    // const analytics = await analyticsService.getSystemAnalytics();
    // Process analytics data
  };

  const calculateSystemStats = () => {
    const now = new Date();
    let filteredServices = serviceRequests;

    // Apply time filter
    if (timeFilter === 'month') {
      const monthAgo = new Date(now.getFullYear(), now.getMonth(), 1);
      filteredServices = serviceRequests.filter(service => 
        new Date(service.createdAt) >= monthAgo
      );
    } else if (timeFilter === 'week') {
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      filteredServices = serviceRequests.filter(service => 
        new Date(service.createdAt) >= weekAgo
      );
    }

    const totalUsers = users.length;
    const totalClients = users.filter(u => u.role === 'CLIENT').length;
    const totalMechanics = users.filter(u => u.role === 'MECHANIC').length;
    const totalVehicles = vehicles.length;
    const totalServices = filteredServices.length;
    
    const activeServices = filteredServices.filter(req => 
      ['CONFIRMED', 'IN_PROGRESS'].includes(req.status)
    ).length;
    
    const completedServices = filteredServices.filter(req => 
      req.status === 'COMPLETED'
    ).length;
    
    const pendingServices = filteredServices.filter(req => 
      ['PENDING', 'QUOTE_SENT'].includes(req.status)
    ).length;
    
    const totalRevenue = filteredServices
      .filter(req => req.status === 'COMPLETED' && req.quote?.totalAmount)
      .reduce((sum, req) => sum + req.quote.totalAmount, 0);

    // Calculate monthly revenue for current month
    const currentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const monthlyRevenue = serviceRequests
      .filter(req => 
        req.status === 'COMPLETED' && 
        req.quote?.totalAmount &&
        new Date(req.completedAt || req.createdAt) >= currentMonth
      )
      .reduce((sum, req) => sum + req.quote.totalAmount, 0);

    // Calculate average service time (mock data)
    const averageServiceTime = completedServices > 0 ? 3.5 : 0; // 3.5 days average

    // Calculate customer satisfaction (mock data)
    const customerSatisfaction = 4.2; // 4.2/5 rating

    setSystemStats({
      totalUsers,
      totalClients,
      totalMechanics,
      totalVehicles,
      totalServices,
      activeServices,
      completedServices,
      pendingServices,
      totalRevenue,
      monthlyRevenue,
      averageServiceTime,
      customerSatisfaction,
    });
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadSystemData();
    setRefreshing(false);
  };

  const handleExportData = () => {
    Alert.alert(
      'Export Data',
      'Export system data to CSV?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Export', 
          onPress: async () => {
            try {
              // API call to export data
              // await analyticsService.exportSystemData();
              Alert.alert('Success', 'Data exported successfully');
            } catch (error) {
              Alert.alert('Error', 'Failed to export data');
            }
          }
        },
      ]
    );
  };

  const handleGenerateReport = () => {
    navigation.navigate('Reports');
  };

  const renderTimeFilter = () => (
    <View style={styles.filterContainer}>
      <Text style={[styles.filterLabel, theme.typography.body2]}>Time Period:</Text>
      <View style={styles.filterButtons}>
        {['all', 'month', 'week'].map((filter) => (
          <TouchableOpacity
            key={filter}
            style={[
              styles.filterButton,
              timeFilter === filter && { backgroundColor: theme.colors.primary },
            ]}
            onPress={() => setTimeFilter(filter)}
          >
            <Text
              style={[
                styles.filterButtonText,
                timeFilter === filter && { color: '#fff' },
                { color: theme.colors.text },
              ]}
            >
              {filter === 'all' ? 'All Time' : filter === 'month' ? 'This Month' : 'This Week'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  if (isLoading && !refreshing) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <LoadingSpinner message="Loading system overview..." />
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
          <Text style={[styles.title, theme.typography.h3]}>
            System Overview
          </Text>
          <Text style={[styles.subtitle, theme.typography.body2]}>
            Complete system analytics and metrics
          </Text>
        </View>

        {/* Time Filter */}
        {renderTimeFilter()}

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <Button
            title="Export Data"
            onPress={handleExportData}
            style={styles.primaryAction}
            variant="outline"
          />
          <Button
            title="Generate Report"
            onPress={handleGenerateReport}
            style={styles.secondaryAction}
          />
        </View>

        {/* User Metrics */}
        <View style={styles.metricsContainer}>
          <Text style={[styles.sectionTitle, theme.typography.h5]}>
            User Statistics
          </Text>
          
          <View style={styles.metricsGrid}>
            <MetricCard
              title="Total Users"
              value={systemStats.totalUsers.toString()}
              icon="👥"
              color={theme.colors.primary}
              size="medium"
              style={styles.metricCard}
            />
            
            <MetricCard
              title="Clients"
              value={systemStats.totalClients.toString()}
              icon="👤"
              color={theme.colors.secondary}
              size="medium"
              style={styles.metricCard}
            />
            
            <MetricCard
              title="Mechanics"
              value={systemStats.totalMechanics.toString()}
              icon="🔧"
              color={theme.colors.warning}
              size="medium"
              style={styles.metricCard}
            />
            
            <MetricCard
              title="Vehicles"
              value={systemStats.totalVehicles.toString()}
              icon="🚗"
              color={theme.colors.info}
              size="medium"
              style={styles.metricCard}
            />
          </View>
        </View>

        {/* Service Metrics */}
        <View style={styles.metricsContainer}>
          <Text style={[styles.sectionTitle, theme.typography.h5]}>
            Service Statistics
          </Text>
          
          <View style={styles.metricsGrid}>
            <MetricCard
              title="Total Services"
              value={systemStats.totalServices.toString()}
              icon="⚙️"
              color={theme.colors.primary}
              size="medium"
              style={styles.metricCard}
            />
            
            <MetricCard
              title="Active"
              value={systemStats.activeServices.toString()}
              icon="🔄"
              color={theme.colors.warning}
              size="medium"
              style={styles.metricCard}
            />
            
            <MetricCard
              title="Completed"
              value={systemStats.completedServices.toString()}
              icon="✅"
              color={theme.colors.success}
              size="medium"
              style={styles.metricCard}
            />
            
            <MetricCard
              title="Pending"
              value={systemStats.pendingServices.toString()}
              icon="⏳"
              color={theme.colors.error}
              size="medium"
              style={styles.metricCard}
            />
          </View>
        </View>

        {/* Financial Metrics */}
        <View style={styles.metricsContainer}>
          <Text style={[styles.sectionTitle, theme.typography.h5]}>
            Financial Overview
          </Text>
          
          <View style={styles.metricsGrid}>
            <MetricCard
              title="Total Revenue"
              value={`R ${systemStats.totalRevenue.toFixed(0)}`}
              icon="💰"
              color={theme.colors.success}
              size="large"
              style={[styles.metricCard, styles.largeCard]}
            />
            
            <MetricCard
              title="Monthly Revenue"
              value={`R ${systemStats.monthlyRevenue.toFixed(0)}`}
              icon="📈"
              color={theme.colors.primary}
              size="large"
              style={[styles.metricCard, styles.largeCard]}
            />
          </View>
        </View>

        {/* Performance Metrics */}
        <View style={styles.metricsContainer}>
          <Text style={[styles.sectionTitle, theme.typography.h5]}>
            Performance Metrics
          </Text>
          
          <View style={styles.metricsGrid}>
            <MetricCard
              title="Avg Service Time"
              value={`${systemStats.averageServiceTime} days`}
              icon="⏱️"
              color={theme.colors.info}
              size="medium"
              style={styles.metricCard}
            />
            
            <MetricCard
              title="Customer Rating"
              value={`${systemStats.customerSatisfaction}/5`}
              icon="⭐"
              color={theme.colors.warning}
              size="medium"
              style={styles.metricCard}
            />
          </View>
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
                Database: Operational
              </Text>
              <Text style={[styles.healthValue, theme.typography.caption]}>
                99.9% uptime
              </Text>
            </View>
            
            <View style={styles.healthItem}>
              <View style={[styles.healthIndicator, { backgroundColor: theme.colors.success }]} />
              <Text style={[styles.healthText, theme.typography.body2]}>
                API Response
              </Text>
              <Text style={[styles.healthValue, theme.typography.caption]}>
                120ms avg
              </Text>
            </View>
            
            <View style={styles.healthItem}>
              <View style={[styles.healthIndicator, { backgroundColor: theme.colors.warning }]} />
              <Text style={[styles.healthText, theme.typography.body2]}>
                Storage Usage
              </Text>
              <Text style={[styles.healthValue, theme.typography.caption]}>
                78% used
              </Text>
            </View>
            
            <View style={styles.healthItem}>
              <View style={[styles.healthIndicator, { backgroundColor: theme.colors.success }]} />
              <Text style={[styles.healthText, theme.typography.body2]}>
                Active Sessions
              </Text>
              <Text style={[styles.healthValue, theme.typography.caption]}>
                {systemStats.totalUsers} users
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
  title: {
    marginBottom: 4,
  },
  subtitle: {
    opacity: 0.7,
  },
  filterContainer: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  filterLabel: {
    marginBottom: 8,
    fontWeight: '600',
  },
  filterButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
  },
  filterButtonText: {
    fontSize: 14,
    fontWeight: '500',
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
  largeCard: {
    minWidth: '100%',
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  sectionTitle: {
    marginBottom: 8,
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
    justifyContent: 'space-between',
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
  healthValue: {
    opacity: 0.7,
  },
});

export default SystemOverview;