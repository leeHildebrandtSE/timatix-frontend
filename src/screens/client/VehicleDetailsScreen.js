import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';

const VehicleDetailsScreen = ({ route, navigation }) => {
  const { vehicleId } = route.params;
  const { theme } = useTheme();
  const { user } = useAuth();
  const [vehicle, setVehicle] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVehicleDetails();
  }, [vehicleId]);

  const fetchVehicleDetails = async () => {
    try {
      // Mock data - replace with actual API call
      const mockVehicle = {
        id: vehicleId,
        make: 'Toyota',
        model: 'Camry',
        year: '2020',
        vin: '1HGBH41JXMN109186',
        mileage: '45,000',
        plateNumber: 'ABC-123',
        color: 'Blue',
        lastService: '2024-07-15',
        nextServiceDue: '2024-10-15',
        serviceHistory: [
          { id: 1, date: '2024-07-15', service: 'Oil Change', cost: '$75' },
          { id: 2, date: '2024-04-10', service: 'Brake Inspection', cost: '$120' },
        ]
      };
      setVehicle(mockVehicle);
    } catch (error) {
      Alert.alert('Error', 'Failed to load vehicle details');
    } finally {
      setLoading(false);
    }
  };

  const handleEditVehicle = () => {
    navigation.navigate('EditVehicle', { vehicle });
  };

  const handleRequestService = () => {
    navigation.navigate('RequestService', { vehicleId });
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.center]}>
        <Text>Loading vehicle details...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Card style={styles.card}>
        <Text style={[styles.title, { color: theme.colors.text }]}>
          {vehicle.year} {vehicle.make} {vehicle.model}
        </Text>
        
        <View style={styles.detailRow}>
          <Text style={[styles.label, { color: theme.colors.textSecondary }]}>VIN:</Text>
          <Text style={[styles.value, { color: theme.colors.text }]}>{vehicle.vin}</Text>
        </View>
        
        <View style={styles.detailRow}>
          <Text style={[styles.label, { color: theme.colors.textSecondary }]}>Mileage:</Text>
          <Text style={[styles.value, { color: theme.colors.text }]}>{vehicle.mileage}</Text>
        </View>
        
        <View style={styles.detailRow}>
          <Text style={[styles.label, { color: theme.colors.textSecondary }]}>Plate Number:</Text>
          <Text style={[styles.value, { color: theme.colors.text }]}>{vehicle.plateNumber}</Text>
        </View>
        
        <View style={styles.detailRow}>
          <Text style={[styles.label, { color: theme.colors.textSecondary }]}>Color:</Text>
          <Text style={[styles.value, { color: theme.colors.text }]}>{vehicle.color}</Text>
        </View>
      </Card>

      <Card style={styles.card}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Service Information</Text>
        
        <View style={styles.detailRow}>
          <Text style={[styles.label, { color: theme.colors.textSecondary }]}>Last Service:</Text>
          <Text style={[styles.value, { color: theme.colors.text }]}>{vehicle.lastService}</Text>
        </View>
        
        <View style={styles.detailRow}>
          <Text style={[styles.label, { color: theme.colors.textSecondary }]}>Next Service Due:</Text>
          <Text style={[styles.value, { color: theme.colors.warning }]}>{vehicle.nextServiceDue}</Text>
        </View>
      </Card>

      <Card style={styles.card}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Service History</Text>
        {vehicle.serviceHistory.map((service) => (
          <View key={service.id} style={styles.historyItem}>
            <View style={styles.historyHeader}>
              <Text style={[styles.historyService, { color: theme.colors.text }]}>{service.service}</Text>
              <Text style={[styles.historyCost, { color: theme.colors.primary }]}>{service.cost}</Text>
            </View>
            <Text style={[styles.historyDate, { color: theme.colors.textSecondary }]}>{service.date}</Text>
          </View>
        ))}
      </Card>

      <View style={styles.actions}>
        <Button
          title="Edit Vehicle"
          onPress={handleEditVehicle}
          variant="outline"
          style={styles.actionButton}
        />
        <Button
          title="Request Service"
          onPress={handleRequestService}
          style={styles.actionButton}
        />
      </View>
    </ScrollView>
  );
};