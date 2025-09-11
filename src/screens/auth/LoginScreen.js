// =============================================================================
// src/screens/auth/LoginScreen.js - Login Screen
// =============================================================================

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Alert,
} from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { useTheme, useGlobalStyles } from '../../context/ThemeContext';

const LoginScreen = ({ navigation }) => {
  const { login } = useAuth();
  const { theme } = useTheme();
  const globalStyles = useGlobalStyles();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleLogin = async () => {
    if (!email || !password) {
      setErrors({
        email: !email ? 'Email is required' : '',
        password: !password ? 'Password is required' : '',
      });
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      await login(email, password);
    } catch (error) {
      Alert.alert('Login Failed', error.message || 'Please check your credentials and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={globalStyles.authContainer} behavior="padding">
      {/* Logo Section */}
      <View style={globalStyles.authLogo}>
        <View style={{
          width: 100,
          height: 100,
          borderRadius: 50,
          backgroundColor: theme.colors.primary,
          justifyContent: 'center',
          alignItems: 'center',
          marginBottom: 20,
        }}>
          <Text style={{ fontSize: 48, color: '#fff' }}>🚗</Text>
        </View>
        <Text style={[globalStyles.authLogoText, { color: theme.colors.primary }]}>
          AutoCare
        </Text>
      </View>

      {/* Header */}
      <Text style={[globalStyles.authTitle, { color: theme.colors.text }]}>
        Welcome Back
      </Text>
      <Text style={[globalStyles.authSubtitle, { color: theme.colors.textSecondary }]}>
        Sign in to access your account and manage your vehicles
      </Text>

      {/* Form */}
      <View style={globalStyles.authForm}>
        {/* Email Input */}
        <View style={globalStyles.inputContainer}>
          <Text style={[globalStyles.inputLabel, { color: theme.colors.text }]}>
            Email Address
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
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                if (errors.email) setErrors({ ...errors, email: '' });
              }}
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

        {/* Password Input */}
        <View style={globalStyles.inputContainer}>
          <Text style={[globalStyles.inputLabel, { color: theme.colors.text }]}>
            Password
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
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                if (errors.password) setErrors({ ...errors, password: '' });
              }}
              placeholder="Enter your password"
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

        {/* Forgot Password */}
        <TouchableOpacity
          style={{ alignSelf: 'flex-end', marginTop: -8 }}
          onPress={() => navigation.navigate('ForgotPassword')}
        >
          <Text style={[globalStyles.authFooterLink, { color: theme.colors.primary }]}>
            Forgot Password?
          </Text>
        </TouchableOpacity>
      </View>

      {/* Submit Button */}
      <TouchableOpacity
        style={[
          globalStyles.buttonBase,
          globalStyles.authSubmitButton,
          loading && globalStyles.buttonDisabled
        ]}
        onPress={handleLogin}
        disabled={loading}
      >
        <Text style={globalStyles.buttonText}>
          {loading ? 'Signing In...' : 'Sign In'}
        </Text>
      </TouchableOpacity>

      {/* Divider */}
      <View style={globalStyles.authDivider}>
        <View style={[globalStyles.authDividerLine, { backgroundColor: theme.colors.border }]} />
        <Text style={[globalStyles.authDividerText, { color: theme.colors.textSecondary }]}>
          or
        </Text>
        <View style={[globalStyles.authDividerLine, { backgroundColor: theme.colors.border }]} />
      </View>

      {/* Demo Accounts */}
      <View style={{ gap: 12, marginVertical: 16 }}>
        <TouchableOpacity
          style={[
            globalStyles.buttonBase,
            globalStyles.buttonOutline,
            { backgroundColor: 'rgba(52, 199, 89, 0.1)', borderColor: '#34C759' }
          ]}
          onPress={() => {
            setEmail('client@demo.com');
            setPassword('demo123');
          }}
        >
          <Text style={[globalStyles.buttonText, { color: '#34C759' }]}>
            👤 Demo Client Account
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            globalStyles.buttonBase,
            globalStyles.buttonOutline,
            { backgroundColor: 'rgba(255, 149, 0, 0.1)', borderColor: '#FF9500' }
          ]}
          onPress={() => {
            setEmail('mechanic@demo.com');
            setPassword('demo123');
          }}
        >
          <Text style={[globalStyles.buttonText, { color: '#FF9500' }]}>
            🔧 Demo Mechanic Account
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            globalStyles.buttonBase,
            globalStyles.buttonOutline,
            { backgroundColor: 'rgba(255, 59, 48, 0.1)', borderColor: '#FF3B30' }
          ]}
          onPress={() => {
            setEmail('admin@demo.com');
            setPassword('demo123');
          }}
        >
          <Text style={[globalStyles.buttonText, { color: '#FF3B30' }]}>
            👑 Demo Admin Account
          </Text>
        </TouchableOpacity>
      </View>

      {/* Footer */}
      <View style={globalStyles.authFooter}>
        <Text style={[globalStyles.authFooterText, { color: theme.colors.textSecondary }]}>
          Don't have an account?
        </Text>
        <TouchableOpacity onPress={() => navigation.navigate('Register')}>
          <Text style={[globalStyles.authFooterLink, { color: theme.colors.primary }]}>
            Sign Up
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};