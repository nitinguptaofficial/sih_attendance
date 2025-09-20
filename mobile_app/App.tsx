import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar, useColorScheme, LogBox } from 'react-native';
import Toast from 'react-native-toast-message';

// Ignore specific warnings if they're causing issues
LogBox.ignoreLogs(['Require cycle:']);

import HomeScreen from './src/screens/HomeScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import MarkAttendanceScreen from './src/screens/MarkAttendanceScreen';

const Stack = createNativeStackNavigator();

const App = () => {
  const isDarkMode = useColorScheme() === 'dark';

  useEffect(() => {
    console.log('App mounted');
  }, []);

  return (
    <SafeAreaProvider>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor="#fff"
      />
      <NavigationContainer
        onStateChange={state => console.log('New navigation state:', state)}
      >
        <Stack.Navigator
          initialRouteName="Home"
          screenOptions={{
            headerStyle: {
              backgroundColor: '#fff',
            },
            headerTintColor: '#000',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
        >
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={{ title: 'Home' }}
          />
          <Stack.Screen
            name="Register"
            component={RegisterScreen}
            options={{ title: 'Register New User' }}
          />
          <Stack.Screen
            name="MarkAttendance"
            component={MarkAttendanceScreen}
            options={{ title: 'Mark Attendance' }}
          />
        </Stack.Navigator>
      </NavigationContainer>
      <Toast />
    </SafeAreaProvider>
  );
};

export default App;
