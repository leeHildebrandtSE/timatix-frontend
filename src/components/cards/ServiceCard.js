import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import StatusBadge from '../common/StatusBadge';

const ServiceCard = ({ service, onPress, onViewQuote, onAcceptQuote, onDeclineQuote, userRole = 'CLIENT' }) => {
  const { theme } = useTheme();

  const handlePress = () => {
    if (onPress) {
      onPress(service);
    }
  };

  const handleViewQuote = (e) => {
    e.stopPropagation();
    if (onViewQuote) {
      onViewQuote(service);
    }
  };

  const handleAcceptQuote = (e) => {
    e.stopPropagation();
    if (onAcceptQuote) {
      onAcceptQuote(service);
    }
  };

  const handleDeclineQuote = (e) => {
    e.stopPropagation();
    if (onDeclineQuote) {
      onDeclineQuote(service);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Not set';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatTime = (timeString) => {
    if (!timeString) return 'Not set';
    return new Date(`1970-01-01T${timeString}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  const showQuoteActions = service.status === 'QUOTE_SENT' && userRole === 'CLIENT';

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
        <View style={styles.serviceInfo}>
          <Text style={[styles.serviceType, theme.typography.h6]}>
            {service.serviceType || service.selectedService}
          </Text>
          <Text style={[styles.vehicleInfo, theme.typography.body2]}>
            {service.vehicle ? 
              `${service.vehicle.year} ${service.vehicle.make} ${service.vehicle.model}` :
              'Vehicle information not available'
            }
          </Text>
        </View>
        
        <StatusBadge status={service.status} size="small" />
      </View>

      <View style={styles.details}>
        <View style={styles.detailRow}>
          <Text style={[styles.detailLabel, theme.typography.caption]}>Date:</Text>
          <Text style={[styles.detailValue, theme.typography.body2]}>
            {formatDate(service.preferredDate)}
          </Text>
        </View>
        
        <View style={styles.detailRow}>
          <Text style={[styles.detailLabel, theme.typography.caption]}>Time:</Text>
          <Text style={[styles.detailValue, theme.typography.body2]}>
            {formatTime(service.preferredTime)}
          </Text>
        </View>

        {service.quote && (
          <View style={styles.detailRow}>
            <Text style={[styles.detailLabel, theme.typography.caption]}>Quote:</Text>
            <Text style={[styles.detailValue, theme.typography.body2, styles.quoteAmount]}>
              R {service.quote.totalAmount?.toFixed(2) || '0.00'}
            </Text>
          </View>
        )}

        {service.assignedMechanic && (
          <View style={styles.detailRow}>
            <Text style={[styles.detailLabel, theme.typography.caption]}>Mechanic:</Text>
            <Text style={[styles.detailValue, theme.typography.body2]}>
              {service.assignedMechanic.name}
            </Text>
          </View>
        )}
      </View>

      {service.notes && (
        <View style={styles.notesSection}>
          <Text style={[styles.notesLabel, theme.typography.caption]}>Notes:</Text>
          <Text style={[styles.notesText, theme.typography.body2]} numberOfLines={2}>
            {service.notes}
          </Text>
        </View>
      )}

      {showQuoteActions && (
        <View style={styles.quoteActions}>
          <TouchableOpacity
            style={[styles.quoteButton, styles.viewButton, { borderColor: theme.colors.primary }]}
            onPress={handleViewQuote}
          >
            <Text style={[styles.quoteButtonText, { color: theme.colors.primary }]}>
              View Quote
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.quoteButton, styles.acceptButton, { backgroundColor: theme.colors.success }]}
            onPress={handleAcceptQuote}
          >
            <Text style={[styles.quoteButtonText, { color: theme.colors.white }]}>
              Accept
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.quoteButton, styles.declineButton, { backgroundColor: theme.colors.error }]}
            onPress={handleDeclineQuote}
          >
            <Text style={[styles.quoteButtonText, { color: theme.colors.white }]}>
              Decline
            </Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.footer}>
        <Text style={[styles.requestDate, theme.typography.caption]}>
          Requested: {formatDate(service.createdAt)}
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
  serviceInfo: {
    flex: 1,
    marginRight: 12,
  },
  serviceType: {
    marginBottom: 4,
  },
  vehicleInfo: {
    opacity: 0.7,
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
  quoteAmount: {
    fontWeight: '600',
    color: '#4CAF50',
  },
  notesSection: {
    marginBottom: 12,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  notesLabel: {
    marginBottom: 4,
  },
  notesText: {
    fontStyle: 'italic',
  },
  quoteActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    gap: 8,
  },
  quoteButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  viewButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
  },
  acceptButton: {
    // backgroundColor set inline
  },
  declineButton: {
    // backgroundColor set inline
  },
  quoteButtonText: {
    fontSize: 12,
    fontWeight: '600',
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    paddingTop: 8,
  },
  requestDate: {
    textAlign: 'center',
  },
});

export default ServiceCard;