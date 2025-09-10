// src/screens/client/ClientDashboard.js - Refactored version
import React, { useState, useEffect } from 'react';
import { ScrollView, RefreshControl } from 'react-native';
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
import MetricCard from '../../components/cards/MetricCard';
import ServiceCard from '../../components/cards/ServiceCard';
import VehicleCard from '../../components/cards/VehicleCard';
import Button from '../../components/common/Button';

const ClientDashboard = ({ navigation }) => {
  const { user } = useAuth();
  const { vehicles, serviceRequests, isLoading, setLoading, addNotification } = useApp();
  const { theme } = useTheme();
  const globalStyles = useGlobalStyles();
  
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      await Promise.all([loadVehicles(), loadServiceRequests()]);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadDashboardData();
    setRefreshing(false);
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

  // Get recent data
  const recentServices = serviceRequests
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 3);
  const recentVehicles = vehicles.slice(0, 2);

  // Quick actions configuration
  const quickActions = [
    {
      title: 'Book Service',
      subtitle: 'Schedule maintenance',
      icon: '🔧',
      color: theme.colors.primary,
      onPress: () => {
        if (vehicles.length === 0) {
          Alert.alert('No Vehicles', 'Add a vehicle first');
          return;
        }
        navigation.navigate('CreateServiceRequest');
      }
    },
    {
      title: 'Add Vehicle',
      subtitle: 'Manage your fleet',
      icon: '🚗',
      color: theme.colors.secondary,
      onPress: () => navigation.navigate('Vehicles')
    }
  ];

  // Metrics configuration
  const metrics = [
    {
      title: 'Active Services',
      value: activeServices.toString(),
      icon: '🔄',
      color: theme.colors.primary,
      trend: activeServices > 0 ? '+2 this week' : 'All caught up',
      size: 'small'
    },
    {
      title: 'Pending Quotes',
      value: pendingQuotes.toString(),
      icon: '💰',
      color: theme.colors.warning,
      trend: pendingQuotes > 0 ? 'Awaiting response' : 'No pending quotes',
      size: 'small'
    },
    {
      title: 'Completed',
      value: completedServices.toString(),
      icon: '✅',
      color: theme.colors.success,
      trend: completedServices > 0 ? `${completedServices} total` : 'Start your first service',
      size: 'small'
    },
    {
      title: 'My Vehicles',
      value: vehicles.length.toString(),
      icon: '🚗',
      color: theme.colors.secondary,
      trend: vehicles.length > 0 ? 'Fleet managed' : 'Add your first vehicle',
      size: 'small',
      onPress: () => navigation.navigate('Vehicles')
    }
  ];

  const handleServicePress = (service) => {
    navigation.navigate('ServiceDetails', { serviceId: service.id });
  };

  const handleVehiclePress = (vehicle) => {
    navigation.navigate('VehicleDetails', { vehicleId: vehicle.id });
  };

  const handleCreateServiceRequest = () => {
    if (vehicles.length === 0) {
      Alert.alert('No Vehicles', 'Add a vehicle first');
      return;
    }
    navigation.navigate('CreateServiceRequest');
  };

  const renderServiceEmptyState = () => (
    <EmptyState
      icon="🔧"
      title="No service requests yet"
      subtitle="Book your first service to get started"
      action={
        <Button
          title="Book Service Now"
          onPress={handleCreateServiceRequest}
        />
      }
    />
  );

  const renderVehicleEmptyState = () => (
    <EmptyState
      icon="🚗"
      title="No vehicles added yet"
      subtitle="Add your vehicle to start booking services"
      action={
        <Button
          title="Add Your First Vehicle"
          onPress={() => navigation.navigate('Vehicles')}
        />
      }
    />
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
        subtitle="Ready to keep your vehicles in top shape?"
        rightWidget={
          <View style={{ alignItems: 'flex-end' }}>
            <Text style={[globalStyles.greeting, { color: 'rgba(255,255,255,0.9)', fontSize: 18 }]}>
              ☀️ 24°C
            </Text>
            <Text style={[globalStyles.subGreeting, { fontSize: 14 }]}>
              Cape Town
            </Text>
          </View>
        }
      />

      {/* Quick Actions */}
      <QuickActionsGrid 
        actions={quickActions}
        style={{ paddingTop: 32 }}
      />

      {/* Metrics */}
      <SectionContainer title="Your Overview">
        <MetricsGrid metrics={metrics} />
      </SectionContainer>

      {/* Recent Services */}
      <SectionContainer 
        title={`Recent Services${recentServices.length > 3 ? ` (${serviceRequests.length})` : ''}`}
        style={recentServices.length > 3 ? {
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center'
        } : undefined}
      >
        {recentServices.length > 3 && (
          <TouchableOpacity onPress={() => navigation.navigate('ServiceRequests')}>
            <Text style={[{ color: theme.colors.primary, fontWeight: '600', fontSize: 14 }]}>
              View All
            </Text>
          </TouchableOpacity>
        )}
        
        {recentServices.length > 0 ? (
          recentServices.map((service, index) => (
            <View key={service.id} style={index < recentServices.length - 1 ? { marginBottom: 16 } : {}}>
              <ServiceCard
                service={service}
                onPress={handleServicePress}
                userRole="CLIENT"
              />
            </View>
          ))
        ) : (
          renderServiceEmptyState()
        )}
      </SectionContainer>

      {/* My Vehicles */}
      <SectionContainer 
        title={`My Vehicles${vehicles.length > 2 ? ` (${vehicles.length})` : ''}`}
      >
        {vehicles.length > 2 && (
          <TouchableOpacity onPress={() => navigation.navigate('Vehicles')}>
            <Text style={[{ color: theme.colors.primary, fontWeight: '600', fontSize: 14 }]}>
              View All
            </Text>
          </TouchableOpacity>
        )}
        
        {recentVehicles.length > 0 ? (
          recentVehicles.map((vehicle, index) => (
            <View key={vehicle.id} style={index < recentVehicles.length - 1 ? { marginBottom: 16 } : {}}>
              <VehicleCard
                vehicle={vehicle}
                onPress={handleVehiclePress}
                showActions={false}
              />
            </View>
          ))
        ) : (
          renderVehicleEmptyState()
        )}
      </SectionContainer>
    </ScrollView>
  );
};

// Export with screen wrapper
export default withScreenWrapper(ClientDashboard, {
  layout: 'dashboard',
  loading: true,
  refresh: false // We handle refresh manually
});