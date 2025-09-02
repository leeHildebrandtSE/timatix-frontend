// Enhanced VehicleCard with Image Support
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { formatDate, formatMileage } from '../../utils/formatters';

const { width } = Dimensions.get('window');

const VehicleCard = ({ 
  vehicle, 
  onPress, 
  onEdit, 
  onDelete, 
  showActions = true,
  style = {} 
}) => {
  const { theme } = useTheme();

  const getVehicleImage = () => {
    if (vehicle.image) {
      return { uri: vehicle.image };
    }
    // Return a default car image or placeholder
    return require('../../../assets/images/car-placeholder.jpg'); // You'll need to add this
  };

  const renderVehicleImage = () => (
    <View style={styles.imageContainer}>
      <Image 
        source={getVehicleImage()}
        style={styles.vehicleImage}
        resizeMode="cover"
      />
      <View style={[styles.imageOverlay, { backgroundColor: `${theme.colors.primary}15` }]}>
        <View style={[styles.yearBadge, { backgroundColor: theme.colors.primary }]}>
          <Text style={styles.yearText}>{vehicle.year}</Text>
        </View>
      </View>
    </View>
  );

  const renderVehicleInfo = () => (
    <View style={styles.infoContainer}>
      <View style={styles.headerRow}>
        <View style={styles.titleContainer}>
          <Text style={[styles.vehicleName, theme.typography.h6]} numberOfLines={1}>
            {vehicle.make} {vehicle.model}
          </Text>
          <Text style={[styles.vehicleColor, theme.typography.caption]}>
            {vehicle.color}
          </Text>
        </View>
        
        {vehicle.licensePlate && (
          <View style={[styles.licensePlateBadge, { backgroundColor: theme.colors.surface }]}>
            <Text style={[styles.licensePlateText, { color: theme.colors.text }]}>
              {vehicle.licensePlate}
            </Text>
          </View>
        )}
      </View>

      <View style={styles.detailsRow}>
        <View style={styles.detailItem}>
          <Text style={[styles.detailIcon]}>🛣️</Text>
          <Text style={[styles.detailText, theme.typography.body2]}>
            {formatMileage(vehicle.mileage)}
          </Text>
        </View>

        {vehicle.lastServiceDate && (
          <View style={styles.detailItem}>
            <Text style={[styles.detailIcon]}>🔧</Text>
            <Text style={[styles.detailText, theme.typography.body2]}>
              {formatDate(vehicle.lastServiceDate)}
            </Text>
          </View>
        )}
      </View>

      {vehicle.vin && (
        <View style={styles.vinContainer}>
          <Text style={[styles.vinLabel, theme.typography.caption]}>VIN:</Text>
          <Text style={[styles.vinText, theme.typography.caption]} numberOfLines={1}>
            {vehicle.vin}
          </Text>
        </View>
      )}
    </View>
  );

  const renderActionButtons = () => {
    if (!showActions) return null;

    return (
      <View style={styles.actionsContainer}>
        <TouchableOpacity
          style={[styles.actionButton, styles.editButton, { backgroundColor: theme.colors.primary }]}
          onPress={() => onEdit?.(vehicle)}
        >
          <Text style={styles.actionButtonText}>✏️</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.actionButton, styles.deleteButton, { backgroundColor: theme.colors.error }]}
          onPress={() => onDelete?.(vehicle)}
        >
          <Text style={styles.actionButtonText}>🗑️</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderMaintenanceStatus = () => {
    const isOverdue = vehicle.lastServiceDate && 
      new Date() - new Date(vehicle.lastServiceDate) > 90 * 24 * 60 * 60 * 1000; // 90 days

    if (isOverdue) {
      return (
        <View style={[styles.statusBadge, styles.overdueBadge, { backgroundColor: theme.colors.error }]}>
          <Text style={styles.statusText}>⚠️ Service Due</Text>
        </View>
      );
    }

    return (
      <View style={[styles.statusBadge, styles.goodBadge, { backgroundColor: theme.colors.success }]}>
        <Text style={styles.statusText}>✅ Good</Text>
      </View>
    );
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
        style
      ]}
      onPress={() => onPress?.(vehicle)}
      activeOpacity={0.7}
    >
      {/* Vehicle Image */}
      {renderVehicleImage()}
      
      {/* Vehicle Information */}
      {renderVehicleInfo()}
      
      {/* Maintenance Status */}
      {renderMaintenanceStatus()}
      
      {/* Action Buttons */}
      {renderActionButtons()}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    marginBottom: 16,
    borderWidth: 1,
    overflow: 'hidden',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
  },

  // Image Section
  imageContainer: {
    position: 'relative',
    height: 140,
  },
  vehicleImage: {
    width: '100%',
    height: '100%',
  },
  imageOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'space-between',
    padding: 12,
  },
  yearBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  yearText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },

  // Info Section
  infoContainer: {
    padding: 16,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  titleContainer: {
    flex: 1,
    marginRight: 12,
  },
  vehicleName: {
    marginBottom: 2,
    fontWeight: 'bold',
  },
  vehicleColor: {
    opacity: 0.7,
    textTransform: 'capitalize',
  },
  licensePlateBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  licensePlateText: {
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 1,
  },

  // Details Row
  detailsRow: {
    flexDirection: 'row',
    gap: 20,
    marginBottom: 12,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  detailIcon: {
    fontSize: 16,
  },
  detailText: {
    fontWeight: '500',
  },

  // VIN Section
  vinContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  vinLabel: {
    fontWeight: '600',
    opacity: 0.7,
  },
  vinText: {
    flex: 1,
    fontFamily: 'monospace',
    opacity: 0.6,
  },

  // Status Badge
  statusBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '600',
  },
  overdueBadge: {
    // Styles applied inline
  },
  goodBadge: {
    // Styles applied inline
  },

  // Actions
  actionsContainer: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  },
  actionButtonText: {
    fontSize: 16,
  },
  editButton: {
    // Styles applied inline
  },
  deleteButton: {
    // Styles applied inline
  },
});

export default VehicleCard;