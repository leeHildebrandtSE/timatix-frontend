// =============================================================================
// src/screens/auth/RegisterScreen.js - Registration Screen
// =============================================================================

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  ScrollView,
  Alert,
} from 'react-native';

const RegisterScreen = ({ navigation }) => {
  const { register } = useAuth();
  const { theme } = useTheme();
  const globalStyles = useGlobalStyles();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'client',
    phone: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const roles = [
    { id: 'client', label: 'Vehicle Owner', icon: '👤', description: 'Book services for your vehicles' },
    { id: 'mechanic', label: 'Mechanic', icon: '🔧', description: 'Provide automotive services' },
  ];

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.password) newErrors.password = 'Password is required';
    if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      await register(formData);
      Alert.alert('Success', 'Account created successfully! You can now sign in.');
      navigation.navigate('Login');
    } catch (error) {
      Alert.alert('Registration Failed', error.message || 'Please try again.');
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

  return (
    <KeyboardAvoidingView style={globalStyles.authContainer} behavior="padding">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        {/* Logo */}
        <View style={[globalStyles.authLogo, { marginBottom: 20 }]}>
          <View style={{
            width: 80,
            height: 80,
            borderRadius: 40,
            backgroundColor: theme.colors.primary,
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: 16,
          }}>
            <Text style={{ fontSize: 40, color: '#fff' }}>🚗</Text>
          </View>
          <Text style={[globalStyles.authLogoText, { color: theme.colors.primary, fontSize: 28 }]}>
            Join AutoCare
          </Text>
        </View>

        {/* Header */}
        <Text style={[globalStyles.authTitle, { color: theme.colors.text, fontSize: 24 }]}>
          Create Account
        </Text>
        <Text style={[globalStyles.authSubtitle, { color: theme.colors.textSecondary }]}>
          Get started with professional auto care services
        </Text>

        {/* Form */}
        <View style={[globalStyles.authForm, { marginTop: 24 }]}>
          {/* Role Selection */}
          <View style={globalStyles.inputContainer}>
            <Text style={[globalStyles.inputLabel, { color: theme.colors.text }]}>
              I am a...
            </Text>
            <View style={{ flexDirection: 'row', gap: 12, marginTop: 8 }}>
              {roles.map((role) => (
                <TouchableOpacity
                  key={role.id}
                  style={[
                    globalStyles.createServicePriorityOption,
                    formData.role === role.id && globalStyles.createServicePriorityOptionActive,
                    { flex: 1, padding: 16 }
                  ]}
                  onPress={() => updateFormData('role', role.id)}
                >
                  <Text style={{ fontSize: 24, marginBottom: 8 }}>{role.icon}</Text>
                  <Text style={[
                    globalStyles.createServicePriorityOptionText,
                    formData.role === role.id && globalStyles.createServicePriorityOptionTextActive,
                    { fontWeight: 'bold', marginBottom: 4 }
                  ]}>
                    {role.label}
                  </Text>
                  <Text style={[
                    globalStyles.createServicePriorityOptionText,
                    { fontSize: 12, opacity: 0.7 }
                  ]}>
                    {role.description}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Name Input */}
          <View style={globalStyles.inputContainer}>
            <Text style={[globalStyles.inputLabel, { color: theme.colors.text }]}>
              Full Name <Text style={globalStyles.inputRequired}>*</Text>
            </Text>
            <View style={[
              globalStyles.inputFieldContainer,
              errors.name && globalStyles.inputFieldError
            ]}>
              <View style={globalStyles.inputLeftIconContainer}>
                <Text style={{ fontSize: 20 }}>👤</Text>
              </View>
              <TextInput
                style={[globalStyles.inputField, { color: theme.colors.text }]}
                value={formData.name}
                onChangeText={(text) => updateFormData('name', text)}
                placeholder="Enter your full name"
                placeholderTextColor={theme.colors.placeholder}
                autoCapitalize="words"
              />
            </View>
            {errors.name && (
              <Text style={globalStyles.inputErrorText}>{errors.name}</Text>
            )}
          </View>

          {/* Email Input */}
          <View style={globalStyles.inputContainer}>
            <Text style={[globalStyles.inputLabel, { color: theme.colors.text }]}>
              Email Address <Text style={globalStyles.inputRequired}>*</Text>
            </Text>
            <View style={[
              globalStyles.inputFieldContainer,
              errors.email && globalStyles.inputFieldError
            ]}>
              <View style={globalStyles.inputLeftIconContainer}>
                <Text style={{ fontSize: 20 }}>📧</Text>
              </View>
              <TextInput
                style={[globalStyles.inputField, { color: theme.colors.text }]}
                value={formData.email}
                onChangeText={(text) => updateFormData('email', text)}
                placeholder="Enter your email"
                placeholderTextColor={theme.colors.placeholder}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>
            {errors.email && (
              <Text style={globalStyles.inputErrorText}>{errors.email}</Text>
            )}
          </View>

          {/* Phone Input */}
          <View style={globalStyles.inputContainer}>
            <Text style={[globalStyles.inputLabel, { color: theme.colors.text }]}>
              Phone Number <Text style={globalStyles.inputRequired}>*</Text>
            </Text>
            <View style={[
              globalStyles.inputFieldContainer,
              errors.phone && globalStyles.inputFieldError
            ]}>
              <View style={globalStyles.inputLeftIconContainer}>
                <Text style={{ fontSize: 20 }}>📱</Text>
              </View>
              <TextInput
                style={[globalStyles.inputField, { color: theme.colors.text }]}
                value={formData.phone}
                onChangeText={(text) => updateFormData('phone', text)}
                placeholder="Enter your phone number"
                placeholderTextColor={theme.colors.placeholder}
                keyboardType="phone-pad"
              />
            </View>
            {errors.phone && (
              <Text style={globalStyles.inputErrorText}>{errors.phone}</Text>
            )}
          </View>

          {/* Password Input */}
          <View style={globalStyles.inputContainer}>
            <Text style={[globalStyles.inputLabel, { color: theme.colors.text }]}>
              Password <Text style={globalStyles.inputRequired}>*</Text>
            </Text>
            <View style={[
              globalStyles.inputFieldContainer,
              errors.password && globalStyles.inputFieldError
            ]}>
              <View style={globalStyles.inputLeftIconContainer}>
                <Text style={{ fontSize: 20 }}>🔒</Text>
              </View>
              <TextInput
                style={[globalStyles.inputField, { color: theme.colors.text }]}
                value={formData.password}
                onChangeText={(text) => updateFormData('password', text)}
                placeholder="Create a password"
                placeholderTextColor={theme.colors.placeholder}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity
                style={globalStyles.inputRightIconContainer}
                onPress={() => setShowPassword(!showPassword)}
              >
                <Text style={{ fontSize: 20 }}>{showPassword ? '🙈' : '👁️'}</Text>
              </TouchableOpacity>
            </View>
            {errors.password && (
              <Text style={globalStyles.inputErrorText}>{errors.password}</Text>
            )}
          </View>

          {/* Confirm Password Input */}
          <View style={globalStyles.inputContainer}>
            <Text style={[globalStyles.inputLabel, { color: theme.colors.text }]}>
              Confirm Password <Text style={globalStyles.inputRequired}>*</Text>
            </Text>
            <View style={[
              globalStyles.inputFieldContainer,
              errors.confirmPassword && globalStyles.inputFieldError
            ]}>
              <View style={globalStyles.inputLeftIconContainer}>
                <Text style={{ fontSize: 20 }}>🔒</Text>
              </View>
              <TextInput
                style={[globalStyles.inputField, { color: theme.colors.text }]}
                value={formData.confirmPassword}
                onChangeText={(text) => updateFormData('confirmPassword', text)}
                placeholder="Confirm your password"
                placeholderTextColor={theme.colors.placeholder}
                secureTextEntry={!showConfirmPassword}
              />
              <TouchableOpacity
                style={globalStyles.inputRightIconContainer}
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                <Text style={{ fontSize: 20 }}>{showConfirmPassword ? '🙈' : '👁️'}</Text>
              </TouchableOpacity>
            </View>
            {errors.confirmPassword && (
              <Text style={globalStyles.inputErrorText}>{errors.confirmPassword}</Text>
            )}
          </View>
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          style={[
            globalStyles.buttonBase,
            globalStyles.authSubmitButton,
            loading && globalStyles.buttonDisabled,
            { marginTop: 24 }
          ]}
          onPress={handleRegister}
          disabled={loading}
        >
          <Text style={globalStyles.buttonText}>
            {loading ? 'Creating Account...' : 'Create Account'}
          </Text>
        </TouchableOpacity>

        {/* Footer */}
        <View style={[globalStyles.authFooter, { marginTop: 24, marginBottom: 40 }]}>
          <Text style={[globalStyles.authFooterText, { color: theme.colors.textSecondary }]}>
            Already have an account?
          </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={[globalStyles.authFooterLink, { color: theme.colors.primary }]}>
              Sign In
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};