// Enhanced MetricCard Component
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { useTheme } from '../../context/ThemeContext';

const { width } = Dimensions.get('window');

const MetricCard = ({
  title,
  value,
  icon,
  color,
  trend,
  size = 'medium',
  onPress,
  style = {},
  loading = false,
}) => {
  const { theme } = useTheme();

  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return {
          container: styles.smallContainer,
          icon: styles.smallIcon,
          iconText: styles.smallIconText,
          value: styles.smallValue,
          title: styles.smallTitle,
          trend: styles.smallTrend,
        };
      case 'large':
        return {
          container: styles.largeContainer,
          icon: styles.largeIcon,
          iconText: styles.largeIconText,
          value: styles.largeValue,
          title: styles.largeTitle,
          trend: styles.largeTrend,
        };
      default:
        return {
          container: styles.mediumContainer,
          icon: styles.mediumIcon,
          iconText: styles.mediumIconText,
          value: styles.mediumValue,
          title: styles.mediumTitle,
          trend: styles.mediumTrend,
        };
    }
  };

  const sizeStyles = getSizeStyles();
  const isInteractive = !!onPress;

  const cardContent = (
    <View
      style={[
        styles.card,
        sizeStyles.container,
        {
          backgroundColor: theme.colors.surface,
          borderColor: theme.colors.border,
          shadowColor: theme.colors.shadow,
        },
        isInteractive && styles.interactiveCard,
        style,
      ]}
    >
      {/* Header with Icon and Value */}
      <View style={styles.header}>
        <View style={[styles.iconContainer, sizeStyles.icon, { backgroundColor: color + '20' }]}>
          <Text style={[styles.iconText, sizeStyles.iconText]}>
            {icon}
          </Text>
        </View>
        
        <View style={styles.valueContainer}>
          {loading ? (
            <View style={[styles.loadingSkeleton, { backgroundColor: theme.colors.border }]} />
          ) : (
            <Text style={[styles.value, sizeStyles.value, { color: theme.colors.text }]}>
              {value}
            </Text>
          )}
        </View>
      </View>

      {/* Title */}
      <Text
        style={[
          styles.title,
          sizeStyles.title,
          { color: theme.colors.textSecondary }
        ]}
        numberOfLines={2}
      >
        {title}
      </Text>

      {/* Trend/Description */}
      {trend && (
        <View style={styles.trendContainer}>
          <Text
            style={[
              styles.trend,
              sizeStyles.trend,
              { color: theme.colors.textLight }
            ]}
            numberOfLines={1}
          >
            {trend}
          </Text>
        </View>
      )}

      {/* Interactive Indicator */}
      {isInteractive && (
        <View style={[styles.interactiveIndicator, { backgroundColor: color }]}>
          <Text style={styles.arrowIcon}>→</Text>
        </View>
      )}

      {/* Accent Line */}
      <View style={[styles.accentLine, { backgroundColor: color }]} />
    </View>
  );

  if (isInteractive) {
    return (
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.8}
        style={styles.touchableContainer}
      >
        {cardContent}
      </TouchableOpacity>
    );
  }

  return cardContent;
};

const styles = StyleSheet.create({
  touchableContainer: {
    // Container for touchable cards
  },
  card: {
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    position: 'relative',
    overflow: 'hidden',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
  },
  interactiveCard: {
    transform: [{ scale: 1 }],
  },

  // Header Section
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  iconContainer: {
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconText: {
    // Base icon text styles
  },
  valueContainer: {
    flex: 1,
    alignItems: 'flex-end',
  },
  value: {
    fontWeight: 'bold',
    textAlign: 'right',
  },
  loadingSkeleton: {
    height: 24,
    width: 60,
    borderRadius: 4,
    opacity: 0.3,
  },

  // Title and Trend
  title: {
    fontWeight: '600',
    lineHeight: 20,
  },
  trendContainer: {
    marginTop: 8,
  },
  trend: {
    fontWeight: '500',
    lineHeight: 16,
  },

  // Interactive Elements
  interactiveIndicator: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  arrowIcon: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  accentLine: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 3,
  },

  // Size Variants
  // Small
  smallContainer: {
    padding: 12,
    minHeight: 100,
  },
  smallIcon: {
    width: 32,
    height: 32,
  },
  smallIconText: {
    fontSize: 16,
  },
  smallValue: {
    fontSize: 20,
  },
  smallTitle: {
    fontSize: 12,
  },
  smallTrend: {
    fontSize: 10,
  },

  // Medium
  mediumContainer: {
    padding: 16,
    minHeight: 120,
  },
  mediumIcon: {
    width: 40,
    height: 40,
  },
  mediumIconText: {
    fontSize: 20,
  },
  mediumValue: {
    fontSize: 24,
  },
  mediumTitle: {
    fontSize: 14,
  },
  mediumTrend: {
    fontSize: 12,
  },

  // Large
  largeContainer: {
    padding: 20,
    minHeight: 140,
  },
  largeIcon: {
    width: 48,
    height: 48,
  },
  largeIconText: {
    fontSize: 24,
  },
  largeValue: {
    fontSize: 32,
  },
  largeTitle: {
    fontSize: 16,
  },
  largeTrend: {
    fontSize: 14,
  },
});

export default MetricCard;