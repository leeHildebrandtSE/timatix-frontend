import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Alert,
  Modal,
  FlatList,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { useTheme } from '../../context/ThemeContext';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { SERVICE_TYPES } from '../../utils/constants';
import { validateServiceRequestForm } from '../../utils/validation';
import { serviceRequestsService } from '../../services/serviceRequests';

const CreateServiceRequest = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { vehicleId: preselectedVehicleId } = route.params || {};
  
  const { user } = useAuth();
  const { 
    vehicles, 
    addServiceRequest,
    addNotification,
    isLoading,
    setLoading 
  } = useApp();
  const { theme } = useTheme();
  
  const [formData, setFormData] = useState({
    vehicleId: preselectedVehicleId || '',
    serviceType: '',
    preferredDate: '',
    preferredTime: '',
    urgency: 'NORMAL',
    description: '',
    notes: '',
    location: 'WORKSHOP', // WORKSHOP, MOBILE
    contactPhone: user?.phoneNumber || '',
  });
  
  const [errors, setErrors] = useState({});
  const [showVehicleModal, setShowVehicleModal] = useState(false);
  const [showServiceModal, setShowServiceModal] = useState(false);
  const [showTimeSlots, setShowTimeSlots] = useState(false);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (vehicles.length === 0) {
      Alert.alert(
        'No Vehicles',
        'You need to add a vehicle before creating a service request.',
        [
          { text: 'Cancel', onPress: () => navigation.goBack() },
          { text: 'Add Vehicle', onPress: () => navigation.navigate('Vehicles') },
        ]
      );
    }
  }, [vehicles]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: null,
      }));
    }

    // Load time slots when date changes
    if (field === 'preferredDate' && value) {
      loadAvailableSlots(value);
    }
  };

  const loadAvailableSlots = async (date) => {
    try {
      const slots = await serviceRequestsService.getAvailableSlots(date);
      setAvailableSlots(slots);
    } catch (error) {
      console.error('Error loading time slots:', error);
      // Mock time slots
      const mockSlots = [
        '08:00', '08:30', '09:00', '09:30', '10:00', '10:30',
        '11:00', '11:30', '13:00', '13:30', '14:00', '14:30',
        '15:00', '15:30', '16:00', '16:30', '17:00'
      ];
      setAvailableSlots(mockSlots);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.vehicleId) {
      newErrors.vehicleId = 'Please select a vehicle';
    }
    
    if (!formData.serviceType) {
      newErrors.serviceType = 'Please select a service type';
    }
    
    if (!formData.preferredDate) {
      newErrors.preferredDate = 'Please select a preferred date';
    } else {
      const selectedDate = new Date(formData.preferredDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (selectedDate < today) {
        newErrors.preferredDate = 'Date cannot be in the past';
      }
    }
    
    if (!formData.preferredTime) {
      newErrors.preferredTime = 'Please select a preferred time';
    }
    
    if (!formData.description || formData.description.trim().length < 10) {
      newErrors.description = 'Please provide a detailed description (at least 10 characters)';
    }
    
    if (!formData.contactPhone) {
      newErrors.contactPhone = 'Contact phone number is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    
    try {
      setSubmitting(true);
      
      const requestData = {
        ...formData,
        userId: user.id,
        status: 'PENDING_QUOTE',
        createdAt: new Date().toISOString(),
      };
      
      const newRequest = await serviceRequestsService.createRequest(requestData);
      addServiceRequest(newRequest);
      
      addNotification({
        title: 'Service Request Created',
        message: `Your ${formData.serviceType} request has been submitted successfully.`,
        type: 'success',
      });
      
      Alert.alert(
        'Request Submitted',
        'Your service request has been submitted. You will receive a quote within 24 hours.',
        [
          { text: 'OK', onPress: () => navigation.goBack() }
        ]
      );
    } catch (error) {
      console.error('Error creating service request:', error);
      Alert.alert('Error', 'Failed to create service request. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const getSelectedVehicle = () => {
    return vehicles.find(v => v.id === formData.vehicleId);
  };

  const getUrgencyColor = (urgency) => {
    switch (urgency) {
      case 'URGENT': return theme.colors.error;
      case 'HIGH': return '#FF8C00';
      case 'NORMAL': return theme.colors.primary;
      case 'LOW': return theme.colors.info;
      default: return theme.colors.primary;
    }
  };

  const getMinDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  const getMaxDate = () => {
    const maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + 60); // 60 days from now
    return maxDate.toISOString().split('T')[0];
  };

  const renderVehicleModal = () => (
    <Modal
      visible={showVehicleModal}
      animationType="slide"
      transparent={true}
      onRequestClose={() => setShowVehicleModal(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={[styles.modalContent, { backgroundColor: theme.colors.surface }]}>
          <View style={styles.modalHeader}>
            <Text style={[styles.modalTitle, theme.typography.h6]}>
              Select Vehicle
            </Text>
            <TouchableOpacity onPress={() => setShowVehicleModal(false)}>
              <Text style={[styles.modalClose, { color: theme.colors.primary }]}>Close</Text>
            </TouchableOpacity>
          </View>
          
          <FlatList
            data={vehicles}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[styles.vehicleItem, { borderBottomColor: theme.colors.border }]}
                onPress={() => {
                  handleInputChange('vehicleId', item.id);
                  setShowVehicleModal(false);
                }}
              >
                <Text style={[styles.vehicleText, theme.typography.body1]}>
                  {item.year} {item.make} {item.model}
                </Text>
                <Text style={[styles.vehicleSubtext, theme.typography.caption]}>
                  {item.licensePlate}
                </Text>
              </TouchableOpacity>
            )}
          />
        </View>
      </View>
    </Modal>
  );

  const renderServiceModal = () => (
    <Modal
      visible={showServiceModal}
      animationType="slide"
      transparent={true}
      onRequestClose={() => setShowServiceModal(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={[styles.modalContent, { backgroundColor: theme.colors.surface }]}>
          <View style={styles.modalHeader}>
            <Text style={[styles.modalTitle, theme.typography.h6]}>
              Select Service Type
            </Text>
            <TouchableOpacity onPress={() => setShowServiceModal(false)}>
              <Text style={[styles.modalClose, { color: theme.colors.primary }]}>Close</Text>
            </TouchableOpacity>
          </View>
          
          <FlatList
            data={Object.entries(SERVICE_TYPES)}
            keyExtractor={([key]) => key}
            renderItem={({ item: [key, value] }) => (
              <TouchableOpacity
                style={[styles.serviceItem, { borderBottomColor: theme.colors.border }]}
                onPress={() => {
                  handleInputChange('serviceType', value);
                  setShowServiceModal(false);
                }}
              >
                <Text style={[styles.serviceText, theme.typography.body1]}>
                  {value}
                </Text>
              </TouchableOpacity>
            )}
          />
        </View>
      </View>
    </Modal>
  );

  const renderTimeSlotModal = () => (
    <Modal
      visible={showTimeSlots}
      animationType="slide"
      transparent={true}
      onRequestClose={() => setShowTimeSlots(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={[styles.modalContent, { backgroundColor: theme.colors.surface }]}>
          <View style={styles.modalHeader}>
            <Text style={[styles.modalTitle, theme.typography.h6]}>
              Available Time Slots
            </Text>
            <TouchableOpacity onPress={() => setShowTimeSlots(false)}>
              <Text style={[styles.modalClose, { color: theme.colors.primary }]}>Close</Text>
            </TouchableOpacity>
          </View>
          
          <FlatList
            data={availableSlots}
            keyExtractor={(item) => item}
            numColumns={3}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[styles.timeSlot, { backgroundColor: theme.colors.background }]}
                onPress={() => {
                  handleInputChange('preferredTime', item);
                  setShowTimeSlots(false);
                }}
              >
                <Text style={[styles.timeSlotText, theme.typography.body2]}>
                  {item}
                </Text>
              </TouchableOpacity>
            )}
          />
        </View>
      </View>
    </Modal>
  );

  if (isLoading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <LoadingSpinner message="Loading..." />
      </SafeAreaView>
    );
  }

  const selectedVehicle = getSelectedVehicle();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.title, theme.typography.h3]}>
            Book Service
          </Text>
          <Text style={[styles.subtitle, theme.typography.body2]}>
            Schedule maintenance for your vehicle
          </Text>
        </View>

        {/* Vehicle Selection */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, theme.typography.h6]}>
            Vehicle *
          </Text>
          <TouchableOpacity
            style={[styles.selector, { borderColor: errors.vehicleId ? theme.colors.error : theme.colors.border }]}
            onPress={() => setShowVehicleModal(true)}
          >
            <Text style={[
              styles.selectorText, 
              theme.typography.input,
              { color: selectedVehicle ? theme.colors.text : theme.colors.textLight }
            ]}>
              {selectedVehicle ? 
                `${selectedVehicle.year} ${selectedVehicle.make} ${selectedVehicle.model}` : 
                'Select vehicle'
              }
            </Text>
            <Text style={[styles.chevron, { color: theme.colors.textSecondary }]}>▼</Text>
          </TouchableOpacity>
          {errors.vehicleId && (
            <Text style={[styles.errorText, theme.typography.error]}>
              {errors.vehicleId}
            </Text>
          )}
        </View>

        {/* Service Type Selection */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, theme.typography.h6]}>
            Service Type *
          </Text>
          <TouchableOpacity
            style={[styles.selector, { borderColor: errors.serviceType ? theme.colors.error : theme.colors.border }]}
            onPress={() => setShowServiceModal(true)}
          >
            <Text style={[
              styles.selectorText, 
              theme.typography.input,
              { color: formData.serviceType ? theme.colors.text : theme.colors.textLight }
            ]}>
              {formData.serviceType || 'Select service type'}
            </Text>
            <Text style={[styles.chevron, { color: theme.colors.textSecondary }]}>▼</Text>
          </TouchableOpacity>
          {errors.serviceType && (
            <Text style={[styles.errorText, theme.typography.error]}>
              {errors.serviceType}
            </Text>
          )}
        </View>

        {/* Date & Time */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, theme.typography.h6]}>
            Preferred Date & Time *
          </Text>
          
          <View style={styles.dateTimeRow}>
            <Input
              label="Date"
              value={formData.preferredDate}
              onChangeText={(value) => handleInputChange('preferredDate', value)}
              placeholder="YYYY-MM-DD"
              error={errors.preferredDate}
              style={styles.dateInput}
            />
            
            <TouchableOpacity
              style={[styles.timeSelector, { borderColor: errors.preferredTime ? theme.colors.error : theme.colors.border }]}
              onPress={() => formData.preferredDate ? setShowTimeSlots(true) : Alert.alert('Please select a date first')}
            >
              <Text style={[styles.timeLabel, theme.typography.label]}>Time</Text>
              <Text style={[
                styles.timeSelectorText,
                { color: formData.preferredTime ? theme.colors.text : theme.colors.textLight }
              ]}>
                {formData.preferredTime || 'Select time'}
              </Text>
            </TouchableOpacity>
          </View>
          {errors.preferredTime && (
            <Text style={[styles.errorText, theme.typography.error]}>
              {errors.preferredTime}
            </Text>
          )}
        </View>

        {/* Urgency */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, theme.typography.h6]}>
            Urgency
          </Text>
          <View style={styles.urgencyContainer}>
            {['LOW', 'NORMAL', 'HIGH', 'URGENT'].map((urgency) => (
              <TouchableOpacity
                key={urgency}
                style={[
                  styles.urgencyButton,
                  formData.urgency === urgency && { backgroundColor: getUrgencyColor(urgency) },
                ]}
                onPress={() => handleInputChange('urgency', urgency)}
              >
                <Text
                  style={[
                    styles.urgencyButtonText,
                    formData.urgency === urgency && { color: '#fff' },
                    { color: theme.colors.text },
                  ]}
                >
                  {urgency}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Description */}
        <View style={styles.section}>
          <Input
            label="Problem Description *"
            value={formData.description}
            onChangeText={(value) => handleInputChange('description', value)}
            placeholder="Describe the issue or service needed..."
            multiline
            numberOfLines={4}
            error={errors.description}
            required
          />
        </View>

        {/* Additional Notes */}
        <View style={styles.section}>
          <Input
            label="Additional Notes"
            value={formData.notes}
            onChangeText={(value) => handleInputChange('notes', value)}
            placeholder="Any additional information..."
            multiline
            numberOfLines={3}
          />
        </View>

        {/* Service Location */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, theme.typography.h6]}>
            Service Location
          </Text>
          <View style={styles.locationContainer}>
            <TouchableOpacity
              style={[
                styles.locationButton,
                formData.location === 'WORKSHOP' && { backgroundColor: theme.colors.primary },
              ]}
              onPress={() => handleInputChange('location', 'WORKSHOP')}
            >
              <Text
                style={[
                  styles.locationButtonText,
                  formData.location === 'WORKSHOP' && { color: '#fff' },
                  { color: theme.colors.text },
                ]}
              >
                🏪 Workshop
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.locationButton,
                formData.location === 'MOBILE' && { backgroundColor: theme.colors.primary },
              ]}
              onPress={() => handleInputChange('location', 'MOBILE')}
            >
              <Text
                style={[
                  styles.locationButtonText,
                  formData.location === 'MOBILE' && { color: '#fff' },
                  { color: theme.colors.text },
                ]}
              >
                🚐 Mobile Service
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Contact Phone */}
        <View style={styles.section}>
          <Input
            label="Contact Phone *"
            value={formData.contactPhone}
            onChangeText={(value) => handleInputChange('contactPhone', value)}
            placeholder="Enter contact phone number"
            keyboardType="phone-pad"
            error={errors.contactPhone}
            required
          />
        </View>

        {/* Submit Button */}
        <Button
          title="Submit Service Request"
          onPress={handleSubmit}
          loading={submitting}
          disabled={submitting}
          style={styles.submitButton}
        />
      </ScrollView>

      {renderVehicleModal()}
      {renderServiceModal()}
      {renderTimeSlotModal()}
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
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 24,
  },
  title: {
    marginBottom: 4,
  },
  subtitle: {
    opacity: 0.7,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    marginBottom: 8,
  },
  selector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 16,
    backgroundColor: '#fff',
  },
  selectorText: {
    flex: 1,
  },
  chevron: {
    fontSize: 12,
  },
  dateTimeRow: {
    flexDirection: 'row',
    gap: 12,
  },
  dateInput: {
    flex: 1,
  },
  timeSelector: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#fff',
  },
  timeLabel: {
    marginBottom: 4,
  },
  timeSelectorText: {
    fontSize: 16,
  },
  urgencyContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  urgencyButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 8,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
  },
  urgencyButtonText: {
    fontSize: 12,
    fontWeight: '600',
  },
  locationContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  locationButton: {
    flex: 1,
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
  },
  locationButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  errorText: {
    marginTop: 4,
  },
  submitButton: {
    marginHorizontal: 20,
    marginTop: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%',
    maxHeight: '70%',
    borderRadius: 12,
    padding: 16,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  modalTitle: {
    flex: 1,
  },
  modalClose: {
    fontWeight: '600',
  },
  vehicleItem: {
    paddingVertical: 12,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
  },
  vehicleText: {
    marginBottom: 2,
  },
  vehicleSubtext: {
    opacity: 0.7,
  },
  serviceItem: {
    paddingVertical: 12,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
  },
  serviceText: {
    // Styles from theme
  },
  timeSlot: {
    flex: 1,
    margin: 4,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  timeSlotText: {
    fontWeight: '500',
  },
});

export default CreateServiceRequest;