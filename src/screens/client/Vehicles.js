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
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { useTheme } from '../../context/ThemeContext';
import VehicleCard from '../../components/cards/VehicleCard';
import VehicleForm from '../../components/forms/VehicleForm';
import Button from '../../components/common/Button';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { vehiclesService } from '../../services/vehicles';

const Vehicles = ({ navigation }) => {
  const { user } = useAuth();
  const { 
    vehicles, 
    setVehicles,
    addVehicle,
    updateVehicle,
    deleteVehicle,
    isLoading,
    setLoading,
    addNotification 
  } = useApp();
  const { theme } = useTheme();
  
  const [refreshing, setRefreshing] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
    loadVehicles();
  }, []);

  const loadVehicles = async () => {
    try {
      setLoading(true);
      const userVehicles = await vehiclesService.getUserVehicles();
      setVehicles(userVehicles);
    } catch (error) {
      console.error('Error loading vehicles:', error);
      Alert.alert('Error', 'Failed to load vehicles');
      
      // Fallback to mock data for demo
      const mockVehicles = [
        {
          id: '1',
          make: 'Toyota',
          model: 'Corolla',
          year: 2020,
          color: 'White',
          licensePlate: 'CA 123 GP',
          vin: '1HGBH41JXMN109186',
          mileage: 45000,
          lastServiceDate: '2024-01-15',
          userId: user.id,
        },
        {
          id: '2',
          make: 'BMW',
          model: 'X3',
          year: 2019,
          color: 'Black',
          licensePlate: 'CA 456 GP',
          vin: '5UXWX9C54F0C26583',
          mileage: 32000,
          lastServiceDate: '2023-12-10',
          userId: user.id,
        },
      ];
      setVehicles(mockVehicles);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadVehicles();
    setRefreshing(false);
  };

  const handleAddVehicle = () => {
    setSelectedVehicle(null);
    setShowAddModal(true);
  };

  const handleEditVehicle = (vehicle) => {
    setSelectedVehicle(vehicle);
    setShowEditModal(true);
  };

  const handleDeleteVehicle = (vehicle) => {
    Alert.alert(
      'Delete Vehicle',
      `Are you sure you want to delete ${vehicle.year} ${vehicle.make} ${vehicle.model}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: async () => {
            try {
              await vehiclesService.deleteVehicle(vehicle.id);
              deleteVehicle(vehicle.id);
              
              addNotification({
                title: 'Vehicle Deleted',
                message: `${vehicle.year} ${vehicle.make} ${vehicle.model} has been deleted.`,
                type: 'success',
              });
            } catch (error) {
              Alert.alert('Error', 'Failed to delete vehicle');
            }
          }
        },
      ]
    );
  };

  const handleVehiclePress = (vehicle) => {
    navigation.navigate('VehicleDetails', { vehicleId: vehicle.id });
  };

  const handleSubmitVehicle = async (vehicleData) => {
    try {
      setFormLoading(true);
      
      if (selectedVehicle) {
        // Update existing vehicle
        const updatedVehicle = await vehiclesService.updateVehicle(selectedVehicle.id, vehicleData);
        updateVehicle(updatedVehicle);
        
        addNotification({
          title: 'Vehicle Updated',
          message: `${vehicleData.year} ${vehicleData.make} ${vehicleData.model} has been updated.`,
          type: 'success',
        });
        
        setShowEditModal(false);
      } else {
        // Add new vehicle
        const newVehicle = await vehiclesService.createVehicle(vehicleData);
        addVehicle(newVehicle);
        
        addNotification({
          title: 'Vehicle Added',
          message: `${vehicleData.year} ${vehicleData.make} ${vehicleData.model} has been added.`,
          type: 'success',
        });
        
        setShowAddModal(false);
      }
    } catch (error) {
      console.error('Error saving vehicle:', error);
      Alert.alert('Error', 'Failed to save vehicle');
    } finally {
      setFormLoading(false);
    }
  };

  const renderVehicleModal = (isVisible, onClose, isEditing = false) => (
    <Modal
      visible={isVisible}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <SafeAreaView style={[styles.modalContainer, { backgroundColor: theme.colors.background }]}>
        <View style={styles.modalHeader}>
          <Text style={[styles.modalTitle, theme.typography.h4]}>
            {isEditing ? 'Edit Vehicle' : 'Add Vehicle'}
          </Text>
          <TouchableOpacity onPress={onClose}>
            <Text style={[styles.modalClose, { color: theme.colors.primary }]}>
              Cancel
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.modalContent}>
          <VehicleForm
            onSubmit={handleSubmitVehicle}
            loading={formLoading}
            initialData={selectedVehicle}
            isEditing={isEditing}
          />
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );

  if (isLoading && !refreshing) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <LoadingSpinner message="Loading vehicles..." />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.title, theme.typography.h3]}>
          My Vehicles
        </Text>
        <Button
          title="+ Add"
          onPress={handleAddVehicle}
          style={styles.addButton}
        />
      </View>

      {/* Vehicle Count */}
      <View style={styles.vehicleCount}>
        <Text style={[styles.vehicleCountText, theme.typography.body2]}>
          {vehicles.length} vehicle{vehicles.length !== 1 ? 's' : ''}
        </Text>
      </View>

      {/* Vehicle List */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        {vehicles.length > 0 ? (
          vehicles.map((vehicle) => (
            <VehicleCard
              key={vehicle.id}
              vehicle={vehicle}
              onPress={handleVehiclePress}
              onEdit={handleEditVehicle}
              onDelete={handleDeleteVehicle}
              showActions={true}
            />
          ))
        ) : (
          <View style={[styles.emptyState, { backgroundColor: theme.colors.surface }]}>
            <Text style={[styles.emptyStateTitle, theme.typography.h6]}>
              No vehicles yet
            </Text>
            <Text style={[styles.emptyStateText, theme.typography.body2]}>
              Add your first vehicle to get started with service bookings
            </Text>
            <Button
              title="Add Your First Vehicle"
              onPress={handleAddVehicle}
              style={styles.emptyStateButton}
            />
          </View>
        )}
      </ScrollView>

      {/* Modals */}
      {renderVehicleModal(showAddModal, () => setShowAddModal(false), false)}
      {renderVehicleModal(showEditModal, () => setShowEditModal(false), true)}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 16,
  },
  title: {
    flex: 1,
  },
  addButton: {
    paddingHorizontal: 16,
  },
  vehicleCount: {
    paddingHorizontal: 20,
    paddingBottom: 8,
  },
  vehicleCountText: {
    opacity: 0.7,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  emptyState: {
    padding: 48,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 60,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderStyle: 'dashed',
  },
  emptyStateTitle: {
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyStateText: {
    marginBottom: 24,
    textAlign: 'center',
    opacity: 0.6,
  },
  emptyStateButton: {
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

export default Vehicles;