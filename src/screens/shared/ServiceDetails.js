// =============================================================================
// src/screens/shared/ServiceDetails.js - Service Details Screen
// =============================================================================

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';

const ServiceDetails = ({ route, navigation }) => {
  const { serviceId } = route.params;
  const { theme } = useTheme();
  const globalStyles = useGlobalStyles();
  const { user } = useAuth();
  const { serviceRequests, updateServiceRequest, addNotification } = useApp();

  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadServiceDetails();
  }, [serviceId]);

  const loadServiceDetails = async () => {
    // Find service in state or fetch from API
    const foundService = serviceRequests?.find(s => s.id === serviceId);
    if (foundService) {
      setService(foundService);
    }
  };

  const handleStatusUpdate = async (newStatus) => {
    setLoading(true);
    try {
      await updateServiceRequest(serviceId, { status: newStatus });
      setService({ ...service, status: newStatus });
      addNotification(`Service status updated to ${newStatus.replace('-', ' ')}`);
    } catch (error) {
      Alert.alert('Error', 'Failed to update service status');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelService = () => {
    Alert.alert(
      'Cancel Service',
      'Are you sure you want to cancel this service request?',
      [
        { text: 'No', style: 'cancel' },
        { text: 'Yes, Cancel', style: 'destructive', onPress: () => handleStatusUpdate('cancelled') }
      ]
    );
  };

  if (!service) {
    return (
      <View style={[globalStyles.container, globalStyles.centerContent]}>
        <Text>Loading service details...</Text>
      </View>
    );
  }

  const statusColor = getStatusColor(service.status, theme.colors);
  const priorityColor = getPriorityColor(service.priority, theme.colors);

  return (
    <ScrollView style={globalStyles.detailsContainer}>
      {/* Header */}
      <View style={[
        globalStyles.detailsHeader,
        { backgroundColor: theme.colors.surface }
      ]}>
        <Text style={[globalStyles.detailsTitle, { color: theme.colors.text }]}>
          {service.serviceType}
        </Text>
        <Text style={[globalStyles.detailsSubtitle, { color: theme.colors.textSecondary }]}>
          {service.vehicleInfo} • Scheduled: {service.scheduledDate}
        </Text>
        
        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 12, gap: 12 }}>
          <View style={[
            globalStyles.statusBadge,
            { backgroundColor: statusColor }
          ]}>
            <Text style={globalStyles.statusBadgeText}>
              {service.status.replace('-', ' ')}
            </Text>
          </View>
          
          <View style={[
            globalStyles.statusBadge,
            { backgroundColor: priorityColor }
          ]}>
            <Text style={globalStyles.statusBadgeText}>
              {service.priority} priority
            </Text>
          </View>
        </View>
      </View>

      {/* Service Information */}
      <View style={globalStyles.detailsSection}>
        <Text style={[globalStyles.detailsSectionTitle, { color: theme.colors.text }]}>
          Service Information
        </Text>
        
        <View style={[
          globalStyles.detailsInfoRow,
          { borderBottomColor: theme.colors.borderLight }
        ]}>
          <Text style={[globalStyles.detailsInfoLabel, { color: theme.colors.textSecondary }]}>
            Service Type
          </Text>
          <Text style={[globalStyles.detailsInfoValue, { color: theme.colors.text }]}>
            {service.serviceType}
          </Text>
        </View>
        
        <View style={[
          globalStyles.detailsInfoRow,
          { borderBottomColor: theme.colors.borderLight }
        ]}>
          <Text style={[globalStyles.detailsInfoLabel, { color: theme.colors.textSecondary }]}>
            Vehicle
          </Text>
          <Text style={[globalStyles.detailsInfoValue, { color: theme.colors.text }]}>
            {service.vehicleInfo}
          </Text>
        </View>
        
        <View style={[
          globalStyles.detailsInfoRow,
          { borderBottomColor: theme.colors.borderLight }
        ]}>
          <Text style={[globalStyles.detailsInfoLabel, { color: theme.colors.textSecondary }]}>
            Priority
          </Text>
          <Text style={[globalStyles.detailsInfoValue, { color: priorityColor }]}>
            {service.priority}
          </Text>
        </View>
        
        <View style={[
          globalStyles.detailsInfoRow,
          { borderBottomColor: theme.colors.borderLight }
        ]}>
          <Text style={[globalStyles.detailsInfoLabel, { color: theme.colors.textSecondary }]}>
            Scheduled Date
          </Text>
          <Text style={[globalStyles.detailsInfoValue, { color: theme.colors.text }]}>
            {service.scheduledDate}
          </Text>
        </View>
        
        <View style={[
          globalStyles.detailsInfoRow,
          { borderBottomColor: theme.colors.borderLight }
        ]}>
          <Text style={[globalStyles.detailsInfoLabel, { color: theme.colors.textSecondary }]}>
            Status
          </Text>
          <Text style={[globalStyles.detailsInfoValue, { color: statusColor }]}>
            {service.status.replace('-', ' ')}
          </Text>
        </View>
        
        <View style={[globalStyles.detailsInfoRow, globalStyles.detailsInfoRowLast]}>
          <Text style={[globalStyles.detailsInfoLabel, { color: theme.colors.textSecondary }]}>
            Request Date
          </Text>
          <Text style={[globalStyles.detailsInfoValue, { color: theme.colors.text }]}>
            {service.createdAt ? new Date(service.createdAt).toLocaleDateString() : 'N/A'}
          </Text>
        </View>
      </View>

      {/* Description */}
      {service.description && (
        <View style={globalStyles.detailsSection}>
          <Text style={[globalStyles.detailsSectionTitle, { color: theme.colors.text }]}>
            Problem Description
          </Text>
          <Text style={[globalStyles.jobDetailsDescription, { color: theme.colors.text }]}>
            {service.description}
          </Text>
        </View>
      )}

      {/* Special Instructions */}
      {service.specialInstructions && (
        <View style={globalStyles.detailsSection}>
          <Text style={[globalStyles.detailsSectionTitle, { color: theme.colors.text }]}>
            Special Instructions
          </Text>
          <Text style={[globalStyles.jobDetailsNotes, { color: theme.colors.textSecondary }]}>
            {service.specialInstructions}
          </Text>
        </View>
      )}

      {/* Progress */}
      {service.progress !== undefined && (
        <View style={globalStyles.detailsSection}>
          <Text style={[globalStyles.detailsSectionTitle, { color: theme.colors.text }]}>
            Progress
          </Text>
          <View style={[
            globalStyles.serviceProgressBackground,
            { backgroundColor: theme.colors.border, marginBottom: 8 }
          ]}>
            <View style={[
              globalStyles.serviceProgressFill,
              { 
                width: `${service.progress}%`,
                backgroundColor: statusColor
              }
            ]} />
          </View>
          <Text style={[globalStyles.serviceProgressText, { color: theme.colors.textSecondary }]}>
            {service.progress}% Complete
          </Text>
        </View>
      )}

      {/* Quote Information */}
      {service.quote && (
        <View style={[
          globalStyles.detailsSection,
          { backgroundColor: theme.colors.success + '10', borderColor: theme.colors.success }
        ]}>
          <Text style={[globalStyles.detailsSectionTitle, { color: theme.colors.success }]}>
            💰 Quote Information
          </Text>
          
          <View style={[
            globalStyles.detailsInfoRow,
            { borderBottomColor: theme.colors.borderLight }
          ]}>
            <Text style={[globalStyles.detailsInfoLabel, { color: theme.colors.textSecondary }]}>
              Quote Amount
            </Text>
            <Text style={[
              globalStyles.detailsInfoValue,
              { color: theme.colors.success, fontWeight: 'bold', fontSize: 18 }
            ]}>
              ${service.quote.amount}
            </Text>
          </View>
          
          <View style={[globalStyles.detailsInfoRow, globalStyles.detailsInfoRowLast]}>
            <Text style={[globalStyles.detailsInfoLabel, { color: theme.colors.textSecondary }]}>
              Quote Status
            </Text>
            <Text style={[globalStyles.detailsInfoValue, { color: theme.colors.text }]}>
              {service.quote.status}
            </Text>
          </View>
        </View>
      )}

      {/* Action Buttons */}
      <View style={globalStyles.detailsActionsContainer}>
        {service.status === 'pending' && user?.role === 'client' && (
          <>
            <TouchableOpacity
              style={[globalStyles.buttonBase, globalStyles.detailsActionButton]}
              onPress={() => navigation.navigate('EditServiceRequest', { serviceId: service.id })}
            >
              <Text style={globalStyles.buttonText}>Edit Request</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                globalStyles.buttonBase,
                globalStyles.buttonDanger,
                globalStyles.detailsActionButton
              ]}
              onPress={handleCancelService}
            >
              <Text style={globalStyles.buttonText}>Cancel Request</Text>
            </TouchableOpacity>
          </>
        )}
        
        {service.status === 'assigned' && user?.role === 'mechanic' && (
          <TouchableOpacity
            style={[globalStyles.buttonBase, globalStyles.detailsActionButton]}
            onPress={() => handleStatusUpdate('in-progress')}
          >
            <Text style={globalStyles.buttonText}>Start Job</Text>
          </TouchableOpacity>
        )}
        
        {service.status === 'in-progress' && user?.role === 'mechanic' && (
          <>
            <TouchableOpacity
              style={[globalStyles.buttonBase, globalStyles.detailsActionButton]}
              onPress={() => navigation.navigate('UpdateProgress', { serviceId: service.id })}
            >
              <Text style={globalStyles.buttonText}>Update Progress</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                globalStyles.buttonBase,
                globalStyles.buttonSuccess,
                globalStyles.detailsActionButtonLast
              ]}
              onPress={() => handleStatusUpdate('completed')}
            >
              <Text style={globalStyles.buttonText}>Mark Complete</Text>
            </TouchableOpacity>
          </>
        )}
        
        {service.quote && service.quote.status === 'pending' && user?.role === 'client' && (
          <>
            <TouchableOpacity
              style={[globalStyles.buttonBase, globalStyles.detailsActionButton]}
              onPress={() => handleStatusUpdate('quote-accepted')}
            >
              <Text style={globalStyles.buttonText}>Accept Quote</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                globalStyles.buttonBase,
                globalStyles.buttonSecondary,
                globalStyles.detailsActionButtonLast
              ]}
              onPress={() => handleStatusUpdate('quote-rejected')}
            >
              <Text style={[globalStyles.buttonText, globalStyles.buttonTextSecondary]}>
                Decline Quote
              </Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </ScrollView>
  );
};

export default {
  CreateServiceRequest,
  ServiceDetails,
};