import React from 'react';
import { View, Text } from 'react-native';
import { useTheme, useGlobalStyles } from '../../context/ThemeContext';
import { SERVICE_STATUS, SERVICE_PHASES } from '../../utils/constants';

const StatusBadge = ({ 
  status, 
  variant = 'solid', 
  size = 'medium', 
  style 
}) => {
  const { theme } = useTheme();
  const globalStyles = useGlobalStyles();

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

  const getBadgeStyles = () => {
    let badgeStyles = [globalStyles.statusBadge];

    // Size variations
    switch (size) {
      case 'small':
        badgeStyles.push(globalStyles.statusBadgeSmall);
        break;
      case 'large':
        badgeStyles.push(globalStyles.statusBadgeLarge);
        break;
      default:
        // Medium is the base size
        break;
    }

    // Variant styles
    switch (variant) {
      case 'solid':
        badgeStyles.push({
          ...globalStyles.statusBadgeSolid,
          backgroundColor: config.color,
        });
        break;
      case 'outline':
        badgeStyles.push({
          ...globalStyles.statusBadgeOutline,
          borderColor: config.color,
        });
        break;
      default:
        // Default uses the config background color
        badgeStyles.push({
          backgroundColor: config.backgroundColor,
        });
        break;
    }

    return badgeStyles;
  };

  const getTextStyles = () => {
    let textStyles = [globalStyles.statusBadgeText];

    // Size text variations
    switch (size) {
      case 'small':
        textStyles.push(globalStyles.statusBadgeTextSmall);
        break;
      case 'large':
        textStyles.push(globalStyles.statusBadgeTextLarge);
        break;
      default:
        // Medium is the base size
        break;
    }

    // Text color based on variant
    const textColor = variant === 'solid' ? 
      theme.colors.white : 
      config.color;

    textStyles.push({ color: textColor });

    return textStyles;
  };

  return (
    <View style={[...getBadgeStyles(), style]}>
      <Text style={getTextStyles()}>
        {config.label}
      </Text>
    </View>
  );
};

export default StatusBadge;