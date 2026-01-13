/**
 * 設定頁面 - 庫洛米沉浸式 UI
 * Settings Page - Kuromi Immersive UI
 * 
 * 功能：
 * - 賬號同步狀態
 * - 雁寶記憶管理
 * - 存儲統計
 * - 應用設置
 */

import React, { useState, useCallback, useEffect } from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  Text,
  StyleSheet,
  Switch,
  Alert,
  Animated,
  Image,
} from 'react-native';
import {
  Settings,
  User,
  Heart,
  HardDrive,
  Bell,
  Lock,
  Info,
  LogOut,
  Trash2,
  Cloud,
  Zap,
} from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { MemoryStatistics } from '../lib/types/memory';

interface SettingsOptimizedProps {
  userId?: string;
  onLogout?: () => void;
  memoryStats?: MemoryStatistics;
  onClearMemories?: () => Promise<void>;
}

/**
 * 設定項組件
 */
interface SettingItemProps {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  value?: string | boolean;
  onPress?: () => void;
  isToggle?: boolean;
  onToggle?: (value: boolean) => void;
}

const SettingItem: React.FC<SettingItemProps> = ({
  icon,
  title,
  subtitle,
  value,
  onPress,
  isToggle,
  onToggle,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const handlePress = useCallback(async () => {
    if (isToggle && onToggle) {
      setIsLoading(true);
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      onToggle(typeof value === 'boolean' ? !value : false);
      setIsLoading(false);
    } else if (onPress) {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      onPress();
    }
  }, [isToggle, value, onToggle, onPress]);

  return (
    <TouchableOpacity
      style={styles.settingItem}
      onPress={handlePress}
      disabled={isLoading}
      activeOpacity={0.7}
    >
      <View style={styles.settingIcon}>{icon}</View>

      <View style={styles.settingContent}>
        <Text style={styles.settingTitle}>{title}</Text>
        {subtitle && <Text style={styles.settingSubtitle}>{subtitle}</Text>}
      </View>

      <View style={styles.settingValue}>
        {isToggle ? (
          <Switch
            value={typeof value === 'boolean' ? value : false}
            onValueChange={onToggle}
            trackColor={{ false: '#444444', true: '#FF6B9D' }}
            thumbColor={typeof value === 'boolean' && value ? '#FFFFFF' : '#CCCCCC'}
          />
        ) : (
          <Text style={styles.settingValueText}>{value}</Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

/**
 * 統計卡片組件
 */
interface StatCardProps {
  icon: React.ReactNode;
  title: string;
  value: string;
  unit?: string;
  color?: string;
}

const StatCard: React.FC<StatCardProps> = ({
  icon,
  title,
  value,
  unit,
  color = '#FF6B9D',
}) => {
  return (
    <View style={[styles.statCard, { borderColor: color }]}>
      <View style={[styles.statIcon, { backgroundColor: `${color}20` }]}>
        {icon}
      </View>
      <View style={styles.statContent}>
        <Text style={styles.statTitle}>{title}</Text>
        <Text style={styles.statValue}>
          {value}
          {unit && <Text style={styles.statUnit}> {unit}</Text>}
        </Text>
      </View>
    </View>
  );
};

/**
 * 設定頁面
 */
export const SettingsOptimized: React.FC<SettingsOptimizedProps> = ({
  userId = 'KuromiQueen',
  onLogout,
  memoryStats,
  onClearMemories,
}) => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [autoSyncEnabled, setAutoSyncEnabled] = useState(true);
  const [privacyMode, setPrivacyMode] = useState(false);
  const [syncStatus, setSyncStatus] = useState<'synced' | 'syncing' | 'offline'>(
    'synced'
  );

  // 計算存儲百分比
  const storagePercentage = memoryStats
    ? Math.round((memoryStats.storageUsed / memoryStats.storageQuota) * 100)
    : 0;

  // 格式化存儲大小
  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  const handleClearMemories = useCallback(() => {
    Alert.alert(
      '清除所有記憶',
      '確定要清除所有已保存的記憶嗎？此操作無法撤銷。',
      [
        { text: '取消', onPress: () => {} },
        {
          text: '清除',
          onPress: async () => {
            await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
            if (onClearMemories) {
              await onClearMemories();
            }
            Alert.alert('✓ 已清除', '所有記憶已清除');
          },
          style: 'destructive',
        },
      ]
    );
  }, [onClearMemories]);

  const handleLogout = useCallback(() => {
    Alert.alert(
      '登出',
      '確定要登出嗎？',
      [
        { text: '取消', onPress: () => {} },
        {
          text: '登出',
          onPress: async () => {
            await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
            if (onLogout) {
              onLogout();
            }
          },
          style: 'destructive',
        },
      ]
    );
  }, [onLogout]);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      {/* 頭部背景 */}
      <View style={styles.headerBackground} />

      {/* 用戶信息卡片 */}
      <View style={styles.userCard}>
        <View style={styles.userAvatar}>
          <Text style={styles.avatarText}>🖤</Text>
        </View>
        <View style={styles.userInfo}>
          <Text style={styles.userName}>{userId}</Text>
          <Text style={styles.userStatus}>
            {syncStatus === 'synced' && '✓ 已同步'}
            {syncStatus === 'syncing' && '⟳ 同步中...'}
            {syncStatus === 'offline' && '⊘ 離線'}
          </Text>
        </View>
        <View style={styles.syncBadge}>
          <Cloud
            size={20}
            color={
              syncStatus === 'synced'
                ? '#4CAF50'
                : syncStatus === 'syncing'
                ? '#FF9800'
                : '#999999'
            }
            strokeWidth={2}
          />
        </View>
      </View>

      {/* 統計信息 */}
      {memoryStats && (
        <View style={styles.statsSection}>
          <Text style={styles.sectionTitle}>📊 統計信息</Text>
          <View style={styles.statsGrid}>
            <StatCard
              icon={<Heart size={24} color="#FF6B9D" strokeWidth={2} />}
              title="已保存記憶"
              value={memoryStats.totalMemories.toString()}
              color="#FF6B9D"
            />
            <StatCard
              icon={<Zap size={24} color="#FFD700" strokeWidth={2} />}
              title="使用次數"
              value={memoryStats.totalUsage.toString()}
              color="#FFD700"
            />
            <StatCard
              icon={<HardDrive size={24} color="#A855F7" strokeWidth={2} />}
              title="存儲已用"
              value={formatBytes(memoryStats.storageUsed)}
              color="#A855F7"
            />
            <StatCard
              icon={<Heart size={24} color="#FF1493" strokeWidth={2} />}
              title="收藏記憶"
              value={memoryStats.favoriteCount.toString()}
              color="#FF1493"
            />
          </View>
        </View>
      )}

      {/* 存儲進度 */}
      {memoryStats && (
        <View style={styles.storageSection}>
          <View style={styles.storageHeader}>
            <Text style={styles.sectionTitle}>💾 存儲空間</Text>
            <Text style={styles.storagePercent}>{storagePercentage}%</Text>
          </View>
          <View style={styles.storageBar}>
            <View
              style={[
                styles.storageProgress,
                {
                  width: `${storagePercentage}%`,
                  backgroundColor:
                    storagePercentage > 80
                      ? '#FF6B9D'
                      : storagePercentage > 50
                      ? '#FFD700'
                      : '#4CAF50',
                },
              ]}
            />
          </View>
          <View style={styles.storageInfo}>
            <Text style={styles.storageText}>
              已用 {formatBytes(memoryStats.storageUsed)} / {formatBytes(memoryStats.storageQuota)}
            </Text>
          </View>
        </View>
      )}

      {/* 雁寶記憶管理 */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>✨ 雁寶記憶管理</Text>
        <SettingItem
          icon={<Heart size={20} color="#FF6B9D" strokeWidth={2} />}
          title="記憶庫"
          subtitle="查看和管理所有保存的記憶"
          value="→"
          onPress={() => {
            Alert.alert('記憶庫', '共有 ' + (memoryStats?.totalMemories || 0) + ' 個記憶');
          }}
        />
        <SettingItem
          icon={<Trash2 size={20} color="#FF6B9D" strokeWidth={2} />}
          title="清除所有記憶"
          subtitle="刪除所有已保存的風格參數"
          onPress={handleClearMemories}
        />
      </View>

      {/* 應用設置 */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>⚙️ 應用設置</Text>
        <SettingItem
          icon={<Bell size={20} color="#FFD700" strokeWidth={2} />}
          title="通知"
          subtitle="接收應用通知和提醒"
          value={notificationsEnabled}
          isToggle
          onToggle={setNotificationsEnabled}
        />
        <SettingItem
          icon={<Cloud size={20} color="#A855F7" strokeWidth={2} />}
          title="自動同步"
          subtitle="自動同步記憶到雲端"
          value={autoSyncEnabled}
          isToggle
          onToggle={setAutoSyncEnabled}
        />
        <SettingItem
          icon={<Lock size={20} color="#FF6B9D" strokeWidth={2} />}
          title="隱私模式"
          subtitle="隱藏敏感信息"
          value={privacyMode}
          isToggle
          onToggle={setPrivacyMode}
        />
      </View>

      {/* 關於應用 */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>ℹ️ 關於應用</Text>
        <SettingItem
          icon={<Info size={20} color="#4CAF50" strokeWidth={2} />}
          title="版本信息"
          subtitle="yanbao AI v2.2.0 Production"
          value="→"
          onPress={() => {
            Alert.alert(
              '版本信息',
              'yanbao AI v2.2.0 Production\n\n© 2024 YanBao Inc.\n所有權利保留。'
            );
          }}
        />
        <SettingItem
          icon={<Info size={20} color="#4CAF50" strokeWidth={2} />}
          title="隱私政策"
          subtitle="查看隱私政策和條款"
          value="→"
          onPress={() => {
            Alert.alert('隱私政策', '我們重視您的隱私。');
          }}
        />
      </View>

      {/* 登出按鈕 */}
      <TouchableOpacity
        style={styles.logoutButton}
        onPress={handleLogout}
        activeOpacity={0.8}
      >
        <LogOut size={20} color="#FFFFFF" strokeWidth={2} />
        <Text style={styles.logoutButtonText}>登出</Text>
      </TouchableOpacity>

      {/* 底部間距 */}
      <View style={styles.bottomSpacer} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  // 容器
  container: {
    flex: 1,
    backgroundColor: '#0A0A0A',
  },
  contentContainer: {
    paddingBottom: 32,
  },

  // 頭部背景
  headerBackground: {
    height: 120,
    backgroundColor: 'linear-gradient(135deg, #6A0DAD 0%, #FF6B9D 100%)',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },

  // 用戶卡片
  userCard: {
    marginHorizontal: 16,
    marginTop: -60,
    marginBottom: 24,
    backgroundColor: '#1A1A1A',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#FF6B9D',
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#FF6B9D',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  userAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255, 107, 157, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    borderWidth: 2,
    borderColor: '#FF6B9D',
  },
  avatarText: {
    fontSize: 32,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  userStatus: {
    fontSize: 12,
    color: '#4CAF50',
    fontWeight: '600',
  },
  syncBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 107, 157, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FF6B9D',
  },

  // 統計部分
  statsSection: {
    marginHorizontal: 16,
    marginBottom: 24,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statCard: {
    flex: 1,
    minWidth: '48%',
    backgroundColor: '#1A1A1A',
    borderRadius: 12,
    borderWidth: 1,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statContent: {
    flex: 1,
  },
  statTitle: {
    fontSize: 11,
    color: '#CCCCCC',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  statUnit: {
    fontSize: 10,
    color: '#999999',
    fontWeight: '400',
  },

  // 存儲部分
  storageSection: {
    marginHorizontal: 16,
    marginBottom: 24,
    backgroundColor: '#1A1A1A',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FF6B9D',
    padding: 16,
  },
  storageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  storagePercent: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FF6B9D',
  },
  storageBar: {
    height: 8,
    backgroundColor: 'rgba(255, 107, 157, 0.1)',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  storageProgress: {
    height: '100%',
    borderRadius: 4,
  },
  storageInfo: {
    alignItems: 'center',
  },
  storageText: {
    fontSize: 11,
    color: '#CCCCCC',
  },

  // 分組
  section: {
    marginHorizontal: 16,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 12,
  },

  // 設定項
  settingItem: {
    backgroundColor: '#1A1A1A',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#333333',
    padding: 12,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingIcon: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 107, 157, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: 11,
    color: '#999999',
  },
  settingValue: {
    alignItems: 'flex-end',
  },
  settingValueText: {
    fontSize: 14,
    color: '#FF6B9D',
    fontWeight: '600',
  },

  // 登出按鈕
  logoutButton: {
    marginHorizontal: 16,
    marginBottom: 16,
    backgroundColor: '#FF6B9D',
    borderRadius: 12,
    paddingVertical: 14,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  logoutButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  // 底部間距
  bottomSpacer: {
    height: 16,
  },
});
