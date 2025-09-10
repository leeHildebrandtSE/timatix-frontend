// src/components/common/FilterChip.js - UPDATED to use globalStyles
import React from 'react';
import { TouchableOpacity, Text, View } from 'react-native';
import { useTheme, useGlobalStyles } from '../../context/ThemeContext';

const FilterChip = ({
  title,
  active = false,
  onPress,
  style,
  textStyle,
  disabled = false,
  variant = 'default', // 'default', 'outline', 'solid'
  size = 'medium', // 'small', 'medium', 'large'
  icon,
  count,
  removable = false,
  onRemove,
  priority, // 'urgent', 'high', 'normal', 'low'
  status, // 'success', 'warning', 'error', 'info'
  ...props
}) => {
  const { theme } = useTheme();
  const globalStyles = useGlobalStyles();

  const getChipStyles = () => {
    const styles = [globalStyles.filterChipBase];

    // Size styles
    switch (size) {
      case 'small':
        styles.push(globalStyles.filterChipSmall);
        break;
      case 'large':
        styles.push(globalStyles.filterChipLarge);
        break;
      default:
        styles.push(globalStyles.filterChipMedium);
    }

    // Variant styles
    switch (variant) {
      case 'outline':
        styles.push(active ? globalStyles.filterChipOutlineActive : globalStyles.filterChipOutline);
        break;
      case 'solid':
        styles.push(active ? globalStyles.filterChipSolidActive : globalStyles.filterChipSolid);
        break;
      default:
        styles.push(active ? globalStyles.filterChipDefaultActive : globalStyles.filterChipDefault);
    }

    // Priority styles (overrides variant)
    if (priority) {
      switch (priority.toLowerCase()) {
        case 'urgent':
          styles.push(globalStyles.filterChipPriorityUrgent);
          break;
        case 'high':
          styles.push(globalStyles.filterChipPriorityHigh);
          break;
        case 'normal':
          styles.push(globalStyles.filterChipPriorityNormal);
          break;
        case 'low':
          styles.push(globalStyles.filterChipPriorityLow);
          break;
      }
    }

    // Status styles (overrides variant)
    if (status) {
      switch (status.toLowerCase()) {
        case 'success':
          styles.push(globalStyles.filterChipStatusSuccess);
          break;
        case 'warning':
          styles.push(globalStyles.filterChipStatusWarning);
          break;
        case 'error':
          styles.push(globalStyles.filterChipStatusError);
          break;
        case 'info':
          styles.push(globalStyles.filterChipStatusInfo);
          break;
      }
    }

    // Disabled state
    if (disabled) {
      styles.push(globalStyles.filterChipDisabled);
    }

    return styles;
  };

  const getTextStyles = () => {
    const styles = [globalStyles.filterChipTextBase];

    // Size text styles
    switch (size) {
      case 'small':
        styles.push(globalStyles.filterChipTextSmall);
        break;
      case 'large':
        styles.push(globalStyles.filterChipTextLarge);
        break;
      default:
        styles.push(globalStyles.filterChipTextMedium);
    }

    // Variant text styles
    if (!priority && !status) { // Don't apply variant text colors if priority/status is set
      switch (variant) {
        case 'outline':
          styles.push(active ? globalStyles.filterChipTextOutlineActive : globalStyles.filterChipTextOutline);
          break;
        case 'solid':
          styles.push(active ? globalStyles.filterChipTextSolidActive : globalStyles.filterChipTextSolid);
          break;
        default:
          styles.push(active ? globalStyles.filterChipTextDefaultActive : globalStyles.filterChipTextDefault);
      }
    } else {
      // For priority and status chips, always use white text
      styles.push(globalStyles.filterChipTextSolid);
    }

    // Disabled state
    if (disabled) {
      styles.push(globalStyles.filterChipTextDisabled);
    }

    return styles;
  };

  const getIconStyles = () => {
    const styles = [globalStyles.filterChipIcon];

    switch (size) {
      case 'small':
        styles.push(globalStyles.filterChipIconSmall);
        break;
      case 'large':
        styles.push(globalStyles.filterChipIconLarge);
        break;
    }

    return styles;
  };

  const getCountBadgeStyles = () => {
    const styles = [globalStyles.filterChipCountBadge];

    switch (size) {
      case 'small':
        styles.push(globalStyles.filterChipCountBadgeSmall);
        break;
      case 'large':
        styles.push(globalStyles.filterChipCountBadgeLarge);
        break;
    }

    return styles;
  };

  const getCountTextStyles = () => {
    const styles = [globalStyles.filterChipCountText];

    switch (size) {
      case 'small':
        styles.push(globalStyles.filterChipCountTextSmall);
        break;
      case 'large':
        styles.push(globalStyles.filterChipCountTextLarge);
        break;
    }

    return styles;
  };

  const handlePress = () => {
    if (!disabled && onPress) {
      onPress();
    }
  };

  const handleRemove = (event) => {
    event.stopPropagation();
    if (onRemove) {
      onRemove();
    }
  };

  return (
    <TouchableOpacity
      style={[...getChipStyles(), style]}
      onPress={handlePress}
      disabled={disabled}
      activeOpacity={disabled ? 1 : 0.7}
      {...props}
    >
      <View style={globalStyles.filterChipContent}>
        {/* Icon */}
        {icon && (
          <View style={globalStyles.filterChipIconContainer}>
            {typeof icon === 'string' ? (
              <Text style={getIconStyles()}>
                {icon}
              </Text>
            ) : (
              icon
            )}
          </View>
        )}

        {/* Title */}
        <Text style={[...getTextStyles(), textStyle]} numberOfLines={1}>
          {title}
        </Text>

        {/* Count Badge */}
        {count !== undefined && count !== null && (
          <View style={getCountBadgeStyles()}>
            <Text style={getCountTextStyles()}>{count}</Text>
          </View>
        )}

        {/* Remove Button */}
        {removable && (
          <TouchableOpacity
            style={globalStyles.filterChipRemoveButton}
            onPress={handleRemove}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Text style={[globalStyles.filterChipRemoveIcon, { color: getTextStyles()[0].color }]}>
              ✕
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );
};

// Preset filter chips for common use cases
FilterChip.Status = ({ status, active, onPress, ...props }) => (
  <FilterChip
    title={status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
    status={getStatusType(status)}
    active={active}
    onPress={onPress}
    {...props}
  />
);

FilterChip.Priority = ({ priority, active, onPress, ...props }) => (
  <FilterChip
    title={priority.charAt(0).toUpperCase() + priority.slice(1).toLowerCase()}
    priority={priority.toLowerCase()}
    active={active}
    onPress={onPress}
    {...props}
  />
);

FilterChip.Category = ({ category, active, onPress, ...props }) => (
  <FilterChip
    title={category}
    variant="default"
    active={active}
    onPress={onPress}
    {...props}
  />
);

FilterChip.Quick = ({ title, active, onPress, ...props }) => (
  <FilterChip
    title={title}
    variant="solid"
    active={active}
    onPress={onPress}
    {...props}
  />
);

// Helper function to map service status to visual status type
const getStatusType = (status) => {
  const statusMap = {
    'COMPLETED': 'success',
    'APPROVED': 'success',
    'CONFIRMED': 'info',
    'IN_PROGRESS': 'info',
    'PENDING_QUOTE': 'warning',
    'QUOTE_SENT': 'warning',
    'DECLINED': 'error',
    'CANCELLED': 'error',
  };
  return statusMap[status] || 'info';
};

export default FilterChip;