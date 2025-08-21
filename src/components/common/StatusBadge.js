import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { SERVICE_STATUS, SERVICE_PHASES } from '../../utils/constants';

const StatusBadge = ({ status, variant = 'default', size = 'medium', style }) => {
  const { theme } = useTheme();

  const getStatusConfig = (status) => {
    const statusMap = {
      // Service Request Status
      [SERVICE_STATUS.PENDING_QUOTE]: {
        color: theme.colors.warning,
        backgroundColor: `${theme.colors.warning}20`,
        label: 'Pending Quote',
      },
      [SERVICE_STATUS.QUOTE_SENT]: {
        color: theme.colors.info,
        backgroundColor: `${theme.colors.info}20`,
        label: 'Quote Sent',
      },
      [SERVICE_STATUS.APPROVED]: {
        color: theme.colors.success,
        backgroundColor: `${theme.colors.success}20`,
        label: 'Approved',
      },
      [SERVICE_STATUS.DECLINED]: {
        color: theme.colors.error,
        backgroundColor: `${theme.colors.error}20`,
        label: 'Declined',
      },
      [SERVICE_STATUS.CONFIRMED]: {
        color: theme.colors.primary,
        backgroundColor: `${theme.colors.primary}20`,
        label: 'Confirmed',
      },
      [SERVICE_STATUS.IN_PROGRESS]: {
        color: theme.colors.primary,
        backgroundColor: `${theme.colors.primary}20`,
        label: 'In Progress',
      },
      [SERVICE_STATUS.COMPLETED]: {
        color: theme.colors.success,
        backgroundColor: `${theme.colors.success}20`,
        label: 'Completed',
      },
      [SERVICE_STATUS.CANCELLED]: {
        color: theme.colors.error,
        backgroundColor: `${theme.colors.error}20`,
        label: 'Cancelled',
      },
      
      // Service Phases
      [SERVICE_PHASES.RECEIVED]: {
        color: theme.colors.info,
        backgroundColor: `${theme.colors.info}20`,
        label: 'Received',
      },
      [SERVICE_PHASES.DIAGNOSIS]: {
        color: theme.colors.warning,
        backgroundColor: `${theme.colors.warning}20`,
        label: 'Diagnosis',
      },
      [SERVICE_PHASES.REPAIR_IN_PROGRESS]: {
        color: theme.colors.primary,
        backgroundColor: `${theme.colors.primary}20`,
        label: 'Repair in Progress',
      },
      [SERVICE_PHASES.TESTING]: {
        color: theme.colors.info,
        backgroundColor: `${theme.colors.info}20`,
        label: 'Testing',
      },
      [SERVICE_PHASES.CLEANING]: {
        color: theme.colors.secondary,
        backgroundColor: `${theme.colors.secondary}20`,
        label: 'Cleaning',
      },
      [SERVICE_PHASES.READY_FOR_COLLECTION]: {
        color: theme.colors.success,
        backgroundColor: `${theme.colors.success}20`,
        label: 'Ready for Collection',
      },
    };

    return statusMap[status] || {
      color: theme.colors.textSecondary,
      backgroundColor: `${theme.colors.textSecondary}20`,
      label: status || 'Unknown',
    };
  };

  const config = getStatusConfig(status);

  const getBadgeStyle = () => {
    let badgeStyle = {
      ...styles.badge,
      backgroundColor: config.backgroundColor,
    };

    // Size variations
    switch (size) {
      case 'small':
        badgeStyle = { ...badgeStyle, ...styles.small };
        break;
      case 'large':
        badgeStyle = { ...badgeStyle, ...styles.large };
        break;
      default:
        badgeStyle = { ...badgeStyle, ...styles.medium };
    }

    // Variant styles
    switch (variant) {
      case 'solid':
        badgeStyle = {
          ...badgeStyle,
          backgroundColor: config.color,
        };
        break;
      case 'outline':
        badgeStyle = {
          ...badgeStyle,
          backgroundColor: 'transparent',
          borderWidth: 1,
          borderColor: config.color,
        };
        break;
    }

    return badgeStyle;
  };

  const getTextStyle = () => {
    let textStyle = {
      color: config.color,
      fontWeight: '600',
    };

    // Size text variations
    switch (size) {
      case 'small':
        textStyle = { ...textStyle, fontSize: 10 };
        break;
      case 'large':
        textStyle = { ...textStyle, fontSize: 14 };
        break;
      default:
        textStyle = { ...textStyle, fontSize: 12 };
    }

    // Variant text colors
    if (variant === 'solid') {
      textStyle.color = theme.colors.white;
    }

    return textStyle;
  };

  return (
    <View style={[getBadgeStyle(), style]}>
      <Text style={getTextStyle()}>{config.label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
    alignItems: 'center',
    justifyContent: 'center',
  },
  small: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  medium: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  large: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
});

export default StatusBadge;