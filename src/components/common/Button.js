import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator } from 'react-native';
import { useTheme, useGlobalStyles } from '../../context/ThemeContext';

const Button = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  style,
  textStyle,
  ...props
}) => {
  const { theme } = useTheme();
  const globalStyles = useGlobalStyles();

  const getButtonStyles = () => {
    let buttonStyles = [globalStyles.buttonBase];

    // Size variations
    switch (size) {
      case 'small':
        buttonStyles.push(globalStyles.buttonSmall);
        break;
      case 'large':
        buttonStyles.push(globalStyles.buttonLarge);
        break;
      default:
        // Medium is the base style
        break;
    }

    // Variant styles
    switch (variant) {
      case 'secondary':
        buttonStyles.push(globalStyles.buttonSecondary);
        break;
      case 'outline':
        buttonStyles.push(globalStyles.buttonOutline);
        break;
      case 'ghost':
        buttonStyles.push(globalStyles.buttonGhost);
        break;
      case 'danger':
        buttonStyles.push(globalStyles.buttonDanger);
        break;
      case 'success':
        buttonStyles.push(globalStyles.buttonSuccess);
        break;
      default:
        buttonStyles.push(globalStyles.buttonPrimary);
        break;
    }

    // Disabled state
    if (disabled || loading) {
      buttonStyles.push(globalStyles.buttonDisabled);
    }

    return buttonStyles;
  };

  const getTextStyles = () => {
    let textStyles = [globalStyles.buttonText];

    // Size text variations
    if (size === 'small') {
      textStyles.push(globalStyles.buttonTextSmall);
    }

    // Variant text colors
    switch (variant) {
      case 'secondary':
        textStyles.push(globalStyles.buttonTextSecondary);
        break;
      case 'outline':
        textStyles.push(globalStyles.buttonTextOutline);
        break;
      case 'ghost':
        textStyles.push(globalStyles.buttonTextGhost);
        break;
      default:
        // Primary, danger, success use white text (default)
        break;
    }

    return textStyles;
  };

  const getIndicatorColor = () => {
    switch (variant) {
      case 'secondary':
      case 'outline':
      case 'ghost':
        return theme.colors.primary;
      default:
        return '#fff';
    }
  };

  return (
    <TouchableOpacity
      style={[...getButtonStyles(), style]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
      {...props}
    >
      {loading ? (
        <ActivityIndicator 
          size="small" 
          color={getIndicatorColor()} 
        />
      ) : (
        <Text style={[...getTextStyles(), textStyle]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

export default Button;