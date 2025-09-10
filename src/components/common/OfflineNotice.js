// src/components/common/OfflineNotice.js
import React from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { useNetwork } from '../../utils/network';
import { useTheme } from '../../context/ThemeContext';

const OfflineNotice = () => {
  const { isConnected } = useNetwork();
  const { theme } = useTheme();
  const slideAnim = React.useRef(new Animated.Value(-100)).current;

  React.useEffect(() => {
    if (!isConnected) {
      // Slide down
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      // Slide up
      Animated.timing(slideAnim, {
        toValue: -100,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [isConnected, slideAnim]);

  if (isConnected) {
    return null;
  }

  return (
    <Animated.View
      style={[
        styles.container,
        { 
          backgroundColor: theme.colors.error,
          transform: [{ translateY: slideAnim }]
        }
      ]}
    >
      <Text style={[styles.text, { color: '#fff' }]}>
        📵 No internet connection
      </Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    paddingTop: 50, // Account for status bar
    paddingBottom: 10,
    paddingHorizontal: 15,
    zIndex: 1000,
    alignItems: 'center',
  },
  text: {
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
});

export default OfflineNotice;