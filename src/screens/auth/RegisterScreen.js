// Enhanced Register Screen with Modern UI
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
import { validateName, validateEmail, validatePassword, validatePhone } from '../../utils/validation';

const { width, height } = Dimensions.get('window');

const RegisterScreen = ({ navigation }) => {
  const { register, isLoading, error, clearError } = useAuth();
  const { theme } = useTheme();
  
  const [showLoading, setShowLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
    role: 'CLIENT',
    agreeToTerms: false,
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Animation values
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(50));
  const [progressAnim] = useState(new Animated.Value(0));

  const steps = [
    { title: 'Personal Info', icon: '👤', fields: ['firstName', 'lastName', 'phoneNumber'] },
    { title: 'Account Setup', icon: '📧', fields: ['email', 'role'] },
    { title: 'Security', icon: '🔒', fields: ['password', 'confirmPassword'] },
  ];

  useEffect(() => {
    clearError();
    startAnimations();
  }, [clearError]);

  useEffect(() => {
    if (error) {
      Alert.alert('Registration Error', error, [
        { text: 'OK', onPress: clearError }
      ]);
    }
  }, [error, clearError]);

  useEffect(() => {
    // Animate progress bar
    Animated.timing(progressAnim, {
      toValue: (currentStep + 1) / steps.length,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [currentStep]);

  const startAnimations = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
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

  const validateStep = (stepIndex) => {
    const newErrors = {};
    const stepFields = steps[stepIndex].fields;
    
    stepFields.forEach(field => {
      switch (field) {
        case 'firstName':
          const firstNameError = validateName(formData.firstName, 'First name');
          if (firstNameError) newErrors.firstName = firstNameError;
          break;
        case 'lastName':
          const lastNameError = validateName(formData.lastName, 'Last name');
          if (lastNameError) newErrors.lastName = lastNameError;
          break;
        case 'phoneNumber':
          const phoneError = validatePhone(formData.phoneNumber);
          if (phoneError) newErrors.phoneNumber = phoneError;
          break;
        case 'email':
          const emailError = validateEmail(formData.email);
          if (emailError) newErrors.email = emailError;
          break;
        case 'password':
          const passwordError = validatePassword(formData.password);
          if (passwordError) newErrors.password = passwordError;
          break;
        case 'confirmPassword':
          if (!formData.confirmPassword) {
            newErrors.confirmPassword = 'Please confirm your password';
          } else if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
          }
          break;
      }
    });
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep < steps.length - 1) {
        setCurrentStep(currentStep + 1);
      } else {
        handleRegister();
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleRegister = async () => {
    if (!formData.agreeToTerms) {
      Alert.alert('Terms Required', 'Please agree to the Terms of Service to continue.');
      return;
    }
    
    try {
      setShowLoading(true);
      await register(formData);
      
      Alert.alert('Success', SUCCESS_MESSAGES.REGISTRATION_SUCCESS, [
        { text: 'OK', onPress: () => navigation.navigate('Login') }
      ]);
    } catch (error) {
      console.error('Registration failed:', error);
    } finally {
      setShowLoading(false);
    }
  };

  const handleNavigateToLogin = () => {
    navigation.navigate('Login');
  };

  const renderHeader = () => (
    <Animated.View
      style={[
        styles.header,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      <View style={[styles.logoContainer, { backgroundColor: theme.colors.primary + '20' }]}>
        <Text style={styles.logoIcon}>🚀</Text>
      </View>
      
      <Text style={[styles.welcomeTitle, theme.typography.h1]}>
        Join Timatix
      </Text>
      <Text style={[styles.welcomeSubtitle, theme.typography.body1]}>
        Create your account in just a few steps
      </Text>
    </Animated.View>
  );

  const renderProgressBar = () => (
    <Animated.View
      style={[
        styles.progressContainer,
        { opacity: fadeAnim }
      ]}
    >
      <View style={styles.progressHeader}>
        <Text style={[styles.progressTitle, theme.typography.body2]}>
          Step {currentStep + 1} of {steps.length}
        </Text>
        <Text style={[styles.stepTitle, theme.typography.h6]}>
          {steps[currentStep].title}
        </Text>
      </View>
      
      <View style={[styles.progressTrack, { backgroundColor: theme.colors.border }]}>
        <Animated.View
          style={[
            styles.progressFill,
            { backgroundColor: theme.colors.primary },
            {
              width: progressAnim.interpolate({
                inputRange: [0, 1],
                outputRange: ['0%', '100%'],
              }),
            },
          ]}
        />
      </View>
      
      <View style={styles.stepIndicators}>
        {steps.map((step, index) => (
          <View
            key={index}
            style={[
              styles.stepIndicator,
              {
                backgroundColor: index <= currentStep ? theme.colors.primary : theme.colors.border,
              },
            ]}
          >
            <Text
              style={[
                styles.stepIndicatorText,
                { color: index <= currentStep ? '#fff' : theme.colors.textSecondary }
              ]}
            >
              {step.icon}
            </Text>
          </View>
        ))}
      </View>
    </Animated.View>
  );

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return renderPersonalInfoStep();
      case 1:
        return renderAccountSetupStep();
      case 2:
        return renderSecurityStep();
      default:
        return null;
    }
  };

  const renderPersonalInfoStep = () => (
    <View style={styles.stepContent}>
      <Text style={[styles.stepDescription, theme.typography.body2]}>
        Let's start with some basic information about you
      </Text>
      
      <Input
        label="First Name"
        value={formData.firstName}
        onChangeText={(value) => handleInputChange('firstName', value)}
        placeholder="Enter your first name"
        autoCapitalize="words"
        error={errors.firstName}
        leftIcon="👤"
        containerStyle={styles.inputContainer}
        required
      />

      <Input
        label="Last Name"
        value={formData.lastName}
        onChangeText={(value) => handleInputChange('lastName', value)}
        placeholder="Enter your last name"
        autoCapitalize="words"
        error={errors.lastName}
        leftIcon="👤"
        containerStyle={styles.inputContainer}
        required
      />

      <Input
        label="Phone Number"
        value={formData.phoneNumber}
        onChangeText={(value) => handleInputChange('phoneNumber', value)}
        placeholder="Enter your phone number"
        keyboardType="phone-pad"
        error={errors.phoneNumber}
        leftIcon="📱"
        containerStyle={styles.inputContainer}
        required
      />
    </View>
  );

  const renderAccountSetupStep = () => (
    <View style={styles.stepContent}>
      <Text style={[styles.stepDescription, theme.typography.body2]}>
        Set up your account credentials
      </Text>
      
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
        required
      />

      <View style={styles.roleContainer}>
        <Text style={[styles.roleLabel, theme.typography.body2]}>
          I am a:
        </Text>
        <View style={styles.roleButtons}>
          <TouchableOpacity
            style={[
              styles.roleButton,
              formData.role === 'CLIENT' && { backgroundColor: theme.colors.primary },
            ]}
            onPress={() => handleInputChange('role', 'CLIENT')}
          >
            <Text style={styles.roleButtonIcon}>👤</Text>
            <Text
              style={[
                styles.roleButtonText,
                formData.role === 'CLIENT' && { color: '#fff' },
                { color: theme.colors.text },
              ]}
            >
              Vehicle Owner
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.roleButton,
              formData.role === 'MECHANIC' && { backgroundColor: theme.colors.primary },
            ]}
            onPress={() => handleInputChange('role', 'MECHANIC')}
          >
            <Text style={styles.roleButtonIcon}>🔧</Text>
            <Text
              style={[
                styles.roleButtonText,
                formData.role === 'MECHANIC' && { color: '#fff' },
                { color: theme.colors.text },
              ]}
            >
              Mechanic
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  const renderSecurityStep = () => (
    <View style={styles.stepContent}>
      <Text style={[styles.stepDescription, theme.typography.body2]}>
        Create a secure password for your account
      </Text>
      
      <Input
        label="Password"
        value={formData.password}
        onChangeText={(value) => handleInputChange('password', value)}
        placeholder="Create a password"
        secureTextEntry={!showPassword}
        autoComplete="new-password"
        error={errors.password}
        leftIcon="🔒"
        rightIcon={showPassword ? "👁️" : "👁️‍🗨️"}
        onRightIconPress={() => setShowPassword(!showPassword)}
        containerStyle={styles.inputContainer}
        required
      />

      <Input
        label="Confirm Password"
        value={formData.confirmPassword}
        onChangeText={(value) => handleInputChange('confirmPassword', value)}
        placeholder="Confirm your password"
        secureTextEntry={!showConfirmPassword}
        autoComplete="new-password"
        error={errors.confirmPassword}
        leftIcon="🔒"
        rightIcon={showConfirmPassword ? "👁️" : "👁️‍🗨️"}
        onRightIconPress={() => setShowConfirmPassword(!showConfirmPassword)}
        containerStyle={styles.inputContainer}
        required
      />

      <TouchableOpacity
        style={styles.termsContainer}
        onPress={() => handleInputChange('agreeToTerms', !formData.agreeToTerms)}
      >
        <View style={[
          styles.checkbox,
          { borderColor: theme.colors.border },
          formData.agreeToTerms && { backgroundColor: theme.colors.primary }
        ]}>
          {formData.agreeToTerms && (
            <Text style={styles.checkmark}>✓</Text>
          )}
        </View>
        <Text style={[styles.termsText, theme.typography.body2]}>
          I agree to the{' '}
          <Text style={[styles.termsLink, { color: theme.colors.primary }]}>
            Terms of Service
          </Text>{' '}
          and{' '}
          <Text style={[styles.termsLink, { color: theme.colors.primary }]}>
            Privacy Policy
          </Text>
        </Text>
      </TouchableOpacity>
    </View>
  );

  const renderForm = () => (
    <Animated.View
      style={[
        styles.formContainer,
        { opacity: fadeAnim }
      ]}
    >
      <View style={[styles.formCard, { backgroundColor: theme.colors.surface }]}>
        {renderStepContent()}
      </View>
    </Animated.View>
  );

  const renderNavigationButtons = () => (
    <Animated.View
      style={[
        styles.navigationContainer,
        { opacity: fadeAnim }
      ]}
    >
      <View style={styles.navigationButtons}>
        {currentStep > 0 && (
          <Button
            title="Back"
            onPress={handleBack}
            variant="outline"
            style={styles.backButton}
          />
        )}
        
        <Button
          title={currentStep === steps.length - 1 ? 'Create Account' : 'Continue'}
          onPress={handleNext}
          loading={isLoading || showLoading}
          disabled={isLoading || showLoading}
          style={styles.nextButton}
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
      
      <View style={styles.loginContainer}>
        <Text style={[styles.loginText, theme.typography.body2]}>
          Already have an account?
        </Text>
        <TouchableOpacity
          onPress={handleNavigateToLogin}
          style={styles.loginButton}
        >
          <Text style={[styles.loginButtonText, { color: theme.colors.primary }]}>
            Sign In
          </Text>
        </TouchableOpacity>
      </View>
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
          
          {/* Progress Bar */}
          {renderProgressBar()}
          
          {/* Form */}
          {renderForm()}
          
          {/* Navigation */}
          {renderNavigationButtons()}
          
          {/* Footer */}
          {renderFooter()}
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
    paddingVertical: 20,
  },

  // Header
  header: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 30,
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
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
  },

  // Progress
  progressContainer: {
    marginBottom: 30,
  },
  progressHeader: {
    alignItems: 'center',
    marginBottom: 16,
  },
  progressTitle: {
    opacity: 0.7,
    marginBottom: 4,
  },
  stepTitle: {
    fontWeight: 'bold',
  },
  progressTrack: {
    height: 6,
    borderRadius: 3,
    marginBottom: 20,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  stepIndicators: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
  },
  stepIndicator: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepIndicatorText: {
    fontSize: 16,
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
  stepContent: {
    // Container for step content
  },
  stepDescription: {
    textAlign: 'center',
    opacity: 0.8,
    marginBottom: 24,
    lineHeight: 20,
  },
  inputContainer: {
    marginBottom: 20,
  },

  // Role Selection
  roleContainer: {
    marginTop: 10,
  },
  roleLabel: {
    marginBottom: 12,
    fontWeight: '600',
  },
  roleButtons: {
    gap: 12,
  },
  roleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#F8F9FA',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  roleButtonIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  roleButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },

  // Terms
  termsContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 20,
    gap: 12,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 2,
  },
  checkmark: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  termsText: {
    flex: 1,
    lineHeight: 20,
  },
  termsLink: {
    fontWeight: '600',
  },

  // Navigation
  navigationContainer: {
    marginBottom: 30,
  },
  navigationButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  backButton: {
    flex: 1,
    height: 52,
    borderRadius: 16,
  },
  nextButton: {
    flex: 2,
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
    marginBottom: 20,
    opacity: 0.3,
  },
  loginContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  loginText: {
    opacity: 0.7,
  },
  loginButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  loginButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});

export default RegisterScreen;