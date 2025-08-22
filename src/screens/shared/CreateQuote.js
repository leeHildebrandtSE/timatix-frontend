// src/screens/shared/CreateQuote.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { useTheme } from '../../context/ThemeContext';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { formatCurrency } from '../../utils/formatters';
import { SERVICE_STATUS } from '../../utils/constants';

const CreateQuote = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { jobId } = route.params;
  
  const { user } = useAuth();
  const { 
    serviceRequests, 
    updateServiceRequest,
    addNotification,
    isLoading,
    setLoading 
  } = useApp();
  const { theme } = useTheme();
  
  const [job, setJob] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  
  const [quoteForm, setQuoteForm] = useState({
    laborHours: '',
    laborRate: '450', // Default R450/hour
    parts: [
      { description: '', quantity: '1', unitPrice: '', total: '0' }
    ],
    miscCharges: '0',
    discount: '0',
    notes: '',
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    loadJobDetails();
  }, [jobId]);

  const loadJobDetails = async () => {
    try {
      setLoading(true);
      
      // Find job in local state
      const foundJob = serviceRequests.find(s => s.id === jobId);
      if (foundJob) {
        setJob(foundJob);
      } else {
        Alert.alert('Error', 'Job not found');
        navigation.goBack();
      }
    } catch (error) {
      console.error('Error loading job details:', error);
      Alert.alert('Error', 'Failed to load job details');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setQuoteForm(prev => ({
      ...prev,
      [field]: value,
    }));
    
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: null,
      }));
    }
  };

  const handlePartChange = (index, field, value) => {
    const updatedParts = [...quoteForm.parts];
    updatedParts[index] = {
      ...updatedParts[index],
      [field]: value,
    };
    
    // Calculate total for this part
    if (field === 'quantity' || field === 'unitPrice') {
      const quantity = parseFloat(updatedParts[index].quantity) || 0;
      const unitPrice = parseFloat(updatedParts[index].unitPrice) || 0;
      updatedParts[index].total = (quantity * unitPrice).toFixed(2);
    }
    
    setQuoteForm(prev => ({
      ...prev,
      parts: updatedParts,
    }));
  };

  const addPart = () => {
    setQuoteForm(prev => ({
      ...prev,
      parts: [...prev.parts, { description: '', quantity: '1', unitPrice: '', total: '0' }],
    }));
  };

  const removePart = (index) => {
    if (quoteForm.parts.length > 1) {
      setQuoteForm(prev => ({
        ...prev,
        parts: prev.parts.filter((_, i) => i !== index),
      }));
    }
  };

  const calculateQuoteTotal = () => {
    const laborHours = parseFloat(quoteForm.laborHours) || 0;
    const laborRate = parseFloat(quoteForm.laborRate) || 0;
    const laborTotal = laborHours * laborRate;
    
    const partsTotal = quoteForm.parts.reduce((sum, part) => {
      return sum + (parseFloat(part.total) || 0);
    }, 0);
    
    const miscCharges = parseFloat(quoteForm.miscCharges) || 0;
    const discount = parseFloat(quoteForm.discount) || 0;
    
    const subtotal = laborTotal + partsTotal + miscCharges;
    const discountAmount = (subtotal * discount) / 100;
    const afterDiscount = subtotal - discountAmount;
    const vatAmount = afterDiscount * 0.15; // 15% VAT
    const totalAmount = afterDiscount + vatAmount;
    
    return {
      laborTotal,
      partsTotal,
      subtotal,
      discountAmount,
      vatAmount,
      totalAmount,
    };
  };

  const validateQuote = () => {
    const newErrors = {};
    
    if (!quoteForm.laborHours || parseFloat(quoteForm.laborHours) <= 0) {
      newErrors.laborHours = 'Labor hours is required and must be greater than 0';
    }
    
    if (!quoteForm.laborRate || parseFloat(quoteForm.laborRate) <= 0) {
      newErrors.laborRate = 'Labor rate is required and must be greater than 0';
    }
    
    // Validate parts
    quoteForm.parts.forEach((part, index) => {
      if (part.description && (!part.unitPrice || parseFloat(part.unitPrice) <= 0)) {
        newErrors[`part_${index}_unitPrice`] = 'Unit price is required for this part';
      }
    });
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmitQuote = async () => {
    if (!validateQuote()) return;
    
    try {
      setSubmitting(true);
      
      const totals = calculateQuoteTotal();
      const quoteData = {
        id: Date.now().toString(),
        jobId: job.id,
        laborHours: parseFloat(quoteForm.laborHours),
        laborRate: parseFloat(quoteForm.laborRate),
        laborTotal: totals.laborTotal,
        parts: quoteForm.parts.filter(part => part.description).map(part => ({
          description: part.description,
          quantity: parseFloat(part.quantity),
          unitPrice: parseFloat(part.unitPrice),
          total: parseFloat(part.total),
        })),
        partsTotal: totals.partsTotal,
        miscCharges: parseFloat(quoteForm.miscCharges) || 0,
        subtotal: totals.subtotal,
        discount: parseFloat(quoteForm.discount) || 0,
        discountAmount: totals.discountAmount,
        vatAmount: totals.vatAmount,
        totalAmount: totals.totalAmount,
        notes: quoteForm.notes,
        createdAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(), // 14 days
        status: 'SENT',
      };
      
      // Update job with quote
      const updatedJob = {
        ...job,
        status: SERVICE_STATUS.QUOTE_SENT,
        quote: quoteData,
        updatedAt: new Date().toISOString(),
      };
      
      updateServiceRequest(updatedJob);
      
      addNotification({
        title: 'Quote Sent',
        message: `Quote for ${job.serviceType} has been sent to ${job.client?.name}.`,
        type: 'success',
      });
      
      Alert.alert(
        'Quote Sent',
        `Quote of ${formatCurrency(totals.totalAmount)} has been sent to the client.`,
        [
          { text: 'OK', onPress: () => navigation.goBack() }
        ]
      );
    } catch (error) {
      console.error('Error creating quote:', error);
      Alert.alert('Error', 'Failed to create quote');
    } finally {
      setSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <LoadingSpinner message="Loading job details..." />
      </SafeAreaView>
    );
  }

  if (!job) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <View style={styles.errorContainer}>
          <Text style={[styles.errorText, theme.typography.h6]}>
            Job not found
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

  const totals = calculateQuoteTotal();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* Job Information */}
        <View style={[styles.section, { backgroundColor: theme.colors.surface }]}>
          <Text style={[styles.sectionTitle, theme.typography.h5]}>
            Job Information
          </Text>
          
          <View style={styles.jobInfo}>
            <Text style={[styles.jobTitle, theme.typography.h6]}>
              {job.serviceType}
            </Text>
            <Text style={[styles.jobVehicle, theme.typography.body2]}>
              {job.vehicle ? 
                `${job.vehicle.year} ${job.vehicle.make} ${job.vehicle.model}` :
                'Vehicle information not available'
              }
            </Text>
            <Text style={[styles.jobClient, theme.typography.caption]}>
              Client: {job.client?.name || 'Unknown'}
            </Text>
          </View>
        </View>

        {/* Labor Section */}
        <View style={[styles.section, { backgroundColor: theme.colors.surface }]}>
          <Text style={[styles.sectionTitle, theme.typography.h5]}>
            Labor
          </Text>
          
          <View style={styles.laborRow}>
            <Input
              label="Hours *"
              value={quoteForm.laborHours}
              onChangeText={(value) => handleInputChange('laborHours', value)}
              placeholder="0.0"
              keyboardType="numeric"
              error={errors.laborHours}
              style={styles.laborInput}
            />
            
            <Input
              label="Rate (R/hour) *"
              value={quoteForm.laborRate}
              onChangeText={(value) => handleInputChange('laborRate', value)}
              placeholder="450"
              keyboardType="numeric"
              error={errors.laborRate}
              style={styles.laborInput}
            />
          </View>
          
          <Text style={[styles.laborTotal, theme.typography.h6]}>
            Labor Total: {formatCurrency(totals.laborTotal)}
          </Text>
        </View>

        {/* Parts Section */}
        <View style={[styles.section, { backgroundColor: theme.colors.surface }]}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, theme.typography.h5]}>
              Parts & Materials
            </Text>
            <TouchableOpacity onPress={addPart}>
              <Text style={[styles.addButton, { color: theme.colors.primary }]}>
                + Add Part
              </Text>
            </TouchableOpacity>
          </View>
          
          {quoteForm.parts.map((part, index) => (
            <View key={index} style={styles.partContainer}>
              <Input
                label="Description"
                value={part.description}
                onChangeText={(value) => handlePartChange(index, 'description', value)}
                placeholder="Part name"
                style={styles.partDescInput}
              />
              
              <View style={styles.partRow}>
                <Input
                  label="Qty"
                  value={part.quantity}
                  onChangeText={(value) => handlePartChange(index, 'quantity', value)}
                  placeholder="1"
                  keyboardType="numeric"
                  style={styles.partQtyInput}
                />
                
                <Input
                  label="Unit Price"
                  value={part.unitPrice}
                  onChangeText={(value) => handlePartChange(index, 'unitPrice', value)}
                  placeholder="0.00"
                  keyboardType="numeric"
                  style={styles.partPriceInput}
                  error={errors[`part_${index}_unitPrice`]}
                />
                
                <View style={styles.partTotalContainer}>
                  <Text style={[styles.partTotalLabel, theme.typography.caption]}>Total</Text>
                  <Text style={[styles.partTotalValue, theme.typography.h6]}>
                    R {part.total}
                  </Text>
                </View>
              </View>
              
              {quoteForm.parts.length > 1 && (
                <TouchableOpacity
                  style={styles.removePartButton}
                  onPress={() => removePart(index)}
                >
                  <Text style={[styles.removePartText, { color: theme.colors.error }]}>
                    Remove Part
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          ))}
          
          <Text style={[styles.partsTotal, theme.typography.h6]}>
            Parts Total: {formatCurrency(totals.partsTotal)}
          </Text>
        </View>

        {/* Additional Charges */}
        <View style={[styles.section, { backgroundColor: theme.colors.surface }]}>
          <Text style={[styles.sectionTitle, theme.typography.h5]}>
            Additional
          </Text>
          
          <Input
            label="Miscellaneous Charges"
            value={quoteForm.miscCharges}
            onChangeText={(value) => handleInputChange('miscCharges', value)}
            placeholder="0.00"
            keyboardType="numeric"
          />
          
          <Input
            label="Discount (%)"
            value={quoteForm.discount}
            onChangeText={(value) => handleInputChange('discount', value)}
            placeholder="0"
            keyboardType="numeric"
          />
        </View>

        {/* Notes */}
        <View style={[styles.section, { backgroundColor: theme.colors.surface }]}>
          <Input
            label="Notes"
            value={quoteForm.notes}
            onChangeText={(value) => handleInputChange('notes', value)}
            placeholder="Additional notes for the client..."
            multiline
            numberOfLines={3}
          />
        </View>

        {/* Quote Summary */}
        <View style={[styles.section, { backgroundColor: theme.colors.surface }]}>
          <Text style={[styles.sectionTitle, theme.typography.h5]}>
            Quote Summary
          </Text>
          
          <View style={styles.summaryContainer}>
            <View style={styles.summaryRow}>
              <Text style={[styles.summaryLabel, theme.typography.body2]}>Labor:</Text>
              <Text style={[styles.summaryValue, theme.typography.body2]}>
                {formatCurrency(totals.laborTotal)}
              </Text>
            </View>
            
            <View style={styles.summaryRow}>
              <Text style={[styles.summaryLabel, theme.typography.body2]}>Parts:</Text>
              <Text style={[styles.summaryValue, theme.typography.body2]}>
                {formatCurrency(totals.partsTotal)}
              </Text>
            </View>
            
            <View style={styles.summaryRow}>
              <Text style={[styles.summaryLabel, theme.typography.body2]}>Misc Charges:</Text>
              <Text style={[styles.summaryValue, theme.typography.body2]}>
                {formatCurrency(parseFloat(quoteForm.miscCharges) || 0)}
              </Text>
            </View>
            
            <View style={styles.summaryRow}>
              <Text style={[styles.summaryLabel, theme.typography.body2]}>Subtotal:</Text>
              <Text style={[styles.summaryValue, theme.typography.body2]}>
                {formatCurrency(totals.subtotal)}
              </Text>
            </View>
            
            <View style={styles.summaryRow}>
              <Text style={[styles.summaryLabel, theme.typography.body2]}>Discount:</Text>
              <Text style={[styles.summaryValue, theme.typography.body2, { color: theme.colors.success }]}>
                -{formatCurrency(totals.discountAmount)}
              </Text>
            </View>
            
            <View style={styles.summaryRow}>
              <Text style={[styles.summaryLabel, theme.typography.body2]}>VAT (15%):</Text>
              <Text style={[styles.summaryValue, theme.typography.body2]}>
                {formatCurrency(totals.vatAmount)}
              </Text>
            </View>
            
            <View style={[styles.summaryRow, styles.totalRow]}>
              <Text style={[styles.totalLabel, theme.typography.h5]}>Total:</Text>
              <Text style={[styles.totalValue, theme.typography.h5]}>
                {formatCurrency(totals.totalAmount)}
              </Text>
            </View>
          </View>
        </View>

        {/* Submit Button */}
        <Button
          title="Send Quote"
          onPress={handleSubmitQuote}
          loading={submitting}
          disabled={submitting}
          style={styles.submitButton}
        />
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
    paddingBottom: 40,
  },
  section: {
    marginHorizontal: 20,
    marginTop: 16,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  sectionTitle: {
    marginBottom: 12,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  addButton: {
    fontSize: 14,
    fontWeight: '600',
  },
  jobInfo: {
    gap: 4,
  },
  jobTitle: {
    marginBottom: 4,
  },
  jobVehicle: {
    opacity: 0.8,
    marginBottom: 4,
  },
  jobClient: {
    opacity: 0.6,
  },
  laborRow: {
    flexDirection: 'row',
    gap: 12,
  },
  laborInput: {
    flex: 1,
  },
  laborTotal: {
    textAlign: 'right',
    marginTop: 8,
    color: '#4CAF50',
  },
  partContainer: {
    marginBottom: 16,
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#F8F9FA',
  },
  partDescInput: {
    marginBottom: 12,
  },
  partRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
  },
  partQtyInput: {
    flex: 1,
  },
  partPriceInput: {
    flex: 2,
  },
  partTotalContainer: {
    flex: 1,
    alignItems: 'flex-end',
  },
  partTotalLabel: {
    marginBottom: 4,
  },
  partTotalValue: {
    color: '#4CAF50',
  },
  removePartButton: {
    alignSelf: 'flex-end',
    marginTop: 8,
  },
  removePartText: {
    fontSize: 12,
    fontWeight: '600',
  },
  partsTotal: {
    textAlign: 'right',
    marginTop: 8,
    color: '#4CAF50',
  },
  summaryContainer: {
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
  submitButton: {
    marginHorizontal: 20,
    marginTop: 24,
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

export default CreateQuote;