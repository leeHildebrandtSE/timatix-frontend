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

    // Size variations
    switch (size) {
      case 'small':
        baseStyle = { ...baseStyle, ...styles.small };
        break;
      case 'large':
        baseStyle = { ...baseStyle, ...styles.large };
        break;
      default:
        baseStyle = { ...baseStyle, ...styles.medium };
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
      color: theme.colors.textOnPrimary,
    };

    // Size text variations
    switch (size) {
      case 'small':
        baseTextStyle = { ...baseTextStyle, ...theme.typography.buttonSmall };
        break;
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
            : theme.colors.textOnPrimary
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
  small: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    minHeight: 32,
  },
  medium: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    minHeight: 44,
  },
  large: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    minHeight: 52,
  },
});

export default Button;