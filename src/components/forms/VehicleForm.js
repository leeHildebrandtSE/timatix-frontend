// Enhanced VehicleForm with Image Upload
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Image,
  ScrollView,
  Modal,
  FlatList,
} from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import ProfileImagePicker from '../../components/common/ProfileImagePicker';
import { validateRequired, validateVin, validateLicensePlate, validateMileage } from '../../utils/validation';

const VEHICLE_MAKES = [
  'Audi', 'BMW', 'Chevrolet', 'Ford', 'Honda', 'Hyundai', 'Kia', 'Mazda', 
  'Mercedes-Benz', 'Nissan', 'Toyota', 'Volkswagen', 'Volvo', 'Other'
];

const VEHICLE_COLORS = [
  'Black', 'White', 'Silver', 'Gray', 'Red', 'Blue', 'Green', 'Brown', 
  'Orange', 'Yellow', 'Purple', 'Gold', 'Beige', 'Other'
];

const VehicleForm = ({ 
  onSubmit, 
  loading = false, 
  initialData = null, 
  isEditing = false 
}) => {
  const { theme } = useTheme();
  
  const [formData, setFormData] = useState({
    make: '',
    model: '',
    year: '',
    color: '',
    licensePlate: '',
    vin: '',
    mileage: '',
    image: null,
  });

  const [errors, setErrors] = useState({});
  const [showMakeModal, setShowMakeModal] = useState(false);
  const [showColorModal, setShowColorModal] = useState(false);
  const [showImagePicker, setShowImagePicker] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        make: initialData.make || '',
        model: initialData.model || '',
        year: initialData.year?.toString() || '',
        color: initialData.color || '',
        licensePlate: initialData.licensePlate || '',
        vin: initialData.vin || '',
        mileage: initialData.mileage?.toString() || '',
        image: initialData.image || null,
      });
    }
  }, [initialData]);

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
  };

  const handleImageSelected = (imageUri) => {
    setFormData(prev => ({
      ...prev,
      image: imageUri,
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Required fields
    if (!validateRequired(formData.make)) {
      newErrors.make = 'Make is required';
    }
    
    if (!validateRequired(formData.model)) {
      newErrors.model = 'Model is required';
    }
    
    if (!validateRequired(formData.year)) {
      newErrors.year = 'Year is required';
    } else {
      const year = parseInt(formData.year);
      const currentYear = new Date().getFullYear();
      if (year < 1900 || year > currentYear + 1) {
        newErrors.year = `Year must be between 1900 and ${currentYear + 1}`;
      }
    }
    
    if (!validateRequired(formData.color)) {
      newErrors.color = 'Color is required';
    }
    
    if (!validateRequired(formData.licensePlate)) {
      newErrors.licensePlate = 'License plate is required';
    } else if (!validateLicensePlate(formData.licensePlate)) {
      newErrors.licensePlate = 'Please enter a valid license plate';
    }
    
    // Optional but validated fields
    if (formData.vin && !validateVin(formData.vin)) {
      newErrors.vin = 'Please enter a valid 17-character VIN';
    }
    
    if (formData.mileage && !validateMileage(formData.mileage)) {
      newErrors.mileage = 'Please enter a valid mileage';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;
    
    const submitData = {
      ...formData,
      year: parseInt(formData.year),
      mileage: formData.mileage ? parseInt(formData.mileage) : null,
    };
    
    onSubmit(submitData);
  };

  const renderImageSection = () => (
    <View style={[styles.section, { backgroundColor: theme.colors.surface }]}>
      <Text style={[styles.sectionTitle, theme.typography.h6]}>
        Vehicle Photo
      </Text>
      <Text style={[styles.sectionSubtitle, theme.typography.caption]}>
        Add a photo to help identify your vehicle
      </Text>
      
      <TouchableOpacity
        style={[styles.imageContainer, { borderColor: theme.colors.border }]}
        onPress={() => setShowImagePicker(true)}
      >
        {formData.image ? (
          <View style={styles.imageWrapper}>
            <Image source={{ uri: formData.image }} style={styles.vehicleImage} />
            <View style={[styles.imageOverlay, { backgroundColor: 'rgba(0,0,0,0.3)' }]}>
              <Text style={styles.imageOverlayText}>Tap to change</Text>
            </View>
          </View>
        ) : (
          <View style={styles.imagePlaceholder}>
            <Text style={[styles.placeholderIcon, { color: theme.colors.textSecondary }]}>
              📷
            </Text>
            <Text style={[styles.placeholderText, theme.typography.body2, { color: theme.colors.textSecondary }]}>
              Add vehicle photo
            </Text>
            <Text style={[styles.placeholderSubtext, theme.typography.caption, { color: theme.colors.textSecondary }]}>
              Optional
            </Text>
          </View>
        )}
      </TouchableOpacity>
    </View>
  );

  const renderSelectorModal = (title, options, selectedValue, onSelect, visible, onClose) => (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={[styles.modalContent, { backgroundColor: theme.colors.background }]}>
          <View style={styles.modalHeader}>
            <Text style={[styles.modalTitle, theme.typography.h5]}>
              Select {title}
            </Text>
            <TouchableOpacity onPress={onClose}>
              <Text style={[styles.modalClose, { color: theme.colors.primary }]}>
                Cancel
              </Text>
            </TouchableOpacity>
          </View>
          
          <FlatList
            data={options}
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[
                  styles.optionItem,
                  { borderBottomColor: theme.colors.border },
                  selectedValue === item && { backgroundColor: theme.colors.primary + '10' }
                ]}
                onPress={() => {
                  onSelect(item);
                  onClose();
                }}
              >
                <Text
                  style={[
                    styles.optionText,
                    theme.typography.body1,
                    selectedValue === item && { color: theme.colors.primary, fontWeight: '600' }
                  ]}
                >
                  {item}
                </Text>
                {selectedValue === item && (
                  <Text style={[styles.checkmark, { color: theme.colors.primary }]}>
                    ✓
                  </Text>
                )}
              </TouchableOpacity>
            )}
            showsVerticalScrollIndicator={false}
          />
        </View>
      </View>
    </Modal>
  );

  const renderSelector = (label, value, onPress, error, required = false) => (
    <View style={styles.inputContainer}>
      <Text style={[styles.inputLabel, theme.typography.body2]}>
        {label} {required && <Text style={{ color: theme.colors.error }}>*</Text>}
      </Text>
      <TouchableOpacity
        style={[
          styles.selector,
          { borderColor: error ? theme.colors.error : theme.colors.border },
          { backgroundColor: theme.colors.surface }
        ]}
        onPress={onPress}
      >
        <Text
          style={[
            styles.selectorText,
            theme.typography.input,
            { color: value ? theme.colors.text : theme.colors.textLight }
          ]}
        >
          {value || `Select ${label.toLowerCase()}`}
        </Text>
        <Text style={[styles.chevron, { color: theme.colors.textSecondary }]}>▼</Text>
      </TouchableOpacity>
      {error && (
        <Text style={[styles.errorText, theme.typography.error]}>
          {error}
        </Text>
      )}
    </View>
  );

  return (
    <ScrollView 
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      {/* Image Section */}
      {renderImageSection()}

      {/* Basic Information */}
      <View style={[styles.section, { backgroundColor: theme.colors.surface }]}>
        <Text style={[styles.sectionTitle, theme.typography.h6]}>
          Vehicle Information
        </Text>
        
        {/* Make */}
        {renderSelector(
          'Make',
          formData.make,
          () => setShowMakeModal(true),
          errors.make,
          true
        )}

        {/* Model */}
        <Input
          label="Model"
          value={formData.model}
          onChangeText={(value) => handleInputChange('model', value)}
          placeholder="Enter vehicle model"
          error={errors.model}
          required
          containerStyle={styles.inputContainer}
        />

        {/* Year */}
        <Input
          label="Year"
          value={formData.year}
          onChangeText={(value) => handleInputChange('year', value)}
          placeholder="Enter year (e.g., 2020)"
          keyboardType="numeric"
          maxLength={4}
          error={errors.year}
          required
          containerStyle={styles.inputContainer}
        />

        {/* Color */}
        {renderSelector(
          'Color',
          formData.color,
          () => setShowColorModal(true),
          errors.color,
          true
        )}
      </View>

      {/* Registration Details */}
      <View style={[styles.section, { backgroundColor: theme.colors.surface }]}>
        <Text style={[styles.sectionTitle, theme.typography.h6]}>
          Registration Details
        </Text>
        
        <Input
          label="License Plate"
          value={formData.licensePlate}
          onChangeText={(value) => handleInputChange('licensePlate', value.toUpperCase())}
          placeholder="Enter license plate"
          autoCapitalize="characters"
          error={errors.licensePlate}
          required
          containerStyle={styles.inputContainer}
        />

        <Input
          label="VIN (Optional)"
          value={formData.vin}
          onChangeText={(value) => handleInputChange('vin', value.toUpperCase())}
          placeholder="Enter 17-character VIN"
          autoCapitalize="characters"
          maxLength={17}
          error={errors.vin}
          containerStyle={styles.inputContainer}
        />

        <Input
          label="Current Mileage (Optional)"
          value={formData.mileage}
          onChangeText={(value) => handleInputChange('mileage', value)}
          placeholder="Enter current mileage"
          keyboardType="numeric"
          error={errors.mileage}
          containerStyle={styles.inputContainer}
        />
      </View>

      {/* Submit Button */}
      <Button
        title={isEditing ? 'Update Vehicle' : 'Add Vehicle'}
        onPress={handleSubmit}
        loading={loading}
        disabled={loading}
        style={styles.submitButton}
      />

      {/* Modals */}
      {renderSelectorModal(
        'Make',
        VEHICLE_MAKES,
        formData.make,
        (value) => handleInputChange('make', value),
        showMakeModal,
        () => setShowMakeModal(false)
      )}

      {renderSelectorModal(
        'Color',
        VEHICLE_COLORS,
        formData.color,
        (value) => handleInputChange('color', value),
        showColorModal,
        () => setShowColorModal(false)
      )}

      <ProfileImagePicker
        visible={showImagePicker}
        onClose={() => setShowImagePicker(false)}
        onImageSelected={handleImageSelected}
        currentImage={formData.image}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },

  // Sections
  section: {
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  sectionTitle: {
    marginBottom: 4,
    fontWeight: 'bold',
  },
  sectionSubtitle: {
    opacity: 0.7,
    marginBottom: 16,
  },

  // Image Section
  imageContainer: {
    height: 200,
    borderRadius: 12,
    borderWidth: 2,
    borderStyle: 'dashed',
    overflow: 'hidden',
  },
  imageWrapper: {
    flex: 1,
    position: 'relative',
  },
  vehicleImage: {
    width: '100%',
    height: '100%',
  },
  imageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 12,
    alignItems: 'center',
  },
  imageOverlayText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  imagePlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  placeholderText: {
    fontWeight: '600',
    marginBottom: 4,
  },
  placeholderSubtext: {
    opacity: 0.7,
  },

  // Form Inputs
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    marginBottom: 8,
    fontWeight: '600',
  },

  // Selector
  selector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  selectorText: {
    flex: 1,
  },
  chevron: {
    fontSize: 12,
  },
  errorText: {
    marginTop: 4,
  },

  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%',
    maxHeight: '70%',
    borderRadius: 16,
    paddingTop: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  modalTitle: {
    fontWeight: 'bold',
  },
  modalClose: {
    fontSize: 16,
    fontWeight: '600',
  },
  optionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  optionText: {
    flex: 1,
  },
  checkmark: {
    fontSize: 18,
    fontWeight: 'bold',
  },

  // Submit Button
  submitButton: {
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 12,
  },
});

export default VehicleForm;