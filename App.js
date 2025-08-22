// App.js - Final complete integration
import React, { useEffect } from 'react';
import { StatusBar, Platform, LogBox } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// Context Providers
import { ThemeProvider } from './src/context/ThemeContext';
import { AuthProvider } from './src/context/AuthContext';
import { ErrorProvider } from './src/context/ErrorContext';
import { AppProvider } from './src/context/AppContext';

// Components
import ErrorBoundary from './src/components/common/ErrorBoundary';
import OfflineNotice from './src/components/common/OfflineNotice';

// Navigation
import RoleBasedNavigator from './src/navigation/RoleBasedNavigator';

// Utils
import { globalErrorHandler } from './src/utils/errorHandler';

// Ignore specific warnings in development
if (__DEV__) {
  LogBox.ignoreLogs([
    'Require cycle:', // Common in React Navigation
    'Warning: componentWillReceiveProps',
    'Warning: componentWillMount',
  ]);
}

const Stack = createStackNavigator();

const App = () => {
  // Set up global error handler immediately
  useEffect(() => {
    // Make clearError available globally to prevent navigation crashes
    if (!global.clearError) {
      global.clearError = globalErrorHandler.clearError;
      console.log('🛡️ Global clearError handler installed');
    }

    // Log app startup
    console.log('🚀 TimatixMobile App Started');
    console.log('📱 Platform:', Platform.OS);
    console.log('🔧 Development Mode:', __DEV__);
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
                    globalErrorHandler.showError(error.message);
                  }}
                  onStateChange={(state) => {
                    if (__DEV__) {
                      console.log('📍 Navigation state changed');
                    }
                  }}
                >
                  <StatusBar 
                    barStyle={Platform.OS === 'ios' ? 'dark-content' : 'light-content'} 
                    backgroundColor="#FFFFFF" 
                    translucent={false}
                  />
                  <OfflineNotice />
                  <RootNavigator />
                </NavigationContainer>
              </AppProvider>
            </AuthProvider>
          </ErrorProvider>
        </ThemeProvider>
      </ErrorBoundary>
    </SafeAreaProvider>
  );
};

const RootNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        gestureEnabled: true,
        cardStyleInterpolator: ({ current, layouts }) => {
          return {
            cardStyle: {
              transform: [
                {
                  translateX: current.progress.interpolate({
                    inputRange: [0, 1],
                    outputRange: [layouts.screen.width, 0],
                  }),
                },
              ],
            },
          };
        },
      }}
    >
      <Stack.Screen name="Main" component={RoleBasedNavigator} />
    </Stack.Navigator>
  );
};

export default App;