// src/screens/shared/QuoteDetails.js
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
import Button from '../../components/common/Button';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { formatDate, formatCurrency } from '../../utils/formatters';
import { SERVICE_STATUS } from '../../utils/constants';

const QuoteDetails = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { serviceId, quoteId } = route.params;
  
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
  const [quote, setQuote] = useState(null);

  useEffect(() => {
    loadQuoteDetails();
  }, [serviceId, quoteId]);

  const loadQuoteDetails = async () => {
    try {
      setLoading(true);
      
      // Find service in local state
      const foundService = serviceRequests.find(s => s.id === serviceId);
      if (foundService && foundService.quote) {
        setService(foundService);
        setQuote(foundService.quote);
      } else {
        Alert.alert('Error', 'Quote not found');
        navigation.goBack();
      }
    } catch (error) {
      console.error('Error loading quote details:', error);
      Alert.alert('Error', 'Failed to load quote details');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadQuoteDetails();
    setRefreshing(false);
  };

  const handleAcceptQuote = () => {
    Alert.alert(
      'Accept Quote',
      `Accept this quote of ${formatCurrency(quote.totalAmount)} for ${service.serviceType}?`,
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
              
              navigation.goBack();
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
      `Decline this quote for ${service.serviceType}?`,
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
              
              navigation.goBack();
            } catch (error) {
              Alert.alert('Error', 'Failed to decline quote');
            }
          }
        },
      ]
    );
  };

  if (isLoading && !refreshing) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <LoadingSpinner message="Loading quote details..." />
      </SafeAreaView>
    );
  }

  if (!service || !quote) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <View style={styles.errorContainer}>
          <Text style={[styles.errorText, theme.typography.h6]}>
            Quote not found
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
        {/* Quote Header */}
        <View style={[styles.section, { backgroundColor: theme.colors.surface }]}>
          <View style={styles.header}>
            <View>
              <Text style={[styles.serviceType, theme.typography.h4]}>
                {service.serviceType}
              </Text>
              <Text style={[styles.vehicleInfo, theme.typography.body2]}>
                {service.vehicle ? 
                  `${service.vehicle.year} ${service.vehicle.make} ${service.vehicle.model}` :
                  'Vehicle information not available'
                }
              </Text>
            </View>
            <Text style={[styles.totalAmount, theme.typography.h3]}>
              {formatCurrency(quote.totalAmount)}
            </Text>
          </View>
        </View>

        {/* Labor Breakdown */}
        <View style={[styles.section, { backgroundColor: theme.colors.surface }]}>
          <Text style={[styles.sectionTitle, theme.typography.h5]}>
            Labor
          </Text>
          
          <View style={styles.laborBreakdown}>
            <View style={styles.laborRow}>
              <Text style={[styles.laborLabel, theme.typography.body2]}>Hours:</Text>
              <Text style={[styles.laborValue, theme.typography.body2]}>
                {quote.laborHours || 0}
              </Text>
            </View>
            
            <View style={styles.laborRow}>
              <Text style={[styles.laborLabel, theme.typography.body2]}>Rate per hour:</Text>
              <Text style={[styles.laborValue, theme.typography.body2]}>
                {formatCurrency(quote.laborRate || 0)}
              </Text>
            </View>
            
            <View style={[styles.laborRow, styles.laborTotal]}>
              <Text style={[styles.laborLabel, theme.typography.h6]}>Labor Total:</Text>
              <Text style={[styles.laborValue, theme.typography.h6]}>
                {formatCurrency(quote.laborTotal || 0)}
              </Text>
            </View>
          </View>
        </View>

        {/* Parts Breakdown */}
        {quote.parts && quote.parts.length > 0 && (
          <View style={[styles.section, { backgroundColor: theme.colors.surface }]}>
            <Text style={[styles.sectionTitle, theme.typography.h5]}>
              Parts & Materials
            </Text>
            
            <View style={styles.partsBreakdown}>
              {quote.parts.map((part, index) => (
                <View key={index} style={styles.partRow}>
                  <View style={styles.partInfo}>
                    <Text style={[styles.partDescription, theme.typography.body2]}>
                      {part.description}
                    </Text>
                    <Text style={[styles.partDetails, theme.typography.caption]}>
                      Qty: {part.quantity} × {formatCurrency(part.unitPrice)}
                    </Text>
                  </View>
                  <Text style={[styles.partTotal, theme.typography.body2]}>
                    {formatCurrency(part.total)}
                  </Text>
                </View>
              ))}
              
              <View style={[styles.partRow, styles.partsTotal]}>
                <Text style={[styles.partsTotalLabel, theme.typography.h6]}>
                  Parts Total:
                </Text>
                <Text style={[styles.partsTotalValue, theme.typography.h6]}>
                  {formatCurrency(quote.partsTotal || 0)}
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* Quote Summary */}
        <View style={[styles.section, { backgroundColor: theme.colors.surface }]}>
          <Text style={[styles.sectionTitle, theme.typography.h5]}>
            Quote Summary
          </Text>
          
          <View style={styles.summaryBreakdown}>
            <View style={styles.summaryRow}>
              <Text style={[styles.summaryLabel, theme.typography.body2]}>Labor:</Text>
              <Text style={[styles.summaryValue, theme.typography.body2]}>
                {formatCurrency(quote.laborTotal || 0)}
              </Text>
            </View>
            
            <View style={styles.summaryRow}>
              <Text style={[styles.summaryLabel, theme.typography.body2]}>Parts:</Text>
              <Text style={[styles.summaryValue, theme.typography.body2]}>
                {formatCurrency(quote.partsTotal || 0)}
              </Text>
            </View>
            
            {quote.miscCharges && quote.miscCharges > 0 && (
              <View style={styles.summaryRow}>
                <Text style={[styles.summaryLabel, theme.typography.body2]}>Misc Charges:</Text>
                <Text style={[styles.summaryValue, theme.typography.body2]}>
                  {formatCurrency(quote.miscCharges)}
                </Text>
              </View>
            )}
            
            <View style={styles.summaryRow}>
              <Text style={[styles.summaryLabel, theme.typography.body2]}>Subtotal:</Text>
              <Text style={[styles.summaryValue, theme.typography.body2]}>
                {formatCurrency(quote.subtotal || 0)}
              </Text>
            </View>
            
            {quote.discount && quote.discount > 0 && (
              <View style={styles.summaryRow}>
                <Text style={[styles.summaryLabel, theme.typography.body2]}>Discount:</Text>
                <Text style={[styles.summaryValue, theme.typography.body2, { color: theme.colors.success }]}>
                  -{formatCurrency(quote.discount)}
                </Text>
              </View>
            )}
            
            <View style={styles.summaryRow}>
              <Text style={[styles.summaryLabel, theme.typography.body2]}>VAT (15%):</Text>
              <Text style={[styles.summaryValue, theme.typography.body2]}>
                {formatCurrency(quote.vatAmount || 0)}
              </Text>
            </View>
            
            <View style={[styles.summaryRow, styles.totalRow]}>
              <Text style={[styles.totalLabel, theme.typography.h5]}>Total:</Text>
              <Text style={[styles.totalValue, theme.typography.h5]}>
                {formatCurrency(quote.totalAmount)}
              </Text>
            </View>
          </View>
        </View>

        {/* Quote Notes */}
        {quote.notes && (
          <View style={[styles.section, { backgroundColor: theme.colors.surface }]}>
            <Text style={[styles.sectionTitle, theme.typography.h5]}>
              Notes
            </Text>
            <Text style={[styles.notes, theme.typography.body2]}>
              {quote.notes}
            </Text>
          </View>
        )}

        {/* Quote Information */}
        <View style={[styles.section, { backgroundColor: theme.colors.surface }]}>
          <Text style={[styles.sectionTitle, theme.typography.h5]}>
            Quote Information
          </Text>
          
            <View style={styles.quoteInfo}>
                <View style={styles.infoRow}>
                    <Text style={[styles.infoLabel, theme.typography.body2]}>Quote Date:</Text>
                    <Text style={[styles.infoValue, theme.typography.body2]}>
                    {formatDate(quote.createdAt)}
                    </Text>
                </View>
                
                {quote.expiresAt && (
                    <View style={styles.infoRow}>
                    <Text style={[styles.infoLabel, theme.typography.body2]}>Expires:</Text>
                    <Text style={[styles.infoValue, theme.typography.body2]}>
                        {formatDate(quote.expiresAt)}
                    </Text>
                    </View>
                )}
                
                <View style={styles.infoRow}>
                    <Text style={[styles.infoLabel, theme.typography.body2]}>Status:</Text>
                    <Text style={[styles.infoValue, theme.typography.body2]}>
                    {quote.status || 'Sent'}
                    </Text>
                </View>
            </View>
        </View>

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
  },
  serviceType: {
    marginBottom: 4,
  },
  vehicleInfo: {
    opacity: 0.8,
  },
  totalAmount: {
    color: '#4CAF50',
    fontWeight: 'bold',
  },
  sectionTitle: {
    marginBottom: 12,
  },
  laborBreakdown: {
    gap: 8,
  },
  laborRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  laborLabel: {
    flex: 1,
  },
  laborValue: {
    fontWeight: '500',
  },
  laborTotal: {
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    paddingTop: 8,
    marginTop: 8,
  },
  partsBreakdown: {
    gap: 12,
  },
  partRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  partInfo: {
    flex: 1,
    marginRight: 12,
  },
  partDescription: {
    fontWeight: '500',
    marginBottom: 2,
  },
  partDetails: {
    opacity: 0.7,
  },
  partTotal: {
    fontWeight: '500',
  },
  partsTotal: {
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    paddingTop: 12,
    marginTop: 8,
  },
  partsTotalLabel: {
    flex: 1,
  },
  partsTotalValue: {
    // Styles applied inline
  },
  summaryBreakdown: {
    gap: 8,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  summaryLabel: {
    flex: 1,
  },
  summaryValue: {
    fontWeight: '500',
  },
  totalRow: {
    borderTopWidth: 2,
    borderTopColor: '#007AFF',
    paddingTop: 8,
    marginTop: 8,
  },
  totalLabel: {
    flex: 1,
    color: '#007AFF',
  },
  totalValue: {
    color: '#007AFF',
    fontWeight: 'bold',
  },
  notes: {
    lineHeight: 22,
    fontStyle: 'italic',
    backgroundColor: '#F8F9FA',
    padding: 12,
    borderRadius: 8,
  },
  quoteInfo: {
    gap: 8,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  infoLabel: {
    flex: 1,
    opacity: 0.8,
  },
  infoValue: {
    fontWeight: '500',
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

export default QuoteDetails;