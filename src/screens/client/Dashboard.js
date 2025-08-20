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
import VehicleCard from '../../components/cards/VehicleCard';
import Button from '../../components/common/Button';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const ClientDashboard = ({ navigation }) => {
  const { user } = useAuth();
  const { 
    vehicles, 
    serviceRequests, 
    isLoading,
    setLoading,
    addNotification 
  } = useApp();
  const { theme } = useTheme();
  
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      // Simulate API calls - replace with actual API calls
      await Promise.all([
        loadVehicles(),
        loadServiceRequests(),
      ]);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      Alert.alert('Error', 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const loadVehicles = async () => {
    // Mock data - replace with actual API call
    // const vehicles = await vehiclesService.getUserVehicles();
    // setVehicles(vehicles);
  };

  const loadServiceRequests = async () => {
    // Mock data - replace with actual API call
    // const requests = await serviceRequestsService.getUserRequests();
    // setServiceRequests(requests);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadDashboardData();
    setRefreshing(false);
  };

  const handleCreateServiceRequest = () => {
    if (vehicles.length === 0) {
      Alert.alert(
        'No Vehicles',
        'You need to add a vehicle before creating a service request.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Add Vehicle', onPress: () => navigation.navigate('Vehicles') },
        ]
      );
      return;
    }
    
    navigation.navigate('CreateServiceRequest');
  };

  const handleViewAllVehicles = () => {
    navigation.navigate('Vehicles');
  };

  const handleViewAllServices = () => {
    navigation.navigate('ServiceRequests');
  };

  const handleServicePress = (service) => {
    navigation.navigate('ServiceDetails', { serviceId: service.id });
  };

  const handleVehiclePress = (vehicle) => {
    navigation.navigate('VehicleDetails', { vehicleId: vehicle.id });
  };

  const handleAcceptQuote = (service) => {
    Alert.alert(
      'Accept Quote',
      `Accept the quote of R ${service.quote?.totalAmount?.toFixed(2)} for ${service.serviceType}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Accept', 
          onPress: async () => {
            try {
              // API call to accept quote
              // await serviceRequestsService.acceptQuote(service.id);
              addNotification({
                title: 'Quote Accepted',
                message: `Quote for ${service.serviceType} has been accepted.`,
                type: 'success',
              });
            } catch (error) {
              Alert.alert('Error', 'Failed to accept quote');
            }
          }
        },
      ]
    );
  };

  const handleDeclineQuote = (service) => {
    Alert.alert(
      'Decline Quote',
      `Decline the quote for ${service.serviceType}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Decline', 
          style: 'destructive',
          onPress: async () => {
            try {
              // API call to decline quote
              // await serviceRequestsService.declineQuote(service.id);
              addNotification({
                title: 'Quote Declined',
                message: `Quote for ${service.serviceType} has been declined.`,
                type: 'info',
              });
            } catch (error) {
              Alert.alert('Error', 'Failed to decline quote');
            }
          }
        },
      ]
    );
  };

  // Calculate metrics
  const activeServices = serviceRequests.filter(req => 
    ['CONFIRMED', 'IN_PROGRESS'].includes(req.status)
  ).length;
  
  const pendingQuotes = serviceRequests.filter(req => 
    req.status === 'QUOTE_SENT'
  ).length;

  const completedServices = serviceRequests.filter(req => 
    req.status === 'COMPLETED'
  ).length;

  // Get recent service requests (last 3)
  const recentServices = serviceRequests
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 3);

  // Get user's vehicles (last 2)
  const recentVehicles = vehicles.slice(0, 2);

  if (isLoading && !refreshing) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <LoadingSpinner message="Loading dashboard..." />
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
            Welcome back, {user?.firstName}!
          </Text>
          <Text style={[styles.subGreeting, theme.typography.body2]}>
            Manage your vehicles and service requests
          </Text>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <Button
            title="Book Service"
            onPress={handleCreateServiceRequest}
            style={styles.primaryAction}
          />
          <Button
            title="Add Vehicle"
            variant="outline"
            onPress={handleViewAllVehicles}
            style={styles.secondaryAction}
          />
        </View>

        {/* Metrics */}
        <View style={styles.metricsContainer}>
          <Text style={[styles.sectionTitle, theme.typography.h5]}>
            Overview
          </Text>
          
          <View style={styles.metricsGrid}>
            <MetricCard
              title="Active Services"
              value={activeServices.toString()}
              icon="🔧"
              color={theme.colors.primary}
              size="small"
              style={styles.metricCard}
            />
            
            <MetricCard
              title="Pending Quotes"
              value={pendingQuotes.toString()}
              icon="💰"
              color={theme.colors.warning}
              size="small"
              style={styles.metricCard}
            />
            
            <MetricCard
              title="Completed"
              value={completedServices.toString()}
              icon="✅"
              color={theme.colors.success}
              size="small"
              style={styles.metricCard}
            />
            
            <MetricCard
              title="My Vehicles"
              value={vehicles.length.toString()}
              icon="🚗"
              color={theme.colors.secondary}
              size="small"
              style={styles.metricCard}
              onPress={handleViewAllVehicles}
            />
          </View>
        </View>

        {/* Recent Service Requests */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, theme.typography.h5]}>
              Recent Services
            </Text>
            {serviceRequests.length > 3 && (
              <TouchableOpacity onPress={handleViewAllServices}>
                <Text style={[styles.viewAllText, { color: theme.colors.primary }]}>
                  View All
                </Text>
              </TouchableOpacity>
            )}
          </View>
          
          {recentServices.length > 0 ? (
            recentServices.map((service) => (
              <ServiceCard
                key={service.id}
                service={service}
                onPress={handleServicePress}
                onAcceptQuote={handleAcceptQuote}
                onDeclineQuote={handleDeclineQuote}
                userRole="CLIENT"
              />
            ))
          ) : (
            <View style={[styles.emptyState, { backgroundColor: theme.colors.surface }]}>
              <Text style={[styles.emptyStateText, theme.typography.body2]}>
                No service requests yet
              </Text>
              <Button
                title="Book Your First Service"
                onPress={handleCreateServiceRequest}
                style={styles.emptyStateButton}
              />
            </View>
          )}
        </View>

        {/* My Vehicles */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, theme.typography.h5]}>
              My Vehicles
            </Text>
            {vehicles.length > 2 && (
              <TouchableOpacity onPress={handleViewAllVehicles}>
                <Text style={[styles.viewAllText, { color: theme.colors.primary }]}>
                  View All
                </Text>
              </TouchableOpacity>
            )}
          </View>
          
          {recentVehicles.length > 0 ? (
            recentVehicles.map((vehicle) => (
              <VehicleCard
                key={vehicle.id}
                vehicle={vehicle}
                onPress={handleVehiclePress}
                showActions={false}
              />
            ))
          ) : (
            <View style={[styles.emptyState, { backgroundColor: theme.colors.surface }]}>
              <Text style={[styles.emptyStateText, theme.typography.body2]}>
                No vehicles added yet
              </Text>
              <Button
                title="Add Your First Vehicle"
                onPress={handleViewAllVehicles}
                style={styles.emptyStateButton}
              />
            </View>
          )}
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
    marginBottom: 16,
    textAlign: 'center',
    opacity: 0.6,
  },
  emptyStateButton: {
    paddingHorizontal: 24,
  },
});

export default ClientDashboard;