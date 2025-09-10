// Button.js - FIXED VERSION
// =============================================================================
import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { useTheme } from '../../context/ThemeContext';

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

  const getButtonStyle = () => {
    let baseStyle = {
      ...styles.base,
      backgroundColor: theme.colors.primary,
    };

    // Size variations using theme.sizing
    switch (size) {
      case 'small':
        baseStyle = { 
          ...baseStyle, 
          paddingHorizontal: theme.spacing.lg,
          paddingVertical: theme.spacing.sm,
          minHeight: 32,
        };
        break;
      case 'large':
        baseStyle = { 
          ...baseStyle, 
          paddingHorizontal: theme.spacing.xxl,
          paddingVertical: theme.spacing.lg,
          minHeight: theme.sizing.buttonHeight,
        };
        break;
      default:
        baseStyle = { 
          ...baseStyle, 
          paddingHorizontal: theme.spacing.xl,
          paddingVertical: theme.spacing.md,
          minHeight: theme.sizing.inputHeight,
        };
    }

    // Variant styles
    switch (variant) {
      case 'secondary':
        baseStyle = {
          ...baseStyle,
          backgroundColor: 'transparent',
          borderWidth: 1,
          borderColor: theme.colors.primary,
        };
        break;
      case 'outline':
        baseStyle = {
          ...baseStyle,
          backgroundColor: 'transparent',
          borderWidth: 1,
          borderColor: theme.colors.border,
        };
        break;
      case 'ghost':
        baseStyle = {
          ...baseStyle,
          backgroundColor: 'transparent',
        };
        break;
      case 'danger':
        baseStyle = {
          ...baseStyle,
          backgroundColor: theme.colors.error,
        };
        break;
      case 'success':
        baseStyle = {
          ...baseStyle,
          backgroundColor: theme.colors.success,
        };
        break;
    }

    // Disabled state
    if (disabled || loading) {
      baseStyle = {
        ...baseStyle,
        opacity: 0.5,
      };
    }

    return baseStyle;
  };

  const getTextStyle = () => {
    let baseTextStyle = {
      ...theme.typography.button,
      color: '#fff', // ✅ FIXED: Use #fff instead of textOnPrimary
    };

    // Size text variations - ✅ FIXED: Handle sizes properly
    if (size === 'small') {
      baseTextStyle = { 
        ...baseTextStyle, 
        fontSize: 14 // Smaller than default button text
      };
    }

    // Variant text colors
    switch (variant) {
      case 'secondary':
      case 'outline':
      case 'ghost':
        baseTextStyle = {
          ...baseTextStyle,
          color: theme.colors.primary,
        };
        break;
    }

    return baseTextStyle;
  };

  return (
    <TouchableOpacity
      style={[getButtonStyle(), style]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
      {...props}
    >
      {loading ? (
        <ActivityIndicator 
          size="small" 
          color={variant === 'secondary' || variant === 'outline' || variant === 'ghost' 
            ? theme.colors.primary 
            : '#fff' // ✅ FIXED: Use #fff instead of textOnPrimary
          } 
        />
      ) : (
        <Text style={[getTextStyle(), textStyle]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
});

export default Button;