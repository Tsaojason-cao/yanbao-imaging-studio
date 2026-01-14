import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Image, ScrollView, TouchableOpacity, Dimensions, Animated, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const { width, height } = Dimensions.get('window');

export default function HomeScreen() {
  const router = useRouter();
  const [rotation] = useState(new Animated.Value(0));

  useEffect(() => {
    // 轮盘旋转动画
    Animated.loop(
      Animated.timing(rotation, {
        toValue: 1,
        duration: 20000,
        useNativeDriver: true,
      })
    ).start();
  }, []);

  const rotateInterpolate = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  // 轮盘功能项
  const wheelItems = [
    { icon: 'camera', label: '拍照', route: '/(tabs)/camera', angle: 0 },
    { icon: 'color-palette', label: '滤镜', route: '/(tabs)/camera', angle: 60 },
    { icon: 'brush', label: '编辑', route: '/(tabs)/edit', angle: 120 },
    { icon: 'images', label: '相册', route: '/(tabs)/gallery', angle: 180 },
    { icon: 'location', label: '机位', route: '/(tabs)/spots', angle: 240 },
    { icon: 'settings', label: '设定', route: '/(tabs)/settings', angle: 300 },
  ];

  // 近期编辑照片
  const recentPhotos = [
    { id: 1, uri: 'https://picsum.photos/200/300?random=1' },
    { id: 2, uri: 'https://picsum.photos/200/300?random=2' },
    { id: 3, uri: 'https://picsum.photos/200/300?random=3' },
  ];

  return (
    <LinearGradient
      colors={['#FF69B4', '#9D4EDD', '#1A0B2E']}
      style={styles.container}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* 顶部标题 */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>yanbao AI v2.2.0</Text>
        </View>

        {/* 库洛米星光轮盘 */}
        <View style={styles.wheelContainer}>
          {/* 外圈旋转光环 */}
          <Animated.View
            style={[
              styles.wheelOuter,
              { transform: [{ rotate: rotateInterpolate }] },
            ]}
          >
            <View style={styles.wheelRing} />
          </Animated.View>

          {/* 中心库洛米 */}
          <View style={styles.wheelCenter}>
            <LinearGradient
              colors={['#E879F9', '#9D4EDD']}
              style={styles.kuromiCircle}
            >
              <Text style={styles.kuromiEmoji}>🐰</Text>
            </LinearGradient>
          </View>

          {/* 6个功能按钮 */}
          {wheelItems.map((item, index) => {
            const radian = (item.angle * Math.PI) / 180;
            const radius = 120;
            const x = Math.cos(radian) * radius;
            const y = Math.sin(radian) * radius;

            return (
              <TouchableOpacity
                key={index}
                style={[
                  styles.wheelItem,
                  {
                    transform: [
                      { translateX: x },
                      { translateY: y },
                    ],
                  },
                ]}
                onPress={() => router.push(item.route as any)}
              >
                <LinearGradient
                  colors={['rgba(232, 121, 249, 0.3)', 'rgba(157, 78, 221, 0.3)']}
                  style={styles.wheelItemCircle}
                >
                  <Ionicons name={item.icon as any} size={28} color="#E879F9" />
                </LinearGradient>
                <Text style={styles.wheelItemLabel}>{item.label}</Text>
              </TouchableOpacity>
            );
          })}

          {/* 右下角小库洛米 */}
          <View style={styles.floatingKuromi}>
            <Text style={styles.floatingKuromiEmoji}>🐰</Text>
          </View>
        </View>

        {/* Quick Access 快捷按钮 */}
        <View style={styles.quickAccessContainer}>
          <Text style={styles.sectionTitle}>Quick Access</Text>
          <View style={styles.quickAccessRow}>
            {[
              { icon: 'camera', label: '拍照', route: '/(tabs)/camera' },
              { icon: 'brush', label: '编辑', route: '/(tabs)/edit' },
              { icon: 'images', label: '相册', route: '/(tabs)/gallery' },
              { icon: 'sparkles', label: '一键美化', route: '/(tabs)/edit' },
            ].map((item, index) => (
              <TouchableOpacity 
                key={index} 
                style={styles.quickAccessButton}
                onPress={() => router.push(item.route as any)}
              >
                <LinearGradient
                  colors={['rgba(232, 121, 249, 0.2)', 'rgba(157, 78, 221, 0.2)']}
                  style={styles.quickAccessGradient}
                >
                  <Ionicons name={item.icon as any} size={24} color="#E879F9" />
                  <Text style={styles.quickAccessLabel}>{item.label}</Text>
                </LinearGradient>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* 近期编辑照片 */}
        <View style={styles.recentPhotosContainer}>
          <View style={styles.recentPhotosHeader}>
            <Text style={styles.sectionTitle}>近期编辑照片</Text>
            <Text style={styles.kuromiEmoji}>🐰</Text>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {recentPhotos.map((photo) => (
              <View key={photo.id} style={styles.recentPhotoCard}>
                <Image source={{ uri: photo.uri }} style={styles.recentPhotoImage} />
                <View style={styles.recentPhotoOverlay}>
                  <Text style={styles.kuromiEmoji}>🐰</Text>
                </View>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* 统计数据 */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <LinearGradient
              colors={['rgba(232, 121, 249, 0.15)', 'rgba(157, 78, 221, 0.15)']}
              style={styles.statGradient}
            >
              <Ionicons name="camera" size={32} color="#E879F9" />
              <Text style={styles.statNumber}>2450</Text>
              <Text style={styles.statLabel}>Photos</Text>
              <Text style={styles.statSubLabel}>总照片数</Text>
              <View style={styles.statProgressBar}>
                <View style={[styles.statProgress, { width: '85%' }]} />
              </View>
            </LinearGradient>
          </View>

          <View style={styles.statCard}>
            <LinearGradient
              colors={['rgba(232, 121, 249, 0.15)', 'rgba(157, 78, 221, 0.15)']}
              style={styles.statGradient}
            >
              <Ionicons name="cloud" size={32} color="#E879F9" />
              <Text style={styles.statNumber}>15GB</Text>
              <Text style={styles.statLabel}>Storage</Text>
              <Text style={styles.statSubLabel}>已用空间</Text>
              <View style={styles.statProgressBar}>
                <View style={[styles.statProgress, { width: '60%' }]} />
              </View>
            </LinearGradient>
          </View>

          <View style={styles.statCard}>
            <LinearGradient
              colors={['rgba(232, 121, 249, 0.15)', 'rgba(157, 78, 221, 0.15)']}
              style={styles.statGradient}
            >
              <Ionicons name="calendar" size={32} color="#E879F9" />
              <Text style={styles.statNumber}>28</Text>
              <Text style={styles.statLabel}>Days Active</Text>
              <Text style={styles.statSubLabel}>活跃天数</Text>
              <View style={styles.statProgressBar}>
                <View style={[styles.statProgress, { width: '93%' }]} />
              </View>
            </LinearGradient>
          </View>
        </View>

        {/* Jason Tsao 专属霓虹署名 */}
        <View style={styles.signatureContainer}>
          <LinearGradient
            colors={['rgba(232, 121, 249, 0.3)' as const, 'rgba(244, 114, 182, 0.3)' as const]}
            style={styles.signatureGradient}
          >
            <Text style={styles.signatureText}>
              by Jason Tsao who loves you the most ♥
            </Text>
            {/* 霓虹呼吸效果 */}
            <View style={styles.neonGlow} />
          </LinearGradient>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textShadowColor: 'rgba(232, 121, 249, 0.8)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  wheelContainer: {
    height: 400,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 30,
  },
  wheelOuter: {
    position: 'absolute',
    width: 300,
    height: 300,
  },
  wheelRing: {
    width: 300,
    height: 300,
    borderRadius: 150,
    borderWidth: 2,
    borderColor: 'rgba(232, 121, 249, 0.5)',
    borderStyle: 'dashed',
  },
  wheelCenter: {
    position: 'absolute',
    zIndex: 10,
  },
  kuromiCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#E879F9',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.8,
        shadowRadius: 20,
      },
      android: {
        elevation: 10,
      },
    }),
  },
  kuromiEmoji: {
    fontSize: 48,
  },
  wheelItem: {
    position: 'absolute',
    alignItems: 'center',
  },
  wheelItemCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'rgba(232, 121, 249, 0.5)',
    ...Platform.select({
      ios: {
        shadowColor: '#E879F9',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.6,
        shadowRadius: 10,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  wheelItemLabel: {
    marginTop: 8,
    fontSize: 12,
    color: '#E879F9',
    fontWeight: '600',
  },
  floatingKuromi: {
    position: 'absolute',
    bottom: -20,
    right: -20,
  },
  floatingKuromiEmoji: {
    fontSize: 60,
  },
  quickAccessContainer: {
    paddingHorizontal: 20,
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 15,
  },
  quickAccessRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  quickAccessButton: {
    flex: 1,
    marginHorizontal: 5,
  },
  quickAccessGradient: {
    borderRadius: 16,
    padding: 15,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(232, 121, 249, 0.3)',
  },
  quickAccessLabel: {
    marginTop: 8,
    fontSize: 11,
    color: '#E879F9',
    fontWeight: '600',
  },
  recentPhotosContainer: {
    paddingHorizontal: 20,
    marginTop: 30,
  },
  recentPhotosHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  recentPhotoCard: {
    width: 150,
    height: 200,
    marginRight: 15,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'rgba(232, 121, 249, 0.5)',
  },
  recentPhotoImage: {
    width: '100%',
    height: '100%',
  },
  recentPhotoOverlay: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginTop: 30,
    justifyContent: 'space-between',
  },
  statCard: {
    flex: 1,
    marginHorizontal: 5,
  },
  statGradient: {
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(232, 121, 249, 0.3)',
  },
  statNumber: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 10,
  },
  statLabel: {
    fontSize: 14,
    color: '#E879F9',
    fontWeight: '600',
    marginTop: 5,
  },
  statSubLabel: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.6)',
    marginTop: 2,
  },
  statProgressBar: {
    width: '100%',
    height: 4,
    backgroundColor: 'rgba(232, 121, 249, 0.2)',
    borderRadius: 2,
    marginTop: 10,
    overflow: 'hidden',
  },
  statProgress: {
    height: '100%',
    backgroundColor: '#E879F9',
    borderRadius: 2,
  },
  signatureContainer: {
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 30,
  },
  signatureGradient: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: 'rgba(232, 121, 249, 0.5)',
    position: 'relative',
    overflow: 'visible',
  },
  signatureText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: 'bold',
    textAlign: 'center',
    textShadowColor: 'rgba(232, 121, 249, 1)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 15,
    letterSpacing: 0.5,
  },
  neonGlow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: '#F472B6',
    shadowColor: '#E879F9',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 20,
    elevation: 10,
  },
});
