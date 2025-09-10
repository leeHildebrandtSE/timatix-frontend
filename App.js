// App.js - Fixed for React Navigation + RN 0.79 / Expo 53
import React, { useEffect } from 'react';
import { StatusBar, Platform, LogBox, AppState } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { enableScreens } from 'react-native-screens';

// Context Providers
import { ThemeProvider } from './src/context/ThemeContext';
import { AuthProvider } from './src/context/AuthContext';
import { ErrorProvider } from './src/context/ErrorContext';
import { AppProvider } from './src/context/AppContext';

// Components
import ErrorBoundary from './src/components/common/ErrorBoundary';
import OfflineNotice from './src/components/common/OfflineNotice';
import NotificationToast from './src/components/common/NotificationToast';

// Navigation
import MainNavigator from './src/navigation/MainNavigator';

// Utils
import { globalErrorHandler } from './src/utils/errorHandler';
import { ROLES } from './src/constants/roles';

// Enable native screens for better performance
enableScreens();

// Ignore specific warnings in development
if (__DEV__) {
  LogBox.ignoreLogs([
    'Require cycle:',
    'Warning: componentWillReceiveProps',
    'Warning: componentWillMount',
    'Non-serializable values were found in the navigation state',
    'VirtualizedLists should never be nested',
    'Animated.event now requires a second argument',
    'Task orphaned for request',
  ]);
}

const App = () => {
  useEffect(() => {
    if (globalErrorHandler?.clearError && !global.clearError) {
      global.clearError = globalErrorHandler.clearError;
      console.log('🛡️ Global clearError handler installed');
    }

    console.log('🚀 TimatixMobile App Started');
    console.log('📱 Platform:', Platform.OS);
    console.log('🔧 Development Mode:', __DEV__);
    console.log('👥 Available Roles:', Object.values(ROLES));

    const subscription = AppState.addEventListener('change', (nextAppState) => {
      if (__DEV__) console.log('📱 App state changed to:', nextAppState);
      if (nextAppState === 'active') console.log('🔄 App became active - could refresh auth here');
    });

    return () => subscription?.remove();
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ErrorBoundary>
          <ThemeProvider>
            <ErrorProvider>
              <AuthProvider>
                <AppProvider>
                  <NavigationContainer
                    onError={(error) => {
                      console.error('🚨 Navigation Error:', error);
                      globalErrorHandler?.showError('Navigation error occurred');
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
    </GestureHandlerRootView>
  );
};

export default App;
