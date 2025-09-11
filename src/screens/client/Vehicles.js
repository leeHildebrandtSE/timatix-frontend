// =============================================================================
// REFACTORED VEHICLE SCREENS WITH GLOBAL STYLES
// =============================================================================

// src/screens/client/Vehicles.js - Vehicle List Screen
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  FlatList,
  TextInput,
  RefreshControl,
  Image,
} from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { useTheme, useGlobalStyles } from '../../context/ThemeContext';

const Vehicles = ({ navigation }) => {
  const { user } = useAuth();
  const { vehicles, isLoading } = useApp();
  const { theme } = useTheme();
  const globalStyles = useGlobalStyles();

  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('all');

  const filters = [
    { id: 'all', label: 'All Vehicles', count: vehicles?.length || 0 },
    { id: 'active', label: 'Active', count: vehicles?.filter(v => v.status === 'active').length || 0 },
    { id: 'maintenance', label: 'In Service', count: vehicles?.filter(v => v.status === 'maintenance').length || 0 },
  ];

  const filteredVehicles = vehicles?.filter(vehicle => {
    const matchesSearch = vehicle.make.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         vehicle.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         vehicle.licensePlate.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = selectedFilter === 'all' || vehicle.status === selectedFilter;
    return matchesSearch && matchesFilter;
  }) || [];

  const handleRefresh = async () => {
    setRefreshing(true);
    // Refresh vehicles data
    setRefreshing(false);
  };

  const renderVehicleCard = ({ item: vehicle }) => (
    <TouchableOpacity
      style={globalStyles.clientVehicleCard}
      onPress={() => navigation.navigate('VehicleDetails', { vehicleId: vehicle.id })}
    >
      {/* Vehicle Image */}
      <View style={globalStyles.clientVehicleImage}>
        {vehicle.image ? (
          <Image source={{ uri: vehicle.image }} style={globalStyles.clientVehicleImage} />
        ) : (
          <View style={globalStyles.clientVehicleImagePlaceholder}>
            <Text style={globalStyles.clientVehicleImagePlaceholderIcon}>🚗</Text>
          </View>
        )}
      </View>

      {/* Vehicle Content */}
      <View style={globalStyles.clientVehicleContent}>
        <View style={globalStyles.clientVehicleHeader}>
          <View style={globalStyles.clientVehicleInfo}>
            <Text style={[globalStyles.clientVehicleName, { color: theme.colors.text }]}>
              {vehicle.year} {vehicle.make} {vehicle.model}
            </Text>
            <Text style={[globalStyles.clientVehicleDetails, { color: theme.colors.textSecondary }]}>
              {vehicle.color} • {vehicle.mileage} miles • {vehicle.licensePlate}
            </Text>
          </View>
          
          <View style={globalStyles.clientVehicleActions}>
            <TouchableOpacity
              style={[
                globalStyles.clientVehicleActionButton,
                { backgroundColor: theme.colors.primary }
              ]}
              onPress={() => navigation.navigate('VehicleDetails', { vehicleId: vehicle.id })}
            >
              <Text style={globalStyles.clientVehicleActionIcon}>👁️</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                globalStyles.clientVehicleActionButton,
                { backgroundColor: theme.colors.success }
              ]}
              onPress={() => navigation.navigate('CreateServiceRequest', { vehicleId: vehicle.id })}
            >
              <Text style={globalStyles.clientVehicleActionIcon}>🔧</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={globalStyles.listContainer}>
      {/* Awesome Header */}
      <View style={[
        globalStyles.dashboardGradientHeader,
        {
          background: 'linear-gradient(135deg, #4ECDC4 0%, #44A08D 100%)',
          backgroundColor: '#4ECDC4',
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
            🚗
          </Text>
          <Text style={{
            fontSize: 80,
            color: '#fff',
            position: 'absolute',
            bottom: -10,
            left: -20,
            transform: [{ rotate: '-15deg' }],
          }}>
            🔑
          </Text>
        </View>

        <View style={globalStyles.dashboardHeaderContent}>
          <View style={globalStyles.dashboardGreeting}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
              <Text style={{ fontSize: 32, marginRight: 12 }}>🚗</Text>
              <Text style={[globalStyles.dashboardGreetingText, { fontSize: 28 }]}>
                My Vehicles
              </Text>
            </View>
            <Text style={globalStyles.dashboardGreetingSubtext}>
              Manage your vehicle fleet and schedule services
            </Text>
          </View>

          <TouchableOpacity
            style={[globalStyles.dashboardProfileButton, {
              backgroundColor: 'rgba(255,255,255,0.25)',
              borderWidth: 2,
              borderColor: 'rgba(255,255,255,0.3)',
            }]}
            onPress={() => navigation.navigate('AddVehicle')}
          >
            <Text style={[globalStyles.dashboardProfileIcon, { fontSize: 28 }]}>➕</Text>
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
              {vehicles?.length || 0}
            </Text>
            <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 12 }}>
              Total Vehicles
            </Text>
          </View>
          <View style={{ alignItems: 'center' }}>
            <Text style={{ color: '#fff', fontSize: 20, fontWeight: 'bold' }}>
              {vehicles?.filter(v => v.status === 'active').length || 0}
            </Text>
            <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 12 }}>
              Active
            </Text>
          </View>
          <View style={{ alignItems: 'center' }}>
            <Text style={{ color: '#fff', fontSize: 20, fontWeight: 'bold' }}>
              {vehicles?.filter(v => v.status === 'maintenance').length || 0}
            </Text>
            <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 12 }}>
              In Service
            </Text>
          </View>
        </View>
      </View>

      {/* Search Bar */}
      <View style={[globalStyles.searchBarContainer, { marginTop: 16 }]}>
        <Text style={globalStyles.searchIcon}>🔍</Text>
        <TextInput
          style={globalStyles.searchInput}
          placeholder="Search vehicles..."
          placeholderTextColor={theme.colors.placeholder}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery ? (
          <TouchableOpacity
            style={globalStyles.searchClearButton}
            onPress={() => setSearchQuery('')}
          >
            <Text style={globalStyles.searchClearIcon}>✕</Text>
          </TouchableOpacity>
        ) : null}
      </View>

      {/* Filter Chips */}
      <ScrollView
        horizontal
        style={globalStyles.filtersScrollContainer}
        showsHorizontalScrollIndicator={false}
      >
        <View style={globalStyles.filterChipsContainer}>
          {filters.map((filter) => (
            <TouchableOpacity
              key={filter.id}
              style={[
                globalStyles.filterChipBase,
                globalStyles.filterChipMedium,
                selectedFilter === filter.id
                  ? globalStyles.filterChipDefaultActive
                  : globalStyles.filterChipDefault
              ]}
              onPress={() => setSelectedFilter(filter.id)}
            >
              <Text style={[
                globalStyles.filterChipText,
                selectedFilter === filter.id && globalStyles.filterChipTextActive
              ]}>
                {filter.label}
              </Text>
              {filter.count > 0 && (
                <View style={globalStyles.filterChipCountBadge}>
                  <Text style={globalStyles.filterChipCountText}>{filter.count}</Text>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Vehicle List */}
      <FlatList
        data={filteredVehicles}
        renderItem={renderVehicleCard}
        keyExtractor={(item) => item.id}
        style={globalStyles.listContainer}
        contentContainerStyle={globalStyles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={[theme.colors.primary]}
            tintColor={theme.colors.primary}
          />
        }
        ListEmptyComponent={() => (
          <View style={globalStyles.emptyState}>
            <Text style={globalStyles.emptyStateIcon}>🚗</Text>
            <Text style={globalStyles.emptyStateTitle}>No Vehicles Found</Text>
            <Text style={globalStyles.emptyStateText}>
              {searchQuery
                ? 'No vehicles match your search criteria.'
                : 'Add your first vehicle to get started with AutoCare services.'
              }
            </Text>
            <TouchableOpacity
              style={[globalStyles.buttonBase, globalStyles.emptyStateButton]}
              onPress={() => navigation.navigate('AddVehicle')}
            >
              <Text style={globalStyles.buttonText}>Add Vehicle</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
};

// =============================================================================
// src/screens/client/VehicleDetails.js - Vehicle Details Screen
// =============================================================================

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';

const VehicleDetails = ({ route, navigation }) => {
  const { vehicleId } = route.params;
  const { theme } = useTheme();
  const globalStyles = useGlobalStyles();

  const [vehicle, setVehicle] = useState(null);
  const [serviceHistory, setServiceHistory] = useState([]);

  useEffect(() => {
    loadVehicleDetails();
  }, [vehicleId]);

  const loadVehicleDetails = async () => {
    // Mock data - replace with actual API call
    setVehicle({
      id: vehicleId,
      make: 'Toyota',
      model: 'Camry',
      year: 2020,
      color: 'Silver',
      licensePlate: 'ABC-123',
      vin: '1HGBH41JXMN109186',
      mileage: '45,230',
      fuelType: 'Gasoline',
      transmission: 'Automatic',
      engine: '2.5L 4-Cylinder',
      status: 'active',
      image: null,
    });

    setServiceHistory([
      {
        id: 1,
        date: '2024-01-15',
        type: 'Oil Change',
        status: 'completed',
        mileage: '44,500',
      },
      {
        id: 2,
        date: '2023-11-20',
        type: 'Brake Inspection',
        status: 'completed',
        mileage: '43,200',
      },
    ]);
  };

  const handleDeleteVehicle = () => {
    Alert.alert(
      'Delete Vehicle',
      'Are you sure you want to delete this vehicle? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            // Delete vehicle logic
            navigation.goBack();
          },
        },
      ]
    );
  };

  const handleBookService = () => {
    navigation.navigate('CreateServiceRequest', { vehicleId });
  };

  if (!vehicle) {
    return (
      <View style={[globalStyles.container, globalStyles.centerContent]}>
        <Text style={globalStyles.loadingMessage}>Loading vehicle details...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={globalStyles.vehicleDetailsContainer}>
      {/* Vehicle Image */}
      <View style={globalStyles.vehicleDetailsImage}>
        {vehicle.image ? (
          <Image source={{ uri: vehicle.image }} style={globalStyles.vehicleDetailsImage} />
        ) : (
          <View style={globalStyles.vehicleDetailsImagePlaceholder}>
            <Text style={globalStyles.vehicleDetailsImagePlaceholderIcon}>🚗</Text>
            <Text style={globalStyles.vehicleDetailsImagePlaceholderText}>
              No Image Available
            </Text>
          </View>
        )}
      </View>

      {/* Vehicle Content */}
      <View style={globalStyles.vehicleDetailsContent}>
        {/* Header */}
        <View style={globalStyles.vehicleDetailsHeader}>
          <Text style={[globalStyles.vehicleDetailsTitle, { color: theme.colors.text }]}>
            {vehicle.year} {vehicle.make} {vehicle.model}
          </Text>
          <Text style={[globalStyles.vehicleDetailsSubtitle, { color: theme.colors.textSecondary }]}>
            {vehicle.color} • {vehicle.mileage} miles
          </Text>
          <View style={[
            globalStyles.vehicleDetailsLicensePlate,
            { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }
          ]}>
            <Text style={[globalStyles.vehicleDetailsLicensePlateText, { color: theme.colors.text }]}>
              {vehicle.licensePlate}
            </Text>
          </View>
        </View>

        {/* Vehicle Information */}
        <View style={globalStyles.vehicleDetailsInfoSection}>
          <Text style={[globalStyles.vehicleDetailsInfoTitle, { color: theme.colors.text }]}>
            Vehicle Information
          </Text>
          
          <View style={[
            globalStyles.vehicleDetailsInfoRow,
            { borderBottomColor: theme.colors.borderLight }
          ]}>
            <Text style={[globalStyles.vehicleDetailsInfoLabel, { color: theme.colors.textSecondary }]}>
              Make & Model
            </Text>
            <Text style={[globalStyles.vehicleDetailsInfoValue, { color: theme.colors.text }]}>
              {vehicle.make} {vehicle.model}
            </Text>
          </View>
          
          <View style={[
            globalStyles.vehicleDetailsInfoRow,
            { borderBottomColor: theme.colors.borderLight }
          ]}>
            <Text style={[globalStyles.vehicleDetailsInfoLabel, { color: theme.colors.textSecondary }]}>
              Year
            </Text>
            <Text style={[globalStyles.vehicleDetailsInfoValue, { color: theme.colors.text }]}>
              {vehicle.year}
            </Text>
          </View>
          
          <View style={[
            globalStyles.vehicleDetailsInfoRow,
            { borderBottomColor: theme.colors.borderLight }
          ]}>
            <Text style={[globalStyles.vehicleDetailsInfoLabel, { color: theme.colors.textSecondary }]}>
              Color
            </Text>
            <Text style={[globalStyles.vehicleDetailsInfoValue, { color: theme.colors.text }]}>
              {vehicle.color}
            </Text>
          </View>
          
          <View style={[
            globalStyles.vehicleDetailsInfoRow,
            { borderBottomColor: theme.colors.borderLight }
          ]}>
            <Text style={[globalStyles.vehicleDetailsInfoLabel, { color: theme.colors.textSecondary }]}>
              Mileage
            </Text>
            <Text style={[globalStyles.vehicleDetailsInfoValue, { color: theme.colors.text }]}>
              {vehicle.mileage} miles
            </Text>
          </View>
          
          <View style={[
            globalStyles.vehicleDetailsInfoRow,
            { borderBottomColor: theme.colors.borderLight }
          ]}>
            <Text style={[globalStyles.vehicleDetailsInfoLabel, { color: theme.colors.textSecondary }]}>
              Fuel Type
            </Text>
            <Text style={[globalStyles.vehicleDetailsInfoValue, { color: theme.colors.text }]}>
              {vehicle.fuelType}
            </Text>
          </View>
          
          <View style={[
            globalStyles.vehicleDetailsInfoRow,
            { borderBottomColor: theme.colors.borderLight }
          ]}>
            <Text style={[globalStyles.vehicleDetailsInfoLabel, { color: theme.colors.textSecondary }]}>
              Transmission
            </Text>
            <Text style={[globalStyles.vehicleDetailsInfoValue, { color: theme.colors.text }]}>
              {vehicle.transmission}
            </Text>
          </View>
          
          <View style={[
            globalStyles.vehicleDetailsInfoRow,
            { borderBottomColor: theme.colors.borderLight }
          ]}>
            <Text style={[globalStyles.vehicleDetailsInfoLabel, { color: theme.colors.textSecondary }]}>
              Engine
            </Text>
            <Text style={[globalStyles.vehicleDetailsInfoValue, { color: theme.colors.text }]}>
              {vehicle.engine}
            </Text>
          </View>
          
          <View style={[globalStyles.vehicleDetailsInfoRow, globalStyles.vehicleDetailsInfoRowLast]}>
            <Text style={[globalStyles.vehicleDetailsInfoLabel, { color: theme.colors.textSecondary }]}>
              VIN
            </Text>
            <Text style={[
              globalStyles.vehicleDetailsInfoValue,
              { color: theme.colors.text, fontFamily: 'monospace', fontSize: 12 }
            ]}>
              {vehicle.vin}
            </Text>
          </View>
        </View>

        {/* Service History */}
        <View style={globalStyles.vehicleDetailsInfoSection}>
          <Text style={[globalStyles.vehicleDetailsInfoTitle, { color: theme.colors.text }]}>
            Recent Service History
          </Text>
          
          {serviceHistory.length > 0 ? (
            serviceHistory.map((service, index) => (
              <View
                key={service.id}
                style={[
                  globalStyles.vehicleDetailsInfoRow,
                  index === serviceHistory.length - 1 && globalStyles.vehicleDetailsInfoRowLast,
                  { borderBottomColor: theme.colors.borderLight }
                ]}
              >
                <View style={{ flex: 1 }}>
                  <Text style={[globalStyles.vehicleDetailsInfoValue, { color: theme.colors.text }]}>
                    {service.type}
                  </Text>
                  <Text style={[globalStyles.vehicleDetailsInfoLabel, { color: theme.colors.textSecondary }]}>
                    {service.date} • {service.mileage} miles
                  </Text>
                </View>
                <View style={[
                  globalStyles.statusBadge,
                  globalStyles.statusBadgeSmall,
                  { backgroundColor: theme.colors.success }
                ]}>
                  <Text style={[globalStyles.statusBadgeText, globalStyles.statusBadgeTextSmall]}>
                    {service.status}
                  </Text>
                </View>
              </View>
            ))
          ) : (
            <Text style={[globalStyles.vehicleDetailsInfoLabel, { color: theme.colors.textSecondary }]}>
              No service history available
            </Text>
          )}
        </View>

        {/* Action Buttons */}
        <View style={globalStyles.vehicleDetailsActions}>
          <TouchableOpacity
            style={[globalStyles.buttonBase, globalStyles.detailsActionButton]}
            onPress={handleBookService}
          >
            <Text style={globalStyles.buttonText}>Book Service</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              globalStyles.buttonBase,
              globalStyles.buttonSecondary,
              globalStyles.detailsActionButton
            ]}
            onPress={handleEditVehicle}
          >
            <Text style={[globalStyles.buttonText, globalStyles.buttonTextSecondary]}>
              Edit Vehicle
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              globalStyles.buttonBase,
              globalStyles.buttonDanger,
              globalStyles.detailsActionButtonLast
            ]}
            onPress={handleDeleteVehicle}
          >
            <Text style={globalStyles.buttonText}>Delete Vehicle</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

// =============================================================================
// src/screens/client/ServiceRequestsScreen.js - Service Requests List
// =============================================================================

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  FlatList,
  TextInput,
  RefreshControl,
} from 'react-native';

const ServiceRequestsScreen = ({ navigation }) => {
  const { user } = useAuth();
  const { serviceRequests, isLoading } = useApp();
  const { theme } = useTheme();
  const globalStyles = useGlobalStyles();

  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('all');

  // Filter client's service requests
  const clientServiceRequests = serviceRequests?.filter(
    request => request.clientId === user?.id
  ) || [];

  const filters = [
    { id: 'all', label: 'All Services', count: clientServiceRequests.length },
    { id: 'pending', label: 'Pending', count: clientServiceRequests.filter(s => s.status === 'pending').length },
    { id: 'in-progress', label: 'In Progress', count: clientServiceRequests.filter(s => s.status === 'in-progress').length },
    { id: 'completed', label: 'Completed', count: clientServiceRequests.filter(s => s.status === 'completed').length },
  ];

  const filteredServices = clientServiceRequests.filter(service => {
    const matchesSearch = service.serviceType.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         service.vehicleInfo.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = selectedFilter === 'all' || service.status === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  const handleRefresh = async () => {
    setRefreshing(true);
    // Refresh service requests data
    setRefreshing(false);
  };

  const renderServiceCard = ({ item: service }) => (
    <TouchableOpacity
      style={globalStyles.serviceRequestCard}
      onPress={() => navigation.navigate('ServiceDetails', { serviceId: service.id })}
    >
      {/* Status Accent */}
      <View style={[
        globalStyles.serviceRequestStatusAccent,
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
            Scheduled: {service.scheduledDate}
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

      {/* Description */}
      {service.description && (
        <Text style={[globalStyles.serviceRequestDescription, { color: theme.colors.text }]}>
          {service.description}
        </Text>
      )}

      {/* Progress */}
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

      {/* Actions */}
      <View style={globalStyles.serviceRequestActions}>
        <TouchableOpacity
          style={[
            globalStyles.buttonBase,
            globalStyles.buttonSmall,
            { flex: 1, marginRight: 8 }
          ]}
          onPress={() => navigation.navigate('ServiceDetails', { serviceId: service.id })}
        >
          <Text style={globalStyles.buttonText}>View Details</Text>
        </TouchableOpacity>
        
        {service.status === 'pending' && (
          <TouchableOpacity
            style={[
              globalStyles.buttonBase,
              globalStyles.buttonSecondary,
              globalStyles.buttonSmall,
              { flex: 1 }
            ]}
            onPress={() => navigation.navigate('EditServiceRequest', { serviceId: service.id })}
          >
            <Text style={[globalStyles.buttonText, globalStyles.buttonTextSecondary]}>
              Edit
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={globalStyles.listContainer}>
      {/* Awesome Header */}
      <View style={[
        globalStyles.dashboardGradientHeader,
        {
          background: 'linear-gradient(135deg, #FF8A80 0%, #FF5722 100%)',
          backgroundColor: '#FF8A80',
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
            🔧
          </Text>
          <Text style={{
            fontSize: 80,
            color: '#fff',
            position: 'absolute',
            bottom: -10,
            left: -20,
            transform: [{ rotate: '-15deg' }],
          }}>
            📋
          </Text>
        </View>

        <View style={globalStyles.dashboardHeaderContent}>
          <View style={globalStyles.dashboardGreeting}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
              <Text style={{ fontSize: 32, marginRight: 12 }}>🔧</Text>
              <Text style={[globalStyles.dashboardGreetingText, { fontSize: 28 }]}>
                My Services
              </Text>
            </View>
            <Text style={globalStyles.dashboardGreetingSubtext}>
              Track your vehicle service requests and maintenance
            </Text>
          </View>

          <TouchableOpacity
            style={[globalStyles.dashboardProfileButton, {
              backgroundColor: 'rgba(255,255,255,0.25)',
              borderWidth: 2,
              borderColor: 'rgba(255,255,255,0.3)',
            }]}
            onPress={() => navigation.navigate('CreateServiceRequest')}
          >
            <Text style={[globalStyles.dashboardProfileIcon, { fontSize: 28 }]}>➕</Text>
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
              {clientServiceRequests.length}
            </Text>
            <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 12 }}>
              Total Services
            </Text>
          </View>
          <View style={{ alignItems: 'center' }}>
            <Text style={{ color: '#fff', fontSize: 20, fontWeight: 'bold' }}>
              {clientServiceRequests.filter(s => s.status === 'in-progress').length}
            </Text>
            <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 12 }}>
              In Progress
            </Text>
          </View>
          <View style={{ alignItems: 'center' }}>
            <Text style={{ color: '#fff', fontSize: 20, fontWeight: 'bold' }}>
              {clientServiceRequests.filter(s => s.status === 'completed').length}
            </Text>
            <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 12 }}>
              Completed
            </Text>
          </View>
        </View>
      </View>

      {/* Search Bar */}
      <View style={[globalStyles.searchBarContainer, { marginTop: 16 }]}>
        <Text style={globalStyles.searchIcon}>🔍</Text>
        <TextInput
          style={globalStyles.searchInput}
          placeholder="Search services..."
          placeholderTextColor={theme.colors.placeholder}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery ? (
          <TouchableOpacity
            style={globalStyles.searchClearButton}
            onPress={() => setSearchQuery('')}
          >
            <Text style={globalStyles.searchClearIcon}>✕</Text>
          </TouchableOpacity>
        ) : null}
      </View>

      {/* Filter Chips */}
      <ScrollView
        horizontal
        style={globalStyles.filtersScrollContainer}
        showsHorizontalScrollIndicator={false}
      >
        <View style={globalStyles.filterChipsContainer}>
          {filters.map((filter) => (
            <TouchableOpacity
              key={filter.id}
              style={[
                globalStyles.filterChipBase,
                globalStyles.filterChipMedium,
                selectedFilter === filter.id
                  ? globalStyles.filterChipDefaultActive
                  : globalStyles.filterChipDefault
              ]}
              onPress={() => setSelectedFilter(filter.id)}
            >
              <Text style={[
                globalStyles.filterChipText,
                selectedFilter === filter.id && globalStyles.filterChipTextActive
              ]}>
                {filter.label}
              </Text>
              {filter.count > 0 && (
                <View style={globalStyles.filterChipCountBadge}>
                  <Text style={globalStyles.filterChipCountText}>{filter.count}</Text>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Service List */}
      <FlatList
        data={filteredServices}
        renderItem={renderServiceCard}
        keyExtractor={(item) => item.id}
        style={globalStyles.listContainer}
        contentContainerStyle={globalStyles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={[theme.colors.primary]}
            tintColor={theme.colors.primary}
          />
        }
        ListEmptyComponent={() => (
          <View style={globalStyles.emptyState}>
            <Text style={globalStyles.emptyStateIcon}>🔧</Text>
            <Text style={globalStyles.emptyStateTitle}>No Services Found</Text>
            <Text style={globalStyles.emptyStateText}>
              {searchQuery
                ? 'No services match your search criteria.'
                : 'You haven\'t requested any services yet. Book your first service to get started.'
              }
            </Text>
            <TouchableOpacity
              style={[globalStyles.buttonBase, globalStyles.emptyStateButton]}
              onPress={() => navigation.navigate('CreateServiceRequest')}
            >
              <Text style={globalStyles.buttonText}>Book Service</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
};

export default {
  Vehicles,
  VehicleDetails,
  ServiceRequestsScreen,
};