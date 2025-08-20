import React, { useState } from 'react';
import { View, Text, Alert, StyleSheet } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import Input from '../common/Input';
import Button from '../common/Button';
import { validateLoginForm } from '../../utils/validation';
import { DEMO_CREDENTIALS } from '../../utils/constants';

const LoginForm = ({ onSubmit, loading = false }) => {
  const { theme } = useTheme();
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
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
    const validation = validateLoginForm(formData);
    
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    onSubmit(formData);
  };

  const fillDemoCredentials = (role) => {
    const credentials = DEMO_CREDENTIALS[role];
    setFormData({
      email: credentials.email,
      password: credentials.password,
    });
    setErrors({});
  };

  const showDemoCredentials = () => {
    Alert.alert(
      'Demo Credentials',
      'Choose a role to fill credentials:',
      [
        {
          text: 'Client',
          onPress: () => fillDemoCredentials('CLIENT'),
        },
        {
          text: 'Mechanic',
          onPress: () => fillDemoCredentials('MECHANIC'),
        },
        {
          text: 'Admin',
          onPress: () => fillDemoCredentials('ADMIN'),
        },
        {
          text: 'Cancel',
          style: 'cancel',
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.form}>
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
          label="Password"
          value={formData.password}
          onChangeText={(value) => handleInputChange('password', value)}
          placeholder="Enter your password"
          secureTextEntry
          error={errors.password}
          required
        />

        <Button
          title="Sign In"
          onPress={handleSubmit}
          loading={loading}
          disabled={loading}
          style={styles.submitButton}
        />

        <Button
          title="Use Demo Credentials"
          onPress={showDemoCredentials}
          variant="outline"
          disabled={loading}
          style={styles.demoButton}
        />
      </View>

      <View style={styles.demoInfo}>
        <Text style={[styles.demoTitle, theme.typography.labelSmall]}>
          Demo Accounts:
        </Text>
        <Text style={[styles.demoText, theme.typography.caption]}>
          • Client: {DEMO_CREDENTIALS.CLIENT.email}
        </Text>
        <Text style={[styles.demoText, theme.typography.caption]}>
          • Mechanic: {DEMO_CREDENTIALS.MECHANIC.email}
        </Text>
        <Text style={[styles.demoText, theme.typography.caption]}>
          • Admin: {DEMO_CREDENTIALS.ADMIN.email}
        </Text>
        <Text style={[styles.demoNote, theme.typography.caption]}>
          Password for all: respective role + 123
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  form: {
    flex: 1,
  },
  submitButton: {
    marginTop: 8,
    marginBottom: 16,
  },
  demoButton: {
    marginBottom: 24,
  },
  demoInfo: {
    padding: 16,
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E9ECEF',
  },
  demoTitle: {
    marginBottom: 8,
    fontWeight: '600',
  },
  demoText: {
    marginBottom: 2,
    opacity: 0.8,
  },
  demoNote: {
    marginTop: 8,
    fontStyle: 'italic',
    opacity: 0.6,
  },
});

export default LoginForm;