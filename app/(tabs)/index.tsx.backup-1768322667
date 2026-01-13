/**
 * yanbao AI 首页模块 (Home Module)
 * 库洛米轮盘导航 + 用户统计
 * 
 * 功能：
 * - 库洛米轮盘导航（6 个功能入口）
 * - 用户统计卡片（总照片、预设、使用天数）
 * - 数据面板
 * - 轮盘旋转动画
 * - 光晕脉冲效果
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
import YanbaoTheme from '@/lib/theme-config';

const { width, height } = Dimensions.get('window');

// ============================================
// 轮盘导航数据
// ============================================
const WHEEL_ITEMS = [
  {
    id: 'camera',
    label: '拍照',
    icon: '📷',
    color: '#FF6B9D',
    route: '/camera',
    description: '实时美颜 + AR 姿势',
  },
  {
    id: 'edit',
    label: '编辑',
    icon: '✨',
    color: '#A855F7',
    route: '/edit',
    description: 'AI 消除/扩图/美颜',
  },
  {
    id: 'gallery',
    label: '相册',
    icon: '🖼️',
    color: '#E8B4F0',
    route: '/gallery',
    description: '高性能相册 + 云备份',
  },
  {
    id: 'batch',
    label: '批量',
    icon: '⚡',
    color: '#FF7BA8',
    route: '/batch',
    description: '批量处理引擎',
  },
  {
    id: 'spot',
    label: '机位',
    icon: '📍',
    color: '#B968FF',
    route: '/spot',
    description: '地区机位推荐',
  },
  {
    id: 'settings',
    label: '设置',
    icon: '⚙️',
    color: '#CA7BFF',
    route: '/settings',
    description: '统计 + 彩蛋',
  },
];

// ============================================
// 统计数据
// ============================================
interface StatsData {
  totalPhotos: number;
  totalPresets: number;
  usageDays: number;
  storageUsed: number;
  cloudBackup: number;
}

// ============================================
// 首页组件
// ============================================
export default function HomeScreen() {
  const router = useRouter();
  const [stats, setStats] = useState<StatsData>({
    totalPhotos: 1234,
    totalPresets: 25,
    usageDays: 45,
    storageUsed: 8.5,
    cloudBackup: 1200,
  });

  // 轮盘旋转动画
  const wheelRotation = useRef(new Animated.Value(0)).current;
  const glowOpacity = useRef(new Animated.Value(0.4)).current;

  // 启动动画
  useEffect(() => {
    // 轮盘旋转
    Animated.loop(
      Animated.timing(wheelRotation, {
        toValue: 1,
        duration: 3000,
        useNativeDriver: true,
      })
    ).start();

    // 光晕脉冲
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

  // 计算轮盘项目的位置
  const getWheelItemPosition = (index: number) => {
    const angle = (index / WHEEL_ITEMS.length) * 360;
    const radius = 100;
    const x = radius * Math.cos((angle * Math.PI) / 180);
    const y = radius * Math.sin((angle * Math.PI) / 180);
    return { x, y, angle };
  };

  // 处理轮盘项目点击
  const handleWheelItemPress = (route: string) => {
    router.push(route as any);
  };

  // 旋转插值
  const rotate = wheelRotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <LinearGradient
      colors={['#E8B4F0', '#D4A5E8', '#C896E0']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ============================================
            顶部品牌区域
            ============================================ */}
        <View style={styles.headerSection}>
          <Text style={styles.brandName}>YanBao AI</Text>
          <Text style={styles.brandSubtitle}>私人影像工作室</Text>
        </View>

        {/* ============================================
            库洛米轮盘导航
            ============================================ */}
        <View style={styles.wheelContainer}>
          {/* 轮盘背景 */}
          <Animated.View
            style={[
              styles.wheelBackground,
              {
                transform: [{ rotate }],
                opacity: glowOpacity,
              },
            ]}
          >
            <LinearGradient
              colors={['#FF6B9D', '#A855F7']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.wheelGradient}
            />
          </Animated.View>

          {/* 轮盘项目 */}
          {WHEEL_ITEMS.map((item, index) => {
            const { x, y, angle } = getWheelItemPosition(index);
            return (
              <TouchableOpacity
                key={item.id}
                style={[
                  styles.wheelItem,
                  {
                    transform: [
                      { translateX: x },
                      { translateY: y },
                    ],
                  },
                ]}
                onPress={() => handleWheelItemPress(item.route)}
                activeOpacity={0.7}
              >
                <LinearGradient
                  colors={[item.color, '#FFFFFF']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.wheelItemGradient}
                >
                  <Text style={styles.wheelItemIcon}>{item.icon}</Text>
                </LinearGradient>
                <Text style={styles.wheelItemLabel}>{item.label}</Text>
              </TouchableOpacity>
            );
          })}

          {/* 库洛米中心角色 */}
          <View style={styles.centerKuromi}>
            <Text style={styles.kuromiEmoji}>🎀</Text>
          </View>
        </View>

        {/* ============================================
            统计数据面板
            ============================================ */}
        <View style={styles.statsPanel}>
          <LinearGradient
            colors={['rgba(61, 43, 94, 0.8)', 'rgba(45, 27, 78, 0.8)']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.statsPanelGradient}
          >
            {/* 统计卡片 */}
            <View style={styles.statsGrid}>
              {/* 总照片 */}
              <View style={styles.statCard}>
                <Text style={styles.statValue}>{stats.totalPhotos}</Text>
                <Text style={styles.statLabel}>总照片</Text>
              </View>

              {/* 预设库 */}
              <View style={styles.statCard}>
                <Text style={styles.statValue}>{stats.totalPresets}</Text>
                <Text style={styles.statLabel}>预设</Text>
              </View>

              {/* 使用天数 */}
              <View style={styles.statCard}>
                <Text style={styles.statValue}>{stats.usageDays}</Text>
                <Text style={styles.statLabel}>天数</Text>
              </View>
            </View>

            {/* 存储信息 */}
            <View style={styles.storageInfo}>
              <View style={styles.storageRow}>
                <Text style={styles.storageLabel}>本地存储</Text>
                <Text style={styles.storageValue}>{stats.storageUsed} GB</Text>
              </View>
              <View style={styles.storageBar}>
                <View
                  style={[
                    styles.storageBarFill,
                    { width: `${(stats.storageUsed / 16) * 100}%` },
                  ]}
                />
              </View>

              <View style={styles.storageRow}>
                <Text style={styles.storageLabel}>云端备份</Text>
                <Text style={styles.storageValue}>{stats.cloudBackup} 张</Text>
              </View>
            </View>
          </LinearGradient>
        </View>

        {/* ============================================
            功能快捷入口
            ============================================ */}
        <View style={styles.quickActionsSection}>
          <Text style={styles.sectionTitle}>快速功能</Text>
          
          <View style={styles.quickActionsGrid}>
            {/* 一键美颜 */}
            <TouchableOpacity
              style={styles.quickActionCard}
              onPress={() => router.push('/camera')}
            >
              <LinearGradient
                colors={['#FF6B9D', '#FF7BA8']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.quickActionGradient}
              >
                <Text style={styles.quickActionIcon}>✨</Text>
                <Text style={styles.quickActionText}>一键美颜</Text>
              </LinearGradient>
            </TouchableOpacity>

            {/* AI 消除 */}
            <TouchableOpacity
              style={styles.quickActionCard}
              onPress={() => router.push('/edit')}
            >
              <LinearGradient
                colors={['#A855F7', '#B968FF']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.quickActionGradient}
              >
                <Text style={styles.quickActionIcon}>🗑️</Text>
                <Text style={styles.quickActionText}>AI 消除</Text>
              </LinearGradient>
            </TouchableOpacity>

            {/* AI 扩图 */}
            <TouchableOpacity
              style={styles.quickActionCard}
              onPress={() => router.push('/edit')}
            >
              <LinearGradient
                colors={['#E8B4F0', '#D4A5E8']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.quickActionGradient}
              >
                <Text style={styles.quickActionIcon}>📐</Text>
                <Text style={styles.quickActionText}>AI 扩图</Text>
              </LinearGradient>
            </TouchableOpacity>

            {/* 批量处理 */}
            <TouchableOpacity
              style={styles.quickActionCard}
              onPress={() => router.push('/batch')}
            >
              <LinearGradient
                colors={['#FF7BA8', '#FF8BB3']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.quickActionGradient}
              >
                <Text style={styles.quickActionIcon}>⚡</Text>
                <Text style={styles.quickActionText}>批量处理</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>

        {/* ============================================
            底部提示
            ============================================ */}
        <View style={styles.footerTip}>
          <Text style={styles.footerTipText}>
            💡 提示：长按库洛米角色可触发隐藏彩蛋
          </Text>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

// ============================================
// 样式定义
// ============================================
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  scrollContent: {
    paddingVertical: 20,
    paddingHorizontal: 16,
  },

  // 顶部品牌区域
  headerSection: {
    alignItems: 'center',
    marginBottom: 40,
    marginTop: 20,
  },

  brandName: {
    fontSize: 40,
    fontWeight: '800',
    color: '#2D1B4E',
    fontFamily: 'Montserrat',
  },

  brandSubtitle: {
    fontSize: 14,
    color: '#3D2B5E',
    marginTop: 8,
    fontFamily: 'Inter',
  },

  // 轮盘容器
  wheelContainer: {
    height: 320,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
    position: 'relative',
  },

  wheelBackground: {
    position: 'absolute',
    width: 240,
    height: 240,
    borderRadius: 120,
    opacity: 0.2,
  },

  wheelGradient: {
    flex: 1,
    borderRadius: 120,
  },

  wheelItem: {
    position: 'absolute',
    width: 70,
    height: 70,
    justifyContent: 'center',
    alignItems: 'center',
  },

  wheelItemGradient: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },

  wheelItemIcon: {
    fontSize: 32,
  },

  wheelItemLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#2D1B4E',
    marginTop: 4,
    textAlign: 'center',
  },

  centerKuromi: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 12,
  },

  kuromiEmoji: {
    fontSize: 60,
  },

  // 统计面板
  statsPanel: {
    marginBottom: 30,
    borderRadius: 20,
    overflow: 'hidden',
  },

  statsPanelGradient: {
    padding: 20,
  },

  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },

  statCard: {
    alignItems: 'center',
  },

  statValue: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FF6B9D',
    fontFamily: 'Montserrat',
  },

  statLabel: {
    fontSize: 12,
    color: '#FFFFFF',
    marginTop: 4,
  },

  storageInfo: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.2)',
    paddingTop: 16,
  },

  storageRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },

  storageLabel: {
    fontSize: 12,
    color: '#FFFFFF',
  },

  storageValue: {
    fontSize: 12,
    color: '#FF6B9D',
    fontWeight: '600',
  },

  storageBar: {
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 2,
    marginBottom: 12,
    overflow: 'hidden',
  },

  storageBarFill: {
    height: '100%',
    backgroundColor: '#FF6B9D',
    borderRadius: 2,
  },

  // 快速功能
  quickActionsSection: {
    marginBottom: 30,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2D1B4E',
    marginBottom: 12,
  },

  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },

  quickActionCard: {
    width: '48%',
    marginBottom: 12,
    borderRadius: 12,
    overflow: 'hidden',
  },

  quickActionGradient: {
    paddingVertical: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },

  quickActionIcon: {
    fontSize: 32,
    marginBottom: 8,
  },

  quickActionText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },

  // 底部提示
  footerTip: {
    paddingVertical: 16,
    paddingHorizontal: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 12,
    marginBottom: 20,
  },

  footerTipText: {
    fontSize: 12,
    color: '#2D1B4E',
    textAlign: 'center',
  },
});
