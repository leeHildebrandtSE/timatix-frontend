// =============================================================================
// AFTER: Using Global Styles (NEW VERSION)
// =============================================================================

// src/screens/client/ClientDashboard.js (NEW VERSION)

import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  RefreshControl 
} from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { useTheme, useGlobalStyles } from '../../context/ThemeContext';

const ClientDashboard = ({ navigation }) => {
  const { user } = useAuth();
  const { vehicles, serviceRequests, isLoading } = useApp();
  const { theme } = useTheme();
  const globalStyles = useGlobalStyles();
  
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState({
    totalVehicles: 0,
    activeServices: 0,
    pendingQuotes: 0,
    completedServices: 0,
  });

  // Quick actions configuration
  const quickActions = [
    {
      title: 'Add Vehicle',
      subtitle: 'Register a new vehicle',
      icon: '🚗',
      color: theme.colors.primary,
      onPress: () => navigation.navigate('AddVehicle'),
    },
    {
      title: 'Book Service',
      subtitle: 'Schedule maintenance',
      icon: '🔧',
      color: theme.colors.secondary,
      onPress: () => navigation.navigate('CreateServiceRequest'),
    },
    {
      title: 'View History',
      subtitle: 'Past services',
      icon: '📋',
      color: theme.colors.info,
      onPress: () => navigation.navigate('ServiceHistory'),
    },
    {
      title: 'Get Quote',
      subtitle: 'Request estimate',
      icon: '💰',
      color: theme.colors.warning,
      onPress: () => navigation.navigate('RequestQuote'),
    },
  ];

  // Metrics configuration
  const metrics = [
    {
      title: 'My Vehicles',
      value: stats.totalVehicles,
      icon: '🚗',
      color: theme.colors.primary,
      trend: '+2 this month',
      trendColor: theme.colors.success,
      onPress: () => navigation.navigate('Vehicles'),
    },
    {
      title: 'Active Services',
      value: stats.activeServices,
      icon: '🔧',
      color: theme.colors.warning,
      trend: 'In progress',
      trendColor: theme.colors.warning,
      onPress: () => navigation.navigate('ServiceRequests'),
    },
    {
      title: 'Pending Quotes',
      value: stats.pendingQuotes,
      icon: '💰',
      color: theme.colors.info,
      trend: 'Awaiting response',
      trendColor: theme.colors.info,
      onPress: () => navigation.navigate('Quotes'),
    },
    {
      title: 'Completed',
      value: stats.completedServices,
      icon: '✅',
      color: theme.colors.success,
      trend: '+5 this year',
      trendColor: theme.colors.success,
      onPress: () => navigation.navigate('ServiceHistory'),
    },
  ];

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      // Calculate stats from your data
      setStats({
        totalVehicles: vehicles?.length || 0,
        activeServices: serviceRequests?.filter(s => s.status === 'in-progress').length || 0,
        pendingQuotes: serviceRequests?.filter(s => s.status === 'pending-quote').length || 0,
        completedServices: serviceRequests?.filter(s => s.status === 'completed').length || 0,
      });
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadDashboardData();
    setRefreshing(false);
  };

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
          style={globalStyles.screenRefreshControl}
        />
      }
    >
      {/* Welcome Header */}
      <View style={[
        globalStyles.dashboardGradientHeader,
        { backgroundColor: theme.colors.primary }
      ]}>
        <View style={globalStyles.dashboardHeaderContent}>
          <View style={globalStyles.dashboardGreeting}>
            <Text style={globalStyles.dashboardGreetingText}>
              Welcome back, {user?.name}!
            </Text>
            <Text style={globalStyles.dashboardGreetingSubtext}>
              Manage your vehicles and services with ease
            </Text>
          </View>
          <TouchableOpacity 
            style={globalStyles.dashboardProfileButton}
            onPress={() => navigation.navigate('Profile')}
          >
            <Text style={globalStyles.dashboardProfileIcon}>👤</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Quick Actions */}
      <View style={globalStyles.quickActionsContainer}>
        <Text style={globalStyles.sectionTitle}>Quick Actions</Text>
        <View style={globalStyles.quickActions}>
          {quickActions.map((action, index) => (
            <TouchableOpacity
              key={index}
              style={[
                globalStyles.quickActionCard,
                { backgroundColor: action.color }
              ]}
              onPress={action.onPress}
            >
              <View style={globalStyles.quickActionIcon}>
                <Text style={globalStyles.quickActionIconText}>{action.icon}</Text>
              </View>
              <Text style={[globalStyles.quickActionTitle, { color: '#fff' }]}>
                {action.title}
              </Text>
              <Text style={[globalStyles.quickActionSubtitle, { color: 'rgba(255,255,255,0.8)' }]}>
                {action.subtitle}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Dashboard Metrics */}
      <View style={globalStyles.metricsContainer}>
        <Text style={globalStyles.sectionTitle}>Your Dashboard</Text>
        <View style={globalStyles.metricsGrid}>
          {metrics.map((metric, index) => (
            <TouchableOpacity
              key={index}
              style={[
                globalStyles.metricCard,
                globalStyles.metricMediumContainer,
                index % 2 === 0 ? { marginRight: spacing.sm } : { marginLeft: spacing.sm }
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

              {/* Card Header */}
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

              {/* Card Content */}
              <Text style={[
                globalStyles.metricTitle,
                globalStyles.metricMediumTitle,
                { color: theme.colors.text }
              ]}>
                {metric.title}
              </Text>

              {metric.trend && (
                <View style={globalStyles.metricTrendContainer}>
                  <Text style={[
                    globalStyles.metricTrend,
                    globalStyles.metricMediumTrend,
                    { color: metric.trendColor || theme.colors.success }
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

      {/* Recent Vehicles Section */}
      <View style={globalStyles.section}>
        <View style={globalStyles.sectionHeader}>
          <Text style={globalStyles.sectionTitle}>Recent Vehicles</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Vehicles')}>
            <Text style={[globalStyles.authFooterLink, { color: theme.colors.primary }]}>
              View All
            </Text>
          </TouchableOpacity>
        </View>
        
        {vehicles && vehicles.length > 0 ? (
          vehicles.slice(0, 2).map((vehicle, index) => (
            <TouchableOpacity
              key={vehicle.id}
              style={globalStyles.vehicleCard}
              onPress={() => navigation.navigate('VehicleDetails', { vehicleId: vehicle.id })}
            >
              {/* Vehicle Image */}
              <View style={globalStyles.vehicleImageContainer}>
                {vehicle.image ? (
                  <Image source={{ uri: vehicle.image }} style={globalStyles.vehicleImage} />
                ) : (
                  <View style={[
                    globalStyles.vehicleImage,
                    { backgroundColor: theme.colors.surface }
                  ]}>
                    <View style={globalStyles.clientVehicleImagePlaceholder}>
                      <Text style={globalStyles.clientVehicleImagePlaceholderIcon}>🚗</Text>
                    </View>
                  </View>
                )}
                
                {/* Year Badge */}
                <View style={globalStyles.vehicleImageOverlay}>
                  <View style={[
                    globalStyles.vehicleYearBadge,
                    { backgroundColor: 'rgba(0,0,0,0.7)' }
                  ]}>
                    <Text style={globalStyles.vehicleYearText}>{vehicle.year}</Text>
                  </View>
                </View>
              </View>

              {/* Vehicle Info */}
              <View style={globalStyles.vehicleInfoContainer}>
                <View style={globalStyles.vehicleHeaderRow}>
                  <View style={globalStyles.vehicleTitleContainer}>
                    <Text style={[globalStyles.vehicleName, { color: theme.colors.text }]}>
                      {vehicle.make} {vehicle.model}
                    </Text>
                    <Text style={[globalStyles.vehicleColor, { color: theme.colors.textSecondary }]}>
                      {vehicle.color} • {vehicle.mileage} miles
                    </Text>
                  </View>
                  
                  <View style={[
                    globalStyles.vehicleLicensePlateBadge,
                    { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }
                  ]}>
                    <Text style={[globalStyles.vehicleLicensePlateText, { color: theme.colors.text }]}>
                      {vehicle.licensePlate}
                    </Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          ))
        ) : (
          <View style={globalStyles.emptyState}>
            <Text style={globalStyles.emptyStateIcon}>🚗</Text>
            <Text style={globalStyles.emptyStateTitle}>No Vehicles Yet</Text>
            <Text style={globalStyles.emptyStateText}>
              Add your first vehicle to get started with AutoCare services.
            </Text>
            <TouchableOpacity 
              style={[globalStyles.buttonBase, globalStyles.emptyStateButton]}
              onPress={() => navigation.navigate('AddVehicle')}
            >
              <Text style={globalStyles.buttonText}>Add Vehicle</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Recent Service Requests */}
      <View style={globalStyles.section}>
        <View style={globalStyles.sectionHeader}>
          <Text style={globalStyles.sectionTitle}>Recent Services</Text>
          <TouchableOpacity onPress={() => navigation.navigate('ServiceRequests')}>
            <Text style={[globalStyles.authFooterLink, { color: theme.colors.primary }]}>
              View All
            </Text>
          </TouchableOpacity>
        </View>
        
        {serviceRequests && serviceRequests.length > 0 ? (
          serviceRequests.slice(0, 3).map((service, index) => (
            <TouchableOpacity
              key={service.id}
              style={globalStyles.serviceRequestCard}
              onPress={() => navigation.navigate('ServiceDetails', { serviceId: service.id })}
            >
              {/* Status Accent */}
              <View style={[
                globalStyles.serviceStatusAccent,
                { backgroundColor: getStatusColor(service.status, theme.colors) }
              ]} />

              {/* Service Header */}
              <View style={globalStyles.serviceRequestHeader}>
                <View style={globalStyles.serviceRequestInfo}>
                  <Text style={[globalStyles.serviceRequestTitle, { color: theme.colors.text }]}>
                    {service.serviceType}
                  </Text>
                  <Text style={[globalStyles.serviceRequestVehicle, { color: theme.colors.textSecondary }]}>
                    {service.vehicleInfo}
                  </Text>
                  <Text style={[globalStyles.serviceRequestDate, { color: theme.colors.text }]}>
                    {service.scheduledDate}
                  </Text>
                </View>
                
                <View style={[
                  globalStyles.serviceRequestStatus,
                  { backgroundColor: getStatusColor(service.status, theme.colors) }
                ]}>
                  <Text style={globalStyles.serviceRequestStatusText}>
                    {service.status.replace('-', ' ')}
                  </Text>
                </View>
              </View>

              {/* Service Description */}
              {service.description && (
                <Text style={[
                  globalStyles.serviceRequestDescription,
                  { color: theme.colors.text }
                ]}>
                  {service.description}
                </Text>
              )}

              {/* Progress Bar */}
              {service.progress !== undefined && (
                <View style={globalStyles.serviceRequestProgress}>
                  <View style={[
                    globalStyles.serviceRequestProgressBar,
                    { backgroundColor: theme.colors.border }
                  ]}>
                    <View style={[
                      globalStyles.serviceRequestProgressFill,
                      { 
                        width: `${service.progress}%`,
                        backgroundColor: getStatusColor(service.status, theme.colors)
                      }
                    ]} />
                  </View>
                  <Text style={[
                    globalStyles.serviceRequestProgressText,
                    { color: theme.colors.textSecondary }
                  ]}>
                    {service.progress}% Complete
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          ))
        ) : (
          <View style={globalStyles.emptyState}>
            <Text style={globalStyles.emptyStateIcon}>🔧</Text>
            <Text style={globalStyles.emptyStateTitle}>No Services Yet</Text>
            <Text style={globalStyles.emptyStateText}>
              Book your first service to keep your vehicles in top condition.
            </Text>
            <TouchableOpacity 
              style={[globalStyles.buttonBase, globalStyles.emptyStateButton]}
              onPress={() => navigation.navigate('CreateServiceRequest')}
            >
              <Text style={globalStyles.buttonText}>Book Service</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Tips & Maintenance Reminders */}
      <View style={globalStyles.section}>
        <Text style={globalStyles.sectionTitle}>Maintenance Tips</Text>
        
        <View style={[
          globalStyles.card,
          { backgroundColor: theme.colors.info + '10', borderColor: theme.colors.info }
        ]}>
          <View style={globalStyles.cardHeader}>
            <Text style={[globalStyles.cardTitle, { color: theme.colors.info }]}>
              💡 Maintenance Reminder
            </Text>
          </View>
          <Text style={[globalStyles.cardSubtitle, { color: theme.colors.text }]}>
            Regular oil changes every 3,000-5,000 miles help keep your engine running smoothly.
            Check your vehicle maintenance schedule to stay up to date.
          </Text>
          <View style={globalStyles.cardActions}>
            <TouchableOpacity style={[
              globalStyles.buttonBase,
              globalStyles.buttonSmall,
              { backgroundColor: theme.colors.info }
            ]}>
              <Text style={globalStyles.buttonText}>Learn More</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default ClientDashboard;