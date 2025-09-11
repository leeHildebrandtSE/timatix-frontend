// src/screens/auth/SplashScreen.js - Splash Screen
import React, { useEffect } from 'react';
import { View, Text, Animated } from 'react-native';
import { useTheme, useGlobalStyles } from '../../context/ThemeContext';

const SplashScreen = ({ onAnimationEnd }) => {
  const { theme } = useTheme();
  const globalStyles = useGlobalStyles();
  const fadeAnim = new Animated.Value(0);
  const scaleAnim = new Animated.Value(0.3);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 20,
        friction: 7,
        useNativeDriver: true,
      })
    ]).start();

    const timer = setTimeout(() => {
      if (onAnimationEnd) onAnimationEnd();
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={[
      globalStyles.splashContainer,
      {
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        backgroundColor: theme.colors.primary,
      }
    ]}>
      <Animated.View style={[
        globalStyles.splashLogo,
        {
          opacity: fadeAnim,
          transform: [{ scale: scaleAnim }]
        }
      ]}>
        <Text style={globalStyles.splashLogoText}>🚗</Text>
        <Text style={[globalStyles.splashLogoText, { fontSize: 42, marginTop: 16 }]}>
          AutoCare
        </Text>
        <Text style={globalStyles.splashTagline}>
          Professional Auto Service Platform
        </Text>
      </Animated.View>

      <Animated.View style={[
        globalStyles.splashAnimation,
        { opacity: fadeAnim }
      ]}>
        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: 'rgba(255,255,255,0.2)',
          paddingHorizontal: 20,
          paddingVertical: 12,
          borderRadius: 25,
        }}>
          <Text style={{ color: '#fff', fontSize: 14, marginRight: 8 }}>⚡</Text>
          <Text style={{ color: '#fff', fontSize: 14, fontWeight: '600' }}>
            Initializing...
          </Text>
        </View>
      </Animated.View>
    </View>
  );
};