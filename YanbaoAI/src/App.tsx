/**
 * yanbao AI - 主应用组件
 * React Native + 原生模块混合架构
 */

import React from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  useColorScheme,
} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

// 导入屏幕组件
import HomeScreen from './screens/HomeScreen';
import CameraScreen from './screens/CameraScreen';
import EditorScreen from './screens/EditorScreen';
import GalleryScreen from './screens/GalleryScreen';
import MapScreen from './screens/MapScreen';
import MasterScreen from './screens/MasterScreen';

const Tab = createBottomTabNavigator();

// Leica 极简主题
const Colors = {
  dark: {
    background: '#1A1A2E',
    surface: '#16213E',
    primary: '#A33BFF',
    secondary: '#FF69B4',
    text: '#FFFFFF',
    textSecondary: '#B0B0B0',
  },
  light: {
    background: '#FFFFFF',
    surface: '#F5F5F5',
    primary: '#A33BFF',
    secondary: '#FF69B4',
    text: '#1A1A2E',
    textSecondary: '#666666',
  },
};

function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  const theme = isDarkMode ? Colors.dark : Colors.light;

  return (
    <SafeAreaView style={[styles.container, {backgroundColor: theme.background}]}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={theme.background}
      />
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={{
            headerShown: false,
            tabBarStyle: {
              backgroundColor: theme.surface,
              borderTopColor: theme.primary,
              borderTopWidth: 1,
            },
            tabBarActiveTintColor: theme.primary,
            tabBarInactiveTintColor: theme.textSecondary,
          }}>
          <Tab.Screen
            name="首页"
            component={HomeScreen}
            options={{
              tabBarLabel: '首页',
            }}
          />
          <Tab.Screen
            name="相机"
            component={CameraScreen}
            options={{
              tabBarLabel: '相机',
            }}
          />
          <Tab.Screen
            name="编辑"
            component={EditorScreen}
            options={{
              tabBarLabel: '编辑',
            }}
          />
          <Tab.Screen
            name="相册"
            component={GalleryScreen}
            options={{
              tabBarLabel: '相册',
            }}
          />
          <Tab.Screen
            name="地图"
            component={MapScreen}
            options={{
              tabBarLabel: '地图',
            }}
          />
          <Tab.Screen
            name="大师"
            component={MasterScreen}
            options={{
              tabBarLabel: '大师',
            }}
          />
        </Tab.Navigator>
      </NavigationContainer>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
