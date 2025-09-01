// Enhanced Client Dashboard with Modern UI
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
  Animated,
} from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { useTheme } from '../../context/ThemeContext';
import MetricCard from '../../components/cards/MetricCard';
import ServiceCard from '../../components/cards/ServiceCard';
import VehicleCard from '../../components/cards/VehicleCard';
import Button from '../../components/common/Button';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const { width } = Dimensions.get('window');

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
  const [fadeAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    loadDashboardData();
    
    // Fade in animation
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
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
  };

  const loadServiceRequests = async () => {
    // Mock data - replace with actual API call
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

  const renderWelcomeHeader = () => (
    <Animated.View 
      style={[
        styles.welcomeHeader, 
        { backgroundColor: theme.colors.primary },
        { opacity: fadeAnim }
      ]}
    >
      <View style={styles.welcomeContent}>
        <View style={styles.greetingContainer}>
          <Text style={[styles.greeting, { color: '#fff' }]}>
            Good {getTimeOfDayGreeting()}, {user?.firstName}! 👋
          </Text>
          <Text style={[styles.subGreeting, { color: 'rgba(255,255,255,0.8)' }]}>
            Ready to keep your vehicles in top shape?
          </Text>
        </View>
        
        <View style={styles.weatherWidget}>
          <Text style={[styles.weatherText, { color: 'rgba(255,255,255,0.9)' }]}>
            ☀️ 24°C
          </Text>
          <Text style={[styles.weatherLocation, { color: 'rgba(255,255,255,0.7)' }]}>
            Cape Town
          </Text>
        </View>
      </View>
    </Animated.View>
  );

  const renderQuickActions = () => (
    <Animated.View 
      style={[styles.quickActionsContainer, { opacity: fadeAnim }]}
    >
      <Text style={[styles.sectionTitle, theme.typography.h5]}>
        Quick Actions
      </Text>
      
      <View style={styles.quickActions}>
        <TouchableOpacity
          style={[styles.quickActionCard, styles.primaryAction, { backgroundColor: theme.colors.primary }]}
          onPress={handleCreateServiceRequest}
        >
          <View style={styles.quickActionIcon}>
            <Text style={styles.quickActionIconText}>🔧</Text>
          </View>
          <Text style={[styles.quickActionTitle, { color: '#fff' }]}>
            Book Service
          </Text>
          <Text style={[styles.quickActionSubtitle, { color: 'rgba(255,255,255,0.8)' }]}>
            Schedule maintenance
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.quickActionCard, styles.secondaryAction, { backgroundColor: theme.colors.surface }]}
          onPress={handleViewAllVehicles}
        >
          <View style={[styles.quickActionIcon, { backgroundColor: theme.colors.secondary + '20' }]}>
            <Text style={styles.quickActionIconText}>🚗</Text>
          </View>
          <Text style={[styles.quickActionTitle, theme.typography.h6]}>
            Add Vehicle
          </Text>
          <Text style={[styles.quickActionSubtitle, theme.typography.caption]}>
            Manage your fleet
          </Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );

  const renderMetrics = () => (
    <Animated.View 
      style={[styles.metricsContainer, { opacity: fadeAnim }]}
    >
      <Text style={[styles.sectionTitle, theme.typography.h5]}>
        Your Overview
      </Text>
      
      <View style={styles.metricsGrid}>
        <MetricCard
          title="Active Services"
          value={activeServices.toString()}
          icon="🔄"
          color={theme.colors.primary}
          trend={activeServices > 0 ? '+2 this week' : 'All caught up'}
          size="small"
          style={styles.metricCard}
        />
        
        <MetricCard
          title="Pending Quotes"
          value={pendingQuotes.toString()}
          icon="💰"
          color={theme.colors.warning}
          trend={pendingQuotes > 0 ? 'Awaiting response' : 'No pending quotes'}
          size="small"
          style={styles.metricCard}
        />
        
        <MetricCard
          title="Completed"
          value={completedServices.toString()}
          icon="✅"
          color={theme.colors.success}
          trend={completedServices > 0 ? `${completedServices} total` : 'Start your first service'}
          size="small"
          style={styles.metricCard}
        />
        
        <MetricCard
          title="My Vehicles"
          value={vehicles.length.toString()}
          icon="🚗"
          color={theme.colors.secondary}
          trend={vehicles.length > 0 ? 'Fleet managed' : 'Add your first vehicle'}
          size="small"
          style={styles.metricCard}
          onPress={handleViewAllVehicles}
        />
      </View>
    </Animated.View>
  );

  const renderSection = (title, data, renderItem, emptyState, viewAllAction) => (
    <Animated.View 
      style={[styles.section, { opacity: fadeAnim }]}
    >
      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, theme.typography.h5]}>
          {title}
        </Text>
        {data.length > 0 && viewAllAction && (
          <TouchableOpacity onPress={viewAllAction} style={styles.viewAllButton}>
            <Text style={[styles.viewAllText, { color: theme.colors.primary }]}>
              View All ({data.length})
            </Text>
          </TouchableOpacity>
        )}
      </View>
      
      {data.length > 0 ? (
        <View style={styles.sectionContent}>
          {data.map((item, index) => (
            <View key={item.id} style={{ marginBottom: index < data.length - 1 ? 16 : 0 }}>
              {renderItem(item)}
            </View>
          ))}
        </View>
      ) : (
        <View style={[styles.emptyState, { backgroundColor: theme.colors.surface }]}>
          {emptyState}
        </View>
      )}
    </Animated.View>
  );

  const getTimeOfDayGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'morning';
    if (hour < 17) return 'afternoon';
    return 'evening';
  };

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
        {/* Welcome Header */}
        {renderWelcomeHeader()}

        {/* Quick Actions */}
        {renderQuickActions()}

        {/* Metrics */}
        {renderMetrics()}

        {/* Recent Service Requests */}
        {renderSection(
          'Recent Services',
          recentServices,
          (service) => (
            <ServiceCard
              service={service}
              onPress={handleServicePress}
              onAcceptQuote={handleAcceptQuote}
              onDeclineQuote={handleDeclineQuote}
              userRole="CLIENT"
            />
          ),
          (
            <View style={styles.emptyStateContent}>
              <Text style={styles.emptyStateIcon}>🔧</Text>
              <Text style={[styles.emptyStateText, theme.typography.body1]}>
                No service requests yet
              </Text>
              <Text style={[styles.emptyStateSubtext, theme.typography.body2]}>
                Book your first service to get started
              </Text>
              <Button
                title="Book Service Now"
                onPress={handleCreateServiceRequest}
                style={styles.emptyStateButton}
              />
            </View>
          ),
          serviceRequests.length > 3 ? handleViewAllServices : null
        )}

        {/* My Vehicles */}
        {renderSection(
          'My Vehicles',
          recentVehicles,
          (vehicle) => (
            <VehicleCard
              vehicle={vehicle}
              onPress={handleVehiclePress}
              showActions={false}
            />
          ),
          (
            <View style={styles.emptyStateContent}>
              <Text style={styles.emptyStateIcon}>🚗</Text>
              <Text style={[styles.emptyStateText, theme.typography.body1]}>
                No vehicles added yet
              </Text>
              <Text style={[styles.emptyStateSubtext, theme.typography.body2]}>
                Add your vehicle to start booking services
              </Text>
              <Button
                title="Add Your First Vehicle"
                onPress={handleViewAllVehicles}
                style={styles.emptyStateButton}
              />
            </View>
          ),
          vehicles.length > 2 ? handleViewAllVehicles : null
        )}
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
    paddingBottom: 32,
  },

  // Welcome Header
  welcomeHeader: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 32,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  welcomeContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  greetingContainer: {
    flex: 1,
    marginRight: 16,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subGreeting: {
    fontSize: 16,
    lineHeight: 22,
  },
  weatherWidget: {
    alignItems: 'flex-end',
  },
  weatherText: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 2,
  },
  weatherLocation: {
    fontSize: 14,
  },

  // Quick Actions
  quickActionsContainer: {
    paddingHorizontal: 24,
    paddingTop: 32,
  },
  quickActions: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 16,
  },
  quickActionCard: {
    flex: 1,
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
  },
  primaryAction: {
    // Styles applied inline
  },
  secondaryAction: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  quickActionIcon: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  quickActionIconText: {
    fontSize: 24,
  },
  quickActionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  quickActionSubtitle: {
    fontSize: 14,
    textAlign: 'center',
  },

  // Metrics
  metricsContainer: {
    paddingHorizontal: 24,
    paddingTop: 32,
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

  // Sections
  section: {
    paddingHorizontal: 24,
    paddingTop: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  sectionTitle: {
    fontWeight: 'bold',
    fontSize: 20,
  },
  viewAllButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: 'rgba(0,122,255,0.1)',
  },
  viewAllText: {
    fontSize: 14,
    fontWeight: '600',
  },
  sectionContent: {
    // Container for section items
  },

  // Empty States
  emptyState: {
    borderRadius: 16,
    padding: 32,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E0E0E0',
    borderStyle: 'dashed',
  },
  emptyStateContent: {
    alignItems: 'center',
  },
  emptyStateIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyStateText: {
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyStateSubtext: {
    opacity: 0.7,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  },
  emptyStateButton: {
    paddingHorizontal: 24,
  },
});

export default ClientDashboard;