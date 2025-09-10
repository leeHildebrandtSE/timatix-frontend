// Enhanced MetricCard Component using globalStyles
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { useTheme, useGlobalStyles } from '../../context/ThemeContext';

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
  const globalStyles = useGlobalStyles();

  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return {
          container: globalStyles.metricSmallContainer,
          icon: globalStyles.metricSmallIcon,
          iconText: globalStyles.metricSmallIconText,
          value: globalStyles.metricSmallValue,
          title: globalStyles.metricSmallTitle,
          trend: globalStyles.metricSmallTrend,
        };
      case 'large':
        return {
          container: globalStyles.metricLargeContainer,
          icon: globalStyles.metricLargeIcon,
          iconText: globalStyles.metricLargeIconText,
          value: globalStyles.metricLargeValue,
          title: globalStyles.metricLargeTitle,
          trend: globalStyles.metricLargeTrend,
        };
      default:
        return {
          container: globalStyles.metricMediumContainer,
          icon: globalStyles.metricMediumIcon,
          iconText: globalStyles.metricMediumIconText,
          value: globalStyles.metricMediumValue,
          title: globalStyles.metricMediumTitle,
          trend: globalStyles.metricMediumTrend,
        };
    }
  };

  const sizeStyles = getSizeStyles();
  const isInteractive = !!onPress;

  const cardContent = (
    <View
      style={[
        globalStyles.metricCard,
        sizeStyles.container,
        isInteractive && globalStyles.metricCardInteractive,
        style,
      ]}
    >
      {/* Header with Icon and Value */}
      <View style={globalStyles.metricCardHeader}>
        <View style={[
          globalStyles.metricIconContainer, 
          sizeStyles.icon, 
          { backgroundColor: color + '20' }
        ]}>
          <Text style={[globalStyles.metricIconText, sizeStyles.iconText]}>
            {icon}
          </Text>
        </View>
        
        <View style={globalStyles.metricValueContainer}>
          {loading ? (
            <View style={[
              globalStyles.metricLoadingSkeleton, 
              { backgroundColor: theme.colors.border }
            ]} />
          ) : (
            <Text style={[
              globalStyles.metricValue, 
              sizeStyles.value, 
              { color: theme.colors.text }
            ]}>
              {value}
            </Text>
          )}
        </View>
      </View>

      {/* Title */}
      <Text
        style={[
          globalStyles.metricTitle,
          sizeStyles.title,
          { color: theme.colors.textSecondary }
        ]}
        numberOfLines={2}
      >
        {title}
      </Text>

      {/* Trend/Description */}
      {trend && (
        <View style={globalStyles.metricTrendContainer}>
          <Text
            style={[
              globalStyles.metricTrend,
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
        <View style={[
          globalStyles.metricInteractiveIndicator, 
          { backgroundColor: color }
        ]}>
          <Text style={globalStyles.metricArrowIcon}>→</Text>
        </View>
      )}

      {/* Accent Line */}
      <View style={[
        globalStyles.metricAccentLine, 
        { backgroundColor: color }
      ]} />
    </View>
  );

  if (isInteractive) {
    return (
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.8}
        style={globalStyles.touchableContainer}
      >
        {cardContent}
      </TouchableOpacity>
    );
  }

  return cardContent;
};

export default MetricCard;