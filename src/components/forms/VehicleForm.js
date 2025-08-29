import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, FlatList, StyleSheet } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import Input from '../common/Input';
import Button from '../common/Button';
import { validateVehicleForm } from '../../utils/validation';
// import { VEHICLE_MAKES } from '../../utils/constants';


const VehicleForm = ({ 
  onSubmit, 
  loading = false, 
  initialData = null,
  isEditing = false,
  vehicleMakes = []  // new prop
}) => {
  const { theme } = useTheme();
  
  const [vehicleMakes, setVehicleMakes] = useState([]);
  
  const [formData, setFormData] = useState({
    make: initialData?.make || '',
    model: initialData?.model || '',
    year: initialData?.year ? initialData.year.toString() : '',
    color: initialData?.color || '',
    licensePlate: initialData?.licensePlate || '',
    vin: initialData?.vin || '',
    mileage: initialData?.mileage ? initialData.mileage.toString() : '',
    ...initialData,
  });
  
  const [errors, setErrors] = useState({});
  const [showMakeModal, setShowMakeModal] = useState(false);

  // Fetch vehicle makes from backend
  useEffect(() => {
    const fetchVehicleMakes = async () => {
      try {
        const response = await axios.get('http://<YOUR_BACKEND>/vehicle-makes'); // replace with your backend URL
        setVehicleMakes(response.data.map(make => ({ id: make, name: make })));
      } catch (err) {
        console.error('Failed to fetch vehicle makes', err);
      }
    };

    fetchVehicleMakes();
  }, []);

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

  const handleMakeSelect = (makeObj) => {
    handleInputChange('make', makeObj.name); // store name in formData.make
    setShowMakeModal(false);
  };


  const handleSubmit = () => {
    // Convert year and mileage to numbers
    const submitData = {
      ...formData,
      year: parseInt(formData.year, 10),
      mileage: formData.mileage ? parseInt(formData.mileage, 10) : null,
    };

    const validation = validateVehicleForm(submitData);
    
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    onSubmit(submitData);
  };

  const renderMakeItem = ({ item }) => (
    <TouchableOpacity
      style={[styles.makeItem, { borderBottomColor: theme.colors.border }]}
      onPress={() => handleMakeSelect(item)}
    >
      <Text style={[styles.makeText, theme.typography.body1]}>
        {item.name}
      </Text>
    </TouchableOpacity>
  );


  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.makeSelector, { borderColor: theme.colors.border }]}
        onPress={() => setShowMakeModal(true)}
      >
        <Text style={[styles.makeLabel, theme.typography.label]}>
          Make {errors.make && <Text style={styles.required}>*</Text>}
        </Text>
        <Text style={[
          styles.makeValue, 
          theme.typography.input,
          { color: formData.make ? theme.colors.text : theme.colors.textLight }
        ]}>
          {formData.make || 'Select vehicle make'}
        </Text>
        <Text style={[styles.chevron, { color: theme.colors.textSecondary }]}>
          ▼
        </Text>
      </TouchableOpacity>
      {errors.make && (
        <Text style={[styles.errorText, theme.typography.error]}>
          {errors.make}
        </Text>
      )}

      <Input
        label="Model"
        value={formData.model}
        onChangeText={(value) => handleInputChange('model', value)}
        placeholder="Enter vehicle model"
        autoCapitalize="words"
        error={errors.model}
        required
      />

      <Input
        label="Year"
        value={formData.year}
        onChangeText={(value) => handleInputChange('year', value)}
        placeholder="Enter year (e.g., 2020)"
        keyboardType="numeric"
        error={errors.year}
        required
      />

      <Input
        label="Color"
        value={formData.color}
        onChangeText={(value) => handleInputChange('color', value)}
        placeholder="Enter vehicle color"
        autoCapitalize="words"
        error={errors.color}
      />

      <Input
        label="License Plate"
        value={formData.licensePlate}
        onChangeText={(value) => handleInputChange('licensePlate', value)}
        placeholder="Enter license plate"
        autoCapitalize="characters"
        error={errors.licensePlate}
      />

      <Input
        label="VIN (Optional)"
        value={formData.vin}
        onChangeText={(value) => handleInputChange('vin', value)}
        placeholder="Enter 17-character VIN"
        autoCapitalize="characters"
        error={errors.vin}
      />

      <Input
        label="Mileage (km)"
        value={formData.mileage}
        onChangeText={(value) => handleInputChange('mileage', value)}
        placeholder="Enter current mileage"
        keyboardType="numeric"
        error={errors.mileage}
      />

      <Button
        title={isEditing ? 'Update Vehicle' : 'Add Vehicle'}
        onPress={handleSubmit}
        loading={loading}
        disabled={loading}
        style={styles.submitButton}
      />

      <Modal
        visible={showMakeModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowMakeModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: theme.colors.surface }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, theme.typography.h6]}>
                Select Vehicle Make
              </Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setShowMakeModal(false)}
              >
                <Text style={[styles.closeText, { color: theme.colors.primary }]}>
                  Close
                </Text>
              </TouchableOpacity>
            </View>
            
            <FlatList
              data={vehicleMakes}
              renderItem={renderMakeItem}
              keyExtractor={(item) => item.id.toString()}
              style={styles.makeList}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  makeSelector: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    marginBottom: 16,
    flexDirection: 'column',
  },
  makeLabel: {
    marginBottom: 4,
  },
  makeValue: {
    flex: 1,
  },
  chevron: {
    position: 'absolute',
    right: 12,
    top: '50%',
    marginTop: -6,
  },
  required: {
    color: '#FF3B30',
  },
  errorText: {
    marginTop: -12,
    marginBottom: 16,
  },
  submitButton: {
    marginTop: 8,
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
  closeButton: {
    padding: 4,
  },
  closeText: {
    fontWeight: '600',
  },
  makeList: {
    flex: 1,
  },
  makeItem: {
    paddingVertical: 12,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
  },
  makeText: {
    // Styles from theme
  },
});

export default VehicleForm;