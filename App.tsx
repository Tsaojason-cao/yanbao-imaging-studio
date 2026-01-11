import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// 导入屏幕
import HomeScreen from './src/screens/HomeScreen';
import CameraScreen from './src/screens/CameraScreen';
import EditScreen from './src/screens/EditScreen';
import GalleryScreen from './src/screens/GalleryScreen';
import PresetsScreen from './src/screens/PresetsScreen';

import { theme } from './src/config/theme';

const Stack = createStackNavigator();

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <StatusBar style="light" />
        <Stack.Navigator
          initialRouteName="Home"
          screenOptions={{
            headerShown: false,
            cardStyle: { backgroundColor: theme.colors.background },
            gestureEnabled: true,
            gestureDirection: 'horizontal',
          }}
        >
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Camera" component={CameraScreen} />
          <Stack.Screen name="Edit" component={EditScreen} />
          <Stack.Screen name="Gallery" component={GalleryScreen} />
          <Stack.Screen name="Presets" component={PresetsScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
