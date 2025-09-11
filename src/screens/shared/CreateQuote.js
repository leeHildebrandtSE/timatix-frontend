// =============================================================================
// src/screens/shared/CreateQuote.js - Create Quote Form
// =============================================================================

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Alert,
} from 'react-native';

const CreateQuote = ({ route, navigation }) => {
  const { jobId } = route?.params || {};
  const { user } = useAuth();
  const { serviceRequests, createQuote, addNotification } = useApp();
  const { theme } = useTheme();
  const globalStyles = useGlobalStyles();

  const [job, setJob] = useState(null);
  const [quoteData, setQuoteData] = useState({
    serviceType: '',
    vehicleInfo: '',
    clientName: '',
    validUntil: '',
    notes: '',
  });
  const [items, setItems] = useState([
    { id: 1, description: '', quantity: 1, price: 0, total: 0 }
  ]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (jobId) {
      loadJobDetails();
    }
  }, [jobId]);

  const loadJobDetails = async () => {
    const foundJob = serviceRequests?.find(j => j.id === jobId);
    if (foundJob) {
      setJob(foundJob);
      setQuoteData({
        serviceType: foundJob.serviceType,
        vehicleInfo: foundJob.vehicleInfo,
        clientName: foundJob.clientName || '',
        validUntil: getDefaultValidDate(),
        notes: '',
      });
    }
  };

  const getDefaultValidDate = () => {
    const date = new Date();
    date.setDate(date.getDate() + 30); // 30 days from now
    return date.toISOString().split('T')[0];
  };

  const addItem = () => {
    const newItem = {
      id: items.length + 1,
      description: '',
      quantity: 1,
      price: 0,
      total: 0,
    };
    setItems([...items, newItem]);
  };

  const updateItem = (id, field, value) => {
    setItems(items.map(item => {
      if (item.id === id) {
        const updatedItem = { ...item, [field]: value };
        if (field === 'quantity' || field === 'price') {
          updatedItem.total = updatedItem.quantity * updatedItem.price;
        }
        return updatedItem;
      }
      return item;
    }));
  };

  const removeItem = (id) => {
    if (items.length > 1) {
      setItems(items.filter(item => item.id !== id));
    }
  };

  const calculateSubtotal = () => {
    return items.reduce((sum, item) => sum + item.total, 0);
  };

  const calculateTax = () => {
    return calculateSubtotal() * 0.08; // 8% tax
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateTax();
  };

  const validateForm = () => {
    const newErrors = {};

    if (!quoteData.serviceType.trim()) newErrors.serviceType = 'Service type is required';
    if (!quoteData.vehicleInfo.trim()) newErrors.vehicleInfo = 'Vehicle info is required';
    if (!quoteData.clientName.trim()) newErrors.clientName = 'Client name is required';
    
    const hasValidItems = items.some(item => 
      item.description.trim() && item.quantity > 0 && item.price > 0
    );
    if (!hasValidItems) newErrors.items = 'At least one valid item is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const quote = {
        serviceType: quoteData.serviceType,
        vehicleInfo: quoteData.vehicleInfo,
        clientName: quoteData.clientName,
        mechanicId: user.id,
        mechanicName: user.name,
        jobId: jobId,
        items: items.filter(item => item.description.trim()),
        subtotal: calculateSubtotal(),
        tax: calculateTax(),
        totalAmount: calculateTotal(),
        validUntil: quoteData.validUntil,
        notes: quoteData.notes,
        status: 'pending',
        createdAt: new Date().toISOString(),
      };

      await createQuote(quote);
      addNotification('Quote created successfully!');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'Failed to create quote. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const updateQuoteData = (field, value) => {
    setQuoteData({ ...quoteData, [field]: value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' });
    }
  };

  return (
    <KeyboardAvoidingView style={globalStyles.formContainer} behavior="padding">
      {/* Awesome Header */}
      <View style={[
        globalStyles.dashboardGradientHeader,
        {
          background: 'linear-gradient(135deg, #00B894 0%, #00A085 100%)',
          backgroundColor: '#00B894',
          paddingTop: 60,
          paddingBottom: 30,
        }
      ]}>
        <View style={globalStyles.dashboardHeaderContent}>
          <View style={globalStyles.dashboardGreeting}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
              <Text style={{ fontSize: 32, marginRight: 12 }}>💰</Text>
              <Text style={[globalStyles.dashboardGreetingText, { fontSize: 26 }]}>
                Create Quote
              </Text>
            </View>
            <Text style={globalStyles.dashboardGreetingSubtext}>
              Provide a detailed estimate for the service request
            </Text>
          </View>
          
          <TouchableOpacity
            style={[globalStyles.dashboardProfileButton, {
              backgroundColor: 'rgba(255,255,255,0.25)',
            }]}
            onPress={() => navigation.goBack()}
          >
            <Text style={[globalStyles.dashboardProfileIcon, { fontSize: 24 }]}>✕</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={globalStyles.formScrollContent}>
        {/* Quote Information */}
        <View style={globalStyles.createQuoteSection}>
          <Text style={[globalStyles.createQuoteSectionTitle, { color: theme.colors.text }]}>
            Quote Information
          </Text>

          <View style={globalStyles.inputContainer}>
            <Text style={[globalStyles.inputLabel, { color: theme.colors.text }]}>
              Service Type <Text style={globalStyles.inputRequired}>*</Text>
            </Text>
            <View style={[
              globalStyles.inputFieldContainer,
              errors.serviceType && globalStyles.inputFieldError
            ]}>
              <TextInput
                style={[globalStyles.inputField, { color: theme.colors.text }]}
                value={quoteData.serviceType}
                onChangeText={(text) => updateQuoteData('serviceType', text)}
                placeholder="Enter service type"
                placeholderTextColor={theme.colors.placeholder}
              />
            </View>
            {errors.serviceType && (
              <Text style={globalStyles.inputErrorText}>{errors.serviceType}</Text>
            )}
          </View>

          <View style={globalStyles.inputContainer}>
            <Text style={[globalStyles.inputLabel, { color: theme.colors.text }]}>
              Vehicle Information <Text style={globalStyles.inputRequired}>*</Text>
            </Text>
            <View style={[
              globalStyles.inputFieldContainer,
              errors.vehicleInfo && globalStyles.inputFieldError
            ]}>
              <TextInput
                style={[globalStyles.inputField, { color: theme.colors.text }]}
                value={quoteData.vehicleInfo}
                onChangeText={(text) => updateQuoteData('vehicleInfo', text)}
                placeholder="e.g., 2020 Toyota Camry"
                placeholderTextColor={theme.colors.placeholder}
              />
            </View>
            {errors.vehicleInfo && (
              <Text style={globalStyles.inputErrorText}>{errors.vehicleInfo}</Text>
            )}
          </View>

          <View style={globalStyles.inputContainer}>
            <Text style={[globalStyles.inputLabel, { color: theme.colors.text }]}>
              Client Name <Text style={globalStyles.inputRequired}>*</Text>
            </Text>
            <View style={[
              globalStyles.inputFieldContainer,
              errors.clientName && globalStyles.inputFieldError
            ]}>
              <TextInput
                style={[globalStyles.inputField, { color: theme.colors.text }]}
                value={quoteData.clientName}
                onChangeText={(text) => updateQuoteData('clientName', text)}
                placeholder="Enter client name"
                placeholderTextColor={theme.colors.placeholder}
              />
            </View>
            {errors.clientName && (
              <Text style={globalStyles.inputErrorText}>{errors.clientName}</Text>
            )}
          </View>

          <View style={globalStyles.inputContainer}>
            <Text style={[globalStyles.inputLabel, { color: theme.colors.text }]}>
              Valid Until
            </Text>
            <View style={globalStyles.inputFieldContainer}>
              <TextInput
                style={[globalStyles.inputField, { color: theme.colors.text }]}
                value={quoteData.validUntil}
                onChangeText={(text) => updateQuoteData('validUntil', text)}
                placeholder="YYYY-MM-DD"
                placeholderTextColor={theme.colors.placeholder}
              />
            </View>
          </View>
        </View>

        {/* Quote Items */}
        <View style={globalStyles.createQuoteSection}>
          <Text style={[globalStyles.createQuoteSectionTitle, { color: theme.colors.text }]}>
            Quote Items
          </Text>

          <View style={globalStyles.createQuoteItemsContainer}>
            {/* Header Row */}
            <View style={[globalStyles.createQuoteItem, { paddingVertical: 8, backgroundColor: theme.colors.surface }]}>
              <View style={globalStyles.createQuoteItemDescription}>
                <Text style={[theme.typography.labelSmall, { color: theme.colors.textSecondary }]}>
                  Description
                </Text>
              </View>
              <View style={{ width: 60, alignItems: 'center' }}>
                <Text style={[theme.typography.labelSmall, { color: theme.colors.textSecondary }]}>
                  Qty
                </Text>
              </View>
              <View style={{ width: 80, alignItems: 'center' }}>
                <Text style={[theme.typography.labelSmall, { color: theme.colors.textSecondary }]}>
                  Price
                </Text>
              </View>
              <View style={globalStyles.createQuoteItemTotal}>
                <Text style={[theme.typography.labelSmall, { color: theme.colors.textSecondary }]}>
                  Total
                </Text>
              </View>
            </View>

            {/* Quote Items */}
            {items.map((item) => (
              <View key={item.id} style={globalStyles.createQuoteItem}>
                <View style={globalStyles.createQuoteItemDescription}>
                  <TextInput
                    style={[
                      globalStyles.createQuoteItemDescriptionInput,
                      { color: theme.colors.text, borderColor: theme.colors.border }
                    ]}
                    value={item.description}
                    onChangeText={(text) => updateItem(item.id, 'description', text)}
                    placeholder="Item description..."
                    placeholderTextColor={theme.colors.placeholder}
                  />
                </View>
                
                <View style={globalStyles.createQuoteItemQuantity}>
                  <TextInput
                    style={[
                      globalStyles.createQuoteItemQuantityInput,
                      { color: theme.colors.text, borderColor: theme.colors.border }
                    ]}
                    value={item.quantity.toString()}
                    onChangeText={(text) => updateItem(item.id, 'quantity', parseInt(text) || 0)}
                    keyboardType="numeric"
                    placeholder="1"
                    placeholderTextColor={theme.colors.placeholder}
                  />
                </View>
                
                <View style={globalStyles.createQuoteItemPrice}>
                  <TextInput
                    style={[
                      globalStyles.createQuoteItemPriceInput,
                      { color: theme.colors.text, borderColor: theme.colors.border }
                    ]}
                    value={item.price.toString()}
                    onChangeText={(text) => updateItem(item.id, 'price', parseFloat(text) || 0)}
                    keyboardType="numeric"
                    placeholder="0.00"
                    placeholderTextColor={theme.colors.placeholder}
                  />
                </View>
                
                <View style={globalStyles.createQuoteItemTotal}>
                  <Text style={[globalStyles.createQuoteItemTotalText, { color: theme.colors.text }]}>
                    ${item.total.toFixed(2)}
                  </Text>
                </View>
                
                {items.length > 1 && (
                  <TouchableOpacity
                    style={globalStyles.createQuoteItemRemove}
                    onPress={() => removeItem(item.id)}
                  >
                    <Text style={[globalStyles.createQuoteItemRemoveIcon, { color: theme.colors.error }]}>
                      ✕
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            ))}

            {/* Add Item Button */}
            <TouchableOpacity
              style={[globalStyles.createQuoteAddItem, { borderColor: theme.colors.border }]}
              onPress={addItem}
            >
              <Text style={[globalStyles.createQuoteAddItemIcon, { color: theme.colors.primary }]}>
                ➕
              </Text>
              <Text style={[globalStyles.createQuoteAddItemText, { color: theme.colors.primary }]}>
                Add Item
              </Text>
            </TouchableOpacity>
          </View>

          {errors.items && (
            <Text style={globalStyles.inputErrorText}>{errors.items}</Text>
          )}
        </View>

        {/* Quote Total */}
        <View style={globalStyles.createQuoteSection}>
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

        {/* Additional Notes */}
        <View style={globalStyles.createQuoteSection}>
          <Text style={[globalStyles.createQuoteSectionTitle, { color: theme.colors.text }]}>
            Additional Notes (Optional)
          </Text>

          <View style={[globalStyles.inputFieldContainer, { minHeight: 80, alignItems: 'flex-start' }]}>
            <TextInput
              style={[
                globalStyles.inputField,
                globalStyles.inputFieldMultiline,
                { color: theme.colors.text, minHeight: 60 }
              ]}
              value={quoteData.notes}
              onChangeText={(text) => updateQuoteData('notes', text)}
              placeholder="Any additional notes, terms, or conditions..."
              placeholderTextColor={theme.colors.placeholder}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
            />
          </View>
        </View>
      </ScrollView>

      {/* Submit Button */}
      <View style={{ padding: 20, paddingTop: 0 }}>
        <TouchableOpacity
          style={[
            globalStyles.buttonBase,
            globalStyles.createQuoteSubmitButton,
            loading && globalStyles.buttonDisabled,
            { marginTop: 0 }
          ]}
          onPress={handleSubmit}
          disabled={loading}
        >
          <Text style={globalStyles.buttonText}>
            {loading ? 'Creating Quote...' : 'Create Quote'}
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

export default {
  JobDetails,
  QuoteDetails,
  CreateQuote,
};