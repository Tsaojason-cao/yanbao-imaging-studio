import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Image,
  Alert,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Camera } from 'expo-camera';

// Home Screen Component
function HomeScreen({ navigation }: any) {
  const [stats, setStats] = useState({
    totalEdits: 247,
    storageUsed: 8,
    storageTotal: 50,
    recipes: 12,
    favorites: 38,
  });

  const features = [
    { id: 1, title: '📷 相机', subtitle: 'ProCam Beauty', color: '#A33BFF', screen: 'Camera' },
    { id: 2, title: '🖼️ 相册', subtitle: 'Gallery', color: '#FF69B4', screen: 'Gallery' },
    { id: 3, title: '✨ 编辑', subtitle: 'Photo Editor', color: '#A33BFF', screen: 'Editor' },
    { id: 4, title: '📍 推荐', subtitle: 'Spots Map', color: '#FF69B4', screen: 'Map' },
  ];

  const openFeature = async (feature: any) => {
    if (feature.screen === 'Camera') {
      const { status } = await Camera.requestCameraPermissionsAsync();
      if (status === 'granted') {
        Alert.alert('相机功能', '相机权限已授予，正在打开相机...');
      } else {
        Alert.alert('权限被拒绝', '需要相机权限才能使用此功能');
      }
    } else if (feature.screen === 'Gallery') {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status === 'granted') {
        const result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [4, 3],
          quality: 1,
        });
        if (!result.canceled) {
          Alert.alert('已选择照片', '准备进入编辑模式');
        }
      }
    } else {
      Alert.alert(feature.title, `${feature.subtitle} 功能开发中...`);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1a1a2e" />
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.logo}>🦇</Text>
          <View>
            <Text style={styles.title}>yanbao AI</Text>
            <Text style={styles.subtitle}>私人影像工作室</Text>
          </View>
        </View>
        <View style={styles.headerIcons}>
          <TouchableOpacity style={styles.iconButton}>
            <Text style={styles.icon}>🔔</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <Text style={styles.icon}>⚙️</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Feature Grid */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🎨 核心功能</Text>
        <View style={styles.grid}>
          {features.map((feature) => (
            <TouchableOpacity
              key={feature.id}
              style={[styles.card, { borderColor: feature.color }]}
              onPress={() => openFeature(feature)}
              activeOpacity={0.7}
            >
              <Text style={styles.featureIcon}>{feature.title}</Text>
              <Text style={styles.featureSubtitle}>{feature.subtitle}</Text>
              <View style={[styles.glowEffect, { backgroundColor: feature.color + '20' }]} />
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Stats Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>📊 数据统计</Text>
        
        <View style={styles.statsGrid}>
          <View style={[styles.statCard, { backgroundColor: '#A33BFF15' }]}>
            <Text style={styles.statIcon}>📸</Text>
            <Text style={styles.statLabel}>总编辑数</Text>
            <Text style={styles.statValue}>{stats.totalEdits}</Text>
            <Text style={styles.statUnit}>Edits</Text>
          </View>
          
          <View style={[styles.statCard, { backgroundColor: '#FF69B415' }]}>
            <Text style={styles.statIcon}>💾</Text>
            <Text style={styles.statLabel}>已用存储</Text>
            <Text style={styles.statValue}>{stats.storageUsed}/{stats.storageTotal} GB</Text>
            <Text style={styles.statUnit}>{Math.round((stats.storageUsed / stats.storageTotal) * 100)}%</Text>
          </View>
          
          <View style={[styles.statCard, { backgroundColor: '#A33BFF15' }]}>
            <Text style={styles.statIcon}>🧠</Text>
            <Text style={styles.statLabel}>配方数量</Text>
            <Text style={styles.statValue}>{stats.recipes}</Text>
            <Text style={styles.statUnit}>Recipes</Text>
          </View>
          
          <View style={[styles.statCard, { backgroundColor: '#FF69B415' }]}>
            <Text style={styles.statIcon}>⭐</Text>
            <Text style={styles.statLabel}>收藏照片</Text>
            <Text style={styles.statValue}>{stats.favorites}</Text>
            <Text style={styles.statUnit}>Photos</Text>
          </View>
        </View>
      </View>

      {/* Features List */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>✨ 特色功能</Text>
        
        <TouchableOpacity style={styles.featureItem}>
          <Text style={styles.featureItemIcon}>🎭</Text>
          <View style={styles.featureItemContent}>
            <Text style={styles.featureItemTitle}>AI 美颜</Text>
            <Text style={styles.featureItemDesc}>智能识别面部特征，自然美颜</Text>
          </View>
          <Text style={styles.arrow}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.featureItem}>
          <Text style={styles.featureItemIcon}>🎨</Text>
          <View style={styles.featureItemContent}>
            <Text style={styles.featureItemTitle}>滤镜预设</Text>
            <Text style={styles.featureItemDesc}>12种专业调色方案</Text>
          </View>
          <Text style={styles.arrow}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.featureItem}>
          <Text style={styles.featureItemIcon}>🗺️</Text>
          <View style={styles.featureItemContent}>
            <Text style={styles.featureItemTitle}>地区推荐</Text>
            <Text style={styles.featureItemDesc}>上海热门拍摄地点</Text>
          </View>
          <Text style={styles.arrow}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.featureItem}>
          <Text style={styles.featureItemIcon}>💾</Text>
          <View style={styles.featureItemContent}>
            <Text style={styles.featureItemTitle}>参数记忆</Text>
            <Text style={styles.featureItemDesc}>保存你的编辑配方</Text>
          </View>
          <Text style={styles.arrow}>›</Text>
        </TouchableOpacity>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Made with ❤️ by Jason Tsao
        </Text>
        <Text style={styles.footerSubtext}>
          for Yanbao, who deserves the best
        </Text>
      </View>
    </ScrollView>
  );
}

// Main App Component
export default function App() {
  return (
    <View style={{ flex: 1 }}>
      <HomeScreen navigation={null} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a1e',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    paddingTop: 50,
    backgroundColor: '#1a1a2e',
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  logo: {
    fontSize: 36,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
  },
  subtitle: {
    fontSize: 12,
    color: '#888',
  },
  headerIcons: {
    flexDirection: 'row',
    gap: 10,
  },
  iconButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    fontSize: 24,
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 15,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  card: {
    width: '48%',
    aspectRatio: 1,
    backgroundColor: '#1a1a2e',
    borderRadius: 20,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    position: 'relative',
    overflow: 'hidden',
  },
  glowEffect: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: -1,
  },
  featureIcon: {
    fontSize: 40,
    marginBottom: 8,
  },
  featureSubtitle: {
    fontSize: 14,
    color: '#aaa',
    textAlign: 'center',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  statCard: {
    width: '48%',
    padding: 15,
    borderRadius: 15,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#333',
  },
  statIcon: {
    fontSize: 32,
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 12,
    color: '#888',
    marginBottom: 5,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 2,
  },
  statUnit: {
    fontSize: 11,
    color: '#666',
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a2e',
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#333',
  },
  featureItemIcon: {
    fontSize: 32,
    marginRight: 15,
  },
  featureItemContent: {
    flex: 1,
  },
  featureItemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 4,
  },
  featureItemDesc: {
    fontSize: 13,
    color: '#888',
  },
  arrow: {
    fontSize: 24,
    color: '#666',
  },
  footer: {
    padding: 30,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: '#888',
    fontStyle: 'italic',
  },
  footerSubtext: {
    fontSize: 12,
    color: '#666',
    marginTop: 5,
  },
});
