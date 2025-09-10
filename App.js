// App.js - Updated for MainNavigator
import React, { useEffect } from 'react';
import { StatusBar, Platform, LogBox, AppState } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';

// Context Providers
import { ThemeProvider } from './src/context/ThemeContext';
import { AuthProvider } from './src/context/AuthContext';
import { ErrorProvider } from './src/context/ErrorContext';
import { AppProvider } from './src/context/AppContext';

// Components
import ErrorBoundary from './src/components/common/ErrorBoundary';
import OfflineNotice from './src/components/common/OfflineNotice';
import NotificationToast from './src/components/common/NotificationToast';

// Navigation - UPDATED TO USE MAINNAVIGATOR
import MainNavigator from './src/navigation/MainNavigator';

// Utils
import { globalErrorHandler } from './src/utils/errorHandler';

// Constants
import { ROLES } from './src/constants/roles';

// Ignore specific warnings in development
if (__DEV__) {
  LogBox.ignoreLogs([
    'Require cycle:', // Common in React Navigation
    'Warning: componentWillReceiveProps',
    'Warning: componentWillMount',
    'Non-serializable values were found in the navigation state', // React Navigation deep linking
    'VirtualizedLists should never be nested', // FlatList warnings
    'Animated.event now requires a second argument', // Animated warnings
    'Task orphaned for request', // Network request warnings
  ]);
}

const App = () => {
  // Set up global error handler and app state monitoring
  useEffect(() => {
    // Install global error handler
    if (globalErrorHandler?.clearError && !global.clearError) {
      global.clearError = globalErrorHandler.clearError;
      console.log('🛡️ Global clearError handler installed');
    }

    // Log app startup info
    console.log('🚀 TimatixMobile App Started');
    console.log('📱 Platform:', Platform.OS);
    console.log('🔧 Development Mode:', __DEV__);
    console.log('👥 Available Roles:', Object.values(ROLES));
    console.log('🧭 Using MainNavigator (Consolidated)');

    // Monitor app state changes (useful for auth token refresh)
    const handleAppStateChange = (nextAppState) => {
      if (__DEV__) {
        console.log('📱 App state changed to:', nextAppState);
      }
      
      // You could trigger auth token refresh here when app becomes active
      if (nextAppState === 'active') {
        // Optional: Refresh auth token or check connection
        console.log('🔄 App became active - could refresh auth here');
      }
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);

    // Cleanup subscription
    return () => {
      if (subscription?.remove) {
        subscription.remove();
      }
    };
  }, []);

  return (
    <SafeAreaProvider>
      <ErrorBoundary>
        <ThemeProvider>
          <ErrorProvider>
            <AuthProvider>
              <AppProvider>
                <NavigationContainer
                  onError={(error) => {
                    console.error('🚨 Navigation Error:', error);
                    if (globalErrorHandler?.showError) {
                      globalErrorHandler.showError('Navigation error occurred');
                    }
                  }}
                  onStateChange={(state) => {
                    if (__DEV__) {
                      // Optional: Log navigation state changes for debugging
                      const currentRoute = getCurrentRouteName(state);
                      if (currentRoute) {
                        console.log('📍 Current route:', currentRoute);
                      }
                    }
                  }}
                  onReady={() => {
                    if (__DEV__) {
                      console.log('🎯 Navigation container ready');
                    }
                  }}
                  linking={{
                    prefixes: ['timatix://', 'https://timatix.com'],
                    config: {
                      screens: {
                        // Auth screens
                        Login: 'login',
                        Register: 'register',
                        
                        // Client screens
                        ClientTabs: {
                          screens: {
                            Dashboard: 'home',
                            Vehicles: 'vehicles',
                            ServiceRequests: 'services',
                            Profile: 'profile',
                          },
                        },
                        
                        // Detail screens
                        VehicleDetails: 'vehicles/:vehicleId',
                        ServiceDetails: 'services/:serviceId',
                        QuoteDetails: 'quotes/:quoteId',
                        
                        // Mechanic screens
                        MechanicTabs: {
                          screens: {
                            Dashboard: 'workshop',
                            Jobs: 'jobs',
                            Quotes: 'quotes',
                            Profile: 'profile',
                          },
                        },
                        
                        // Admin screens
                        AdminTabs: {
                          screens: {
                            Dashboard: 'admin',
                            System: 'system',
                            Users: 'users',
                            Profile: 'profile',
                          },
                        },
                      },
                    },
                  }}
                >
                  <StatusBar 
                    barStyle={Platform.OS === 'ios' ? 'dark-content' : 'light-content'} 
                    backgroundColor="#FFFFFF"
                    translucent={false}
                  />
                  <OfflineNotice />
                  <MainNavigator />
                  <NotificationToast />
                </NavigationContainer>
              </AppProvider>
            </AuthProvider>
          </ErrorProvider>
        </ThemeProvider>
      </ErrorBoundary>
    </SafeAreaProvider>
  );
};

// Helper function to get current route name for debugging
const getCurrentRouteName = (navigationState) => {
  if (!navigationState) return null;
  
  const route = navigationState.routes[navigationState.index];
  
  // If this route has nested state, recursively get the current route
  if (route.state) {
    return getCurrentRouteName(route.state);
  }
  
  return route.name;
};

export default App;