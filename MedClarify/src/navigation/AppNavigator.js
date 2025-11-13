import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../screens/HomeScreen';
import CameraScanScreen from '../screens/CameraScanScreen';
import TranslationScreen from '../screens/TranslationScreen';
import QAScreen from '../screens/QAScreen';

const Stack = createStackNavigator();

/**
 * Main navigation stack for the app
 */
const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerStyle: {
            backgroundColor: '#2196F3',
          },
          headerTintColor: '#FFFFFF',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{
            title: 'MedClarify',
          }}
        />

        <Stack.Screen
          name="CameraScan"
          component={CameraScanScreen}
          options={{
            title: 'Scan Document',
            headerShown: false,
          }}
        />

        <Stack.Screen
          name="Translation"
          component={TranslationScreen}
          options={{
            title: 'Document Translation',
          }}
        />

        <Stack.Screen
          name="QA"
          component={QAScreen}
          options={{
            title: 'Ask Questions',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
