// App.js - Emergency fix with global error handler
import React, { useEffect } from 'react';
import { StatusBar, Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// Import the global error handler FIRST
import { globalErrorHandler } from './src/utils/errorHandler';

// Context Providers
import { ThemeProvider } from './src/context/ThemeContext';
import { AuthProvider } from './src/context/AuthContext';
import { AppProvider } from './src/context/AppContext';

// Navigation
import RoleBasedNavigator from './src/navigation/RoleBasedNavigator';

const Stack = createStackNavigator();

const App = () => {
  // Set up global error handler immediately
  useEffect(() => {
    // Make clearError available globally to prevent navigation crashes
    if (!global.clearError) {
      global.clearError = globalErrorHandler.clearError;
      console.log('🛡️ Global clearError handler installed');
    }
  }, []);

  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <AuthProvider>
          <AppProvider>
            <NavigationContainer
              onError={(error) => {
                console.error('🚨 Navigation Error:', error);
                // Use global error handler instead of crashing
                globalErrorHandler.showError(error.message);
              }}
              onStateChange={(state) => {
                console.log('📍 Navigation state changed');
              }}
            >
              <StatusBar 
                barStyle={Platform.OS === 'ios' ? 'dark-content' : 'light-content'} 
                backgroundColor="#FFFFFF" 
                translucent={false}
              />
              <RootNavigator />
            </NavigationContainer>
          </AppProvider>
        </AuthProvider>
      </ThemeProvider>
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