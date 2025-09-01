// src/screens/auth/SplashScreen.js
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Animated,
  StatusBar,
  Platform,
} from 'react-native';
import { useTheme } from '../../context/ThemeContext';

const { width, height } = Dimensions.get('window');

const SplashScreen = ({ onAnimationEnd }) => {
  const { theme } = useTheme();
  
  // Animation values
  const [logoScale] = useState(new Animated.Value(0));
  const [logoOpacity] = useState(new Animated.Value(0));
  const [titleTranslateY] = useState(new Animated.Value(50));
  const [titleOpacity] = useState(new Animated.Value(0));
  const [subtitleOpacity] = useState(new Animated.Value(0));
  const [backgroundOpacity] = useState(new Animated.Value(0));
  const [pulseAnim] = useState(new Animated.Value(1));
  const [rotateAnim] = useState(new Animated.Value(0));
  const [particleAnims] = useState([
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0),
  ]);

  useEffect(() => {
    startSplashAnimation();
  }, []);

  const startSplashAnimation = () => {
    // Background fade in
    Animated.timing(backgroundOpacity, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();

    // Particle animations
    particleAnims.forEach((anim, index) => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(anim, {
            toValue: 1,
            duration: 2000 + (index * 500),
            useNativeDriver: true,
          }),
          Animated.timing(anim, {
            toValue: 0,
            duration: 2000 + (index * 500),
            useNativeDriver: true,
          }),
        ])
      ).start();
    });

    // Logo animations
    Animated.sequence([
      // Logo scale and fade in
      Animated.parallel([
        Animated.spring(logoScale, {
          toValue: 1,
          tension: 50,
          friction: 7,
          useNativeDriver: true,
        }),
        Animated.timing(logoOpacity, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ]),
      
      // Pulse effect
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.1,
            duration: 1500,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1500,
            useNativeDriver: true,
          }),
        ])
      ),
    ]).start();

    // Rotate animation for gear icon
    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 4000,
        useNativeDriver: true,
      })
    ).start();

    // Title animation (delayed)
    setTimeout(() => {
      Animated.parallel([
        Animated.timing(titleTranslateY, {
          toValue: 0,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(titleOpacity, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
      ]).start();
    }, 800);

    // Subtitle animation (more delayed)
    setTimeout(() => {
      Animated.timing(subtitleOpacity, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }).start();
    }, 1400);

    // End splash screen
    setTimeout(() => {
      Animated.parallel([
        Animated.timing(backgroundOpacity, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(logoOpacity, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(titleOpacity, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(subtitleOpacity, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
      ]).start(() => {
        onAnimationEnd?.();
      });
    }, 3500);
  };

  const rotateInterpolate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const renderBackground = () => (
    <Animated.View 
      style={[
        styles.backgroundContainer,
        { opacity: backgroundOpacity }
      ]}
    >
      <View style={[styles.gradientBackground, { backgroundColor: theme.colors.primary }]}>
        {/* Geometric shapes for visual interest */}
        <Animated.View 
          style={[
            styles.shape, 
            styles.shape1,
            {
              transform: [{
                rotate: rotateInterpolate
              }]
            }
          ]} 
        />
        <View style={[styles.shape, styles.shape2]} />
        <Animated.View 
          style={[
            styles.shape, 
            styles.shape3,
            {
              transform: [{
                rotate: rotateAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['0deg', '-180deg'],
                })
              }]
            }
          ]} 
        />
        
        {/* Animated particles */}
        {particleAnims.map((anim, index) => (
          <Animated.View
            key={index}
            style={[
              styles.particle,
              styles[`particle${index + 1}`],
              {
                opacity: anim,
                transform: [{
                  translateY: anim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, -20],
                  })
                }]
              }
            ]}
          />
        ))}
      </View>
    </Animated.View>
  );

  const renderLogo = () => (
    <Animated.View
      style={[
        styles.logoContainer,
        {
          transform: [
            { scale: Animated.multiply(logoScale, pulseAnim) }
          ],
          opacity: logoOpacity,
        },
      ]}
    >
      {/* Main logo circle */}
      <View style={[styles.logoCircle, { backgroundColor: 'rgba(255,255,255,0.15)' }]}>
        <View style={[styles.logoInnerCircle, { backgroundColor: 'rgba(255,255,255,0.25)' }]}>
          {/* Rotating gear icon */}
          <Animated.View
            style={{
              transform: [{ rotate: rotateInterpolate }]
            }}
          >
            <Text style={styles.logoIcon}>⚙️</Text>
          </Animated.View>
        </View>
      </View>
      
      {/* Logo accent rings */}
      <Animated.View 
        style={[
          styles.accentRing, 
          styles.ring1,
          {
            transform: [{
              rotate: rotateAnim.interpolate({
                inputRange: [0, 1],
                outputRange: ['0deg', '90deg'],
              })
            }]
          }
        ]} 
      />
      <Animated.View 
        style={[
          styles.accentRing, 
          styles.ring2,
          {
            transform: [{
              rotate: rotateAnim.interpolate({
                inputRange: [0, 1],
                outputRange: ['0deg', '-45deg'],
              })
            }]
          }
        ]} 
      />
    </Animated.View>
  );

  const renderTitle = () => (
    <Animated.View
      style={[
        styles.titleContainer,
        {
          transform: [{ translateY: titleTranslateY }],
          opacity: titleOpacity,
        },
      ]}
    >
      <Text style={styles.appName}>Timatix</Text>
      <Animated.View 
        style={[
          styles.titleAccent,
          {
            transform: [{
              scaleX: titleOpacity
            }]
          }
        ]} 
      />
    </Animated.View>
  );

  const renderSubtitle = () => (
    <Animated.View
      style={[
        styles.subtitleContainer,
        { opacity: subtitleOpacity }
      ]}
    >
      <Text style={styles.subtitle}>Your Vehicle Service Companion</Text>
      <View style={styles.featuresList}>
        <Text style={styles.feature}>🔧 Book Services</Text>
        <Text style={styles.feature}>📊 Track Progress</Text>
        <Text style={styles.feature}>🚗 Manage Fleet</Text>
      </View>
    </Animated.View>
  );

  const renderLoadingIndicator = () => (
    <Animated.View
      style={[
        styles.loadingContainer,
        { opacity: subtitleOpacity }
      ]}
    >
      <View style={styles.loadingDots}>
        <Animated.View 
          style={[
            styles.dot, 
            { 
              opacity: pulseAnim,
              transform: [{
                scale: pulseAnim
              }]
            }
          ]} 
        />
        <Animated.View 
          style={[
            styles.dot, 
            { 
              opacity: pulseAnim.interpolate({
                inputRange: [1, 1.1],
                outputRange: [0.7, 1],
              })
            }
          ]} 
        />
        <Animated.View 
          style={[
            styles.dot, 
            { 
              opacity: pulseAnim.interpolate({
                inputRange: [1, 1.1],
                outputRange: [0.5, 0.8],
              })
            }
          ]} 
        />
      </View>
      <Text style={styles.loadingText}>Starting your engines...</Text>
    </Animated.View>
  );

  return (
    <View style={styles.container}>
      <StatusBar 
        barStyle="light-content" 
        backgroundColor={theme.colors.primary} 
        translucent={Platform.OS === 'android'}
      />
      
      {/* Background */}
      {renderBackground()}
      
      {/* Content */}
      <View style={styles.content}>
        {/* Logo */}
        {renderLogo()}
        
        {/* Title */}
        {renderTitle()}
        
        {/* Subtitle */}
        {renderSubtitle()}
        
        {/* Loading Indicator */}
        {renderLoadingIndicator()}
      </View>
      
      {/* Bottom branding */}
      <Animated.View
        style={[
          styles.bottomBranding,
          { opacity: subtitleOpacity }
        ]}
      >
        <Text style={styles.brandingText}>Powered by Innovation</Text>
        <Text style={styles.versionText}>v2.0.0</Text>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  // Background
  backgroundContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  gradientBackground: {
    flex: 1,
    position: 'relative',
  },
  shape: {
    position: 'absolute',
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 20,
  },
  shape1: {
    width: 120,
    height: 120,
    top: '15%',
    left: '15%',
    borderRadius: 60,
  },
  shape2: {
    width: 80,
    height: 80,
    top: '25%',
    right: '20%',
    borderRadius: 40,
  },
  shape3: {
    width: 100,
    height: 100,
    bottom: '20%',
    left: '25%',
    borderRadius: 20,
  },
  particle: {
    position: 'absolute',
    width: 6,
    height: 6,
    backgroundColor: 'rgba(255,255,255,0.6)',
    borderRadius: 3,
  },
  particle1: {
    top: '35%',
    left: '75%',
  },
  particle2: {
    top: '55%',
    left: '20%',
  },
  particle3: {
    top: '70%',
    right: '30%',
  },

  // Content
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    zIndex: 1,
  },

  // Logo
  logoContainer: {
    alignItems: 'center',
    marginBottom: 50,
    position: 'relative',
  },
  logoCircle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  logoInnerCircle: {
    width: 110,
    height: 110,
    borderRadius: 55,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoIcon: {
    fontSize: 50,
    color: '#fff',
  },
  accentRing: {
    position: 'absolute',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.15)',
    borderRadius: 100,
  },
  ring1: {
    width: 180,
    height: 180,
    top: -20,
    left: -20,
    borderTopColor: 'rgba(255,255,255,0.3)',
    borderRightColor: 'transparent',
    borderBottomColor: 'transparent',
    borderLeftColor: 'transparent',
  },
  ring2: {
    width: 220,
    height: 220,
    top: -40,
    left: -40,
    borderStyle: 'dashed',
    borderTopColor: 'transparent',
    borderRightColor: 'rgba(255,255,255,0.2)',
    borderBottomColor: 'rgba(255,255,255,0.2)',
    borderLeftColor: 'transparent',
  },

  // Title
  titleContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  appName: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#fff',
    letterSpacing: 3,
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 3 },
    textShadowRadius: 6,
  },
  titleAccent: {
    width: 80,
    height: 4,
    backgroundColor: '#fff',
    borderRadius: 2,
    marginTop: 12,
    opacity: 0.9,
  },

  // Subtitle
  subtitleContainer: {
    alignItems: 'center',
    marginBottom: 50,
  },
  subtitle: {
    fontSize: 18,
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
    marginBottom: 20,
    fontWeight: '500',
    letterSpacing: 0.5,
  },
  featuresList: {
    flexDirection: 'row',
    gap: 20,
  },
  feature: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
    fontWeight: '500',
  },

  // Loading
  loadingContainer: {
    alignItems: 'center',
  },
  loadingDots: {
    flexDirection: 'row',
    marginBottom: 20,
    gap: 12,
  },
  dot: {
    width: 10,
    height: 10,
    backgroundColor: 'rgba(255,255,255,0.8)',
    borderRadius: 5,
  },
  loadingText: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
    fontStyle: 'italic',
    letterSpacing: 1,
  },

  // Bottom branding
  bottomBranding: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 50 : 30,
    alignItems: 'center',
    zIndex: 1,
  },
  brandingText: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.6)',
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  versionText: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.4)',
    letterSpacing: 1,
  },
});

export default SplashScreen;