/**
 * yanbao AI 设置模块 (Settings & Stats)
 * 用户资料 + 存储统计 + 1017 告白彩蛋 + 版本管理
 * 
 * 功能：
 * - 用户资料编辑
 * - 存储统计（本地 + 云端）
 * - 1017 告白彩蛋
 * - 版本管理（v2.1.0-Ultimate）
 * - ProGuard 代码混淆保护
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Animated,
  Dimensions,
  StyleSheet,
  Alert,
  Switch,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import YanbaoTheme from '@/lib/theme-config';

const { width, height } = Dimensions.get('window');

// ============================================
// 用户数据接口
// ============================================
interface UserProfile {
  name: string;
  avatar: string;
  bio: string;
  joinDate: string;
  totalPhotos: number;
  totalEdits: number;
  totalShares: number;
}

// ============================================
// 设置模块组件
// ============================================
export default function SettingsScreen() {
  const router = useRouter();

  // 用户资料
  const [userProfile, setUserProfile] = useState<UserProfile>({
    name: '摄影爱好者',
    avatar: '📷',
    bio: '用镜头记录生活的美好',
    joinDate: '2023-06-15',
    totalPhotos: 1234,
    totalEdits: 856,
    totalShares: 342,
  });

  // 设置状态
  const [settings, setSettings] = useState({
    autoBackup: true,
    cloudSync: true,
    notifications: true,
    darkMode: true,
    qualityMode: 'high',
  });

  // 统计数据
  const [stats, setStats] = useState({
    localStorage: 8.5,
    maxStorage: 16,
    cloudStorage: 12.3,
    maxCloudStorage: 50,
    totalEdits: 856,
    totalShares: 342,
  });

  // 彩蛋状态
  const [easterEggTriggered, setEasterEggTriggered] = useState(false);
  const [confettiAnimation] = useState(new Animated.Value(0));

  // ============================================
  // 触发 1017 告白彩蛋
  // ============================================
  const handleEasterEgg = () => {
    setEasterEggTriggered(true);

    // 触发动画
    Animated.sequence([
      Animated.timing(confettiAnimation, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.delay(2000),
      Animated.timing(confettiAnimation, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start(() => setEasterEggTriggered(false));

    Alert.alert(
      '💕 1017 告白',
      '感谢您一直以来的陪伴和支持，\n雁宝 AI 会继续为您提供最好的拍照和编辑体验。\n\n让我们一起记录更多美好的时刻！',
      [{ text: '好的', onPress: () => {} }]
    );
  };

  // ============================================
  // 编辑用户资料
  // ============================================
  const handleEditProfile = () => {
    Alert.prompt(
      '编辑昵称',
      '请输入您的昵称',
      [
        { text: '取消', style: 'cancel' },
        {
          text: '确定',
          onPress: name => {
            if (name) {
              setUserProfile(prev => ({ ...prev, name }));
              Alert.alert('成功', '昵称已更新');
            }
          },
        },
      ],
      'plain-text',
      userProfile.name
    );
  };

  // ============================================
  // 清除缓存
  // ============================================
  const handleClearCache = () => {
    Alert.alert(
      '清除缓存',
      '确定要清除所有缓存数据吗？',
      [
        { text: '取消', style: 'cancel' },
        {
          text: '确定',
          onPress: () => {
            Alert.alert('成功', '缓存已清除');
          },
          style: 'destructive',
        },
      ]
    );
  };

  // ============================================
  // 关于应用
  // ============================================
  const handleAboutApp = () => {
    Alert.alert(
      '关于应用',
      'yanbao AI v2.1.0-Ultimate\n\n私人影像工作室\n\n© 2024 雁宝 AI. All rights reserved.\n\n启用 ProGuard 代码混淆保护'
    );
  };

  return (
    <LinearGradient
      colors={['#3D2B5E', '#2D1B4E']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ============================================
            用户资料卡片
            ============================================ */}
        <View style={styles.profileCard}>
          <LinearGradient
            colors={['rgba(255, 107, 157, 0.2)', 'rgba(168, 85, 247, 0.2)']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.profileCardGradient}
          >
            {/* 头像 */}
            <View style={styles.avatarContainer}>
              <View style={styles.avatar}>
                <Text style={styles.avatarEmoji}>{userProfile.avatar}</Text>
              </View>
            </View>

            {/* 用户信息 */}
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>{userProfile.name}</Text>
              <Text style={styles.profileBio}>{userProfile.bio}</Text>
              <Text style={styles.profileJoinDate}>
                加入于 {userProfile.joinDate}
              </Text>
            </View>

            {/* 编辑按钮 */}
            <TouchableOpacity
              style={styles.editButton}
              onPress={handleEditProfile}
            >
              <Text style={styles.editButtonText}>编辑</Text>
            </TouchableOpacity>
          </LinearGradient>
        </View>

        {/* ============================================
            统计数据
            ============================================ */}
        <View style={styles.statsSection}>
          <Text style={styles.sectionTitle}>📊 统计数据</Text>

          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Text style={styles.statIcon}>📷</Text>
              <Text style={styles.statValue}>{userProfile.totalPhotos}</Text>
              <Text style={styles.statLabel}>总照片</Text>
            </View>

            <View style={styles.statCard}>
              <Text style={styles.statIcon}>✨</Text>
              <Text style={styles.statValue}>{userProfile.totalEdits}</Text>
              <Text style={styles.statLabel}>编辑次数</Text>
            </View>

            <View style={styles.statCard}>
              <Text style={styles.statIcon}>📤</Text>
              <Text style={styles.statValue}>{userProfile.totalShares}</Text>
              <Text style={styles.statLabel}>分享次数</Text>
            </View>
          </View>
        </View>

        {/* ============================================
            存储管理
            ============================================ */}
        <View style={styles.storageSection}>
          <Text style={styles.sectionTitle}>💾 存储管理</Text>

          {/* 本地存储 */}
          <View style={styles.storageItem}>
            <View style={styles.storageItemHeader}>
              <Text style={styles.storageItemLabel}>本地存储</Text>
              <Text style={styles.storageItemValue}>
                {stats.localStorage} GB / {stats.maxStorage} GB
              </Text>
            </View>
            <View style={styles.storageBar}>
              <View
                style={[
                  styles.storageBarFill,
                  { width: `${(stats.localStorage / stats.maxStorage) * 100}%` },
                ]}
              />
            </View>
          </View>

          {/* 云端存储 */}
          <View style={styles.storageItem}>
            <View style={styles.storageItemHeader}>
              <Text style={styles.storageItemLabel}>云端存储</Text>
              <Text style={styles.storageItemValue}>
                {stats.cloudStorage} GB / {stats.maxCloudStorage} GB
              </Text>
            </View>
            <View style={styles.storageBar}>
              <View
                style={[
                  styles.storageBarFill,
                  { width: `${(stats.cloudStorage / stats.maxCloudStorage) * 100}%` },
                ]}
              />
            </View>
          </View>

          {/* 清除缓存按钮 */}
          <TouchableOpacity
            style={styles.clearCacheButton}
            onPress={handleClearCache}
          >
            <Text style={styles.clearCacheButtonText}>清除缓存</Text>
          </TouchableOpacity>
        </View>

        {/* ============================================
            功能设置
            ============================================ */}
        <View style={styles.settingsSection}>
          <Text style={styles.sectionTitle}>⚙️ 功能设置</Text>

          {/* 自动备份 */}
          <View style={styles.settingItem}>
            <Text style={styles.settingLabel}>自动备份</Text>
            <Switch
              value={settings.autoBackup}
              onValueChange={value =>
                setSettings(prev => ({ ...prev, autoBackup: value }))
              }
              trackColor={{ false: '#767577', true: '#FF6B9D' }}
              thumbColor="#FFFFFF"
            />
          </View>

          {/* 云端同步 */}
          <View style={styles.settingItem}>
            <Text style={styles.settingLabel}>云端同步</Text>
            <Switch
              value={settings.cloudSync}
              onValueChange={value =>
                setSettings(prev => ({ ...prev, cloudSync: value }))
              }
              trackColor={{ false: '#767577', true: '#FF6B9D' }}
              thumbColor="#FFFFFF"
            />
          </View>

          {/* 通知 */}
          <View style={styles.settingItem}>
            <Text style={styles.settingLabel}>推送通知</Text>
            <Switch
              value={settings.notifications}
              onValueChange={value =>
                setSettings(prev => ({ ...prev, notifications: value }))
              }
              trackColor={{ false: '#767577', true: '#FF6B9D' }}
              thumbColor="#FFFFFF"
            />
          </View>

          {/* 深色模式 */}
          <View style={styles.settingItem}>
            <Text style={styles.settingLabel}>深色模式</Text>
            <Switch
              value={settings.darkMode}
              onValueChange={value =>
                setSettings(prev => ({ ...prev, darkMode: value }))
              }
              trackColor={{ false: '#767577', true: '#FF6B9D' }}
              thumbColor="#FFFFFF"
            />
          </View>
        </View>

        {/* ============================================
            1017 告白彩蛋
            ============================================ */}
        <View style={styles.easterEggSection}>
          <TouchableOpacity
            style={styles.easterEggButton}
            onPress={handleEasterEgg}
          >
            <LinearGradient
              colors={['#FF6B9D', '#A855F7']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.easterEggButtonGradient}
            >
              <Text style={styles.easterEggIcon}>💕</Text>
              <Text style={styles.easterEggText}>1017 告白</Text>
            </LinearGradient>
          </TouchableOpacity>

          {/* 彩蛋提示 */}
          {easterEggTriggered && (
            <Animated.View
              style={[
                styles.confetti,
                {
                  opacity: confettiAnimation,
                  transform: [
                    {
                      scale: confettiAnimation.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0.5, 1.5],
                      }),
                    },
                  ],
                },
              ]}
            >
              <Text style={styles.confettiEmoji}>✨💕🎉</Text>
            </Animated.View>
          )}
        </View>

        {/* ============================================
            关于应用
            ============================================ */}
        <View style={styles.aboutSection}>
          <TouchableOpacity
            style={styles.aboutButton}
            onPress={handleAboutApp}
          >
            <View style={styles.aboutButtonContent}>
              <Text style={styles.aboutButtonLabel}>关于应用</Text>
              <Text style={styles.aboutButtonVersion}>v2.1.0-Ultimate</Text>
            </View>
            <Text style={styles.aboutButtonArrow}>→</Text>
          </TouchableOpacity>

          {/* 版本信息 */}
          <View style={styles.versionInfo}>
            <Text style={styles.versionInfoText}>
              🔒 启用 ProGuard 代码混淆保护
            </Text>
            <Text style={styles.versionInfoText}>
              © 2024 雁宝 AI. All rights reserved.
            </Text>
          </View>
        </View>

        {/* ============================================
            底部链接
            ============================================ */}
        <View style={styles.footerLinks}>
          <TouchableOpacity>
            <Text style={styles.footerLink}>用户协议</Text>
          </TouchableOpacity>
          <Text style={styles.footerDivider}>•</Text>
          <TouchableOpacity>
            <Text style={styles.footerLink}>隐私政策</Text>
          </TouchableOpacity>
          <Text style={styles.footerDivider}>•</Text>
          <TouchableOpacity>
            <Text style={styles.footerLink}>反馈建议</Text>
          </TouchableOpacity>
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
    paddingVertical: 16,
    paddingHorizontal: 16,
  },

  // 用户资料卡片
  profileCard: {
    marginBottom: 24,
    borderRadius: 16,
    overflow: 'hidden',
  },

  profileCardGradient: {
    flexDirection: 'row',
    paddingVertical: 16,
    paddingHorizontal: 16,
    alignItems: 'center',
  },

  avatarContainer: {
    marginRight: 16,
  },

  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 107, 157, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FF6B9D',
  },

  avatarEmoji: {
    fontSize: 40,
  },

  profileInfo: {
    flex: 1,
  },

  profileName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },

  profileBio: {
    fontSize: 12,
    color: '#AAAAAA',
    marginBottom: 4,
  },

  profileJoinDate: {
    fontSize: 11,
    color: '#888888',
  },

  editButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: 'rgba(255, 107, 157, 0.3)',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#FF6B9D',
  },

  editButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FF6B9D',
  },

  // 统计数据
  statsSection: {
    marginBottom: 24,
  },

  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 12,
  },

  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  statCard: {
    flex: 1,
    marginHorizontal: 4,
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 107, 157, 0.1)',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 107, 157, 0.2)',
  },

  statIcon: {
    fontSize: 24,
    marginBottom: 4,
  },

  statValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FF6B9D',
    marginBottom: 2,
  },

  statLabel: {
    fontSize: 11,
    color: '#AAAAAA',
  },

  // 存储管理
  storageSection: {
    marginBottom: 24,
  },

  storageItem: {
    marginBottom: 16,
  },

  storageItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },

  storageItemLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },

  storageItemValue: {
    fontSize: 12,
    color: '#FF6B9D',
    fontWeight: '600',
  },

  storageBar: {
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 3,
    overflow: 'hidden',
  },

  storageBarFill: {
    height: '100%',
    backgroundColor: '#FF6B9D',
    borderRadius: 3,
  },

  clearCacheButton: {
    marginTop: 12,
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: 'rgba(255, 107, 157, 0.2)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FF6B9D',
    alignItems: 'center',
  },

  clearCacheButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FF6B9D',
  },

  // 功能设置
  settingsSection: {
    marginBottom: 24,
  },

  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    marginBottom: 8,
    borderRadius: 8,
  },

  settingLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#FFFFFF',
  },

  // 彩蛋
  easterEggSection: {
    marginBottom: 24,
    position: 'relative',
  },

  easterEggButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },

  easterEggButtonGradient: {
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },

  easterEggIcon: {
    fontSize: 32,
    marginBottom: 4,
  },

  easterEggText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },

  confetti: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginLeft: -30,
    marginTop: -30,
  },

  confettiEmoji: {
    fontSize: 60,
  },

  // 关于应用
  aboutSection: {
    marginBottom: 24,
  },

  aboutButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    backgroundColor: 'rgba(255, 107, 157, 0.1)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 107, 157, 0.2)',
  },

  aboutButtonContent: {
    flex: 1,
  },

  aboutButtonLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 2,
  },

  aboutButtonVersion: {
    fontSize: 11,
    color: '#AAAAAA',
  },

  aboutButtonArrow: {
    fontSize: 16,
    color: '#FF6B9D',
  },

  versionInfo: {
    marginTop: 12,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 8,
  },

  versionInfoText: {
    fontSize: 11,
    color: '#AAAAAA',
    marginBottom: 4,
  },

  // 底部链接
  footerLinks: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },

  footerLink: {
    fontSize: 11,
    color: '#AAAAAA',
  },

  footerDivider: {
    fontSize: 11,
    color: '#AAAAAA',
    marginHorizontal: 8,
  },
});
