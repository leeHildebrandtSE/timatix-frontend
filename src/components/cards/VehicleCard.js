import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '../../context/ThemeContext';

const VehicleCard = ({ vehicle, onPress, onEdit, onDelete, showActions = true }) => {
  const { theme } = useTheme();

  const handlePress = () => {
    if (onPress) {
      onPress(vehicle);
    }
  };

  const handleEdit = (e) => {
    e.stopPropagation();
    if (onEdit) {
      onEdit(vehicle);
    }
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    if (onDelete) {
      onDelete(vehicle);
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.card,
        {
          backgroundColor: theme.colors.surface,
          borderColor: theme.colors.border,
          shadowColor: theme.colors.shadow,
        },
      ]}
      onPress={handlePress}
      activeOpacity={0.7}
    >
      <View style={styles.header}>
        <View style={styles.vehicleInfo}>
          <Text style={[styles.vehicleName, theme.typography.h6]}>
            {vehicle.year} {vehicle.make} {vehicle.model}
          </Text>
          {vehicle.licensePlate && (
            <Text style={[styles.licensePlate, theme.typography.caption]}>
              {vehicle.licensePlate}
            </Text>
          )}
        </View>
        
        {showActions && (
          <View style={styles.actions}>
            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: theme.colors.primary + '20' }]}
              onPress={handleEdit}
            >
              <Text style={[styles.actionText, { color: theme.colors.primary }]}>
                Edit
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: theme.colors.error + '20' }]}
              onPress={handleDelete}
            >
              <Text style={[styles.actionText, { color: theme.colors.error }]}>
                Delete
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      <View style={styles.details}>
        {vehicle.vin && (
          <View style={styles.detailRow}>
            <Text style={[styles.detailLabel, theme.typography.caption]}>VIN:</Text>
            <Text style={[styles.detailValue, theme.typography.body2]}>{vehicle.vin}</Text>
          </View>
        )}
        
        <View style={styles.detailRow}>
          <Text style={[styles.detailLabel, theme.typography.caption]}>Color:</Text>
          <Text style={[styles.detailValue, theme.typography.body2]}>
            {vehicle.color || 'Not specified'}
          </Text>
        </View>

        {vehicle.mileage && (
          <View style={styles.detailRow}>
            <Text style={[styles.detailLabel, theme.typography.caption]}>Mileage:</Text>
            <Text style={[styles.detailValue, theme.typography.body2]}>
              {vehicle.mileage.toLocaleString()} km
            </Text>
          </View>
        )}
      </View>

      <View style={styles.footer}>
        <Text style={[styles.lastService, theme.typography.caption]}>
          Last service: {vehicle.lastServiceDate ? 
            new Date(vehicle.lastServiceDate).toLocaleDateString() : 
            'No service history'
          }
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    padding: 16,
    marginVertical: 6,
    marginHorizontal: 2,
    borderWidth: 1,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  vehicleInfo: {
    flex: 1,
  },
  vehicleName: {
    marginBottom: 4,
  },
  licensePlate: {
    fontWeight: '600',
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  actionText: {
    fontSize: 12,
    fontWeight: '600',
  },
  details: {
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  detailLabel: {
    flex: 1,
  },
  detailValue: {
    flex: 2,
    textAlign: 'right',
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    paddingTop: 8,
  },
  lastService: {
    textAlign: 'center',
  },
});

export default VehicleCard;