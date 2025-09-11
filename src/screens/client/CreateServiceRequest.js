// =============================================================================
// REFACTORED FORM AND DETAIL SCREENS WITH GLOBAL STYLES
// =============================================================================

// src/screens/client/CreateServiceRequest.js - Create Service Request Form
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
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { useTheme, useGlobalStyles } from '../../context/ThemeContext';

const CreateServiceRequest = ({ route, navigation }) => {
  const { vehicleId } = route?.params || {};
  const { user } = useAuth();
  const { vehicles, createServiceRequest, addNotification } = useApp();
  const { theme } = useTheme();
  const globalStyles = useGlobalStyles();

  const [formData, setFormData] = useState({
    vehicleId: vehicleId || '',
    serviceType: '',
    priority: 'normal',
    description: '',
    preferredDate: '',
    contactMethod: 'phone',
    specialInstructions: '',
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const serviceTypes = [
    { id: 'oil-change', label: 'Oil Change', icon: '🛢️' },
    { id: 'brake-service', label: 'Brake Service', icon: '🛑' },
    { id: 'tire-service', label: 'Tire Service', icon: '⚙️' },
    { id: 'engine-diagnostic', label: 'Engine Diagnostic', icon: '🔍' },
    { id: 'transmission', label: 'Transmission Service', icon: '⚙️' },
    { id: 'electrical', label: 'Electrical System', icon: '⚡' },
    { id: 'air-conditioning', label: 'A/C Service', icon: '❄️' },
    { id: 'general-maintenance', label: 'General Maintenance', icon: '🔧' },
  ];

  const priorities = [
    { id: 'low', label: 'Low', description: 'Can wait a few weeks', color: '#34C759' },
    { id: 'normal', label: 'Normal', description: 'Within next week', color: '#007AFF' },
    { id: 'high', label: 'High', description: 'Within 2-3 days', color: '#FF9500' },
    { id: 'urgent', label: 'Urgent', description: 'ASAP - safety concern', color: '#FF3B30' },
  ];

  const validateForm = () => {
    const newErrors = {};

    if (!formData.vehicleId) newErrors.vehicleId = 'Please select a vehicle';
    if (!formData.serviceType) newErrors.serviceType = 'Please select a service type';
    if (!formData.description.trim()) newErrors.description = 'Please describe the issue';
    if (!formData.preferredDate) newErrors.preferredDate = 'Please select a preferred date';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      await createServiceRequest({
        ...formData,
        clientId: user.id,
        status: 'pending',
        createdAt: new Date().toISOString(),
      });
      
      addNotification('Service request created successfully!');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'Failed to create service request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const updateFormData = (field, value) => {
    setFormData({ ...formData, [field]: value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' });
    }
  };

  const selectedVehicle = vehicles?.find(v => v.id === formData.vehicleId);
  const selectedServiceType = serviceTypes.find(s => s.id === formData.serviceType);

  return (
    <KeyboardAvoidingView style={globalStyles.formContainer} behavior="padding">
      {/* Awesome Header */}
      <View style={[
        globalStyles.dashboardGradientHeader,
        {
          background: 'linear-gradient(135deg, #FF6B6B 0%, #FF8E53 100%)',
          backgroundColor: '#FF6B6B',
          paddingTop: 60,
          paddingBottom: 30,
        }
      ]}>
        <View style={globalStyles.dashboardHeaderContent}>
          <View style={globalStyles.dashboardGreeting}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
              <Text style={{ fontSize: 32, marginRight: 12 }}>🔧</Text>
              <Text style={[globalStyles.dashboardGreetingText, { fontSize: 26 }]}>
                Book Service
              </Text>
            </View>
            <Text style={globalStyles.dashboardGreetingSubtext}>
              Schedule professional maintenance for your vehicle
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
        {/* Vehicle Selection */}
        <View style={globalStyles.formSection}>
          <Text style={[globalStyles.formSectionTitle, { color: theme.colors.text }]}>
            Select Vehicle
          </Text>
          <Text style={[globalStyles.formSectionSubtitle, { color: theme.colors.textSecondary }]}>
            Choose which vehicle needs service
          </Text>

          <TouchableOpacity
            style={[
              globalStyles.createServiceVehicleSelector,
              { borderColor: errors.vehicleId ? theme.colors.error : theme.colors.border }
            ]}
            onPress={() => {
              // Show vehicle selection modal
              navigation.navigate('VehicleSelector', {
                onSelect: (vehicle) => updateFormData('vehicleId', vehicle.id)
              });
            }}
          >
            <Text style={[
              globalStyles.createServiceVehicleSelectorText,
              !selectedVehicle && globalStyles.createServiceVehicleSelectorPlaceholder,
              { color: selectedVehicle ? theme.colors.text : theme.colors.placeholder }
            ]}>
              {selectedVehicle 
                ? `${selectedVehicle.year} ${selectedVehicle.make} ${selectedVehicle.model}` 
                : 'Select a vehicle'
              }
            </Text>
            <Text style={[globalStyles.createServiceVehicleSelectorChevron, { color: theme.colors.textSecondary }]}>
              ›
            </Text>
          </TouchableOpacity>
          {errors.vehicleId && (
            <Text style={globalStyles.inputErrorText}>{errors.vehicleId}</Text>
          )}
        </View>

        {/* Service Type Selection */}
        <View style={globalStyles.formSection}>
          <Text style={[globalStyles.formSectionTitle, { color: theme.colors.text }]}>
            Service Type
          </Text>
          <Text style={[globalStyles.formSectionSubtitle, { color: theme.colors.textSecondary }]}>
            What type of service do you need?
          </Text>

          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginTop: 12 }}>
            {serviceTypes.map((service) => (
              <TouchableOpacity
                key={service.id}
                style={[
                  globalStyles.filterChipBase,
                  globalStyles.filterChipMedium,
                  {
                    minWidth: '45%',
                    paddingVertical: 16,
                    paddingHorizontal: 12,
                  },
                  formData.serviceType === service.id
                    ? { backgroundColor: theme.colors.primary + '20', borderColor: theme.colors.primary }
                    : { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }
                ]}
                onPress={() => updateFormData('serviceType', service.id)}
              >
                <Text style={{ fontSize: 20, marginBottom: 4 }}>{service.icon}</Text>
                <Text style={[
                  globalStyles.filterChipText,
                  {
                    color: formData.serviceType === service.id ? theme.colors.primary : theme.colors.text,
                    fontWeight: formData.serviceType === service.id ? '600' : '500',
                    textAlign: 'center',
                  }
                ]}>
                  {service.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          {errors.serviceType && (
            <Text style={globalStyles.inputErrorText}>{errors.serviceType}</Text>
          )}
        </View>

        {/* Priority Selection */}
        <View style={globalStyles.formSection}>
          <Text style={[globalStyles.formSectionTitle, { color: theme.colors.text }]}>
            Priority Level
          </Text>
          <Text style={[globalStyles.formSectionSubtitle, { color: theme.colors.textSecondary }]}>
            How urgent is this service?
          </Text>

          <View style={globalStyles.createServicePriorityContainer}>
            {priorities.map((priority) => (
              <TouchableOpacity
                key={priority.id}
                style={[
                  globalStyles.createServicePriorityOption,
                  {
                    marginBottom: 12,
                    padding: 16,
                    borderColor: formData.priority === priority.id ? priority.color : theme.colors.border,
                    backgroundColor: formData.priority === priority.id ? priority.color + '15' : theme.colors.surface,
                  }
                ]}
                onPress={() => updateFormData('priority', priority.id)}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                  <View>
                    <Text style={[
                      globalStyles.createServicePriorityOptionText,
                      {
                        color: formData.priority === priority.id ? priority.color : theme.colors.text,
                        fontWeight: '600',
                        marginBottom: 4,
                      }
                    ]}>
                      {priority.label}
                    </Text>
                    <Text style={[
                      globalStyles.createServicePriorityOptionText,
                      {
                        color: theme.colors.textSecondary,
                        fontSize: 12,
                      }
                    ]}>
                      {priority.description}
                    </Text>
                  </View>
                  {formData.priority === priority.id && (
                    <View style={{
                      width: 20,
                      height: 20,
                      borderRadius: 10,
                      backgroundColor: priority.color,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                      <Text style={{ color: '#fff', fontSize: 12, fontWeight: 'bold' }}>✓</Text>
                    </View>
                  )}
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Description */}
        <View style={globalStyles.formSection}>
          <Text style={[globalStyles.formSectionTitle, { color: theme.colors.text }]}>
            Problem Description
          </Text>
          <Text style={[globalStyles.formSectionSubtitle, { color: theme.colors.textSecondary }]}>
            Describe the issue or service needed in detail
          </Text>

          <View style={[
            globalStyles.inputFieldContainer,
            { minHeight: 120, alignItems: 'flex-start' },
            errors.description && globalStyles.inputFieldError
          ]}>
            <TextInput
              style={[
                globalStyles.inputField,
                globalStyles.inputFieldMultiline,
                { color: theme.colors.text, minHeight: 100 }
              ]}
              value={formData.description}
              onChangeText={(text) => updateFormData('description', text)}
              placeholder="Describe the problem, symptoms, or service needed..."
              placeholderTextColor={theme.colors.placeholder}
              multiline
              numberOfLines={5}
              textAlignVertical="top"
            />
          </View>
          {errors.description && (
            <Text style={globalStyles.inputErrorText}>{errors.description}</Text>
          )}
        </View>

        {/* Preferred Date */}
        <View style={globalStyles.formSection}>
          <Text style={[globalStyles.formSectionTitle, { color: theme.colors.text }]}>
            Preferred Date
          </Text>
          <Text style={[globalStyles.formSectionSubtitle, { color: theme.colors.textSecondary }]}>
            When would you like this service to be performed?
          </Text>

          <TouchableOpacity
            style={[
              globalStyles.createServiceVehicleSelector,
              { borderColor: errors.preferredDate ? theme.colors.error : theme.colors.border }
            ]}
            onPress={() => {
              // Show date picker
              // For demo, just set a date
              updateFormData('preferredDate', '2024-02-15');
            }}
          >
            <Text style={[
              globalStyles.createServiceVehicleSelectorText,
              !formData.preferredDate && globalStyles.createServiceVehicleSelectorPlaceholder,
              { color: formData.preferredDate ? theme.colors.text : theme.colors.placeholder }
            ]}>
              {formData.preferredDate || 'Select preferred date'}
            </Text>
            <Text style={[globalStyles.createServiceVehicleSelectorChevron, { color: theme.colors.textSecondary }]}>
              📅
            </Text>
          </TouchableOpacity>
          {errors.preferredDate && (
            <Text style={globalStyles.inputErrorText}>{errors.preferredDate}</Text>
          )}
        </View>

        {/* Special Instructions */}
        <View style={globalStyles.formSection}>
          <Text style={[globalStyles.formSectionTitle, { color: theme.colors.text }]}>
            Special Instructions (Optional)
          </Text>
          <Text style={[globalStyles.formSectionSubtitle, { color: theme.colors.textSecondary }]}>
            Any additional notes or special requirements
          </Text>

          <View style={[globalStyles.inputFieldContainer, { minHeight: 80, alignItems: 'flex-start' }]}>
            <TextInput
              style={[
                globalStyles.inputField,
                globalStyles.inputFieldMultiline,
                { color: theme.colors.text, minHeight: 60 }
              ]}
              value={formData.specialInstructions}
              onChangeText={(text) => updateFormData('specialInstructions', text)}
              placeholder="Any special instructions, pickup/delivery requests, etc."
              placeholderTextColor={theme.colors.placeholder}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
            />
          </View>
        </View>

        {/* Summary Card */}
        {formData.vehicleId && formData.serviceType && (
          <View style={[
            globalStyles.card,
            { 
              backgroundColor: theme.colors.primary + '10', 
              borderColor: theme.colors.primary,
              marginHorizontal: 20,
              marginBottom: 20,
            }
          ]}>
            <Text style={[globalStyles.cardTitle, { color: theme.colors.primary }]}>
              📋 Service Summary
            </Text>
            <View style={{ marginTop: 12, gap: 8 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={[theme.typography.body2, { color: theme.colors.textSecondary }]}>
                  Vehicle:
                </Text>
                <Text style={[theme.typography.body2, { color: theme.colors.text, fontWeight: '500' }]}>
                  {selectedVehicle?.year} {selectedVehicle?.make} {selectedVehicle?.model}
                </Text>
              </View>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={[theme.typography.body2, { color: theme.colors.textSecondary }]}>
                  Service:
                </Text>
                <Text style={[theme.typography.body2, { color: theme.colors.text, fontWeight: '500' }]}>
                  {selectedServiceType?.label}
                </Text>
              </View>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={[theme.typography.body2, { color: theme.colors.textSecondary }]}>
                  Priority:
                </Text>
                <View style={{
                  backgroundColor: priorities.find(p => p.id === formData.priority)?.color + '20',
                  paddingHorizontal: 8,
                  paddingVertical: 2,
                  borderRadius: 12,
                }}>
                  <Text style={[
                    theme.typography.body2,
                    { 
                      color: priorities.find(p => p.id === formData.priority)?.color,
                      fontWeight: '600',
                      fontSize: 11,
                    }
                  ]}>
                    {priorities.find(p => p.id === formData.priority)?.label.toUpperCase()}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Submit Button */}
      <View style={{ padding: 20, paddingTop: 0 }}>
        <TouchableOpacity
          style={[
            globalStyles.buttonBase,
            globalStyles.createServiceSubmitButton,
            loading && globalStyles.buttonDisabled,
            { marginTop: 0 }
          ]}
          onPress={handleSubmit}
          disabled={loading}
        >
          <Text style={globalStyles.buttonText}>
            {loading ? 'Creating Request...' : 'Submit Service Request'}
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};