// src/components/common/NotificationToast.js - Improved with global state management
import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Animated, 
  TouchableOpacity,
  Dimensions 
} from 'react-native';
import { useTheme } from '../../context/ThemeContext';

const { width } = Dimensions.get('window');

// Global toast state
let toastRef = null;

// Global functions to show toast
export const showToast = (config) => {
  if (toastRef) {
    toastRef.show(config);
  }
};

export const showSuccessToast = (message, title = 'Success') => {
  showToast({ type: 'success', title, message });
};

export const showErrorToast = (message, title = 'Error') => {
  showToast({ type: 'error', title, message });
};

export const showInfoToast = (message, title = 'Info') => {
  showToast({ type: 'info', title, message });
};

export const showWarningToast = (message, title = 'Warning') => {
  showToast({ type: 'warning', title, message });
};

const NotificationToast = () => {
  const { theme } = useTheme();
  const [toast, setToast] = useState(null);
  const slideAnim = useRef(new Animated.Value(-100)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const timeoutRef = useRef(null);

  useEffect(() => {
    // Register this component as the global toast reference
    toastRef = {
      show: showToastInternal,
      hide: hideToast,
    };

    return () => {
      toastRef = null;
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const showToastInternal = (config) => {
    const {
      type = 'info',
      title,
      message,
      duration = 4000,
      onDismiss,
    } = config;

    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    setToast({ type, title, message, onDismiss });

    // Animate in
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();

    // Auto dismiss
    timeoutRef.current = setTimeout(() => {
      hideToast();
    }, duration);
  };

  const hideToast = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: -100,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      if (toast?.onDismiss) {
        toast.onDismiss();
      }
      setToast(null);
    });
  };

  const getTypeConfig = (type) => {
    const configs = {
      success: {
        color: theme.colors.success,
        backgroundColor: `${theme.colors.success}15`,
        borderColor: theme.colors.success,
        icon: '✅',
      },
      error: {
        color: theme.colors.error,
        backgroundColor: `${theme.colors.error}15`,
        borderColor: theme.colors.error,
        icon: '❌',
      },
      warning: {
        color: theme.colors.warning || '#FFA500',
        backgroundColor: `${theme.colors.warning || '#FFA500'}15`,
        borderColor: theme.colors.warning || '#FFA500',
        icon: '⚠️',
      },
      info: {
        color: theme.colors.info || theme.colors.primary,
        backgroundColor: `${theme.colors.info || theme.colors.primary}15`,
        borderColor: theme.colors.info || theme.colors.primary,
        icon: 'ℹ️',
      },
    };

    return configs[type] || configs.info;
  };

  if (!toast) {
    return null;
  }

  const config = getTypeConfig(toast.type);

  return (
    <Animated.View
      style={[
        styles.container,
        {
          backgroundColor: config.backgroundColor,
          borderLeftColor: config.borderColor,
          transform: [{ translateY: slideAnim }],
          opacity: opacityAnim,
        },
      ]}
    >
      <View style={styles.content}>
        <Text style={styles.icon}>{config.icon}</Text>
        <View style={styles.textContainer}>
          {toast.title && (
            <Text style={[styles.title, theme.typography.h6, { color: config.color }]}>
              {toast.title}
            </Text>
          )}
          <Text style={[styles.message, theme.typography.body2, { color: theme.colors.text }]}>
            {toast.message}
          </Text>
        </View>
        <TouchableOpacity onPress={hideToast} style={styles.closeButton}>
          <Text style={[styles.closeIcon, { color: theme.colors.textSecondary }]}>✕</Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 60,
    left: 16,
    right: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
    zIndex: 9999,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 16,
  },
  icon: {
    fontSize: 20,
    marginRight: 12,
    marginTop: 2,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    marginBottom: 4,
    fontWeight: '600',
  },
  message: {
    lineHeight: 20,
  },
  closeButton: {
    padding: 4,
    marginTop: -4,
  },
  closeIcon: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default NotificationToast;