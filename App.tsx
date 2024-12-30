import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import RegisterScreen from './src/screens/RegisterScreen';
import LoginScreen from './src/screens/LoginScreen';
import HomeScreen from './src/screens/HomeScreen';

import { ClickProvider } from './src/context/ClickContext';

export type RootStackParamList = {
  Register: undefined;
  Login: undefined;
  Home: { username: string }; // Home screen expects a username as parameter
};

const Stack = createStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <ClickProvider> {/* Wrap the app in the ClickProvider to manage click count */}
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Login">

          {/* Register Screen */}
          <Stack.Screen 
            name="Register" 
            component={RegisterScreen} 
            options={{ title: 'Register' }} 
          />
          
          {/* Login Screen */}
          <Stack.Screen 
            name="Login" 
            component={LoginScreen} 
            options={{ title: 'Login' }} 
          />
          
          {/* Home Screen - Username is passed as route parameter */}
          <Stack.Screen 
            name="Home" 
            component={HomeScreen} 
            options={{ title: 'Home' }} 
          />
        </Stack.Navigator>
      </NavigationContainer>
    </ClickProvider>
  );
}
