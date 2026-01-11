import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { theme } from '../config/theme';

const { width, height } = Dimensions.get('window');

interface HomeScreenProps {
  navigation: any;
}

export default function HomeScreen({ navigation }: HomeScreenProps) {
  const [tapCount, setTapCount] = useState(0);

  const handleAvatarTap = () => {
    const newCount = tapCount + 1;
    setTapCount(newCount);
    
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    
    // 1017 彩蛋：连续点击 5 次
    if (newCount === 5) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      // TODO: 显示 1017 告白弹窗
      alert('💜 1999.10.17 - 因为是你，所以代码有了温度 💜');
      setTapCount(0);
    }
    
    // 重置计数器
    setTimeout(() => setTapCount(0), 2000);
  };

  const features = [
    { id: 'camera', icon: '📷', label: '相机', screen: 'Camera' },
    { id: 'edit', icon: '✨', label: '编辑', screen: 'Edit' },
    { id: 'gallery', icon: '🖼️', label: '相册', screen: 'Gallery' },
    { id: 'presets', icon: '💜', label: '雁宝记忆', screen: 'Presets' },
  ];

  return (
    <LinearGradient
      colors={[theme.colors.background, theme.colors.surface]}
      style={styles.container}
    >
      {/* 背景装饰 */}
      <View style={styles.backgroundDecor}>
        <View style={[styles.blob, styles.blob1]} />
        <View style={[styles.blob, styles.blob2]} />
      </View>

      {/* 头部 */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={handleAvatarTap}
          activeOpacity={0.8}
        >
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>雁</Text>
            </View>
          </View>
        </TouchableOpacity>
        
        <Text style={styles.title}>雁宝 AI</Text>
        <Text style={styles.subtitle}>IMAGING STUDIO</Text>
        
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>128</Text>
            <Text style={styles.statLabel}>照片</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>12</Text>
            <Text style={styles.statLabel}>预设</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>5</Text>
            <Text style={styles.statLabel}>收藏</Text>
          </View>
        </View>
      </View>

      {/* 星光轮盘 */}
      <View style={styles.wheelContainer}>
        <View style={styles.wheel}>
          {features.map((feature, index) => {
            const angle = (index * 90 - 45) * (Math.PI / 180);
            const radius = 100;
            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * radius;

            return (
              <TouchableOpacity
                key={feature.id}
                style={[
                  styles.featureButton,
                  {
                    transform: [
                      { translateX: x },
                      { translateY: y },
                    ],
                  },
                ]}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                  navigation.navigate(feature.screen);
                }}
                activeOpacity={0.7}
              >
                <LinearGradient
                  colors={[theme.colors.primary, theme.colors.secondary]}
                  style={styles.featureGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <Text style={styles.featureIcon}>{feature.icon}</Text>
                  <Text style={styles.featureLabel}>{feature.label}</Text>
                </LinearGradient>
              </TouchableOpacity>
            );
          })}
          
          {/* 中心装饰 */}
          <View style={styles.centerDecor}>
            <Text style={styles.centerIcon}>✨</Text>
          </View>
        </View>
      </View>

      {/* 底部提示 */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          点击头像 5 次解锁彩蛋 🎁
        </Text>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundDecor: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
  },
  blob: {
    position: 'absolute',
    borderRadius: 9999,
    opacity: 0.1,
  },
  blob1: {
    width: 300,
    height: 300,
    backgroundColor: theme.colors.primary,
    top: -100,
    left: -100,
  },
  blob2: {
    width: 250,
    height: 250,
    backgroundColor: theme.colors.secondary,
    bottom: -80,
    right: -80,
  },
  header: {
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: theme.spacing.lg,
  },
  avatarContainer: {
    marginBottom: theme.spacing.md,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: theme.colors.secondary,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: theme.colors.text,
  },
  title: {
    fontSize: theme.fontSize.xxl,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
    letterSpacing: 2,
  },
  statsContainer: {
    flexDirection: 'row',
    marginTop: theme.spacing.lg,
    gap: theme.spacing.xl,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: theme.fontSize.xl,
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
  statLabel: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.textSecondary,
    marginTop: 4,
  },
  wheelContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  wheel: {
    width: 300,
    height: 300,
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureButton: {
    position: 'absolute',
  },
  featureGradient: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    ...theme.shadows.md,
  },
  featureIcon: {
    fontSize: 28,
  },
  featureLabel: {
    fontSize: 10,
    color: theme.colors.text,
    marginTop: 4,
    fontWeight: '600',
  },
  centerDecor: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: theme.colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: theme.colors.primary,
  },
  centerIcon: {
    fontSize: 24,
  },
  footer: {
    paddingBottom: 40,
    alignItems: 'center',
  },
  footerText: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.textSecondary,
    opacity: 0.6,
  },
});
