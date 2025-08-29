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
  Modal,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { useTheme } from '../../context/ThemeContext';
import MetricCard from '../../components/cards/MetricCard';
import ServiceCard from '../../components/cards/ServiceCard';
import VehicleForm from '../../components/forms/VehicleForm';
import Button from '../../components/common/Button';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { vehiclesService } from '../../services/vehicles';
import { serviceRequestsService } from '../../services/serviceRequestsService';
import { formatDate, formatMileage, formatCurrency } from '../../utils/formatters';

const [vehicleMakes, setVehicleMakes] = useState([]);

useEffect(() => {
  fetchVehicleMakes();
}, []);

const fetchVehicleMakes = async () => {
  try {
    const makes = await vehiclesService.getVehicleMakes(); // new API call
    setVehicleMakes(makes); // assumes API returns array of { make: 'TOYOTA' } objects
  } catch (error) {
    console.error('Error fetching vehicle makes:', error);
    // fallback list if API fails
    setVehicleMakes([
      { make: 'TOYOTA' },
      { make: 'BMW' },
      { make: 'FORD' },
    ]);
  }
};

const VehicleDetails = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { vehicleId } = route.params;
  
  const { user } = useAuth();
  const { 
    vehicles, 
    serviceRequests,
    updateVehicle,
    deleteVehicle,
    addNotification,
    isLoading,
    setLoading 
  } = useApp();
  const { theme } = useTheme();
  
  const [refreshing, setRefreshing] = useState(false);
  const [vehicle, setVehicle] = useState(null);
  const [serviceHistory, setServiceHistory] = useState([]);
  const [maintenanceReminders, setMaintenanceReminders] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
    loadVehicleDetails();
  }, [vehicleId]);

  const loadVehicleDetails = async () => {
    try {
      setLoading(true);
      
      // Find vehicle in local state first
      const foundVehicle = vehicles.find(v => v.id === vehicleId);
      if (foundVehicle) {
        setVehicle(foundVehicle);
      }
      
      // Load additional data
      await Promise.all([
        loadServiceHistory(),
        loadMaintenanceReminders(),
      ]);
      
      // If not found locally, try API
      if (!foundVehicle) {
        const vehicleData = await vehiclesService.getVehicleById(vehicleId);
        setVehicle(vehicleData);
      }
    } catch (error) {
      console.error('Error loading vehicle details:', error);
      Alert.alert('Error', 'Failed to load vehicle details');
    } finally {
      setLoading(false);
    }
  };

  const loadServiceHistory = async () => {
    try {
      // Filter service requests for this vehicle
      const vehicleServices = serviceRequests.filter(req => req.vehicle?.id === vehicleId);
      setServiceHistory(vehicleServices.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
    } catch (error) {
      console.error('Error loading service history:', error);
      
      // Mock service history
      const mockHistory = [
        {
          id: 'sh1',
          serviceType: 'Oil Change',
          status: 'COMPLETED',
          date: '2024-12-15',
          mileage: 43000,
          cost: 350,
          mechanic: 'Mike Smith',
          notes: 'Regular maintenance completed',
        },
        {
          id: 'sh2',
          serviceType: 'Brake Inspection',
          status: 'COMPLETED',
          date: '2024-10-20',
          mileage: 41500,
          cost: 150,
          mechanic: 'Jane Wilson',
          notes: 'Brakes in good condition',
        },
        {
          id: 'sh3',
          serviceType: 'General Service',
          status: 'COMPLETED',
          date: '2024-06-10',
          mileage: 38000,
          cost: 800,
          mechanic: 'Mike Smith',
          notes: 'Full service including filters and fluids',
        },
      ];
      setServiceHistory(mockHistory);
    }
  };

  const loadMaintenanceReminders = async () => {
    try {
      const reminders = await vehiclesService.getMaintenanceReminders(vehicleId);
      setMaintenanceReminders(reminders);
    } catch (error) {
      console.error('Error loading maintenance reminders:', error);
      
      // Mock reminders
      const mockReminders = [
        {
          id: 'r1',
          type: 'Oil Change',
          dueDate: '2025-02-15',
          dueMileage: 50000,
          priority: 'NORMAL',
          description: 'Engine oil and filter change due',
        },
        {
          id: 'r2',
          type: 'Tire Rotation',
          dueDate: '2025-03-01',
          dueMileage: 52000,
          priority: 'LOW',
          description: 'Rotate tires for even wear',
        },
        {
          id: 'r3',
          type: 'Brake Service',
          dueDate: '2025-01-30',
          dueMileage: 48000,
          priority: 'HIGH',
          description: 'Brake pads may need replacement soon',
        },
      ];
      setMaintenanceReminders(mockReminders);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadVehicleDetails();
    setRefreshing(false);
  };

  const handleEditVehicle = () => {
    setShowEditModal(true);
  };

  const handleDeleteVehicle = () => {
    Alert.alert(
      'Delete Vehicle',
      `Are you sure you want to delete ${vehicle.year} ${vehicle.make} ${vehicle.model}? This will also delete all associated service history.`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: async () => {
            try {
              await vehiclesService.deleteVehicle(vehicleId);
              deleteVehicle(vehicleId);
              
              addNotification({
                title: 'Vehicle Deleted',
                message: `${vehicle.year} ${vehicle.make} ${vehicle.model} has been deleted.`,
                type: 'success',
              });
              
              navigation.goBack();
            } catch (error) {
              Alert.alert('Error', 'Failed to delete vehicle');
            }
          }
        },
      ]
    );
  };

  const handleUpdateVehicle = async (vehicleData) => {
    try {
      setFormLoading(true);
      
      const updatedVehicle = await vehiclesService.updateVehicle(vehicleId, vehicleData);
      updateVehicle(updatedVehicle);
      setVehicle(updatedVehicle);
      
      addNotification({
        title: 'Vehicle Updated',
        message: `${vehicleData.year} ${vehicleData.make} ${vehicleData.model} has been updated.`,
        type: 'success',
      });
      
      setShowEditModal(false);
    } catch (error) {
      console.error('Error updating vehicle:', error);
      Alert.alert('Error', 'Failed to update vehicle');
    } finally {
      setFormLoading(false);
    }
  };

  const handleBookService = () => {
    navigation.navigate('CreateServiceRequest', { vehicleId });
  };

  const handleServicePress = (service) => {
    navigation.navigate('ServiceDetails', { serviceId: service.id });
  };

  const handleDismissReminder = async (reminderId) => {
    try {
      // API call would go here
      // await vehiclesService.dismissReminder(reminderId);
      
      setMaintenanceReminders(prev => prev.filter(r => r.id !== reminderId));
      
      addNotification({
        title: 'Reminder Dismissed',
        message: 'Maintenance reminder has been dismissed.',
        type: 'info',
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to dismiss reminder');
    }
  };

  const handleUpdateMileage = () => {
    Alert.prompt(
      'Update Mileage',
      `Current mileage: ${formatMileage(vehicle?.mileage)}\nEnter new mileage:`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Update',
          onPress: async (newMileage) => {
            if (newMileage && !isNaN(newMileage)) {
              try {
                await vehiclesService.updateMileage(vehicleId, parseInt(newMileage));
                const updatedVehicle = { ...vehicle, mileage: parseInt(newMileage) };
                setVehicle(updatedVehicle);
                updateVehicle(updatedVehicle);
                
                addNotification({
                  title: 'Mileage Updated',
                  message: `Mileage updated to ${formatMileage(parseInt(newMileage))}.`,
                  type: 'success',
                });
              } catch (error) {
                Alert.alert('Error', 'Failed to update mileage');
              }
            }
          }
        },
      ],
      'plain-text',
      vehicle?.mileage?.toString()
    );
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'HIGH': return theme.colors.error;
      case 'NORMAL': return theme.colors.warning;
      case 'LOW': return theme.colors.info;
      default: return theme.colors.textSecondary;
    }
  };

  const calculateVehicleStats = () => {
    const completedServices = serviceHistory.filter(s => s.status === 'COMPLETED');
    const totalCost = completedServices.reduce((sum, service) => sum + (service.cost || 0), 0);
    const lastServiceDate = completedServices.length > 0 ? completedServices[0].date : null;
    
    return {
      totalServices: completedServices.length,
      totalCost,
      lastServiceDate,
      avgServiceCost: completedServices.length > 0 ? totalCost / completedServices.length : 0,
    };
  };

  if (isLoading && !refreshing) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <LoadingSpinner message="Loading vehicle details..." />
      </SafeAreaView>
    );
  }

  if (!vehicle) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <View style={styles.errorContainer}>
          <Text style={[styles.errorText, theme.typography.h6]}>
            Vehicle not found
          </Text>
          <Button
            title="Go Back"
            onPress={() => navigation.goBack()}
            style={styles.errorButton}
          />
        </View>
      </SafeAreaView>
    );
  }

  const stats = calculateVehicleStats();
  const upcomingReminders = maintenanceReminders
    .filter(r => new Date(r.dueDate) <= new Date(Date.now() + 30 * 24 * 60 * 60 * 1000))
    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));

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
        {/* Vehicle Header */}
        <View style={[styles.vehicleHeader, { backgroundColor: theme.colors.surface }]}>
          <View style={styles.vehicleInfo}>
            <Text style={[styles.vehicleName, theme.typography.h3]}>
              {vehicle.year} {vehicle.make} {vehicle.model}
            </Text>
            <Text style={[styles.vehicleDetails, theme.typography.body1]}>
              {vehicle.color} • {vehicle.licensePlate}
            </Text>
            {vehicle.vin && (
              <Text style={[styles.vehicleVin, theme.typography.caption]}>
                VIN: {vehicle.vin}
              </Text>
            )}
          </View>
          
          <View style={styles.vehicleActions}>
            <TouchableOpacity
              style={[styles.headerButton, { backgroundColor: theme.colors.primary }]}
              onPress={handleEditVehicle}
            >
              <Text style={styles.headerButtonText}>Edit</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.headerButton, { backgroundColor: theme.colors.error }]}
              onPress={handleDeleteVehicle}
            >
              <Text style={styles.headerButtonText}>Delete</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <Button
            title="Book Service"
            onPress={handleBookService}
            style={styles.primaryAction}
          />
          <Button
            title="Update Mileage"
            variant="outline"
            onPress={handleUpdateMileage}
            style={styles.secondaryAction}
          />
        </View>

        {/* Vehicle Stats */}
        <View style={styles.statsContainer}>
          <Text style={[styles.sectionTitle, theme.typography.h5]}>
            Vehicle Overview
          </Text>
          
          <View style={styles.statsGrid}>
            <MetricCard
              title="Current Mileage"
              value={formatMileage(vehicle.mileage)}
              icon="🚗"
              color={theme.colors.primary}
              size="small"
              style={styles.statCard}
              onPress={handleUpdateMileage}
            />
            
            <MetricCard
              title="Total Services"
              value={stats.totalServices.toString()}
              icon="🔧"
              color={theme.colors.secondary}
              size="small"
              style={styles.statCard}
            />
            
            <MetricCard
              title="Total Spent"
              value={formatCurrency(stats.totalCost)}
              icon="💰"
              color={theme.colors.success}
              size="small"
              style={styles.statCard}
            />
            
            <MetricCard
              title="Avg Service Cost"
              value={formatCurrency(stats.avgServiceCost)}
              icon="📊"
              color={theme.colors.info}
              size="small"
              style={styles.statCard}
            />
          </View>
          
          {stats.lastServiceDate && (
            <MetricCard
              title="Last Service"
              value={formatDate(stats.lastServiceDate)}
              icon="📅"
              color={theme.colors.warning}
              size="large"
              style={[styles.statCard, styles.lastServiceCard]}
            />
          )}
        </View>

        {/* Maintenance Reminders */}
        {upcomingReminders.length > 0 && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, theme.typography.h5]}>
              Upcoming Maintenance
            </Text>
            
            {upcomingReminders.map((reminder) => (
              <View key={reminder.id} style={[styles.reminderCard, { backgroundColor: theme.colors.surface }]}>
                <View style={styles.reminderHeader}>
                  <View style={styles.reminderInfo}>
                    <Text style={[styles.reminderType, theme.typography.h6]}>
                      {reminder.type}
                    </Text>
                    <Text style={[styles.reminderDescription, theme.typography.body2]}>
                      {reminder.description}
                    </Text>
                  </View>
                  
                  <View style={[styles.priorityBadge, { backgroundColor: getPriorityColor(reminder.priority) }]}>
                    <Text style={styles.priorityText}>{reminder.priority}</Text>
                  </View>
                </View>
                
                <View style={styles.reminderDetails}>
                  <Text style={[styles.reminderDate, theme.typography.caption]}>
                    Due: {formatDate(reminder.dueDate)}
                  </Text>
                  <Text style={[styles.reminderMileage, theme.typography.caption]}>
                    At: {formatMileage(reminder.dueMileage)}
                  </Text>
                </View>
                
                <View style={styles.reminderActions}>
                  <Button
                    title="Book Service"
                    onPress={handleBookService}
                    size="small"
                    style={styles.reminderButton}
                  />
                  
                  <Button
                    title="Dismiss"
                    onPress={() => handleDismissReminder(reminder.id)}
                    size="small"
                    variant="ghost"
                    style={styles.reminderButton}
                  />
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Service History */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, theme.typography.h5]}>
            Service History
          </Text>
          
          {serviceHistory.length > 0 ? (
            serviceHistory.map((service) => (
              <View key={service.id} style={styles.serviceCard}>
                {service.vehicle ? (
                  <ServiceCard
                    service={service}
                    onPress={handleServicePress}
                    userRole="CLIENT"
                  />
                ) : (
                  // Render custom service history card for completed services
                  <View style={[styles.historyCard, { backgroundColor: theme.colors.surface }]}>
                    <View style={styles.historyHeader}>
                      <Text style={[styles.historyType, theme.typography.h6]}>
                        {service.serviceType}
                      </Text>
                      <Text style={[styles.historyCost, theme.typography.h6]}>
                        {formatCurrency(service.cost)}
                      </Text>
                    </View>
                    
                    <View style={styles.historyDetails}>
                      <Text style={[styles.historyDate, theme.typography.body2]}>
                        {formatDate(service.date)} • {formatMileage(service.mileage)}
                      </Text>
                      <Text style={[styles.historyMechanic, theme.typography.caption]}>
                        Mechanic: {service.mechanic}
                      </Text>
                      {service.notes && (
                        <Text style={[styles.historyNotes, theme.typography.caption]}>
                          {service.notes}
                        </Text>
                      )}
                    </View>
                  </View>
                )}
              </View>
            ))
          ) : (
            <View style={[styles.emptyState, { backgroundColor: theme.colors.surface }]}>
              <Text style={[styles.emptyStateText, theme.typography.body2]}>
                No service history yet
              </Text>
              <Button
                title="Book First Service"
                onPress={handleBookService}
                style={styles.emptyStateButton}
              />
            </View>
          )}
        </View>
      </ScrollView>

      {/* Edit Modal */}
      <Modal
        visible={showEditModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <SafeAreaView style={[styles.modalContainer, { backgroundColor: theme.colors.background }]}>
          <View style={styles.modalHeader}>
            <Text style={[styles.modalTitle, theme.typography.h4]}>
              Edit Vehicle
            </Text>
            <TouchableOpacity onPress={() => setShowEditModal(false)}>
              <Text style={[styles.modalClose, { color: theme.colors.primary }]}>
                Cancel
              </Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            <VehicleForm
              onSubmit={handleUpdateVehicle}
              loading={formLoading}
              initialData={vehicle}
              isEditing={true}
              vehicleMakes={vehicleMakes}
            />
          </ScrollView>
        </SafeAreaView>
      </Modal>
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
  vehicleHeader: {
    marginHorizontal: 20,
    marginTop: 16,
    marginBottom: 24,
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  vehicleInfo: {
    marginBottom: 16,
  },
  vehicleName: {
    marginBottom: 4,
  },
  vehicleDetails: {
    opacity: 0.8,
    marginBottom: 4,
  },
  vehicleVin: {
    opacity: 0.6,
    fontFamily: 'monospace',
  },
  vehicleActions: {
    flexDirection: 'row',
    gap: 12,
  },
  headerButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    flex: 1,
    alignItems: 'center',
  },
  headerButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
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
  statsContainer: {
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  sectionTitle: {
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    minWidth: '47%',
  },
  lastServiceCard: {
    minWidth: '100%',
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  reminderCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  reminderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  reminderInfo: {
    flex: 1,
    marginRight: 12,
  },
  reminderType: {
    marginBottom: 4,
  },
  reminderDescription: {
    opacity: 0.8,
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  priorityText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  reminderDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  reminderDate: {
    opacity: 0.7,
  },
  reminderMileage: {
    opacity: 0.7,
  },
  reminderActions: {
    flexDirection: 'row',
    gap: 8,
  },
  reminderButton: {
    flex: 1,
  },
  serviceCard: {
    marginBottom: 12,
  },
  historyCard: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  historyType: {
    flex: 1,
  },
  historyCost: {
    color: '#4CAF50',
  },
  historyDetails: {
    gap: 4,
  },
  historyDate: {
    opacity: 0.8,
  },
  historyMechanic: {
    opacity: 0.7,
  },
  historyNotes: {
    opacity: 0.6,
    fontStyle: 'italic',
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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    marginBottom: 16,
    textAlign: 'center',
  },
  errorButton: {
    paddingHorizontal: 24,
  },
  modalContainer: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  modalTitle: {
    flex: 1,
  },
  modalClose: {
    fontSize: 16,
    fontWeight: '600',
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
});

export default VehicleDetails;