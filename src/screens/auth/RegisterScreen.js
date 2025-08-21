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
import RegisterForm from '../../components/forms/RegisterForm';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Button from '../../components/common/Button';
import { SUCCESS_MESSAGES } from '../../utils/constants';

const RegisterScreen = ({ navigation }) => {
  const { register, isLoading, error, clearError } = useAuth();
  const { theme } = useTheme();
  
  const [showLoading, setShowLoading] = useState(false);

  useEffect(() => {
    // Clear any previous errors when component mounts
    clearError();
  }, [clearError]);

  useEffect(() => {
    // Show error alert if there's an error
    if (error) {
      Alert.alert('Registration Error', error, [
        { text: 'OK', onPress: clearError }
      ]);
    }
  }, [error, clearError]);

  const handleRegister = async (formData) => {
    try {
      setShowLoading(true);
      await register(formData);
      
      // Show success message and navigate
      Alert.alert('Success', SUCCESS_MESSAGES.REGISTRATION_SUCCESS, [
        { text: 'OK', onPress: () => navigation.navigate('Login') }
      ]);
    } catch (error) {
      console.error('Registration failed:', error);
      // Error will be handled by the useEffect above
    } finally {
      setShowLoading(false);
    }
  };

  const handleNavigateToLogin = () => {
    navigation.navigate('Login');
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
              Create Account
            </Text>
            <Text style={[styles.subtitle, theme.typography.body1]}>
              Join Timatix today
            </Text>
          </View>

          <View style={styles.formContainer}>
            <RegisterForm 
              onSubmit={handleRegister}
              loading={isLoading || showLoading}
            />
          </View>

          <View style={styles.footer}>
            <View style={styles.loginContainer}>
              <Text style={[styles.loginText, theme.typography.body2]}>
                Already have an account?{' '}
              </Text>
              <Button
                title="Sign In"
                variant="ghost"
                size="small"
                onPress={handleNavigateToLogin}
                style={styles.loginButton}
              />
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {(isLoading || showLoading) && (
        <LoadingSpinner
          overlay
          message="Creating your account..."
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
  loginContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loginText: {
    opacity: 0.7,
  },
  loginButton: {
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
});

export default RegisterScreen;