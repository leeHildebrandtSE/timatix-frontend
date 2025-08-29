import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  Alert,
  Modal,
  TextInput,
} from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { useTheme } from '../../context/ThemeContext';
import ServiceCard from '../../components/cards/ServiceCard';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { SERVICE_STATUS } from '../../utils/constants';
import { serviceRequestsService } from '../../services/serviceRequestsService';
import { formatCurrency } from '../../utils/formatters';

const QuoteManagement = ({ navigation }) => {
  const { user } = useAuth();
  const { 
    serviceRequests, 
    setServiceRequests,
    isLoading,
    setLoading,
    addNotification 
  } = useApp();
  const { theme } = useTheme();
  
  const [refreshing, setRefreshing] = useState(false);
  const [pendingQuotes, setPendingQuotes] = useState([]);
  const [sentQuotes, setSentQuotes] = useState([]);
  const [showCreateQuoteModal, setShowCreateQuoteModal] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [quoteLoading, setQuoteLoading] = useState(false);
  
  const [quoteForm, setQuoteForm] = useState({
    laborHours: '',
    laborRate: '450', // Default R450/hour
    parts: [
      { description: '', quantity: '1', unitPrice: '', total: '0' }
    ],
    miscCharges: '',
    discount: '0',
    notes: '',
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    loadQuotes();
  }, []);

  useEffect(() => {
    organizeQuotes();
  }, [serviceRequests]);

  const loadQuotes = async () => {
    try {
      setLoading(true);
      const assignedJobs = await serviceRequestsService.getAssignedRequests(user.id);
      setServiceRequests(assignedJobs);
    } catch (error) {
      console.error('Error loading quotes:', error);
      Alert.alert('Error', 'Failed to load quotes');
      
      // Mock data for quotes
      const mockJobs = [
        {
          id: '1',
          serviceType: 'Oil Change',
          status: SERVICE_STATUS.PENDING_QUOTE,
          preferredDate: '2025-01-25',
          preferredTime: '10:00',
          notes: 'Regular maintenance due',
          vehicle: {
            id: '1',
            make: 'Toyota',
            model: 'Corolla',
            year: 2020,
          },
          client: {
            id: 'c1',
            name: 'John Doe',
            phone: '+27 11 123 4567',
          },
          assignedMechanic: {
            id: user.id,
            name: user.firstName + ' ' + user.lastName,
          },
          createdAt: '2025-01-20T10:00:00Z',
        },
        {
          id: '2',
          serviceType: 'Brake Service',
          status: SERVICE_STATUS.QUOTE_SENT,
          preferredDate: '2025-01-28',
          preferredTime: '14:00',
          notes: 'Brake pads replacement needed',
          vehicle: {
            id: '2',
            make: 'BMW',
            model: 'X3',
            year: 2019,
          },
          client: {
            id: 'c2',
            name: 'Jane Smith',
            phone: '+27 11 234 5678',
          },
          quote: {
            id: 'q1',
            laborHours: 2,
            laborRate: 450,
            laborTotal: 900,
            parts: [
              { description: 'Brake Pads (Front)', quantity: 1, unitPrice: 350, total: 350 },
              { description: 'Brake Fluid', quantity: 1, unitPrice: 80, total: 80 },
            ],
            partsTotal: 430,
            miscCharges: 50,
            subtotal: 1380,
            discount: 30,
            vatAmount: 202.5,
            totalAmount: 1552.5,
            notes: 'Premium brake pads recommended for this vehicle',
            createdAt: '2025-01-22T10:00:00Z',
            expiresAt: '2025-02-05T10:00:00Z',
            status: 'SENT',
          },
          assignedMechanic: {
            id: user.id,
            name: user.firstName + ' ' + user.lastName,
          },
          createdAt: '2025-01-18T14:30:00Z',
        },
        {
          id: '3',
          serviceType: 'Engine Diagnostic',
          status: SERVICE_STATUS.QUOTE_SENT,
          preferredDate: '2025-01-26',
          preferredTime: '09:00',
          notes: 'Check engine light is on',
          vehicle: {
            id: '3',
            make: 'Mercedes-Benz',
            model: 'C-Class',
            year: 2021,
          },
          client: {
            id: 'c3',
            name: 'Mike Johnson',
            phone: '+27 11 345 6789',
          },
          quote: {
            id: 'q2',
            laborHours: 1.5,
            laborRate: 500,
            laborTotal: 750,
            parts: [],
            partsTotal: 0,
            miscCharges: 0,
            subtotal: 750,
            discount: 0,
            vatAmount: 112.5,
            totalAmount: 862.5,
            notes: 'Diagnostic fee includes computer scan and initial assessment',
            createdAt: '2025-01-23T15:00:00Z',
            expiresAt: '2025-02-06T15:00:00Z',
            status: 'SENT',
          },
          assignedMechanic: {
            id: user.id,
            name: user.firstName + ' ' + user.lastName,
          },
          createdAt: '2025-01-23T11:00:00Z',
        },
      ];
      
      setServiceRequests(mockJobs);
    } finally {
      setLoading(false);
    }
  };

  const organizeQuotes = () => {
    const mechanicJobs = serviceRequests.filter(req => req.assignedMechanic?.id === user.id);
    
    const pending = mechanicJobs.filter(job => job.status === SERVICE_STATUS.PENDING_QUOTE);
    const sent = mechanicJobs.filter(job => job.status === SERVICE_STATUS.QUOTE_SENT);
    
    setPendingQuotes(pending);
    setSentQuotes(sent);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadQuotes();
    setRefreshing(false);
  };

  const handleCreateQuote = (job) => {
    setSelectedJob(job);
    setQuoteForm({
      laborHours: '',
      laborRate: '450',
      parts: [
        { description: '', quantity: '1', unitPrice: '', total: '0' }
      ],
      miscCharges: '',
      discount: '0',
      notes: '',
    });
    setErrors({});
    setShowCreateQuoteModal(true);
  };

  const handleQuoteInputChange = (field, value) => {
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
      setQuoteLoading(true);
      
      const quoteData = {
        jobId: selectedJob.id,
        ...quoteForm,
        ...calculateQuoteTotal(),
        createdAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(), // 14 days
        status: 'SENT',
      };
      
      // API call would go here
      // await quotesService.createQuote(quoteData);
      
      // Update local state
      const updatedRequests = serviceRequests.map(req =>
        req.id === selectedJob.id 
          ? { ...req, status: SERVICE_STATUS.QUOTE_SENT, quote: quoteData }
          : req
      );
      setServiceRequests(updatedRequests);
      
      addNotification({
        title: 'Quote Sent',
        message: `Quote for ${selectedJob.serviceType} has been sent to ${selectedJob.client.name}.`,
        type: 'success',
      });
      
      setShowCreateQuoteModal(false);
    } catch (error) {
      console.error('Error creating quote:', error);
      Alert.alert('Error', 'Failed to create quote');
    } finally {
      setQuoteLoading(false);
    }
  };

  const handleViewQuote = (job) => {
    navigation.navigate('QuoteDetails', { 
      serviceId: job.id, 
      quoteId: job.quote?.id 
    });
  };

  const handleEditQuote = (job) => {
    // Pre-populate form with existing quote data
    setSelectedJob(job);
    const quote = job.quote;
    setQuoteForm({
      laborHours: quote.laborHours.toString(),
      laborRate: quote.laborRate.toString(),
      parts: quote.parts.length > 0 ? quote.parts.map(part => ({
        ...part,
        quantity: part.quantity.toString(),
        unitPrice: part.unitPrice.toString(),
        total: part.total.toString(),
      })) : [{ description: '', quantity: '1', unitPrice: '', total: '0' }],
      miscCharges: quote.miscCharges?.toString() || '',
      discount: ((quote.discountAmount / quote.subtotal) * 100).toString() || '0',
      notes: quote.notes || '',
    });
    setErrors({});
    setShowCreateQuoteModal(true);
  };

  const renderCreateQuoteModal = () => {
    const totals = calculateQuoteTotal();
    
    return (
      <Modal
        visible={showCreateQuoteModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <SafeAreaView style={[styles.modalContainer, { backgroundColor: theme.colors.background }]}>
          <View style={styles.modalHeader}>
            <Text style={[styles.modalTitle, theme.typography.h4]}>
              {selectedJob?.quote ? 'Edit Quote' : 'Create Quote'}
            </Text>
            <TouchableOpacity onPress={() => setShowCreateQuoteModal(false)}>
              <Text style={[styles.modalClose, { color: theme.colors.primary }]}>
                Cancel
              </Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            {/* Job Info */}
            <View style={[styles.jobInfoCard, { backgroundColor: theme.colors.surface }]}>
              <Text style={[styles.jobInfoTitle, theme.typography.h6]}>
                {selectedJob?.serviceType}
              </Text>
              <Text style={[styles.jobInfoSubtitle, theme.typography.body2]}>
                {selectedJob?.vehicle?.year} {selectedJob?.vehicle?.make} {selectedJob?.vehicle?.model}
              </Text>
              <Text style={[styles.jobInfoClient, theme.typography.caption]}>
                Client: {selectedJob?.client?.name}
              </Text>
            </View>

            {/* Labor Section */}
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, theme.typography.h6]}>Labor</Text>
              
              <View style={styles.laborRow}>
                <Input
                  label="Hours"
                  value={quoteForm.laborHours}
                  onChangeText={(value) => handleQuoteInputChange('laborHours', value)}
                  placeholder="0.0"
                  keyboardType="numeric"
                  error={errors.laborHours}
                  style={styles.laborInput}
                  required
                />
                
                <Input
                  label="Rate (R/hour)"
                  value={quoteForm.laborRate}
                  onChangeText={(value) => handleQuoteInputChange('laborRate', value)}
                  placeholder="450"
                  keyboardType="numeric"
                  error={errors.laborRate}
                  style={styles.laborInput}
                  required
                />
              </View>
              
              <Text style={[styles.laborTotal, theme.typography.body2]}>
                Labor Total: {formatCurrency(totals.laborTotal)}
              </Text>
            </View>

            {/* Parts Section */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={[styles.sectionTitle, theme.typography.h6]}>Parts & Materials</Text>
                <TouchableOpacity onPress={addPart}>
                  <Text style={[styles.addButton, { color: theme.colors.primary }]}>
                    + Add Part
                  </Text>
                </TouchableOpacity>
              </View>
              
              {quoteForm.parts.map((part, index) => (
                <View key={index} style={styles.partRow}>
                  <Input
                    label="Description"
                    value={part.description}
                    onChangeText={(value) => handlePartChange(index, 'description', value)}
                    placeholder="Part name"
                    style={styles.partDescInput}
                  />
                  
                  <View style={styles.partNumbersRow}>
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
                      <Text style={[styles.partTotalValue, theme.typography.body2]}>
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
                        Remove
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
              ))}
              
              <Text style={[styles.partsTotal, theme.typography.body2]}>
                Parts Total: {formatCurrency(totals.partsTotal)}
              </Text>
            </View>

            {/* Additional Charges */}
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, theme.typography.h6]}>Additional</Text>
              
              <Input
                label="Miscellaneous Charges"
                value={quoteForm.miscCharges}
                onChangeText={(value) => handleQuoteInputChange('miscCharges', value)}
                placeholder="0.00"
                keyboardType="numeric"
              />
              
              <Input
                label="Discount (%)"
                value={quoteForm.discount}
                onChangeText={(value) => handleQuoteInputChange('discount', value)}
                placeholder="0"
                keyboardType="numeric"
              />
            </View>

            {/* Notes */}
            <View style={styles.section}>
              <Input
                label="Notes"
                value={quoteForm.notes}
                onChangeText={(value) => handleQuoteInputChange('notes', value)}
                placeholder="Additional notes for the client..."
                multiline
                numberOfLines={3}
              />
            </View>

            {/* Quote Summary */}
            <View style={[styles.summaryCard, { backgroundColor: theme.colors.surface }]}>
              <Text style={[styles.summaryTitle, theme.typography.h6]}>Quote Summary</Text>
              
              <View style={styles.summaryRow}>
                <Text style={theme.typography.body2}>Labor:</Text>
                <Text style={theme.typography.body2}>{formatCurrency(totals.laborTotal)}</Text>
              </View>
              
              <View style={styles.summaryRow}>
                <Text style={theme.typography.body2}>Parts:</Text>
                <Text style={theme.typography.body2}>{formatCurrency(totals.partsTotal)}</Text>
              </View>
              
              <View style={styles.summaryRow}>
                <Text style={theme.typography.body2}>Misc Charges:</Text>
                <Text style={theme.typography.body2}>{formatCurrency(parseFloat(quoteForm.miscCharges) || 0)}</Text>
              </View>
              
              <View style={styles.summaryRow}>
                <Text style={theme.typography.body2}>Subtotal:</Text>
                <Text style={theme.typography.body2}>{formatCurrency(totals.subtotal)}</Text>
              </View>
              
              <View style={styles.summaryRow}>
                <Text style={theme.typography.body2}>Discount:</Text>
                <Text style={theme.typography.body2}>-{formatCurrency(totals.discountAmount)}</Text>
              </View>
              
              <View style={styles.summaryRow}>
                <Text style={theme.typography.body2}>VAT (15%):</Text>
                <Text style={theme.typography.body2}>{formatCurrency(totals.vatAmount)}</Text>
              </View>
              
              <View style={[styles.summaryRow, styles.totalRow]}>
                <Text style={[theme.typography.h6, { color: theme.colors.primary }]}>Total:</Text>
                <Text style={[theme.typography.h6, { color: theme.colors.primary }]}>
                  {formatCurrency(totals.totalAmount)}
                </Text>
              </View>
            </View>

            <Button
              title={selectedJob?.quote ? 'Update Quote' : 'Send Quote'}
              onPress={handleSubmitQuote}
              loading={quoteLoading}
              disabled={quoteLoading}
              style={styles.submitButton}
            />
          </ScrollView>
        </SafeAreaView>
      </Modal>
    );
  };

  if (isLoading && !refreshing) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <LoadingSpinner message="Loading quotes..." />
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
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.title, theme.typography.h3]}>
            Quote Management
          </Text>
        </View>

        {/* Pending Quotes Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, theme.typography.h5]}>
            Pending Quotes ({pendingQuotes.length})
          </Text>
          
          {pendingQuotes.length > 0 ? (
            pendingQuotes.map((job) => (
              <View key={job.id} style={styles.jobCard}>
                <ServiceCard
                  service={job}
                  onPress={() => navigation.navigate('JobDetails', { jobId: job.id })}
                  userRole="MECHANIC"
                />
                
                <View style={styles.jobActions}>
                  <Button
                    title="Create Quote"
                    onPress={() => handleCreateQuote(job)}
                    size="small"
                    style={styles.actionButton}
                  />
                </View>
              </View>
            ))
          ) : (
            <View style={[styles.emptyCard, { backgroundColor: theme.colors.surface }]}>
              <Text style={[styles.emptyText, theme.typography.body2]}>
                No pending quotes
              </Text>
            </View>
          )}
        </View>

        {/* Sent Quotes Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, theme.typography.h5]}>
            Sent Quotes ({sentQuotes.length})
          </Text>
          
          {sentQuotes.length > 0 ? (
            sentQuotes.map((job) => (
              <View key={job.id} style={styles.jobCard}>
                <ServiceCard
                  service={job}
                  onPress={() => handleViewQuote(job)}
                  userRole="MECHANIC"
                />
                
                <View style={styles.quoteInfo}>
                  <Text style={[styles.quoteAmount, theme.typography.h6]}>
                    {formatCurrency(job.quote?.totalAmount || 0)}
                  </Text>
                  <Text style={[styles.quoteDate, theme.typography.caption]}>
                    Sent: {new Date(job.quote?.createdAt).toLocaleDateString()}
                  </Text>
                  <Text style={[styles.quoteExpiry, theme.typography.caption]}>
                    Expires: {new Date(job.quote?.expiresAt).toLocaleDateString()}
                  </Text>
                </View>
                
                <View style={styles.jobActions}>
                  <Button
                    title="View Quote"
                    onPress={() => handleViewQuote(job)}
                    size="small"
                    variant="outline"
                    style={styles.actionButton}
                  />
                  
                  <Button
                    title="Edit Quote"
                    onPress={() => handleEditQuote(job)}
                    size="small"
                    style={styles.actionButton}
                  />
                </View>
              </View>
            ))
          ) : (
            <View style={[styles.emptyCard, { backgroundColor: theme.colors.surface }]}>
              <Text style={[styles.emptyText, theme.typography.body2]}>
                No sent quotes
              </Text>
            </View>
          )}
        </View>
      </ScrollView>

      {renderCreateQuoteModal()}
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
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 24,
  },
  title: {
    marginBottom: 4,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  sectionTitle: {
    marginBottom: 16,
  },
  jobCard: {
    marginBottom: 16,
  },
  jobActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 8,
    paddingHorizontal: 16,
    gap: 8,
  },
  actionButton: {
    paddingHorizontal: 20,
  },
  quoteInfo: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 8,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  quoteAmount: {
    color: '#4CAF50',
    marginBottom: 4,
  },
  quoteDate: {
    opacity: 0.7,
    marginBottom: 2,
  },
  quoteExpiry: {
    opacity: 0.7,
  },
  emptyCard: {
    padding: 24,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderStyle: 'dashed',
  },
  emptyText: {
    opacity: 0.6,
  },
  modalContainer: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  modalTitle: {
    flex: 1,
  },
  modalClose: {
    fontSize: 16,
    fontWeight: '600',
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  jobInfoCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  jobInfoTitle: {
    marginBottom: 4,
  },
  jobInfoSubtitle: {
    opacity: 0.8,
    marginBottom: 4,
  },
  jobInfoClient: {
    opacity: 0.6,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  addButton: {
    fontSize: 14,
    fontWeight: '600',
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
    fontWeight: '600',
    marginTop: 8,
  },
  partRow: {
    marginBottom: 16,
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#F8F9FA',
  },
  partDescInput: {
    marginBottom: 12,
  },
  partNumbersRow: {
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
    fontWeight: '600',
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
    fontWeight: '600',
    marginTop: 8,
  },
  summaryCard: {
    padding: 16,
    borderRadius: 12,
    marginVertical: 24,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  summaryTitle: {
    marginBottom: 12,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    paddingTop: 8,
    marginTop: 8,
  },
  submitButton: {
    marginBottom: 40,
  },
});

export default QuoteManagement;