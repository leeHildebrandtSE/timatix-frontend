// src/context/ThemeContext.js - Enhanced version
import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createGlobalStyles, spacing, sizing, shadows, layout } from '../styles/globalStyles';

const ThemeContext = createContext();

// Color palettes
const lightColors = {
  primary: '#007AFF',
  secondary: '#FF9500',
  success: '#34C759',
  warning: '#FF9500',
  error: '#FF3B30',
  info: '#5AC8FA',
  
  background: '#FFFFFF',
  surface: '#F8F9FA',
  card: '#FFFFFF',
  
  text: '#1C1C1E',
  textSecondary: '#6C7B7F',
  textLight: '#8E8E93',
  
  border: '#E5E5EA',
  separator: '#C6C6C8',
  placeholder: '#C7C7CC',
  
  // Additional semantic colors
  disabled: '#F2F2F7',
  overlay: 'rgba(0,0,0,0.4)',
  backdrop: 'rgba(0,0,0,0.3)',
};

const darkColors = {
  primary: '#0A84FF',
  secondary: '#FF9F0A',
  success: '#32D74B',
  warning: '#FF9F0A',
  error: '#FF453A',
  info: '#64D2FF',
  
  background: '#000000',
  surface: '#1C1C1E',
  card: '#1C1C1E',
  
  text: '#FFFFFF',
  textSecondary: '#AEAEB2',
  textLight: '#8E8E93',
  
  border: '#38383A',
  separator: '#48484A',
  placeholder: '#48484A',
  
  disabled: '#1C1C1E',
  overlay: 'rgba(0,0,0,0.6)',
  backdrop: 'rgba(0,0,0,0.5)',
};

// Typography system
const createTypography = (isDark) => ({
  h1: {
    fontSize: 32,
    fontWeight: '700',
    lineHeight: 40,
    color: isDark ? darkColors.text : lightColors.text,
  },
  h2: {
    fontSize: 28,
    fontWeight: '700',
    lineHeight: 36,
    color: isDark ? darkColors.text : lightColors.text,
  },
  h3: {
    fontSize: 24,
    fontWeight: '600',
    lineHeight: 32,
    color: isDark ? darkColors.text : lightColors.text,
  },
  h4: {
    fontSize: 20,
    fontWeight: '600',
    lineHeight: 28,
    color: isDark ? darkColors.text : lightColors.text,
  },
  h5: {
    fontSize: 18,
    fontWeight: '600',
    lineHeight: 24,
    color: isDark ? darkColors.text : lightColors.text,
  },
  h6: {
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 22,
    color: isDark ? darkColors.text : lightColors.text,
  },
  body1: {
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 22,
    color: isDark ? darkColors.text : lightColors.text,
  },
  body2: {
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 20,
    color: isDark ? darkColors.text : lightColors.text,
  },
  caption: {
    fontSize: 12,
    fontWeight: '400',
    lineHeight: 16,
    color: isDark ? darkColors.textSecondary : lightColors.textSecondary,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 20,
    color: isDark ? darkColors.textSecondary : lightColors.textSecondary,
  },
  input: {
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 22,
    color: isDark ? darkColors.text : lightColors.text,
  },
  button: {
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 22,
  },
  error: {
    fontSize: 12,
    fontWeight: '400',
    lineHeight: 16,
    color: isDark ? darkColors.error : lightColors.error,
  },
});

export const ThemeProvider = ({ children }) => {
  const systemColorScheme = useColorScheme();
  const [isDark, setIsDark] = useState(systemColorScheme === 'dark');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadThemePreference();
  }, []);

  const loadThemePreference = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem('themePreference');
      if (savedTheme !== null) {
        setIsDark(savedTheme === 'dark');
      }
    } catch (error) {
      console.error('Error loading theme preference:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleTheme = async () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    try {
      await AsyncStorage.setItem('themePreference', newTheme ? 'dark' : 'light');
    } catch (error) {
      console.error('Error saving theme preference:', error);
    }
  };

  const theme = useMemo(() => {
    const colors = isDark ? darkColors : lightColors;
    const typography = createTypography(isDark);
    const globalStyles = createGlobalStyles({ colors, typography });
    
    return {
      colors,
      typography,
      spacing,
      sizing,
      shadows: isDark ? {
        ...shadows,
        small: { ...shadows.small, shadowColor: '#000', shadowOpacity: 0.3, elevation: 4 },
        medium: { ...shadows.medium, shadowColor: '#000', shadowOpacity: 0.4, elevation: 6 },
        large: { ...shadows.large, shadowColor: '#000', shadowOpacity: 0.5, elevation: 10 },
      } : shadows,
      layout,
      globalStyles,
      isDark,
    };
  }, [isDark]);

  const value = {
    theme,
    isDark,
    toggleTheme,
    isLoading,
  };

  if (isLoading) {
    return null; // Or a loading component
  }

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

// Hook for accessing global styles with theme
export const useGlobalStyles = () => {
  const { theme } = useTheme();
  return theme.globalStyles;
};

export default ThemeContext;