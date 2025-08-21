// src/screens/shared/ServiceDetails.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  RefreshControl,
  Alert,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { useTheme } from '../../context/ThemeContext';
import ServiceCard from '../../components/cards/ServiceCard';
import StatusBadge from '../../components/common/StatusBadge';
import Button from '../../components/common/Button';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { formatDate, formatTime, formatCurrency } from '../../utils/formatters';
import { SERVICE_STATUS } from '../../utils/constants';

const ServiceDetails = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { serviceId } = route.params;
  
  const { user } = useAuth();
  const { 
    serviceRequests, 
    updateServiceRequest,
    addNotification,
    isLoading,
    setLoading 
  } = useApp();
  const { theme } = useTheme();
  
  const [refreshing, setRefreshing] = useState(false);
  const [service, setService] = useState(null);

  useEffect(() => {
    loadServiceDetails();
  }, [serviceId]);

  const loadServiceDetails = async () => {
    try {
      setLoading(true);
      
      // Find service in local state
      const foundService = serviceRequests.find(s => s.id === serviceId);
      if (foundService) {
        setService(foundService);
      } else {
        Alert.alert('Error', 'Service request not found');
        navigation.goBack();
      }
    } catch (error) {
      console.error('Error loading service details:', error);
      Alert.alert('Error', 'Failed to load service details');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadServiceDetails();
    setRefreshing(false);
  };

  const handleAcceptQuote = () => {
    Alert.alert(
      'Accept Quote',
      `Accept the quote of ${formatCurrency(service.quote?.totalAmount)} for ${service.serviceType}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Accept', 
          onPress: async () => {
            try {
              const updatedService = {
                ...service,
                status: SERVICE_STATUS.APPROVED,
                updatedAt: new Date().toISOString(),
              };
              updateServiceRequest(updatedService);
              setService(updatedService);
              
              addNotification({
                title: 'Quote Accepted',
                message: `Quote for ${service.serviceType} has been accepted.`,
                type: 'success',
              });
            } catch (error) {
              Alert.alert('Error', 'Failed to accept quote');
            }
          }
        },
      ]
    );
  };

  const handleDeclineQuote = () => {
    Alert.alert(
      'Decline Quote',
      `Decline the quote for ${service.serviceType}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Decline', 
          style: 'destructive',
          onPress: async () => {
            try {
              const updatedService = {
                ...service,
                status: SERVICE_STATUS.DECLINED,
                updatedAt: new Date().toISOString(),
              };
              updateServiceRequest(updatedService);
              setService(updatedService);
              
              addNotification({
                title: 'Quote Declined',
                message: `Quote for ${service.serviceType} has been declined.`,
                type: 'info',
              });
            } catch (error) {
              Alert.alert('Error', 'Failed to decline quote');
            }
          }
        },
      ]
    );
  };

  const handleViewQuote = () => {
    if (service.quote?.id) {
      navigation.navigate('QuoteDetails', { 
        serviceId: service.id, 
        quoteId: service.quote.id 
      });
    }
  };

  if (isLoading && !refreshing) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <LoadingSpinner message="Loading service details..." />
      </SafeAreaView>
    );
  }

  if (!service) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <View style={styles.errorContainer}>
          <Text style={[styles.errorText, theme.typography.h6]}>
            Service request not found
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
        {/* Service Overview */}
        <View style={[styles.section, { backgroundColor: theme.colors.surface }]}>
          <View style={styles.header}>
            <Text style={[styles.serviceType, theme.typography.h4]}>
              {service.serviceType}
            </Text>
            <StatusBadge status={service.status} size="large" />
          </View>
          
          <View style={styles.vehicleInfo}>
            <Text style={[styles.vehicleLabel, theme.typography.caption]}>Vehicle:</Text>
            <Text style={[styles.vehicleText, theme.typography.h6]}>
              {service.vehicle ? 
                `${service.vehicle.year} ${service.vehicle.make} ${service.vehicle.model}` :
                'Vehicle information not available'
              }
            </Text>
            {service.vehicle?.licensePlate && (
              <Text style={[styles.licensePlate, theme.typography.body2]}>
                {service.vehicle.licensePlate}
              </Text>
            )}
          </View>
        </View>

        {/* Service Details */}
        <View style={[styles.section, { backgroundColor: theme.colors.surface }]}>
          <Text style={[styles.sectionTitle, theme.typography.h5]}>
            Service Details
          </Text>
          
          <View style={styles.detailGrid}>
            <View style={styles.detailRow}>
              <Text style={[styles.detailLabel, theme.typography.body2]}>Preferred Date:</Text>
              <Text style={[styles.detailValue, theme.typography.body2]}>
                {formatDate(service.preferredDate)}
              </Text>
            </View>
            
            <View style={styles.detailRow}>
              <Text style={[styles.detailLabel, theme.typography.body2]}>Preferred Time:</Text>
              <Text style={[styles.detailValue, theme.typography.body2]}>
                {formatTime(service.preferredTime)}
              </Text>
            </View>
            
            <View style={styles.detailRow}>
              <Text style={[styles.detailLabel, theme.typography.body2]}>Urgency:</Text>
              <Text style={[styles.detailValue, theme.typography.body2]}>
                {service.urgency || 'Normal'}
              </Text>
            </View>
            
            <View style={styles.detailRow}>
              <Text style={[styles.detailLabel, theme.typography.body2]}>Location:</Text>
              <Text style={[styles.detailValue, theme.typography.body2]}>
                {service.location === 'WORKSHOP' ? 'Workshop' : 'Mobile Service'}
              </Text>
            </View>
            
            <View style={styles.detailRow}>
              <Text style={[styles.detailLabel, theme.typography.body2]}>Contact Phone:</Text>
              <Text style={[styles.detailValue, theme.typography.body2]}>
                {service.contactPhone || 'Not provided'}
              </Text>
            </View>
            
            <View style={styles.detailRow}>
              <Text style={[styles.detailLabel, theme.typography.body2]}>Request Date:</Text>
              <Text style={[styles.detailValue, theme.typography.body2]}>
                {formatDate(service.createdAt)}
              </Text>
            </View>
          </View>
        </View>

        {/* Description */}
        {service.description && (
          <View style={[styles.section, { backgroundColor: theme.colors.surface }]}>
            <Text style={[styles.sectionTitle, theme.typography.h5]}>
              Description
            </Text>
            <Text style={[styles.description, theme.typography.body2]}>
              {service.description}
            </Text>
          </View>
        )}

        {/* Notes */}
        {service.notes && (
          <View style={[styles.section, { backgroundColor: theme.colors.surface }]}>
            <Text style={[styles.sectionTitle, theme.typography.h5]}>
              Additional Notes
            </Text>
            <Text style={[styles.notes, theme.typography.body2]}>
              {service.notes}
            </Text>
          </View>
        )}

        {/* Quote Information */}
        {service.quote && (
          <View style={[styles.section, { backgroundColor: theme.colors.surface }]}>
            <Text style={[styles.sectionTitle, theme.typography.h5]}>
              Quote Information
            </Text>
            
            <View style={styles.quoteInfo}>
              <View style={styles.quoteHeader}>
                <Text style={[styles.quoteAmount, theme.typography.h4]}>
                  {formatCurrency(service.quote.totalAmount)}
                </Text>
                <Button
                  title="View Full Quote"
                  onPress={handleViewQuote}
                  variant="outline"
                  size="small"
                />
              </View>
              
              {service.quote.notes && (
                <Text style={[styles.quoteNotes, theme.typography.body2]}>
                  {service.quote.notes}
                </Text>
              )}
              
              <View style={styles.quoteDates}>
                <Text style={[styles.quoteDate, theme.typography.caption]}>
                  Quote sent: {formatDate(service.quote.createdAt)}
                </Text>
                {service.quote.expiresAt && (
                  <Text style={[styles.quoteDate, theme.typography.caption]}>
                    Expires: {formatDate(service.quote.expiresAt)}
                  </Text>
                )}
              </View>
            </div>
          </View>
        )}

        {/* Client Information */}
        {service.client && (
          <View style={[styles.section, { backgroundColor: theme.colors.surface }]}>
            <Text style={[styles.sectionTitle, theme.typography.h5]}>
              Client Information
            </Text>
            
            <View style={styles.clientInfo}>
              <Text style={[styles.clientName, theme.typography.h6]}>
                {service.client.name}
              </Text>
              <Text style={[styles.clientContact, theme.typography.body2]}>
                {service.client.email}
              </Text>
              <Text style={[styles.clientContact, theme.typography.body2]}>
                {service.client.phone}
              </Text>
            </View>
          </View>
        )}

        {/* Mechanic Information */}
        {service.assignedMechanic && (
          <View style={[styles.section, { backgroundColor: theme.colors.surface }]}>
            <Text style={[styles.sectionTitle, theme.typography.h5]}>
              Assigned Mechanic
            </Text>
            
            <View style={styles.mechanicInfo}>
              <Text style={[styles.mechanicName, theme.typography.h6]}>
                {service.assignedMechanic.name}
              </Text>
              {service.assignedMechanic.phone && (
                <Text style={[styles.mechanicContact, theme.typography.body2]}>
                  {service.assignedMechanic.phone}
                </Text>
              )}
            </View>
          </View>
        )}

        {/* Actions */}
        {service.status === SERVICE_STATUS.QUOTE_SENT && user?.role === 'CLIENT' && (
          <View style={styles.actions}>
            <Button
              title="Accept Quote"
              onPress={handleAcceptQuote}
              style={styles.acceptButton}
            />
            <Button
              title="Decline Quote"
              onPress={handleDeclineQuote}
              variant="danger"
              style={styles.declineButton}
            />
          </View>
        )}
      </ScrollView>
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
  section: {
    marginHorizontal: 20,
    marginTop: 16,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  serviceType: {
    flex: 1,
    marginRight: 16,
  },
  vehicleInfo: {
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  vehicleLabel: {
    marginBottom: 4,
    opacity: 0.7,
  },
  vehicleText: {
    marginBottom: 4,
  },
  licensePlate: {
    opacity: 0.8,
  },
  sectionTitle: {
    marginBottom: 12,
  },
  detailGrid: {
    gap: 8,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  detailLabel: {
    flex: 1,
    opacity: 0.8,
  },
  detailValue: {
    flex: 1,
    textAlign: 'right',
    fontWeight: '500',
  },
  description: {
    lineHeight: 22,
  },
  notes: {
    lineHeight: 22,
    fontStyle: 'italic',
  },
  quoteInfo: {
    gap: 12,
  },
  quoteHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  quoteAmount: {
    color: '#4CAF50',
    fontWeight: 'bold',
  },
  quoteNotes: {
    backgroundColor: '#F8F9FA',
    padding: 12,
    borderRadius: 8,
    fontStyle: 'italic',
  },
  quoteDates: {
    gap: 4,
  },
  quoteDate: {
    opacity: 0.7,
  },
  clientInfo: {
    gap: 4,
  },
  clientName: {
    marginBottom: 4,
  },
  clientContact: {
    opacity: 0.8,
  },
  mechanicInfo: {
    gap: 4,
  },
  mechanicName: {
    marginBottom: 4,
  },
  mechanicContact: {
    opacity: 0.8,
  },
  actions: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginTop: 24,
    gap: 12,
  },
  acceptButton: {
    flex: 1,
  },
  declineButton: {
    flex: 1,
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
});

export default ServiceDetails;