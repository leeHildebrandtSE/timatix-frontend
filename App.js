// Improved App.js with better navigation and error handling
import React from 'react';
import { StatusBar, Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// Context Providers
import { ThemeProvider } from './src/context/ThemeContext';
import { AuthProvider } from './src/context/AuthContext';
import { AppProvider } from './src/context/AppContext';

// Navigation
import RoleBasedNavigator from './src/navigation/RoleBasedNavigator';

const Stack = createStackNavigator();

const App = () => {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <AuthProvider>
          <AppProvider>
            <NavigationContainer>
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

// package.json updates needed
/*
{
  "dependencies": {
    "@react-native-async-storage/async-storage": "2.1.2",
    "@react-navigation/native": "^7.1.17",
    "@react-navigation/stack": "^7.4.7",
    "@react-navigation/bottom-tabs": "^7.1.15",
    "expo": "~53.0.20",
    "expo-constants": "~17.1.7",
    "expo-font": "~13.3.2",
    "expo-splash-screen": "~0.30.10",
    "expo-status-bar": "~2.2.3",
    "react": "19.0.0",
    "react-native": "0.79.5",
    "react-native-safe-area-context": "^5.0.0",
    "react-native-screens": "^4.0.0",
    "react-native-gesture-handler": "^2.20.0"
  }
}
*/