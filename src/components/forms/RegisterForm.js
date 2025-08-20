import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import Input from '../common/Input';
import Button from '../common/Button';
import { validateRegistrationForm } from '../../utils/validation';

const RegisterForm = ({ onSubmit, loading = false }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
  });
  
  const [errors, setErrors] = useState({});

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

  const handleSubmit = () => {
    const validation = validateRegistrationForm(formData);
    
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    // Remove confirmPassword before submitting
    const { confirmPassword, ...submitData } = formData;
    onSubmit(submitData);
  };

  return (
    <View style={styles.container}>
      <Input
        label="First Name"
        value={formData.firstName}
        onChangeText={(value) => handleInputChange('firstName', value)}
        placeholder="Enter your first name"
        autoCapitalize="words"
        error={errors.firstName}
        required
      />

      <Input
        label="Last Name"
        value={formData.lastName}
        onChangeText={(value) => handleInputChange('lastName', value)}
        placeholder="Enter your last name"
        autoCapitalize="words"
        error={errors.lastName}
        required
      />

      <Input
        label="Email"
        value={formData.email}
        onChangeText={(value) => handleInputChange('email', value)}
        placeholder="Enter your email"
        keyboardType="email-address"
        autoCapitalize="none"
        error={errors.email}
        required
      />

      <Input
        label="Phone Number"
        value={formData.phoneNumber}
        onChangeText={(value) => handleInputChange('phoneNumber', value)}
        placeholder="Enter your phone number"
        keyboardType="phone-pad"
        error={errors.phoneNumber}
      />

      <Input
        label="Password"
        value={formData.password}
        onChangeText={(value) => handleInputChange('password', value)}
        placeholder="Enter your password"
        secureTextEntry
        error={errors.password}
        required
      />

      <Input
        label="Confirm Password"
        value={formData.confirmPassword}
        onChangeText={(value) => handleInputChange('confirmPassword', value)}
        placeholder="Confirm your password"
        secureTextEntry
        error={errors.confirmPassword}
        required
      />

      <Button
        title="Create Account"
        onPress={handleSubmit}
        loading={loading}
        disabled={loading}
        style={styles.submitButton}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  submitButton: {
    marginTop: 8,
  },
});

export default RegisterForm;