// =============================================================================
// src/screens/shared/QuoteDetails.js - Quote Details Screen
// =============================================================================

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';

const QuoteDetails = ({ route, navigation }) => {
  const { quoteId } = route.params;
  const { user } = useAuth();
  const { quotes, updateQuote, addNotification } = useApp();
  const { theme } = useTheme();
  const globalStyles = useGlobalStyles();

  const [quote, setQuote] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadQuoteDetails();
  }, [quoteId]);

  const loadQuoteDetails = async () => {
    const foundQuote = quotes?.find(q => q.id === quoteId);
    if (foundQuote) {
      setQuote({
        ...foundQuote,
        // Mock quote items if not present
        items: foundQuote.items || [
          { id: 1, description: 'Oil Change Service', quantity: 1, price: 45.00, total: 45.00 },
          { id: 2, description: 'Oil Filter', quantity: 1, price: 12.99, total: 12.99 },
          { id: 3, description: 'Labor (1 hour)', quantity: 1, price: 85.00, total: 85.00 },
        ]
      });
    }
  };

  const handleStatusUpdate = async (newStatus) => {
    setLoading(true);
    try {
      await updateQuote(quoteId, { 
        status: newStatus,
        updatedAt: new Date().toISOString(),
      });
      setQuote({ ...quote, status: newStatus });
      addNotification(`Quote ${newStatus.replace('-', ' ')}`);
    } catch (error) {
      Alert.alert('Error', 'Failed to update quote status');
    } finally {
      setLoading(false);
    }
  };

  const getQuoteStatusColor = (status) => {
    const statusColors = {
      pending: theme.colors.warning,
      approved: theme.colors.success,
      accepted: theme.colors.success,
      rejected: theme.colors.error,
      expired: theme.colors.textSecondary,
    };
    return statusColors[status] || theme.colors.textSecondary;
  };

  const calculateSubtotal = () => {
    return quote?.items?.reduce((sum, item) => sum + (item.total || item.quantity * item.price), 0) || 0;
  };

  const calculateTax = () => {
    return calculateSubtotal() * 0.08; // 8% tax
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateTax();
  };

  if (!quote) {
    return (
      <View style={[globalStyles.container, globalStyles.centerContent]}>
        <Text>Loading quote details...</Text>
      </View>
    );
  }

  const statusColor = getQuoteStatusColor(quote.status);

  return (
    <ScrollView style={globalStyles.detailsContainer}>
      {/* Header */}
      <View style={[
        globalStyles.detailsHeader,
        { backgroundColor: theme.colors.surface }
      ]}>
        <Text style={[globalStyles.detailsTitle, { color: theme.colors.text }]}>
          Quote #{quote.quoteNumber || quote.id.slice(-6)}
        </Text>
        <Text style={[globalStyles.detailsSubtitle, { color: theme.colors.textSecondary }]}>
          {quote.serviceType} • {quote.vehicleInfo}
        </Text>
        
        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 12, gap: 12 }}>
          <View style={[
            globalStyles.statusBadge,
            { backgroundColor: statusColor }
          ]}>
            <Text style={globalStyles.statusBadgeText}>
              {quote.status}
            </Text>
          </View>
          
          <Text style={[
            theme.typography.h4,
            { color: theme.colors.primary, fontWeight: 'bold' }
          ]}>
            ${calculateTotal().toFixed(2)}
          </Text>
        </View>
      </View>

      {/* Quote Information */}
      <View style={globalStyles.detailsSection}>
        <Text style={[globalStyles.detailsSectionTitle, { color: theme.colors.text }]}>
          Quote Information
        </Text>
        
        <View style={[
          globalStyles.detailsInfoRow,
          { borderBottomColor: theme.colors.borderLight }
        ]}>
          <Text style={[globalStyles.detailsInfoLabel, { color: theme.colors.textSecondary }]}>
            Service Type
          </Text>
          <Text style={[globalStyles.detailsInfoValue, { color: theme.colors.text }]}>
            {quote.serviceType}
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
            {quote.vehicleInfo}
          </Text>
        </View>
        
        <View style={[
          globalStyles.detailsInfoRow,
          { borderBottomColor: theme.colors.borderLight }
        ]}>
          <Text style={[globalStyles.detailsInfoLabel, { color: theme.colors.textSecondary }]}>
            Client
          </Text>
          <Text style={[globalStyles.detailsInfoValue, { color: theme.colors.text }]}>
            {quote.clientName || 'Unknown Client'}
          </Text>
        </View>
        
        <View style={[
          globalStyles.detailsInfoRow,
          { borderBottomColor: theme.colors.borderLight }
        ]}>
          <Text style={[globalStyles.detailsInfoLabel, { color: theme.colors.textSecondary }]}>
            Mechanic
          </Text>
          <Text style={[globalStyles.detailsInfoValue, { color: theme.colors.text }]}>
            {quote.mechanicName || user?.name || 'Unknown Mechanic'}
          </Text>
        </View>
        
        <View style={[
          globalStyles.detailsInfoRow,
          { borderBottomColor: theme.colors.borderLight }
        ]}>
          <Text style={[globalStyles.detailsInfoLabel, { color: theme.colors.textSecondary }]}>
            Created Date
          </Text>
          <Text style={[globalStyles.detailsInfoValue, { color: theme.colors.text }]}>
            {quote.createdAt ? new Date(quote.createdAt).toLocaleDateString() : 'N/A'}
          </Text>
        </View>
        
        <View style={[
          globalStyles.detailsInfoRow,
          { borderBottomColor: theme.colors.borderLight }
        ]}>
          <Text style={[globalStyles.detailsInfoLabel, { color: theme.colors.textSecondary }]}>
            Valid Until
          </Text>
          <Text style={[globalStyles.detailsInfoValue, { color: theme.colors.text }]}>
            {quote.validUntil || '30 days from creation'}
          </Text>
        </View>
        
        <View style={[globalStyles.detailsInfoRow, globalStyles.detailsInfoRowLast]}>
          <Text style={[globalStyles.detailsInfoLabel, { color: theme.colors.textSecondary }]}>
            Status
          </Text>
          <Text style={[globalStyles.detailsInfoValue, { color: statusColor }]}>
            {quote.status}
          </Text>
        </View>
      </View>

      {/* Quote Items */}
      <View style={globalStyles.detailsSection}>
        <Text style={[globalStyles.detailsSectionTitle, { color: theme.colors.text }]}>
          Quote Breakdown
        </Text>
        
        {quote.items && quote.items.map((item, index) => (
          <View
            key={item.id}
            style={[
              globalStyles.createQuoteItem,
              index === quote.items.length - 1 && { borderBottomWidth: 0 }
            ]}
          >
            <View style={globalStyles.createQuoteItemDescription}>
              <Text style={[theme.typography.body1, { color: theme.colors.text, fontWeight: '500' }]}>
                {item.description}
              </Text>
            </View>
            
            <View style={{ width: 60, alignItems: 'center' }}>
              <Text style={[theme.typography.body2, { color: theme.colors.textSecondary }]}>
                Qty: {item.quantity}
              </Text>
            </View>
            
            <View style={{ width: 80, alignItems: 'center' }}>
              <Text style={[theme.typography.body2, { color: theme.colors.textSecondary }]}>
                ${item.price.toFixed(2)}
              </Text>
            </View>
            
            <View style={globalStyles.createQuoteItemTotal}>
              <Text style={[globalStyles.createQuoteItemTotalText, { color: theme.colors.text }]}>
                ${(item.total || item.quantity * item.price).toFixed(2)}
              </Text>
            </View>
          </View>
        ))}
        
        {/* Quote Totals */}
        <View style={globalStyles.createQuoteTotalSection}>
          <View style={globalStyles.createQuoteTotalRow}>
            <Text style={[globalStyles.createQuoteTotalLabel, { color: theme.colors.text }]}>
              Subtotal:
            </Text>
            <Text style={[globalStyles.createQuoteTotalValue, { color: theme.colors.text }]}>
              ${calculateSubtotal().toFixed(2)}
            </Text>
          </View>
          
          <View style={globalStyles.createQuoteTotalRow}>
            <Text style={[globalStyles.createQuoteTotalLabel, { color: theme.colors.text }]}>
              Tax (8%):
            </Text>
            <Text style={[globalStyles.createQuoteTotalValue, { color: theme.colors.text }]}>
              ${calculateTax().toFixed(2)}
            </Text>
          </View>
          
          <View style={[globalStyles.createQuoteTotalRow, globalStyles.createQuoteTotalRowLast]}>
            <Text style={[globalStyles.createQuoteTotalLabel, { color: theme.colors.primary }]}>
              Total:
            </Text>
            <Text style={[globalStyles.createQuoteTotalGrandTotal, { color: theme.colors.primary }]}>
              ${calculateTotal().toFixed(2)}
            </Text>
          </View>
        </View>
      </View>

      {/* Quote Notes */}
      {quote.notes && (
        <View style={globalStyles.detailsSection}>
          <Text style={[globalStyles.detailsSectionTitle, { color: theme.colors.text }]}>
            Additional Notes
          </Text>
          <Text style={[globalStyles.jobDetailsNotes, { color: theme.colors.textSecondary }]}>
            {quote.notes}
          </Text>
        </View>
      )}

      {/* Action Buttons */}
      <View style={globalStyles.detailsActionsContainer}>
        {/* Client Actions */}
        {user?.role === 'client' && quote.status === 'pending' && (
          <>
            <TouchableOpacity
              style={[globalStyles.buttonBase, globalStyles.detailsActionButton]}
              onPress={() => handleStatusUpdate('accepted')}
            >
              <Text style={globalStyles.buttonText}>Accept Quote</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                globalStyles.buttonBase,
                globalStyles.buttonDanger,
                globalStyles.detailsActionButtonLast
              ]}
              onPress={() => handleStatusUpdate('rejected')}
            >
              <Text style={globalStyles.buttonText}>Reject Quote</Text>
            </TouchableOpacity>
          </>
        )}
        
        {/* Mechanic Actions */}
        {user?.role === 'mechanic' && quote.mechanicId === user.id && quote.status === 'pending' && (
          <>
            <TouchableOpacity
              style={[globalStyles.buttonBase, globalStyles.detailsActionButton]}
              onPress={() => navigation.navigate('EditQuote', { quoteId: quote.id })}
            >
              <Text style={globalStyles.buttonText}>Edit Quote</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                globalStyles.buttonBase,
                globalStyles.buttonSecondary,
                globalStyles.detailsActionButtonLast
              ]}
              onPress={() => {/* Send quote */}}
            >
              <Text style={[globalStyles.buttonText, globalStyles.buttonTextSecondary]}>
                Send Quote
              </Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </ScrollView>
  );
};