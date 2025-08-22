// App.js - Updated with proper error handling
import React from 'react';
import { StatusBar, Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// Context Providers
import { ThemeProvider } from './src/context/ThemeContext';
import { AuthProvider } from './src/context/AuthContext';
import { AppProvider } from './src/context/AppContext';
import { ErrorProvider } from './src/context/ErrorContext'; // Add this if missing

// Navigation
import RoleBasedNavigator from './src/navigation/RoleBasedNavigator';

// Debug components (remove in production)
import ForceLogout from './src/components/debug/ForceLogout';

const Stack = createStackNavigator();

const App = () => {
  return (
    <SafeAreaProvider>
      <ErrorProvider>
        <ThemeProvider>
          <AuthProvider>
            <AppProvider>
              <NavigationContainer
                onError={(error) => {
                  console.error('🚨 Navigation Error:', error);
                  // Don't crash the app, just log the error
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
      </ErrorProvider>
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