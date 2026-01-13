/**
 * yanbao AI 首頁模塊 (Home Module) - 優化版
 * 庫洛米輪盤導航 + 快速訪問欄 + 用戶統計
 * 
 * 優化內容：
 * - 添加快速訪問欄（拍照、編輯、相冊）
 * - 一鍵美化快速進入
 * - 最近編輯的照片快速訪問
 * - 手勢交互支持
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Animated,
  Dimensions,
  StyleSheet,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import YanbaoTheme from '@/lib/theme-config';
import { QuickAccessBar } from '@/lib/components/QuickAccessBar';
import { GestureContainer } from '@/lib/components/GestureInteraction';

const { width, height } = Dimensions.get('window');

// ============================================
// 輪盤導航數據
// ============================================
const WHEEL_ITEMS = [
  {
    id: 'camera',
    label: '拍照',
    icon: '📷',
    color: '#FF6B9D',
    route: '/camera',
    description: '實時美顏 + AR 姿勢',
  },
  {
    id: 'edit',
    label: '編輯',
    icon: '✨',
    color: '#A855F7',
    route: '/edit',
    description: 'AI 消除/擴圖/美顏',
  },
  {
    id: 'gallery',
    label: '相冊',
    icon: '🖼️',
    color: '#E8B4F0',
    route: '/gallery',
    description: '高性能相冊 + 雲備份',
  },
  {
    id: 'batch',
    label: '批量',
    icon: '⚡',
    color: '#FF7BA8',
    route: '/batch',
    description: '批量處理引擎',
  },
  {
    id: 'spot',
    label: '機位',
    icon: '📍',
    color: '#B968FF',
    route: '/spot',
    description: '地區機位推薦',
  },
  {
    id: 'settings',
    label: '設置',
    icon: '⚙️',
    color: '#CA7BFF',
    route: '/settings',
    description: '統計 + 彩蛋',
  },
];

// ============================================
// 快速訪問項目
// ============================================
const QUICK_ACCESS_ITEMS = [
  {
    id: 'quick-camera',
    label: '快速拍照',
    icon: '📷',
    color: '#FF6B9D',
    route: '/camera',
  },
  {
    id: 'quick-edit',
    label: '快速編輯',
    icon: '✨',
    color: '#A855F7',
    route: '/edit',
  },
  {
    id: 'quick-gallery',
    label: '我的相冊',
    icon: '🖼️',
    color: '#E8B4F0',
    route: '/gallery',
  },
  {
    id: 'quick-beauty',
    label: '一鍵美化',
    icon: '💫',
    color: '#FF8BB3',
    route: '/edit?mode=quick-beauty',
  },
];

// ============================================
// 統計數據接口
// ============================================
interface StatsData {
  totalPhotos: number;
  totalPresets: number;
  usageDays: number;
  storageUsed: number;
  cloudBackup: number;
}

// ============================================
// 最近編輯照片接口
// ============================================
interface RecentPhoto {
  id: string;
  thumbnail: string;
  title: string;
  timestamp: number;
}

// ============================================
// 首頁組件（優化版）
// ============================================
export default function HomeScreenOptimized() {
  const router = useRouter();
  const [stats, setStats] = useState<StatsData>({
    totalPhotos: 1234,
    totalPresets: 25,
    usageDays: 45,
    storageUsed: 8.5,
    cloudBackup: 1200,
  });

  // 最近編輯的照片（模擬數據）
  const [recentPhotos, setRecentPhotos] = useState<RecentPhoto[]>([
    { id: '1', thumbnail: '📷', title: '風景照', timestamp: Date.now() - 3600000 },
    { id: '2', thumbnail: '📷', title: '人像照', timestamp: Date.now() - 7200000 },
    { id: '3', thumbnail: '📷', title: '夜景照', timestamp: Date.now() - 86400000 },
  ]);

  // 輪盤旋轉動畫
  const wheelRotation = useRef(new Animated.Value(0)).current;
  const glowOpacity = useRef(new Animated.Value(0.4)).current;

  // 啟動動畫
  useEffect(() => {
    // 輪盤旋轉
    Animated.loop(
      Animated.timing(wheelRotation, {
        toValue: 1,
        duration: 3000,
        useNativeDriver: true,
      })
    ).start();

    // 光暈脈衝
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowOpacity, {
          toValue: 0.8,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(glowOpacity, {
          toValue: 0.4,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  // 計算輪盤項目的位置
  const getWheelItemPosition = (index: number) => {
    const angle = (index / WHEEL_ITEMS.length) * 360;
    const radius = 100;
    const x = radius * Math.cos((angle * Math.PI) / 180);
    const y = radius * Math.sin((angle * Math.PI) / 180);
    return { x, y, angle };
  };

  // 處理輪盤項目點擊
  const handleWheelItemPress = async (route: string) => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push(route as any);
  };

  // 處理快速訪問項目點擊
  const handleQuickAccessPress = async (item: any) => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push(item.route as any);
  };

  // 處理最近編輯照片點擊
  const handleRecentPhotoPress = async (photo: RecentPhoto) => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push(`/edit?photoId=${photo.id}` as any);
  };

  // 輪盤旋轉插值
  const wheelRotationInterpolate = wheelRotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <LinearGradient
      colors={['#2D1B4E', '#4D3B6E', '#3D2B5E']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* 快速訪問欄 */}
        <QuickAccessBar
          items={QUICK_ACCESS_ITEMS.map((item) => ({
            ...item,
            onPress: () => handleQuickAccessPress(item),
          }))}
          style={styles.quickAccessBar}
        />

        {/* 主內容區域 */}
        <View style={styles.mainContent}>
          {/* 輪盤導航 */}
          <View style={styles.wheelContainer}>
            <Animated.View
              style={[
                styles.wheel,
                {
                  transform: [
                    {
                      rotate: wheelRotationInterpolate,
                    },
                  ],
                },
              ]}
            >
              {/* 中央庫洛米角色 */}
              <Animated.View
                style={[
                  styles.centerKuromi,
                  {
                    opacity: glowOpacity,
                  },
                ]}
              >
                <Text style={styles.kuromiEmoji}>🎀</Text>
              </Animated.View>

              {/* 輪盤項目 */}
              {WHEEL_ITEMS.map((item, index) => {
                const position = getWheelItemPosition(index);
                return (
                  <TouchableOpacity
                    key={item.id}
                    style={[
                      styles.wheelItem,
                      {
                        transform: [
                          { translateX: position.x },
                          { translateY: position.y },
                        ],
                      },
                    ]}
                    onPress={() => handleWheelItemPress(item.route)}
                    activeOpacity={0.7}
                  >
                    <LinearGradient
                      colors={[item.color, `${item.color}80`]}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={styles.wheelItemGradient}
                    >
                      <Text style={styles.wheelItemIcon}>{item.icon}</Text>
                      <Text style={styles.wheelItemLabel}>{item.label}</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                );
              })}
            </Animated.View>
          </View>

          {/* 統計卡片 */}
          <View style={styles.statsContainer}>
            <LinearGradient
              colors={['rgba(232, 180, 240, 0.1)', 'rgba(200, 150, 224, 0.05)']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.statsCard}
            >
              <View style={styles.statRow}>
                <View style={styles.statItem}>
                  <Text style={styles.statLabel}>總照片</Text>
                  <Text style={styles.statValue}>{stats.totalPhotos}</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                  <Text style={styles.statLabel}>預設</Text>
                  <Text style={styles.statValue}>{stats.totalPresets}</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                  <Text style={styles.statLabel}>使用天數</Text>
                  <Text style={styles.statValue}>{stats.usageDays}</Text>
                </View>
              </View>
            </LinearGradient>
          </View>

          {/* 最近編輯照片 */}
          <View style={styles.recentPhotosSection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>最近編輯</Text>
              <TouchableOpacity onPress={() => router.push('/gallery' as any)}>
                <Text style={styles.sectionLink}>查看全部 →</Text>
              </TouchableOpacity>
            </View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.recentPhotosContent}
            >
              {recentPhotos.map((photo) => (
                <TouchableOpacity
                  key={photo.id}
                  style={styles.recentPhotoItem}
                  onPress={() => handleRecentPhotoPress(photo)}
                  activeOpacity={0.7}
                >
                  <LinearGradient
                    colors={['#A855F7', '#FF6B9D']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.recentPhotoThumbnail}
                  >
                    <Text style={styles.recentPhotoIcon}>{photo.thumbnail}</Text>
                  </LinearGradient>
                  <Text style={styles.recentPhotoTitle}>{photo.title}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* 一鍵美化按鈕 */}
          <TouchableOpacity
            style={styles.quickBeautyButton}
            onPress={() => handleQuickAccessPress({ route: '/edit?mode=quick-beauty' })}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={['#FF6B9D', '#A855F7']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.quickBeautyGradient}
            >
              <Text style={styles.quickBeautyIcon}>💫</Text>
              <Text style={styles.quickBeautyText}>一鍵美化</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

// ============================================
// 樣式定義
// ============================================
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2D1B4E',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  quickAccessBar: {
    marginTop: 12,
  },
  mainContent: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 24,
  },
  wheelContainer: {
    height: 320,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
  },
  wheel: {
    width: 280,
    height: 280,
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerKuromi: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255, 107, 157, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 107, 157, 0.4)',
  },
  kuromiEmoji: {
    fontSize: 60,
  },
  wheelItem: {
    position: 'absolute',
    width: 70,
    height: 70,
  },
  wheelItemGradient: {
    width: '100%',
    height: '100%',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 4,
  },
  wheelItemIcon: {
    fontSize: 24,
  },
  wheelItemLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  statsContainer: {
    marginBottom: 24,
  },
  statsCard: {
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: 'rgba(255, 255, 255, 0.6)',
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  recentPhotosSection: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  sectionLink: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FF6B9D',
  },
  recentPhotosContent: {
    gap: 12,
  },
  recentPhotoItem: {
    alignItems: 'center',
    gap: 8,
  },
  recentPhotoThumbnail: {
    width: 80,
    height: 80,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  recentPhotoIcon: {
    fontSize: 32,
  },
  recentPhotoTitle: {
    fontSize: 11,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
  },
  quickBeautyButton: {
    marginTop: 16,
    borderRadius: 16,
    overflow: 'hidden',
  },
  quickBeautyGradient: {
    paddingVertical: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  quickBeautyIcon: {
    fontSize: 20,
  },
  quickBeautyText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});

export default HomeScreenOptimized;
