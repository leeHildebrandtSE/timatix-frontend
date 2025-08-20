import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '../../context/ThemeContext';

const MetricCard = ({ 
  title, 
  value, 
  subtitle, 
  icon, 
  color, 
  onPress, 
  trend,
  trendDirection = 'up',
  size = 'medium',
  style 
}) => {
  const { theme } = useTheme();

  const cardColor = color || theme.colors.primary;

  const getTrendIcon = () => {
    if (!trend) return null;
    return trendDirection === 'up' ? '↗' : '↘';
  };

  const getTrendColor = () => {
    if (!trend) return theme.colors.textSecondary;
    return trendDirection === 'up' ? theme.colors.success : theme.colors.error;
  };

  const getCardStyle = () => {
    let cardStyle = {
      ...styles.card,
      backgroundColor: theme.colors.surface,
      borderColor: theme.colors.border,
      shadowColor: theme.colors.shadow,
    };

    switch (size) {
      case 'small':
        cardStyle = { ...cardStyle, ...styles.small };
        break;
      case 'large':
        cardStyle = { ...cardStyle, ...styles.large };
        break;
      default:
        cardStyle = { ...cardStyle, ...styles.medium };
    }

    return cardStyle;
  };

  const getValueStyle = () => {
    let valueStyle = { ...styles.value };

    switch (size) {
      case 'small':
        valueStyle = { ...valueStyle, ...theme.typography.h5 };
        break;
      case 'large':
        valueStyle = { ...valueStyle, ...theme.typography.h2 };
        break;
      default:
        valueStyle = { ...valueStyle, ...theme.typography.h4 };
    }

    return { ...valueStyle, color: cardColor };
  };

  const CardComponent = onPress ? TouchableOpacity : View;

  return (
    <CardComponent
      style={[getCardStyle(), style]}
      onPress={onPress}
      activeOpacity={onPress ? 0.7 : 1}
    >
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          {icon && (
            <View style={[styles.iconContainer, { backgroundColor: cardColor + '20' }]}>
              {typeof icon === 'string' ? (
                <Text style={[styles.iconText, { color: cardColor }]}>{icon}</Text>
              ) : (
                icon
              )}
            </View>
          )}
          <Text style={[styles.title, theme.typography.body2]} numberOfLines={1}>
            {title}
          </Text>
        </View>
        
        {trend && (
          <View style={styles.trendContainer}>
            <Text style={[styles.trendIcon, { color: getTrendColor() }]}>
              {getTrendIcon()}
            </Text>
            <Text style={[styles.trendValue, { color: getTrendColor() }]}>
              {trend}
            </Text>
          </View>
        )}
      </View>

      <View style={styles.content}>
        <Text style={getValueStyle()} numberOfLines={1}>
          {value}
        </Text>
        
        {subtitle && (
          <Text style={[styles.subtitle, theme.typography.caption]} numberOfLines={2}>
            {subtitle}
          </Text>
        )}
      </View>
    </CardComponent>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    padding: 16,
    marginVertical: 4,
    marginHorizontal: 2,
    borderWidth: 1,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 2,
  },
  small: {
    padding: 12,
  },
  medium: {
    padding: 16,
  },
  large: {
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  iconText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  title: {
    flex: 1,
    opacity: 0.7,
  },
  trendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  trendIcon: {
    fontSize: 12,
    marginRight: 2,
  },
  trendValue: {
    fontSize: 10,
    fontWeight: '600',
  },
  content: {
    alignItems: 'flex-start',
  },
  value: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  subtitle: {
    opacity: 0.6,
  },
});

export default MetricCard;