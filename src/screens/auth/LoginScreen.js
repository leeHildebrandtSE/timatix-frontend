import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import LoginForm from '../../components/forms/LoginForm';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Button from '../../components/common/Button';
import { SUCCESS_MESSAGES } from '../../utils/constants';

const LoginScreen = ({ navigation }) => {
  const { login, isLoading, error, clearError } = useAuth();
  const { theme } = useTheme();
  
  const [showLoading, setShowLoading] = useState(false);

  useEffect(() => {
    // Clear any previous errors when component mounts
    clearError();
  }, [clearError]);

  useEffect(() => {
    // Show error alert if there's an error
    if (error) {
      Alert.alert('Login Error', error, [
        { text: 'OK', onPress: clearError }
      ]);
    }
  }, [error, clearError]);

  const handleLogin = async (formData) => {
    try {
      setShowLoading(true);
      await login(formData);
      
      // Show success message
      Alert.alert('Success', SUCCESS_MESSAGES.LOGIN_SUCCESS);
    } catch (error) {
      console.error('Login failed:', error);
      // Error will be handled by the useEffect above
    } finally {
      setShowLoading(false);
    }
  };

  const handleNavigateToRegister = () => {
    navigation.navigate('Register');
  };

  const handleForgotPassword = () => {
    Alert.alert(
      'Forgot Password',
      'This feature will be available soon. For demo purposes, please use the provided demo credentials.',
      [{ text: 'OK' }]
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <Text style={[styles.title, theme.typography.h1]}>
              Welcome Back
            </Text>
            <Text style={[styles.subtitle, theme.typography.body1]}>
              Sign in to your Timatix account
            </Text>
          </View>

          <View style={styles.formContainer}>
            <LoginForm 
              onSubmit={handleLogin}
              loading={isLoading || showLoading}
            />
          </View>

          <View style={styles.footer}>
            <Button
              title="Forgot Password?"
              variant="ghost"
              onPress={handleForgotPassword}
              style={styles.forgotPasswordButton}
            />

            <View style={styles.registerContainer}>
              <Text style={[styles.registerText, theme.typography.body2]}>
                Don't have an account?{' '}
              </Text>
              <Button
                title="Sign Up"
                variant="ghost"
                size="small"
                onPress={handleNavigateToRegister}
                style={styles.registerButton}
              />
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {(isLoading || showLoading) && (
        <LoadingSpinner
          overlay
          message="Signing you in..."
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingVertical: 32,
  },
  header: {
    alignItems: 'center',
    marginBottom: 48,
    marginTop: 32,
  },
  title: {
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    textAlign: 'center',
    opacity: 0.7,
  },
  formContainer: {
    flex: 1,
    marginBottom: 24,
  },
  footer: {
    alignItems: 'center',
  },
  forgotPasswordButton: {
    marginBottom: 16,
  },
  registerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  registerText: {
    opacity: 0.7,
  },
  registerButton: {
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
});

export default LoginScreen;