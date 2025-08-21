import React, { useContext } from 'react';
import { createStackNavigator } from '@react-navigation/stack';

// Context
import { AuthContext } from '../context/AuthContext';

// Screens
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import ClientDashboard from '../screens/client/Dashboard';
import WorkshopDashboard from '../screens/workshop/WorkshopDashboard';
import AdminDashboard from '../screens/admin/AdminDashboard';

const Stack = createStackNavigator();

const RoleBasedNavigator = () => {
  const { user } = useContext(AuthContext);

  // Determine initial route based on role
  let initialRouteName;
  let screens = [];

  if (!user) {
    initialRouteName = 'Login';
    screens = [
      { name: 'Login', component: LoginScreen },
      { name: 'Register', component: RegisterScreen },
    ];
  } else {
    switch (user.role) {
      case 'CLIENT':
        initialRouteName = 'ClientDashboard';
        screens = [
          { name: 'ClientDashboard', component: ClientDashboard },
          // add other client screens here
        ];
        break;

      case 'MECHANIC':
        initialRouteName = 'WorkshopDashboard';
        screens = [
          { name: 'WorkshopDashboard', component: WorkshopDashboard },
          // add other mechanic screens here
        ];
        break;

      case 'ADMIN':
        initialRouteName = 'AdminDashboard';
        screens = [
          { name: 'AdminDashboard', component: AdminDashboard },
          // add other admin screens here
        ];
        break;

      default:
        initialRouteName = 'Login';
        screens = [
          { name: 'Login', component: LoginScreen },
        ];
        break;
    }
  }

  return (
    <Stack.Navigator
      initialRouteName={initialRouteName}
      screenOptions={{ headerShown: false }}
    >
      {screens.map(screen => (
        <Stack.Screen
          key={screen.name}
          name={screen.name}
          component={screen.component}
        />
      ))}
    </Stack.Navigator>
  );
};

export default RoleBasedNavigator;
