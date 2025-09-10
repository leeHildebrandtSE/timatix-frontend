// Enhanced Login Screen with Modern UI
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
  Dimensions,
  Animated,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { SUCCESS_MESSAGES } from '../../utils/constants';

const { width, height } = Dimensions.get('window');

const LoginScreen = ({ navigation }) => {
  const { login, isLoading, error, clearError } = useAuth();
  const { theme } = useTheme();
  
  const [showLoading, setShowLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  // Animation values
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(50));
  const [scaleAnim] = useState(new Animated.Value(0.9));

  useEffect(() => {
    clearError();
    startAnimations();
  }, [clearError]);

  useEffect(() => {
    if (error) {
      Alert.alert('Login Error', error, [
        { text: 'OK', onPress: clearError }
      ]);
    }
  }, [error, clearError]);

  const startAnimations = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
    
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: null,
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;
    
    try {
      setShowLoading(true);
      await login(formData);
      Alert.alert('Success', SUCCESS_MESSAGES.LOGIN_SUCCESS);
    } catch (error) {
      console.error('Login failed:', error);
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
      'This feature will be available soon. For demo purposes, please use:\n\nEmail: demo@timatix.com\nPassword: demo123',
      [{ text: 'OK' }]
    );
  };

  const renderHeader = () => (
    <Animated.View
      style={[
        styles.header,
        {
          opacity: fadeAnim,
          transform: [
            { translateY: slideAnim },
            { scale: scaleAnim }
          ],
        },
      ]}
    >
      {/* Logo */}
      <View style={[styles.logoContainer, { backgroundColor: theme.colors.primary + '20' }]}>
        <Text style={styles.logoIcon}>⚙️</Text>
      </View>
      
      {/* Welcome Text */}
      <Text style={[styles.welcomeTitle, theme.typography.h1]}>
        Welcome Back
      </Text>
      <Text style={[styles.welcomeSubtitle, theme.typography.body1]}>
        Sign in to continue your journey
      </Text>
      
      {/* Decorative line */}
      <View style={[styles.decorativeLine, { backgroundColor: theme.colors.primary }]} />
    </Animated.View>
  );

  const renderQuickLogin = () => (
    <Animated.View
      style={[
        styles.quickLoginContainer,
        { opacity: fadeAnim }
      ]}
    >
      <Text style={[styles.quickLoginTitle, theme.typography.body2]}>
        Quick Demo Login
      </Text>
      <View style={styles.quickLoginButtons}>
        <TouchableOpacity
          style={[styles.quickLoginButton, { backgroundColor: theme.colors.primary + '10' }]}
          onPress={() => {
            setFormData({
              email: 'client@demo.com',
              password: 'demo123'
            });
          }}
        >
          <Text style={[styles.quickLoginButtonText, { color: theme.colors.primary }]}>
            👤 Client
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.quickLoginButton, { backgroundColor: theme.colors.secondary + '10' }]}
          onPress={() => {
            setFormData({
              email: 'mechanic@demo.com',
              password: 'demo123'
            });
          }}
        >
          <Text style={[styles.quickLoginButtonText, { color: theme.colors.secondary }]}>
            🔧 Mechanic
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.quickLoginButton, { backgroundColor: theme.colors.error + '10' }]}
          onPress={() => {
            setFormData({
              email: 'admin@demo.com',
              password: 'admin123'
            });
          }}
        >
          <Text style={[styles.quickLoginButtonText, { color: theme.colors.error }]}>
            ⚡ Admin
          </Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );

  const renderForm = () => (
    <Animated.View
      style={[
        styles.formContainer,
        { opacity: fadeAnim }
      ]}
    >
      <View style={[styles.formCard, { backgroundColor: theme.colors.surface }]}>
        <Input
          label="Email Address"
          value={formData.email}
          onChangeText={(value) => handleInputChange('email', value)}
          placeholder="Enter your email"
          keyboardType="email-address"
          autoCapitalize="none"
          autoComplete="email"
          error={errors.email}
          leftIcon="📧"
          containerStyle={styles.inputContainer}
        />

        <Input
          label="Password"
          value={formData.password}
          onChangeText={(value) => handleInputChange('password', value)}
          placeholder="Enter your password"
          secureTextEntry={!showPassword}
          autoComplete="password"
          error={errors.password}
          leftIcon="🔒"
          rightIcon={showPassword ? "👁️" : "👁️‍🗨️"}
          onRightIconPress={() => setShowPassword(!showPassword)}
          containerStyle={styles.inputContainer}
        />

        <TouchableOpacity
          onPress={handleForgotPassword}
          style={styles.forgotPasswordButton}
        >
          <Text style={[styles.forgotPasswordText, { color: theme.colors.primary }]}>
            Forgot your password?
          </Text>
        </TouchableOpacity>

        <Button
          title="Sign In"
          onPress={handleLogin}
          loading={isLoading || showLoading}
          disabled={isLoading || showLoading}
          style={styles.loginButton}
        />
      </View>
    </Animated.View>
  );

  const renderFooter = () => (
    <Animated.View
      style={[
        styles.footer,
        { opacity: fadeAnim }
      ]}
    >
      <View style={[styles.divider, { backgroundColor: theme.colors.border }]} />
      
      <View style={styles.registerContainer}>
        <Text style={[styles.registerText, theme.typography.body2]}>
          Don't have an account?
        </Text>
        <TouchableOpacity
          onPress={handleNavigateToRegister}
          style={styles.registerButton}
        >
          <Text style={[styles.registerButtonText, { color: theme.colors.primary }]}>
            Create Account
          </Text>
        </TouchableOpacity>
      </View>

      <Text style={[styles.footerText, theme.typography.caption]}>
        By continuing, you agree to our Terms of Service and Privacy Policy
      </Text>
    </Animated.View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <StatusBar barStyle="dark-content" backgroundColor={theme.colors.background} />
      
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          {renderHeader()}
          
          {/* Quick Login Options */}
          {renderQuickLogin()}
          
          {/* Login Form */}
          {renderForm()}
          
          {/* Footer */}
          {renderFooter()}
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
    paddingVertical: 20,
  },

  // Header
  header: {
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 40,
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  logoIcon: {
    fontSize: 36,
  },
  welcomeTitle: {
    textAlign: 'center',
    marginBottom: 8,
    fontWeight: 'bold',
  },
  welcomeSubtitle: {
    textAlign: 'center',
    opacity: 0.7,
    marginBottom: 20,
  },
  decorativeLine: {
    width: 60,
    height: 4,
    borderRadius: 2,
  },

  // Quick Login
  quickLoginContainer: {
    marginBottom: 30,
  },
  quickLoginTitle: {
    textAlign: 'center',
    marginBottom: 16,
    opacity: 0.8,
    fontWeight: '600',
  },
  quickLoginButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  quickLoginButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 12,
    alignItems: 'center',
  },
  quickLoginButtonText: {
    fontSize: 12,
    fontWeight: '600',
  },

  // Form
  formContainer: {
    marginBottom: 30,
  },
  formCard: {
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 8,
  },
  inputContainer: {
    marginBottom: 20,
  },
  forgotPasswordButton: {
    alignSelf: 'flex-end',
    marginBottom: 24,
  },
  forgotPasswordText: {
    fontSize: 14,
    fontWeight: '600',
  },
  loginButton: {
    height: 52,
    borderRadius: 16,
  },

  // Footer
  footer: {
    alignItems: 'center',
  },
  divider: {
    width: '100%',
    height: 1,
    marginBottom: 24,
    opacity: 0.3,
  },
  registerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    gap: 8,
  },
  registerText: {
    opacity: 0.7,
  },
  registerButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  registerButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  footerText: {
    textAlign: 'center',
    opacity: 0.6,
    lineHeight: 18,
    maxWidth: 280,
  },
});

export default LoginScreen;