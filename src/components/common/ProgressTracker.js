import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../context/ThemeContext';

const ProgressTracker = ({
  steps = [],
  currentStep = 0,
  style,
}) => {
  const { theme } = useTheme();

  const getStepStatus = (index) => {
    if (index < currentStep) return 'completed';
    if (index === currentStep) return 'active';
    return 'pending';
  };

  const getStepColor = (status) => {
    switch (status) {
      case 'completed': return theme.colors.success;
      case 'active': return theme.colors.primary;
      default: return theme.colors.border;
    }
  };

  return (
    <View style={[styles.container, style]}>
      {steps.map((step, index) => {
        const status = getStepStatus(index);
        const stepColor = getStepColor(status);
        const isLast = index === steps.length - 1;

        return (
          <View key={index} style={styles.stepContainer}>
            <View style={styles.stepContent}>
              <View
                style={[
                  styles.stepCircle,
                  {
                    backgroundColor: stepColor,
                    borderColor: stepColor,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.stepNumber,
                    {
                      color: status === 'pending' ? stepColor : theme.colors.white,
                    },
                  ]}
                >
                  {status === 'completed' ? '✓' : index + 1}
                </Text>
              </View>
              
              <View style={styles.stepTextContainer}>
                <Text
                  style={[
                    styles.stepTitle,
                    theme.typography.body2,
                    {
                      color: status === 'pending' ? theme.colors.textLight : theme.colors.text,
                    },
                  ]}
                >
                  {step.title}
                </Text>
                {step.subtitle && (
                  <Text
                    style={[
                      styles.stepSubtitle,
                      theme.typography.caption,
                      { color: theme.colors.textSecondary },
                    ]}
                  >
                    {step.subtitle}
                  </Text>
                )}
              </View>
            </View>

            {!isLast && (
              <View
                style={[
                  styles.stepLine,
                  {
                    backgroundColor: status === 'completed' ? theme.colors.success : theme.colors.border,
                  },
                ]}
              />
            )}
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
  },
  stepContainer: {
    position: 'relative',
  },
  stepContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
  },
  stepCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  stepNumber: {
    fontSize: 14,
    fontWeight: '600',
  },
  stepTextContainer: {
    flex: 1,
  },
  stepTitle: {
    marginBottom: 2,
  },
  stepSubtitle: {
    // Styles from theme
  },
  stepLine: {
    position: 'absolute',
    left: 15,
    top: 48,
    width: 2,
    height: 32,
  },
});

export default ProgressTracker;