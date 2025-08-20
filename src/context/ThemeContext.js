import React, { createContext, useContext, useState, useEffect } from 'react';
import { Appearance } from 'react-native';
import { storageService } from '../services/storage';
import { STORAGE_KEYS } from '../utils/constants';
import { lightTheme, darkTheme } from '../styles/themes';

// Create context
const ThemeContext = createContext();

// Theme provider component
export const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Load theme preference on app start
  useEffect(() => {
    loadThemePreference();
    
    // Listen for system theme changes
    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      // Only auto-switch if user hasn't set a preference
      checkAutoTheme(colorScheme);
    });

    return () => subscription?.remove();
  }, []);

  const loadThemePreference = async () => {
    try {
      const savedTheme = await storageService.get(STORAGE_KEYS.THEME_PREFERENCE);
      
      if (savedTheme !== null) {
        setIsDark(savedTheme === 'dark');
      } else {
        // Use system preference if no saved preference
        const systemTheme = Appearance.getColorScheme();
        setIsDark(systemTheme === 'dark');
      }
    } catch (error) {
      console.error('Error loading theme preference:', error);
      // Fallback to system theme
      const systemTheme = Appearance.getColorScheme();
      setIsDark(systemTheme === 'dark');
    } finally {
      setIsLoading(false);
    }
  };

  const checkAutoTheme = async (systemColorScheme) => {
    try {
      const savedTheme = await storageService.get(STORAGE_KEYS.THEME_PREFERENCE);
      
      // Only follow system if user hasn't set a preference
      if (savedTheme === null) {
        setIsDark(systemColorScheme === 'dark');
      }
    } catch (error) {
      console.error('Error checking auto theme:', error);
    }
  };

  const toggleTheme = async () => {
    try {
      const newTheme = !isDark;
      setIsDark(newTheme);
      
      // Save preference
      await storageService.set(
        STORAGE_KEYS.THEME_PREFERENCE, 
        newTheme ? 'dark' : 'light'
      );
    } catch (error) {
      console.error('Error toggling theme:', error);
    }
  };

  const setTheme = async (themeName) => {
    try {
      const newIsDark = themeName === 'dark';
      setIsDark(newIsDark);
      
      // Save preference
      await storageService.set(STORAGE_KEYS.THEME_PREFERENCE, themeName);
    } catch (error) {
      console.error('Error setting theme:', error);
    }
  };

  const resetToSystemTheme = async () => {
    try {
      // Remove saved preference
      await storageService.remove(STORAGE_KEYS.THEME_PREFERENCE);
      
      // Use system theme
      const systemTheme = Appearance.getColorScheme();
      setIsDark(systemTheme === 'dark');
    } catch (error) {
      console.error('Error resetting theme:', error);
    }
  };

  const getCurrentTheme = () => {
    return isDark ? darkTheme : lightTheme;
  };

  const value = {
    // State
    isDark,
    isLoading,
    theme: getCurrentTheme(),
    
    // Actions
    toggleTheme,
    setTheme,
    resetToSystemTheme,
    
    // Helpers
    getCurrentTheme,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

// Custom hook to use theme context
export const useTheme = () => {
  const context = useContext(ThemeContext);
  
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  
  return context;
};

export default ThemeContext;