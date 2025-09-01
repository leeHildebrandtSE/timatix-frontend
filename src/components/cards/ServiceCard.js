// Enhanced ServiceCard Component
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import StatusBadge from '../../components/common/StatusBadge';
import Button from '../../components/common/Button';
import { formatDate, formatTime, formatCurrency } from '../../utils/formatters';
import { SERVICE_STATUS } from '../../utils/constants';

const { width } = Dimensions.get('window');

const ServiceCard = ({
  service,
  onPress,
  onAcceptQuote,
  onDeclineQuote,
  onViewQuote,
  onApprove,
  userRole = 'CLIENT',
  showAdminActions = false,
  style = {},
}) => {
  const { theme } = useTheme();

  const getServiceIcon = (serviceType) => {
    const iconMap = {
      'Oil Change': '🛢️',
      'Brake Service': '🚗',
      'Tire Replacement': '🛞',
      'Engine Diagnostic': '🔧',
      'General Maintenance': '⚙️',
      'Battery Replacement': '🔋',
      'Air Filter': '💨',
      'Transmission': '⚙️',
    };
    return iconMap[serviceType] || '🔧';
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'URGENT': return theme.colors.error;
      case 'HIGH': return '#FF8C00';
      case 'NORMAL': return theme.colors.primary;
      case 'LOW': return theme.colors.textSecondary;
      default: return theme.colors.primary;
    }
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.headerLeft}>
        <View style={[styles.serviceIconContainer, { backgroundColor: theme.colors.primary + '20' }]}>
          <Text style={styles.serviceIcon}>
            {getServiceIcon(service.serviceType)}
          </Text>
        </View>
        
        <View style={styles.serviceInfo}>
          <Text style={[styles.serviceType, theme.typography.h6]} numberOfLines={1}>
            {service.serviceType}
          </Text>
          {service.vehicle && (
            <Text style={[styles.vehicleInfo, theme.typography.body2]} numberOfLines={1}>
              {service.vehicle.year} {service.vehicle.make} {service.vehicle.model}
            </Text>
          )}
        </View>
      </View>
      
      <View style={styles.headerRight}>
        <StatusBadge status={service.status} />
        {service.priority && (
          <View style={[styles.priorityBadge, { backgroundColor: getPriorityColor(service.priority) }]}>
            <Text style={styles.priorityText}>{service.priority}</Text>
          </View>
        )}
      </View>
    </View>
  );

  const renderDetails = () => (
    <View style={styles.details}>
      <View style={styles.detailRow}>
        <View style={styles.detailItem}>
          <Text style={styles.detailIcon}>📅</Text>
          <Text style={[styles.detailText, theme.typography.body2]}>
            {formatDate(service.preferredDate)}
          </Text>
        </View>
        
        <View style={styles.detailItem}>
          <Text style={styles.detailIcon}>🕒</Text>
          <Text style={[styles.detailText, theme.typography.body2]}>
            {formatTime(service.preferredTime)}
          </Text>
        </View>
      </View>
      
      {service.location && (
        <View style={styles.detailRow}>
          <View style={styles.detailItem}>
            <Text style={styles.detailIcon}>📍</Text>
            <Text style={[styles.detailText, theme.typography.body2]}>
              {service.location === 'WORKSHOP' ? 'Workshop' : 'Mobile Service'}
            </Text>
          </View>
        </View>
      )}

      {/* Client/Mechanic Info */}
      {userRole === 'MECHANIC' && service.client && (
        <View style={styles.detailRow}>
          <View style={styles.detailItem}>
            <Text style={styles.detailIcon}>👤</Text>
            <Text style={[styles.detailText, theme.typography.body2]}>
              {service.client.name}
            </Text>
          </View>
          
          <View style={styles.detailItem}>
            <Text style={styles.detailIcon}>📞</Text>
            <Text style={[styles.detailText, theme.typography.body2]}>
              {service.client.phone}
            </Text>
          </View>
        </View>
      )}
      
      {userRole === 'CLIENT' && service.assignedMechanic && (
        <View style={styles.detailRow}>
          <View style={styles.detailItem}>
            <Text style={styles.detailIcon}>🔧</Text>
            <Text style={[styles.detailText, theme.typography.body2]}>
              {service.assignedMechanic.name}
            </Text>
          </View>
        </View>
      )}
    </View>
  );

  const renderDescription = () => {
    if (!service.description && !service.notes) return null;
    
    return (
      <View style={[styles.descriptionContainer, { backgroundColor: theme.colors.background }]}>
        {service.description && (
          <Text style={[styles.description, theme.typography.body2]} numberOfLines={2}>
            {service.description}
          </Text>
        )}
        {service.notes && (
          <Text style={[styles.notes, theme.typography.caption]} numberOfLines={1}>
            Note: {service.notes}
          </Text>
        )}
      </View>
    );
  };

  const renderQuoteInfo = () => {
    if (!service.quote) return null;
    
    return (
      <View style={[styles.quoteContainer, { backgroundColor: theme.colors.success + '10' }]}>
        <View style={styles.quoteHeader}>
          <Text style={[styles.quoteLabel, theme.typography.caption]}>
            Quote Amount
          </Text>
          <Text style={[styles.quoteAmount, theme.typography.h6, { color: theme.colors.success }]}>
            {formatCurrency(service.quote.totalAmount)}
          </Text>
        </View>
        
        {service.quote.expiresAt && (
          <Text style={[styles.quoteExpiry, theme.typography.caption]}>
            Expires: {formatDate(service.quote.expiresAt)}
          </Text>
        )}
      </View>
    );
  };

  const renderActions = () => {
    const actions = [];
    
    // Client Actions
    if (userRole === 'CLIENT') {
      if (service.status === SERVICE_STATUS.QUOTE_SENT) {
        actions.push(
          <Button
            key="accept"
            title="Accept Quote"
            onPress={() => onAcceptQuote?.(service)}
            size="small"
            style={[styles.actionButton, styles.acceptButton]}
          />,
          <Button
            key="decline"
            title="Decline"
            onPress={() => onDeclineQuote?.(service)}
            size="small"
            variant="outline"
            style={[styles.actionButton, styles.declineButton]}
          />
        );
      }
      
      if (service.quote && onViewQuote) {
        actions.push(
          <Button
            key="viewQuote"
            title="View Quote"
            onPress={() => onViewQuote?.(service)}
            size="small"
            variant="ghost"
            style={styles.actionButton}
          />
        );
      }
    }
    
    // Admin Actions
    if (showAdminActions && onApprove) {
      actions.push(
        <Button
          key="approve"
          title="Approve"
          onPress={() => onApprove?.(service)}
          size="small"
          variant="success"
          style={styles.actionButton}
        />
      );
    }
    
    // Mechanic Actions
    if (userRole === 'MECHANIC') {
      if (service.status === SERVICE_STATUS.PENDING_QUOTE) {
        actions.push(
          <Button
            key="createQuote"
            title="Create Quote"
            onPress={() => onPress?.(service)}
            size="small"
            style={styles.actionButton}
          />
        );
      }
      
      if (service.status === SERVICE_STATUS.CONFIRMED) {
        actions.push(
          <Button
            key="start"
            title="Start Job"
            onPress={() => onPress?.(service)}
            size="small"
            variant="success"
            style={styles.actionButton}
          />
        );
      }
      
      if (service.status === SERVICE_STATUS.IN_PROGRESS) {
        actions.push(
          <Button
            key="complete"
            title="Complete"
            onPress={() => onPress?.(service)}
            size="small"
            variant="success"
            style={styles.actionButton}
          />
        );
      }
    }
    
    if (actions.length === 0) return null;
    
    return (
      <View style={styles.actionsContainer}>
        {actions}
      </View>
    );
  };

  const renderProgressIndicator = () => {
    const statusOrder = [
      SERVICE_STATUS.PENDING_QUOTE,
      SERVICE_STATUS.QUOTE_SENT,
      SERVICE_STATUS.APPROVED,
      SERVICE_STATUS.CONFIRMED,
      SERVICE_STATUS.IN_PROGRESS,
      SERVICE_STATUS.COMPLETED
    ];
    
    const currentIndex = statusOrder.indexOf(service.status);
    if (currentIndex === -1) return null;
    
    const progress = (currentIndex + 1) / statusOrder.length;
    
    return (
      <View style={styles.progressContainer}>
        <View style={[styles.progressBackground, { backgroundColor: theme.colors.border }]}>
          <View 
            style={[
              styles.progressFill, 
              { 
                backgroundColor: theme.colors.primary,
                width: `${progress * 100}%`
              }
            ]} 
          />
        </View>
        <Text style={[styles.progressText, theme.typography.caption]}>
          Step {currentIndex + 1} of {statusOrder.length}
        </Text>
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
        style,
      ]}
      onPress={() => onPress?.(service)}
      activeOpacity={0.7}
    >
      {/* Header */}
      {renderHeader()}
      
      {/* Details */}
      {renderDetails()}
      
      {/* Description */}
      {renderDescription()}
      
      {/* Quote Info */}
      {renderQuoteInfo()}
      
      {/* Progress Indicator */}
      {renderProgressIndicator()}
      
      {/* Actions */}
      {renderActions()}
      
      {/* Status Accent Line */}
      <View style={[styles.statusAccent, { backgroundColor: getPriorityColor(service.priority) }]} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    position: 'relative',
    overflow: 'hidden',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
  },

  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 12,
  },
  headerRight: {
    alignItems: 'flex-end',
    gap: 8,
  },
  serviceIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  serviceIcon: {
    fontSize: 20,
  },
  serviceInfo: {
    flex: 1,
  },
  serviceType: {
    fontWeight: 'bold',
    marginBottom: 2,
  },
  vehicleInfo: {
    opacity: 0.8,
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  priorityText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '600',
  },

  // Details
  details: {
    gap: 8,
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    gap: 16,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flex: 1,
  },
  detailIcon: {
    fontSize: 14,
    width: 16,
  },
  detailText: {
    flex: 1,
    fontWeight: '500',
  },

  // Description
  descriptionContainer: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  description: {
    lineHeight: 20,
    marginBottom: 4,
  },
  notes: {
    opacity: 0.7,
    fontStyle: 'italic',
  },

  // Quote
  quoteContainer: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  quoteHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  quoteLabel: {
    opacity: 0.8,
    fontWeight: '600',
  },
  quoteAmount: {
    fontWeight: 'bold',
  },
  quoteExpiry: {
    opacity: 0.7,
  },

  // Progress
  progressContainer: {
    marginBottom: 12,
  },
  progressBackground: {
    height: 4,
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: 4,
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
  progressText: {
    opacity: 0.7,
    textAlign: 'center',
  },

  // Actions
  actionsContainer: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  actionButton: {
    flex: 1,
    minWidth: 80,
  },
  acceptButton: {
    // Styles applied inline
  },
  declineButton: {
    // Styles applied inline
  },

  // Status Accent
  statusAccent: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
  },
});

export default ServiceCard;