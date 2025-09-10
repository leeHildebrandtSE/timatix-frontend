// src/hoc/withScreenLayout.js
import React from 'react';
import {
  View,
  ScrollView,
  RefreshControl,
  StatusBar,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme, useGlobalStyles } from '../context/ThemeContext';
import LoadingSpinner from '../components/common/LoadingSpinner';

// Dashboard layout with welcome header
export const withDashboardLayout = (WrappedComponent) => {
  return (props) => {
    const { theme } = useTheme();
    const globalStyles = useGlobalStyles();

    return (
      <SafeAreaView 
        style={[globalStyles.safeArea]} 
        edges={['top', 'left', 'right']}
      >
        <StatusBar 
          barStyle={theme.isDark ? 'light-content' : 'dark-content'} 
          backgroundColor={theme.colors.background}
          translucent={Platform.OS === 'android'}
        />
        <WrappedComponent {...props} />
      </SafeAreaView>
    );
  };
};

// Standard list screen layout
export const withListLayout = (WrappedComponent) => {
  return (props) => {
    const { theme } = useTheme();
    const globalStyles = useGlobalStyles();

    return (
      <SafeAreaView style={globalStyles.safeArea}>
        <StatusBar 
          barStyle={theme.isDark ? 'light-content' : 'dark-content'} 
          backgroundColor={theme.colors.background}
        />
        <WrappedComponent {...props} />
      </SafeAreaView>
    );
  };
};

// Form screen layout
export const withFormLayout = (WrappedComponent) => {
  return (props) => {
    const { theme } = useTheme();
    const globalStyles = useGlobalStyles();

    return (
      <SafeAreaView style={globalStyles.safeArea}>
        <StatusBar 
          barStyle={theme.isDark ? 'light-content' : 'dark-content'} 
          backgroundColor={theme.colors.background}
        />
        <WrappedComponent {...props} />
      </SafeAreaView>
    );
  };
};

// Loading state wrapper
export const withLoadingState = (WrappedComponent) => {
  return ({ isLoading, loadingMessage, ...props }) => {
    const { theme } = useTheme();
    const globalStyles = useGlobalStyles();

    if (isLoading) {
      return (
        <SafeAreaView style={globalStyles.safeArea}>
          <LoadingSpinner message={loadingMessage} />
        </SafeAreaView>
      );
    }

    return <WrappedComponent {...props} />;
  };
};

// Refresh control wrapper
export const withRefreshControl = (WrappedComponent) => {
  return ({ onRefresh, refreshing, ...props }) => {
    return (
      <WrappedComponent 
        {...props}
        refreshControl={
          onRefresh ? (
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          ) : undefined
        }
      />
    );
  };
};

// Complete screen wrapper combining multiple HOCs
export const withScreenWrapper = (WrappedComponent, options = {}) => {
  const {
    layout = 'standard', // 'standard', 'dashboard', 'list', 'form'
    loading = false,
    refresh = false,
  } = options;

  let Component = WrappedComponent;

  // Apply loading wrapper
  if (loading) {
    Component = withLoadingState(Component);
  }

  // Apply refresh wrapper
  if (refresh) {
    Component = withRefreshControl(Component);
  }

  // Apply layout wrapper
  switch (layout) {
    case 'dashboard':
      Component = withDashboardLayout(Component);
      break;
    case 'list':
      Component = withListLayout(Component);
      break;
    case 'form':
      Component = withFormLayout(Component);
      break;
    default:
      Component = withListLayout(Component); // Default to standard layout
  }

  return Component;
};

// Common screen components
export const ScreenHeader = ({ title, actions, style }) => {
  const globalStyles = useGlobalStyles();
  
  return (
    <View style={[globalStyles.header, style]}>
      <Text style={globalStyles.headerTitle}>{title}</Text>
      {actions && <View style={globalStyles.headerButton}>{actions}</View>}
    </View>
  );
};

export const WelcomeHeader = ({ 
  user, 
  greeting, 
  subtitle, 
  rightWidget, 
  backgroundColor,
  style 
}) => {
  const { theme } = useTheme();
  const globalStyles = useGlobalStyles();
  
  return (
    <View 
      style={[
        globalStyles.welcomeHeader, 
        { backgroundColor: backgroundColor || theme.colors.primary },
        style
      ]}
    >
      <View style={globalStyles.welcomeContent}>
        <View style={globalStyles.greetingContainer}>
          <Text style={globalStyles.greeting}>
            {greeting || `Good ${getTimeOfDayGreeting()}, ${user?.firstName}! 👋`}
          </Text>
          <Text style={globalStyles.subGreeting}>
            {subtitle}
          </Text>
        </View>
        
        {rightWidget && (
          <View>{rightWidget}</View>
        )}
      </View>
    </View>
  );
};

export const SectionContainer = ({ title, children, background = false, style }) => {
  const globalStyles = useGlobalStyles();
  const containerStyle = background ? globalStyles.sectionWithBackground : globalStyles.section;
  
  return (
    <View style={[containerStyle, style]}>
      {title && <Text style={globalStyles.sectionTitle}>{title}</Text>}
      {children}
    </View>
  );
};

export const QuickActionsGrid = ({ actions, style }) => {
  const globalStyles = useGlobalStyles();
  
  return (
    <View style={[globalStyles.quickActionsContainer, style]}>
      <View style={globalStyles.quickActions}>
        {actions.map((action, index) => (
          <TouchableOpacity
            key={index}
            style={[
              globalStyles.quickActionCard,
              { backgroundColor: action.color || '#007AFF' }
            ]}
            onPress={action.onPress}
          >
            <View style={globalStyles.quickActionIcon}>
              <Text style={globalStyles.quickActionIconText}>{action.icon}</Text>
            </View>
            <Text style={[globalStyles.quickActionTitle, { color: '#fff' }]}>
              {action.title}
            </Text>
            <Text style={[globalStyles.quickActionSubtitle, { color: 'rgba(255,255,255,0.8)' }]}>
              {action.subtitle}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

export const MetricsGrid = ({ metrics, style }) => {
  const globalStyles = useGlobalStyles();
  
  return (
    <View style={[globalStyles.metricsContainer, style]}>
      <View style={globalStyles.metricsGrid}>
        {metrics.map((metric, index) => (
          <MetricCard
            key={index}
            {...metric}
            style={[
              globalStyles.metricCard,
              metric.size === 'large' && globalStyles.largeCard
            ]}
          />
        ))}
      </View>
    </View>
  );
};

export const EmptyState = ({ icon, title, subtitle, action, style }) => {
  const globalStyles = useGlobalStyles();
  
  return (
    <View style={[globalStyles.emptyState, style]}>
      {icon && <Text style={globalStyles.emptyStateIcon}>{icon}</Text>}
      <Text style={globalStyles.emptyStateTitle}>{title}</Text>
      <Text style={globalStyles.emptyStateText}>{subtitle}</Text>
      {action && (
        <View style={globalStyles.emptyStateButton}>
          {action}
        </View>
      )}
    </View>
  );
};

// Utility functions
const getTimeOfDayGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return 'morning';
  if (hour < 17) return 'afternoon';
  return 'evening';
};

export default {
  withDashboardLayout,
  withListLayout,
  withFormLayout,
  withLoadingState,
  withRefreshControl,
  withScreenWrapper,
  ScreenHeader,
  WelcomeHeader,
  SectionContainer,
  QuickActionsGrid,
  MetricsGrid,
  EmptyState,
};