import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
  StatusBar,
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// Import screens
import CameraScreen from './CameraScreen';
import EditorScreen from './EditorScreen';
import GalleryScreen from './GalleryScreen';
import MapScreen from './MapScreen';

const Tab = createBottomTabNavigator();

// Home Screen
function HomeScreen() {
  const [showCamera, setShowCamera] = useState(false);
  const [showEditor, setShowEditor] = useState(false);
  const [showGallery, setShowGallery] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0a0a1e" />
      
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Hello, Yanbao 👋</Text>
          <Text style={styles.subtitle}>让每一刻都闪耀</Text>
        </View>
        <TouchableOpacity style={styles.settingsButton}>
          <Text style={styles.settingsIcon}>⚙️</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Main Features */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>✨ 主要功能</Text>
          <View style={styles.featuresGrid}>
            <TouchableOpacity 
              style={[styles.featureCard, styles.featureCardPrimary]}
              onPress={() => setShowCamera(true)}
            >
              <Text style={styles.featureIcon}>📷</Text>
              <Text style={styles.featureTitle}>相机</Text>
              <Text style={styles.featureSubtitle}>ProCam Beauty</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.featureCard, styles.featureCardSecondary]}
              onPress={() => setShowGallery(true)}
            >
              <Text style={styles.featureIcon}>🖼️</Text>
              <Text style={styles.featureTitle}>相册</Text>
              <Text style={styles.featureSubtitle}>照片管理</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.featureCard, styles.featureCardTertiary]}
              onPress={() => setShowEditor(true)}
            >
              <Text style={styles.featureIcon}>✨</Text>
              <Text style={styles.featureTitle}>编辑</Text>
              <Text style={styles.featureSubtitle}>滤镜调色</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.featureCard, styles.featureCardQuaternary]}
              onPress={() => setShowMap(true)}
            >
              <Text style={styles.featureIcon}>📍</Text>
              <Text style={styles.featureTitle}>推荐</Text>
              <Text style={styles.featureSubtitle}>拍摄地点</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Stats */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📊 数据统计</Text>
          <View style={styles.statsContainer}>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>156</Text>
              <Text style={styles.statLabel}>总编辑数</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>2.3GB</Text>
              <Text style={styles.statLabel}>已用空间</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>23</Text>
              <Text style={styles.statLabel}>配方数</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>45</Text>
              <Text style={styles.statLabel}>收藏照片</Text>
            </View>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>⚡ 快速操作</Text>
          <View style={styles.quickActions}>
            <TouchableOpacity style={styles.quickActionButton}>
              <Text style={styles.quickActionIcon}>🎨</Text>
              <Text style={styles.quickActionText}>最近编辑</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.quickActionButton}>
              <Text style={styles.quickActionIcon}>❤️</Text>
              <Text style={styles.quickActionText}>我的收藏</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.quickActionButton}>
              <Text style={styles.quickActionIcon}>💾</Text>
              <Text style={styles.quickActionText}>我的配方</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Made with ❤️ by Jason Tsao</Text>
          <Text style={styles.footerSubtext}>for Yanbao</Text>
        </View>
      </ScrollView>

      {/* Modals */}
      <Modal visible={showCamera} animationType="slide" presentationStyle="fullScreen">
        <CameraScreen 
          onClose={() => setShowCamera(false)}
          onPhotoTaken={(photo: any) => {
            setSelectedImage(photo.path);
            setShowCamera(false);
            setShowEditor(true);
          }}
        />
      </Modal>

      <Modal visible={showEditor} animationType="slide" presentationStyle="fullScreen">
        <EditorScreen 
          imageUri={selectedImage}
          onClose={() => setShowEditor(false)}
          onSave={() => {
            setShowEditor(false);
            setSelectedImage(null);
          }}
        />
      </Modal>

      <Modal visible={showGallery} animationType="slide" presentationStyle="fullScreen">
        <GalleryScreen 
          onClose={() => setShowGallery(false)}
          onPhotoSelect={(photo: any) => {
            setSelectedImage(photo.uri);
            setShowGallery(false);
            setShowEditor(true);
          }}
        />
      </Modal>

      <Modal visible={showMap} animationType="slide" presentationStyle="fullScreen">
        <MapScreen onClose={() => setShowMap(false)} />
      </Modal>
    </View>
  );
}

// Stats Screen
function StatsScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>数据统计</Text>
      </View>
      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📈 本月趋势</Text>
          <View style={styles.trendCard}>
            <Text style={styles.trendValue}>+32%</Text>
            <Text style={styles.trendLabel}>编辑次数增长</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🎯 使用习惯</Text>
          <View style={styles.habitCard}>
            <Text style={styles.habitText}>• 最常用滤镜: 霓虹 💜</Text>
            <Text style={styles.habitText}>• 最常拍摄时间: 傍晚 🌅</Text>
            <Text style={styles.habitText}>• 最爱拍摄地点: 外滩 🌃</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

// Settings Screen
function SettingsScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>设置</Text>
      </View>
      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>👤 账号</Text>
          <TouchableOpacity style={styles.settingItem}>
            <Text style={styles.settingText}>个人信息</Text>
            <Text style={styles.settingArrow}>›</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🎨 主题</Text>
          <TouchableOpacity style={styles.settingItem}>
            <Text style={styles.settingText}>Kuromi Queen 💜</Text>
            <Text style={styles.settingArrow}>›</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📱 关于</Text>
          <View style={styles.settingItem}>
            <Text style={styles.settingText}>版本</Text>
            <Text style={styles.settingValue}>1.0.0</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

// Main App
export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={{
            headerShown: false,
            tabBarStyle: styles.tabBar,
            tabBarActiveTintColor: '#A33BFF',
            tabBarInactiveTintColor: '#666',
            tabBarLabelStyle: styles.tabBarLabel,
          }}
        >
          <Tab.Screen 
            name="Home" 
            component={HomeScreen}
            options={{
              tabBarLabel: '首页',
              tabBarIcon: ({ color }) => <Text style={{ fontSize: 24 }}>🏠</Text>,
            }}
          />
          <Tab.Screen 
            name="Stats" 
            component={StatsScreen}
            options={{
              tabBarLabel: '统计',
              tabBarIcon: ({ color }) => <Text style={{ fontSize: 24 }}>📊</Text>,
            }}
          />
          <Tab.Screen 
            name="Settings" 
            component={SettingsScreen}
            options={{
              tabBarLabel: '设置',
              tabBarIcon: ({ color }) => <Text style={{ fontSize: 24 }}>⚙️</Text>,
            }}
          />
        </Tab.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a1e',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: '#1a1a2e',
  },
  greeting: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '700',
  },
  subtitle: {
    color: '#A33BFF',
    fontSize: 14,
    marginTop: 4,
  },
  title: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '700',
  },
  settingsButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingsIcon: {
    fontSize: 24,
  },
  content: {
    flex: 1,
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 15,
  },
  featureCard: {
    width: '47%',
    aspectRatio: 1,
    borderRadius: 20,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  featureCardPrimary: {
    backgroundColor: 'rgba(163, 59, 255, 0.2)',
    borderWidth: 2,
    borderColor: '#A33BFF',
  },
  featureCardSecondary: {
    backgroundColor: 'rgba(255, 105, 180, 0.2)',
    borderWidth: 2,
    borderColor: '#FF69B4',
  },
  featureCardTertiary: {
    backgroundColor: 'rgba(163, 59, 255, 0.15)',
    borderWidth: 1,
    borderColor: '#A33BFF',
  },
  featureCardQuaternary: {
    backgroundColor: 'rgba(255, 105, 180, 0.15)',
    borderWidth: 1,
    borderColor: '#FF69B4',
  },
  featureIcon: {
    fontSize: 48,
    marginBottom: 10,
  },
  featureTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  featureSubtitle: {
    color: '#aaa',
    fontSize: 12,
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 15,
  },
  statCard: {
    width: '47%',
    backgroundColor: '#1a1a2e',
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#333',
  },
  statValue: {
    color: '#A33BFF',
    fontSize: 32,
    fontWeight: '700',
    marginBottom: 8,
  },
  statLabel: {
    color: '#aaa',
    fontSize: 14,
  },
  quickActions: {
    flexDirection: 'row',
    gap: 15,
  },
  quickActionButton: {
    flex: 1,
    backgroundColor: '#1a1a2e',
    borderRadius: 15,
    padding: 15,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#333',
  },
  quickActionIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  quickActionText: {
    color: '#fff',
    fontSize: 12,
  },
  footer: {
    padding: 30,
    alignItems: 'center',
  },
  footerText: {
    color: '#888',
    fontSize: 14,
    fontStyle: 'italic',
  },
  footerSubtext: {
    color: '#666',
    fontSize: 12,
    marginTop: 5,
  },
  trendCard: {
    backgroundColor: '#1a1a2e',
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#333',
  },
  trendValue: {
    color: '#A33BFF',
    fontSize: 48,
    fontWeight: '700',
    marginBottom: 8,
  },
  trendLabel: {
    color: '#aaa',
    fontSize: 16,
  },
  habitCard: {
    backgroundColor: '#1a1a2e',
    borderRadius: 15,
    padding: 20,
    borderWidth: 1,
    borderColor: '#333',
  },
  habitText: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 10,
    lineHeight: 24,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#1a1a2e',
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#333',
  },
  settingText: {
    color: '#fff',
    fontSize: 16,
  },
  settingValue: {
    color: '#666',
    fontSize: 16,
  },
  settingArrow: {
    color: '#666',
    fontSize: 24,
  },
  tabBar: {
    backgroundColor: '#1a1a2e',
    borderTopWidth: 1,
    borderTopColor: '#333',
    height: 70,
    paddingBottom: 10,
  },
  tabBarLabel: {
    fontSize: 12,
    fontWeight: '600',
  },
});
