import React, { useState } from 'react';
import { View, TextInput, Text, TouchableOpacity } from 'react-native';
import { useTheme, useGlobalStyles } from '../../context/ThemeContext';

const Input = ({
  label,
  value,
  onChangeText,
  placeholder,
  error,
  secureTextEntry = false,
  keyboardType = 'default',
  multiline = false,
  numberOfLines = 1,
  editable = true,
  required = false,
  style,
  inputStyle,
  leftIcon,
  rightIcon,
  onRightIconPress,
  ...props
}) => {
  const { theme } = useTheme();
  const globalStyles = useGlobalStyles();
  const [isFocused, setIsFocused] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(!secureTextEntry);

  const getInputContainerStyle = () => {
    let containerStyles = [globalStyles.inputFieldContainer];

    if (isFocused) {
      containerStyles.push(globalStyles.inputFieldFocused);
    }

    if (error) {
      containerStyles.push(globalStyles.inputFieldError);
    }

    if (!editable) {
      containerStyles.push(globalStyles.inputFieldDisabled);
    }

    return containerStyles;
  };

  const handleTogglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  return (
    <View style={[globalStyles.inputContainer, style]}>
      {label && (
        <Text style={[globalStyles.inputLabel, theme.typography.label]}>
          {label}
          {required && <Text style={globalStyles.inputRequired}> *</Text>}
        </Text>
      )}
      
      <View style={getInputContainerStyle()}>
        {leftIcon && (
          <View style={globalStyles.inputLeftIconContainer}>
            {leftIcon}
          </View>
        )}
        
        <TextInput
          style={[
            globalStyles.inputField,
            theme.typography.input,
            multiline && globalStyles.inputFieldMultiline,
            inputStyle,
          ]}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={theme.colors.textLight}
          secureTextEntry={secureTextEntry && !isPasswordVisible}
          keyboardType={keyboardType}
          multiline={multiline}
          numberOfLines={numberOfLines}
          editable={editable}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...props}
        />
        
        {secureTextEntry && (
          <TouchableOpacity
            style={globalStyles.inputRightIconContainer}
            onPress={handleTogglePasswordVisibility}
          >
            <Text style={[theme.typography.caption, { color: theme.colors.primary }]}>
              {isPasswordVisible ? 'Hide' : 'Show'}
            </Text>
          </TouchableOpacity>
        )}
        
        {rightIcon && !secureTextEntry && (
          <TouchableOpacity
            style={globalStyles.inputRightIconContainer}
            onPress={onRightIconPress}
          >
            {rightIcon}
          </TouchableOpacity>
        )}
      </View>
      
      {error && (
        <Text style={[globalStyles.inputErrorText, theme.typography.error]}>
          {error}
        </Text>
      )}
    </View>
  );
};

export default Input;