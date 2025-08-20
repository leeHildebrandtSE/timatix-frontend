import React from 'react';
import { StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// Context Providers
import { ThemeProvider } from './src/context/ThemeContext';
import { AuthProvider } from './src/context/AuthContext';
import { AppProvider } from './src/context/AppContext';

// Screens
import LoginScreen from './src/screens/auth/LoginScreen';
import RegisterScreen from './src/screens/auth/RegisterScreen';
import ClientDashboard from './src/screens/client/Dashboard';

// Navigation
import RoleBasedNavigator from './src/navigation/RoleBasedNavigator';

const Stack = createStackNavigator();

const App = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppProvider>
          <NavigationContainer>
            <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
            <RootNavigator />
          </NavigationContainer>
        </AppProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};

const RootNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Main" component={RoleBasedNavigator} />
    </Stack.Navigator>
  );
};

export default App;