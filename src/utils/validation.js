import { VALIDATION_RULES, ERROR_MESSAGES } from './constants';

// Email validation
export const validateEmail = (email) => {
  if (!email) {
    return ERROR_MESSAGES.FIELD_REQUIRED;
  }
  if (!VALIDATION_RULES.EMAIL_REGEX.test(email)) {
    return ERROR_MESSAGES.INVALID_EMAIL;
  }
  return null;
};

// Password validation
export const validatePassword = (password) => {
  if (!password) {
    return ERROR_MESSAGES.FIELD_REQUIRED;
  }
  if (password.length < VALIDATION_RULES.PASSWORD_MIN_LENGTH) {
    return ERROR_MESSAGES.PASSWORD_TOO_SHORT;
  }
  return null;
};

// Confirm password validation
export const validateConfirmPassword = (password, confirmPassword) => {
  if (!confirmPassword) {
    return ERROR_MESSAGES.FIELD_REQUIRED;
  }
  if (password !== confirmPassword) {
    return ERROR_MESSAGES.PASSWORDS_DONT_MATCH;
  }
  return null;
};

// Name validation
export const validateName = (name, fieldName = 'Name') => {
  if (!name) {
    return ERROR_MESSAGES.FIELD_REQUIRED;
  }
  if (name.trim().length < VALIDATION_RULES.NAME_MIN_LENGTH) {
    return `${fieldName} must be at least ${VALIDATION_RULES.NAME_MIN_LENGTH} characters.`;
  }
  if (name.trim().length > VALIDATION_RULES.NAME_MAX_LENGTH) {
    return `${fieldName} must be less than ${VALIDATION_RULES.NAME_MAX_LENGTH} characters.`;
  }
  return null;
};

// Phone number validation
export const validatePhone = (phone) => {
  if (!phone) {
    return null; // Phone is optional in most cases
  }
  if (!VALIDATION_RULES.PHONE_REGEX.test(phone)) {
    return ERROR_MESSAGES.INVALID_PHONE;
  }
  return null;
};

// Required field validation
export const validateRequired = (value, fieldName = 'Field') => {
  if (!value || (typeof value === 'string' && !value.trim())) {
    return `${fieldName} is required.`;
  }
  return null;
};

// VIN validation
export const validateVIN = (vin) => {
  if (!vin) {
    return null; // VIN is optional
  }
  if (vin.length !== VALIDATION_RULES.VIN_LENGTH) {
    return `VIN must be exactly ${VALIDATION_RULES.VIN_LENGTH} characters.`;
  }
  return null;
};

// Year validation
export const validateYear = (year) => {
  if (!year) {
    return ERROR_MESSAGES.FIELD_REQUIRED;
  }
  const currentYear = new Date().getFullYear();
  const yearNum = parseInt(year, 10);
  
  if (isNaN(yearNum)) {
    return 'Year must be a valid number.';
  }
  if (yearNum < 1900 || yearNum > currentYear + 1) {
    return `Year must be between 1900 and ${currentYear + 1}.`;
  }
  return null;
};

// Login form validation
export const validateLoginForm = (formData) => {
  const errors = {};
  
  const emailError = validateEmail(formData.email);
  if (emailError) errors.email = emailError;
  
  const passwordError = validatePassword(formData.password);
  if (passwordError) errors.password = passwordError;
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

// Registration form validation
export const validateRegistrationForm = (formData) => {
  const errors = {};
  
  const firstNameError = validateName(formData.firstName, 'First name');
  if (firstNameError) errors.firstName = firstNameError;
  
  const lastNameError = validateName(formData.lastName, 'Last name');
  if (lastNameError) errors.lastName = lastNameError;
  
  const emailError = validateEmail(formData.email);
  if (emailError) errors.email = emailError;
  
  const passwordError = validatePassword(formData.password);
  if (passwordError) errors.password = passwordError;
  
  if (formData.confirmPassword !== undefined) {
    const confirmPasswordError = validateConfirmPassword(
      formData.password,
      formData.confirmPassword
    );
    if (confirmPasswordError) errors.confirmPassword = confirmPasswordError;
  }
  
  const phoneError = validatePhone(formData.phoneNumber);
  if (phoneError) errors.phoneNumber = phoneError;
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

// Vehicle form validation
export const validateVehicleForm = (formData) => {
  const errors = {};
  
  const makeError = validateRequired(formData.make, 'Make');
  if (makeError) errors.make = makeError;
  
  const modelError = validateRequired(formData.model, 'Model');
  if (modelError) errors.model = modelError;
  
  const yearError = validateYear(formData.year);
  if (yearError) errors.year = yearError;
  
  const vinError = validateVIN(formData.vin);
  if (vinError) errors.vin = vinError;
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

// Service request form validation
export const validateServiceRequestForm = (formData) => {
  const errors = {};
  
  const vehicleError = validateRequired(formData.vehicleId, 'Vehicle');
  if (vehicleError) errors.vehicleId = vehicleError;
  
  const serviceTypeError = validateRequired(formData.serviceType, 'Service type');
  if (serviceTypeError) errors.serviceType = serviceTypeError;
  
  const descriptionError = validateRequired(formData.description, 'Description');
  if (descriptionError) errors.description = descriptionError;
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

export default {
  validateEmail,
  validatePassword,
  validateConfirmPassword,
  validateName,
  validatePhone,
  validateRequired,
  validateVIN,
  validateYear,
  validateLoginForm,
  validateRegistrationForm,
  validateVehicleForm,
  validateServiceRequestForm,
};

// Add missing constants
const ERROR_MESSAGES = {
  // ... existing messages
  INVALID_EMAIL: 'Please enter a valid email address.',
  INVALID_PHONE: 'Please enter a valid phone number.',
  PASSWORD_TOO_SHORT: `Password must be at least ${VALIDATION_RULES.PASSWORD_MIN_LENGTH} characters.`,
  PASSWORDS_DONT_MATCH: 'Passwords do not match.',
};

const VALIDATION_RULES = {
  // ... existing rules
  NAME_MIN_LENGTH: 2,
  NAME_MAX_LENGTH: 50,
};